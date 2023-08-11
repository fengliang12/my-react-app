declare namespace Api {
  namespace Public {

  }
  namespace Exchange {

    namespace GetGiftsByActivityCode {
      type FunT = (IRequestBody) => MRP<any[]>

      interface IRequestBody {
        /** 兑礼中台活动code */
        activityCode: string,
        /** 类目id，传'0'是所有 */
        categoryId: '0',
        /** 等级数组 */
        customerLevelNameList: string [],
        /** 销售状态，true上架，false下架 */
        saleStatus: boolean,
      }
    }

    namespace GetNestedGiftsByActivityCode {
      type FunT = (IRequestBody) => MRP<IResponse>

      interface IRequestBody {
        /** 兑礼中台活动code */
        activityCode: string,
        /** 类目id，传'0'是所有 */
        categoryId: '0',
        /** 等级数组 */
        customerLevelNameList: string [],
        /** 销售状态，true上架，false下架 */
        saleStatus: boolean,
      }

      interface IResponse {
        goodsListViewList: any[]
        id: string
        name: string,
        parent: string

        [prop: string]: any
      }
    }

    namespace getOrderPage {
      type FunT = (IRequestBody) => MRP<any>

      interface IRequestBody {
        /** 兑礼中台活动code */
        activityCode: string,
        /** 截止时间 */
        buyEndTime: string,
        /** 起始时间 */
        buyStartTime: string,
        /** 会员id */
        customerId: string,
        /**
         *  wait_pay          待付款（已创建）
         *  cancelled         已取消（未支付取消）
         *  pay_cancelled     已支付未发货取消
         *  wait_group        待成团（已支付）
         *  wait_shipment     待发货（已支付）
         *  wait_receive      待收货（已发货）
         *  wait_estimate     待评价（确认收货）
         *  success           已完成（已评价）
         *  refunded          退单完成
         *
         * 订单状态 */
        orderStatus: "wait_pay" | "cancelled" | "wait_group" | "wait_shipment" | "wait_receive" | "wait_estimate" | "success" | "refunded",
        /** 页码 */
        pageIndex: number,
        /** 每页数据量 */
        pageSize: number,
      }
    }

    namespace exchangeGiftCertificationQuery {
      type FunT = () => MRP<IResponse>;
      interface IResponse {
        onlineBuy: boolean;
        /**返回code 0:可兑礼 1:会员为黑名单 2:无兑礼资质 , */
        redemptionCode: string; 
        redemptionDesc: string;
        creditPoints: number;
        remainPoints: number;
        unusedPoints: number;
      }
    }

    namespace queryIntegralOrderLocked {
      type FunT = () => MRP<IResponse>;
      type IResponse = boolean
    }

    namespace integralOrderRefund {
      type FunT = (orderId:string) => MRP<IResponse>;
      interface IResponse {
        code : string;
        data : any;
        message : string;
      }
    }

    namespace memberDayCouponRight {
      type FunT = () => MRP<IResponse>;
      interface IResponse {
        popup : boolean;
      }
    }

    namespace memberDayCheckBuyValidate {

      interface IRequestBody {
        /** 兑礼中台活动code */
        activityCode: string,
        quantity: number,
        skuId: string,
      }
      type FunT = (query: IRequestBody) => MRP<IResponse>
      interface IResponse {
        code : string;
        message : string;
      }
    }

    namespace checkMsg {
      type IRequestBody = string
      type FunT = (query: IRequestBody) => MRP<IResponse>
      type IResponse = boolean
    }
  }
}
