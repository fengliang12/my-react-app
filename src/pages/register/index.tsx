import "./index.less";

import { Image, Input, Picker, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useAsyncEffect, useBoolean, useMemoizedFn, useSetState } from "ahooks";
import dayjs from "dayjs";
import { useState } from "react";
import { useSelector } from "react-redux";

import { P1, P6 } from "@/assets/image/index";
import Page from "@/components/Page";
import api from "@/src/api";
import Avatar from "@/src/components/Common/Avatar";
import GetPhoneNumber from "@/src/components/Common/GetPhoneNumber";
import MultiplePicker from "@/src/components/Common/MultiplePicker";
import PrivacyPolicyText from "@/src/components/Common/PrivacyPolicyText";
import config from "@/src/config";
import { formatDateTime, isPhone } from "@/src/utils";
import subscribeMsg from "@/src/utils/subscribeMsg";

const app: App.GlobalData = Taro.getApp();
const genderArr = ["女", "男"];
const Index = () => {
  const isMember = useSelector((state: Store.States) => state.user.isMember);
  const [selectCounter, setSelectCounter] = useState<any>();
  const [inputMobileType, { setTrue }] = useBoolean(false);
  const [cityList, setCityList] = useState<any>([]);
  const [agree, setAgree] = useState<boolean>(false);
  const [user, setUser] = useSetState<any>({
    avatarUrl: "",
    nickName: "",
    mobile: "",
    birthDate: "",
    gender: "",
    city: "",
    withSmsCode: false,
    shopType: "wa",
  });

  /**
   * 用户信息反显
   */
  useAsyncEffect(async () => {
    if (isMember) {
      const userInfo = await app.init();
      const { realName, birthDate, mobile, avatarUrl, gender, city } = userInfo;

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
        city,
      });
    }
    getCityList();
  }, [isMember]);

  /**
   * 获取城市列表
   */
  const getCityList = useMemoizedFn(async () => {
    let res = await api.counter.getCounterList();
    let list = res?.data.map((item: any) => ({
      ...item.address,
      ...item.detailInfo,
      id: item.id,
    }));
    setCityList(list);
  });

  /**
   * 同意隐私条款，回调订阅消息
   */
  const PrivacyPolicy = useMemoizedFn(async () => {
    await subscribeMsg(config.subscribeList.register);
    setAgree(true);
  });

  /**
   * 提交注册
   */
  const submit = useMemoizedFn(async () => {
    const { nickName, birthDate, avatarUrl, mobile, gender, city } = user;
    if (!avatarUrl) {
      return Taro.showToast({ title: "请先上传头像", icon: "none" });
    }
    if (!agree) {
      return Taro.showToast({ title: "请先同意隐私条款", icon: "none" });
    }
    if (!nickName) {
      return Taro.showToast({ title: "请输入姓名", icon: "none" });
    }
    if (!mobile || !isPhone(mobile)) {
      return Taro.showToast({ title: "请输入正确的手机号", icon: "none" });
    }
    if (!birthDate) {
      return Taro.showToast({ title: "请选择生日", icon: "none" });
    }
    if (!gender) {
      return Taro.showToast({ title: "请选择性别", icon: "none" });
    }
    if (!city) {
      return Taro.showToast({ title: "请选择城市", icon: "none" });
    }

    createMember();
  });

  /**
   * 创建会员
   */
  const createMember = useMemoizedFn(async () => {
    Taro.showLoading({ title: "加载中", mask: true });
    const { status } = await api.user.createMember({
      ...user,
      avatarUrl: user.avatarUrl,
      gender: user.gender === "男" ? 1 : 2,
      realName: user.nickName,
      registerChannel: user.shopType,
    });
    Taro.hideLoading();

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

  return (
    <>
      <Page
        isNeedBind={false}
        navConfig={{
          title: "MY NARS",
          fill: false,
          backgroundColor: "black",
          titleColor: "#FFFFFF",
          back: true,
        }}
      >
        <View className="register">
          <View className="register-top">
            <View className="text-white text-center text-36 mb-50">
              欢迎加入NARS会员
            </View>
            <View className="head">
              <Image
                src={user.avatarUrl || P1}
                className="w-160 h-160 mb-10 rounded-160"
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
                  className="text-right"
                  placeholder="请输入姓名"
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
                {!user.mobile && !inputMobileType ? (
                  <View className="w-full flex items-center justify-end text-28 ipt-placeholder">
                    <View className="underline relative">
                      一键获取
                      <GetPhoneNumber
                        callback={(mobile) =>
                          setUser({
                            mobile: mobile,
                          })
                        }
                      ></GetPhoneNumber>
                    </View>
                    或
                    <View className="underline" onClick={setTrue}>
                      点击输入手机号
                    </View>
                  </View>
                ) : (
                  <Input
                    type="number"
                    className="text-right"
                    placeholder="请输入手机号"
                    placeholderClass="ipt-placeholder"
                    value={user.mobile}
                    focus={inputMobileType}
                    maxlength={11}
                    onInput={(e) =>
                      setUser({
                        mobile: e.detail.value,
                      })
                    }
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
                  end={dayjs().subtract(0, "year").format("YYYY-MM-DD")}
                >
                  <View className="flex items-center mr-20">
                    {!user.birthDate && (
                      <View
                        className="text-20 font-thin"
                        style={{ color: "#c1c1c1" }}
                      >
                        生日信息一经确认，无法修改
                      </View>
                    )}
                    {user.birthDate}
                    <Image src={P6} mode="widthFix" className="w-14 ml-15" />
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
                  <View className="flex items-center mr-20">
                    {!user.gender && (
                      <View className="ipt-placeholder">请选择性别</View>
                    )}
                    {user.gender}
                    <Image src={P6} mode="widthFix" className="w-14 ml-15" />
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
                  pickerData={cityList}
                  customKeyList={["province", "city"]}
                  callback={(counter) => {
                    setSelectCounter(counter);
                    setUser({ city: counter.city });
                  }}
                >
                  <View className="flex items-center mr-20">
                    <View className="ipt-placeholder">
                      {selectCounter ? selectCounter.city : "请选择所在城市"}
                    </View>
                    <Image src={P6} mode="widthFix" className="w-14 ml-15" />
                  </View>
                </MultiplePicker>
              </View>
            </View>
            <PrivacyPolicyText
              callback={PrivacyPolicy}
              checkColor="#ffffff"
              style="color:#ffffff;font-size:22rpx;margin-top:180rpx"
            ></PrivacyPolicyText>
            <View
              className="mt-85 w-540 h-70 bg-white rounded-10 text-black text-34 vhCenter"
              onClick={submit}
            >
              {isMember ? "完善信息" : "提交注册"}
            </View>
          </View>
        </View>
      </Page>
    </>
  );
};

export default Index;
