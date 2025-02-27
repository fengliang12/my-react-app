import { Text, View } from "@tarojs/components";
import React, { useEffect, useState } from "react";

import { FilterType } from "@/qyConfig/index";

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
            key={item.key}
            onClick={() => {
              setSelectIndex(index);
              callback && callback(item.key);
            }}
          >
            <View className="relative">
              {item.title}
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
