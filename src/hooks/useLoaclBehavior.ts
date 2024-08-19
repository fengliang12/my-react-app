import Taro, { useDidShow, useRouter } from "@tarojs/taro";
import { useMemoizedFn } from "ahooks";

import api from "../api";

const app = Taro.getApp();

let time: any = null;
const LoaclBehavior = (type: string) => {
  let { params } = useRouter();

  /**
   * 添加用户埋点
   */
  const addBehavior = useMemoizedFn(async (key) => {
    let userInfo = await app.init();
    if (time) return;
    time = setTimeout(async () => {
      clearTimeout(time);
      time = null;
    }, 100);

    if (params?.storeCode || params?.channel) {
      let customInfos: Api.Behavior.CustomInfos[] = [
        {
          name: "unionid",
          value: userInfo?.unionId,
        },
        {
          name: "counterId",
          value: params?.storeCode,
        },
      ];

      //会员添加member_id
      if (userInfo?.isMember) {
        customInfos.push({
          name: "member_id",
          value: userInfo?.marsId,
        });
      }

      await api.behavior.behavior({
        channelId: params.channel,
        customInfos: customInfos,
        inValid: false,
        key: key,
        sourceId: params.channel,
        took: 0,
        type: type,
      });
    }
  });

  // useDidShow(() => {
  //   if (params?.storeCode && params?.channel) {
  //     console.log("11111111");
  //   }
  // });

  return {
    addBehavior,
  };
};

export default LoaclBehavior;
