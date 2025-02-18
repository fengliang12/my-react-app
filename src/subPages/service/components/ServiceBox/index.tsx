import { Picker, Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useBoolean, useMount, useRequest, useSetState } from "ahooks";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

import api from "@/api/index";
import { Close, P11 } from "@/src/assets/image";
import CImage from "@/src/components/Common/CImage";
import MultiplePicker from "@/src/components/Common/MultiplePicker";
import useAddUserActions from "@/src/hooks/useAddUserActions";
import useLoaclBehavior from "@/src/hooks/useLoaclBehavior";
import useSubMsg from "@/src/hooks/useSubMsg";
import authorize from "@/src/utils/authorize";
import to from "@/src/utils/to";
import toast from "@/src/utils/toast";

interface TProps {
  project?: Api.AdhocReservation.GetProjects.Item;
  num?: number;
  initData?: Api.AdhocReservation.GetRecords.Item;
  callback?: () => void;
  close: () => void;
  modifyTime?: number;
}

const app: App.GlobalData = Taro.getApp();
const Index: React.FC<TProps> = (props) => {
  const { addActions } = useAddUserActions();
  const { addBehavior } = useLoaclBehavior("RESERVATION");

  let { project, num = 0, initData, close, callback, modifyTime = 24 } = props;
  const [sureShow, { setTrue }] = useBoolean(false);
  const userInfo = useSelector((state: Store.States) => state.user);
  const [appointment, setAppointment] = useSetState<any>({
    projectName: project?.projectName ?? initData?.projectName,
    projectCode: project?.projectCode ?? initData?.projectCode,
    serviceType: project?.typeCode ?? initData?.typeCode,
    storeCode: initData?.storeCode,
    bookableDate: initData?.serviceTime?.split(" ")[0],
    timePeriod: initData?.serviceTime?.split(" ")[1],
  });

  /**
   * 初始化
   */
  useMount(async () => {
    const res = await new authorize({
      method: "getLocation",
    })
      .runModal({
        cancelShowModal: false, //用户第一次拒绝时立即弹窗提示需要获取权限
        modalObj: {
          show: true,
          customModal: {
            show: false, // 是否自定义组件
          },
        },
      })
      .catch((err) => {
        console.log(err);
      });
    if (!initData) {
      getNearCounterList({
        type: "DIRECT_SALE",
        lat: res.latitude,
        lng: res.longitude,
      });
    }
  });

  /** 获取柜台列表 */
  const { data: nearCounter, run: getNearCounterList } = useRequest(
    async (params) => {
      Taro.showLoading({ title: "加载中", mask: true });
      await app.init();
      return api.counter.getNearCounterList(params).then((res) => {
        Taro.hideLoading();
        return res.data[0];
      });
    },
    { manual: true },
  );

  /**
   * 获取门店
   */
  const { data: counterList = [] } = useRequest(async () => {
    await app.init();
    return await api.adhocReservation.getCounters().then((res) => res.data);
  });

  const [initCounterData, setInitCounterData] = useState<Array<string>>([]);
  useEffect(() => {
    if (nearCounter && counterList) {
      let temp = counterList.find((item) => item.storeCode === nearCounter.id);
      if (temp) {
        setAppointment({
          storeCode: nearCounter.id,
        });
        setInitCounterData([temp.provinceName, temp.areaName, temp.storeName]);
      }
    }
  }, [nearCounter, setAppointment, counterList]);

  /**
   * 可预约日期
   */
  const { data: dates = [], run: getDates } = useRequest(
    async () => {
      if (!appointment?.projectCode) return toast("服务项目为空");

      Taro.showLoading({ title: "加载中", mask: true });
      await app.init();
      return await api.adhocReservation
        .getDates({
          projectCode: appointment?.projectCode,
          counterCode: appointment?.storeCode,
        })
        .then((res) => res.data)
        .then((list) => {
          Taro.hideLoading();
          return list;
        });
    },
    {
      manual: true,
    },
  );

  useEffect(() => {
    if (appointment?.storeCode && appointment?.projectCode) {
      getDates();
      mutateTime([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appointment?.storeCode, appointment?.projectCode, getDates]);

  /**
   * 可预约的时间
   */
  const {
    data: timePeriodViews = [],
    run: getTimePeriodViews,
    mutate: mutateTime,
  } = useRequest(
    async () => {
      Taro.showLoading({ title: "加载中", mask: true });
      await app.init();
      return await api.adhocReservation
        .getPeriods({
          projectCode: appointment?.projectCode,
          counterCode: appointment?.storeCode,
          date: appointment?.bookableDate,
        })
        .then((res) => res.data)
        .then((list) => {
          Taro.hideLoading();
          let bookableDate = appointment?.bookableDate.replace(/-/g, "/");

          if (dayjs().isSame(dayjs(bookableDate).subtract(1, "day"), "day")) {
            list = list.filter((i: any) => {
              if (
                dayjs().isBefore(
                  dayjs(`${bookableDate} ${i.beginTime}`).subtract(1, "day"),
                )
              ) {
                return i;
              }
            });
          }

          return list.map((i: any) => {
            i.previewPeriod = i.period;
            if (i.status === 0) {
              i.previewPeriod = `${i.period} (已满)`;
            }
            return i;
          });
        });
    },
    {
      manual: true,
    },
  );

  useEffect(() => {
    if (
      appointment?.storeCode &&
      appointment?.projectCode &&
      appointment?.bookableDate
    ) {
      getTimePeriodViews();
    }
  }, [
    appointment?.storeCode,
    appointment?.projectCode,
    appointment?.bookableDate,
    getTimePeriodViews,
  ]);

  /**
   * 展示门店名称
   */
  const computedStoreName = useMemo(() => {
    return (
      counterList.find((i: any) => i.storeCode === appointment.storeCode)
        ?.storeName || ""
    );
  }, [appointment.storeCode, counterList]);

  const checkParams = async () => {
    // if (num <= 0) {
    //   toast("您暂无预约的机会");
    //   return Promise.reject();
    // }
    if (!appointment.projectCode) {
      toast("请选择服务项目");
      return Promise.reject();
    } else if (!appointment.storeCode) {
      toast("请选择服务门店");
      return Promise.reject();
    } else if (!appointment.bookableDate) {
      toast("请选择服务日期");
      return Promise.reject();
    } else if (!appointment.timePeriod) {
      toast("请选择服务时间");
      return Promise.reject();
    }
  };
  const subMsg = useSubMsg();

  /**
   * 服务提交
   */
  const onSubmit = async () => {
    if (!userInfo?.isMember) {
      to("/pages/registerSecond/index");
      return;
    }

    await checkParams();
    await subMsg("SERVICE");
    Taro.showLoading({ title: "加载中", mask: true });

    let beginTime = `${appointment.bookableDate} ${
      appointment.timePeriod.split("-")[0]
    }:00`;
    let endTime = `${appointment.bookableDate} ${
      appointment.timePeriod.split("-")[1]
    }:00`;

    if (initData) {
      //更新
      await api.adhocReservation.modify({
        beginTime,
        endTime,
        bookCode: initData.bookCode,
        counterCode: appointment.storeCode,
        serviceProject: initData.projectCode,
      });
      close();
      Taro.hideLoading();
      callback && callback();
    } else {
      // 提交
      let res = await api.adhocReservation.submit({
        beginTime,
        endTime,
        serviceProject: appointment.projectCode,
        serviceType: appointment?.serviceType,
        storeId: appointment.storeCode,
      });
      close();
      Taro.hideLoading();
      addActions("CONFIRM_EFFECTIVE_LEADS");
      to(`/subPages/service/detail/index?bookCode=${res.data.bookid}`);
    }
  };

  return (
    <View className="index">
      <View className="w-screen h-screen fixed left-0 top-0 z-10000">
        <View
          className="w-screen h-screen fixed left-0 top-0"
          catchMove
          style={{
            backgroundColor: "rgba(0,0,0,.5)",
          }}
        ></View>

        {/* 预约Form */}
        {!sureShow ? (
          <View
            catchMove
            className="fixed left-0 bottom-0 z-12000  w-750 bg-white flex items-center flex-col rounded-t-40 pb-70"
          >
            <CImage
              className="w-30 h-30 absolute top-30 right-30"
              src={Close}
              onClick={close}
            ></CImage>
            <View>
              <View className="text-center mt-70 text-36">预约信息</View>
              <View className="mt-60">
                <MultiplePicker
                  isCascadeData={false}
                  cascadeCount={3}
                  pickerData={counterList}
                  modelValue={initCounterData}
                  customKeyList={["provinceName", "areaName", "storeName"]}
                  callback={(e: any) => {
                    if (!e.storeCode) return;
                    setAppointment({
                      storeCode: e.storeCode,
                      bookableDate: "",
                      timePeriod: "",
                    });
                  }}
                >
                  <View className="w-600 h-90 px-30 box-border vhCenter justify-between borderBlack">
                    <View>门店</View>
                    <View className="flex-1 flex justify-end">
                      <Text>{computedStoreName}</Text>
                      <CImage className="w-24 h-20 ml-10" src={P11}></CImage>
                    </View>
                  </View>
                </MultiplePicker>
              </View>
              <View className="mt-30">
                <Picker
                  mode="selector"
                  range={dates}
                  rangeKey="bookableDate"
                  onChange={(e) => {
                    const { value } = e.detail;
                    let bookableDate = dates?.[value]?.bookableDate;
                    if (bookableDate) {
                      setAppointment({
                        bookableDate: bookableDate,
                        timePeriod: "",
                      });
                    }
                  }}
                >
                  <View className="w-600 h-90 px-30 box-border vhCenter justify-between borderBlack">
                    <View>日期</View>
                    <View className="flex-1 flex justify-end">
                      <Text>{appointment?.bookableDate}</Text>
                      <CImage className="w-24 h-20 ml-10" src={P11}></CImage>
                    </View>
                  </View>
                </Picker>
              </View>
              <View className="mt-30">
                <Picker
                  mode="selector"
                  range={timePeriodViews}
                  rangeKey="previewPeriod"
                  onChange={(e) => {
                    const { value } = e.detail;
                    let temp = timePeriodViews?.[value];
                    if (temp?.previewPeriod?.includes("已满")) {
                      return toast("该时段已约满");
                    }
                    setAppointment({
                      timePeriod: temp?.period,
                    });
                  }}
                >
                  <View className="w-600 h-90 px-30 box-border vhCenter justify-between borderBlack">
                    <View>时间</View>
                    <View className="flex-1 flex justify-end">
                      <Text>{appointment?.timePeriod}</Text>
                      <CImage className="w-24 h-20 ml-10" src={P11}></CImage>
                    </View>
                  </View>
                </Picker>
              </View>
            </View>

            <View
              className="w-300 text-26 h-80 m-auto bg-black text-white vhCenter borderWhite mt-100"
              onClick={async () => {
                project &&
                  addBehavior(`SUBMIT_RESERVATION_${project.projectCode}`);
                await checkParams();
                setTrue();
              }}
            >
              立 即 预 约
            </View>
            <View className="w-full text-center text-20 mt-32 text-black">
              更多可预约时间，点击咨询
              <Text
                className="underline"
                onClick={() =>
                  to(
                    "/pages/h5/index?url=https://cnaipswx1v1-stg.shiseido.cn/nars/home",
                  )
                }
              >
                专属彩妆师
              </Text>
            </View>
          </View>
        ) : (
          <View>
            <View className="fixed left-p50 top-p55 transform translate-y-n50 translate-x-n50 z-12000 w-600 bg-white flex items-center flex-col pb-40">
              <CImage
                className="w-30 h-30 absolute top-30 right-30"
                src={Close}
                onClick={close}
              ></CImage>
              <View className="mt-60 text-32">确认信息</View>
              <View className="mt-80 text-22">{appointment?.projectName}</View>
              <View className="mt-20 text-22">{computedStoreName}</View>
              <View className="mt-20 text-22">
                {dayjs(appointment?.bookableDate).format("YYYY.MM.DD")}{" "}
                {appointment?.timePeriod}
              </View>
              <View className="mt-80 text-24 flex">
                <View
                  className="w-220 h-70 vhCenter borderBlack text-black mr-30 box-border"
                  onClick={() => {
                    project &&
                      addBehavior(
                        `UNCONFIRM_RESERVATION_${project.projectCode}`,
                      );
                    close();
                  }}
                >
                  取消
                </View>
                <View
                  className="w-220 h-70 vhCenter bg-black text-white"
                  onClick={() => {
                    project &&
                      addBehavior(`CONFIRM_RESERVATION_${project.projectCode}`);
                    onSubmit();
                  }}
                >
                  确认
                </View>
              </View>
              <View className="mt-80 text-center text-22">
                *服务开始前{modifyTime}小时不可修改和取消
              </View>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};
export default Index;
