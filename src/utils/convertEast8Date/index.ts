import dayjs from "dayjs";

const convertEast8Date = (dateTime: any, sliceStr = "/") => {
  try {
    const hasStr = ["T", "+"];
    if (typeof dateTime !== "string") return dateTime;
    if (hasStr.every((t) => dateTime.includes(t))) {
      return dateTime.slice(0, 19).replace("T", " ").replace(/-/gi, sliceStr);
    } else if (dateTime?.length <= 19 && dateTime.includes("-")) {
      const date = dateTime.replace(/-/gi, sliceStr);
      //修改后iu日期有效
      if (dayjs(date).isValid()) {
        return date;
      }
    } else if (dateTime?.length <= 19 && dateTime.includes(".")) {
      const date = dateTime.replace(/\./gi, sliceStr);
      //修改后iu日期有效
      if (dayjs(date).isValid()) {
        return date;
      }
    }
  } catch (e) {
    console.error("日期格式化失败", e);
  }
  return dateTime;
};

const nilDayjs = () => {
  const nil = dayjs();
  nil.format = () => "";
  nil.isValid = () => false;
  return nil;
};

const QDayjs = (value: dayjs.ConfigType) => {
  if (!value) {
    return nilDayjs();
  }
  return dayjs(convertEast8Date(value));
};
const QDayGetTime = (value: string | number | Date) => {
  return new Date(convertEast8Date(value)).getTime();
};
export { QDayGetTime, QDayjs };
export default convertEast8Date;
