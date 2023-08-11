import "./index.less";

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
          value: "mK0LVCTA7DCFwKP5YNF2cbbd1FAIIthD",
        }}
      />
    </>
  );
};

export default Index;
