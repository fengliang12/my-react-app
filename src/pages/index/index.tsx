import "./index.less";

import { Video, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useMemoizedFn } from "ahooks";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import config from "@/config/index";
import Layout from "@/src/components/Layout";
import Page from "@/src/components/Page";

const Index = () => {
  const isMember = useSelector((state: Store.States) => state.user.isMember);
  const [isShowSpread, setIsShowSpread] = useState(true);
  const [spreadSrc, setSpreadSrc] = useState("");
  const loadCustomData = useMemoizedFn((data) => {
    const spread = data?.find((item) => item.code === "spread")?.value;
    if (spread) {
      Taro.hideTabBar();
      setSpreadSrc(spread);
    } else {
      Taro.showTabBar();
      setIsShowSpread(false);
    }
  });
  const spreadEnd = useMemoizedFn(() => {
    Taro.showTabBar();
    setIsShowSpread(false);
  });

  useEffect(() => {
    Taro.hideTabBar();
  }, []);
  return (
    <>
      <Page isNeedNav={false} isNeedBind>
        <Video
          className="spread"
          onClick={(e) => e.stopPropagation?.()}
          autoplay
          objectFit="cover"
          controls={false}
          src={spreadSrc}
          style={{
            opacity: isShowSpread ? "1" : "0",
            pointerEvents: isShowSpread ? "auto" : "none",
          }}
          onEnded={spreadEnd}
        />
        <View style={{ opacity: spreadSrc && isShowSpread ? "0" : "1" }}>
          <Layout
            code={config?.pageCode?.home!}
            onLoadCustomData={loadCustomData}
          />
        </View>
      </Page>
    </>
  );
};

export default Index;
