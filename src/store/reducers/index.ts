import { combineReducers } from "redux";

import common from "./common";
import exchangeGood from "./exchangeGood";
import user from "./user";

export default combineReducers({
  user,
  common,
  exchangeGood,
});
