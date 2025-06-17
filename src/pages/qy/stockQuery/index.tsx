import { Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useMemoizedFn, useSetState } from "ahooks";
import { useEffect, useState } from "react";

import api from "@/src/api";
import { Warning } from "@/src/assets/image";
import CHeader from "@/src/components/Common/CHeader";
import CImage from "@/src/components/Common/CImage";
import to from "@/src/utils/to";
import toast from "@/src/utils/toast";

import OrganizationPicker from "../components/OrganizationPicker";
import QueryTab from "../components/QueryTab";
import { useHandleOrganization } from "../hoooks/useHandleOrganization";
import { InitialStateType } from "../typing";

const app = Taro.getApp();

const initialState: InitialStateType = {
  bigRegion: null,
  smallRegion: null,
  store: null,
};

let allPointList: string[] = [];
const Index = () => {
  const [point, setPoint] = useState<string>("");
  const [state, setState] = useSetState<InitialStateType>(initialState);
  const [recordList, setRecordList] = useState<Api.QYWX.Stock.IResponse[]>([]);
  const [tabList, setTabList] = useState<any>([
    {
      label: "全部",
      value: "",
    },
  ]);
  const { originData } = useHandleOrganization();

  /**
   * 获取记录
   */
  const getStockList = useMemoizedFn(async () => {
    if (!state?.store?.code) return;

    await app.init();
    Taro.showLoading({ title: "加载中", mask: true });
    let res = await api.qy.counterStock({
      ...(state.store?.code && { counterId: state.store?.code }),
      ...(point && { point }),
    });
    Taro.hideLoading();

    res?.data?.forEach((item: any) => {
      allPointList.push(item.point);
    });
    allPointList = [...new Set(allPointList)].sort((a: any, b: any) => {
      return a - b;
    });

    let temp = [
      {
        label: "全部",
        value: "",
      },
    ].concat(
      allPointList.map((item) => ({
        label: item,
        value: item,
      })),
    );
    setTabList(temp);
    setRecordList(res.data);
  });

  /**
   * 跳转单品库存查询
   */
  const toStockSingleQuery = useMemoizedFn(() => {
    if (state?.store?.id) {
      to(`/pages/qy/stockSingleQuery/index?counterId=${state.store.code}`);
    } else {
      toast({ title: "请先选择查询门店" });
    }
  });

  useEffect(() => {
    getStockList();
  }, [getStockList, point, state]);

  return (
    <View className="bg-[#F8F5F8] w-full min-h-screen pb-100">
      <CHeader fill titleColor="#FFFFFF" backgroundColor="#000000"></CHeader>

      {/* 过滤 */}
      <View className="w-full h-55 text-20 text-white bg-[#510712] flex justify-start items-center pl-50 box-border">
        <CImage className="w-18 h-19 mr-12" src={Warning}></CImage>
        库存盘点请以单品实际库存为准；共用产品不重复计算库存
      </View>
      <View className="bg-black px-49 pb-98">
        <View
          className="underline text-right text-white pt-50 text-24 mb-28"
          onClick={toStockSingleQuery}
        >
          单品实际库存
        </View>
        <View className="text-48 text-white font-bold text-center mb-78">
          库存查询
        </View>
        <OrganizationPicker
          originData={originData}
          state={state}
          callback={(e) => {
            setState(e as InitialStateType);
          }}
        ></OrganizationPicker>
      </View>

      <View className="w-700 mt-33 ml-25">
        {/* tab栏 */}
        <QueryTab
          FilterList={tabList}
          callback={(e) => {
            setPoint(e);
          }}
        ></QueryTab>

        {/* 列表 */}
        {recordList && recordList.length > 0 ? (
          recordList?.map((item: any, index) => {
            return (
              <View className="px-25 pb-100 text-24 bg-white mb-30" key={index}>
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
                              <View>{pack.inventory}</View>
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
        ) : (
          <View className="w-full text-24 text-center mt-150">暂无数据</View>
        )}
      </View>
    </View>
  );
};
export default Index;
