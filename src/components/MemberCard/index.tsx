import { Text, View } from "@tarojs/components";
import { useBoolean, useMemoizedFn } from "ahooks";
import React, { useState } from "react";
import { useSelector } from "react-redux";

import { CloseB, P5 } from "@/src/assets/image";
import config from "@/src/config";
import setShow from "@/src/utils/setShow";
import to from "@/src/utils/to";

import CImage from "../Common/CImage";
import CPopup from "../Common/CPopup";
import CQRCodeCustom from "../Common/CQRCodeCustom";

interface PropsType {
  showBindPopup: () => void;
}
const Index: React.FC<PropsType> = (props) => {
  let { showBindPopup } = props;
  const userInfo = useSelector((state: Store.States) => state.user);
  const isMember = useSelector((state: Store.States) => state.user.isMember);
  const [qrShow, { setTrue, setFalse }] = useBoolean(false);
  const [process, setProcess] = useState<number>(0);
  const [ruleShow, { setTrue: setRuleTrue, setFalse: setRuleFalse }] =
    useBoolean(false);

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
          className="w-690 h-368 m-auto mt-150 bg-cover py-24 px-27 box-border relative"
          style={{
            backgroundImage: `url(${config.imgBaseUrl}/index/card_bg.png)`,
          }}
        >
          <View className="w-full flex items-start">
            <View className="flex items-center justify-center relative">
              <View onClick={() => goNextPage("/pages/update/index")}>
                <CImage
                  className="w-120 h-120 mr-20 rounded-120"
                  src={userInfo.avatarUrl || P5}
                ></CImage>
                <CImage
                  className="w-30 h-30 absolute bottom-10 left-80"
                  src={`${config.imgBaseUrl}/index/icon_edit.png`}
                ></CImage>
              </View>

              <View>
                {isMember ? (
                  <>
                    <View className="text-32">普通会员</View>
                    <View className="text-38">{userInfo.realName}</View>
                    <View className="flex items-end text-18" onClick={setTrue}>
                      <CImage
                        className="w-18 h-18 mr-6"
                        src={`${config.imgBaseUrl}/index/icon_qrcode.png`}
                      ></CImage>
                      <Text>我的二维码</Text>
                    </View>
                  </>
                ) : (
                  <View
                    className="text-36 pb-1"
                    style="border-bottom:1px solid #000000"
                    onClick={showBindPopup}
                  >
                    立即注册
                  </View>
                )}
              </View>
            </View>
            <View
              className="flex-1 h-full flex items-end flex-col"
              onClick={() => goNextPage("/subPages/redeem/history/index")}
            >
              <View className="text-46">0</View>
              <CImage
                className="w-116 h-24"
                src={`${config.imgBaseUrl}/index/icon_redeem.png`}
              ></CImage>
            </View>
          </View>
          {/* 进度条 */}
          <View className="w-full h-6 mt-64 bg-slate-50 rounded-6 flex justify-start items-center">
            <View
              className="h-full w-0 rounded-6 overflow-hidden bg-762022"
              style={`width:${process}`}
            ></View>
            <View
              className="h-20 w-20 rounded-20"
              style="background-color:#762022;box-shadow:0rpx 0rpx 10rpx #762022"
            ></View>
          </View>
          <View className="w-full h-6 text-black text-right text-18 mt-30">
            任意消费即可升级成为玩妆达人
          </View>
          <View
            className="absolute bottom-20 left-25 text-18 underline"
            onClick={setRuleTrue}
          >
            会员规则
          </View>
        </View>
      </View>

      {/* 二维码弹窗 */}
      <View style={setShow(qrShow)}>
        <CPopup maskClose closePopup={setFalse}>
          <View className="w-600 flex flex-col items-center justify-center relative">
            <View className="w-full py-80  relative vhCenter flex-col bg-white rounded-10">
              <View className="mb-60 text-36 font-bold">我的二维码</View>
              <View className="w-400 h-400">
                {userInfo?.id && (
                  <CQRCodeCustom text={userInfo?.id}></CQRCodeCustom>
                )}
              </View>
            </View>
            <CImage
              className="w-30 h-30 absolute top-30 right-30"
              onClick={setFalse}
              src={CloseB}
            ></CImage>
          </View>
        </CPopup>
      </View>

      {/* 规则弹窗 */}
      <View style={setShow(ruleShow)}>
        <CPopup maskClose closePopup={setRuleFalse}>
          <View className="w-600 flex flex-col items-center justify-center relative">
            <View className="w-full py-80 relative vhCenter flex-col bg-white rounded-10">
              <View className="mb-60 text-36 font-bold">会员规则</View>
              <View className="w-400 h-400"></View>
            </View>
            <CImage
              className="w-30 h-30 absolute top-30 right-30"
              onClick={setRuleFalse}
              src={CloseB}
            ></CImage>
          </View>
        </CPopup>
      </View>
    </>
  );
};
export default React.memo(Index);
