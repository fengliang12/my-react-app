import "./index.less";

import {
  Button,
  Image,
  Input,
  Picker,
  Text,
  Textarea,
  View,
} from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useAsyncEffect, useMemoizedFn, useSetState } from "ahooks";
import dayjs from "dayjs";
import { omit } from "lodash-es";
import { useSelector } from "react-redux";

import { Bg2, Ck1, Ck2, P1, P2 } from "@/assets/image/index";
import Page from "@/components/Page";
import config from "@/config/index";
import api from "@/src/api";

const app = Taro.getApp();

const genderArr = ["女", "男"];

const Index = () => {
  const isMember = useSelector((state: Store.States) => state.user.isMember);
  const [user, setUser] = useSetState<any>({
    nickName: "",
    birthDate: "",
    withSmsCode: false,
    gender: "",
    mobile: "",
    avatarUrl: "",
    concealUrl: "/pages/bind/index",
    ck1: false,
    ck2: false,
    shopType: "",
  });
  useAsyncEffect(async () => {
    await app.init();
  }, []);

  const getPhoneNumber = useMemoizedFn(async (e) => {
    const { errMsg, code, encryptedData, iv } = e.detail;
    if (errMsg === "getPhoneNumber:ok") {
      const { data, status } = await api.user.decodePhoneNumber(
        {
          encryptedData,
          iv,
          code,
        },
        {
          isCreateUser: false,
        },
      );
      if (status === 200) {
        setUser({
          mobile: data,
        });
      }
    }
  });
  const uploadAvatarUrl = useMemoizedFn(async () => {
    const { data } = await api.common.upLoadFile({ filePath: user.avatarUrl });
    return config.cosImgPrefix + data;
  });
  const toOther = useMemoizedFn((e, code) => {
    e.stopPropagation?.();
    app.to(`/pages/text/index?code=${code}`);
  });
  const submit = useMemoizedFn(async () => {
    const { nickName, birthDate, avatarUrl, mobile, gender, ck1, ck2 } = user;
    if (!nickName) {
      return Taro.showToast({ title: "请输入姓名", icon: "none" });
    }
    if (!mobile) {
      return Taro.showToast({ title: "请授权手机号", icon: "none" });
    }
    if (!birthDate) {
      return Taro.showToast({ title: "请选择生日", icon: "none" });
    }
    if (!gender) {
      return Taro.showToast({ title: "请选择性别", icon: "none" });
    }
    if (!ck1) {
      return Taro.showToast({ title: "请同意会员章程", icon: "none" });
    }
    if (!ck2) {
      return Taro.showToast({ title: "请同意个人信息处理规则", icon: "none" });
    }
    let newAvatarUrl = avatarUrl;
    if (newAvatarUrl && newAvatarUrl.indexOf(config.cosImgPrefix) === -1) {
      newAvatarUrl = await uploadAvatarUrl();
    }
    if (!isMember) {
      createMember(newAvatarUrl);
    } else {
      updateMember(newAvatarUrl);
    }
  });
  const createMember = useMemoizedFn(async (newAvatarUrl) => {
    const { status } = await api.user.createMember({
      ...user,
      avatarUrl: newAvatarUrl,
      gender: user.gender === "男" ? 1 : 2,
      realName: user.nickName,
      registerChannel: user.shopType,
      customerCounter: {
        counterId: app.globalData.counterCode,
      },
    });
    if (status === 200) {
      await app.init(true);
      Taro.showToast({
        title: "注册成功！",
        mask: true,
      });
      setTimeout(async () => {
        app.to(1);
      }, 2000);
    }
  });
  const updateMember = useMemoizedFn(async (newAvatarUrl) => {
    const { status } = await api.user.updateMember({
      ...omit(user, ["mobile"]),
      avatarUrl: newAvatarUrl,
      gender: user.gender === "男" ? 1 : 2,
      realName: user.nickName,
    });
    if (status === 200) {
      await app.init(true);
      Taro.showToast({
        title: "更新成功！",
        mask: true,
      });
      setTimeout(async () => {
        app.to(1);
      }, 2000);
    }
  });

  useAsyncEffect(async () => {
    if (isMember) {
      const { name, birthDate, mobile, avatarUrl, gender } =
        app.getMemberInfo();
      let genderName = user.gender;
      if (gender === 1) {
        genderName = "男";
      }
      if (gender === 2) {
        genderName = "女";
      }
      setUser({
        nickName: name === "微信用户" ? "" : name,
        birthDate,
        mobile,
        gender: genderName,
        avatarUrl,
      });
    }
  }, [isMember]);

  return (
    <>
      <Page
        isNeedBind={false}
        navConfig={{
          placeholder: false,
          backgroundColor: "black",
          logo: "white",
        }}
      >
        <View className="bind">
          <View className="bind-top">
            <View className="head">
              <Image
                src={user.avatarUrl || P1}
                className="img"
                mode="widthFix"
              />
              <Button
                className="btn-no btn"
                openType="chooseAvatar"
                onChooseAvatar={(e) =>
                  setUser({
                    avatarUrl: e.detail.avatarUrl,
                  })
                }
              ></Button>
              <View>上传头像</View>
            </View>
            <View className="item">
              <View className="left">姓名*</View>
              <View className="right">
                <Input
                  type="nickname"
                  className="right-input"
                  placeholder="请输入"
                  placeholderClass="ipt-placeholder"
                  value={user.nickName}
                  onInput={(e) =>
                    setUser({
                      nickName: e.detail.value,
                    })
                  }
                />
              </View>
            </View>
            <View className="item">
              <View className="left">手机号*</View>
              <View className="right">
                {!user.mobile && <View className="mobile-auth">一键获取</View>}
                {user.mobile}
                {!isMember && (
                  <Button
                    className="btn-no btn-mobile"
                    openType="getPhoneNumber"
                    onGetPhoneNumber={getPhoneNumber}
                  />
                )}
              </View>
            </View>
            <View className="item">
              <View className="left">生日*</View>
              <View className="right">
                <Picker
                  mode="date"
                  disabled={!(!isMember || !user.birthDate)}
                  value={user.birthDate}
                  onChange={(e) => setUser({ birthDate: e.detail.value })}
                  end={dayjs().subtract(14, "year").format("YYYY-MM-DD")}
                >
                  <View className="birthDate">
                    {!user.birthDate && (
                      <View className="txt">生日信息一经确认，无法修改</View>
                    )}
                    {user.birthDate}
                    <Image src={P2} mode="widthFix" className="btm" />
                  </View>
                </Picker>
              </View>
            </View>
            <View className="item">
              <View className="left">性别*</View>
              <View className="right">
                <Picker
                  mode="selector"
                  range={genderArr}
                  onChange={(e) => {
                    setUser({ gender: genderArr[e.detail.value] });
                  }}
                >
                  <View className="birthDate">
                    {!user.gender && (
                      <View className="ipt-placeholder">请选择</View>
                    )}
                    {user.gender}
                    <Image src={P2} mode="widthFix" className="btm" />
                  </View>
                </Picker>
              </View>
            </View>
            <View className="item">
              <View className="left">所在城市*</View>
              <View className="right">
                <Picker
                  mode="selector"
                  range={genderArr}
                  onChange={(e) => {
                    setUser({ gender: genderArr[e.detail.value] });
                  }}
                >
                  <View className="birthDate">
                    {!user.gender && (
                      <View className="ipt-placeholder">请选择</View>
                    )}
                    {user.gender}
                    <Image src={P2} mode="widthFix" className="btm" />
                  </View>
                </Picker>
              </View>
            </View>
            <View className="counter-tip">
              *此柜台将作为会员权益服务柜台，您的礼遇将默认发放至此柜台，请慎重修改
            </View>
            <View className="item">
              <View className="left">所属店铺</View>
              <View className="right">
                <Picker
                  mode="selector"
                  range={genderArr}
                  onChange={(e) => {
                    setUser({ gender: genderArr[e.detail.value] });
                  }}
                >
                  <View className="birthDate">
                    {!user.gender && (
                      <View className="ipt-placeholder">请选择</View>
                    )}
                    {user.gender}
                    <Image src={P2} mode="widthFix" className="btm" />
                  </View>
                </Picker>
              </View>
            </View>
            <View className="item">
              <View className="left">地址信息</View>
              <View className="right">
                <Textarea
                  className="textarea-input"
                  placeholder="请输入"
                  placeholderClass="ipt-placeholder"
                  value={user.nickName}
                  onInput={(e) =>
                    setUser({
                      nickName: e.detail.value,
                    })
                  }
                />
              </View>
            </View>
            <View className="bind-bottom">
              *如果您想更改手机号及生日信息，请致电客服
              中心400-820-2573，生日仅可修改1次
            </View>
            <View className="submit" onClick={submit}>
              {isMember ? "完善信息" : "提交注册"}
            </View>
          </View>
        </View>
      </Page>
    </>
  );
};

export default Index;
