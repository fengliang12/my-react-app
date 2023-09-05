import dayjs from "dayjs";

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
  return new Date(time.replace(/-/g, "/"));
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
