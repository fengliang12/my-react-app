import React from "react";
import { useMemoizedFn } from "ahooks";
import { Button, View } from "@tarojs/components";
import Nav, { NavType } from "../Nav";
import Taro from "@tarojs/taro";
import api from "@/src/api";

import "./index.less";
import { useSelector } from "react-redux";

type PageType = {
  /** 是否需要注册 */
  isNeedBind?: boolean;
  /** 是否在当前页面注册 */
  isButtonBind?: boolean;
  /** 是否需要导航栏 */
  isNeedNav?: boolean;
  /** 导航配置 */
  navConfig?: NavType;
  [props: string]: any;
};

const app = Taro.getApp();

const Page: React.FC<PageType> = ({
  navConfig,
  isNeedBind = false,
  isButtonBind = false,
  isNeedNav = true,
  children,
}) => {
  const isMember = useSelector((state: any) => state.user.isMember)
  const checkBind = useMemoizedFn((e) => {
    if (!isMember && isNeedBind) {
      e.stopPropagation?.();
      app.to("/pages/bind/index");
    }
  });
  const getPhoneNumber = useMemoizedFn(async (e) => {
    const { errMsg, code, encryptedData, iv } = e.detail;
    if (errMsg === "getPhoneNumber:ok") {
      const { status } = await api.user.decodePhoneNumber(
        {
          encryptedData,
          iv,
          code,
        },
        {
          isCreateUser: true,
        }
      );
      if (status === 200) {
        app.init(true);
      }
    }
  });
  return (
    <>
      <View>{isNeedNav && <Nav {...(navConfig ?? {})} />}</View>
      <View
        onClick={checkBind}
        style={{ position: "relative", width: "100vw" }}
      >
        {isNeedBind && isButtonBind && (
          <Button
            className="btn-no phoneNumber"
            openType="getPhoneNumber"
            onGetPhoneNumber={getPhoneNumber}
            onClick={(e) => e.stopPropagation?.()}
          ></Button>
        )}
        {children}
      </View>
    </>
  );
};

export default Page;
