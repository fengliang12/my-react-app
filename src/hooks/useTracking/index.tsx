// import { getSceneObject, init } from "@lw/mini/utils";
import Taro, { useRouter } from "@tarojs/taro";

import { getSceneObject } from "@/src/utils";
import AddBehavior from "@/src/utils/addBehavior";

type params = {
  button?: string; //触发按钮 ,
  clickId?: string; //触发Id ,
  formId: string; //业务Id ,
  formType: string; //业务类型 ,
  pagePath?: string; //页面url ,
  pageName?: string; //页面名称
  remark?: string; //备注 ,
  scene?: any; //场景值
  channel?: string; //渠道
};

const getCurrentPage = () => {
  const pages = Taro.getCurrentPages();
  return pages?.[pages.length - 1];
};
const restOption = async (option) => {
  if (!option?.scene) return;
  /**
   * 解析特殊参数
   */
  const res = await getSceneObject(option.scene).catch(() => {});
  if (!res) return;
  return {
    ...option,
    ...res,
  };
};
export const trackingFn = async (params: params) => {
  /**
   * 企业微信不执行 tracking
   */
  if (Taro.getSystemInfoSync().environment == "wxwork") {
    return;
  }
  const res = Taro.getEnterOptionsSync();
  const page = getCurrentPage();
  let pageInfo: {
    route?: string;
    query?: Record<string, any>;
  } = {};
  if (page) {
    pageInfo.route = `/${page.route}`;
    pageInfo.query = page?.options;
  } else {
    const route = Taro.getCurrentInstance()?.router;
    pageInfo.route = route?.path;
    const { $taroTimestamp, ...query } = route?.params ?? {};
    pageInfo.query = query;
  }
  /**
   * 兼容无限制太阳码配置
   */
  const query = (await restOption(pageInfo.query)) ?? pageInfo.query;

  try {
    const {
      pagePath = pageInfo?.route,
      clickId = query?.gdt_vid || query?.clickId, //朋友圈id
      channel = query?.channel || "normal", //渠道
    } = params;
    /**
     * 兼容remark
     */
    const remark = query ?? {};
    if (params?.remark) {
      remark.remark = params.remark;
    }
    const remarkStr = Object.keys(remark)?.length
      ? JSON.stringify(remark)
      : undefined;
    Taro.getApp()
      .init()
      .then(() => {
        AddBehavior({
          key: "PAGE_VIEW",
          customInfos: [
            {
              name: "pagePath",
              value: pagePath || "",
            },
            {
              name: "query",
              value: query || "",
            },
            {
              name: "remark",
              value: remarkStr || "",
            },
            {
              name: "scene",
              value: String(res.scene) || "",
            },
            {
              name: "channel",
              value: channel || "",
            },
            {
              name: "clickId",
              value: clickId || "",
            },
          ],
        });
      });
  } catch (err) {
    console.error("埋点失败", err);
  }
};

const useTracking = () => {
  const tracking = (params) => {
    trackingFn(params);
  };
  return { tracking };
};

export default useTracking;
