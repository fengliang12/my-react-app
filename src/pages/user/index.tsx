import Layout from "@/src/components/Layout";
import config from "@/config/index";
import Page from "@/components/Page";
import Taro from "@tarojs/taro";
import { useAsyncEffect } from "ahooks";

import "./index.less";


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
