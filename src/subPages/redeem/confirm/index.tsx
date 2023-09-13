import { Text, View } from "@tarojs/components";
import Taro, { Page, useDidHide, useDidShow, useRouter } from "@tarojs/taro";
import { useMemoizedFn } from "ahooks";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import api from "@/src/api";
import CDialog from "@/src/components/Common/CDialog";
import CHeader from "@/src/components/Common/CHeader";
import { verifyAddressInfo } from "@/src/utils";
import to from "@/src/utils/to";
import toast from "@/src/utils/toast";

import ExchangeExpress from "../components/ExchangeExpress";
import OrderGood from "../components/OrderGood";

const OrderConfirm = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  let { type } = router.params;
  const exchangeGood = useSelector((state: Store.States) => state.exchangeGood);
  const selectCounter = useSelector(
    (state: Store.States) => state.exchangeGood.counter,
  );
  const [payType, setPayType] = useState<string>("points");

  console.log("selectCounter", selectCounter);

  useDidShow(() => {
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
   * 点击兑换
   */
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const handleReceive = useMemoizedFn(async () => {
    setShowDialog(true);
    saveAddress();
  });

  /**
   * 输入地址form
   */
  const [addressInfo, setAddressInfo] = useState<T_Area_Form>();
  const inputFormFn = useMemoizedFn((form: T_Area_Form) => {
    setAddressInfo(form);
  });

  /**
   * 保存地址
   */
  const saveAddress = useMemoizedFn(async () => {
    if (addressInfo && type === "express") {
      toast({ title: "请先填写收件信息", mask: true });
      verifyAddressInfo(addressInfo)
        .then(async () => {
          // await address.saveAddress(addressInfo);
          setShowDialog(true);
        })
        .catch((err) => {
          toast({ title: err, mask: true });
        });
      return;
    }
    setShowDialog(true);
  });

  /**
   * 确认兑礼订单
   */
  const confirm = useMemoizedFn(async () => {
    // let res = await api.buyBonusPoint.submitPointOrder();
    to("/subPages/redeem/success/index");
  });

  /**
   * 取消弹窗
   */
  const cancel = useMemoizedFn(() => {
    setShowDialog(false);
  });

  /**
   * 更改领取方式
   */
  const changeExchangeType = useMemoizedFn(() => {
    dispatch({
      type: "CHANGE_EXCHANGE",
      payload: {
        changeExchange: true,
      },
    });
    to(1);
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
        <View className="w-690 text-28 bg-white px-30 py-40 box-border">
          <View className="text-35 text-left">领取方式</View>
          <View className="text-24 mb-40  text-left">
            *切换领取方式后礼品库存可能产生变化
          </View>
          <View className=" text-left">
            {type === "express" ? "邮寄到家" : "到柜领取"}
          </View>
          <View className="w-full flex justify-between">
            <Text>
              {type === "express" ? "客人收件信息" : selectCounter?.name}
            </Text>
            <Text className="underline" onClick={changeExchangeType}>
              切换领取方式
            </Text>
          </View>
          {type === "express" && (
            <ExchangeExpress inputFormFn={inputFormFn}></ExchangeExpress>
          )}
        </View>

        {/* 兑换礼品详情 */}
        <View className="w-690 bg-white px-30 pt-40 pb-100 box-border mt-28 text-black">
          <View className="box_title mb-50 font-bold">兑换礼品详情</View>
          <View className="module">
            {exchangeGood?.goods?.length > 0 &&
              exchangeGood?.goods?.map((item) => {
                return <OrderGood good={item} key={item.id}></OrderGood>;
              })}
          </View>
          <View className="text-24">
            <View
              className="flex items-center"
              onClick={() => setPayType("points")}
            >
              <View className="borderBlack w-16 h-16 rounded-24 mr-6 vhCenter">
                {payType === "points" && (
                  <View className="w-12 h-12 rounded-12 bg-black"></View>
                )}
              </View>
              <Text>300积分抵扣邮费</Text>
            </View>
            <View
              className="flex items-center"
              onClick={() => setPayType("money")}
            >
              <View className="borderBlack w-16 h-16 rounded-24 mr-6 vhCenter">
                {payType === "money" && (
                  <View className="w-12 h-12 rounded-12 bg-black"></View>
                )}
              </View>
              <Text>9.9元付邮到家</Text>
            </View>
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
