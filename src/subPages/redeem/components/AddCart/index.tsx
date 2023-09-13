import { ScrollView, Text, View } from "@tarojs/components";
import { useAsyncEffect, useMemoizedFn, useSetState } from "ahooks";
import React, { useEffect, useState } from "react";

import { cart } from "@/assets/image/index";
import api from "@/src/api";
import CImage from "@/src/components/Common/CImage";
import config from "@/src/config";
import to from "@/src/utils/to";

import testData from "./testData";

interface StateType {
  show: boolean;
}
const Index = () => {
  const [carts, setCarts] = useState<any>(testData);
  const [state, setState] = useSetState<StateType>({
    show: false,
  });

  useAsyncEffect(async () => {
    let res = await api.cart.locate();
  }, []);

  /**
   * 勾选
   */
  const handleSelect = useMemoizedFn((item) => {
    item.selected = !item.selected;
    setCarts([...carts]);
  });

  /**
   * 删除
   */
  const handleDelete = useMemoizedFn((item) => {});

  /**
   * 删除
   */
  const handleReduce = useMemoizedFn((item) => {});

  /**
   * 添加
   */
  const handleAdd = useMemoizedFn((item) => {});

  return (
    <View className="index">
      <CImage
        className="fixed top-800 right-0 w-80 h-80"
        src={cart}
        onClick={() => setState({ show: true })}
      ></CImage>

      {state.show && (
        <View className="w-screen h-screen fixed left-0 top-0 z-10000">
          <View
            onClick={() => setState({ show: false })}
            className="w-screen h-screen fixed left-0 top-0"
            style={{
              backgroundColor: "rgba(0,0,0,.5)",
            }}
          ></View>
          {/* 购物车弹窗 */}
          <View className="fixed left-0 bottom-0 z-12000  w-750 h-1100 bg-white flex items-center flex-col rounded-t-40">
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
                        onClick={() => handleSelect(item)}
                      >
                        <View
                          className={`w-24 h-24 borderBlack rounded-24 flex items-center justify-center ${
                            (item.sellOut || item.timeEnd || !item.status) &&
                            "disabled"
                          }`}
                        >
                          {item.selected && (
                            <View className="w-20 h-20 rounded-20 bg-black"></View>
                          )}
                        </View>

                        <CImage
                          className="w-180 h-180 ml-20"
                          src={item?.mainImage}
                        />
                      </View>

                      <View className="flex-1 h-180 vhCenter flex-col ml-40 text-28">
                        <View>
                          <View>{item?.name}</View>
                          <View className="mt-20">{item?.point}积分</View>
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
                            onClick={() => handleReduce(item)}
                          />
                          <View className="mx-10">{item.num}</View>
                          <CImage
                            className="w-28 h-28"
                            src={`${config.imgBaseUrl}/redeem/add.png`}
                            onClick={() => handleAdd(item)}
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
              <Text>2件</Text>
            </View>
            <View className="w-600 text-36 flex items-center justify-between mt-20">
              <Text>总计消耗</Text>
              <Text>3000分</Text>
            </View>
            <View
              className="w-222 h-50 mt-40 vhCenter"
              style={{ backgroundColor: "#EFEFEF" }}
              onClick={() => {
                setState({ show: false });
                to("/subPages/redeem/confirm/index");
              }}
            >
              确认兑换
            </View>
          </View>
        </View>
      )}
    </View>
  );
};
export default Index;
