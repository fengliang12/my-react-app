import Taro from "@tarojs/taro";
import { useRequest } from "ahooks";

import api from "@/src/api";

const app: App.GlobalData = Taro.getApp();
const useProject = () => {
  const { data: num, run: getNum } = useRequest(
    async (projectCode) => {
      Taro.showLoading({ title: "加载中", mask: true });
      await app.init();
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

  const { data: project } = useRequest(async () => {
    Taro.showLoading({ title: "加载中", mask: true });
    await app.init();
    let res = await api.adhocReservation.getProjects();
    let tempItem = res?.data?.[0] || {};
    getNum(tempItem?.projectCode);
    Taro.hideLoading();
    return tempItem;
  });

  return { project, num, getNum };
};

export default useProject;
