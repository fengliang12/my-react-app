import { forOwn, isNil, set } from "lodash-es";

import { createReducer } from "../help";

const INITIAL_STATE: Store.ExchangeGood = {
  goods: [],
  applyType: "",
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
  },
  INITIAL_STATE,
);
