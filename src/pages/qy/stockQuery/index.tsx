import { Input, Picker, Text, View } from "@tarojs/components";
import Taro, { useReachBottom } from "@tarojs/taro";
import { useMemoizedFn } from "ahooks";
import React, { useEffect } from "react";

import api from "@/src/api";
import CHeader from "@/src/components/Common/CHeader";
import CImage from "@/src/components/Common/CImage";
import config from "@/src/config";
import usePagingLoad from "@/src/hooks/usePagingLoad";
import to from "@/src/utils/to";

import QueryTab from "../components/QueryTab";
import { PointFilterList } from "../config";

const app = Taro.getApp();
const Index = () => {
  /**
   * 获取记录
   */
  const getStockList = useMemoizedFn(async ({ page }) => {
    Taro.showLoading({ title: "加载中", mask: true });
    await app.init();
    let res = await api.qy.counterStock({
      page,
      size: 10,
      counterId: "00300123",
    });
    Taro.hideLoading();
    return res.data;
  });

  const {
    loading,
    /** 记录列表 */
    list: recordList,
    /** 滚动到底部加载 */
    onScrollToLower,
    resetRefresh,
  } = usePagingLoad<Api.QYWX.OrderList.IResponse>({
    getList: getStockList,
  });

  useReachBottom(() => {
    onScrollToLower();
  });

  return (
    <View className="bg-[#F8F5F8] min-h-screen pb-100">
      <CHeader fill titleColor="#FFFFFF" backgroundColor="#000000"></CHeader>

      {/* 过滤 */}
      <View className="w-full h-55 text-20 text-white bg-[#510712] flex justify-start items-center pl-50 box-border">
        <CImage
          className="w-18 h-19 mr-12"
          src="https://cna-prd-nars-oss.oss-cn-shanghai.aliyuncs.com/qy/home/warning.png"
        ></CImage>
        库存盘点请以单品实际库存为准；共用产品不重复计算库存
      </View>
      <View className="bg-black px-49 pb-98">
        <View
          className="underline text-right text-white pt-50 text-24 mb-28"
          onClick={() => {
            console.log(1111);

            to("/pages/qy/stockSingleQuery/index");
          }}
        >
          单品实际库存
        </View>
        <View className="text-48 text-white font-bold text-center mb-78">
          库存查询
        </View>
        <View className="flex justify-between items-center mb-24">
          <Picker
            className="w-316"
            mode="selector"
            range={[]}
            onChange={() => {}}
          >
            <View className="bg-white w-full h-78 px-30 text-24 flex items-center justify-start relative box-border">
              <View className="picker">东大区</View>
              <CImage
                className="absolute right-27 w-14 h-8"
                src={`${config.imgBaseUrl}/qy/home/down_icon.png`}
              ></CImage>
            </View>
          </Picker>
          <Picker
            className="w-316"
            mode="selector"
            range={[]}
            onChange={() => {}}
          >
            <View className="bg-white w-full h-78 px-30 text-24 flex items-center justify-start relative box-border">
              <View className="picker">东一区</View>
              <CImage
                className="absolute right-27 w-14 h-8"
                src={`${config.imgBaseUrl}/qy/home/down_icon.png`}
              ></CImage>
            </View>
          </Picker>
        </View>

        <View className="mb-24">
          <Picker mode="selector" range={[]} onChange={() => {}}>
            <View className="bg-white w-full h-78 px-30 text-24 flex items-center justify-start relative box-border">
              <View className="picker">上海新世界</View>
              <CImage
                className="absolute right-27 w-14 h-8"
                src={`${config.imgBaseUrl}/qy/home/down_icon.png`}
              ></CImage>
            </View>
          </Picker>
        </View>
      </View>

      <View className="w-700 mt-33 ml-25">
        {/* tab栏 */}
        <QueryTab FilterList={PointFilterList}></QueryTab>

        {recordList && recordList.length > 0
          ? recordList?.map((item: any, index) => {
              return (
                <View
                  className="px-25 pb-100 text-24 bg-white mb-30"
                  key={index}
                >
                  {/* 申请时间 */}
                  <View className="w-full pt-30 flex justify-between items-center">
                    <Text>{item.giftCode}</Text>
                    <Text className="text-[#C5112C]">{item?.point}积分</Text>
                  </View>
                  <View className="w-full h-90 flex justify-between items-center">
                    {item.name}
                  </View>
                  <View className="w-full h-1 bg-[#CCCCCC]"></View>

                  {/* 商品信息 */}
                  {item?.packageGoodsSkuSettingViewList?.length > 0 && (
                    <>
                      <View className="py-50">
                        <View className="w-full flex justify-between items-center">
                          <Text>礼品详情</Text>
                          <View>实际库存剩余</View>
                        </View>
                        {item?.packageGoodsSkuSettingViewList?.map(
                          (pack: any) => {
                            return (
                              <View
                                key={pack?.id}
                                className="w-full flex justify-between items-center mt-33"
                              >
                                <Text>{pack.name}</Text>
                                <View>100</View>
                              </View>
                            );
                          },
                        )}
                      </View>
                      <View className="w-full h-1 bg-[#CCCCCC]"></View>
                    </>
                  )}

                  {/* 客人信息 */}
                  <View className="pt-62 flex justify-center">
                    <View className="w-full flex justify-between items-center flex-col">
                      <Text>已预约未核销</Text>
                      <View className="mt-48 text-72 font-bold text-[#C5112C]">
                        {item.exchangeNum}
                      </View>
                    </View>
                    <View className="w-full flex justify-between items-center flex-col">
                      <Text>可用库存</Text>
                      <View className="mt-48 text-72 font-bold text-[#C5112C]">
                        {item.usable}
                      </View>
                    </View>
                  </View>
                </View>
              );
            })
          : null}
      </View>
    </View>
  );
};
export default Index;
