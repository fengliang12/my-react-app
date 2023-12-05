import { Image, Input, Picker, Text, View } from "@tarojs/components";
import Taro, { useLoad, useRouter } from "@tarojs/taro";
import { useAsyncEffect, useBoolean, useMemoizedFn, useSetState } from "ahooks";
import dayjs from "dayjs";
import { useState } from "react";
import { useSelector } from "react-redux";

import api from "@/src/api";
import { Close, P14, P15 } from "@/src/assets/image";
import CDialog from "@/src/components/Common/CDialog";
import CHeader from "@/src/components/Common/CHeader";
import CImage from "@/src/components/Common/CImage";
import GetPhoneNumber from "@/src/components/Common/GetPhoneNumber";
import MultiplePicker from "@/src/components/Common/MultiplePicker";
import PrivacyPolicyText from "@/src/components/Common/PrivacyPolicyText";
import SendVerifyCode from "@/src/components/Common/SendVerifyCode";
import Layout from "@/src/components/Layout";
import PrivacyAuth from "@/src/components/PrivacyAuth";
import pageSettingConfig from "@/src/config/pageSettingConfig";
import { formatDateTime, isBetween, isNickname, isPhone } from "@/src/utils";
import AddBehavior from "@/src/utils/addBehavior";
import Authorization from "@/src/utils/authorize";
import { getHeaderHeight } from "@/src/utils/getHeaderHeight";
import to from "@/src/utils/to";
import toast from "@/src/utils/toast";

const app: App.GlobalData = Taro.getApp();

interface RouterParams {
  /**配置页的code */
  code?: string;
  /**活动id */
  activityId?: string;
}

const MESSAGE = {
  SUCCESS: `礼券已到账，请前往卡券中心查看`,
  QUANTITY: `该礼券最多可领取1张`,
  SELLOUT: `来晚了，礼券已领完`,
  OTHERS: `领取失败，请稍后再试`,
};

