import { View } from "@tarojs/components";
import Taro, { useRouter } from "@tarojs/taro";
import { useRequest } from "ahooks";
import dayjs from "dayjs";
import { useSelector } from "react-redux";

import api from "@/src/api";
import CHeader from "@/src/components/Common/CHeader";
import CImage from "@/src/components/Common/CImage";
import CQRCodeCustom from "@/src/components/Common/CQRCodeCustom";
import config from "@/src/config";

const app: App.GlobalData = Taro.getApp();
const Index = () => {
  const router = useRouter();
  const userInfo = useSelector((state: Store.States) => state.user);

  const { data } = useRequest(async () => {
    await app.init();
    return await api.arvatoReservation
      .getRecords({
        memberCode: userInfo.marsId,
      })
      .then(
        (res) =>
          res.data.find(
            (i) => i.bookId === Number(router.params.bookId || 0),
          ) || ({} as Api.ArvatoReservation.GetRecords.Item),
      );
  });

  const onCancel = async () => {
    Taro.showModal({
      title: "确认是否取消服务预约",
      success: async (res) => {
        // 点击确定的时候取消服务预约
        if (res.confirm) {
          await api.arvatoReservation.modify({
            bookId: data?.bookId!,
            type: -1,
          });
        }
      },
    });
  };

  return (
    <View className="service-introduce min-h-screen bg-black text-white flex flex-col">
      <CHeader
        back
        titleImage={`${config.imgBaseUrl}/icon/title_image.png`}
        fill
        backgroundColor="rgba(0,0,0,1)"
        titleCss="height:85rpx"
        titleColor="#FFFFFF"
      ></CHeader>
      <CImage
        className="w-690 h-517 mt-40 ml-30"
        src={`${config.imgBaseUrl}/appointment/appointment_detail.jpg`}
      ></CImage>
      <View className="w-560 text-36 text-left font-thin mt-60 ml-85">
        预约服务:{data?.projectName}
      </View>
      <View className="w-560 text-36 text-left font-thin  mt-20 ml-85">
        预约门店:{data?.storeName}
      </View>
      <View className="w-560 text-36 text-left font-thin  mt-20 ml-85">
        预约时间: {dayjs(data?.reserveDate).format("YYYY年MM月DD日")}{" "}
        {data?.timePeriod}
      </View>
      <View className="w-560 text-36 text-left font-thin  mt-20 ml-85">
        请在预约时间凭此核销码至门店
      </View>
      <View className="w-560 text-36 text-left font-thin  mt-20 ml-85">
        尊享服务
      </View>
      <View className="m-auto flex justify-center bg-white mt-45">
        {data?.bookId ? (
          <CQRCodeCustom
            text={data?.bookId as unknown as string}
            width={250}
            height={250}
            padding={10}
            background="#FFFFFF"
          ></CQRCodeCustom>
        ) : null}
      </View>
      {data?.status === "0" ? (
        <View
          className="h-100 text-35 text-center font-thin underline mt-30 mb-60"
          onClick={onCancel}
        >
          取消预约
        </View>
      ) : null}
    </View>
  );
};
export default Index;
