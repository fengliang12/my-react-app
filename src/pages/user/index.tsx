import { useMemoizedFn } from "ahooks";
import { useSelector } from "react-redux";

import Layout from "@/src/components/Layout";
import MemberCard from "@/src/components/MemberCard";
import Page from "@/src/components/Page";
import to from "@/src/utils/to";
import toast from "@/src/utils/toast";

const Index = () => {
  const userInfo = useSelector((state: Store.States) => state.user);

  /**
   * 自定义事件
   * @param params
   */
  const customAction = useMemoizedFn((params) => {
    let { code, data } = params;
    if (code === "judgeMember" && !userInfo?.isMember) {
      to("/pages/registerSecond/index");
      throw new Error("未注册");
    }
    if (code === "stayTuned") {
      toast("敬请期待");
      throw new Error("敬请期待");
    }
    if (code === "jump_h5") {
      // let url = `${data}${userInfo.memberId}`;
      let url = `${data}M4601887550`;

      to(`/pages/h5/index?url=${encodeURIComponent(url)}`);
      throw new Error("敬请期待");
    }
  });

  /**
   * 显示绑定
   */
  const showBind = useMemoizedFn(() => {
    to("/pages/registerSecond/index");
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
      <MemberCard showBindPopup={showBind}></MemberCard>
      <Layout
        code="user"
        globalStyle={{ backgroundColor: "#151515" }}
        onCustomAction={customAction}
      />
    </Page>
  );
};

export default Index;
