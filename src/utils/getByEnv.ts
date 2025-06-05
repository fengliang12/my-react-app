import Taro from "@tarojs/taro";

const getSystemInfoSync = Taro.getSystemInfoSync();
const getByEnv = () => {
  let env: "h5" | "qy" | "weapp";
  if (process.env.TARO_ENV === "h5") {
    env = "h5";
  } else if (getSystemInfoSync?.environment === "wxwork") {
    env = "qy";
  } else {
    env = "weapp";
  }
  return { env };
};

export default getByEnv;
