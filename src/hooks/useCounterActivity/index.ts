import Taro from "@tarojs/taro";
import { useRef, useState } from "react";

import api from "@/src/api";
import { isBetween } from "@/src/utils";

/**
 * 门店扫码活动
 */
const app = Taro.getApp();
const useCounterActivity = (
  props: {
    scene: string;
    callback?: (props: {
      type: "expired" | "success" | "joined";
      tipText?: string;
    }) => void;
  } = { scene: "" },
) => {
  let { scene, callback } = props;
  const [sendType, setSendType] = useState<string>("");
  const applyInfo = useRef<any>(null);

  /**
   * 获取活动信息
   */
  const getActivityDetail = async () => {
    if (!scene) return;
    let activityInfo = await api.apply.activityDetail(scene);
    setSendType(activityInfo?.data?.sendType || "");
    applyInfo.current = activityInfo.data;
  };

  /**
   * 参加活动
   */
  const joinActivity = async () => {
    if (
      !applyInfo.current ||
      !isBetween(applyInfo.current.from, applyInfo.current.to)
    ) {
      callback &&
        callback({ type: "expired", tipText: "当前时间不在活动时间范围内" });
    } else {
      let info = await app.init();
      Taro.showLoading({ title: "加载中", mask: true });
      let res = await api.apply.reserve({
        arrivalDate: new Date(),
        counterCode: applyInfo?.current?.counterList?.[0]?.code,
        id: scene,
        mobile: info.mobile,
      });
      Taro.hideLoading();

      if (res.data.code === "10000") {
        callback &&
          callback({
            type: "joined",
            tipText: "您已参与过此活动,\n敬请期待下次惊喜",
          });
      } else {
        callback && callback({ type: "success", tipText: "参与成功" });
      }
    }
  };
  return {
    sendType,
    applyInfo,
    getActivityDetail,
    joinActivity,
  };
};

export default useCounterActivity;
