import { ScrollView, Text, View } from "@tarojs/components";
import { useSetState } from "ahooks";
import React, { useEffect, useState } from "react";

import { cart } from "@/assets/image/index";
import CImage from "@/src/components/Common/CImage";
import CPopup from "@/src/components/Common/CPopup";

interface StateType {
  show: boolean;
}
const Index = () => {
  useEffect(() => {});

  const [cartInfo, setCartInfo] = useState<any>([]);

  const [state, setState] = useSetState<StateType>({
    show: false,
  });

  return (
    <View className="index">
      <CImage
        className="fixed top-800 right-0 w-100 h-100"
        src={cart}
        onClick={() => setState({ show: true })}
      ></CImage>
      {state.show && (
        <CPopup closePopup={() => setState({ show: false })}>
          <View className="w-468 h-526 bg-white vhCenter flex-col">
            <Text className="font-bold">兑换礼品详情</Text>
            <ScrollView className="w-full h-400" scrollY>
              {cartInfo?.cartDetail &&
                cartInfo?.cartDetail.map((item) => {
                  return (
                    <View className="good-item flex items-center" key={item.id}>
                      <View
                        className={`checkbox flex items-center justify-center ${
                          (item.sellOut || item.timeEnd || !item.status) &&
                          "disabled"
                        }`}
                        data-item={item}
                        onClick={changeSelect}
                      >
                        {item.selected && (
                          <CImage
                            className="checked"
                            src="https://wechatv2.blob.core.chinacloudapi.cn/ysl/minImge/cart/checked.png"
                          />
                        )}
                      </View>
                      <View className="good-img-box">
                        <CImage
                          data-item={item}
                          onClick={changeSelect}
                          className="good-img"
                          src={item?.mainImage}
                          mode="aspectFit"
                        />
                      </View>

                      <View className="good-info flex flex-col justify-between">
                        <View className="flex justify-between top">
                          <View className="detail">
                            <View>{item?.name}</View>
                            <View className="volume">{item?.point}积分</View>
                          </View>
                        </View>
                        <View className="bottom flex items-end justify-between">
                          <View className="flex items-center justify-center">
                            <CImage
                              className="sub  flex items-center justify-center"
                              data-item={item}
                              data-type="sub"
                              src={`${config.baseImgUrl}/redeem/icon-reduce.png`}
                              onClick={handleCart}
                            />
                            <View className="Singulier-Regular  flex items-center justify-center quantity">
                              {item.num}
                            </View>
                            <CImage
                              className="add  flex items-center justify-center"
                              data-item={item}
                              data-type="add"
                              src={`${config.baseImgUrl}/redeem/icon-add.png`}
                              onClick={handleCart}
                            />
                          </View>
                          <CImage
                            className="close"
                            data-item={item}
                            src={`${config.baseImgUrl}/redeem/icon-delete.png`}
                            onClick={clickDeleteGood}
                          />
                        </View>
                      </View>
                    </View>
                  );
                })}
            </ScrollView>
            <View>
              <Text>总计兑换</Text>
              <Text>2件</Text>
            </View>
            <View>
              <Text>总计消耗</Text>
              <Text>3000分</Text>
            </View>
            <View
              className="w-222 h-50 vhCenter"
              style={{ backgroundColor: "#EFEFEF" }}
            >
              确认兑换
            </View>
          </View>
        </CPopup>
      )}
    </View>
  );
};
export default Index;
