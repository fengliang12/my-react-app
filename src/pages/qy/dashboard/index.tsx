import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useAsyncEffect, useMemoizedFn } from "ahooks";
import { isNil, isNumber } from "lodash";
import { useState } from "react";
import { useSelector } from "react-redux";

import api from "@/src/api";
import CHeader from "@/src/components/Common/CHeader";

import DashboardItem from "../components/DashboardItem";
import { POSITION_ENUM, POSITION_ENUM_TEXT } from "../config";
import { useHandleOrganization } from "../hoooks/useHandleOrganization";

const app = Taro.getApp();

const Index = () => {
  const qyUser = useSelector((state: Store.States) => state.qyUser);
  const [currentData, setCurrentData] = useState<any>(null);
  const [pointList, setPointList] = useState<
    Api.QYWX.SingleCounterStock.IResponse[]
  >([]);

  const { originData, findPath } = useHandleOrganization();
  const [step, setStep] = useState(0);

  /**
   * 获取积分区间值
   */
  useAsyncEffect(async () => {
    Taro.showLoading({ title: "加载中", mask: true });
    await app.init();
    let res = await api.qy.counterStock({});
    let list = res?.data;
    list.unshift({
      name: "全部",
      stock: 0,
      id: "",
    });
    setPointList(
      list.map((item: any) => {
        return {
          ...item,
          ...(isNumber(item.point) && {
            name: `${item.point}档 ${item.name}`,
          }),
        };
      }),
    );
    Taro.hideLoading();
  }, []);

  /**
   * 根据用户角色，展示不同的数据
   */
  useAsyncEffect(async () => {
    if (!originData) return;
    let tempList: any[] = [];
    switch (qyUser?.position) {
      case POSITION_ENUM.ADMIN:
        tempList = originData?.children;
        break;
      case POSITION_ENUM.BIG_REGION_MANAGER:
        tempList = originData?.children;
        break;
      case POSITION_ENUM.SMALL_REGION_MANAGER:
        tempList = originData?.children?.[0]?.children;
        break;
      case POSITION_ENUM.STORE_MANAGER:
        tempList = originData?.children?.[0]?.children?.[0]?.children || [];
        break;
      case POSITION_ENUM.AGENT_STORE_MANAGER:
        tempList = originData?.children?.[0]?.children?.[0]?.children || [];
        break;
    }

    // 用户角色是sa特殊，直接展示改sa的数据
    if (qyUser.position === POSITION_ENUM.SA) {
      setCurrentData([
        {
          name: qyUser.name,
          id: qyUser.id,
          type: "ba",
        },
      ]);
    } else {
      setCurrentData(tempList);
    }
  }, [originData]);

  /**
   * 获取BA列表
   */
  const queryBaList = useMemoizedFn(async () => {
    let res = await api.qy.getBaList({
      storeId: qyUser?.storeId,
    });
    res?.data?.forEach((item: any) => {
      item.parentId = currentData[0].id;
      item.type = "ba";
    });
    setCurrentData(res?.data ?? []);
    return;
  });

  /**
   * 点击数据看板，查询下一级数据
   */
  const [dataList1, setDataList] = useState<any[]>([]);
  const clickDashboardItem = useMemoizedFn((item: any) => {
    // ba 没有下一级
    if (item?.type === "ba") return;

    if (isNil(item.children)) {
      // 门店调用ba列表接口
      queryBaList();
    } else {
      // 门店以上层级直接存储当前子数据
      setCurrentData(item?.children ?? []);
    }
    let { dataList } = findPath([originData], item.parentId);
    setDataList(dataList);
    setStep(step + 1);
  });

  /**
   * 点击回到上一页
   */
  const handleComeBack = useMemoizedFn(() => {
    if (step === 0) return;
    let tempStep = step - 1;
    setCurrentData(dataList1?.pop().children);
    setStep(tempStep);
  });

  return (
    <View className="bg-[#F8F5F8] min-h-screen box-border">
      <CHeader
        fill
        titleColor="#FFFFFF"
        backgroundColor="#000000"
        title=""
      ></CHeader>

      <View className="w-full pt-54 flex flex-col items-center">
        <View className="text-48 font-bold">{qyUser.name}</View>
        <View className="w-122 h-36 bg-[#000] text-[#fff] vhCenter mt-20 text-24">
          {POSITION_ENUM_TEXT[qyUser.position]}
        </View>

        {qyUser?.position === POSITION_ENUM.ADMIN && (
          <DashboardItem type="country" pointList={pointList}></DashboardItem>
        )}

        {currentData?.map((item, index) => {
          return (
            <DashboardItem
              key={index}
              type={qyUser.position === POSITION_ENUM.SA ? "ba" : undefined}
              info={item}
              pointList={pointList}
              callback={() => clickDashboardItem(item)}
            ></DashboardItem>
          );
        })}

        {step > 0 && (
          <View
            className="w-544 h-90 rounded-90 vhCenter bg-black text-white text-24 mt-40 mb-100"
            onClick={handleComeBack}
          >
            返回上一页
          </View>
        )}
      </View>
    </View>
  );
};
export default Index;
