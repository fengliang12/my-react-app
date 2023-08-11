declare namespace Api {
  namespace EmptyBottle {
    /**
     * 获取当月可预约数量
     */
    namespace CurrentMonth {
      type FuncT = () => MRP<IResponse>

      interface IResponse {
        [prop: string]: any
      }
    }
    /**
     * 获取可预约的城市列表
     */
    namespace GetAvailableCity {
      type FuncT = () => MRP<IResponse>

      interface IResponse {
        /** 城市标识 */
        cityCode: string
        /** 城市名称 */
        cityName: string

        [prop: string]: any
      }
    }
    /**
     * 获取可预约的门店列表
     */
    namespace GetAvailableStore {
      type FuncT = (data: IRequestBody) => MRP<IResponse>

      interface IRequestBody {
        /** 城市标识 */
        cityCode?: string
        /** 门店标识 */
        storeCode?: string
      }

      interface IResponse {
        [prop: string]: any
      }
    }
    /**
     * 空瓶回收无商品信息预约
     */
    namespace SubmitNoProduct {
      type FuncT = (data: IRequestBody) => MRP<IResponse>

      interface IRequestBody {
        /** 预约空瓶回收数量 */
        appointQuantity: string
        /** 预约日期 */
        appointmentDate: string
        /** 柜台编号 */
        counterCode: string
        /** 会员手机号 */
        customerMobile: string
        /** 会员名字 */
        customerName: string
        /** 预约标识 */
        id?: string
      }

      interface IResponse {
        /** 预约标识 */
        id: string
        /** 预约编号 */
        reservationCode: string

        [prop: string]: any
      }
    }
    /**
     * 获取单个客户预约记录，无商品 信息
     */
    namespace AppointmentListNoProduct {
      type FuncT = (data: IRequestBody) => MRP<IResponse>

      interface IRequestBody {
        /** 当前第几页，默认 1 */
        currentPage: number
        /** 每页大小，默认 10 */
        limit: number
        /** 预约状态 (1-已预约，2-已核销，3-已过期，4-处理中，5-已取消 */
        status?: number
      }

      interface IResponse {
        /** 当前页码 */
        currentPage: number
        /** 每页大小 */
        limit: number
        /** 总记录数 */
        totalCount: number
        /** 总页数 */
        totalPages: number
        /** 预约列表 */
        items: orderList[]

        [prop: string]: any
      }

      interface orderList {
        /** 预约空瓶回收数量 */
        appointQuantity: number
        /** 预约日期 */
        appointmentDate: string
        /** 预约状态 (1-已预约，2-已核销，3-已过期，4-处理中，5-已取消*/
        appointmentStatus: '1' | '2' | '3' | '4' | '5'
        /** 取消时间 */
        cancelTime: string
        /** 会员编号 */
        consumerDlId: string
        /** 柜台编号 */
        counterCode: string
        /** 柜台名称 */
        counterName: string
        /** 小程序会员ID */
        custId: string
        /** 预约标识 */
        id: string
        /** 是否已发放积分 */
        pointsFlag: boolean
        /** 实际空瓶回收数量（已核销记录有数据） */
        quantity: number
        /** 回收编号 */
        recycleCode: string
        /** 预约编号 */
        reservationCode: string
        /** 核销时间 */
        verificationTime: string

        [prop: string]: any
      }
    }
    /** 根据订单号获取已回收的空瓶和已预约但未核销的空瓶 */
    namespace BottleQuantity {
      type FuncT = (data: IRequestBody) => MRP<IResponse>

      interface IRequestBody {
        /** 订单号 */
        orderNos: Array<string>
      }

      interface IResponse {
        /** 订单号 */
        dlOrderNo: string
        /** 订单详情号 */
        dlDetailNo: string
        /** 空瓶对应商品编码 */
        bottleProductCode: string
        /** gift 套组 code */
        giftCode: string
        /** 已回收空瓶数量 */
        reclaimedQuantity: string
        /** 已预约未核销空瓶数量 */
        appointQuantity: string

        [prop: string]: any
      }
    }
    /** 取消预约 */
    namespace EmptyBottleCancel {
      type FuncT = (data: IRequestBody) => MRP<IResponse>

      interface IRequestBody {
        /** 预约标识 */
        id: string
      }

      interface IResponse {
        [prop: string]: any
      }
    }
  }
}
