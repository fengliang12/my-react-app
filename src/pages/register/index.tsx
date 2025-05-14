import "./index.less";

import { Image, Input, Picker, Text, View } from "@tarojs/components";
import Taro, { useLoad, useRouter, useShareAppMessage } from "@tarojs/taro";
import { useAsyncEffect, useBoolean, useMemoizedFn, useSetState } from "ahooks";
import dayjs from "dayjs";
import { useLayoutEffect, useState } from "react";
import { useSelector } from "react-redux";

import { LogoB, P6, P7 } from "@/assets/image/index";
import Page from "@/components/Page";
import api from "@/src/api";
import Avatar from "@/src/components/Common/Avatar";
import CDialog from "@/src/components/Common/CDialog";
import CImage from "@/src/components/Common/CImage";
import GetPhoneNumber from "@/src/components/Common/GetPhoneNumber";
import MultiplePicker from "@/src/components/Common/MultiplePicker";
import PrivacyPolicyText from "@/src/components/Common/PrivacyPolicyText";
import SendVerifyCode from "@/src/components/Common/SendVerifyCode";
import PrivacyAuth from "@/src/components/PrivacyAuth";
import usePrivacyAuth from "@/src/components/PrivacyAuth/hooks/usePrivacyAuth";
import config from "@/src/config";
import pageSettingConfig from "@/src/config/pageSettingConfig";
import useAddUserActions from "@/src/hooks/useAddUserActions";
import useSubMsg from "@/src/hooks/useSubMsg";
import {
  formatDateTime,
  isNickname,
  isPhone,
  setShareParams,
} from "@/src/utils";
import Authorization from "@/src/utils/authorize";
import { getPages } from "@/src/utils/getPages";
import handleRoute from "@/src/utils/handleRoute";
import to from "@/src/utils/to";

import QQMapWX from "../../libs/qqmap-wx-jssdk";

const app: App.GlobalData = Taro.getApp();
const genderArr = ["女", "男"];
let qqmapsdk: any = null;

