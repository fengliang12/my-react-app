import Taro from "@tarojs/taro";
import { useMemoizedFn } from "ahooks";

import api from "../api";

const app = Taro.getApp();
const AddUserActions = () => {
  /**
   * 添加用户埋点
   */
  const addActions = useMemoizedFn(async (type) => {
    let {
      path,
      query: { gdt_vid },
    } = app?.globalData?.initOptions ?? {};

    if (!gdt_vid || path !== "subPages/service/index") return;
    let userInfo = await app.init();

    await api.apply.addUserActions({
      actionType: type,
      openId: userInfo?.openId,
      clickId: gdt_vid, // 落地页URL中的click_id，对于微信流量为URL中的gdt_vid，格式为『wx0ewinbalytptma00』或『wx0ewinbalytptma』 ,
      actionValue: 0,
      goodsIds: [],
    });
  });

  return {
    addActions,
  };
};

export default AddUserActions;
