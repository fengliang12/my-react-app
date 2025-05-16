// import { getSceneObject, init } from "@lw/mini/utils";
import Taro, { useRouter } from "@tarojs/taro";

import api from "@/src/api";
import { getSceneObject } from "@/src/utils";

type params = {
  button?: string; //触发按钮 ,
  clickId?: string; //触发Id ,
  formId: string; //业务Id ,
  formType: string; //业务类型 ,
  pagePath?: string; //页面url ,
  pageName?: string; //页面名称
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

/**
 * 创建路径
 * @param pageInfo 页面信息
 * @param query
 * @param scene
 * @returns
 */
export const buildPath = (
  pageInfo: { route?: string; [key: string]: any },
  query: Record<string, any>,
  scene: number,
): string => {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined) params.append(key, String(value));
  });

  params.append("scene", String(scene));
  return `${pageInfo.route}?${params.toString()}`;
};

export const trackingFn = async (params: params) => {
  /**
   * 企业微信不执行 tracking
   */
  if (Taro.getSystemInfoSync().environment == "wxwork") {
    return;
  }
  const { scene } = Taro.getEnterOptionsSync();
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
  let path = buildPath(pageInfo, query, scene);
  try {
    Taro.getApp()
      .init()
      .then(() => {
        api.behavior.behavior({
          key: path,
          type: "PAGE_VIEW",
        });
      });
  } catch (err) {}
};

const useTracking = () => {
  const tracking = (params) => {
    trackingFn(params);
  };
  return { tracking };
};

export default useTracking;
