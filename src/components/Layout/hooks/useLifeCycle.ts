import { useDidHide, useDidShow } from "@tarojs/taro";
import { useEffect, useRef, useState } from "react";
import { useMemoizedFn } from "ahooks";
import { get, set, cloneDeep } from "lodash-es";
import { pageStore } from "./../store/index";
import useApi from "./useApi";

type LifeCycle = "show" | "hide" | "load";

export default function useLifeCycle() {
  const lifeCycleRef = useRef();
  const pageViewModel = useRef<any>(null);
  const pageIdRef = useRef();
  const { loadApiData } = useApi();
  const [isInit, setIsInit] = useState(false);
  const initLifeCycle = useMemoizedFn(async (lifeCycle, pageId) => {
    lifeCycleRef.current = lifeCycle;
    pageViewModel.current = cloneDeep(lifeCycle?.viewModel);
    pageIdRef.current = pageId;
    setIsInit(true);
  });
  /** 执行生命周期 */
  const lifeCycleFun = useMemoizedFn(async (status?: LifeCycle) => {
    const params = lifeCycleRef.current?.[status!];
    if (params) {
      executiveFuns(params);
    }
  });
  /** 递归执行方法 */
  const executiveFuns = useMemoizedFn(list => {
    list?.forEach(async item => {
      const isToNext = await doFun(item);
      if (isToNext && item?.children) {
        executiveFuns(item.children);
      } else {
        pageStore.initPage(pageViewModel.current, pageIdRef.current);
      }
    });
  });
  /** 执行具体方法 */
  const doFun = useMemoizedFn(async item => {
    if (item.type === "api") {
      return await doApi(item);
    }
    return false;
  });
  /** 执行API相关方法 */
  const doApi = useMemoizedFn(async item => {
    const result = await loadApiData(item.config, pageIdRef.current);
    if (result) {
      item.setDatas?.forEach(x => {
        if (pageViewModel.current) {
          set(pageViewModel.current, x.viewKey, get(result, x.dataKey, result));
        }
      });
      return true;
    }
    return false;
  });

  useDidShow(() => {
    lifeCycleFun("show");
  });
  useDidHide(() => {
    lifeCycleFun("hide");
  });
  useEffect(() => {
    if (isInit) {
      lifeCycleFun("load");
      // useDidShow第一次不执行
      lifeCycleFun("show");
    }
  }, [isInit]);
  return {
    initLifeCycle
  };
}
