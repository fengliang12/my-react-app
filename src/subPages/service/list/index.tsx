import { ScrollView, Text, View } from "@tarojs/components";
import Taro, { useDidShow, useShareAppMessage } from "@tarojs/taro";
import { useRequest, useUpdateEffect } from "ahooks";
import { useState } from "react";

import api from "@/src/api";
import CHeader from "@/src/components/Common/CHeader";
import CImage from "@/src/components/Common/CImage";
import config from "@/src/config";
import { setShareParams } from "@/src/utils";
import to from "@/src/utils/to";

const app: App.GlobalData = Taro.getApp();

const Index = () => {
  const tabList = ["待到店", "已完成", "已失效"];
  const [selectedStatus, setSelectedStatus] = useState<string>("0");
  const [list, setList] =
    useState<Api.ArvatoReservation.GetRecords.IResponse | null>(null);

  const { data, run: init } = useRequest(
    async () => {
      await app.init();
      Taro.showLoading({ title: "加载中", mask: true });
      return await api.adhocReservation.getRecords().then((res) => {
        Taro.hideLoading();
        return res.data.filter((item) => item.bookCode);
      });
    },
    {
      manual: true,
    },
  );

  useUpdateEffect(() => {
    if (selectedStatus && data) {
      //@ts-ignore
      setList(data.filter((item) => item.status == selectedStatus));
    }
  }, [selectedStatus, data]);

  useDidShow(() => {
    init();
  });

  /**
   * 前往详情
   * @param item
   */
  const toDetail = (item) => {
    to(`/subPages/service/detail/index?bookCode=${item.bookCode}`);
  };

  useShareAppMessage(() => {
    return setShareParams();
  });

  return (
    <View className="service-list bg-black text-white w-screen h-screen flex flex-col font-thin box-border pb-50">
      <CHeader
        back
        fill
        backgroundColor="rgba(0,0,0,1)"
        title=""
        titleColor="#FFFFFF"
      ></CHeader>
      <CImage
        className="w-137 h-60 ml-40 mt-40"
        src="https://cna-prd-nars-oss.oss-cn-shanghai.aliyuncs.com/service/nars_logo.png"
      ></CImage>
      <CImage
        className="w-222 h-48 ml-40 mt-22"
        src="https://cna-prd-nars-oss.oss-cn-shanghai.aliyuncs.com/service/record_text.png"
      ></CImage>
      <View className="mt-55 pb-70 px-50 box-border flex text-center text-42">
        {tabList?.map((item, index) => (
          <View
            key={index}
            className="flex-1 flex flex-col justify-center items-center"
            onClick={() => setSelectedStatus(String(index))}
          >
            <Text
              className={` ${
                selectedStatus === String(index)
                  ? "opacity-100 borderBottomWhite"
                  : "opacity-50"
              }`}
            >
              {item}
            </Text>
          </View>
        ))}
      </View>

      <ScrollView className="flex-1 overflow-hidden" scrollY>
        {list?.length ? (
          <>
            {list?.map((item) => (
              <>
                <View
                  key={item.storeId}
                  className="w-690 h-305 bg-grayBg flex ml-30 mb-40 box-border"
                >
                  <CImage className="w-301 h-305" src={item?.imageUrl}></CImage>
                  <View className="flex-1 flex flex-col justify-start pl-30">
                    <View className="text-34 mt-36 w-330">
                      {item.projectName}
                    </View>
                    <View className="mt-26 text-21 flex items-center">
                      <CImage
                        className="w-17 h-24 mr-18"
                        src={`${config.imgBaseUrl}/appointment/address.png`}
                      ></CImage>
                      {item.storeName}
                    </View>
                    <View className="text-21 mt-26 flex items-center">
                      <CImage
                        className="w-20 h-20 mr-18"
                        src={`${config.imgBaseUrl}/appointment/time.png`}
                      ></CImage>
                      {item.serviceTime}
                    </View>
                    <View
                      className="w-191 text-21 h-68 text-black vhCenter bg-white mt-30"
                      onClick={() => toDetail(item)}
                    >
                      查看详情
                    </View>
                  </View>
                </View>
              </>
            ))}
          </>
        ) : (
          <View className="w-full text-center pt-200">暂无预约记录</View>
        )}
      </ScrollView>
    </View>
  );
};
export default Index;
definePageConfig({
  navigationStyle: "custom",
  enableShareAppMessage: true,
});
