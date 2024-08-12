declare namespace Api {
  /**
   * 申领试用接口类型声明
   */
  namespace ArvatoReservation {
    /** 获取服务预约列表 */
    namespace Submit {
      /** 接口定义 */
      type FuncT = (data: IRequest) => MRP<IResponse>;

      type IRequest = {
        projectCode: string;
        reserveDate: string;
        storeId: string;
        timePeriod: string;
      };

      type IResponse = Item[];

      type Item = {
        projectCode: string;
        projectName: string;
        imageUrl: any;
        introduce: string;
        reason: string;
      };
    }
    /** 获取服务预约列表 */
    namespace GetProjects {
      /** 接口定义 */
      type FuncT = () => MRP<IResponse>;

      type IResponse = Item[];

      type Item = {
        imageKVList: Array<string>;
        detailList: Array<string>;
        projectCode: string;
        projectName: string;
        imageUrl: any;
        introduce: string;
        reason: string;
      };
    }

    /** 获取预约柜台 */
    namespace GetCounters {
      /** 接口定义 */
      type FuncT = (projectCode: string) => MRP<IResponse>;

      type IResponse = Item[];

      type Item = {
        sideCd: string;
        sideName: string;
        areaCd: string;
        areaName: string;
        storeId: string;
        storeName: string;
        telephone: any;
        address: any;
      };
    }

    /** 获取预约记录 */
    namespace GetRecords {
      /** 接口定义 */
      type FuncT = (params) => MRP<IResponse>;
      type params = {
        memberCode: string;
      };
      type IResponse = Item[];
      type Item = {
        bookId: number;
        storeId: string;
        imageUrl: string;
        storeName: string;
        serviceTime: string;
        storeAddr: string;
        status: string;
        projectCode: string;
        projectName: string;
        reserveDate: string;
        timePeriod: string;
        bookCode: string;
        signTime: any;
        signMan: any;
        storeCode: string;
        detailList: Array<string>;
        imageKVList: Array<string>;
      };
    }

    /** 获取预约时间 */
    namespace GetPeriods {
      /** 接口定义 */
      type FuncT = (storeId: string) => MRP<IResponse>;

      interface PeriodViews {
        reserveDate: string;
        timePeriod: string;
        bookable: number;
      }

      type IResponse = Item[];

      type Item = {
        reserveDate: string;
        periodViews: PeriodViews[];
      };
    }

    /** 获取服务预约列表 */
    namespace Modify {
      /** 接口定义 */
      type FuncT = (IRequest: IRequest) => MRP<IResponse>;

      type IRequest = {
        bookId: number;
        projectCode: string;
        storeId: string;
        reserveDate: string;
        type: 0 | 1 | -1;
      };
      type IResponse = Item[];

      type Item = {
        projectCode: string;
        projectName: string;
        imageUrl: any;
        introduce: string;
        reason: string;
      };
    }
  }
}
