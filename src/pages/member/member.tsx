import Taro, { useDidShow, useRouter, useShareAppMessage } from "@tarojs/taro";
import { useAsyncEffect, useBoolean, useMemoizedFn } from "ahooks";
import { useLayoutEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

import api from "@/src/api";
import CDialog from "@/src/components/Common/CDialog";
import CouponPopup from "@/src/components/CouponPopup";
import Layout from "@/src/components/Layout";
import MemberCard from "@/src/components/MemberCard";
import Page from "@/src/components/Page";
import { isBetween, setShareParams } from "@/src/utils";
import { getHeaderHeight } from "@/src/utils/getHeaderHeight";
import to from "@/src/utils/to";

const app = Taro.getApp();
const Index = () => {
  const [showDialog, { setTrue, setFalse }] = useBoolean(false);
  const [dialogText, setDialogText] = useState<string>("参与成功");
  const router = useRouter();
  const { scene = "" } = router.params;
  const userInfo = useSelector((state: Store.States) => state.user);
  const { headerHeight } = getHeaderHeight();
  const loading = useRef<boolean>(false);

  useAsyncEffect(async () => {
    if (!scene || loading.current) return;
    loading.current = true;

    let info = await app.init();
    if (!info?.isMember) return;

    /** 获取活动信息 */
    let activityInfo = await api.apply.activityDetail(scene);
    if (
      !activityInfo ||
      !isBetween(activityInfo.data.from, activityInfo.data.to)
    ) {
      setDialogText(`当前时间不在活动时间范围内`);
      setTrue();
      return;
    }

    /** 参加申领 */
    Taro.showLoading({ title: "加载中", mask: true });
    let res = await api.apply.reserve({
      arrivalDate: new Date(),
      counterCode: activityInfo?.data?.counterList?.[0]?.code,
      id: scene,
      mobile: info.mobile,
    });
    Taro.hideLoading();

    if (res.data.code === "10000") {
      setDialogText(`您已参与过此活动,\n敬请期待下次惊喜`);
    } else {
      setDialogText("参与成功");
    }
    setTrue();
    loading.current = false;
  }, []);

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

      {/* 弹窗 */}
      {showDialog && (
        <CDialog
          className="w-390 bg-white py-40 px-30"
          title=""
          dialogText={dialogText}
          cancel={setFalse}
          showHideBtn={false}
          btnText="好的"
          confirm={() => {
            setFalse();
          }}
        ></CDialog>
      )}
    </Page>
  );
};

export default Index;
