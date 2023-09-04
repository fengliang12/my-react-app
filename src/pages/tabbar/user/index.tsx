import { useSelector } from "react-redux";

import Layout from "@/src/components/Layout";
import Page from "@/src/components/Page";

const Index = () => {
  const userInfo = useSelector((state: Store.States) => state.user);

  return (
    <Page
      navConfig={{
        title: "MY NARS",
        placeholder: true,
        backgroundColor: "#000000",
        titleColor: "#FFFFFF",
      }}
      isNeedBind
    >
      <Layout
        globalStyle={{ backgroundColor: "transparent" }}
        code="user"
        closeAction={!userInfo.isMember}
      />
    </Page>
  );
};

export default Index;
