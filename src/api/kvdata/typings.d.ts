import { ExtendInfo } from "@lw/api";

/**
 * KVData
 */
export interface KVData {
  /**
   * 内容
   */
  content?: string;
  /**
   * 创建时间
   */
  createTime?: string;
  /**
   * 图标url
   */
  icon?: string;
  /**
   * 图标列表，用途：轮播图、侧边icon
   */
  iconList?: KVDataList[];
  id?: string;
  moduleId?: string;
  /**
   * 中文
   */
  namecn?: string;
  /**
   * 英文名
   */
  nameEn?: string;
  onlineTime?: string;
  /**
   * 是否启用
   */
  status?: string;
  /**
   * 类型
   */
  type?: string;
  /**
   * 使用类型（目前专属用于区分侧边icon）
   */
  useType?: string;
}

/**
 * KVDataList
 */
export interface KVDataList {
  extendInfos?: ExtendInfo[];
  /**
   * 有效期开始时间
   */
  from?: string;
  /**
   * 图片超链接
   */
  iconHref?: string;
  /**
   * 图片地址
   */
  iconUrl?: string;
  /**
   * 有效期结束时间
   */
  to?: string;
  [property: string]: any;
}
