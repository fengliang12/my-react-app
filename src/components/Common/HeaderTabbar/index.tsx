import "./index.scss";

import { View, ViewProps } from "@tarojs/components";
import React from "react";

interface T_tabItem {
  title: string;
  index: number;
  [props: string]: any;
}
interface T_props extends ViewProps {
  tabList: T_tabItem[];
  activeIndex: number;
  tabClick: (index: number) => void;
}

const HeaderTabbar: React.FC<Partial<T_props>> = (props) => {
  let { tabList, activeIndex, tabClick } = props;
  return (
    <View className="header_tab" {...props}>
      {tabList?.length &&
        tabList.map((item: any) => {
          return (
            <View
              className={
                item?.index === activeIndex ? "tab-item  active" : "tab-item "
              }
              onClick={() => tabClick?.(item?.index)}
              key={item.title}
            >
              {item.title}
            </View>
          );
        })}
    </View>
  );
};
export default HeaderTabbar;
