import { layout } from "../config/index";
import http from "./axios";

/** 根据页面实例Id获取页面内容 */
export const getPageById = params =>
  http.get(
    `/sp-portal/store/${layout.config.storeCode}/page_setting_new/page/${params.id}`,
    {
      params: {
        date: params.date,
        type: params.type,
        showInValid: params.showInValid
      }
    }
  );

/** 根据页面实例Id获取页面预加载数据 */
export const getPagePreloadById = params =>
  http.get(
    `/sp-portal/store/${layout.config.storeCode}/page_setting_new/page/simple/${params.id}`,
    {
      params: {
        date: params.date,
        type: params.type
      }
    }
  );

/** 根据页面Code获取页面内容 */
export const getPageByCode = (code, params) =>
  http.get(
    `/sp-portal/store/${layout.config.storeCode}/page_setting_new/page/code/${code}`,
    {
      params
    }
  );

/** 根据页面Code获取页面预加载数据 */
export const getPagePreloadByCode = code =>
  http.get(
    `/sp-portal/store/${layout.config.storeCode}/page_setting_new/page/code/simple/${code}`
  );

/** 根据主题页面Code获取页面内容 */
export const getThemePageByCode = params =>
  http.get(
    `/sp-portal/store/${layout.config.storeCode}/page_setting_new/page/theme/${params.code}`,
    {
      params: {
        word: params.word,
        showInValid: params.showInValid
      }
    }
  );

/** 根据主题页面Code获取页面预加载数据 */
export const getThemePagePreloadByCode = params =>
  http.get(
    `/sp-portal/store/${layout.config.storeCode}/page_setting_new/page/theme/simple/${params.code}`
  );

/** 获取订阅人数 */
export const getSubscribeCountByRoomId = data =>
  http.post(
    `/sp-portal/store/${layout.config.storeCode}/subscribeRecord/hasSubscribeMulti`,
    data
  );

/** 触发订阅活动点位 */
export const sendScribeRecord = data =>
  http.post(
    `/sp-portal/store/${layout.config.storeCode}/subscribeRecord/multi`,
    data
  );

/** 查询是否订阅 */
export const checkScribeRecord = data =>
  http.post(
    `/sp-portal/store/${layout.config.storeCode}/subscribeRecord/hasSubscribeMulti`,
    data
  );
