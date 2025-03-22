import { Timeout } from "ahooks/lib/useRequest/src/types";

import to from "../to";

class DebugClass {
  debug: boolean = false;
  clickNum: number = 0;
  time: Timeout;
  constructor() {
    this.clickNum = 0;
  }
  toDebug() {
    console.log("点击了");
    this.clickNum++;
    if (this.clickNum === 15 || this.debug) {
      to("/pages/qy/debugger/index");
      this.clickNum = 0;
      this.debug = true;
      clearTimeout(this.time);
      return;
    }
    if (this.time) {
      clearTimeout(this.time);
    }
    this.time = setTimeout(() => {
      this.clickNum = 0;
    }, 1000);
  }
}
export default new DebugClass();
