import { useShareAppMessage } from "@tarojs/taro";
import { useMemoizedFn } from "ahooks";
import { useSelector } from "react-redux";

import CouponPopup from "@/src/components/CouponPopup";
import Layout from "@/src/components/Layout";
import MemberCard from "@/src/components/MemberCard";
import Page from "@/src/components/Page";
import { setShareParams } from "@/src/utils";
import { getHeaderHeight } from "@/src/utils/getHeaderHeight";
import to from "@/src/utils/to";

const Index = () => {
  const userInfo = useSelector((state: Store.States) => state.user);
  const { headerHeight } = getHeaderHeight();
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
  const showBind = useMemoizedFn(() => {
    to("/pages/registerSecond/index");
  });

  useShareAppMessage(() => {
    return setShareParams();
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
        code="index"
        navHeight={String(headerHeight)}
        globalStyle={{ backgroundColor: "#000000" }}
        onCustomAction={customAction}
        openMovableAreaHeight100VH
      />
      <CouponPopup type="HOME"></CouponPopup>
    </Page>
  );
};

export default Index;
