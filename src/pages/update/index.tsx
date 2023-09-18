import "./index.less";

import { Image, Input, Picker, Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useAsyncEffect, useMemoizedFn, useSetState } from "ahooks";
import { useState } from "react";
import { useSelector } from "react-redux";

import { P1, P6 } from "@/assets/image/index";
import Page from "@/components/Page";
import api from "@/src/api";
import CityList from "@/src/components/CityList";
import Avatar from "@/src/components/Common/Avatar";
import CPopup from "@/src/components/Common/CPopup";
import PrivacyAuth from "@/src/components/PrivacyAuth";
import { formatDateTime, maskPhone } from "@/src/utils";

const genderArr = ["女", "男"];
const app: App.GlobalData = Taro.getApp();

const Index = () => {
  const isMember = useSelector((state: Store.States) => state.user.isMember);
  const [popupType, setPopupType] = useState<string>("");
  const [counterList, setCounterList] = useState<any>([]);
  const [isGetInfoBySMS, setIsGetInfoBySMS] = useState<boolean>(false);
  const [counterIndex, setCounterIndex] = useState<number>(NaN);
  const [user, setUser] = useSetState<any>({
    nickName: "",
    birthDate: "",
    gender: "",
    mobile: "",
    avatarUrl: "",
    shopType: "",
    city: "",
    province: "",
    country: "",
    district: "",
  });

  /**
   * 用户信息反显
   */
  useAsyncEffect(async () => {
    if (isMember) {
      const userInfo = await app.init();
      let { realName, birthDate, gender, customInfos, city, district } =
        userInfo;

      console.log("district", district);

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
        district,
      });

      if (Array.isArray(customInfos)) {
        setIsGetInfoBySMS(
          customInfos.find((item) => item.name === "isGetInfoBySMS")?.value ==
            1,
        );
      }

      if (city) {
        getCounterByCity(city);
      }
    }
  }, [isMember]);

  /**
   * 获取门店列表
   */
  const getCounterByCity = useMemoizedFn(async (city) => {
    Taro.showLoading({ title: "加载中", mask: true });
    const res = await api.counter.getCounterByCity({ city: city });
    let list = res?.data.content.map((item: any) => ({
      id: item.id,
      ...item.detailInfo,
    }));
    setCounterList(list);
    Taro.hideLoading();
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
    let {
      nickName,
      gender,
      mobile,
      avatarUrl,
      city,
      province,
      district,
      country,
    } = user;
    Taro.showLoading({ title: "加载中", mask: true });
    const { status } = await api.user.appendMember({
      avatarUrl: avatarUrl,
      gender: gender === "男" ? 1 : 2,
      nickName: nickName,
      city,
      province,
      country,
      mobile,
      district,
      customInfos: [
        {
          name: "isGetInfoBySMS",
          value: isGetInfoBySMS ? 1 : 2,
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

  /**
   * 注销用户信息
   */
  const logOffFn = useMemoizedFn(async () => {
    const { status } = await api.user.unbinding();
    Taro.showLoading({ title: "加载中", mask: true });
    if (status === 200) {
      await app.init(true);
      Taro.hideLoading();
      Taro.showToast({
        title: "解绑成功！",
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
        <PrivacyAuth></PrivacyAuth>
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
              <View className="text-30">姓名*</View>
              <View className="right">
                <Input
                  type="nickname"
                  className="text-right"
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
              <View className="text-30">手机号*</View>
              <View className="right">{maskPhone(user.mobile)}</View>
            </View>
            <View className="item">
              <View className="text-30">生日*</View>
              <View className="right">
                <View className="flex items-center pr-20">
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
                      <View className="ipt-placeholder">请选择</View>
                    )}
                    {user.gender}
                    <Image src={P6} mode="widthFix" className="w-14 ml-15" />
                  </View>
                </Picker>
              </View>
            </View>
            <View className="item">
              <View className="text-30">所在城市*</View>
              <View className="right">
                <CityList
                  onChange={(item) => {
                    getCounterByCity(item.city);
                    setUser({ province: item.province, city: item.city });
                  }}
                >
                  <View className="flex items-center justify-end">
                    {!user.city && (
                      <View className="ipt-placeholder">请选择所在城市</View>
                    )}
                    {`${user.province} ${user.city}`}
                    <Image src={P6} mode="widthFix" className="w-14 ml-15" />
                  </View>
                </CityList>
              </View>
            </View>
            <View className="text-18 text-center mb-20">
              *此柜台将作为会员权益服务柜台，您的礼遇将默认发放至此柜台，请慎重修改
            </View>
            <View className="item">
              <View className="text-30">所属店铺</View>
              <View className="right">
                <Picker
                  mode="selector"
                  rangeKey="name"
                  range={counterList}
                  value={counterIndex}
                  onChange={(e) => {
                    let { value } = e.detail;
                    let item = counterList[value];
                    setCounterIndex(Number(value));
                    setUser({ country: item.name });
                  }}
                >
                  <View className="flex items-center justify-end">
                    {!user.country ? (
                      <View className="ipt-placeholder">请选择所属店铺</View>
                    ) : (
                      <>{user.country}</>
                    )}
                    <Image src={P6} mode="widthFix" className="w-14 ml-15" />
                  </View>
                </Picker>
              </View>
            </View>
            <View className="item">
              <View className="text-30 mr-10">地址信息</View>
              <View className="right">
                <Input
                  className="text-right w-full"
                  placeholder="请输入地址信息"
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
            <View className="w-650 mt-10 text-20">
              *如果您想更改手机号及生日信息，请致电客服
              中心400-820-2573，生日仅可修改1次
            </View>
            <View className="w-650 flex justify-around mt-50">
              <View
                className="w-300 text-30 h-70 vhCenter"
                style={{ border: "1rpx solid #FFFFFF" }}
                onClick={() => setPopupType("logOff")}
              >
                注销会员
              </View>
              <View
                className="w-300 text-30 h-70 vhCenter bg-white text-black"
                onClick={submit}
              >
                立即提交
              </View>
            </View>
            <View className="w-600 flex justify-start items-center mt-20">
              <View
                className="w-14 h-14 rounded-14 mr-10"
                style={{ border: "1rpx solid #FFFFFF" }}
              ></View>
              <Text className="text-24" onClick={() => setPopupType("contact")}>
                沟通退订
              </Text>
            </View>
          </View>
        </View>
      </Page>

      {/* 注销会员弹窗 */}
      {popupType === "logOff" && (
        <CPopup closePopup={() => setPopupType("")}>
          <View
            className="w-600 h-620 bg-white flex flex-col justify-center items-center"
            style={{ color: "#6C5540" }}
          >
            <View className="vhCenter flex-col text-center leading-60">
              <Text>注销会员将清除您的所有个人资料</Text>
              <Text>积分信息</Text>
              <Text>解除微信绑定且无法享受会员权益</Text>
              <Text>您确定要注销吗？</Text>
            </View>
            <View className="w-550 flex justify-around mt-100">
              <View
                className="w-200 text-30 h-70 vhCenter"
                style={{ border: "1rpx solid #6C5540" }}
                onClick={logOffFn}
              >
                确 认
              </View>
              <View
                className="w-200 text-30 h-70 vhCenter text-white"
                style={{ backgroundColor: "#6C5540" }}
                onClick={() => setPopupType("")}
              >
                取 消
              </View>
            </View>
          </View>
        </CPopup>
      )}

      {popupType === "contact" && (
        <CPopup closePopup={() => setPopupType("")}>
          <View
            className="w-600 h-620 bg-white flex flex-col justify-center items-center"
            style={{ color: "#6C5540" }}
          >
            <View className="vhCenter flex-col text-center leading-60">
              <Text>我希望退订通过以下方式</Text>
              <Text>推送给我的营销信息</Text>
              <Text className="text-18">
                （礼品领取提醒，积分过期提醒，新品试用信息，促销信息等）
              </Text>
            </View>
            <View className="w-300 flex justify-between mt-50">
              <View
                className="flex justify-start items-center mt-20"
                onClick={() => setIsGetInfoBySMS(!isGetInfoBySMS)}
              >
                <View
                  className="w-22 h-22 mr-10"
                  style={`border: 1rpx solid #6C5540;${
                    isGetInfoBySMS ? "background-color:#6C5540" : ""
                  }`}
                ></View>
                <Text className="text-24">短信</Text>
              </View>
            </View>

            <View className="w-550 flex justify-around mt-100">
              <View
                className="w-200 text-30 h-70 vhCenter"
                style={{ border: "1rpx solid #6C5540" }}
                onClick={submit}
              >
                确认退订
              </View>
              <View
                className="w-200 text-30 h-70 vhCenter text-white"
                style={{ backgroundColor: "#6C5540" }}
                onClick={() => {
                  setIsGetInfoBySMS(false);
                  setPopupType("");
                }}
              >
                取 消
              </View>
            </View>
          </View>
        </CPopup>
      )}
    </>
  );
};

export default Index;
