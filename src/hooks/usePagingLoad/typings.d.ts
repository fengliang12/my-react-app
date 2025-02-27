import { PublicPage } from "@lw/api/types";
import { Options } from "ahooks/lib/useRequest/src/types";

export type setStateFnType<T> = (e: T | ((T) => T)) => void;

export type PropsType<T> = {
  getList: (e: { page: number }) => Promise<PublicPage.IResponse<T>>;
  requestOptions?: Options<any, any>;
};
export type usePagingLoadTypeResult<T> = {
  // 设置列表
  setList: setStateFnType<T[]>;
  // setList: (value: T[] | (() => T[])) => void;
  //初始化分页刷新
  resetRefresh: () => void;
  //滚动到底部加载
  onScrollToLower: () => void;
  // 是否滚动到底部
  isBottom: boolean;
  // 是否加载中
  loading: boolean;
  // 请求到list
  list: T[];
  // 取消请求
  cancel: () => void;
  // 运行
  run: () => void;
  // 总数
  total: number | undefined;
  /** 当前第几页 */
  currentPage: number;
  /** 总页数 */
  totalPages: number;
};
export type usePagingLoadType = <T>(
  props: PropsType<T>
) => usePagingLoadTypeResult<T>;
