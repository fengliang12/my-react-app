import { Picker, Text, View } from "@tarojs/components";
import Taro, { useRouter } from "@tarojs/taro";
import { useBoolean, useRequest } from "ahooks";
import dayjs from "dayjs";
import { useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";

import api from "@/api/index";
import { P6 } from "@/src/assets/image";
import BindDialog, { IRefProps } from "@/src/components/BindDialog";
import CHeader from "@/src/components/Common/CHeader";
import CImage from "@/src/components/Common/CImage";
import config from "@/src/config";
import useSubMsg from "@/src/hooks/useSubMsg";
import { handleTextBr } from "@/src/utils";
import to from "@/src/utils/to";
import toast from "@/src/utils/toast";

const app: App.GlobalData = Taro.getApp();

const Index = () => {
  const userInfo = useSelector((state: Store.States) => state.user);
  const bindRef = useRef<IRefProps>(null);
  const router = useRouter();
  const subMsg = useSubMsg();
  const [introduce, { setFalse }] = useBoolean(true);
  let { projectCode } = router.params;
  const [appointment, setAppointment] = useState<any>({
    projectCode: projectCode,
    reserveDate: "",
    storeId: "",
    timePeriod: "",
  });

  const { data: project = {} as Api.ArvatoReservation.GetProjects.Item } =
    useRequest(async () => {
      Taro.showLoading({ title: "加载中", mask: true });
      await app.init();
      return await api.arvatoReservation.getProjects().then((res) => {
        Taro.hideLoading();
        return (
          res.data.find((i) => i.projectCode === projectCode) ||
          ({} as Api.ArvatoReservation.GetProjects.Item)
        );
      });
    });

  const { data: counterList = [] } = useRequest(async () => {
    await app.init();
    return await api.arvatoReservation
      .getCounters(projectCode!)
      .then((res) => res.data);
  });

  /**
   * 可预约时间
   */
  const { data: periods = [], run: getPeriods } = useRequest(
    async (storeId) => {
      Taro.showLoading({ title: "加载中", mask: true });
      await app.init();
      return await api.arvatoReservation
        .getPeriods(storeId)
        .then((res) => res.data)
        .then((list) => {
          Taro.hideLoading();
          return list.map((i) => {
            i.reserveDate = dayjs(i.reserveDate).format("YYYY-MM-DD");
            return i;
          });
        });
    },
    {
      manual: true,
    },
  );

  /**
   * 可预约的时间
   */
  const timePeriodViews = useMemo(() => {
    if (appointment.reserveDate) {
      return (
        periods
          .find((i) => i.reserveDate === appointment.reserveDate)
          ?.periodViews.filter((i) => i.bookable === 1) || []
      );
    }
    return [];
  }, [appointment.reserveDate, periods]);

  /**
   * 展示门店名称
   */
  const computedStoreName = useMemo(() => {
    return (
      counterList.find((i) => i.storeId === appointment.storeId)?.storeName ||
      ""
    );
  }, [appointment.storeId, counterList]);

  const checkParams = () => {
    if (!appointment.projectCode) {
      toast("请选择服务项目");
      return Promise.reject();
    } else if (!appointment.storeId) {
      toast("请选择服务门店");
      return Promise.reject();
    } else if (!appointment.reserveDate) {
      toast("请选择服务日期");
      return Promise.reject();
    } else if (!appointment.timePeriod) {
      toast("请选择服务时间");
      return Promise.reject();
    }
  };

  /**
   * 服务提交
   */
  const onSubmit = async () => {
    if (!userInfo?.isMember) {
      bindRef.current && bindRef.current.setTrue();
      return;
    }

    if (introduce) {
      setFalse();
      return;
    }

    await checkParams();
    await subMsg("SERVICE");
    Taro.showLoading({ title: "加载中", mask: true });
    api.arvatoReservation
      .submit(appointment)
      .then((res: any) => {
        Taro.hideLoading();
        to(
          `/subPages/service-appointment/detail/index?bookId=${res.data.bookId}`,
          "redirectTo",
        );
      })
      .catch((err) => {
        if (err?.data?.message.includes("arvato")) {
          Taro.hideLoading();
          to(`/subPages/service-appointment/list/index`, "redirectTo");
          return;
        }
      });
  };

  return (
    <View className="service-introduce h-screen bg-black text-white flex flex-col overflow-hidden">
      <CHeader
        back
        titleImage={`${config.imgBaseUrl}/icon/title_image.png`}
        fill
        backgroundColor="rgba(0,0,0,1)"
        titleCss="height:85rpx"
        titleColor="#FFFFFF"
      ></CHeader>
      <CImage
        className="w-750"
        mode="widthFix"
        src={
          project?.detailList?.[0] ||
          `${config.imgBaseUrl}/appointment/detail/${projectCode}.png`
        }
      ></CImage>
      <View className="fixed top-220 left-50" style="color:#FFFFFF">
        <Text
          className="text-70 text-left mt-40 font-thin english_family"
          style="line-height:50rpx"
          decode
        >
          {handleTextBr(project?.introduce)}
        </Text>
        <View className="text-48 text-left font-thin mt-10">
          {project?.projectName}
        </View>
      </View>
      <View className="fixed bottom-150 left-0 h-700">
        {introduce ? (
          <View className="w-660 text-28 text-left font-thin ml-70">
            <Text>{project?.reason}</Text>
          </View>
        ) : (
          <View>
            <View className="mb-30">
              <Picker
                mode="selector"
                range={counterList}
                rangeKey="storeName"
                onChange={(e) => {
                  const { value } = e.detail;
                  if (!counterList?.[value]?.storeId) return;
                  setAppointment((prev) => ({
                    ...prev,
                    storeId: counterList[value].storeId,
                    reserveDate: "",
                    timePeriod: "",
                  }));
                  getPeriods(counterList[value].storeId);
                }}
              >
                <View
                  className="w-660 h-80 vhCenter ml-45"
                  style={{ border: "1px solid #FFFFFF" }}
                >
                  {!appointment.storeId ? (
                    <View className="ipt-placeholder vhCenter">
                      选择服务门店{" "}
                      <CImage className="w-24 h-20 ml-10" src={P6}></CImage>
                    </View>
                  ) : (
                    computedStoreName
                  )}
                </View>
              </Picker>
            </View>
            <View className="mb-30">
              <Picker
                mode="selector"
                range={periods}
                rangeKey="reserveDate"
                onChange={(e) => {
                  const { value } = e.detail;
                  setAppointment((prev) => ({
                    ...prev,
                    reserveDate: periods[value].reserveDate,
                    timePeriod: "",
                  }));
                }}
              >
                <View
                  className="w-660 h-80 vhCenter ml-45"
                  style={{ border: "1px solid #FFFFFF" }}
                >
                  {!appointment.reserveDate ? (
                    <View className="ipt-placeholder vhCenter">
                      选择服务日期
                      <CImage className="w-24 h-20 ml-10" src={P6}></CImage>
                    </View>
                  ) : (
                    appointment.reserveDate
                  )}
                </View>
              </Picker>
            </View>
            <View className="mb-30">
              <Picker
                mode="selector"
                range={timePeriodViews}
                rangeKey="timePeriod"
                onChange={(e) => {
                  const { value } = e.detail;
                  setAppointment((prev) => ({
                    ...prev,
                    timePeriod: timePeriodViews[value].timePeriod,
                  }));
                }}
              >
                <View
                  className="w-660 h-80 vhCenter ml-45"
                  style={{ border: "1px solid #FFFFFF" }}
                >
                  {!appointment.timePeriod ? (
                    <View className="ipt-placeholder vhCenter">
                      选择服务时间
                      <CImage className="w-24 h-20 ml-10" src={P6}></CImage>
                    </View>
                  ) : (
                    appointment.timePeriod
                  )}
                </View>
              </Picker>
            </View>
          </View>
        )}

        <View
          className="w-600 text-26 h-60 m-auto text-white vhCenter borderWhite mt-100 absolute bottom-0 left-75"
          onClick={onSubmit}
        >
          {introduce ? "即 可 预 约" : "提 交"}
        </View>
      </View>
      <BindDialog ref={bindRef as any}></BindDialog>
    </View>
  );
};
export default Index;
