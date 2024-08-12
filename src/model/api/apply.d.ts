declare namespace Api {
  /**
   * 申领试用接口类型声明
   */
  namespace Apply {
    /** 获取省市
     *  @URL {basePathUrl}/api/sp-portal/store/${config.storeCode}/counter/list/city
     *  @Method GET
     */
    namespace GetProvinceAndCity {
      type FuncT = () => MRP<any[]>;
    }

    namespace TakeTag {
      type FuncT = (params: RequestBody) => MRP<any>;
      interface RequestBody {
        customerId: string;
      }
    }
    /** 获取柜台
     *  @URL {basePathUrl}/api/sp-portal/store/${config.storeCode}/counter/city/list
     *  @Method GET
     */
    namespace GetCounterByCity {
      type FuncT = (IRequestBody) => MRP<any>;
    }
    /** 付邮试用产品列表
     *  @URL {basePathUrl}/api/ec-portal/store/${config.storeCode}/buy_gift/activityList
     *  @Method GET
     */
    namespace GetActivityList {
      type FuncT = (IRequestBody) => MRP<any[]>;
    }
    /** 付邮试用提交
     *  @URL {basePathUrl}/api/ec-portal/store/${config.storeCode}/buy_gift/submit
     *  @Method POST
     */
    namespace SubmitDeliveryActivity {
      type FuncT = (IRequestBody) => MRP<any>;
    }
    /** 小样申领产品列表
     *  @URL {basePathUrl}/api/sp-portal/store/${config.storeCode}/sample/apply/activity
     *  @Method GET
     */
    namespace GetCounterActivityList {
      type FuncT = () => MRP<any[]>;
    }

    /** 小样申领查询详情
     *  @URL {basePathUrl}/api/sp-portal/store/${config.storeCode}/sample/apply/activity/item/{id}
     *  @Method GET
     */
    namespace GetActivityDetail {
      type FuncT = (id: string) => MRP<any>;
    }

    /** 小样申领提交
     *  @URL {basePathUrl}/api/sp-portal/store/${config.storeCode}/sample/apply/activity/reserve
     *  @Method POST
     */
    namespace SubmitCounterActivity {
      type FuncT = (IRequestBody, showError?: boolean) => MRP<any>;
    }

    /**
     * ocpa腾讯
     */
    namespace AddUserActionsNew {
      type FuncT = (IRequestBody) => MRP<any>;
    }

    /** 获取试用机会
     *  @URL {basePathUrl}/api/sp-portal/store/${config.storeCode}/opportunities/number/type
     *  @Method POST
     */
    namespace GetActivityNum {
      type FuncT = (IRequestBody) => MRP<any>;
    }
    /** 获取申领记录
     *  @URL {basePathUrl}/api/sp-portal/store/${config.storeCode}/opportunities/use/details
     *  @Method POST
     */
    namespace GetApplyRecord {
      type FuncT = (IRequestBody) => MRP<any>;
    }
  }
}
