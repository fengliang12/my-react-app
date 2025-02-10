export namespace pageTrackRecord {
  /**
   * PageTrackRecordRequest，请求对象
   */
  export interface Request {
    /**
     * 触发按钮
     */
    button?: string;
    /**
     * 渠道
     */
    channel?: string;
    /**
     * 触发Id
     */
    clickId?: string;
    /**
     * 业务Id
     */
    formId: string;
    /**
     * 业务类型
     */
    formType: string;
    /**
     * 页面名称
     */
    pageName?: string;
    /**
     * 页面路径
     */
    pagePath?: string;
    /**
     * 备注
     */
    remark?: string;
    /**
     * 场景值
     */
    scene: string;
  }

  export type FuncT = (data: Request) => MRP<any>;
}
