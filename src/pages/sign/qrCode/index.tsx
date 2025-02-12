import { View } from "@tarojs/components";
import { useRouter } from "@tarojs/taro";
import { useMemoizedFn, useRequest } from "ahooks";
import dayjs from "dayjs";
import { useMemo } from "react";

import api from "@/src/api";
import CHeader from "@/src/components/Common/CHeader";
import CQRCodeCustom from "@/src/components/Common/CQRCodeCustom";
import config from "@/src/config";

import RulePopup from "../components/RulePopup";
import useActivityHook from "../hooks/activity";

const Index = () => {
  const { params } = useRouter();
  const { activityDetail } = useActivityHook();

  const getQrCode = useMemoizedFn(async () => {
    let res = await api.clockin.createClockInQrCode(params?.counterCode);
    return res?.data || "";
  });

  const { data: qrCode } = useRequest(getQrCode, {
    pollingInterval: 10000,
  });

  const { data: counterInfo } = useRequest(async () => {
    if (params?.counterCode) {
      let res = await api.counter.getCounterDetail(params?.counterCode);
      return res?.data || "";
    }
  }, {});

  const timeStr = useMemo(() => {
    let str = dayjs().add(10, "second").format("HH:mm:ss");
    return str;
  }, [qrCode]);

  return (
    <View
      className="w-full min-h-screen"
      style={{
        background: `url(${config.imgBaseUrl}/sign/qrCodeBg.jpg)`,
        backgroundSize: "100% 100%",
      }}
    >
      <CHeader
        back
        fill
        title="NARS"
        backgroundColor="rgba(0,0,0,0)"
        titleColor="#FFFFFF"
      ></CHeader>

      <View className="w-640 mt-55 ml-55 pb-80 text-white">
        <View className="w-full flex justify-end text-20">
          <RulePopup imageUrl={activityDetail.ruleImage}></RulePopup>
        </View>

        <View className="w-full mt-62 text-54 text-center">
          重磅上新 到店有礼
        </View>

        <View className="w-full text-center text-32 mt-50">
          请出示给会员进行扫码 参与打卡活动
        </View>

        <View className="w-full mt-140 text-32 text-center box-border">
          {counterInfo?.detailInfo?.name}
        </View>
        <View className="w-356 ml-142 h-356 mt-81 bg-white">
          <CQRCodeCustom
            text={qrCode}
            width={356}
            height={356}
            padding={20}
            background="#FFFFFF"
          ></CQRCodeCustom>
        </View>

        <View className="w-full mt-80 text-24 text-center">
          活动码将于 {timeStr} 更新 截图无效
        </View>
        <View className="w-full mt-147 text-20 text-center">
          *活动将根据门店追踪打卡及积分发放数据，
        </View>
        <View className="w-full mt-20 text-20 text-center">
          切勿将活动码链接转发给客人
        </View>
      </View>
    </View>
  );
};
export default Index;
