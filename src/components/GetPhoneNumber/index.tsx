import { Button } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useMemoizedFn } from "ahooks";
import React from "react";
// import { useSelector } from "react-redux";
import { customer, wechatDecode } from "src/taro-public/api";
import checkSession from "src/taro-public/utils/checkSession";

interface propsType {
  callback?: (e: string) => void;
  rejectCallback?: () => void;
}
const app = Taro.getApp();
const GetPhoneNumber: React.FC<propsType> = (props) => {
  const { callback, rejectCallback } = props;
  const getPhoneNumber = useMemoizedFn(async (e) => {
    const { code, encryptedData, iv } = e.detail;
    if ((!encryptedData || !iv) && !code) {
      rejectCallback && rejectCallback();
      return;
    }
    //新版code解密手机号
    if (code) {
      const res = await wechatDecode.getUserPhone({
        code,
      });
      if (callback) {
        callback(res.data);
      }
      return;
    }
    //老版本code解密手机号
    await checkSession();
    const user = await app.init();
    if (user?.userInfo?.miniOpenId) {
      const res = await customer.decodePhone({
        encryptedData,
        iv,
        openId: user?.userInfo?.miniOpenId,
      });
      if (callback) {
        callback(res.data.phoneNumber);
      }
    }
  });
  return (
    <Button
      className="opacity-0 absolute left-0 top-0 w-full h-full"
      open-type="getPhoneNumber"
      onGetPhoneNumber={getPhoneNumber}
    ></Button>
  );
};
export default GetPhoneNumber;
