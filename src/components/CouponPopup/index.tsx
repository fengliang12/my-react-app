import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useAsyncEffect } from "ahooks";
import React, { useState } from "react";

import api from "@/src/api";

import CImage from "../Common/CImage";
import CPopup from "../Common/CPopup";

interface SubDialogConfig {
  img: string;
  popupType: Api.Common.FindPopupList.PopupType;
  manualConfirm: boolean;
  activityCode: string;
  activityName: string;
  hasWechatPopUp: boolean;
  longPressToSave: boolean;
  nextCouponIds?: Array<string>;
  show: boolean;
  page?: string;
  info: string;
}

const app: App.GlobalData = Taro.getApp();

interface PropsType {
  type: string;
}
const Index: React.FC<PropsType> = (props) => {
  let { type } = props;

  const [subDialogConfig, setSubDialogConfig] =
    useState<SubDialogConfig | null>(null);
  const [showDialog, setShowDialog] = useState<boolean>(false);

  /**
   * 获取弹窗配置，src以及是否展示等
   */
  useAsyncEffect(async () => {
    if (!type) return;
    Taro.showLoading({ title: "加载中", mask: true });
    await app.init();

    /** 弹窗接口 */
    const { data } = await api.common.findPopupListByType([
      type as unknown as Api.Common.FindPopupList.PopupType,
    ]);

    if (Array.isArray(data) && data.length > 0) {
      let popup = data[0];
      setSubDialogConfig(popup);
      setShowDialog(popup?.show);
    }
    Taro.hideLoading();
  }, [type]);

  return (
    <>
      {showDialog && subDialogConfig && (
        <CPopup maskClose closePopup={() => setShowDialog(false)}>
          <View className="w-524 relative flex flex-col justify-center items-center mt-200">
            <CImage
              className="w-full rounded-10"
              mode="widthFix"
              src={subDialogConfig.img}
            ></CImage>
            <View
              className="w-100 h-100 absolute top-30 right-30"
              onClick={() => setShowDialog(false)}
            ></View>
          </View>
        </CPopup>
      )}
    </>
  );
};
export default React.memo(Index);
