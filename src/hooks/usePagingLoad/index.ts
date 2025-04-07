import { useMemoizedFn, useRequest } from "ahooks";
import { isNil } from "lodash-es";
import { useMemo, useRef, useState } from "react";

import { PropsType, usePagingLoadType } from "./typings";

export const getUnDataPagingLoad = () => ({
  content: [],
  size: 0,
  number: 0,
  totalElements: 0,
  totalPages: 0,
});
const usePagingLoad: usePagingLoadType = <T extends any>(
  props: PropsType<T>,
) => {
  const { getList, requestOptions } = props;
  const [list, setList] = useState<T[]>([]);
  /** 页数 */
  const page = useRef<number>(0);
  /** 总条数 */
  const total = useRef<number>();
  /** 总页数 */
  const totalPages = useRef<number>(0);
  const { run, loading, cancel } = useRequest(
    () => getList({ page: page.current }),
    {
      ...requestOptions,
      // manual: true,
      onSuccess: (result) => {
        const {
          content = [],
          totalElements,
          totalPages: totalPagesNumber,
        } = result;
        totalPages.current = totalPagesNumber;
        total.current = totalElements;
        if (page.current === 0) {
          setList(content);
        } else {
          setList((old) => {
            return old.concat(content);
          });
        }
      },
    },
  );
  const time = useRef<any>(0);
  /** 重置刷新 */
  const resetRefresh = useMemoizedFn(() => {
    if (time.current) {
      clearTimeout(time.current);
      time.current = 0;
    }

    time.current = setTimeout(() => {
      // setList([]);
      //取消上次触发请求
      cancel();
      page.current = 0;
      // 调用请求
      run();
    }, 100);
  });
  /** 到达底部 */
  const isBottom = useMemo<boolean>(() => {
    if (!isNil(total.current) && list?.length >= total.current) {
      return true;
    }
    return false;
  }, [list]);
  /** 滚动加载更多 */
  const onScrollToLower = useMemoizedFn(() => {
    if (loading || isBottom) {
      // console.log("已经到达底部 或 加载中");
      return;
    }
    page.current++;
    run();
  });
  return {
    /** 设置列表数据 */
    setList,
    /** 重置刷新  */
    resetRefresh,
    /** 滚动到底部加载 */
    onScrollToLower,
    /** 是否滚动到底部 */
    isBottom,
    /** 是否加载中 */
    loading,
    /** 请求到list */
    list,
    /** 取消请求 */
    cancel,
    /** 发起请求 */
    run,
    /** 总条数 */
    total: total.current,
    /** 当前第几页 */
    currentPage: page.current + 1,
    /** 总页数 */
    totalPages: totalPages.current,
  };
};
export default usePagingLoad;
