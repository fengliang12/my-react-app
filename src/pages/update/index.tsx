import "./index.less";

import { Image, Input, Picker, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useAsyncEffect, useMemoizedFn, useSetState } from "ahooks";
import dayjs from "dayjs";
import { useState } from "react";
import { useSelector } from "react-redux";

import { P1, P6 } from "@/assets/image/index";
import Page from "@/components/Page";
import api from "@/src/api";
import Avatar from "@/src/components/Common/Avatar";
import GetPhoneNumber from "@/src/components/Common/GetPhoneNumber";
import MultiplePicker from "@/src/components/Common/MultiplePicker";
import { formatDateTime } from "@/src/utils";

const app = Taro.getApp();

const genderArr = ["女", "男"];

const Index = () => {
  const isMember = useSelector((state: Store.States) => state.user.isMember);
  const [counterList, setCounterList] = useState<any>([]);
  const [user, setUser] = useSetState<any>({
    nickName: "",
    birthDate: "",
    withSmsCode: false,
    gender: "",
    mobile: "",
    avatarUrl: "",
    shopType: "",
    city: "",
    district: "",
  });

  /**
   * 用户信息反显
   */
  useAsyncEffect(async () => {
    if (isMember) {
      const userInfo = await app.init();
      let { realName, birthDate, gender } = userInfo.customerBasicInfo;
      birthDate = formatDateTime(birthDate);
      let genderName = "";
      if (gender === 1) {
        genderName = "男";
      }
      if (gender === 2) {
        genderName = "女";
      }
      setUser({
        ...userInfo.customerBasicInfo,
        nickName: realName === "微信用户" ? "" : realName,
        gender: genderName,
        birthDate: birthDate,
      });
    }
    getCounterList();
  }, [isMember]);

  /**
   * 获取门店列表
   */
  const getCounterList = useMemoizedFn(async () => {
    let res = await api.counter.getCounterList();
    let list = res?.data.map((item: any) => ({
      ...item.district,
      ...item.detailInfo,
      id: item.id,
    }));
    setCounterList(list);
  });

  /**
   * 提交注册
   */
  const submit = useMemoizedFn(async () => {
    const { nickName, avatarUrl, mobile, gender, city } = user;
    if (!avatarUrl) {
      return Taro.showToast({ title: "请上传用户头像", icon: "none" });
    }
    if (!nickName) {
      return Taro.showToast({ title: "请输入姓名", icon: "none" });
    }
    if (!mobile) {
      return Taro.showToast({ title: "请授权手机号", icon: "none" });
    }
    if (!gender) {
      return Taro.showToast({ title: "请选择性别", icon: "none" });
    }
    if (!city) {
      return Taro.showToast({ title: "请选择城市", icon: "none" });
    }
    appendMember();
  });

  /**
   * 更新会员
   */
  const appendMember = useMemoizedFn(async () => {
    let { nickName, gender, mobile, avatarUrl, city, province, district } =
      user;
    Taro.showLoading({ title: "加载中", mask: true });
    const { status } = await api.user.appendMember({
      avatarUrl: avatarUrl,
      gender: gender === "男" ? 1 : 2,
      nickName: nickName,
      city,
      province,
      mobile,
      district,
    });
    Taro.hideLoading();
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

  return (
    <>
      <Page
        isNeedBind={false}
        navConfig={{
          title: "完善信息",
          fill: false,
          backgroundColor: "black",
          titleColor: "#FFFFFF",
          back: true,
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
                    <Image src={P6} mode="widthFix" className="btm" />
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
                    <Image src={P6} mode="widthFix" className="btm" />
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
                    setUser({ city: counter.city });
                  }}
                >
                  <View className="birthDate">
                    <View className="ipt-placeholder">
                      {user.city ? user.city : "请选择"}
                    </View>
                    <Image src={P6} mode="widthFix" className="btm" />
                  </View>
                </MultiplePicker>
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
                  </View>
                </Picker>
              </View>
            </View>
            <View className="item">
              <View className="left">地址信息</View>
              <View className="right">
                <Input
                  className="right-input"
                  placeholder="请输入"
                  placeholderClass="ipt-placeholder"
                  value={user.district}
                  onInput={(e) => {
                    setUser({
                      district: e.detail.value,
                    });
                  }}
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
