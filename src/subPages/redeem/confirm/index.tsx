import { Text, View } from "@tarojs/components";
import { useShareAppMessage } from "@tarojs/taro";
import { useBoolean, useMemoizedFn } from "ahooks";
import { useDispatch, useSelector } from "react-redux";

import CDialog from "@/src/components/Common/CDialog";
import CHeader from "@/src/components/Common/CHeader";
import CImage from "@/src/components/Common/CImage";
import config from "@/src/config";
import useRedeem from "@/src/hooks/useRedeem";
import { SET_COMMON } from "@/src/store/constants";
import { setShareParams } from "@/src/utils";
import to from "@/src/utils/to";
import toast from "@/src/utils/toast";

import OrderGood from "../components/OrderGood";
import PostageType from "../components/PostageType";

const OrderConfirm = () => {
  const dispatch = useDispatch();
  const [showDialog, { setTrue, setFalse }] = useBoolean(false);
  const { applyType, goods, counter, totalPoints, confirm } = useRedeem();
  const { showExpress } = useSelector(
    (state: Store.States) => state.exchangeGood,
  );
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

  useShareAppMessage(() => {
    return setShareParams();
  });

  return (
    <>
      <View
        className="w-screen min-h-screen bg-black flex flex-col items-center box-border pb-106"
        style={{ color: "#6c6c6c" }}
      >
        <CHeader
          title="兑礼结算"
          titleColor="#ffffff"
          backgroundColor="#000000"
          fill
        ></CHeader>

        {/* 领取方式 */}
        {goods?.length > 0 && goods?.[0]?.type === "PRODUCTCOUPON" ? (
          <View className="w-690 text-26 bg-white px-30 py-40 pb-60 box-border text-black">
            <CImage
              className="w-126 mb-22"
              mode="widthFix"
              src={`${config.imgBaseUrl}/redeem/apply_type2.png`}
            ></CImage>
            <View className="w-full flex justify-between items-end">
              <View className="mt-10 ENGLISH_FAMILY">
                前往NARS指定柜台使用（详见卡券中心）
              </View>
            </View>
          </View>
        ) : (
          <View className="w-690 text-26 bg-white px-30 py-40 box-border text-black">
            <CImage
              className="w-126 mb-22"
              mode="widthFix"
              src={`${config.imgBaseUrl}/redeem/apply_type.jpg`}
            ></CImage>
            {showExpress && (
              <View className="text-23 mb-40 text-left ">
                *切换领取方式后礼品库存可能产生变化
              </View>
            )}

            <View className="w-full flex justify-between items-end">
              {applyType === "express" ? (
                <View>邮寄到家</View>
              ) : (
                <View>
                  <View>到柜领取</View>
                  <View className="mt-10 ENGLISH_FAMILY">{counter?.name}</View>
                </View>
              )}
              {showExpress && (
                <CImage
                  className="w-160"
                  mode="widthFix"
                  onClick={changeExchangeType}
                  src={`${config.imgBaseUrl}/redeem/change_apply_type.jpg`}
                ></CImage>
              )}
            </View>
          </View>
        )}

        {/* 兑换礼品详情 */}
        <View
          className="w-690 bg-white px-30 pt-40 pb-100 box-border mt-28 text-black"
          style={{
            minHeight: `calc(100vh - 100px - ${showExpress ? 200 : 150}px)`,
          }}
        >
          <View className="mb-50">
            <CImage
              className="w-180"
              mode="widthFix"
              src={`${config.imgBaseUrl}/redeem/goods_detail.jpg`}
            ></CImage>
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
          <View className="text-29 flex justify-between mt-50">
            <View className="">消耗积分</View>
            <View className="ENGLISH_FAMILY text-47">
              {applyType === "express"
                ? totalPoints + config.postagePoints
                : totalPoints}
              <Text className="text-24 relative -top-4"> 积分</Text>
            </View>
          </View>
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
export default OrderConfirm;
definePageConfig({
  navigationStyle: "custom",
  enableShareAppMessage: true,
});
