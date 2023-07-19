import "./index.less";

import { Button } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useMemoizedFn } from "ahooks";
import React from "react";

import user from "@/api/user";

interface propsType {
  callback?: (e: string) => void;
  rejectCallback?: () => void;
}
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
      const res = await user.decodePhoneNumber(
        {
          encryptedData,
          iv,
          code,
        },
        {
          isCreateUser: false,
        },
      );
      if (callback) {
        callback(res.data);
      }
    }
  });
  return (
    <Button
      className="get-phone-number"
      open-type="getPhoneNumber"
      onGetPhoneNumber={getPhoneNumber}
    ></Button>
  );
};
export default GetPhoneNumber;
