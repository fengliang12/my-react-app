import { forOwn, isNil, set } from "lodash-es";

import { createReducer } from "../help";

const INITIAL_STATE: Store.ExchangeGood = {
  goods: [],
  counter: null,
};

export default createReducer(
  {
    SET_EXCHANGE_GOOD(state, action: { payload: Partial<Store.ExchangeGood> }) {
      if (action.payload) {
        forOwn(action.payload, function (value, key) {
          if (!isNil(value)) {
            set(state, key, value);
          }
        });
      }
    },
    SET_COUNTER(state, action: { payload: Partial<Store.ExchangeGood> }) {
      if (action.payload) {
        forOwn(action.payload, function (value, key) {
          if (!isNil(value)) {
            set(state, key, value);
          }
        });
      }
    },
  },
  INITIAL_STATE,
);
