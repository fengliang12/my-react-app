import { Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useMemoizedFn } from "ahooks";
import dayjs from "dayjs";
import React, { useMemo } from "react";

import { OrderStatus } from "@/qyConfig/index";
import { Copy } from "@/src/assets/image";
import CImage from "@/src/components/Common/CImage";
import { formatDateTime } from "@/src/utils";
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
    return dayjs(info.createTime).add(30, "day").format("YYYY.MM.DD HH:mm:ss");
  }, [info]);

  /**
   * 有效期天数
   */
  const availDay = useMemo(() => {
    if (availTime) {
      return dayjs(availTime?.replaceAll(".", "/")).diff(dayjs(), "day");
    }
    return 0;
  }, [availTime]);

  /**
   *
   */
  const clickCopyPhone = useMemoizedFn((phone) => {
    Taro.setClipboardData({
      data: phone,
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
              <Text>{item.name}</Text>
              <View>
                <Text className="mr-43">x{item.quantity}</Text>
                <Text>{item.actualPoints}积分</Text>
              </View>
            </View>
          );
        })}

        <View className="w-full h-70 flex justify-between items-center mt-12">
          <Text>订单积分</Text>
          <View>{info?.totalActualPoints}积分</View>
        </View>
      </View>
      <View className="w-full h-1 bg-[#CCCCCC]"></View>

      {/* 客人信息 */}
      <View className="pt-36">
        <View className="w-full flex justify-between items-center mb-36">
          <Text>预约会员:{info?.memberName}</Text>
          <View
            className="flex items-center"
            onClick={() => {
              clickCopyPhone(info?.mobile);
            }}
          >
            手机号:{info?.mobile}{" "}
            <CImage src={Copy} className="w-20 h-20 ml-10"></CImage>
          </View>
        </View>
        <View className="w-full flex justify-between items-center mb-36">
          <Text>所属彩妆师:{info?.baName}</Text>
          <View>兑礼有效期至:{availTime}</View>
        </View>
      </View>

      {info.status === "wait_receive" && availDay > 0 && (
        <>
          <View className="w-full h-1 bg-[#CCCCCC]"></View>
          <View className="w-full h-120 flex justify-between items-center">
            <Text className="text-20 text-[#C5112C]">
              *该兑礼单还有{availDay}天过期
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
