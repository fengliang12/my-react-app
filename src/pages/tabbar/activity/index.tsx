import { useSelector } from "react-redux";

import Layout from "@/src/components/Layout";
import Page from "@/src/components/Page";

const Index = () => {
  const userInfo = useSelector((state: Store.States) => state.user);

  return (
    <Page
      navConfig={{
        title: "",
        placeholder: false,
        backgroundColor: "rgba(0,0,0,0)",
        titleColor: "#FFFFFF",
      }}
      isNeedBind
    >
      <Layout code="activity" closeAction={!userInfo.isMember} />
    </Page>
  );
};

export default Index;
