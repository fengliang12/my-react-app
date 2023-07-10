import { layout } from "../config/index";
import http from "./axios";


/** 根据页面实例Id获取页面内容 */
export const getPageById = (params) =>
  http.get(
    `/sp-portal/store/${layout.config.storeCode}/page_setting_new/page/${params.id}`,
    {
      params: {
        date: params.date,
        type: params.type
      },
    }
  );

/** 根据页面Code获取页面内容 */
export const getPageByCode = (code) =>
  http.get(
    `/sp-portal/store/${layout.config.storeCode}/page_setting_new/page/code/${code}`
  );

/** 根据主题页面Code获取页面内容 */
export const getThemePageByCode = (params) =>
  http.get(
    `/sp-portal/store/${layout.config.storeCode}/page_setting_new/page/theme/${params.code}`,
    {
      params: {
        word: params.word,
      },
    }
  );
/** 获取订阅人数 */
export const getSubscribeCountByRoomId = (data) => http.post(`/sp-portal/store/${layout.config.storeCode}/subscribeRecord/hasSubscribeMulti`, data)
