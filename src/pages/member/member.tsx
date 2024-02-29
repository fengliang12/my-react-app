import { View } from "@tarojs/components";
import Taro, { useDidShow, useRouter, useShareAppMessage } from "@tarojs/taro";
import { useAsyncEffect, useBoolean, useMemoizedFn } from "ahooks";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

import api from "@/src/api";
import CDialog from "@/src/components/Common/CDialog";
import CImage from "@/src/components/Common/CImage";
import CPopup from "@/src/components/Common/CPopup";
import CouponPopup from "@/src/components/CouponPopup";
import Layout from "@/src/components/Layout";
import MemberCard from "@/src/components/MemberCard";
import Page from "@/src/components/Page";
import pageSettingConfig from "@/src/config/pageSettingConfig";
import { isBetween, setShareParams } from "@/src/utils";
import { getHeaderHeight } from "@/src/utils/getHeaderHeight";
import to from "@/src/utils/to";

const app = Taro.getApp();
const Index = () => {
  const [showDialog, { setTrue, setFalse }] = useBoolean(false);
  const [dialogText, setDialogText] = useState<string>("参与成功");
  const router = useRouter();
  const { scene = "", type = "" } = router.params;
  const userInfo = useSelector((state: Store.States) => state.user);
  const { headerHeight } = getHeaderHeight();
  const [giftPop, setGiftPop] = useState<string>("");
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
      setTrue();
    } else {
      await api.apply.takeTag({
        customerId: info?.id || "",
      });
      to(
        `/pages/h5/index?url=${encodeURIComponent(
          `https://www.shyb888.cn/vip/N-009-240204/index.html?id=${userInfo.memberId}`,
        )}`,
      );
      // setDialogText("参与成功");
    }
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

  const [customData, setCustomData] = useState<any>(null);
  const loadCustomData = useMemoizedFn((e) => {
    setCustomData(e);
  });

  useAsyncEffect(async () => {
    // 不在名单
    if (!customData) return;

    //不是会员
    if (type === "birthday_gift" && !userInfo?.isMember) {
      setGiftPop("gift");
      return;
    }

    //没有卡券
    let couponId = customData.find((item) => item.code === userInfo.gradeName)
      ?.value;
    const { data } = await api.coupon.posCouponDetail({});
    if (
      type === "birthday_gift" &&
      data.findIndex((item) => item.id === couponId) === -1
    ) {
      setGiftPop("gift");
      return;
    }
  }, [customData]);

  /**
   * 生日礼提交
   */
  const confirmGift = () => {
    if (userInfo?.isMember) {
      if (userInfo.gradeName === "玩妆达人") {
        setGiftPop("sure_pop");
        return;
      }
      to("/subPages/applyCoupon/index", "navigateTo");
    } else {
      to(pageSettingConfig.registerPath, "navigateTo");
    }
  };

  /**
   * 关闭弹窗
   */
  const closeGiftPop = () => {
    setGiftPop("");
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
      <Layout
        code="index"
        navHeight={String(headerHeight)}
        globalStyle={{ backgroundColor: "#000000" }}
        onCustomAction={customAction}
        onLoadCustomData={loadCustomData}
        openMovableAreaHeight100VH
      />
      <CouponPopup type="HOME"></CouponPopup>

      {/* 生日 */}
      {giftPop === "gift" && (
        <CPopup>
          <View className="relative">
            <View
              className="w-100 h-100 absolute top-0 right-0"
              onClick={closeGiftPop}
            ></View>
            <CImage
              className="w-550"
              src="https://cna-uat-nars-oss.oss-cn-shanghai.aliyuncs.com/birthdayGift/gift.png"
              mode="widthFix"
            ></CImage>
            <View
              className="w-300 h-100  absolute bottom-40 left-125"
              onClick={confirmGift}
            ></View>
          </View>
        </CPopup>
      )}

      {/* 积分确定 */}
      {giftPop === "sure_pop" && (
        <CPopup>
          <View className="relative">
            <View
              className="w-100 h-100 absolute top-0 right-0"
              onClick={closeGiftPop}
            ></View>
            <CImage
              className="w-550"
              src="https://cna-uat-nars-oss.oss-cn-shanghai.aliyuncs.com/birthdayGift/sure_pop.png"
              mode="widthFix"
            ></CImage>
            <View className="w-220 h-80  absolute bottom-70 left-40"></View>
            <View className="w-220 h-80  absolute bottom-70  right-40"></View>
          </View>
        </CPopup>
      )}

      {/* 没有资格弹窗，抱歉 */}
      {giftPop === "not_Satisfied" && (
        <CPopup>
          <View className="relative">
            <View
              className="w-100 h-100 absolute top-0 right-0"
              onClick={closeGiftPop}
            ></View>
            <CImage
              className="w-550"
              src="https://cna-uat-nars-oss.oss-cn-shanghai.aliyuncs.com/birthdayGift/not_Satisfied.png"
              mode="widthFix"
            ></CImage>
            <View
              className="w-300 h-100 absolute bottom-70 left-125"
              onClick={closeGiftPop}
            ></View>
          </View>
        </CPopup>
      )}

      {/* 太阳码埋点弹窗 */}
      {showDialog ? (
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
      ) : null}
    </Page>
  );
};

export default Index;
