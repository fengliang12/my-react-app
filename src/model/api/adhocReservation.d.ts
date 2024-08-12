declare namespace Api {
  /**
   * 申领试用接口类型声明
   */
  namespace AdhocReservation {
    /** 获取服务预约列表 */
    namespace Submit {
      /** 接口定义 */
      type FuncT = (data: IRequest) => MRP<IResponse>;

      type IRequest = {
        /** 预约开始时间 */
        beginTime: string;
        /** 预约结束时间 */
        endTime: string;
        /** 项目编号 */
        serviceProject: string;
        /** 服务类型 */
        serviceType: string;
        /** 门店 */
        storeId: string;
      };

      type IResponse = {
        bookid: string;
      };
    }
    /** 获取服务预约列表 */
    namespace GetProjects {
      /** 接口定义 */
      type FuncT = () => MRP<IResponse>;

      type IResponse = Item[];

      type Item = {
        /** 服务详情 */
        detailList: string[];
        /** 状态 */
        duration: number;
        /** 服务KV图 */
        imageKVList: string[];
        /** 图片 */
        imageUrl: string;
        /** 服务细项 */
        introduce: string;
        /** 项目编号 */
        projectCode: string;
        /** 项目名称 */
        projectName: string;
        /** 服务介绍 */
        reason: string;
        /** 状态 */
        serviceMinute: number;
        /** 状态 */
        status: number;
        /** 服务分类编号 */
        typeCode: string;
        /** 服务分类名称 */
        typeName: string;
      };
    }

    /** 获取预约柜台 */
    namespace GetCounters {
      /** 接口定义 */
      type FuncT = () => MRP<IResponse>;

      type IResponse = Item[];

      type Item = {
        /** 地址 */
        address: string;
        /** 城市编号 */
        areaCode: string;
        /** 城市名称 */
        areaName: string;
        /** 省份编号 */
        provinceCode: string;
        /** 省份名称 */
        provinceName: string;
        /** 门店编号 */
        storeCode: string;
        /** 门店名称 */
        storeName: string;
        /** 门店电话 */
        telephone: string;
      };
    }

    /** 获取可预约日期列表 */
    namespace GetDates {
      type FuncT = (params: IRequest) => MRP<Array<IResponse>>;
      interface IRequest {
        projectCode: string;
        counterCode: string;
      }
      interface IResponse {
        /** 预约日期 */
        bookableDate: string;
        /** 1 */
        status: number;
      }
    }

    /** 获取预约记录 */
    namespace GetRecords {
      /** 接口定义 */
      type FuncT = () => MRP<IResponse>;

      type IResponse = Item[];
      type Item = {
        /** 预约编号 */
        bookCode: string;
        /** 门店|小程序 */
        channel: string;
        /** 服务详情 */
        detailList: string[];
        /** 服务KV图 */
        imageKVList: string[];
        /** 图片 */
        imageUrl: string;
        /** 服务细项 */
        introduce: string;
        /** 会员号 */
        memberCode: string;
        /** 会员姓名 */
        memberName: string;
        /** 预约项目编号 */
        projectCode: string;
        /** 预约项目名称 */
        projectName: string;
        /** 服务介绍 */
        reason: string;
        /** 美容顾问编号 */
        serviceBc: string;
        /** 美容顾问姓名 */
        serviceBcName: string;
        /** 预约项目名称 */
        serviceTime: string;
        /** 预约状态 */
        status: string;
        /** 服务门店编号 */
        storeCode: string;
        /** 服务门店 */
        storeName: string;
        /** 服务类型编号 */
        typeCode: string;
        /** 服务类型 */
        typeName: string;
      };
    }

    /** 获取预约时间 */
    namespace GetPeriods {
      /** 接口定义 */
      type FuncT = (params: IRequest) => MRP<IResponse>;
      interface IRequest {
        projectCode: string;
        counterCode: string;
        date: string;
      }

      type IResponse = Item[];

      type Item = {
        beginTime: string;
        endTime: string;
        period: string;
        status: number;
      };
    }

    /** 获取服务预约列表 */
    namespace Modify {
      /** 接口定义 */
      type FuncT = (IRequest: Partial<IRequest>) => MRP<IResponse>;

      type IRequest = {
        /** 预约开始时间 */
        beginTime: string;
        /** 预约标识 */
        bookCode: string;
        /** 员工标识 */
        employeeCode: string;
        /** 预约结束时间 */
        endTime: string;
        // 门店code
        counterCode: string;
        serviceProject:string;
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

    /** 取消服务预约 */
    namespace Cancel {
      /** 接口定义 */
      type FuncT = (params: Partial<IRequest>) => MRP<IResponse>;

      type IRequest = {
        /** 预约标识 */
        bookCode: string;
        /** 项目标识 */
        projectCode: string;
        /** 门店标识 */
        counterCode: string;
        /** 预约开始时间 */
        beginTime: string;
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

    namespace GetNum {
      /** 接口定义 */
      type FuncT = (params: Partial<IRequest>) => MRP<number>;

      type IRequest = {
        /** 项目标识 */
        projectCode: string;
      };
    }
  }
}
