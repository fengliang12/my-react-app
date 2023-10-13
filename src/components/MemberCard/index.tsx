import { Text, View } from "@tarojs/components";
import { useBoolean, useMemoizedFn } from "ahooks";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { CloseB, LogoW, P10 } from "@/src/assets/image";
import config from "@/src/config";
import pageSettingConfig from "@/src/config/pageSettingConfig";
import { SET_COMMON } from "@/src/store/constants";
import handleDataType from "@/src/utils/handleDataType";
import setShow from "@/src/utils/setShow";
import to from "@/src/utils/to";

import CImage from "../Common/CImage";
import CPopup from "../Common/CPopup";
import MemberTab from "../MemberTab";

interface PropsType {
  showBindPopup: () => void;
}

const Index: React.FC<PropsType> = (props) => {
  let { showBindPopup } = props;
  const userInfo = useSelector((state: Store.States) => state.user);
  const isMember = useSelector((state: Store.States) => state.user.isMember);
  const [process, setProcess] = useState<number>(0);
  const [ruleShow, { setTrue: setRuleTrue, setFalse: setRuleFalse }] =
    useBoolean(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!userInfo) return;

    if (["玩妆入门", "玩妆大师"].includes(userInfo.gradeName)) {
      setProcess(100);
      return;
    }

    if (
      !handleDataType(userInfo.nextGradeNeedAmount) ||
      !handleDataType(userInfo.needAmount)
    )
      return;

    let i = (1 - userInfo.needAmount / userInfo.nextGradeNeedAmount) * 100;
    setProcess(i);
  }, [userInfo]);

  /**
   * 前往编辑页面
   */
  const goNextPage = useMemoizedFn((path) => {
    if (isMember) {
      to(path);
    } else {
      showBindPopup();
    }
  });

  return (
    <>
      <View
        className="w-full h-610 overflow-hidden bg-cover"
        style={{
          backgroundImage: `url(${config.imgBaseUrl}/index/header_bg.png)`,
        }}
      >
        <View
          className="w-690 h-368 m-auto mt-140 bg-cover py-24 px-27 box-border relative"
          style={{
            backgroundImage: `url(${config.imgBaseUrl}/index/card_bg.png)`,
          }}
        >
          <View className="w-full flex items-center">
            <View className="flex items-center justify-center relative">
              <View
                className="absolute top-0 left-0 z-10 w-130 h-130 rounded-130 bg-white vhCenter mr-20"
                onClick={() => goNextPage("/pages/update/index")}
              >
                {userInfo?.avatarUrl ? (
                  <CImage
                    className="w-full h-full rounded-130"
                    src={userInfo.avatarUrl}
                  ></CImage>
                ) : (
                  <CImage
                    className="w-120"
                    mode="widthFix"
                    src={LogoW}
                  ></CImage>
                )}

                <CImage
                  className="w-30 h-30 absolute bottom-0 right-0 z-10"
                  src={`${config.imgBaseUrl}/index/icon_edit.png`}
                ></CImage>
              </View>
              <View className="w-130 h-130 mr-15"></View>

              <View>
                {isMember ? (
                  <>
                    <View className="text-42 vhCenter">
                      <View className="text-overflow max-w-250">
                        {userInfo.realName}
                      </View>
                      <CImage
                        className="w-34 h-34 px-20"
                        src={`${config.imgBaseUrl}/index/icon_qrcode.png`}
                        onClick={() => to("/subPages/common/myQRCode/index")}
                      ></CImage>
                    </View>
                    <View className="flex items-center text-24 mt-11">
                      <Text>{userInfo.gradeName}</Text>
                    </View>
                  </>
                ) : (
                  <View
                    className="text-36 pb-1"
                    style="border-bottom:1px solid #000000"
                    onClick={() =>
                      to(pageSettingConfig.registerPath, "navigateTo")
                    }
                  >
                    立即注册
                  </View>
                )}
              </View>
            </View>
            <View className="flex-1 h-full flex items-end flex-col">
              <View
                className="text-42 ENGLISH_FAMILY"
                onClick={() => {
                  // goNextPage("/subPages/common/pointsDetail/index");
                  setRuleTrue();
                }}
              >
                {userInfo.points}
              </View>
              <View
                className="vhCenter text-24 mt-11"
                onClick={() => {
                  // goNextPage("/subPages/common/pointsDetail/index");
                  setRuleTrue();
                }}
              >
                当前积分
              </View>
            </View>
          </View>
          {/* 进度条 */}
          <View className="w-full h-6 mt-64 bg-slate-50 rounded-6 flex justify-start items-center">
            <View
              className="h-full w-0 rounded-6 overflow-hidden bg-762022"
              style={`width:${process}%`}
            ></View>
            <View
              className="h-20 w-20 rounded-20"
              style="background-color:#762022;box-shadow:0rpx 0rpx 10rpx #762022"
            ></View>
          </View>
          {/* 下一等级描述 */}
          {!userInfo?.isMember || userInfo.gradeName === "玩妆入门" ? (
            <View className="w-full h-6 text-black text-right text-18 mt-30">
              任意消费即可升级成为玩妆达人
            </View>
          ) : (
            <>
              {userInfo.gradeName !== "玩妆大师" && (
                <View className="w-full h-6 text-black text-right text-18 mt-30">
                  {`再消费${userInfo.needAmount}元`}
                  即可升级成为
                  {userInfo.nextGradeName}
                </View>
              )}
            </>
          )}
        </View>
      </View>

      {/* 查看会员权益 */}
      <MemberTab></MemberTab>

      {/* 规则弹窗 */}
      <View style={setShow(ruleShow)}>
        <CPopup maskClose closePopup={() => setRuleFalse()}>
          <View className="w-524 relative flex flex-col justify-center items-center">
            <CImage
              className="w-full"
              mode="widthFix"
              src={`${config.imgBaseUrl}/index/maintenance01.jpg`}
            ></CImage>
            <View
              className="w-100 h-100 absolute top-30 right-30"
              onClick={() => setRuleFalse()}
            ></View>
          </View>
        </CPopup>
      </View>
    </>
  );
};
export default React.memo(Index);
