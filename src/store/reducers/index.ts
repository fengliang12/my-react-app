import { combineReducers } from "redux";

import common from "./common";
import exchangeGood from "./exchangeGood";
import qyUser from "./qyUser";
import user from "./user";

export default combineReducers({
  user,
  common,
  exchangeGood,
  qyUser,
});
