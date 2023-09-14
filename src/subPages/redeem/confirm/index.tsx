import { Text, View } from "@tarojs/components";
import Taro, { Page, useDidHide, useDidShow, useRouter } from "@tarojs/taro";
import { useBoolean, useMemoizedFn } from "ahooks";
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
import PostageType from "../components/PostageType";

const OrderConfirm = () => {
  const dispatch = useDispatch();
  const exchangeGood = useSelector((state: Store.States) => state.exchangeGood);
  const applyType = useSelector(
    (state: Store.States) => state.exchangeGood.applyType,
  );
  const counter = useSelector(
    (state: Store.States) => state.exchangeGood.counter,
  );
  const [postageType, setPostageType] = useState<string>("points");
  const [totalPoint, setTotalPoint] = useState<number>(0);
  const [addressInfo, setAddressInfo] =
    useState<Api.Cart.Public.IDeliverInfo>();
  const [showDialog, { setTrue, setFalse }] = useBoolean(false);

  useDidShow(() => {
    handleTotalPoint();
  });

  /**
   * 处理总分
   */
  const handleTotalPoint = useMemoizedFn(() => {
    let total = 0;
    exchangeGood.goods.forEach((e) => {
      let quantity = e.quantity ? e.quantity : 1;
      if (e.point) {
        total += e?.discountPoint
          ? quantity * e.point * e.discountPoint
          : quantity * e.point;
      }
    });
    setTotalPoint(total);
  });

  /**
   * 输入地址form
   */
  const inputFormFn = useMemoizedFn((form: Api.Cart.Public.IDeliverInfo) => {
    setAddressInfo(form);
  });

  /**
   * 点击兑换
   */
  const handleReceive = useMemoizedFn(async () => {
    if (applyType === "express") {
      if (!addressInfo) return toast("请先填写收获信息");
      verifyAddressInfo(addressInfo)
        .then(async () => {
          setTrue();
        })
        .catch((err) => {
          toast({ title: err, mask: true });
        });
    } else {
      setTrue();
    }
  });

  /**
   * 确认兑礼订单
   */
  const confirm = useMemoizedFn(async () => {
    Taro.showLoading({ title: "加载中", mask: true });
    let { status } = await api.cart.submit({
      channelId: "wm",
      deliverInfo: addressInfo,
      integral: true,
      customPointsPayPlan: {
        notValidateUsablePoints: false,
        redeemPoints: totalPoint,
        usePoints: true,
      },
      exchangeSkuList: [
        {
          items: exchangeGood.goods.map((item) => ({
            quantity: item.quantity,
            skuId: item.skuId,
          })),
        },
      ],
      useCoupon: false,
    });
    Taro.hideLoading();

    if (status === 200) {
      to("/subPages/redeem/success/index", "redirectTo");
    }
  });

  /**
   * 取消弹窗
   */
  const cancel = useMemoizedFn(() => {
    setFalse();
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
            {applyType === "express" ? "邮寄到家" : "到柜领取"}
          </View>
          <View className="w-full flex justify-between">
            <Text>
              {applyType === "express" ? "客人收件信息" : counter?.name}
            </Text>
            <Text className="underline" onClick={changeExchangeType}>
              切换领取方式
            </Text>
          </View>
          {applyType === "express" && (
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

          {/* 邮费支付方式 */}
          {applyType === "express" && (
            <PostageType
              postageType={postageType}
              setPostageType={setPostageType}
            ></PostageType>
          )}

          <View className="w-full h-1 bg-black mt-50"></View>
          <View className="text-38 flex justify-between mt-50">
            <View className="">总计消耗</View>
            <View>{totalPoint}积分</View>
          </View>
          <View
            className="w-220 h-50 vhCenter bg-black text-white text-26 m-auto mt-100"
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
