import adhocReservation from "./adhocReservation";
import apply from "./apply/index";
import arvatoReservation from "./arvatoReservation/index";
import behavior from "./behavior";
import birthdayGift from "./birthdayGift";
import buyBonusPoint from "./buyBonusPoint/index";
import buyNow from "./buyNow";
import cart from "./cart/index";
import clockin from "./clockin/index";
import common from "./common/index";
import counter from "./counter/index";
import coupon from "./coupon/index";
import draw from "./draw/index";
import goods from "./goods/index";
import kvdata from "./kvdata/index";
import memberOrder from "./memberOrder";
import memberTrack from "./memberTrack";
import order from "./order/index";
import qy from "./qy/index";
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
  apply,
  adhocReservation,
  behavior,
  draw,
  kvdata,
  memberTrack,
  clockin,
  qy,
};
