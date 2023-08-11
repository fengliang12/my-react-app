import "./index.less";

import { View } from "@tarojs/components";

import CHeader from "@/src/components/Common/CHeader";
import Layout from "@/src/components/Layout";

const Index = () => {
  return (
    <>
      <CHeader
        back
        fill
        title="MY NARS"
        titleColor="#ffffff"
        backgroundColor="rgba(0,0,0,1)"
      ></CHeader>
      <Layout
        loadPageConfig={{
          type: "id",
          value: "dWEnOyhHxuFfXliXkqo7nJwi4kDLolng",
        }}
      />
    </>
  );
};

export default Index;