const Index = () => {
  const router = useRouter();
  const { scene = "" } = router.params;
  const isMember = useSelector((state: Store.States) => state.user.isMember);
  const [showDialog, { setTrue: setDialogTrue, setFalse }] = useBoolean(false);
  const [applyInfo, setApplyInfo] = useState<any>(null);
  const subMsg = useSubMsg();
  const [inputMobileType, { setTrue }] = useBoolean(false);
  const [agree, setAgree] = useState<boolean>(false);
  const { addActions } = useAddUserActions();

  const [user, setUser] = useSetState<any>({
    avatarUrl: "",
    nickName: "",
    mobile: "",
    birthDate: "2000-01-01",
    gender: "",
    province: "",
    city: "",
    withSmsCode: false,
    shopType: "wa",
    smsCode: "",
  });

  const [cityList, setCityList] = useState<any>();

  useLoad(async () => {
    qqmapsdk = new QQMapWX({ key: config.key });
    const { data }: any = await api.common.addressTree();
    setCityList(data);
  });

  /**
   * 是会员直接跳到首页
   */
  useAsyncEffect(async () => {
    let userInfo = await app.init();
    if (userInfo?.isMember) {
      let path = handleRoute(pageSettingConfig.homePath, router.params);
      to(path, "reLaunch");
      return;
    }
    if (scene) {
      let res = await api.apply.activityDetail(scene);
      setApplyInfo(res.data);
    }
  }, [scene]);

  /**
   * 同意隐私条款，回调订阅消息
   */
  const PrivacyPolicy = useMemoizedFn(async () => {
    setAgree(true);
  });

  /**
   * 提交注册
   */
  const submit = useMemoizedFn(async () => {
    if (isMember) {
      successRegister("您已是会员");
      return;
    }
    const { nickName, birthDate, mobile, gender, smsCode } = user;

    if (!isNickname(nickName)) {
      return Taro.showToast({ title: "请输入姓名", icon: "none" });
    }
    if (!mobile || !isPhone(mobile)) {
      return Taro.showToast({ title: "请输入正确的手机号", icon: "none" });
    }
    if (!smsCode && inputMobileType) {
      return Taro.showToast({ title: "请输入验证码", icon: "none" });
    }
    if (!birthDate) {
      return Taro.showToast({ title: "请选择生日", icon: "none" });
    }
    if (!gender) {
      return Taro.showToast({ title: "请选择性别", icon: "none" });
    }
    if (!agree) {
      return Taro.showToast({ title: "请先同意隐私条款", icon: "none" });
    }
    await subMsg("REGISTER");
    createMember();
  });

  /**
   * 创建会员
   */
  const createMember = useMemoizedFn(async () => {
    Taro.showLoading({ title: "加载中", mask: true });
    const res = await api.user.createMember({
      ...user,
      avatarUrl: user.avatarUrl,
      gender: user.gender === "男" ? 1 : 2,
      realName: user.nickName,
      registerChannel: user.shopType,
      withSmsCode: inputMobileType,
      customInfos:
        applyInfo?.counterList?.length > 0
          ? [
              {
                name: "shopCode",
                value: applyInfo?.counterList?.[0]?.code || "",
              },
              {
                name: "registerSource",
                value: applyInfo?.shortTitle || "",
              },
            ]
          : undefined,
    });
    Taro.hideLoading();

    if (res?.data?.code === "MobileHasRegistered") {
      setDialogTrue();
      return;
    }
    if (res.status === 200) {
      successRegister();
    }
  });

  /**
   * 成功回调
   */
  const successRegister = useMemoizedFn((text = "注册成功！") => {
    addActions("REGISTER");
    Taro.showToast({
      title: text,
      mask: true,
      duration: 3000,
    });
    setTimeout(async () => {
      await app.init(true);
      let list: any = getPages({ getKey: "route", getCurrentPage: false });
      if (list.length > 1) {
        app.to(1);
      } else {
        let path = handleRoute(pageSettingConfig.homePath, router.params);
        app.to(path, "reLaunch");
      }
    }, 2000);
  });

  /**
   * 点击一键授权地理位置
   */
  const authorizeLocation = useMemoizedFn(() => {
    new Authorization({ method: "getLocation" })
      .runModal({})
      .then(async (res) => {
        const { latitude, longitude } = res;
        Taro.showLoading({ title: "加载中", mask: true });
        qqmapsdk.reverseGeocoder({
          location: {
            latitude,
            longitude,
          },
          success: function (res) {
            let { province, city } = res.result.ad_info;
            setUser({
              province,
              city,
            });
          },
          fail: function (res) {
            console.log(res);
          },
          complete: function (res) {
            console.log(res);
            Taro.hideLoading();
          },
        });
      })
      .catch((err) => {
        console.log("err", err);
      });
  });

  const { requirePrivacyAuth } = usePrivacyAuth();
  const [focus, setFocus] = useState(false);
  const handleTouchInput = useMemoizedFn(async () => {
    await requirePrivacyAuth();
    setFocus(true);
  });

  useShareAppMessage(() => {
    return setShareParams();
  });

  return (
    <>
      <PrivacyAuth></PrivacyAuth>
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
        <View className="register page_bg1">
          <View className="register-top">
            <View className="text-white text-center text-36 mb-50">
              欢迎加入NARS会员
            </View>
            <View className="head">
              {user?.avatarUrl ? (
                <CImage
                  src={user.avatarUrl}
                  className="h-130 w-130 mb-10 rounded-130 overflow-hidden"
                  mode="widthFix"
                ></CImage>
              ) : (
                <View className="h-130 w-130 mb-10 rounded-130 overflow-hidden vhCenter border_999 bg-black">
                  <CImage
                    className="w-120"
                    mode="widthFix"
                    src={LogoB}
                  ></CImage>
                </View>
              )}
              <Avatar
                callback={(avatarUrl) =>
                  setUser({
                    avatarUrl: avatarUrl,
                  })
                }
              ></Avatar>
              <View className="w-full vhCenter">
                <CImage className="w-30 h-28 ml-10" src={P7}></CImage>
                上传头像
              </View>
            </View>
            <View className="item" onTouchStart={handleTouchInput}>
              <View className="left">姓名*</View>
              <View className="right">
                <Input
                  type="nickname"
                  className="text-right"
                  placeholder="请输入姓名"
                  placeholderClass="ipt-placeholder"
                  value={user.nickName}
                  focus={focus}
                  disabled={!focus}
                  onBlur={() => setFocus(false)}
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
                  <View className="w-full flex items-center justify-end text-26 ipt-placeholder">
                    <View className="underline" onClick={setTrue}>
                      点击输入手机号
                    </View>
                    或
                    <View className="underline relative">
                      一键授权手机号
                      <GetPhoneNumber
                        callback={(mobile) =>
                          setUser({
                            mobile: mobile,
                          })
                        }
                      ></GetPhoneNumber>
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
            {inputMobileType && (
              <View className="item" style="padding-right:0">
                <View className="left">验证码*</View>
                <View className="right">
                  <Input
                    type="number"
                    className="text-right"
                    placeholder="请输入验证码"
                    placeholderClass="ipt-placeholder"
                    value={user.smsCode}
                    onInput={(e) =>
                      setUser({
                        smsCode: e.detail.value,
                      })
                    }
                  />
                  <View
                    className="text-22 bg-white vhCenter px-10 text-black ml-20"
                    style="white-space: nowrap;"
                  >
                    <SendVerifyCode mobile={user.mobile}></SendVerifyCode>
                  </View>
                </View>
              </View>
            )}
            <View className="item">
              <View className="left">生日*</View>
              <View className="right">
                <Picker
                  mode="date"
                  disabled={!(!isMember || !user.birthDate)}
                  value={user.birthDate}
                  onChange={(e) => setUser({ birthDate: e.detail.value })}
                  start="1900-01-01"
                  end={dayjs().subtract(14, "year").format("YYYY-MM-DD")}
                >
                  <View className="flex items-center justify-end mr-20 text-right w-full">
                    {!user.birthDate && (
                      <View
                        className="ipt-placeholder w-full"
                        style={{ color: "#c1c1c1" }}
                      >
                        注册后不可修改
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
                  <View className="flex items-center justify-end mr-20 w-full text-right">
                    {!user.gender && (
                      <View className="ipt-placeholder w-full">请选择性别</View>
                    )}
                    {user.gender}
                    <Image src={P6} mode="widthFix" className="w-14 ml-15" />
                  </View>
                </Picker>
              </View>
            </View>

            <View className="item">
              <View className="left">所在城市</View>
              <View className="right justify-end">
                {!user.city && (
                  <View className="ipt-placeholder whitespace-nowrap">
                    <Text onClick={authorizeLocation}>一键授权地理位置</Text>
                    <Text>或</Text>
                  </View>
                )}
                <View className={user.city ? "flex-1" : ""}>
                  <MultiplePicker
                    isCascadeData
                    cascadeCount={2}
                    pickerData={cityList}
                    cascadeProps={{
                      label: "name",
                      value: "name",
                      children: "children",
                    }}
                    resultProps={["parentId", "name"]}
                    callback={(e) => {
                      let province = cityList.find((a) => a.id === e.parentId);
                      setUser({ province: province.name, city: e.name });
                    }}
                  >
                    <View className="flex items-center justify-end">
                      {!user.city && (
                        <View className="ipt-placeholder">选择城市</View>
                      )}
                      {`${user.city}`}
                      <Image src={P6} mode="widthFix" className="w-14 ml-15" />
                    </View>
                  </MultiplePicker>
                </View>
              </View>
            </View>
            <PrivacyPolicyText
              callback={PrivacyPolicy}
              checkColor="#ffffff"
              style="color:#ffffff;font-size:22rpx;margin-top:120rpx"
            ></PrivacyPolicyText>
            <View className="text-16 leading-26 box-border px-60 mt-30 text-center">
              “您在资生堂集团高端化妆品(资生堂、肌肤之钥、IPSA、NARS)的生日信息都将以此为准
              请谨慎填写，一经提交，无法修改。
            </View>
            <View
              className="mt-85 w-540 h-70 bg-white rounded-10 text-black text-34 vhCenter"
              onClick={submit}
            >
              {isMember ? "完善信息" : "提交注册"}
            </View>
          </View>
        </View>
      </Page>

      {/* 弹窗 */}
      {showDialog && (
        <CDialog
          className="w-390 bg-white py-40 px-30"
          title=""
          dialogText="手机号已绑定其他微信号，请联系客服400-820-2573解绑后重新注册"
          cancel={setFalse}
          showHideBtn={false}
          btnText="确认"
          confirm={() => {
            setFalse();
          }}
        ></CDialog>
      )}
    </>
  );
};

export default Index;
