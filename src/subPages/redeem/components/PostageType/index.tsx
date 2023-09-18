import { Text, View } from "@tarojs/components";
import React, { useEffect } from "react";

import config from "@/src/config";

interface PropsType {
  postageType: string;
  setPostageType: (e: string) => void;
}
const Index: React.FC<PropsType> = (props) => {
  let { postageType, setPostageType } = props;

  return (
    <View className="text-24 mt-40">
      <View
        className="flex items-center"
        onClick={() => setPostageType("points")}
      >
        <View className="borderBlack w-16 h-16 rounded-16 vhCenter mr-10">
          {postageType === "points" && (
            <View className="w-12 h-12 rounded-12 bg-black"></View>
          )}
        </View>
        <Text>{config.postagePoints}积分抵扣邮费</Text>
      </View>
      <View
        className="flex items-center"
        onClick={() => setPostageType("money")}
      >
        <View className="borderBlack w-16 h-16 rounded-16 vhCenter mr-10">
          {postageType === "money" && (
            <View className="w-12 h-12 rounded-12 bg-black"></View>
          )}
        </View>
        <Text>{config.postageMoney}元付邮到家</Text>
      </View>
    </View>
  );
};
export default Index;