const Index = () => {
  const router = useRouter();
  const { code = "", activityId = "" }: RouterParams = router.params;
  const { headerHeight } = getHeaderHeight();
  const [counterList, setCounterList] = useState<any>([]);
  const [cityList, setCityList] = useState<any>([]);
  const [counterName, setCounterName] = useState<string>("");
  const [counterId, setCounterId] = useState<string>("");
  const [
    showRegisterDialog,
    { setTrue: setRegisterDialogTrue, setFalse: setRegisterDialogFalse },
  ] = useBoolean(false);
  const [
    showReserveDialog,
    { setTrue: setReserveDialogTrue, setFalse: setReserveDialogFalse },
  ] = useBoolean(false);

  const [showDialog, { setTrue, setFalse }] = useBoolean(false);
  const [dialogText, setDialogText] = useState<string>();
  const [agree, setAgree] = useState<boolean>(false);
  const isMember = useSelector((state: Store.States) => state.user.isMember);
  const [inputMobileType, { setTrue: setInputMobile }] = useBoolean(false);
  const [user, setUser] = useSetState<any>({
    shopType: "wa",
    nickName: "",
    birthDate: "",
    mobile: "",
    city: "",
    province: "",
    smsCode: "",
  });

  /**
   * 自定义事件
   * @param params
   */
  const customAction = useMemoizedFn(async (params) => {
    if (!activityId) return toast("活动ID未配置");
    let { code } = params;
    if (code === "applyGift") {
      AddBehavior({
        activityId: activityId,
        type: "APPLY_CLICK_NUM",
      });
      let userInfo = await app.init();
      if (userInfo?.isMember) {
        //如果是会员
        if (counterId) {
          //如果只有一家柜台，直接申领
          reserveGift();
        } else {
          //如果多家柜台，先选柜台
          setReserveDialogTrue();
        }
      } else {
        //非会员弹注册弹窗，注册+申领
        setRegisterDialogTrue();
      }
    }
  });

  /**
   * 获取城市列表
   */
  useLoad(async () => {
    await app.init();
    AddBehavior({
      activityId: activityId,
      type: "APPLY_PV",
    });
    AddBehavior({
      activityId: activityId,
      type: "APPLY_UV",
    });
    const { data }: any = await api.common.addressTree();
    setCityList(data);
  });

  /**
   * 用户信息反显
   */
  useAsyncEffect(async () => {
    if (!activityId) return toast("活动ID未配置");
    let userInfo = await app.init();
    await getActivityDetail();

    if (userInfo?.isMember) {
      let { realName, birthDate } = userInfo;

      setUser({
        ...userInfo,
        nickName: realName === "微信用户" ? "" : realName,
        birthDate: formatDateTime(birthDate),
      });
    }
  }, []);

  /**
   * 获取活动详情
   */
  const getActivityDetail = useMemoizedFn(async () => {
    Taro.showLoading({ title: "加载中", mask: true });
    let res = await api.apply.activityDetail(activityId);

    Taro.hideLoading();

    if (!res || !isBetween(res.data.from, res.data.to)) {
      Taro.showModal({
        title: "提示",
        content: "当前时间不在活动时间范围内",
        success: () => {
          to(pageSettingConfig.homePath, "reLaunch");
        },
      });
      return Promise.reject();
    }
    let list = res?.data.counterList;
    setCounterList(list);
    if (list?.length === 1) {
      //如果只有一家柜台，直接选中
      const [selected] = list;
      setCounterId(selected?.code);
      setCounterName(selected?.name);
    }
    return list;
  });

  /**
   * 提交注册
   */
  const submit = useMemoizedFn(async () => {
    const { nickName, birthDate, mobile, city, smsCode } = user;
    if (isMember) {
      reserveGift();
      return;
    }

    if (!isNickname(nickName)) {
      return Taro.showToast({ title: "请输入姓名", icon: "none" });
    }
    if (!birthDate) {
      return Taro.showToast({ title: "请选择生日", icon: "none" });
    }
    if (!city) {
      return Taro.showToast({ title: "请选择城市", icon: "none" });
    }
    if (!mobile || !isPhone(mobile)) {
      return Taro.showToast({ title: "请输入正确的手机号", icon: "none" });
    }
    if (!smsCode && inputMobileType) {
      return Taro.showToast({ title: "请输入验证码", icon: "none" });
    }
    if (!counterId) {
      return Taro.showToast({ title: "请选择柜台", icon: "none" });
    }
    if (!agree) {
      return Taro.showToast({ title: "请先同意隐私条款", icon: "none" });
    }
    setRegisterDialogFalse();
    createMember();
  });

  /**
   * 创建会员
   */
  const createMember = useMemoizedFn(async () => {
    Taro.showLoading({ title: "加载中", mask: true });
    const res = await api.user.createMember({
      ...user,
      realName: user.nickName,
      registerChannel: user.shopType,
      withSmsCode: inputMobileType,
    });
    Taro.hideLoading();

    if (res.status === 200) {
      await app.init(true);
      reserveGift();
      AddBehavior({
        activityId: activityId,
        type: "APPLY_REGISTER_NUM",
        counterId,
      });
    }
  });

  /**
   * 计算门店距离是否符合要求
   */
  const authorizeLocation = useMemoizedFn(() => {
    return new Promise<void>((resolve, reject) => {
      new Authorization({ method: "getLocation" })
        .runModal({})
        .then(async (res) => {
          const { latitude, longitude } = res;

          const [{ data: configData }, { data: counterData }] =
            await Promise.all([
              api.common.findKvDataByType({
                type: "apply_distance",
              }),
              api.counter.getNearCounterList({
                type: "DIRECT_SALE",
                lng: longitude,
                lat: latitude,
                // counterCodes: ["10700050", "10700007"],
              }),
            ]);

          const { distance = 0 } =
            counterData?.find?.((item) => item?.id === counterId) || {};

          const { content = 0 } =
            configData?.find?.((item) => item?.useType === activityId) ||
            configData?.find?.((item) => item?.useType === null) ||
            {};

          console.log(distance, content);
          if (!content || +distance <= +content) {
            resolve();
          } else {
            reject();
            //TODO: 提示语得换
            toast(`距离门店太远`);
          }
        })
        .catch((err) => {
          console.log("err", err);
          reject();
        });
    });
  });

  /**
   * 领取礼物
   */
  const reserveGift = async () => {
    let userInfo = await app.init();
    if (!counterId) {
      return Taro.showToast({ title: "请选择柜台", icon: "none" });
    }
    setReserveDialogFalse();

    await authorizeLocation();

    Taro.showLoading({ title: "加载中", mask: true });
    let res = await api.apply
      .reserve(
        {
          arrivalDate: new Date(),
          counterCode: counterId,
          id: activityId,
          mobile: user.mobile,
        },
        false,
      )
      .catch((res) => {
        Taro.hideLoading();
        switch (res.data.code) {
          case "10000":
            toast(MESSAGE?.QUANTITY);
            break;
          case "400":
            switch (res?.data?.message) {
              case "礼品已赠完":
                toast(MESSAGE?.SELLOUT);
                break;

              default:
                toast(MESSAGE?.OTHERS);
                break;
            }
            break;
          case "SYSTEM":
            toast(`服务器异常，请稍后重试`);
            break;

          default:
            toast(MESSAGE?.OTHERS);
            break;
        }
        throw Error(res?.data?.message || "");
      });

    Taro.hideLoading();

    switch (res.data.code) {
      case "10000":
        toast(MESSAGE?.QUANTITY);
        break;
      default:
        await api.apply.takeTag({
          customerId: userInfo?.id || "",
        });
        AddBehavior({
          activityId: activityId,
          type: "APPLY_SUCCESS_NUM",
          counterId,
        });
        // setDialogText(MESSAGE.SUCCESS);
        // setTrue();

        toast(MESSAGE.SUCCESS);

        setTimeout(() => {
          to("/subPages/coupon/index", "reLaunch");
        }, 2000);
        break;
    }
  };

  /**
   * 同意隐私条款，回调订阅消息
   */
  const PrivacyPolicy = useMemoizedFn(async () => {
    setAgree(true);
  });

  return (
    <View>
      <PrivacyAuth></PrivacyAuth>
      <CHeader
        back
        fill
        title="NARS"
        backgroundColor="rgba(0,0,0,0)"
        titleColor="#FFFFFF"
      ></CHeader>
      <Layout
        loadPageConfig={{
          type: "code",
          value: code,
        }}
        navHeight={`${headerHeight}px`}
        globalStyle={{ backgroundColor: "#000000" }}
        onCustomAction={customAction}
      />
      {/* 注册弹窗 */}
      {showRegisterDialog && (
        <View className="w-screen h-screen fixed left-0 top-0 z-10000">
          <View
            onClick={setRegisterDialogFalse}
            className="w-screen h-screen fixed left-0 top-0"
            style={{ backgroundColor: "rgba(0,0,0,.5)" }}
          ></View>
          <View
            className="fixed bottom-0 left-0 z-999 w-750 flex flex-col justify-start items-center text_808080 pb-102"
            style={{
              background: "rgba(255, 255, 255, 0.9)",
              borderRadius: "0px 100rpx 0px 0px",
            }}
          >
            <View className="text-36 text-center mt-59 text-black">
              注册会员既有机会获得
            </View>
            <View className="mt-60 h-80 vhCenter">
              <Text className="w-120 text-30">姓名*</Text>
              <Input
                className="w-448 h-80 leading-80 borderBlack rotate_360 text-24 px-40 box-border"
                placeholder="请输入您的姓名"
                value={user.nickName}
                onInput={(e) =>
                  setUser({
                    nickName: e.detail.value,
                  })
                }
              ></Input>
            </View>
            <View className="mt-45 h-80 vhCenter">
              <Text className="w-120 text-30">生日*</Text>
              <Picker
                className="w-448 h-80"
                mode="date"
                disabled={!(!isMember || !user.birthDate)}
                value={user.birthDate}
                onChange={(e) => setUser({ birthDate: e.detail.value })}
                start="1900-01-01"
                end={dayjs().subtract(14, "year").format("YYYY-MM-DD")}
              >
                <View className="w-full h-80 leading-80 borderBlack rotate_360 text-24 px-40 box-border relative">
                  {!user?.birthDate ? "选择您的生日" : user.birthDate}
                  <Image
                    src={P15}
                    mode="widthFix"
                    className="absolute right-33 top-30 w-23"
                  />
                </View>
              </Picker>
            </View>
            <View className="mt-45 h-80 vhCenter">
              <Text className="w-120 text-30">城市*</Text>
              <View className="w-448 h-80 leading-80 borderBlack rotate_360 text-24 px-40 box-border relative">
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
                  <View className="flex items-center justify-start">
                    {!user.city ? "请选择所在城市" : user.city}
                    <Image
                      src={P14}
                      mode="widthFix"
                      className="absolute right-24 top-23 w-25"
                    />
                  </View>
                </MultiplePicker>
              </View>
            </View>
            <View className="mt-45 h-80 vhCenter">
              <Text className="w-120 text-30">手机*</Text>
              <View className="w-448 h-80 leading-80 borderBlack rotate_360 text-24 px-40 box-border flex items-center justify-start relative">
                <Input
                  type="number"
                  className="text-left"
                  placeholder="自行输入"
                  value={user.mobile}
                  maxlength={11}
                  onInput={(e) => {
                    setUser({
                      mobile: e.detail.value,
                    });
                    setInputMobile();
                  }}
                />
                {!inputMobileType && (
                  <View className="underline absolute right-24 text-black">
                    一键授权
                    <GetPhoneNumber
                      callback={(mobile) =>
                        setUser({
                          mobile: mobile,
                        })
                      }
                    ></GetPhoneNumber>
                  </View>
                )}
              </View>
            </View>

            {inputMobileType && (
              <View className="mt-45 h-80 vhCenter">
                <Text className="w-120 text-30">验证码*</Text>
                <View className="w-448 h-80 borderBlack rotate_360 text-24 px-40 box-border flex items-center justify-start relative">
                  <Input
                    className="h-80 leading-80"
                    type="number"
                    placeholder="请输入验证码"
                    value={user.smsCode}
                    onInput={(e) =>
                      setUser({
                        smsCode: e.detail.value,
                      })
                    }
                  ></Input>
                  <View
                    className="absolute h-80 leading-80 right-0 text-22 bg-black vhCenter px-10 text-white ml-20"
                    style="white-space: nowrap;"
                  >
                    <SendVerifyCode mobile={user.mobile}></SendVerifyCode>
                  </View>
                </View>
              </View>
            )}

            <View className="mt-45 h-80 vhCenter">
              <Text className="w-120 text-30">柜台*</Text>
              <View className="w-448 h-80 leading-80 borderBlack rotate_360 text-24 px-40 box-border relative">
                <MultiplePicker
                  cascadeCount={1}
                  isCascadeData={false}
                  pickerData={counterList}
                  customKeyList={["name"]}
                  callback={(counter) => {
                    setCounterName(counter.name);
                    setCounterId(counter.code);
                  }}
                >
                  <View className="flex items-center justify-start">
                    {!counterName ? "选择您的领取柜台" : counterName}
                    <Image
                      src={P15}
                      mode="widthFix"
                      className="absolute right-33 top-30 w-23"
                    />
                  </View>
                </MultiplePicker>
              </View>
            </View>
            <PrivacyPolicyText
              callback={PrivacyPolicy}
              checkColor="#000000"
              style="color:#000000;font-size:22rpx;margin-top:56rpx"
            ></PrivacyPolicyText>
            <View
              className="mt-80 w-386 h-80 bg-black text-white text-36 vhCenter"
              onClick={submit}
            >
              注册
            </View>
          </View>
        </View>
      )}

      {/* 会员直接领取弹窗 */}
      {showReserveDialog && (
        <View className="w-screen h-screen fixed left-0 top-0 z-10000">
          <View
            onClick={setReserveDialogFalse}
            className="w-screen h-screen fixed left-0 top-0"
            style={{ backgroundColor: "rgba(0,0,0,.5)" }}
          ></View>
          <View className="w-640 fixed top-500 left-62 z-999 flex flex-col justify-start items-center text_808080 pb-102 bg-white">
            <CImage
              src={Close}
              className="w-20 h-20 absolute top-21 right-20"
              onClick={setReserveDialogFalse}
            ></CImage>
            <View className="text-36 text-center mt-73 text-black">
              领取门店
            </View>
            <View className="mt-47 h-80 vhCenter">
              <View className="w-500 h-80 leading-80 borderBlack rotate_360 text-24 px-40 box-border relative">
                <MultiplePicker
                  cascadeCount={1}
                  isCascadeData={false}
                  pickerData={counterList}
                  customKeyList={["name"]}
                  callback={(counter) => {
                    setCounterName(counter.name);
                    setCounterId(counter.code);
                  }}
                >
                  <View className="flex items-center justify-start">
                    {!counterName ? "选择门店" : counterName}
                    <Image
                      src={P15}
                      mode="widthFix"
                      className="absolute right-33 top-30 w-23"
                    />
                  </View>
                </MultiplePicker>
              </View>
            </View>
            <View
              className="mt-74 w-277 h-80 bg-black text-white text-30 vhCenter"
              onClick={reserveGift}
            >
              确认预约
            </View>
          </View>
        </View>
      )}

      {/* 提示弹窗 */}
      {showDialog && (
        <CDialog
          className="w-390 bg-white py-40 px-30"
          title=""
          dialogText={dialogText}
          cancel={setFalse}
          showHideBtn={false}
          btnText="立即查看"
          confirm={() => {
            setFalse();
            to("/subPages/coupon/index", "reLaunch");
          }}
        ></CDialog>
      )}
    </View>
  );
};

export default Index;
