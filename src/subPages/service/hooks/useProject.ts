import Taro, { useDidShow } from "@tarojs/taro";
import { useMemoizedFn, useRequest } from "ahooks";
import { useEffect, useState } from "react";

import api from "@/src/api";

const app: App.GlobalData = Taro.getApp();

const useProject = (currentIndex: number = 0) => {
  const [reason, setReason] = useState<any>(null);
  const [project, setProject] = useState<any>(null);

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

  const { data: projectList, run: getProject } = useRequest(
    async () => {
      Taro.showLoading({ title: "加载中", mask: true });
      await app.init();
      let res = await api.adhocReservation.getProjects();
      Taro.hideLoading();
      return res?.data;
    },
    {
      manual: true,
    },
  );

  /**
   * 选择对应的projetc
   */
  const [selectIndex, setSelectIndex] = useState<number>(currentIndex);

  useEffect(() => {
    if (projectList && projectList?.length > 0) {
      console.log(111);

      if (projectList && projectList?.length > 0) {
        let tempItem = projectList?.[selectIndex] || {};
        setProject(tempItem);
        getNum(tempItem?.projectCode);
        setReason(JSON.parse(tempItem?.reason));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectList, selectIndex]);

  useDidShow(() => {
    getProject();
  });
  return {
    project,
    projectList,
    num,
    getNum,
    reason,
    selectIndex,
    setSelectIndex,
  };
};

export default useProject;
