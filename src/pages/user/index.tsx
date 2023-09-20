import Taro, { useDidShow } from "@tarojs/taro";
import { useBoolean, useMemoizedFn } from "ahooks";
import { useSelector } from "react-redux";

import BindDialog from "@/src/components/BindDialog";
import Layout from "@/src/components/Layout";
import MemberCard from "@/src/components/MemberCard";
import Page from "@/src/components/Page";
import toast from "@/src/utils/toast";

const app: App.GlobalData = Taro.getApp();
const Index = () => {
  const userInfo = useSelector((state: Store.States) => state.user);
  const [showBind, { setTrue, setFalse }] = useBoolean(false);

  useDidShow(async () => {
    let user = await app.init();
    if (user && !user?.isMember) {
      setTrue();
    } else {
      setFalse();
    }
  });

  /**
   * 自定义事件
   * @param params
   */
  const customAction = useMemoizedFn((params) => {
    let { code } = params;
    if (code === "judgeMember" && !userInfo?.isMember) {
      setTrue();
      throw new Error("未注册");
    }
    if (code === "stayTuned") {
      toast("敬请期待");
      throw new Error("敬请期待");
    }
  });

  return (
    <Page
      navConfig={{
        title: "MY NARS",
        fill: true,
        backgroundColor: "#000000",
        titleColor: "#FFFFFF",
      }}
    >
      <MemberCard showBindPopup={setTrue}></MemberCard>
      <BindDialog show={showBind} setFalse={setFalse}></BindDialog>
      <Layout
        code="user"
        globalStyle={{ backgroundColor: "#000000" }}
        onCustomAction={customAction}
      />
    </Page>
  );
};

export default Index;
