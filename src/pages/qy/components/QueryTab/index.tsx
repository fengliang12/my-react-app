import { View } from "@tarojs/components";
import React, { useState } from "react";

import { FilterType } from "@/qyConfig/index";

interface Props {
  FilterList: Array<FilterType>;
  callback?: (key: string) => void;
}
const Index: React.FC<Props> = (props) => {
  let { FilterList = [], callback } = props;
  const [selectIndex, setSelectIndex] = useState(0);

  return (
    <View className="w-full h-100 bg-black text-white flex justify-between text-24">
      {FilterList.map((item, index) => {
        return (
          <View
            className="flex-1 h-full vhCenter"
            key={item.value}
            onClick={() => {
              setSelectIndex(index);
              callback && callback(item.value);
            }}
          >
            <View className="relative">
              {item.label}
              {selectIndex === index && (
                <View className="absolute -bottom-10 left-0 w-full h-4 bg-white"></View>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
};
export default Index;
