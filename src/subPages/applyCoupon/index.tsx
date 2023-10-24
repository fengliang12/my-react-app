import { View } from "@tarojs/components";
import Taro, { useLoad, useShareAppMessage } from "@tarojs/taro";
import { useBoolean, useMemoizedFn } from "ahooks";
import { useState } from "react";

import api from "@/src/api";
import { P3 } from "@/src/assets/image";
import CDialog from "@/src/components/Common/CDialog";
import CHeader from "@/src/components/Common/CHeader";
import CImage from "@/src/components/Common/CImage";
import PrivacyAuth from "@/src/components/PrivacyAuth";
import config from "@/src/config";
import { setShareParams, verifyAddressInfo } from "@/src/utils";
import to from "@/src/utils/to";
import toast from "@/src/utils/toast";

const ApplyCoupon = () => {
  const [showDialog, { setTrue, setFalse }] = useBoolean(false);
  const [addressInfo, setAddressInfo] =
    useState<Api.Cart.Public.IDeliverInfo | null>(null);

  useLoad(async () => {
    let res = await api.user.getCustomerPreferredAddress();
    console.log("res", res);
    if (res?.data) {
      setAddressInfo(res?.data);
    }
  });

  /**
   * 更改地址信息
   */
  const changeExchangeType = useMemoizedFn(() => {
    Taro.chooseAddress({
      success: async (res) => {
        let data = {
          addressee: res.userName,
          city: res.cityName,
          detail: res.detailInfo,
          district: res.countyName,
          mobile: res.telNumber,
          postcode: res.postalCode,
          province: res.provinceName,
        };
        await api.user.updateCustomerPreferredAddress({
          ...data,
          preferred: true,
        });
        setAddressInfo({
          ...data,
          type: "express",
        });
      },
    });
  });

  /**
   * 点击兑换
   */
  const handleReceive = useMemoizedFn(async () => {
    if (!addressInfo) return toast("请先填写收获信息");
    verifyAddressInfo(addressInfo)
      .then(async () => {
        setTrue();
      })
      .catch((err) => {
        toast({ title: err, mask: true });
      });
  });

  /**
   * 提交
   */
  const confirm = () => {
    to("/subPages/coupon/index", "reLaunch");
  };

  useShareAppMessage(() => {
    return setShareParams();
  });

  return (
    <>
      <PrivacyAuth></PrivacyAuth>
      <View
        className="w-screen min-h-screen bg-black flex flex-col items-center box-border pb-100"
        style={{ color: "#6c6c6c" }}
      >
        <CHeader
          title="兑礼结算"
          titleColor="#ffffff"
          backgroundColor="#000000"
          fill
        ></CHeader>

        {/* 收货信息 */}
        <View
          className="w-690 text-28 bg-white px-30 py-40 box-border text-black"
          onClick={changeExchangeType}
        >
          <View className="w-full flex justify-between">
            <CImage
              className="w-126"
              mode="widthFix"
              src={`${config.imgBaseUrl}/redeem/deliver.jpg`}
            ></CImage>
            <CImage className="w-20 h-30" src={P3}></CImage>
          </View>
          <View className="pt-30 text-28">
            <View className="mt-10">{addressInfo?.addressee}</View>
            <View className="mt-10">{addressInfo?.mobile}</View>
            <View className="mt-10">
              {addressInfo?.province} {addressInfo?.city}{" "}
              {addressInfo?.district} {addressInfo?.detail}
            </View>
          </View>
        </View>

        {/* 兑换礼品详情 */}
        <View className="w-690 bg-white px-30 pt-40 pb-100 box-border mt-28 text-black">
          <View className="mb-50">
            <CImage
              className="w-180"
              mode="widthFix"
              src={`${config.imgBaseUrl}/redeem/goods_detail.jpg`}
            ></CImage>
          </View>

          <View className="module"></View>

          <View className="w-full h-1 bg-black mt-30"></View>
          <View
            className="w-423 h-78 vhCenter bg-black text-white text-29 m-auto mt-157"
            onClick={handleReceive}
          >
            确定提交
          </View>
        </View>
      </View>

      {/* 弹窗 */}
      {showDialog && (
        <CDialog
          className="w-390 bg-white py-40 px-30"
          title="确认兑换"
          dialogText="兑换后相应的积分将会扣减，订单无法取消哦"
          cancel={setFalse}
          confirm={() => {
            setFalse();
            confirm();
          }}
        ></CDialog>
      )}
    </>
  );
};
export default ApplyCoupon;
definePageConfig({
  navigationStyle: "custom",
  enableShareAppMessage: true,
});
