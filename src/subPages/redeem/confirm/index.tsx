import "./index.scss";

import { Text, View } from "@tarojs/components";
import Taro, { Page, useDidHide, useDidShow, useRouter } from "@tarojs/taro";
import { useMemoizedFn } from "ahooks";
import dayjs from "dayjs";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";

import CDialog from "@/src/components/Common/CDialog";
import CHeader from "@/src/components/Common/CHeader";
import toast from "@/src/utils/toast";

import OrderGood from "../components/OrderGood";

const OrderConfirm = () => {
  const exchangeGood = useSelector((state: Store.States) => state.exchangeGood);
  const [goodType, setGoodType] = useState<string>("redeem");

  useDidShow(() => {
    if (
      exchangeGood?.goods?.length === 1 &&
      exchangeGood?.goods?.[0]?.type === "PRODUCTCOUPON"
    ) {
      setGoodType("coupon");
    } else {
      setGoodType("redeem");
    }

    handleTotalPoint();
  });

  /**
   * 处理总分
   */
  const [totalPoint, setTotalPoint] = useState<number>(0);
  const handleTotalPoint = useMemoizedFn(() => {
    let total = 0;
    exchangeGood.goods.forEach((e) => {
      let num = e.num ? e.num : 1;
      if (e.point) {
        total += e?.discountPoint
          ? num * e.point * e.discountPoint
          : num * e.point;
      }
    });
    setTotalPoint(total);
  });

  /**
   * 输入地址form
   */
  const [addressInfo, setAddressInfo] = useState<T_Area_Form>();
  const inputFormFn = useMemoizedFn((form: T_Area_Form) => {
    setAddressInfo(form);
  });

  /**
   * 点击兑换
   */
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const handleReceive = useMemoizedFn(async () => {
    setShowDialog(true);
  });

  /**
   * 保存地址
   */
  const [auspiciousDayState, setAuspiciousDayState] = useState<boolean>(true);
  const saveAddress = useMemoizedFn(async () => {
    if (!addressInfo) {
      toast({ title: "请先填写收件信息", mask: true });
      return;
    }
  });

  /**
   * 取消弹窗
   */
  const cancel = useMemoizedFn(() => {
    setShowDialog(false);
  });

  /**
   * 确认兑礼订单
   */
  const confirm = useMemoizedFn(async () => {});

  return (
    <>
      <View className="main">
        <CHeader
          title="兑礼结算"
          titleColor="#ffffff"
          backgroundColor="#000000"
          fill
        ></CHeader>
        <View className="w-690 text-28 bg-white px-30 py-40 box-border">
          <View className="text-35">领取方式</View>
          <View className="text-24 mb-40">
            *切换领取方式后礼品库存可能产生变化
          </View>
          <View>到柜领取</View>
          <View className="w-full flex justify-between">
            <Text>nars上海新天地</Text>
            <Text className="underline">切换领取方式</Text>
          </View>
        </View>

        <View className="w-690 bg-white px-30 py-40 box-border mt-28 text-black">
          <View className="box_title mb-50 font-bold">兑换礼品详情</View>
          <View className="module">
            {exchangeGood?.goods?.length > 0 &&
              exchangeGood?.goods?.map((item) => {
                return <OrderGood good={item} key={item.id}></OrderGood>;
              })}
          </View>
          <View className="w-full h-1 bg-black mt-80"></View>
          <View className="text-55 flex justify-between mt-50">
            <View className="">总计消耗</View>
            <View>{totalPoint}积分</View>
          </View>
          <View
            className="w-220 h-50 vhCenter bg-black text-white text-26 m-auto mt-230"
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
          cancel={cancel}
          confirm={confirm}
        ></CDialog>
      )}
    </>
  );
};
export default OrderConfirm;
definePageConfig({
  navigationStyle: "custom",
});
