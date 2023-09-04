import arvatoReservation from "./arvatoReservation/index";
import buyBonusPoint from "./buyBonusPoint/index";
import cart from "./cart/index";
import common from "./common/index";
import counter from "./counter/index";
import coupon from "./coupon/index";
import goods from "./goods/index";
import user from "./user/index";

/** 注册接口 */
export default {
  /** 通用接口 */
  common,
  /** 会员接口 */
  user,
  coupon,
  counter,
  goods,
  buyBonusPoint,
  cart,
  arvatoReservation,
};
