import Layout from "@/src/components/Layout";
import Page from "@/src/components/Page";
import { getHeaderHeight } from "@/src/utils/getHeaderHeight";

const Index = () => {
  const { headerHeight } = getHeaderHeight();

  return (
    <Page
      navConfig={{
        fill: false,
        backgroundColor: "transparent",
        titleColor: "#ffffff",
      }}
    >
      <Layout
        code="memberFestivalRule"
        navHeight={String(headerHeight)}
        globalStyle={{ backgroundColor: "#c5a8cb" }}
        openMovableAreaHeight100VH
      />
    </Page>
  );
};

export default Index;
