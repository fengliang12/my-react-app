import { Text, View } from "@tarojs/components";

import config from "@/src/config";

const Index = () => {
  return (
    <View className="text-28 mt-40">
      <View className="flex items-center justify-between">
        <Text>快递到家</Text>
        <Text className="ENGLISH_FAMILY">
          {config.postagePoints}
          <Text className="text-18 relative -top-1"> 积分</Text>
        </Text>
      </View>
    </View>
  );
};
export default Index;
