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
  }
}
