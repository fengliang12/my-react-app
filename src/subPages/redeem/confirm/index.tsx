import { Text, View } from "@tarojs/components";
import { useBoolean, useMemoizedFn } from "ahooks";
import { useDispatch } from "react-redux";

import CDialog from "@/src/components/Common/CDialog";
import CHeader from "@/src/components/Common/CHeader";
import config from "@/src/config";
import useRedeem from "@/src/hooks/useRedeem";
import { SET_COMMON } from "@/src/store/constants";
import to from "@/src/utils/to";
import toast from "@/src/utils/toast";

import OrderGood from "../components/OrderGood";
import PostageType from "../components/PostageType";

const OrderConfirm = () => {
  const dispatch = useDispatch();
  const [showDialog, { setTrue, setFalse }] = useBoolean(false);

  const { applyType, goods, counter, totalPoints, confirm } = useRedeem();

  /**
   * 点击兑换
   */
  const handleReceive = useMemoizedFn(async () => {
    if (applyType === "express") {
      /** 邮寄到家 */
      to(`/subPages/redeem/confirmAddress/index`, "navigateTo");
    } else if (applyType === "self_pick_up") {
      /** 门店核销 */
      if (!counter) return toast("柜台不能为空");
      setTrue();
    }
  });

  /**
   * 更改领取方式
   */
  const changeExchangeType = useMemoizedFn(() => {
    dispatch({
      type: SET_COMMON,
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
        <View className="w-690 text-26 bg-white px-30 py-40 box-border text-black">
          <View className="text-34 text-left font-bold">领取方式</View>
          <View className="text-24 mb-40  text-left mt-10">
            *切换领取方式后礼品库存可能产生变化
          </View>

          <View className="w-full flex justify-between items-end">
            {applyType === "express" ? (
              <View>邮寄到家</View>
            ) : (
              <View>
                <View>到柜领取</View>
                <View className="mt-10">{counter?.name}</View>
              </View>
            )}
            <Text className="underline" onClick={changeExchangeType}>
              切换领取方式
            </Text>
          </View>
        </View>

        {/* 兑换礼品详情 */}
        <View className="w-690 bg-white px-30 pt-40 pb-100 box-border mt-28 text-black">
          <View className="text-34 box_title mb-50 font-bold">
            兑换礼品详情
          </View>
          <View className="module">
            {goods?.length > 0 &&
              goods?.map((item) => {
                return <OrderGood good={item} key={item.id}></OrderGood>;
              })}
          </View>

          {/* 邮费支付方式 */}
          {applyType === "express" && <PostageType></PostageType>}

          <View className="w-full h-1 bg-black mt-50"></View>
          <View className="text-38 flex justify-between mt-50">
            <View className="font-bold">总计消耗</View>
            <View>
              {applyType === "express"
                ? totalPoints + config.postagePoints
                : totalPoints}
            </View>
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
export default OrderConfirm;
definePageConfig({
  navigationStyle: "custom",
});
