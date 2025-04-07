import Taro from "@tarojs/taro";

import api from "@/src/api";

/**
 * 短链埋点
 */

const schemaTrack = async () => {
  const app: App.GlobalData = Taro.getApp();
  await app.init();
  await app.init();
  await app.init();
  const res = Taro.getLaunchOptionsSync();
  const { scene, query } = res;
  const list = [1194, 1065];
  console.log("短链埋点", scene, query);
  if (list.includes(scene) && query?.lw_chan_id) {
    await api.common.addBehavior({
      type: "SmsCodeMapping",
      value: query?.lw_chan_id,
    });
  }
};
export { schemaTrack };
