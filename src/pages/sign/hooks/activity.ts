import Taro, { useDidShow } from "@tarojs/taro";
import { useAsyncEffect, useMemoizedFn } from "ahooks";
import { useMemo, useState } from "react";

import api from "@/src/api";
import { codeMapValue, isBetween } from "@/src/utils";

const app: App.GlobalData = Taro.getApp();

const useActivityHook = (pageType?: string) => {
  const [activityDetail, setActivityDetail] = useState<any>({});
  const [activityId, setActivityId] = useState<string>("");
  const [canActive, setCanActive] = useState<boolean>();
  const [inTime, setInTime] = useState<boolean>(false);

  useAsyncEffect(async () => {
    let userInfo = await app.init();
    let res = await api.common.findKvDataByType({
      type: "sign_activity_code",
    });

    if (res?.data?.[0]?.content) {
      const res1 = await api.clockin.getClockInActivityDetail(
        res?.data[0].content,
      );
      setActivityId(res?.data?.[0]?.content);
      setActivityDetail(res1?.data);
      setCanActive(res1?.data?.tags.includes(userInfo?.gradeName));
      setInTime(
        isBetween(res1?.data?.startTime, res1?.data?.endTime) &&
          res1?.data?.active,
      );
    } else {
      console.log("数据字典中没有配置活动编码");
    }
  }, []);

  const extendInfos = useMemo(() => {
    let setting = codeMapValue(activityDetail?.extendInfos);
    return setting;
  }, [activityDetail]);

  /**
   * 埋点
   */
  const addCustomerBehavior = useMemoizedFn(async (key: string) => {
    let userInfo = await app.init();
    const res = Taro.getLaunchOptionsSync();
    const { scene } = res;
    console.log("打卡埋点", key);

    await api.behavior.behavior({
      channelId: "wa",
      customInfos: [
        {
          name: "unionid",
          value: userInfo?.unionId ?? "",
        },
        {
          name: "member_id", //已经注册登录才上报
          value: userInfo?.memberId ?? "",
        },
        {
          name: "scene",
          value: String(scene) ?? "",
        },
      ],
      inValid: false,
      key: key,
      sourceId: activityId,
      took: 0,
      type: "CLOCKIN",
    });
  });

  useDidShow(() => {
    if (pageType) {
      addCustomerBehavior(pageType);
    }
  });

  return {
    /** 是否有权限参加 */
    canActive,
    /** 是否在活动时间 */
    inTime,
    /** 活动id：取值字典 */
    activityId: activityId,
    /** 活动详情 */
    activityDetail,
    /** 活动扩展信息 */
    extendInfos,
    setActivityDetail,
    /** 埋点 */
    addCustomerBehavior,
  };
};

export default useActivityHook;
