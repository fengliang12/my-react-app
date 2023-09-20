import Taro from "@tarojs/taro";
import { useMemoizedFn } from "ahooks";

import SUBSCRIBE_MESSAGE from "@/config/subscribeMessage";

import api from "../api";

const record = (item) => Promise.resolve(item);
const SubMsg = () =>
  useMemoizedFn(async (type, once = false) => {
    if (!type) return Promise.resolve(false);
    let msg = SUBSCRIBE_MESSAGE[type] || [];
    const tmplCodes = msg.map((item) => item.subscribeId);
    const ByTemplateId = await api.common.findSubscribeByCode(tmplCodes);
    let tmplIds = ByTemplateId.data.map((item) => item.templateId);
    if (!tmplIds.length) return Promise.resolve(false);
    return new Promise(async (resolve) => {
      if (once) {
        const res = await Promise.all(tmplIds.map((item) => record(item)));
        tmplIds = tmplIds.filter((_item, index) => res[index]);
      }
      if (!tmplIds.length) return resolve(false);
      Taro.requestSubscribeMessage({
        tmplIds: tmplIds,
        success(res) {
          const saveList = ByTemplateId.data
            .filter((item) => res[item.templateId] === "accept")
            .map((saveItem) => {
              return {
                stage: msg.find((m) => m.subscribeId === saveItem.id).stage,
                subscribeId: saveItem.id,
              };
            });
          if (saveList.length) {
            api.common.multiSubscribeByCode(saveList);
          }
          resolve(res);
        },
        fail(err) {
          console.log(err);
          resolve(false);
        },
      });
    });
  });

export default SubMsg;
