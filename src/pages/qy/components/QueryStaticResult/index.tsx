import { Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useAsyncEffect, useMemoizedFn } from "ahooks";
import dayjs from "dayjs";
import React, { useMemo, useState } from "react";

import { ORDER_STATUS_ENUM, OrderStatus } from "@/qyConfig/index";
import api from "@/src/api";
import { Copy, qiyeweixin2 } from "@/src/assets/image";
import CImage from "@/src/components/Common/CImage";
import { codeMapValue, formatDateTime } from "@/src/utils";
import { QDayjs } from "@/src/utils/convertEast8Date";
import toast from "@/src/utils/toast";

import qy from "../../utils/qy";
import VerifyPopup from "../VerifyPopup";

interface Props {
  info: any;
  callback: () => void;
}
const Index: React.FC<Props> = (props) => {
  let { info, callback } = props;
  const [showTip, setShowTip] = useState<boolean>(false);

  useAsyncEffect(async () => {
    let res = await api.qy.checkClick({
      id: info?.orderId,
    });
    if (res?.data?.code === "51216600") {
      setShowTip(true);
    } else {
      setShowTip(false);
    }
  }, [info]);

  /**
   * 有效期
   */
  const availTime = useMemo(() => {
    return dayjs(info.createTime).add(30, "day").format("YYYY/MM/DD HH:mm:ss");
  }, [info]);

  /**
   * 自定义信息
   */
  const customInfos = useMemo(() => {
    return codeMapValue(info?.customInfos, "name");
  }, [info]);

  /**
   * 有效期天数
   */
  const availDay = useMemo(() => {
    if (availTime) {
      return dayjs(availTime)?.diff(dayjs(), "day");
    }
    return 0;
  }, [availTime]);

  /**
   * 显示按钮
   */
  const showBtn = useMemo(() => {
    if (availTime) {
      return dayjs(availTime).isAfter(dayjs());
    }
    return false;
  }, [availTime]);

  /**
   * 点击复制
   */
  const clickCopyPhone = useMemoizedFn(() => {
    if (!info?.mobile) return;

    Taro.setClipboardData({
      data: info?.mobile,
      success: () => {
        toast("复制成功");
      },
    });
  });

  /**
   * 聊天
   * @param customerId
   * @returns
   */
  const wecom = async () => {
    if (!info?.customerId) {
      toast("customerId不能为空");
      return;
    }

    //记录点击次数
    await api.qy.submitClick({
      id: info?.orderId,
    });

    qy?.openEnterpriseChat?.({
      externalUserIds: info?.customerId,
      complete: (res) => {
        console.log("openEnterpriseChat", res);
      },
    });
  };

  return (
    <>
      <View className="w-full h-90 flex justify-between items-center">
        {/* 申请时间 */}
        <Text>申请时间:{formatDateTime(info?.createTime, 6, ".")}</Text>
        <Text className="text-[#C5112C]">
          {OrderStatus[info?.status as keyof typeof OrderStatus]}
        </Text>
      </View>
      <View className="w-full h-1 bg-[#CCCCCC]"></View>

      {/* 商品信息 */}
      <View className="pt-36">
        {info?.orderItems?.map((item: any) => {
          return (
            <View
              key={item.id}
              className="w-full flex justify-between items-center mb-36"
            >
              <Text className="max-w-480">{item.name}</Text>
              <View>
                <Text className="mr-46">
                  {item.actualPoints / item.quantity}积分
                </Text>
                <Text>x{item.quantity}</Text>
              </View>
            </View>
          );
        })}

        <View className="w-full flex justify-between items-center mt-12 pb-30">
          <Text>订单积分</Text>
          <View>{info?.totalActualPoints}积分</View>
        </View>
      </View>
      <View className="w-full h-1 bg-[#CCCCCC]"></View>

      {/* 客人信息 */}
      <View className="pt-36">
        <View className="w-full flex justify-between items-center mb-36 relative">
          <View className="flex">
            <Text>预约会员:{info?.memberName}</Text>
            {!!info?.iconFlag && (
              <CImage
                className="w-35 h-28 ml-20"
                mode="widthFix"
                src={qiyeweixin2}
                onClick={wecom}
              ></CImage>
            )}
            {showTip && (
              <View className="text-16 text-[#C5112C] absolute -bottom-24 left-0">
                *已点击超过2次，请勿过于频繁沟通
              </View>
            )}
          </View>
          <View className="flex items-center" onClick={clickCopyPhone}>
            手机号:{info?.mobile}{" "}
            <CImage src={Copy} className="w-20 h-20 ml-10"></CImage>
          </View>
        </View>
        <View className="w-full flex justify-between items-center mb-36">
          <Text>所属彩妆师:{info?.baName}</Text>
          {info.status === ORDER_STATUS_ENUM.WAIT_ESTIMATE ? (
            <View>
              兑礼核销日期:
              {QDayjs(info.receiveTime)?.format("YYYY.MM.DD HH:mm:ss")}
            </View>
          ) : (
            <View>
              {customInfos?.memberDayCoupon || customInfos?.memberDayGood ? (
                <>兑礼有效期至:2025.5.12 23:59:59</>
              ) : (
                <>
                  兑礼有效期至:
                  {QDayjs(availTime)?.format("YYYY.MM.DD HH:mm:ss")}
                </>
              )}
            </View>
          )}
        </View>
        {info.status === ORDER_STATUS_ENUM.WAIT_ESTIMATE && (
          <View className="w-full flex justify-between items-center mb-36">
            <Text>核销彩妆师:{customInfos?.Write0ffBaName}</Text>
          </View>
        )}
      </View>
      <View className="w-full h-1 bg-[#CCCCCC]"></View>

      {info.status === ORDER_STATUS_ENUM.WAIT_RECEIVE && showBtn && (
        <>
          <View className="w-full h-120 flex justify-between items-center">
            <Text className="text-20 text-[#C5112C]">
              {availDay <= 15 && `*该兑礼单还有${availDay}天过期`}
            </Text>

            <VerifyPopup
              orderId={info.orderId}
              mobile={info.mobile}
              callback={callback}
            >
              <View className="w-170 h-60 bg-black text-white vhCenter text-24">
                确认核销
              </View>
            </VerifyPopup>
          </View>
        </>
      )}
    </>
  );
};
export default Index;
