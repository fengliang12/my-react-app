import { forOwn, isNil, set } from "lodash-es";

import { createReducer } from "../help";

const INITIAL_STATE: Store.User = {
  nickName: "",
  isMember: false,
  avatarUrl: "",
  gender: "",
  points: 0,
  nextGradeAmount: 0,
  grade: "",
  realName: "",
};

export default createReducer(
  {
    SET_USER(state, action: { payload: Partial<Store.User> }) {
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
