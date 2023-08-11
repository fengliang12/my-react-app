import "./index.less";

import { Image, Input, Picker, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useAsyncEffect, useMemoizedFn, useSetState } from "ahooks";
import dayjs from "dayjs";
import { omit } from "lodash-es";
import { useState } from "react";
import { useSelector } from "react-redux";

import { P1, P2 } from "@/assets/image/index";
import Page from "@/components/Page";
import api from "@/src/api";
import Avatar from "@/src/components/Common/Avatar";
import GetPhoneNumber from "@/src/components/Common/GetPhoneNumber";
import MultiplePicker from "@/src/components/Common/MultiplePicker";
import PrivacyPolicyText from "@/src/components/Common/PrivacyPolicyText";
import { formatDateTime } from "@/src/utils";

import { counterList } from "./testData";

const app = Taro.getApp();

const genderArr = ["女", "男"];

const Index = () => {
  const isMember = useSelector((state: Store.States) => state.user.isMember);
  const [selectCounter, setSelectCounter] = useState<any>();
  const [agree, setAgree] = useState<boolean>(false);
  const [user, setUser] = useSetState<any>({
    nickName: "",
    birthDate: "",
    withSmsCode: false,
    gender: "",
    mobile: "",
    avatarUrl: "",
    shopType: "",
    cityCode: "",
    storeCode: "",
    address: "",
  });
  useAsyncEffect(async () => {
    await app.init();
  }, []);

  /**
   * 提交注册
   */
  const submit = useMemoizedFn(async () => {
    const { nickName, birthDate, avatarUrl, mobile, gender } = user;
    if (!agree) {
      return Taro.showToast({ title: "请先同意隐私条款", icon: "none" });
    }
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

    let newAvatarUrl = avatarUrl;

    if (!isMember) {
      createMember(newAvatarUrl);
    } else {
      updateMember(newAvatarUrl);
    }
  });

  /**
   * 创建会员
   */
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

  /**
   * 更新会员
   */
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
      const { realName, birthDate, mobile, avatarUrl, gender } =
        app.globalData?.userInfo?.customerBasicInfo || {};

      let genderName = user.gender;
      if (gender === 1) {
        genderName = "男";
      }
      if (gender === 2) {
        genderName = "女";
      }
      setUser({
        nickName: realName === "微信用户" ? "" : realName,
        birthDate: formatDateTime(birthDate, 3),
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
          title: "MY NARS",
        }}
      >
        <View className="bind">
          <View className="bind-top">
            <View className="text-white text-center text-36 mb-50">
              欢迎加入NARS会员
            </View>
            <View className="head">
              <Image
                src={user.avatarUrl || P1}
                className="img"
                mode="widthFix"
              />
              <Avatar
                callback={(avatarUrl) =>
                  setUser({
                    avatarUrl: avatarUrl,
                  })
                }
              ></Avatar>
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
                  <GetPhoneNumber
                    callback={(mobile) =>
                      setUser({
                        mobile: mobile,
                      })
                    }
                  ></GetPhoneNumber>
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
                <MultiplePicker
                  cascadeCount={2}
                  isCascadeData={false}
                  pickerData={counterList}
                  customKeyList={["province", "city"]}
                  callback={(counter) => {
                    setSelectCounter(counter);
                    setUser({ counterId: counter.code });
                  }}
                >
                  <View className="birthDate">
                    <View className="ipt-placeholder">
                      {selectCounter ? selectCounter.city : "请选择"}
                    </View>
                    <Image src={P2} mode="widthFix" className="btm" />
                  </View>
                </MultiplePicker>
              </View>
            </View>
            <PrivacyPolicyText
              callback={setAgree}
              checkColor="#ffffff"
              style="color:#ffffff;font-size:22rpx;margin-top:180rpx"
            ></PrivacyPolicyText>
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
