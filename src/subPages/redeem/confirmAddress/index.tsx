import { Text, View } from "@tarojs/components";
import Taro, { useLoad, useRouter } from "@tarojs/taro";
import { useBoolean, useMemoizedFn } from "ahooks";
import { useState } from "react";

import api from "@/src/api";
import { P3 } from "@/src/assets/image";
import CDialog from "@/src/components/Common/CDialog";
import CHeader from "@/src/components/Common/CHeader";
import CImage from "@/src/components/Common/CImage";
import config from "@/src/config";
import useRedeem from "@/src/hooks/useRedeem";
import { verifyAddressInfo } from "@/src/utils";
import toast from "@/src/utils/toast";

import OrderGood from "../components/OrderGood";
import PostageType from "../components/PostageType";

const ConfirmAddress = () => {
  const [showDialog, { setTrue, setFalse }] = useBoolean(false);
  const { totalPoints, confirm, applyType, goods } = useRedeem();
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
   * 更改领取方式
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

  return (
    <>
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

        {/* 领取方式 */}
        <View
          className="w-690 text-28 bg-white px-30 py-40 box-border text-black"
          onClick={changeExchangeType}
        >
          <View className="w-full flex justify-between">
            <Text className="text-35 font-bold">收货信息</Text>
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
          <View className="text-35 mb-50 font-bold">兑换礼品详情</View>
          <View className="module">
            {goods?.length > 0 &&
              goods?.map((item) => {
                return <OrderGood good={item} key={item.id}></OrderGood>;
              })}
          </View>

          {/* 邮费支付方式 */}
          {applyType === "express" && <PostageType></PostageType>}

          <View className="w-full h-1 bg-black mt-30"></View>
          <View className="text-55 flex justify-between mt-50">
            <View className="">总计消耗</View>
            <View className="ENGLISH_FAMILY">
              {applyType === "express"
                ? totalPoints + config.postagePoints
                : totalPoints}{" "}
              积分
            </View>
          </View>
          <View
            className="w-225 h-55 vhCenter bg-black text-white text-28 m-auto mt-180"
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
          dialogText="订单提交后无法修改,请确认是否提交订单"
          cancel={setFalse}
          confirm={() => {
            setFalse();
            confirm(addressInfo);
          }}
        ></CDialog>
      )}
    </>
  );
};
export default ConfirmAddress;
definePageConfig({
  navigationStyle: "custom",
});
