import { Input, Picker, Text, View } from "@tarojs/components";

import CHeader from "@/src/components/Common/CHeader";
import CImage from "@/src/components/Common/CImage";
import config from "@/src/config";

const FilterList: Array<{
  title: string;
  key: string;
}> = [
  {
    title: "全部",
    key: "all",
  },
  {
    title: "已预约",
    key: "all",
  },
  {
    title: "已核销",
    key: "all",
  },
  {
    title: "已过期",
    key: "all",
  },
];
const Index = () => {
  return (
    <View className="bg-[#F8F5F8] min-h-screen pb-100">
      <CHeader fill titleColor="#FFFFFF" backgroundColor="#000000"></CHeader>

      {/* 过滤 */}
      <View className="bg-black px-49 pt-30">
        <View className="flex justify-between items-center mb-24">
          <Picker
            className="w-316"
            mode="selector"
            range={[]}
            onChange={() => {}}
          >
            <View className="bg-white w-full h-78 px-30 text-24 flex items-center justify-start relative box-border">
              <View className="picker">东大区</View>
              <CImage
                className="absolute right-27 w-14 h-8"
                src={`${config.imgBaseUrl}/qy/home/down_icon.png`}
              ></CImage>
            </View>
          </Picker>
          <Picker
            className="w-316"
            mode="selector"
            range={[]}
            onChange={() => {}}
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

        <View className="mb-24">
          <Picker mode="selector" range={[]} onChange={() => {}}>
            <View className="bg-white w-full h-78 px-30 text-24 flex items-center justify-start relative box-border">
              <View className="picker">上海新世界</View>
              <CImage
                className="absolute right-27 w-14 h-8"
                src={`${config.imgBaseUrl}/qy/home/down_icon.png`}
              ></CImage>
            </View>
          </Picker>
        </View>

        <View className="mb-31">
          <Picker mode="date" value="" onChange={() => {}}>
            <View className="bg-white w-full h-78 px-30 text-24 flex items-center justify-start relative box-border">
              <CImage
                className="absolute right-27 w-14 h-8"
                src={`${config.imgBaseUrl}/qy/home/date_icon.png`}
              ></CImage>
              <View className="picker">2024/12/01-2024/12/31</View>
            </View>
          </Picker>
          <View className="text-white text-18 mt-14">
            *顾客提交兑礼申请的日期
          </View>
        </View>

        <View className="flex justify-between items-center mb-45">
          <Input
            className="bg-white w-316 h-78 px-30 text-24 flex items-center justify-start relative box-border"
            placeholder="请输入客户手机号"
          ></Input>
          <Picker
            className="w-316"
            mode="selector"
            range={[]}
            onChange={() => {}}
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

        <View className="w-full h-80 vhCenter text-24 bg-[#C5112C] text-white">
          查询
        </View>
        <View className="w-full h-100 underline text-24 text-white vhCenter">
          重置
        </View>
      </View>

      <View className="w-700 mt-51 ml-25 bg-white">
        {/* tab栏 */}
        <View className="w-full h-100 bg-black text-white flex justify-between text-24">
          {FilterList.map((item) => {
            return (
              <View className="flex-1 h-full vhCenter" key={item.key}>
                {item.title}
              </View>
            );
          })}
        </View>

        <View className="px-25 pb-100 text-24">
          {/* 申请时间 */}
          <View className="w-full h-90 flex justify-between items-center">
            <Text>申请时间:2024.6.28 13:42:31</Text>
            <Text>已核销</Text>
          </View>
          <View className="w-full h-1 bg-[#CCCCCC]"></View>

          {/* 商品信息 */}
          <View className="pt-36">
            <View className="w-full flex justify-between items-center mb-36">
              <Text>产品名称产品名称15ml</Text>
              <View>
                <Text className="mr-43">x1</Text>
                <Text>4000积分</Text>
              </View>
            </View>
            <View className="w-full flex justify-between items-center mb-36">
              <Text>产品名称产品名称15ml</Text>
              <View>
                <Text className="mr-43">x1</Text>
                <Text>4000积分</Text>
              </View>
            </View>

            <View className="w-full h-70 flex justify-between items-center mt-12">
              <Text>订单积分</Text>
              <View>8000积分</View>
            </View>
          </View>
          <View className="w-full h-1 bg-[#CCCCCC]"></View>

          {/* 客人信息 */}
          <View className="pt-36">
            <View className="w-full flex justify-between items-center mb-36">
              <Text>预约会员:张三</Text>
              <View>手机号:13456783456</View>
            </View>
            <View className="w-full flex justify-between items-center mb-36">
              <Text>所属彩妆师:张兰</Text>
              <View>兑礼有效期至:2024.7.28 23:59:59</View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};
export default Index;
