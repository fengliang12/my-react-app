import { Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useMemoizedFn } from "ahooks";
import dayjs from "dayjs";
import React, { useMemo } from "react";

import { ORDER_STATUS_ENUM, OrderStatus } from "@/qyConfig/index";
import { Copy } from "@/src/assets/image";
import CImage from "@/src/components/Common/CImage";
import { codeMapValue, formatDateTime } from "@/src/utils";
import { QDayjs } from "@/src/utils/convertEast8Date";
import toast from "@/src/utils/toast";

import VerifyPopup from "../VerifyPopup";

interface Props {
  info: any;
  callback: () => void;
}
const Index: React.FC<Props> = (props) => {
  let { info, callback } = props;

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

  return (
    <>
      <View className="w-full h-90 flex justify-between items-center">
        {/* 申请时间 */}
        <Text>申请时间:{formatDateTime(info?.createTime, 6, ".")}</Text>
        <Text>{OrderStatus[info?.status]}</Text>
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
        <View className="w-full flex justify-between items-center mb-36">
          <Text>预约会员:{info?.memberName}</Text>
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
      </View>

      {info.status === ORDER_STATUS_ENUM.WAIT_RECEIVE && showBtn && (
        <>
          <View className="w-full h-1 bg-[#CCCCCC]"></View>
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
