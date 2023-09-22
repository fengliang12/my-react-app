import { Text, View } from "@tarojs/components";
import { useDispatch, useSelector } from "react-redux";

import config from "@/src/config";
import { SET_EXCHANGE_GOOD } from "@/src/store/constants";

const Index = () => {
  const dispatch = useDispatch();
  const { postageType } = useSelector(
    (state: Store.States) => state.exchangeGood,
  );
  /**
   * 类型
   * @param type
   */
  const setPostageType = (type) => {
    dispatch({
      type: SET_EXCHANGE_GOOD,
      payload: {
        postageType: type,
      },
    });
  };
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
