import { useSelector } from "react-redux";

import Layout from "@/src/components/Layout";
import MemberCard from "@/src/components/MemberCard";
import Page from "@/src/components/Page";

const Index = () => {
  const userInfo = useSelector((state: Store.States) => state.user);

  return (
    <Page
      isNeedBind
      navConfig={{
        title: "MY NARS",
        fill: true,
        backgroundColor: "#000000",
        titleColor: "#FFFFFF",
      }}
    >
      <MemberCard></MemberCard>
      <Layout
        loadPageConfig={{
          type: "id",
          value: "395l4aDmOrKbVAZY0iM4PDSasCBIV2Xj",
        }}
        globalStyle={{ backgroundColor: "#000000" }}
        closeAction={!userInfo.isMember}
      />
    </Page>
  );
};

export default Index;
