import { Input, Picker, Text, View } from "@tarojs/components";
import { useSetState } from "ahooks";

import CHeader from "@/src/components/Common/CHeader";
import CImage from "@/src/components/Common/CImage";
import config from "@/src/config";

import QueryResult from "../components/QueryResult";
import QueryTab from "../components/QueryTab";
import VerifyPopup from "../components/VerifyPopup";

const Index = () => {
  const [state, setState] = useSetState({
    parentRegion: "",
    region: "",
    store: "",
    point: "",
  });
  const parentRegionList = [];
  const regionList = [];
  const storeList = [];
  const pointList = [];

  return (
    <View className="bg-[#F8F5F8] min-h-screen pb-100">
      <CHeader fill titleColor="#FFFFFF" backgroundColor="#000000"></CHeader>

      {/* 过滤 */}
      <View className="bg-black px-49 pt-30">
        <View className="flex justify-between items-center mb-24">
          {/* 大区 */}
          <Picker
            className="w-316"
            mode="selector"
            range={parentRegionList}
            rangeKey="name"
            onChange={(e) => {
              setState({
                parentRegion: parentRegionList[e.detail.value],
              });
            }}
          >
            <View className="bg-white w-full h-78 px-30 text-24 flex items-center justify-start relative box-border">
              <View className="picker">东大区</View>
              <CImage
                className="absolute right-27 w-14 h-8"
                src={`${config.imgBaseUrl}/qy/home/down_icon.png`}
              ></CImage>
            </View>
          </Picker>

          {/* 区域主管 */}
          <Picker
            className="w-316"
            mode="selector"
            range={regionList}
            rangeKey="name"
            onChange={(e) => {
              setState({
                region: regionList[e.detail.value],
              });
            }}
          >
            <View className="bg-white w-full h-78 px-30 text-24 flex items-center justify-start relative box-border">
              <View className="picker">东一区</View>
              <CImage
                className="absolute right-27 w-14 h-8"
                src={`${config.imgBaseUrl}/qy/home/down_icon.png`}
              ></CImage>
            </View>
          </Picker>
        </View>

        {/* 门店 */}
        <View className="mb-24">
          <Picker mode="selector" range={storeList} onChange={() => {}}>
            <View className="bg-white w-full h-78 px-30 text-24 flex items-center justify-start relative box-border">
              <View className="picker">上海新世界</View>
              <CImage
                className="absolute right-27 w-14 h-8"
                src={`${config.imgBaseUrl}/qy/home/down_icon.png`}
              ></CImage>
            </View>
          </Picker>
        </View>

        {/* 申请时间 */}
        <View className="mb-31">
          <Picker mode="date" value="" onChange={() => {}}>
            <View className="bg-white w-full h-78 px-70 text-24 flex items-center justify-start relative box-border">
              <CImage
                className="absolute left-27 w-24 h-24"
                src={`${config.imgBaseUrl}/qy/home/date_icon.png`}
              ></CImage>
              <View className="picker">2024/12/01-2024/12/31</View>
              <CImage
                className="absolute right-27 w-14 h-8"
                src={`${config.imgBaseUrl}/qy/home/down_icon.png`}
              ></CImage>
            </View>
          </Picker>
          <View className="text-white text-18 mt-14">
            *顾客提交兑礼申请的日期
          </View>
        </View>

        <View className="flex justify-between items-center mb-45">
          {/* 请输入客户手机号 */}
          <Input
            className="bg-white w-316 h-78 px-30 text-24 flex items-center justify-start relative box-border"
            placeholder="请输入客户手机号"
          ></Input>
          <Picker
            className="w-316"
            mode="selector"
            range={pointList}
            onChange={() => {}}
          >
            <View className="bg-white w-full h-78 px-30 text-24 flex items-center justify-start relative box-border">
              <View className="picker">礼品挡位</View>
              <CImage
                className="absolute right-27 w-14 h-8"
                src={`${config.imgBaseUrl}/qy/home/down_icon.png`}
              ></CImage>
            </View>
          </Picker>
        </View>

        <View className="w-full h-80 vhCenter text-24 bg-[#C5112C] text-white">
          查询
        </View>
        <View className="w-full h-100 underline text-24 text-white vhCenter">
          重置
        </View>
      </View>

      {/* 内容 */}
      <View className="w-700 mt-51 ml-25 bg-white">
        {/* tab栏 */}
        <QueryTab></QueryTab>

        <View className="px-25 pb-0 text-24 h-630">
          {/* 查询结果-静态内容 */}
          <QueryResult></QueryResult>

          <View className="w-full h-1 bg-[#CCCCCC]"></View>
          <View className="w-full h-120 flex justify-between items-center">
            <Text className="text-20 text-[#C5112C]">
              *该兑礼单还有14天过期
            </Text>

            <VerifyPopup
              callback={function (): void {
                throw new Error("Function not implemented.");
              }}
            >
              <View className="w-170 h-60 bg-black text-white vhCenter text-24">
                确认核销
              </View>
            </VerifyPopup>
          </View>
        </View>
      </View>
    </View>
  );
};
export default Index;
