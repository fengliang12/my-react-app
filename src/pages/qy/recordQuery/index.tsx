import { Input, Picker, Text, View } from "@tarojs/components";
import Taro, { useReachBottom } from "@tarojs/taro";
import { useMemoizedFn, useSetState } from "ahooks";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import api from "@/src/api";
import CHeader from "@/src/components/Common/CHeader";
import CImage from "@/src/components/Common/CImage";
import config from "@/src/config";
import usePagingLoad from "@/src/hooks/usePagingLoad";
import { isPhone } from "@/src/utils";
import { getComplexExpression } from "@/src/utils/expression";
import toast from "@/src/utils/toast";

import OrganizationPicker from "../components/OrganizationPicker";
import QueryStaticResult from "../components/QueryStaticResult";
import QueryTab from "../components/QueryTab";
import { PointFilterList, POSITION_ENUM, StatusFilterList } from "../config";
import { RecordQueryInitialState } from "../typing";

const app = Taro.getApp();

const initialState = {
  startTime: "",
  endTime: "",
  mobile: "",
  bigRegion: null,
  smallRegion: null,
  store: null,
  point: null,
};
const Index = () => {
  const [state, setState] = useSetState<RecordQueryInitialState>(initialState);
  const [status, setStatus] = useState<string>("");
  const [init, setInit] = useState<boolean>(false);
  const qyUser = useSelector((state: Store.States) => state.qyUser);

  /**
   * 获取记录
   */
  const getRecordList = useMemoizedFn(async ({ page }) => {
    Taro.showLoading({ title: "加载中", mask: true });
    await app.init();

    if (state?.mobile && !isPhone(state.mobile))
      return toast("请输入正确的手机号");

    let expression = getComplexExpression([
      {
        name: "createTime",
        value: state?.startTime ? state.startTime + " 00:00:00" : "",
        operator: "ge",
      },
      {
        name: "createTime",
        value: state?.endTime ? state.endTime + " 23:59:59" : "",
        operator: "le",
      },
      {
        name: "totalRealPayPoints",
        value: state.point?.value,
        operator: "eq",
      },
      {
        name: "status",
        value: status,
        operator: "eq",
      },
      {
        name: "counterId empty",
        value: false,
        operator: "eq",
      },
      ...(state?.store?.id
        ? [
            {
              name: "counterId",
              value: state.store?.id,
              operator: "eq",
            } as any,
          ]
        : [
            {
              name: "extendInfos.value",
              value: state.smallRegion?.id ?? state.bigRegion?.id,
              operator: "eq",
            },
          ]),
      ,
    ]);

    let res = await api.qy.orderList({
      page,
      size: 20,
      ...(state.mobile && { mobile: state.mobile }),
      expression,
    });
    Taro.hideLoading();
    return res.data;
  });

  const {
    /** 记录列表 */
    list: recordList,
    /** 滚动到底部加载 */
    onScrollToLower,
    resetRefresh,
  } = usePagingLoad<Api.QYWX.OrderList.IResponse>({
    getList: getRecordList,
    requestOptions: {
      manual: true,
    },
  });

  /**
   * 滚动到底部
   */
  useReachBottom(() => {
    onScrollToLower();
  });

  /**
   * 点击查询按钮
   */
  const clickQueryBtn = useMemoizedFn(() => {
    if (
      qyUser?.position === POSITION_ENUM.BIG_REGION_MANAGER &&
      !state?.bigRegion?.id
    ) {
      toast("请先选择大区");
      return;
    } else if (
      qyUser?.position === POSITION_ENUM.SMALL_REGION_MANAGER &&
      !state?.smallRegion?.id
    ) {
      toast("请先选择区域");
      return;
    } else if (
      (qyUser?.position === POSITION_ENUM.STORE_MANAGER ||
        qyUser?.position === POSITION_ENUM.AGENT_STORE_MANAGER ||
        qyUser?.position === POSITION_ENUM.SA) &&
      !state?.store?.id
    ) {
      toast("请先选择门店");
      return;
    }
    resetRefresh();
  });

  return (
    <View className="bg-[#F8F5F8] min-h-screen pb-100">
      <CHeader fill titleColor="#FFFFFF" backgroundColor="#000000"></CHeader>

      {/* 过滤 */}
      <View className="bg-black px-49 pt-30">
        <OrganizationPicker
          state={state}
          callback={(e) => {
            //@ts-ignore
            setState(e);
            if (!init) {
              Taro.nextTick(() => {
                resetRefresh();
                setInit(true);
              });
            }
          }}
        ></OrganizationPicker>

        {/* 申请时间 */}
        <View className="flex justify-between items-center bg-white">
          <Picker
            mode="date"
            value={state.startTime}
            end={state.endTime}
            onChange={(e) => {
              setState({
                startTime: e.detail.value,
              });
            }}
          >
            <View className=" w-full h-78 px-70 text-24 flex items-center justify-start relative box-border">
              <CImage
                className="absolute left-27 w-24 h-24"
                src={`${config.imgBaseUrl}/qy/home/date_icon.png`}
              ></CImage>
              <View className="picker">
                {state.startTime ? state.startTime : "开始时间"}
              </View>
            </View>
          </Picker>
          <View className="w-20 h-1 bg-black"></View>
          <Picker
            mode="date"
            start={state.startTime}
            value={state.endTime}
            onChange={(e) => {
              setState({
                endTime: e.detail.value,
              });
            }}
          >
            <View className="w-full h-78 px-70 text-24 flex items-center justify-start relative box-border">
              <View className="picker">
                {state.endTime ? state.endTime : "结束时间"}
              </View>
              <CImage
                className="absolute right-27 w-14 h-8"
                src={`${config.imgBaseUrl}/qy/home/down_icon.png`}
              ></CImage>
            </View>
          </Picker>
        </View>
        <View className="text-white text-18 mt-14 mb-31">
          *顾客提交兑礼申请的日期
        </View>

        <View className="flex justify-between items-center mb-45">
          {/* 请输入客户手机号 */}
          <Input
            className="bg-white w-316 h-78 px-30 text-24 flex items-center justify-start relative box-border"
            placeholder="请输入客户手机号"
            type="number"
            maxlength={11}
            value={state.mobile}
            onInput={(e) => {
              setState({
                mobile: e.detail.value,
              });
            }}
          ></Input>
          <Picker
            className="w-316"
            mode="selector"
            rangeKey="label"
            range={PointFilterList}
            onChange={(e) => {
              setState({
                point: PointFilterList[e.detail.value],
              });
            }}
          >
            <View className="bg-white w-full h-78 px-30 text-24 flex items-center justify-start relative box-border">
              <View className="picker">
                {state?.point ? state?.point?.label : "请选择积分档位"}
              </View>
              <CImage
                className="absolute right-27 w-14 h-8"
                src={`${config.imgBaseUrl}/qy/home/down_icon.png`}
              ></CImage>
            </View>
          </Picker>
        </View>

        <View
          className="w-full h-80 vhCenter text-24 bg-[#C5112C] text-white"
          onClick={clickQueryBtn}
        >
          查询
        </View>
        <View
          className="w-full h-100 underline text-24 text-white vhCenter"
          onClick={() => {
            setState({
              ...initialState,
            });
          }}
        >
          重置
        </View>
      </View>

      {/* 内容 */}
      <View className="w-700 mt-51 ml-25 ">
        {/* tab栏 */}
        <QueryTab
          FilterList={StatusFilterList}
          callback={(status) => {
            setStatus(status);
            resetRefresh();
          }}
        ></QueryTab>

        {recordList && recordList.length > 0
          ? recordList.map((item: any, index: number) => {
              return (
                <View
                  className="px-25 pb-50 text-24 bg-white mb-30"
                  key={index}
                >
                  <QueryStaticResult
                    info={item}
                    callback={() => {
                      resetRefresh();
                    }}
                  ></QueryStaticResult>
                </View>
              );
            })
          : null}
      </View>
    </View>
  );
};
export default Index;
