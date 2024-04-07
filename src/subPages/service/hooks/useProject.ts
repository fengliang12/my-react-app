import Taro, { useDidShow } from "@tarojs/taro";
import { useRequest } from "ahooks";
import { useState } from "react";

import api from "@/src/api";

const app: App.GlobalData = Taro.getApp();
const useProject = () => {
  const [reason, setReason] = useState<any>(null);

  const { data: num, run: getNum } = useRequest(
    async (projectCode) => {
      Taro.showLoading({ title: "加载中", mask: true });
      let userInfo = await app.init();
      if (!userInfo?.isMember) return 0;

      let res = await api.adhocReservation.getNum({
        projectCode,
      });
      Taro.hideLoading();
      return res?.data > 0 ? res?.data : 0;
    },
    {
      manual: true,
    },
  );

  const { data: project, run: getProject } = useRequest(
    async () => {
      Taro.showLoading({ title: "加载中", mask: true });
      await app.init();

      let res = await api.adhocReservation.getProjects();
      let tempItem = res?.data?.[0] || {};
      getNum(tempItem?.projectCode);
      setReason(JSON.parse(tempItem?.reason));
      Taro.hideLoading();
      return tempItem;
    },
    {
      manual: true,
    },
  );

  useDidShow(() => {
    getProject();
  });
  return { project, num, getNum, reason };
};

export default useProject;
