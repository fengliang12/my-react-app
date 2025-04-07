import { ScrollView, View } from "@tarojs/components";
import React, { useState } from "react";

import { FilterType } from "@/qyConfig/index";

interface Props {
  total?: number;
  FilterList: Array<FilterType>;
  callback?: (key: string) => void;
}
const Index: React.FC<Props> = (props) => {
  let { total, FilterList = [], callback } = props;
  const [selectIndex, setSelectIndex] = useState(0);

  return (
    <ScrollView
      scrollX
      enableFlex
      enhanced
      showScrollbar={false}
      className="w-full h-100 bg-black text-white whitespace-nowrap text-24"
    >
      {FilterList.map((item, index) => {
        return (
          <View
            className="inline-block h-100 px-50 black whitespace-nowrap"
            key={item.value}
            onClick={() => {
              setSelectIndex(index);
              callback && callback(item.value);
            }}
          >
            <View className="relative h-full flex items-center justify-center">
              {item.label}
              {selectIndex === index && (
                <>
                  {total ? `(${total})` : ""}
                  <View
                    className="absolute bottom-20 w-60 h-4 bg-white"
                    style={{
                      position: "absolute",
                      left: "50%",
                      transform: "translateX(-55%)",
                    }}
                  ></View>
                </>
              )}
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
};
export default Index;
