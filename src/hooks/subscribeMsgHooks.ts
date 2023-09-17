import api from "@/api";
import Taro from "@tarojs/taro";
import {useMemoizedFn} from "ahooks";

const subscribeMsgHooks = () => useMemoizedFn(async (msg) => {
  if (!msg.length) return Promise.resolve(false);
  const tmplCodes = msg.map(item => item.subscribeId);
  const ByTemplateId = await api.common.findSubscribeByCode(tmplCodes)
  const tmplIds = ByTemplateId.data.map(item => item.templateId);
  return new Promise(async (resolve) => {
    Taro.requestSubscribeMessage({
      tmplIds: tmplIds,
      success(res) {
        const saveList = ByTemplateId.data.filter(item => res[item.templateId] === 'accept')
        .map(saveItem => {
          return {
            stage: msg.find(m=>m.subscribeId === saveItem.id).stage,
            subscribeId: saveItem.id,
          }
        })
        if(saveList.length) {
          api.common.multiSubscribeByCode(saveList)
        }
        resolve(Object.assign(res,{result:saveList.length?true:false}));
      },
      fail(err) {
        resolve(false);
      },
    })
  })
});

export default subscribeMsgHooks;
