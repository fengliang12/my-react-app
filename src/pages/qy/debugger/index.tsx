import { Input, Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useMemoizedFn } from "ahooks";
import React, { useRef, useState } from "react";

import api from "@/src/api";
import config from "@/src/config";
import store from "@/src/store";
import { SET_QY_USER } from "@/src/store/constants";
import to from "@/src/utils/to";
import toast from "@/src/utils/toast";

interface propsType {}
const app: App.GlobalData = Taro.getApp();
const Sa: React.FC<propsType> = () => {
  const value = useRef<string>();
  const [userInfo, setUserInfo] = useState<any>();

  /**
   * 提交
   */
  const submit = useMemoizedFn(async () => {
    if (!value.current) {
      toast("请先输入");
      return;
    }
    let res = await api.qy.getTestToken({
      userId: value.current,
    });
    if (res?.data?.accessToken) {
      config.DEBUG_TOKEN = res?.data?.accessToken ?? "";
      store.dispatch({
        type: SET_QY_USER,
        payload: {
          storeName: "",
        },
      });
      let useInfo = await app.init(true);
      setUserInfo(useInfo);
    }
  });

  /**
   * 退出
   */
  const layout = useMemoizedFn(async () => {
    config.DEBUG_TOKEN = "";
    await app.init(true);
    toHome();
  });

  /**
   * 去首页
   */
  const toHome = useMemoizedFn(async () => {
    to("/pages/qy/home/index");
  });

  return (
    <View className="w-screen bg-white min-h-screen">
      <View className="flex mt-0 items-center  w-screen flex-col bg-white">
        <Input
          onInput={(e) => {
            value.current = e.detail.value?.trim();
          }}
          className="w-500 h-300"
          placeholder="请输入"
        ></Input>
        <View
          style={{
            borderRadius: "10%",
          }}
          className="flex w-300 h-100 justify-center items-center rounded-lg  bg-indigo-600 px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm"
          onClick={submit}
        >
          提交
        </View>
        <View
          style={{
            borderRadius: "10%",
          }}
          className="flex w-300 h-100 justify-center items-center rounded-lg  bg-green-600 px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm mt-100"
          onClick={toHome}
        >
          去首页
        </View>
        <View
          style={{
            borderRadius: "10%",
          }}
          className="flex w-300 h-100 justify-center items-center   bg-red-600 px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm mt-100"
          onClick={layout}
        >
          退出
        </View>
      </View>
      <View className="pb-100 text-24 px-20">
        <View className="text-32">当前信息:</View>
        <Text decode space="emsp">
          {JSON.stringify(userInfo, null, 2)}
        </Text>
      </View>
    </View>
  );
};
export default Sa;
