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
    goods: Array<any>;
    counter: any;
  };
}
