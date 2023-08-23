/**
 * 公用类型声明
 */
declare namespace Model {
  /** 通用接口返回对象 */
  interface IResponse<T = any> {
    /** 接口返回数据 */
    data: T;
    /** 接口返回状态码 */
    status: number;
    /** 接口返回状态信息 */
    statusText: string;
    /** 接口Response Header */
    headers?: any;
    /** 接口Request请求总数据 */
    config: any;
  }

  /** 通用接口返回对象Promise */
  interface IResponsePromise<T = any> extends Promise<IResponse<T>> {}

  /** 自定义Error对象 */
  interface IError {
    /** 自定义错误码 */
    code: string;
    /** 自定义错误信息 */
    message: string;
  }

  /** 分页 */
  interface IPaging<T = any> {
    /** 类目下实际信息 */
    content: T;
    /** 当前页是否是第一页 */
    first: boolean;
    /** 当前页是否是最后一页 */
    last: boolean;
    /** 当前页的页码 */
    number: number;
    /** 当前页的数量(如果不是最后一页，此值应该和你填写的size一样) */
    numberOfElements: number;
    /** 排序相关 */
    pageable: IPageable;
    /** 入参请求的数量（每页请求多少个） */
    size: number;
    /** 排序相关 */
    sort: ISort;
    /** 总数量 */
    totalElements: number;
    /** 总页数 */
    totalPages: number;
  }

  /** 排序相关 */
  interface IPageable {
    /** page*size的理论数量 */
    offset: number;
    /** 当前页的页码 */
    pageNumber: number;
    /** 每页请求的数量 */
    pageSize: number;
    /** 是否指定了页码（没有指定，默认从page为0，size:20） */
    paged: boolean;
    /** 排序相关 */
    sort: ISort;
    /** 是否没有指定页码 */
    unpaged: boolean;
  }

  /** 排序相关 */
  interface ISort {
    /** 入参是否 填写了sort方法，false标识没写 */
    sorted: boolean;
    /** 入参是否 没填了sort方法，true标识没写 */
    unsorted: boolean;
  }

  /** axios配置信息 */
  interface IAxiosConfig {
    /** 是否showError */
    showError?: boolean;
  }
}

/**
 * 通用接口返回对象Promiset 简称
 */
type MRP<T> = Model.IResponsePromise<T>;

/**
 * 通用分页接口 简称
 */
type PG<T> = Model.IPaging<T>;

type IAxiosConfig = Model.IAxiosConfig;
