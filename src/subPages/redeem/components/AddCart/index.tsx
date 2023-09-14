import { ScrollView, Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useAsyncEffect, useBoolean, useMemoizedFn, useSetState } from "ahooks";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { cart } from "@/assets/image/index";
import api from "@/src/api";
import CImage from "@/src/components/Common/CImage";
import config from "@/src/config";
import setShow from "@/src/utils/setShow";
import to from "@/src/utils/to";
import toast from "@/src/utils/toast";

const app = Taro.getApp();
const Index = () => {
  const dispatch = useDispatch();
  const [carts, setCarts] = useState<any>([]);
  const [show, { setTrue, setFalse }] = useBoolean(false);
  const counter = useSelector(
    (state: Store.States) => state.exchangeGood.counter,
  );

  useAsyncEffect(async () => {
    if (!show) return;
    Taro.showLoading({ title: "加载中", mask: true });
    await app.init();
    let { data } = await api.cart.locate({
      integral: true,
      counterId: counter?.id ? counter?.id : undefined,
      customPointsPayPlan: {
        usePoints: true,
        notValidateUsablePoints: true,
      },
    });
    Taro.hideLoading();
    setCarts(data.goods);
  }, [show]);

  /** 兑换数量 */
  const totalCounter = useMemo(() => {
    return carts.reduce((a, b) => a + b.quantity, 0);
  }, [carts]);

  /** 兑换积分 */
  const totalPoints = useMemo(() => {
    return carts.reduce((a, b) => a + b.points * b.quantity, 0);
  }, [carts]);

  /**
   * 删除
   */
  const handleDelete = useMemoizedFn(async (item) => {
    Taro.showLoading({ title: "加载中", mask: true });
    await api.cart.remove({
      cartItemIdList: [item.cartItemId],
    });
    setCarts(carts.filter((child) => child.cartItemId !== item.cartItemId));
    Taro.hideLoading();
  });

  /**
   * 更新购物车
   */
  const updateCart = useMemoizedFn(async (item, type) => {
    if (item.sellOut) return;
    Taro.showLoading({ title: "加载中", mask: true });
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

    await api.cart.update({
      cartItemId: item.cartItemId,
      promotionCode: item.cartItemId,
      quantity: item.quantity,
      selected: item.selected,
      skuId: item.skuId,
    });
    setCarts([...carts]);
    Taro.hideLoading();
  });

  /**
   * 确认兑换
   */
  const sureSubmit = useMemoizedFn(() => {
    let goods = carts.filter((item) => item.selected && !item.sellOut);
    if (!goods?.length) {
      return toast("请选择兑礼的商品");
    }
    dispatch({
      type: "SET_EXCHANGE_GOOD",
      payload: {
        goods: goods,
      },
    });
    setFalse();
    to("/subPages/redeem/confirm/index");
  });

  return (
    <View className="index">
      <CImage
        className="fixed top-800 right-0 w-80 h-80"
        src={cart}
        onClick={setTrue}
      ></CImage>

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
          <Text className="w-650 font-bold mt-68">兑换礼品详情</Text>
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
                            售罄
                          </View>
                        )}
                        <CImage className="w-180 h-180" src={item?.mainImage} />
                      </View>
                    </View>

                    <View className="flex-1 h-180 flex justify-center items-start flex-col ml-40 text-28">
                      <View>
                        <View>{item?.name}</View>
                        <View className="mt-60">{item?.totalPoints}积分</View>
                      </View>
                    </View>
                    <View className="min-w-100 h-140 flex items-end justify-between flex-col">
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
                        <View className="mx-10">{item.quantity}</View>
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
          <View className="w-600 text-36 flex items-center justify-between mt-30">
            <Text>总计兑换</Text>
            <Text>{totalCounter}件</Text>
          </View>
          <View className="w-600 text-36 flex items-center justify-between mt-20">
            <Text>总计消耗</Text>
            <Text>{totalPoints}分</Text>
          </View>
          <View
            className="w-280 h-60 mt-40 vhCenter"
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
