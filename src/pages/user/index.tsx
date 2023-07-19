import "./index.less";

import Taro from "@tarojs/taro";
import { useAsyncEffect } from "ahooks";

import Page from "@/components/Page";
import config from "@/config/index";
import Layout from "@/src/components/Layout";

const app = Taro.getApp();

const Index = () => {
  useAsyncEffect(async () => {
    await app.init();
  }, []);

  return (
    <>
      <Page>
        <Layout code={config?.pageCode?.user!} />
      </Page>
    </>
  );
};

export default Index;
