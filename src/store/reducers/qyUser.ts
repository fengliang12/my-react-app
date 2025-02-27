import { forOwn, isNil, set } from "lodash-es";

import { createReducer } from "../help";

const INITIAL_STATE: Partial<Store.QyUser> = {
  admins: [],
  createUser: "",
  departments: [],
  enable: true,
  gender: 0,
  id: "",
  invite: false,
  mainDepartment: "",
  name: "",
  position: "",
  status: "",
};

export default createReducer(
  {
    SET_QY_USER(state, action: { payload: Partial<Store.QyUser> }) {
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
