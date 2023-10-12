import {
  MovableArea,
  MovableView,
  ScrollView,
  Text,
  View,
} from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useAsyncEffect, useBoolean, useMemoizedFn, useSetState } from "ahooks";
import { cloneDeep } from "lodash";
import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { cart } from "@/assets/image/index";
import api from "@/src/api";
import CImage from "@/src/components/Common/CImage";
import config from "@/src/config";
import pageSettingConfig from "@/src/config/pageSettingConfig";
import { SET_EXCHANGE_GOOD, SET_RED_DOT } from "@/src/store/constants";
import { getHeaderHeight } from "@/src/utils/getHeaderHeight";
import setShow from "@/src/utils/setShow";
import to from "@/src/utils/to";
import toast from "@/src/utils/toast";

const app = Taro.getApp();
const Index = () => {
  const rectInfo = getHeaderHeight();
  const dispatch = useDispatch();
  const [carts, setCarts] = useState<any>([]);
  const [show, { setTrue, setFalse }] = useBoolean(false);
  const { points, isMember } = useSelector((state: Store.States) => state.user);
  const { applyType, counter, showRedDot } = useSelector(
    (state: Store.States) => state.exchangeGood,
  );

  /** 兑换数量 */
  const totalCounter = useMemo(() => {
    return carts
      .filter((item) => item.selected)
      .reduce((a, b) => a + b.quantity, 0);
  }, [carts]);

  /** 兑换积分 */
  const totalPoints = useMemo(() => {
    return carts
      .filter((item) => item.selected)
      .reduce((a, b) => a + (b.points || b.point) * b.quantity, 0);
  }, [carts]);

  /**
   * 查询购物车
   */
  useAsyncEffect(async () => {
    // if (!show) return;
    if (applyType === "self_pick_up" && !counter) {
      toast("门店不能为空");
      return;
    }

    setCarts([]);
    Taro.showLoading({ title: "加载中", mask: true });
    await app.init();
    let { data } = await api.cart.locate({
      integral: true,
      counterId: applyType === "self_pick_up" ? counter?.id : undefined,
      customPointsPayPlan: {
        usePoints: true,
        notValidateUsablePoints: true,
      },
    });
    Taro.hideLoading();
    setCarts(data.goods);
    dispatch({
      type: SET_RED_DOT,
      payload: {
        goods: data.goods,
      },
    });
  }, [show]);

  /**
   * 删除
   */
  const handleDelete = useMemoizedFn(async (item) => {
    if (applyType === "self_pick_up" && !counter) {
      toast("门店不能为空");
      return;
    }

    Taro.showModal({
      title: "提示",
      content: `是否删除${item.name}`,
      success: async (res) => {
        if (res.confirm) {
          Taro.showLoading({ title: "加载中", mask: true });
          let { status, data } = await api.cart.remove({
            cartItemIdList: [item.cartItemId],
            counterId: applyType === "self_pick_up" ? counter?.id : undefined,
          });
          if (status === 200) {
            setCarts(
              carts.filter((child) => child.cartItemId !== item.cartItemId),
            );
            dispatch({
              type: SET_RED_DOT,
              payload: {
                goods: data.goods,
              },
            });
          }
        }
        Taro.hideLoading();
      },
    });
  });

  /**
   * 更新购物车
   */
  const updateCart = useMemoizedFn(async (item, type) => {
    if (applyType === "self_pick_up" && !counter) {
      toast("门店不能为空");
      return;
    }

    if (item.sellOut) return toast("商品已兑完");

    let origin = cloneDeep(item);

    switch (type) {
      case "select":
        item.selected = !item.selected;
        break;
      case "reduce":
        if (item.quantity === 1) {
          handleDelete(item);
          return;
        }
        item.quantity -= 1;
        break;
      case "add":
        item.quantity += 1;
        break;
    }

    Taro.showLoading({ title: "加载中", mask: true });
    await api.cart
      .update({
        cartItemId: item.cartItemId,
        counterId: applyType === "self_pick_up" ? counter?.id : undefined,
        promotionCode: item.cartItemId,
        quantity: item.quantity,
        selected: item.selected,
        skuId: item.skuId,
      })
      .then(() => {
        Taro.hideLoading();
      })
      .catch((err) => {
        item.selected = origin.selected;
        item.quantity = origin.quantity;
        toast(err.data.message);
      });
    setCarts([...carts]);
  });

  /**
   * 确认兑换
   */
  const sureSubmit = useMemoizedFn(() => {
    let goods = carts.filter((item) => item.selected && !item.sellOut);
    if (!goods?.length) {
      return toast("请选择兑礼的商品");
    }
    if (points < totalPoints) {
      return toast("您的积分不足");
    }
    dispatch({
      type: SET_EXCHANGE_GOOD,
      payload: {
        goods: goods,
        channelType: "cart",
      },
    });
    setFalse();
    to("/subPages/redeem/confirm/index?from=cart");
  });

  return (
    <View className="index">
      <MovableArea
        style={{
          position: "fixed",
          top: `${rectInfo.headerHeight}px`,
          width: "100vw",
          height: `calc(100vh - ${rectInfo.headerHeight}px)`,
          left: 0,
          zIndex: 5000,
          pointerEvents: "none",
          background: "rgba(0,0,0,0)",
        }}
      >
        <MovableView
          direction="all"
          x={330}
          y={620}
          className="vhCenter"
          style={{
            width: "100rpx",
            height: "100rpx",
            pointerEvents: "auto",
          }}
        >
          <View className="w-84 h-84 bg-black rounded-84 vhCenter relative">
            {showRedDot && (
              <View
                className="w-18 h-18 vhCenter rounded-18 absolute top-17 right-17"
                style={{ background: "#CE2828" }}
              ></View>
            )}

            <CImage
              className="w-38 h-37"
              src={cart}
              onClick={() => {
                if (!isMember) {
                  to(pageSettingConfig.registerPath, "reLaunch");
                  return;
                }
                setTrue();
              }}
            ></CImage>
          </View>
        </MovableView>
      </MovableArea>

      <View
        className="w-screen h-screen fixed left-0 top-0 z-10000"
        style={setShow(show)}
      >
        <View
          onClick={setFalse}
          className="w-screen h-screen fixed left-0 top-0"
          catchMove
          style={{
            backgroundColor: "rgba(0,0,0,.5)",
          }}
        ></View>
        {/* 购物车弹窗 */}
        <View
          catchMove
          className="fixed left-0 bottom-0 z-12000  w-750 h-1100 bg-white flex items-center flex-col rounded-t-40"
        >
          <Text className="w-650 font-bold mt-68 text-35">兑换礼品详情</Text>
          <ScrollView className="w-full h-650 mt-40" scrollY>
            {carts?.length > 0 &&
              carts.map((item) => {
                return (
                  <View
                    className="w-full px-50 box-border flex items-center justify-start pb-50"
                    key={item.id}
                  >
                    <View
                      className="vhCenter"
                      onClick={() => updateCart(item, "select")}
                    >
                      <View
                        className={`w-24 h-24 borderBlack rounded-24 flex items-center justify-center `}
                      >
                        {item.selected && (
                          <View className="w-20 h-20 rounded-20 bg-black"></View>
                        )}
                      </View>
                      <View className="relative ml-20">
                        {item.sellOut && (
                          <View
                            className="w-full h-full absolute top-0 left-0 text-white vhCenter text-28 z-99 rounded-9"
                            style="background-color:rgba(0,0,0,0.5);"
                          >
                            已 兑 完
                          </View>
                        )}
                        <CImage className="w-180 h-180" src={item?.mainImage} />
                        <View className="w-full h-1 bg-black opacity-50"></View>
                      </View>
                    </View>

                    <View className="flex-1 h-180 flex justify-between items-start flex-col ml-40 text-27">
                      <View className="text-overflow-more ENGLISH_FAMILY">
                        {item?.name}
                      </View>
                      <View className="ENGLISH_FAMILY">{item?.points}积分</View>
                    </View>
                    <View className="min-w-100 h-180 flex items-end justify-between flex-col">
                      <CImage
                        className="w-28 h-32"
                        src={`${config.imgBaseUrl}/redeem/icon-delete.png`}
                        onClick={() => handleDelete(item)}
                      />
                      <View className="w-full flex items-center justify-between">
                        <CImage
                          className="w-24 h-22"
                          src={`${config.imgBaseUrl}/redeem/reduce.png`}
                          onClick={() => updateCart(item, "reduce")}
                        />
                        <View className="mx-10 ENGLISH_FAMILY">
                          {item.quantity}
                        </View>
                        <CImage
                          className="w-28 h-28"
                          src={`${config.imgBaseUrl}/redeem/add.png`}
                          onClick={() => updateCart(item, "add")}
                        />
                      </View>
                    </View>
                  </View>
                );
              })}
          </ScrollView>

          <View className="w-600 h-2 bg-black font-bold"></View>
          <View className="w-600 text-53 flex items-center justify-between mt-30">
            <Text>总计兑换</Text>
            <Text className="ENGLISH_FAMILY">{totalCounter}件</Text>
          </View>
          <View className="w-600 text-53 flex items-center justify-between mt-20">
            <Text>总计消耗</Text>
            <Text className="ENGLISH_FAMILY">{totalPoints} 积分</Text>
          </View>
          <View
            className="w-280 h-60 mt-40 mb-60 vhCenter"
            style={{ backgroundColor: "#EFEFEF" }}
            onClick={sureSubmit}
          >
            确认兑换
          </View>
        </View>
      </View>
    </View>
  );
};
export default Index;
