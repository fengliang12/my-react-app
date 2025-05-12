import dayjs from "dayjs";

import config from "../config";

/** 时间格式化-带时区 */
export const formatDateTime = (
  date: string,
  num: number = 3,
  interval: string = "-",
) => {
  if (!date) {
    return date;
  }
  const arr = date.split("T");
  const d = arr[0];
  const darr = d.split("-");
  const t = arr[1];
  const tarr = t.split("+");
  const marr = tarr[0].split(":");

  const tzone = Number(tarr[1].substr(0, 2));
  let dd =
    darr[0] +
    "/" +
    darr[1] +
    "/" +
    darr[2] +
    " " +
    marr[0] +
    ":" +
    marr[1] +
    ":" +
    marr[2];
  dd = dd.split(".")[0];

  let time = new Date(Date.parse(dd));
  time.setTime(time.setHours(time.getHours() + (8 - tzone)));
  let Y = time.getFullYear() + interval;
  const addZero = (_num: number) => (_num < 10 ? "0" + _num : _num);
  let M = addZero(time.getMonth() + 1) + interval;
  let D = addZero(time.getDate());
  let h = " " + addZero(time.getHours());
  let m = ":" + addZero(time.getMinutes());
  let s = ":" + addZero(time.getSeconds());
  let result = Y + M + D;
  switch (num) {
    case 4:
      result = Y + M + D + h;
      break;
    case 5:
      result = Y + M + D + h + m;
      break;
    case 6:
      result = Y + M + D + h + m + s;
      break;
  }
  return result;
};

/**
 * 获取时间戳,兼容处理
 * @param time
 * @returns
 */
export const getTimeStamp = (time) => {
  if (time.includes("T")) {
    time = formatDateTime(time, 6);
  }
  return new Date(time.replace(/-/g, "/")).getTime();
};

/**
 * 兼容ios
 * @param time
 * @returns
 */
export const formTime = (time, type = "YYYY年MM月DD日") => {
  let temp = formatDateTime(time, 3, "/");
  return dayjs(temp).format(type);
};

/** 验证手机号 */
export const isPhone = (phone: string) => /^[1][0-9]{10}$/.test(phone);
/** 姓名是否合法 */
export const isNickname = (name: string) => {
  return name.trim().length !== 0;
};

/**
 * 判断活动是否在有效时间内
 * @param date
 * @param startHour
 * @param endHour
 * @returns
 */
export const isBetween = (start: string = "", end: string = ""): boolean => {
  const now = Date.now();
  return now >= getTimeStamp(start) && now <= getTimeStamp(end);
};

export const verifyAddressInfo: (e: T_Area_Form) => Promise<string> = (
  addressInfo,
) => {
  return new Promise((resolve, reject) => {
    const {
      addressee = "",
      mobile = "",
      province = "",
      city = "",
      district = "",
      detail = "",
    } = addressInfo;
    if (!addressee) reject("请填写收件人姓名");
    if (!isPhone(mobile)) reject("请填写有效的手机号");
    if (!province || !city || !district) reject("请选择收货地址");
    if (!detail) reject("请选择详细地址");
    resolve("success");
  });
};

/**
 * 防抖 立即执行版本
 * @param fn 防抖函数
 * @param wait 防抖时间
 * @param msg 添加重复执行提示
 */
export function debounceImme(fn: Function, wait: number, msg?: string) {
  let timer: any = null;
  return function (this: any, ...args: any[]) {
    timer && clearTimeout(timer);
    const callNow = !timer;
    if (!callNow && msg) {
      wx.showToast({
        title: msg,
        icon: "none",
        duration: wait,
      });
    }
    timer = setTimeout(() => {
      timer = null;
    }, wait);
    // @ts-ignore
    callNow && fn.apply(this, args);
  };
}

// 手机号掩码
export const maskPhone = (phone: string) => {
  if (phone.includes("*")) return phone;

  var reg = /(\d{3})\d{4}(\d{4})/;
  var tel = phone.replace(reg, "$1****$2");
  return tel;
};

// 文案换行
export const handleTextBr = (text) => {
  if (text) {
    console.log(text);
    var pattern = "\\\\n";
    var target = "\n";
    var reg = RegExp(pattern, "g");
    return text.replace(reg, target);
  }
};

