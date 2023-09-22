import { useMemoizedFn } from "ahooks";
import { useRef } from "react";
import { useSelector } from "react-redux";

import BindDialog, { IRefProps } from "@/src/components/BindDialog";
import Layout from "@/src/components/Layout";
import MemberCard from "@/src/components/MemberCard";
import Page from "@/src/components/Page";

const Index = () => {
  const userInfo = useSelector((state: Store.States) => state.user);
  const bindRef = useRef<IRefProps>(null);
  /**
   * 自定义事件
   * @param params
   */
  const customAction = useMemoizedFn((params) => {
    let { code } = params;
    if (code === "judgeMember" && !userInfo?.isMember) {
      showBind();
      throw new Error("未注册");
    }
  });

  /**
   * 显示绑定
   */
  const showBind = () => {
    if (bindRef.current) {
      bindRef.current.setTrue();
    }
  };

  return (
    <Page
      navConfig={{
        title: "MY NARS",
        fill: true,
        backgroundColor: "#000000",
        titleColor: "#FFFFFF",
      }}
    >
      <MemberCard showBindPopup={showBind}></MemberCard>
      <BindDialog ref={bindRef as any}></BindDialog>
      <Layout
        code="index"
        globalStyle={{ backgroundColor: "#000000" }}
        onCustomAction={customAction}
      />
    </Page>
  );
};

export default Index;
