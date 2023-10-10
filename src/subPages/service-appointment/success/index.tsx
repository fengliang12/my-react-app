import { View } from "@tarojs/components";
import Taro, { useRouter } from "@tarojs/taro";
import { useRequest } from "ahooks";
import dayjs from "dayjs";

import api from "@/src/api";
import CHeader from "@/src/components/Common/CHeader";
import CImage from "@/src/components/Common/CImage";
import config from "@/src/config";
import to from "@/src/utils/to";

const app: App.GlobalData = Taro.getApp();
const Index = () => {
  const router = useRouter();

  const { data } = useRequest(async () => {
    const userInfo = await app.init();
    Taro.showLoading({ title: "加载中", mask: true });
    return await api.arvatoReservation
      .getRecords({
        memberCode: userInfo.marsId,
      })
      .then((res) => {
        Taro.hideLoading();
        return (
          res.data.find(
            (i) => i.bookId === Number(router.params.bookId || 0),
          ) || ({} as Api.ArvatoReservation.GetRecords.Item)
        );
      });
  });

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
      <View className="fixed w-full px-50 top-300 left-0 text-42 box-border">
        预约成功！
      </View>
      <View className="fixed text-30 font-thin  w-full px-50 top-800 left-0 vhCenter flex-col box-border">
        <View className="text-left leading-45 mt-20 w-full">
          请您于{dayjs(data?.reserveDate).format("YYYY-MM-DD")}至
          {data?.storeName}体验{data?.projectName}服务。
        </View>
        <View className="text-left mt-70 w-full">
          您可在预约记录查看您的预约。
        </View>
        <View className="text-left mt-10 w-full">
          服务开始前24小时不可取消哦!
        </View>
        <View
          className="h-50 text-center mt-200 borderBottomWhite"
          onClick={() =>
            to("/subPages/service-appointment/list/index", "navigateTo")
          }
        >
          预约记录
        </View>
      </View>
    </View>
  );
};
export default Index;
