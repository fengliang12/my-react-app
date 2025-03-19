import Taro from "@tarojs/taro";
import { useAsyncEffect } from "ahooks";
import { useState } from "react";

import api from "@/src/api";

const app = Taro.getApp();
export const useHandleOrganization = () => {
  const [originData, setOriginData] = useState<any>({});
  const [currentIndexList, setCurrentIndexList] = useState<any>();
  const [currentDataList, setCurrentListData] = useState<any>();

  useAsyncEffect(async () => {
    await app.init();
    let res = await api.qy.getRegionStore();
    setOriginData({ children: res.data, id: "1" });
  }, []);

  /**
   * 根据id获取当前企业微信用户的组织架构
   * @param tree
   * @param targetId
   * @param path
   * @returns
   */
  const findPath = (
    tree,
    targetId,
    dataList: any[] = [],
    indexList: number[] = [],
  ) => {
    for (let i = 0; i < tree.length; i++) {
      let node = tree[i];
      if (node.id === targetId) {
        return {
          indexList: indexList.concat(i),
          dataList: dataList.concat(node),
        };
      }
      if (node.children) {
        const found = findPath(
          node.children,
          targetId,
          dataList.concat(node),
          indexList.concat(i),
        );
        if (found) {
          return found;
        }
      }
    }
    return null;
  };
  return {
    /** 原始组织架构数据 */
    originData,
    /** 当前登录者的企业微信组织架构 */
    currentDataList,
    /** 当前登录者的企业微信组织架构索引 */
    currentIndexList,
    findPath,
  };
};
