import { forOwn, isNil, set } from "lodash-es";

import { createReducer } from "../help";

const INITIAL_STATE: Store.User = {
  nickName: "",
  isMember: false,
  avatarUrl: "",
  gender: "",
  points: 0,
  grade: "",
  realName: "",
  mobile: "",
  birthDate: "",
  customInfos: [],
  province: "",
  city: "",
  marsId: "",
  id: "",
  district: "",
  country: "",
  gradeName: "",
  memberId: "",
  needAmount: 0,
  nextGradeName: "",
  nextGradeNeedAmount: 0,
  gradeId: 0,
  cardNo: 0,
  openId: "",
  belongShopName: "",
  invalidPoints: 0,
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
