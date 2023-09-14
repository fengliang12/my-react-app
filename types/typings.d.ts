declare namespace Store {
  type States = { user: User; common: Common; exchangeGood: ExchangeGood };
  type User = {
    /** 手机号 */
    mobile: string;
    /** 是否是会员 */
    isMember: boolean;
    /** 昵称 */
    nickName: string;
    /** 昵称 */
    realName: string;
    /** 生日 */
    birthDate: string;
    /** 自定义 */
    customInfos: Array<any>;
    /** 头像 */
    avatarUrl: string;
    /**  省份*/
    province: string;
    /** 城市 */
    city: string;
    /** 性别 */
    gender: string;
    /** 等级 */
    grade: string;
    /** 会员编号 */
    marsId: string;
    /** id */
    id: string;
    /** 地址信息 */
    district: string;
    /** 柜台 */
    country: string;
    /**当前等级名称 */
    gradeName: string;
    /** 会员id */
    memberId: string;
    /** 下一个等级需要总积分 */
    needAmount: number;
    /** 下一个等级名称 */
    nextGradeName: string;
    /** 下一个等级需要金额 */
    nextGradeNeedAmount: number;
    /** 积分 */
    points: number;
  };
  type Common = {
    /** Nav高度 */
    navHeight: number;
    /** */
    changeExchange: boolean;
  };
  type ExchangeGood = {
    applyType: string;
    goods: Array<any>;
    counter: any;
  };
}
