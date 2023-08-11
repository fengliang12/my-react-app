import "./index.less";

import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import React, { useState } from "react";

import Page from "@/components/Page";
import CHeader from "@/src/components/Common/CHeader";
import Layout from "@/src/components/Layout";

const Index = () => {
  const [title, setTitle] = useState<string>("");
  const [cartItemNum, setCartItemNum] = useState<number>(1);

  return (
    <>
      <CHeader
        back
        fill={false}
        title=""
        titleColor="#ffffff"
        backgroundColor="rgba(0,0,0,0)"
      ></CHeader>
      <Layout
        loadPageConfig={{
          type: "id",
          value: "dRCAewb3CZ7oyC3GCMiZAbWIxTMHb9hn",
        }}
        closeShare
        defaultShareConfig={{
          title: "分享标题页面",
          path: "pages/activity/index",
          imageUrl:
            "https://lianwei-project-dev.oss-cn-shanghai.aliyuncs.com/nars/20230804/Xj397CUvWbHn7k5xKnzj9F.jpg",
        }}
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
    </>
  );
};

export default Index;
