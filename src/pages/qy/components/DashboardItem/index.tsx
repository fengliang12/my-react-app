import { Picker, Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useBoolean, useMemoizedFn } from "ahooks";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";

import api from "@/src/api";
import { P11 } from "@/src/assets/image";
import CImage from "@/src/components/Common/CImage";
import config from "@/src/config";
import { generateYearMonthArray } from "@/src/utils";

import { structure, structure2 } from "../../config";

interface Props {
  isCountry?: boolean;
  info?: any;
  pointList?: any[];
  callback?: () => void;
}

const app: App.GlobalData = Taro.getApp();
const initialDate: string = "2000";

const Index: React.FC<Props> = (props) => {
  let { isCountry = false, pointList = [], info, callback } = props;

  const [open, { setTrue, setFalse }] = useBoolean(false);
  const [dashboardData, setDashboardData] =
    useState<Api.QYWX.Dashboard.IResponse | null>(null);
  const [date, setDate] = useState<{
    label: string;
    year: string;
    month: string;
  } | null>();
  const [point, setPoint] = useState<any>(null);
  const yearRange = generateYearMonthArray(
    initialDate,
    dayjs().format("YYYY-MM"),
  );

  /**
   * 获取仪表盘数据
   */
  const getDashboardData = useMemoizedFn(async () => {
    await app.init();
    let res = await api.qy.dashboard({
      bonusPointId: point?.id,
      year: date?.year,
      month: date?.month,
      ...(info?.id && { counterIds: [info?.id] }),
    });
    setDashboardData(res?.data);
  });

  useEffect(() => {
    setFalse();
    setDate(null);
    setPoint(null);
  }, [info, setFalse]);

  /**
   * 打开时候才会调用接口
   */
  useEffect(() => {
    if (open) {
      getDashboardData();
    }
  }, [point, date, open, getDashboardData]);

  return (
    <View className="w-656 box-border mt-38 bg-white border border-1 border-[#000]">
      {isCountry ? (
        <View className="w-full h-80 px-34 box-border flex justify-start items-center bg-[#C5112C] text-white">
          <Text className="text-24 mr-30">全国</Text>
        </View>
      ) : (
        <View
          className="w-full h-80 px-34 box-border flex justify-between items-center bg-[#000] text-white"
          onClick={() => {
            callback && callback();
          }}
        >
          <Text className="text-24">
            {info?.type === "ba" ? "彩妆师：" : ""}
            {info?.name || ""}
          </Text>
          {info?.type !== "ba" && <Text className="text-24">{">"}</Text>}
        </View>
      )}

      {open ? (
        <View className="w-full">
          <View className="w-full pt-40 ">
            <View className="w-full text-24 font-bold text-center font-600">
              积分兑礼情况
            </View>

            {/* 筛选框 */}
            <View className="flex justify-center items-center mt-40 mb-37">
              <Picker
                className="w-280 mr-28"
                mode="selector"
                range={yearRange}
                rangeKey="label"
                onChange={(e) => {
                  setDate(yearRange[e.detail.value]);
                }}
              >
                <View className="w-280 h-80 px-30 text-24 flex items-center justify-start relative box-border border-solid border-2">
                  <View className="picker">
                    {date?.label ? date?.label : "日期"}
                  </View>
                  <CImage
                    className="absolute right-27 w-14 h-8"
                    src={`${config.imgBaseUrl}/qy/home/down_icon.png`}
                  ></CImage>
                </View>
              </Picker>

              <Picker
                className="w-280"
                mode="selector"
                range={pointList}
                rangeKey="name"
                onChange={(e) => {
                  setPoint(pointList[e.detail.value]);
                }}
              >
                <View className=" border-solid border-2 w-280 h-80 px-30 text-24 flex items-center justify-start relative box-border">
                  <View className="picker">
                    {point ? `${point.name}` : "积分区间明细"}
                  </View>
                  <CImage
                    className="absolute right-27 w-14 h-8"
                    src={`${config.imgBaseUrl}/qy/home/down_icon.png`}
                  ></CImage>
                </View>
              </Picker>
            </View>
            <View className="w-593 h-1 ml-35 bg-[#CCCCCC]"></View>

            {/* 数据 */}
            <View className="flex flex-col justify-center items-center mt-37 mb-45 text-24">
              <View className="w-full flex justify-around items-center mb-44">
                <View className="flex-1 text-center"></View>
                <View className="flex-1 text-center">已预约</View>
                <View className="flex-1 text-center">已核销</View>
                <View className="flex-1 text-center">已过期</View>
              </View>
              {dashboardData &&
                structure?.map((item: any) => {
                  return (
                    <View
                      key={item.value}
                      className="w-full flex justify-around items-center mb-44"
                    >
                      <View className="flex-1 text-center">{item.label}</View>
                      {structure2?.map((item2: any) => {
                        return (
                          <View key={item2} className="flex-1 text-center">
                            {dashboardData?.[item.value]?.[item2]}
                          </View>
                        );
                      })}
                    </View>
                  );
                })}
            </View>

            <View
              className="w-full flex justify-center items-center pb-22"
              onClick={setFalse}
            >
              <Text className="text-24 mr-10">收起</Text>
              <CImage
                className="w-14 h-8 transform rotate-180"
                src={P11}
              ></CImage>
            </View>
          </View>
        </View>
      ) : (
        <View
          className="w-full px-34 h-100 flex justify-between items-center text-24 box-border"
          onClick={() => {
            setTrue();
          }}
        >
          <Text className="font-bold">进入数据看板</Text>
          <View className="w-80 flex justify-between items-center">
            <Text>展开</Text>
            <CImage className="w-14 h-8" src={P11}></CImage>
          </View>
        </View>
      )}
    </View>
  );
};
export default Index;