export const setShareParams = () => {
  return {
    title: "全新升级，沉浸玩妆",
    path: "/pages/member/member",
    imageUrl: `https://cna-prd-nars-oss.oss-cn-shanghai.aliyuncs.com/share/share.png`,
  };
};

/**获取中转前的参数对象 */
export const getSceneObject = async <T extends Partial<Record<string, any>>>(
  scene: string,
): Promise<T | undefined> => {
  const decodeScene = decodeURIComponent(scene);

  /**
   * 判断是否为keyq=***&key2=***结构
   */
  if (validateQueryString(decodeScene)) {
    return queryToOptions(decodeScene) as T;
  }

  return;
};

/**
 * 将查询字符串转换为对象
 * @param str - 查询字符串，如 "a=1&b=2" 或 "?a=1&b=2"
 * @returns 一个对象，如 {a: '1', b: '2'}
 */
const queryToOptions = (str: string): Record<string, string | null> => {
  if (str.indexOf("?") !== -1) {
    str = str.split("?")[1];
  }
  let ps: string[] = [];
  try {
    ps = decodeURIComponent(str).split("&");
  } catch (err) {
    ps = str.split("&");
  }

  const obj: Record<string, string | null> = {};

  ps.forEach((item) => {
    const temp = item.split("=");
    const key = temp[0];
    const value = temp[1] !== undefined ? temp[1] : null; // 如果参数没有等号或等号后面没有值，将值设置为 null
    obj[key] = value;
  });

  return obj;
};

/**
 * 正则检查 keyq=***&key2=***
 */
const validateQueryString = (str) => {
  const regex = /^[a-zA-Z0-9_]+=[a-zA-Z0-9_]+(&[a-zA-Z0-9_]+=[a-zA-Z0-9_]+)*$/;
  let newStr = str;
  try {
    newStr = decodeURIComponent(str);
  } catch (err) {
    newStr = str;
  }
  if (str.indexOf("?") !== -1) {
    newStr = str.split("?")[1];
  }
  return regex.test(newStr);
};

/**
 * 数组中codeValue转换为对象
 */
export const codeMapValue = (e?: ExtendInfo[], key?: string) => {
  if (!e?.length) return {};
  return Object.fromEntries(
    e.map((elem) => {
      return [elem[key ?? "code"], elem.value];
    }),
  );
};

export const generateYearMonthArray = (
  start,
  end,
): Array<{
  label: string;
  year: string;
  month: string;
}> => {
  const result: any = [];
  let current = dayjs(end); // 从结束日期开始
  const startDate = dayjs(start); // 开始日期

  // 遍历日期范围（倒序）
  while (current.isAfter(startDate) || current.isSame(startDate, "month")) {
    const year = current.year();
    const month = current.month() + 1; // dayjs 的 month 从 0 开始，需要 +1
    // 每年的最后一个月添加“全年”项
    if (month === 12) {
      result.push({
        label: `${year}全年`,
        year: year.toString(),
        month: "",
      });
    }

    // 添加月份项
    result.push({
      label: `${year}年${month}月`,
      year: year.toString(),
      month: month.toString(),
    });

    // 减少一个月
    current = current.subtract(1, "month");
  }

  return result;
};

export const replaceNumberWithText = (str) => {
  const pattern = /(\d+)/;
  const match = str.match(pattern);
  if (match) {
    const number = match[0];
    return `该礼品仅可兑礼${number}件`;
  }
  return str;
};

export const handleGoodStatus = (detail) => {
  let customInfos = codeMapValue(detail?.customInfos, "name");

  if (customInfos?.memberDayCoupon) {
    return "已成功";
  } else if (detail?.deliverInfo?.type === "self_pick_up") {
    if (
      detail?.statusName === "待付款" ||
      detail?.statusName === "待发货" ||
      detail?.statusName === "待收货"
    ) {
      return "待领取";
    } else if (
      detail?.statusName === "已发货" ||
      detail?.statusName === "待评价"
    ) {
      return "已领取";
    }
  } else if (detail?.deliverInfo?.type === "express") {
    if (detail?.statusName === "待评价") {
      return "已发货";
    }
  }
  return detail?.statusName;
};
