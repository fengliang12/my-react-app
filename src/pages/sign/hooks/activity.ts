import Taro from "@tarojs/taro";
import { useAsyncEffect } from "ahooks";
import { useMemo, useState } from "react";

import api from "@/src/api";
import { codeMapValue } from "@/src/utils";
import toast from "@/src/utils/toast";

const app: App.GlobalData = Taro.getApp();

const useActivityHook = () => {
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

  return {
    canActive,
    activityId: activityId,
    activityDetail,
    extendInfos,
    setActivityDetail,
  };
};

export default useActivityHook;
