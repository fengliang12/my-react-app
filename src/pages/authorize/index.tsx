import { Text, View } from "@tarojs/components";
import { useCountDown, useMemoizedFn } from "ahooks";
import { useEffect, useRef, useState } from "react";

import Layout from "@/src/components/Layout";
import to from "@/src/utils/to";

const Authorize = () => {
  const [targetDate, setTargetDate] = useState<any>();
  const jumpStatus = useRef(true);
  const [countDown, FormattedRes] = useCountDown({
    targetDate: targetDate,
    interval: 1000,
    onEnd: () => {
      console.log("jumpStatus", jumpStatus.current);
      if (jumpStatus.current) {
        to("/pages/member/member", "reLaunch");
      }
    },
  });
  const { seconds } = FormattedRes;

  useEffect(() => {
    // 跳转
    setTargetDate(new Date(Date.now() + 5 * 1000));
  }, []);

  /**
   * 自定义事件
   * @param params
   */
  const customAction = useMemoizedFn((params) => {
    let { code, data } = params;
    if (code === "judgeMemberFestival") {
      let { path, type = "navigateTo" } = JSON.parse(data) || {};
      if (path) {
        to(path, type);
        setTargetDate(undefined);
      }
    }
  });

  return (
    <>
      <Layout
        code="authorize"
        onCustomAction={customAction}
        customSlot={[
          {
            likeName: "首页开屏图",
            top: 0,
            left: 0,
            getElement: () => {
              return (
                <View
                  className="fixed rounded-50 top-200 right-20 w-full h-full text-white text-24 flex items-center justify-center"
                  style={{
                    background: "rgba(1,1,1,0.5)",
                    width: "120rpx",
                    height: "50rpx",
                  }}
                  onClick={() => {
                    to("/pages/member/member", "reLaunch");
                  }}
                >
                  跳过 <Text className="mt-2 ml-6">{seconds}</Text>
                </View>
              );
            },
          },
        ]}
      ></Layout>
    </>
  );
};

export default Authorize;
definePageConfig({
  enableShareAppMessage: true,
  navigationStyle: "custom",
});
