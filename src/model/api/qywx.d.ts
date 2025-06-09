declare namespace Api {
  namespace QYWX {
    // 企业微信公共类型
    namespace Public {
      // 客户信息
      interface CustomerBasicInfo {
        // 推荐人id
        id: string;
        // 推荐人手机号
        mobile: string;
        // 是否为会员
        member: boolean;
        // 推荐人昵称
        nickName: string;
        // 卡别数组，如[羽粉，黑卡]
        tags: Array<string>;
        [prop: string]: any;
      }
      // 被推荐人信息
      interface RecommandedObj {
        // 首单是否完成
        firstOrder: boolean;
        // 二回是否完成
        secondOrder: boolean;
        // 被推荐人个人信息
        newMember: CustomerBasicInfo;
        [prop: string]: any;
      }

      // 被推荐人数组
      interface Page {
        content: Array<RecommandedObj>;
        [prop: string]: any;
      }
    }
    /** 推荐注册查询
     * @URL {basePathUrl}/api/counter-portal/store/{storeCode}/recommendRegister/ba/{mobile}
     * @Method GET
     */
    namespace GetRecommandRegisterByMobile {
      type FuncT = (mobile: number | string) => MRP<IResponse>;
      interface IResponse {
        customerBasicInfo: Api.QYWX.Public.CustomerBasicInfo;
        page: Api.QYWX.Public.Page;
      }
    }
    /** 首单二回修改
     * @URL {basePathUrl}/api/counter-portal/store/${storeCode}/recommendRegister/ba/${id}/${type}
     * @Method POST
     */
    namespace UpdateRecommandRegister {
      type FuncT = (id: string, type: string) => MRP<any>;
    }

    namespace Dashboard {
      type FuncT = (params: Partial<IRequestBody>) => MRP<IResponse>;
      interface IRequestBody {
        /**
         * 积分商品id
         */
        bonusPointId: string;
        /**
         * 柜台id列表
         */
        counterIds: string[];
        /**
         * 月，格式MM
         */
        month: string;
        /**
         * 积分
         */
        point: string;
        /**
         * 年，格式yyyy
         */
        year: string;
        [property: string]: any;
      }
      interface IResponse {}
    }

    namespace OrderList {
      type FuncT = (params: IRequestBody) => PG<IResponse>;
      interface IRequestBody {
        page: number;
        size: number;
        expression?: string;
      }
      interface IResponse {}
    }

    namespace OrderSubmit {
      type FuncT = (params: IRequestBody) => PG<IResponse>;
      interface IRequestBody {
        /**
         * 核销code
         */
        code?: string;
        /**
         * 订单id
         */
        orderId?: string;
        /**
         * 手机验证码
         */
        smsCode?: string;
        /**
         * 核销方式 1.code核销 code 2.验证码核销 sms
         */
        type: "code" | "sms";
        /**
         * 用户id
         */
        storeAdmins?: Array<string>;
      }
      interface IResponse {}
    }

    namespace Stock {
      type FuncT = (params: IRequestBody) => MRP<Array<IResponse>>;
      interface IRequestBody {
        counterId?: string;
      }
      interface IResponse {}
    }

    namespace SingleCounterStock {
      type FuncT = (params: IRequestBody) => MRP<Array<IResponse>>;
      interface IRequestBody {
        counterId?: string;
      }
      interface IResponse {}
    }
    namespace SubmitClick {
      type FuncT = (data: IRequestBody) => MRP<unknown>;
      interface IRequestBody {
        /**
         * 按钮id
         */
        id: string;
      }
    }
    namespace CheckClick {
      type FuncT = (data: IRequestBody) => MRP<{
        code: string;
        message: string;
      }>;
      interface IRequestBody {
        /**
         * 按钮id
         */
        id: string;
      }
    }
  }
}
