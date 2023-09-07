import { useSelector } from "react-redux";

import Layout from "@/src/components/Layout";
import Page from "@/src/components/Page";

const Index = () => {
  const userInfo = useSelector((state: Store.States) => state.user);

  return (
    <Page
      isNeedBind
      navConfig={{
        title: "",
        fill: false,
        backgroundColor: "rgba(0,0,0,0)",
        titleColor: "#FFFFFF",
      }}
    >
      <Layout
        loadPageConfig={{
          type: "id",
          value: "wyGqbO4buEsPjwCO8yF5gXmmF160F9Ok",
        }}
        globalStyle={{ backgroundColor: "#000000" }}
        closeAction={!userInfo.isMember}
      />
    </Page>
  );
};

export default Index;
