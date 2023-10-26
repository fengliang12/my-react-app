import arvatoReservation from "./arvatoReservation/index";
import birthdayGift from "./birthdayGift";
import buyBonusPoint from "./buyBonusPoint/index";
import buyNow from "./buyNow";
import cart from "./cart/index";
import common from "./common/index";
import counter from "./counter/index";
import coupon from "./coupon/index";
import goods from "./goods/index";
import memberOrder from "./memberOrder";
import order from "./order/index";
import salesCategory from "./salesCategory";
import shuYunMember from "./shuYunMember/index";
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
  shuYunMember,
  salesCategory,
  memberOrder,
  buyNow,
  order,
  birthdayGift,
};
