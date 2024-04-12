import { useBoolean, useDebounceFn, useMemoizedFn } from "ahooks";
import { useSelector } from "react-redux";

import Layout from "@/src/components/Layout";
import Page from "@/src/components/Page";
import PrivacyAuth from "@/src/components/PrivacyAuth";
import useAddUserActions from "@/src/hooks/useAddUserActions";
import to from "@/src/utils/to";
import toast from "@/src/utils/toast";

import ServiceBox from "../components/ServiceBox";
import useProject from "../hooks/useProject";

const Index = () => {
  const [visible, { setFalse, setTrue }] = useBoolean(false);
  const userInfo = useSelector((state: Store.States) => state.user);
  const { project, num = 0, reason } = useProject();
  const { addActions } = useAddUserActions();

  /**
   * 自定义事件
   * @param params
   */
  const { run: customAction } = useDebounceFn(
    (params) => {
      let { code } = params;
      if (code === "appointment") {
        addActions("RESERVATION");

        if (userInfo?.isMember === false) {
          return to("/pages/registerSecond/index");
        }
        if (num <= 0) {
          return toast("您暂无预约的机会");
        }
        setTrue();
      }
    },
    {
      wait: 500,
    },
  );

  return (
    <Page
      navConfig={{
        title: "MY NARS",
        fill: true,
        backgroundColor: "rgba(0,0,0,1)",
        titleColor: "#FFFFFF",
      }}
    >
      <PrivacyAuth></PrivacyAuth>
      <Layout
        code="service"
        globalStyle={{ background: "#000" }}
        onCustomAction={customAction}
      ></Layout>
      {/* 服务预约弹窗 */}
      {visible && (
        <ServiceBox
          project={project}
          num={num}
          close={setFalse}
          modifyTime={reason?.modify}
        ></ServiceBox>
      )}
    </Page>
  );
};
export default Index;
