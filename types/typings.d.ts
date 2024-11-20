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
    /** 等级*/
    gradeId: number;
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
    /** 卡号 */
    cardNo: number;
    /** openId */
    openId: string;
    // 柜台名称
    belongShopName: string;
    /** 过期积分 */
    invalidPoints: number;
  };
  type Common = {
    /** Nav高度 */
    navHeight: number;
    /** */
    changeExchange: boolean;
    /**系统维护弹窗 */
    showDialog: boolean;
  };
  type ChannelType = "cart" | "immediately";
  type PostageType = "money" | "points";

  type ExchangeGood = {
    applyType: string;
    showRedDot: boolean;
    goods: Array<any>;
    counter: any;
    channelType: ChannelType;
  };
}
