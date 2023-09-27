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
import to from "@/src/utils/to";
import toast from "@/src/utils/toast";

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

  /**
   * 取消服务
   */
  const onCancel = async () => {
    Taro.showModal({
      title: "确认是否取消服务预约",
      success: async (res) => {
        // 点击确定的时候取消服务预约
        if (res.confirm) {
          Taro.showLoading({ title: "加载中", mask: true });
          await api.arvatoReservation
            .modify({
              bookId: data?.bookId!,
              type: -1,
            })
            .catch((err) => {
              toast(err);
            });
          Taro.hideLoading();
          to(1);
        }
      },
    });
  };

  return (
    <View className="service-introduce h-screen bg-black text-white flex flex-col overflow-hidden">
      <CHeader
        back
        titleImage={`${config.imgBaseUrl}/icon/title_image.png`}
        fill
        backgroundColor="rgba(0,0,0,1)"
        titleCss="height:85rpx"
        titleColor="#FFFFFF"
      ></CHeader>
      <CImage
        className="w-750"
        mode="widthFix"
        src={`${data?.detailList?.[0]}`}
      ></CImage>
      <View className="fixed w-full px-50 top-200 left-0 vhCenter flex-col box-border">
        <View className="text-left font-thin mt-60 w-full">
          预约服务:{data?.projectName}
        </View>
        <View className="text-left font-thin  mt-20 w-full">
          预约门店:{data?.storeName}
        </View>
        <View className="text-left font-thin  mt-20 w-full">
          预约时间: {dayjs(data?.reserveDate).format("YYYY年MM月DD日")}{" "}
          {data?.timePeriod}
        </View>
        <View className="text-left font-thin  mt-20 w-full">
          请在预约时间凭此核销码至门店尊享服务
        </View>
        <View className="inline-block bg-white m-auto mt-300">
          {data?.bookCode ? (
            <CQRCodeCustom
              text={data?.bookCode}
              width={280}
              height={280}
              padding={10}
              background="#FFFFFF"
            ></CQRCodeCustom>
          ) : null}
        </View>
        {data?.status === "0" ? (
          <View
            className="w-full text-35 text-center font-thin underline mt-50"
            onClick={onCancel}
          >
            取消预约
          </View>
        ) : null}
      </View>
    </View>
  );
};
export default Index;
