import { useShareAppMessage } from "@tarojs/taro";

import Layout from "@/src/components/Layout";
import Page from "@/src/components/Page";
import { setShareParams } from "@/src/utils";

const Index = () => {
  useShareAppMessage(() => {
    return setShareParams();
  });

  return (
    <Page
      navConfig={{
        title: "",
        fill: false,
        backgroundColor: "rgba(0,0,0,0)",
        titleColor: "#FFFFFF",
      }}
    >
      <Layout code="activity" globalStyle={{ backgroundColor: "#000000" }} />
    </Page>
  );
};

export default Index;
