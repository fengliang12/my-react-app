import Taro from "@tarojs/taro";
import { useAsyncEffect } from "ahooks";
import { flatMap } from "lodash";
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
    if (res?.data?.length) {
      res.data.forEach((item) => {
        item.parentId = "root";
      });
      setOriginData({ children: res.data, id: "root" });
      return;
    }
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

  const findNodeById = (tree, targetCode) => {
    for (const node of tree) {
      if (node.code === targetCode) return node;
      if (node.children) {
        const found = findNodeById(node.children, targetCode);
        if (found) return found;
      }
    }
    return null;
  };

  const getLeafIds = (node) => {
    return flatMap(node.children || [], (child) =>
      child.children ? getLeafIds(child) : child.code,
    );
  };

  /**
   * 根据指定的id，获取该层级下所有最后以一个层级的id
   * @param targetId
   * @returns
   */
  const getLastLeafIds = (targetCode) => {
    let tree = originData.children;
    const targetNode = findNodeById(tree, targetCode);
    if (targetNode) {
      const leafCodes = getLeafIds(targetNode);
      console.log("leafCodes", leafCodes); // 输出: [6]（节点 5 下的叶子节点）
      return leafCodes;
    }
    return [];
  };

  return {
    /** 原始组织架构数据 */
    originData,
    /** 当前登录者的企业微信组织架构 */
    currentDataList,
    /** 当前登录者的企业微信组织架构索引 */
    currentIndexList,
    /** 根据指定的id，获取该层级下所有最后以一个层级的id */
    getLastLeafIds,
    findPath,
  };
};
