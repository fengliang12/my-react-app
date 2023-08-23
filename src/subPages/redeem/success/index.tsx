import { Text, View } from "@tarojs/components";
import { useSelector } from "react-redux";

import CHeader from "@/src/components/Common/CHeader";
import CImage from "@/src/components/Common/CImage";
import CQRCodeCustom from "@/src/components/Common/CQRCodeCustom";

import OrderGood from "../components/OrderGood";

const OrderConfirm = () => {
  const exchangeGood = useSelector((state: Store.States) => state.exchangeGood);

  return (
    <View className="w-screen min-h-screen bg-black flex flex-col justify-start items-center text-white">
      <CHeader
        title="兑礼结算"
        titleColor="#ffffff"
        backgroundColor="#000000"
        fill
      ></CHeader>
      <View className="w-690 text-28 box-border mt-90">
        <View className="text-54 text-center">
          <CImage src=""></CImage>
          <Text>兑换成功</Text>
        </View>
        <View className="text-24 mt-50 text-center">
          * 礼品将于3个工作日内到达领取柜台
        </View>
      </View>

      <View className="w-690 bg-grayBg px-30 py-40 box-border mt-75 text-white">
        <View>
          <View>领取柜台</View>
          <View className="flex justify-between mt-60">
            <Text>上海</Text>
            <Text>上海</Text>
            <Text>nars上海新天地</Text>
          </View>
        </View>
        <View className="box_title mt-50 font-bold">兑换礼品详情</View>
        <View className="mt-50">
          {exchangeGood?.goods?.length > 0 &&
            exchangeGood?.goods?.map((item) => {
              return <OrderGood good={item} key={item.id}></OrderGood>;
            })}
        </View>
        <View className="w-full h-1 bg-white mt-80"></View>
        <View className="text-55 flex justify-center items-center mt-50">
          <View className="text-32 flex flex-col mr-120">
            <Text>礼品到柜后凭此</Text>
            <Text>核销码到领取柜</Text>
            <Text>台核销领取礼遇</Text>
          </View>
          <CQRCodeCustom
            text="核销码到领取柜"
            width={210}
            height={210}
            foreground="#FFFFFF"
          ></CQRCodeCustom>
        </View>
      </View>
    </View>
  );
};
export default OrderConfirm;
definePageConfig({
  navigationStyle: "custom",
});
