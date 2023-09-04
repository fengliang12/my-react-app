import { ScrollView, Text, View } from "@tarojs/components";
import { useSetState } from "ahooks";
import React, { useEffect, useState } from "react";

import { cart } from "@/assets/image/index";
import CImage from "@/src/components/Common/CImage";
import CPopup from "@/src/components/Common/CPopup";
import config from "@/src/config";

interface StateType {
  show: boolean;
}
const Index = () => {
  useEffect(() => {});

  const [carts, setCarts] = useState<any>([
    {
      sellOut: 1,
      selected: true,
      mainImage:
        "https://res-wxec-unipt.lorealchina.com/prod/gac_points/20230531/fcae670e-8488-4874-a140-65be83a4f706.png",
      point: "2000",
      name: "NARS遮瑕蜜1.4g +NARS大白饼3g",
      num: 1,
    },
  ]);

  const [state, setState] = useSetState<StateType>({
    show: false,
  });

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
          <View className="fixed left-0 bottom-0 z-12000  w-750 h-1000 bg-white flex items-center flex-col rounded-t-40">
            <Text className="w-600 font-bold mt-68">兑换礼品详情</Text>
            <ScrollView className="w-600 h-500 mt-40" scrollY>
              {carts?.length > 0 &&
                carts.map((item) => {
                  return (
                    <View
                      className="flex items-center justify-start"
                      key={item.id}
                    >
                      <View
                        className={`w-30 h-30 rounded-30 flex items-center justify-center ${
                          (item.sellOut || item.timeEnd || !item.status) &&
                          "disabled"
                        }`}
                        style="border:1px solid #000000"
                      >
                        {item.selected && (
                          <View className="w-20 h-20 rounded-20 bg-black"></View>
                        )}
                      </View>

                      <CImage
                        className="w-220 h-220 ml-20"
                        src={item?.mainImage}
                      />

                      <View className="flex-1 h-full flex flex-col justify-between relative ml-40">
                        <View className="flex justify-between top">
                          <View className="detail">
                            <View>{item?.name}</View>
                            <View className="volume">{item?.point}积分</View>
                          </View>
                        </View>
                        <View className="absolute bottom-0 right-0 flex items-end justify-between">
                          <View className="flex items-center justify-center">
                            <CImage
                              className="sub  flex items-center justify-center"
                              data-type="sub"
                              src={`${config.baseImgUrl}/redeem/icon-reduce.png`}
                            />
                            <View className="flex items-center justify-center quantity">
                              {item.num}
                            </View>
                            <CImage
                              className="add  flex items-center justify-center"
                              data-type="add"
                              src={`${config.baseImgUrl}/redeem/icon-add.png`}
                            />
                          </View>
                          <CImage
                            className="close"
                            src={`${config.baseImgUrl}/redeem/icon-delete.png`}
                          />
                        </View>
                      </View>
                    </View>
                  );
                })}
            </ScrollView>

            <View className="w-600 h-2 bg-black"></View>
            <View className="w-600 text-50 flex items-center justify-between mt-30">
              <Text>总计兑换</Text>
              <Text>2件</Text>
            </View>
            <View className="w-600 text-50 flex items-center justify-between mt-20">
              <Text>总计消耗</Text>
              <Text>3000分</Text>
            </View>
            <View
              className="w-222 h-50 mt-40 vhCenter"
              style={{ backgroundColor: "#EFEFEF" }}
              onClick={() => setState({ show: false })}
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
