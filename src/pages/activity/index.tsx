import "./index.less";

import Taro from "@tarojs/taro";
import React, { useState } from "react";

import Page from "@/components/Page";
import Layout from "@/src/components/Layout";

const Index = () => {
  const [title, setTitle] = useState<string>("");
  return (
    <>
      <Page navConfig={{ title }}>
        <Layout
          onLoadNavTitle={setTitle}
          onCustomAction={({ code }) => {
            if (code === "needBind") {
              Taro.showModal({
                content: "请先注册",
              });
              throw Error("当前未注册");
            }
            return true;
          }}
        />
      </Page>
    </>
  );
};

export default Index;
