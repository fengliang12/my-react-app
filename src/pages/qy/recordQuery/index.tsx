import { Input, Picker, Text, View } from "@tarojs/components";
import Taro, { useReachBottom } from "@tarojs/taro";
import { useAsyncEffect, useMemoizedFn, useSetState } from "ahooks";

import api from "@/src/api";
import CHeader from "@/src/components/Common/CHeader";
import CImage from "@/src/components/Common/CImage";
import config from "@/src/config";
import usePagingLoad from "@/src/hooks/usePagingLoad";

import QueryStaticResult from "../components/QueryStaticResult";
import QueryTab from "../components/QueryTab";
import VerifyPopup from "../components/VerifyPopup";
import { StatusFilterList } from "../config";

const app = Taro.getApp();
const Index = () => {
  const [state, setState] = useSetState({
    parentRegion: "",
    region: "",
    store: "",
    point: "",
  });
  const parentRegionList = [];
  const regionList = [];
  const storeList = [];
  const pointList = [];

  useAsyncEffect(async () => {}, []);

  /**
   * 获取记录
   */
  const getRecordList = useMemoizedFn(async ({ page }) => {
    Taro.showLoading({ title: "加载中", mask: true });
    await app.init();
    let res = await api.qy.orderList({
      page,
      size: 20,
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
    getList: getRecordList,
  });

  useReachBottom(() => {
    onScrollToLower();
  });

  return (
    <View className="bg-[#F8F5F8] min-h-screen pb-100">
      <CHeader fill titleColor="#FFFFFF" backgroundColor="#000000"></CHeader>

      {/* 过滤 */}
      <View className="bg-black px-49 pt-30">
        <View className="flex justify-between items-center mb-24">
          {/* 大区 */}
          <Picker
            className="w-316"
            mode="selector"
            range={parentRegionList}
            rangeKey="name"
            onChange={(e) => {
              setState({
                parentRegion: parentRegionList[e.detail.value],
              });
            }}
          >
            <View className="bg-white w-full h-78 px-30 text-24 flex items-center justify-start relative box-border">
              <View className="picker">东大区</View>
              <CImage
                className="absolute right-27 w-14 h-8"
                src={`${config.imgBaseUrl}/qy/home/down_icon.png`}
              ></CImage>
            </View>
          </Picker>

          {/* 区域主管 */}
          <Picker
            className="w-316"
            mode="selector"
            range={regionList}
            rangeKey="name"
            onChange={(e) => {
              setState({
                region: regionList[e.detail.value],
              });
            }}
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

        {/* 门店 */}
        <View className="mb-24">
          <Picker mode="selector" range={storeList} onChange={() => {}}>
            <View className="bg-white w-full h-78 px-30 text-24 flex items-center justify-start relative box-border">
              <View className="picker">上海新世界</View>
              <CImage
                className="absolute right-27 w-14 h-8"
                src={`${config.imgBaseUrl}/qy/home/down_icon.png`}
              ></CImage>
            </View>
          </Picker>
        </View>

        {/* 申请时间 */}
        <View className="mb-31">
          <Picker mode="date" value="" onChange={() => {}}>
            <View className="bg-white w-full h-78 px-70 text-24 flex items-center justify-start relative box-border">
              <CImage
                className="absolute left-27 w-24 h-24"
                src={`${config.imgBaseUrl}/qy/home/date_icon.png`}
              ></CImage>
              <View className="picker">2024/12/01-2024/12/31</View>
              <CImage
                className="absolute right-27 w-14 h-8"
                src={`${config.imgBaseUrl}/qy/home/down_icon.png`}
              ></CImage>
            </View>
          </Picker>
          <View className="text-white text-18 mt-14">
            *顾客提交兑礼申请的日期
          </View>
        </View>

        <View className="flex justify-between items-center mb-45">
          {/* 请输入客户手机号 */}
          <Input
            className="bg-white w-316 h-78 px-30 text-24 flex items-center justify-start relative box-border"
            placeholder="请输入客户手机号"
          ></Input>
          <Picker
            className="w-316"
            mode="selector"
            range={pointList}
            onChange={() => {}}
          >
            <View className="bg-white w-full h-78 px-30 text-24 flex items-center justify-start relative box-border">
              <View className="picker">礼品挡位</View>
              <CImage
                className="absolute right-27 w-14 h-8"
                src={`${config.imgBaseUrl}/qy/home/down_icon.png`}
              ></CImage>
            </View>
          </Picker>
        </View>

        <View className="w-full h-80 vhCenter text-24 bg-[#C5112C] text-white">
          查询
        </View>
        <View className="w-full h-100 underline text-24 text-white vhCenter">
          重置
        </View>
      </View>

      {/* 内容 */}
      <View className="w-700 mt-51 ml-25 ">
        {/* tab栏 */}
        <QueryTab FilterList={StatusFilterList}></QueryTab>

        {recordList && recordList.length > 0
          ? recordList.map((item: any, index: number) => {
              return (
                <View
                  className="px-25 pb-0 text-24 bg-white h-600 mb-30"
                  key={index}
                >
                  {/* 查询结果-静态内容 */}
                  <QueryStaticResult info={item}></QueryStaticResult>

                  {item.status !== "wait_pay" && (
                    <>
                      <View className="w-full h-1 bg-[#CCCCCC]"></View>
                      <View className="w-full h-120 flex justify-between items-center">
                        <Text className="text-20 text-[#C5112C]">
                          *该兑礼单还有14天过期
                        </Text>

                        <VerifyPopup
                          orderId={item.orderId}
                          mobile={item.mobile}
                          callback={function (): void {
                            throw new Error("Function not implemented.");
                          }}
                        >
                          <View className="w-170 h-60 bg-black text-white vhCenter text-24">
                            确认核销
                          </View>
                        </VerifyPopup>
                      </View>
                    </>
                  )}
                </View>
              );
            })
          : null}
      </View>
    </View>
  );
};
export default Index;
