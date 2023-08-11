declare namespace Api {
  /**
   * 商品接口类型声明
   */
  namespace Yuesai {
    /**
     * 商品接口公用声明
     */
    namespace Public {
      interface customerAddress {
        //收件人
        addressee: string
        //地址的别名
        aliasName: string
        //城市
        city: string
        //国家
        country: string
        //详细地址
        detail: string
        //区县
        district: string
        //手机号
        mobile: string
        //邮编
        postCode: string
        //是否默认地址
        preferred: boolean
        //省份
        province: string
        //电话
        telephone: string
      }
    }
    namespace Register {
      type FuncT = (data: IRequestBody) => MRP<IResponse>;

      interface IRequestBody {
        //会员dl的marsId
        marsId: string
        //活动id
        activityId: string
        //生日
        birthday: string
        //客户地址信息
        customerAddress: Public.customerAddress
        //注册页路径
        concealUrl: string
        //是否同意注册协议
        conceal: boolean
      }

      interface IResponse {
        [prop: string]: any
      }
    }

    namespace CheckRegisterValidate {
      type FuncT = (activtyId: string, mobile: string) => MRP<IResponse>;

      interface IResponse {
        [prop: string]: any
      }
    }

    namespace SendSample {
      type FuncT = (counterCode) => MRP<IResponse>; 
      interface IResponse {
        [prop: string]: any
      }
    }

    namespace CheckRisk {
      type FuncT = (data: IRequestBody) => MRP<IResponse>
      interface IRequestBody {
        /** 会员手机号 */
        phone: string
      }
      interface IResponse {
        [prop: string]: any
      }
    }

    namespace IsDistance {
      type FuncT = (data: IRequestBody) => MRP<IResponse>;
      interface IRequestBody {
        /** campaignId */
        campaignId: string,
        /** 柜台code */
        counterCode: string,
        /** 会员唯一标识 */
        customerId: string,
        /** 纬度 */
        latitude: number,
        /** 经度 */
        longitude: number
      }
      interface IResponse {
        [prop: string]: any
      }
    }
  }
}
