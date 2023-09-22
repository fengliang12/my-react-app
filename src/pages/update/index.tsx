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
import MultiplePicker from "@/src/components/Common/MultiplePicker";
import PrivacyAuth from "@/src/components/PrivacyAuth";
import { formatDateTime, isNickname, maskPhone } from "@/src/utils";

const genderArr = ["女", "男"];
const app: App.GlobalData = Taro.getApp();

const Index = () => {
  const isMember = useSelector((state: Store.States) => state.user.isMember);
  const [popupType, setPopupType] = useState<string>("");
  const [counterList, setCounterList] = useState<any>([]);
  const [isGetInfoBySMS, setIsGetInfoBySMS] = useState<boolean>(false);
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
          if (item.name === "isGetInfoBySMS") {
            setIsGetInfoBySMS(item?.value == 0);
          }
          if (item.name === "counterName") {
            setCounterName(item?.value);
          }
          if (item.name === "counterId") {
            setCounterId(item?.value);
          }
          if (item.name === "address") {
            setAddress(item?.value);
          }
        });
      }

      getCounterByCity();
    }
  }, [isMember]);

  /**
   * 获取门店列表
   */
  const getCounterByCity = useMemoizedFn(async () => {
    Taro.showLoading({ title: "加载中", mask: true });
    const res = await api.counter.getCounterList();
    let list = res?.data.map((item: any) => ({
      ...item.address,
      ...item.detailInfo,
      id: item.id,
    }));
    setCounterList(list);
    Taro.hideLoading();
  });

  /**
   * 提交注册
   */
  const submit = useMemoizedFn(async () => {
    const { nickName, avatarUrl, mobile, gender } = user;
    if (!avatarUrl) {
      return Taro.showToast({ title: "请上传用户头像", icon: "none" });
    }
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
          name: "isGetInfoBySMS",
          value: isGetInfoBySMS ? 0 : 1,
        },
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

  /**
   * 注销用户信息
   */
  const logOffFn = useMemoizedFn(async () => {
    const { status } = await api.user.cancellation();
    Taro.showLoading({ title: "加载中", mask: true });
    if (status === 200) {
      await app.init(true);
      Taro.hideLoading();
      Taro.showToast({
        title: "注销成功！",
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
                    <View className="text-28">
                      {counterName ? counterName : "请选择所属店铺"}
                    </View>
                    <Image src={P6} mode="widthFix" className="w-14 ml-15" />
                  </View>
                </MultiplePicker>
              </View>
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
          <View className="w-600 h-520 bg-white flex flex-col justify-center items-center">
            <View className="vhCenter flex-col text-center leading-60 px-50">
              注销会员将清除您的所有会员里程、且无法再兑换礼品，清除个人资料、解除微信绑定，已申请的礼品也将失效。您确定要注销吗?
            </View>
            <View className="w-550 flex justify-around mt-80">
              <View
                className="w-200 text-30 h-70 vhCenter"
                style={{ border: "1rpx solid #000000" }}
                onClick={logOffFn}
              >
                确 认
              </View>
              <View
                className="w-200 text-30 h-70 vhCenter text-white bg-black"
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
          <View className="w-600 h-620 bg-white flex flex-col justify-center items-center">
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
                  style={`border: 1rpx solid #000000;${
                    isGetInfoBySMS ? "background-color:#000000" : ""
                  }`}
                ></View>
                <Text className="text-24">短信</Text>
              </View>
            </View>

            <View className="w-550 flex justify-around mt-100">
              <View
                className="w-200 text-30 h-70 vhCenter"
                style={{ border: "1rpx solid #000000" }}
                onClick={submit}
              >
                确认退订
              </View>
              <View
                className="w-200 text-30 h-70 vhCenter text-white bg-black"
                onClick={() => {
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
