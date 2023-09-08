declare namespace Store {
  type States = { user: User; common: Common; exchangeGood: ExchangeGood };
  type User = {
    /** 是否是会员 */
    isMember: boolean;
    /** 昵称 */
    nickName: string;
    /** 昵称 */
    realName: string;
    /** 头像 */
    avatarUrl: string;
    /** 性别 */
    gender: string;
    /** 等级 */
    grade: string;
    /** 积分 */
    points: number;
    /** 下一等级消费 */
    nextGradeAmount: 0;
  };
  type Common = {
    /** Nav高度 */
    navHeight: number;
    /** */
    changeExchange: boolean;
  };
  type ExchangeGood = {
    goods: Array<any>;
    counter: any;
  };
}
