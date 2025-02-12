import Taro, { useDidShow } from "@tarojs/taro";
import { useAsyncEffect, useMemoizedFn } from "ahooks";
import { useMemo, useState } from "react";

import api from "@/src/api";
import { codeMapValue } from "@/src/utils";
import addBehavior from "@/src/utils/addBehavior";
import toast from "@/src/utils/toast";

const app: App.GlobalData = Taro.getApp();

const useActivityHook = (pageType?: string) => {
  const [activityDetail, setActivityDetail] = useState<any>({});
  const [activityId, setActivityId] = useState<string>("");
  const [canActive, setCanActive] = useState<boolean>(false);

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
    } else {
      toast("数据字典中没有配置活动编码");
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
    await addBehavior({
      /** 渠道标识(公众号、小程序、PC、线下门店) = ['wm', 'wa', 'pc', 'store'] */
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
