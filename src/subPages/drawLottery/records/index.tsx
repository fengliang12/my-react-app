import { Image, ScrollView, View } from "@tarojs/components";
import Taro, { useDidShow, useRouter } from "@tarojs/taro";
import { useMemoizedFn, useSetState } from "ahooks";
import dayjs from "dayjs";
import { useRef } from "react";

import api from "@/src/api";
import { LogoB } from "@/src/assets/image";
import CHeader from "@/src/components/Common/CHeader";
import { getHeaderHeight } from "@/src/utils/getHeaderHeight";

const app: App.GlobalData = Taro.getApp();
const Index = () => {
  const router = useRouter();
  let _userInfo = useRef<any>({});
  const { id, shopName } = router.params;
  const [state, setState] = useSetState<{
    navHeight: string;
    recordsList: any[];
  }>({
    navHeight: "0Px",
    recordsList: [],
  });

  useDidShow(async () => {
    let userInfo = await app.init(true);
    _userInfo.current = userInfo;
    const rectInfo = getHeaderHeight();
    setState({ navHeight: rectInfo?.headerHeight + "Px" });
    queryDrawRecords();
  });

  /**查询抽奖记录 */
  const queryDrawRecords = useMemoizedFn(async () => {
    const { data } = await api.draw.queryDrawRecords({
      luckDrawId: id, //活动id
      queryType: "real",
      customerId: _userInfo.current?.id, //用户id
    });
    setState({ recordsList: data?.luckDrawRecordList });
  });

  return (
    <View className="px-40 bg-black box-border w-screen h-screen">
      <CHeader back backgroundColor="transparent" title="" fill></CHeader>
      <View>
        <View>
          <Image src={LogoB} className="w-107" mode="widthFix" />
        </View>
        <View className="text-white text-41 mt-26">中奖记录</View>
      </View>
      {/* 列表 */}
      <ScrollView
        scrollY
        className="mt-60 w-full"
        style={{ height: `calc(100vh - ${state.navHeight} - 140Px)` }}
      >
        {state.recordsList.length > 0 ? (
          <>
            {state.recordsList.map((item, index) => {
              return (
                <View key={index} className="bg-white pb-40 mb-20">
                  <View className="text-20 pt-41 pb-32  pl-45">
                    {dayjs(item?.createTime).format("YYYY.MM.DD HH:mm:ss")}
                  </View>
                  <View
                    className="flex pt-27 w-620 ml-32 mr-17 border-t-1 border-x-0 border-b-0  border-solid"
                    style={{ borderColor: "#C3C3C3" }}
                  >
                    <Image
                      src={item?.prizeImg}
                      className="w-124 h-124 mr-66"
                      mode="aspectFit"
                    />
                    <View>
                      <View>
                        <View className="text-20 w-380  overflow-hidden text-ellipsis whitespace-nowrap">
                          {item?.prizeName}
                        </View>
                        {shopName && (
                          <View className="mt-19 w-380 text-20 overflow-hidden text-ellipsis whitespace-nowrap">
                            领取柜台:{decodeURIComponent(shopName)}
                          </View>
                        )}
                      </View>
                      <View className="mt-60 text-20">×{item?.quantity}</View>
                    </View>
                  </View>
                </View>
              );
            })}
          </>
        ) : (
          <View className="text-white text-30 pt-30 text-center">
            暂无中奖记录
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default Index;
