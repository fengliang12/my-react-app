import "./index.scss";

import { Text, View, ViewProps } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useMemoizedFn } from "ahooks";
import { useState } from "react";
import to from "src/utils/to";

interface T_Props extends ViewProps {
  callback: (e: boolean) => void;
  checkColor?: string;
}
const Index: React.FC<T_Props> = (props) => {
  const app: App.GlobalData = Taro.getApp();
  let { callback, checkColor = "014f6c" } = props;

  /**
   * 勾选规则
   */
  const [agree, setAgree] = useState<boolean>(false);
  const checkboxChange = useMemoizedFn(async () => {
    await app.init();
    callback && callback(!agree);
    setAgree(!agree);
  });

  /**
   * 前往隐私协议和使用条款
   * @param e
   */
  const goPrivacyPolicy = (e) => {
    let { type } = e.currentTarget.dataset;
    to(
      `/subPages/common-pages/privacy-policy/index?type=${type}`,
      "navigateTo",
    );
  };
  return (
    <View className="tips_text" {...props}>
      <View onClick={checkboxChange} className="w-42">
        <View className="square" style={`border: 1rpx solid ${checkColor}`}>
          {agree && (
            <View
              className="checked"
              style={`background-color:${checkColor}`}
            ></View>
          )}
        </View>
      </View>
      <View className="text-left">
        <View>
          我已阅读并同意
          <Text
            className="underline"
            data-type="privacypolicy"
            onClick={goPrivacyPolicy}
          >
            隐私政策与网站
          </Text>
          及
          <Text
            className="underline"
            data-type="privacypolicy"
            onClick={goPrivacyPolicy}
          >
            小程序用户协议
          </Text>
          且同意
        </View>
        <View className="mt-10">接收来自品牌的营销信息</View>
      </View>
    </View>
  );
};
export default Index;
