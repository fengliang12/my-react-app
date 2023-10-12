import "./index.less";

import { Image, Input, Picker, Text, View } from "@tarojs/components";
import Taro, { useShareAppMessage } from "@tarojs/taro";
import { useAsyncEffect, useMemoizedFn, useSetState } from "ahooks";
import { useState } from "react";
import { useSelector } from "react-redux";

import { LogoB, P1, P6, P7 } from "@/assets/image/index";
import Page from "@/components/Page";
import api from "@/src/api";
import CityList from "@/src/components/CityList";
import Avatar from "@/src/components/Common/Avatar";
import CImage from "@/src/components/Common/CImage";
import CPopup from "@/src/components/Common/CPopup";
import MultiplePicker from "@/src/components/Common/MultiplePicker";
import PrivacyAuth from "@/src/components/PrivacyAuth";
import usePrivacyAuth from "@/src/components/PrivacyAuth/hooks/usePrivacyAuth";
import {
  formatDateTime,
  handleTextBr,
  isNickname,
  maskPhone,
  setShareParams,
} from "@/src/utils";

const genderArr = ["女", "男"];
const app: App.GlobalData = Taro.getApp();

const Index = () => {
  const isMember = useSelector((state: Store.States) => state.user.isMember);
  const [popupType, setPopupType] = useState<string>("");
  const [counterList, setCounterList] = useState<any>([]);
  const [counterName, setCounterName] = useState<string>("");
  const [counterId, setCounterId] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [user, setUser] = useSetState<any>({
    nickName: "",
    birthDate: "",
    gender: "",
    mobile: "",
    avatarUrl: "",
    shopType: "",
    city: "",
    province: "",
  });

  /**
   * 用户信息反显
   */
  useAsyncEffect(async () => {
    if (isMember) {
      const userInfo = await app.init(true, false);
      let list = await getCounterByCity();
      let { realName, birthDate, gender, customInfos } = userInfo;

      birthDate = formatDateTime(birthDate);
      let genderName = "";
      if (gender === 1) {
        genderName = "男";
      }
      if (gender === 2) {
        genderName = "女";
      }

      setUser({
        ...userInfo,
        nickName: realName === "微信用户" ? "" : realName,
        gender: genderName,
        birthDate: birthDate,
      });

      if (Array.isArray(customInfos)) {
        customInfos.forEach((item) => {
          if (item.name === "counterId") {
            let counter = list.find((child) => {
              return child.id === item.value;
            });
            setCounterName(counter?.name);
          }
          if (item.name === "counterId") {
            setCounterId(item?.value);
          }
          if (item.name === "address") {
            setAddress(item?.value);
          }
        });
      }
    }
  }, [isMember]);

  /**
   * 获取门店列表
   */
  const getCounterByCity = useMemoizedFn(async () => {
    Taro.showLoading({ title: "加载中", mask: true });
    const res = await api.counter.getCounterList();
    let list = res?.data.map((item: any) => {
      let address = item.address
        ? item.address
        : {
            city: "线上渠道",
            province: "线上渠道",
          };
      return {
        ...address,
        ...item.detailInfo,
        id: item.id,
      };
    });

    setCounterList(list);
    Taro.hideLoading();

    return list;
  });

  /**
   * 提交注册
   */
  const submit = useMemoizedFn(async () => {
    const { nickName, mobile, gender } = user;
    if (!isNickname(nickName)) {
      return Taro.showToast({ title: "请输入姓名", icon: "none" });
    }
    if (!mobile) {
      return Taro.showToast({ title: "请授权手机号", icon: "none" });
    }
    if (!gender) {
      return Taro.showToast({ title: "请选择性别", icon: "none" });
    }
    appendMember();
  });

  /**
   * 更新会员
   */
  const appendMember = useMemoizedFn(async () => {
    let { nickName, gender, mobile, avatarUrl, city, province } = user;
    Taro.showLoading({ title: "加载中", mask: true });
    const { status } = await api.user.appendMember({
      avatarUrl: avatarUrl,
      gender: gender === "男" ? 1 : 2,
      realName: nickName,
      city,
      province,
      mobile,
      customInfos: [
        {
          name: "counterName",
          value: counterName || "",
        },
        {
          name: "counterId",
          value: counterId || "",
        },
        {
          name: "address",
          value: address || "",
        },
      ],
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
        <PrivacyAuth></PrivacyAuth>
        <View className="bind page_bg1 pb-100">
          <View className="bind-top">
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
                修改头像
              </View>
            </View>
            <View className="item" onTouchStart={handleTouchInput}>
              <View className="text-30">姓名*</View>
              <View className="right">
                <Input
                  type="nickname"
                  className="text-right"
                  placeholder="请输入姓名"
                  placeholderClass="ipt-placeholder"
                  value={user.nickName}
                  onBlur={() => setFocus(false)}
                  onInput={(e) =>
                    setUser({
                      nickName: e.detail.value,
                    })
                  }
                  focus={focus}
                  disabled={!focus}
                />
              </View>
            </View>
            <View className="item">
              <View className="text-30">手机号*</View>
              <View className="right" style="color:#999999">
                {maskPhone(user.mobile)}
              </View>
            </View>
            <View className="item">
              <View className="text-30">生日*</View>
              <View className="right" style="color:#999999">
                <View className="flex items-center">
                  {user.birthDate}
                  <Image src={P6} mode="widthFix" className="w-14 ml-15" />
                </View>
              </View>
            </View>
            <View className="item">
              <View className="text-30">性别*</View>
              <View className="right">
                <Picker
                  mode="selector"
                  range={genderArr}
                  onChange={(e) => {
                    setUser({ gender: genderArr[e.detail.value] });
                  }}
                >
                  <View className="flex-l flex items-center justify-end">
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
              <View className="text-30">所在城市</View>
              <View className="right">
                <CityList
                  onChange={(item) => {
                    setUser({ province: item.province, city: item.city });
                  }}
                >
                  <View className="flex items-center justify-end">
                    {!user.city && (
                      <View className="ipt-placeholder">请选择所在城市</View>
                    )}
                    {`${user.city}`}
                    <Image src={P6} mode="widthFix" className="w-14 ml-15" />
                  </View>
                </CityList>
              </View>
            </View>
            <View className="item">
              <View className="text-30">所属店铺</View>
              <View className="right">
                <MultiplePicker
                  cascadeCount={3}
                  isCascadeData={false}
                  pickerData={counterList}
                  customKeyList={["province", "city", "name"]}
                  callback={(counter) => {
                    setCounterName(counter.name);
                    setCounterId(counter.id);
                  }}
                >
                  <View className="flex items-center justify-end">
                    {!counterName && (
                      <View className="ipt-placeholder">请选择所属店铺</View>
                    )}
                    {counterName}
                    <Image src={P6} mode="widthFix" className="w-14 ml-15" />
                  </View>
                </MultiplePicker>
              </View>
            </View>
            <View className="text-18 text-center mb-20">
              *此柜台将作为会员权益服务柜台，您的礼遇将默认发放至此柜台，请慎重修改
            </View>
            <View className="item">
              <View className="text-30 mr-10">地址信息</View>
              <View className="right">
                <Input
                  className="text-right w-full"
                  placeholder="请输入地址信息"
                  placeholderClass="ipt-placeholder"
                  value={address}
                  onInput={(e) => {
                    setAddress(e.detail.value);
                  }}
                />
              </View>
            </View>
            <View className="w-540 mt-70 text-26 leading-40">
              *如果您想更改手机号及生日信息，请致电客服
              中心400-820-2573，生日仅可修改1次
            </View>
            <View
              className="w-540 h-70 vhCenter bg-white mt-50 text-black rounded-10"
              onClick={submit}
            >
              保存修改
            </View>
            <View className="w-540 flex justify-between mt-22">
              <View
                className="w-540 text-24 h-70 vhCenter text-white rounded-10 logOff"
                onClick={() => setPopupType("logOff")}
              >
                注销会员
              </View>
            </View>
          </View>
        </View>
      </Page>

      {/* 注销会员弹窗 */}
      {popupType === "logOff" && (
        <CPopup closePopup={() => setPopupType("")}>
          <View className="w-600 pt-45 pb-40 bg-white flex flex-col justify-center items-center rounded-20">
            <View className="text-30 font-bold mb-36">提示</View>
            <Text
              className="vhCenter flex-col text-center leading-40 px-50 text-28"
              style="line-height:50rpx"
              decode
            >
              {handleTextBr("注销会员相关咨询请致电客服中心\n400-820-2573")}
            </Text>
            <View className="w-550 flex justify-center mt-70">
              <View
                className="w-200 text-30 h-55 vhCenter bg-black text-white"
                onClick={() => setPopupType("")}
              >
                确 认
              </View>
            </View>
          </View>
        </CPopup>
      )}
    </>
  );
};

export default Index;
