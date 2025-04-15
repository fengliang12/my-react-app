import { forOwn, isNil, set } from "lodash-es";

import { createReducer } from "../help";

const INITIAL_STATE: Store.ExchangeGood = {
  goods: [],
  showRedDot: false,
  applyType: "self_pick_up",
  channelType: "immediately",
  counter: null,
};

export default createReducer(
  {
    SET_EXCHANGE_GOOD(state, action: { payload: Partial<Store.ExchangeGood> }) {
      if (action.payload) {
        forOwn(action.payload, function (value, key) {
          set(state, key, value);
        });
      }
    },
    SET_RED_DOT(state, action: { payload: Partial<Store.ExchangeGood> }) {
      if (action.payload.goods && action.payload.goods?.length > 0) {
        set(state, "showRedDot", true);
      } else {
        set(state, "showRedDot", false);
      }
    },
  },
  INITIAL_STATE,
);
