import "./index.scss";

import { View, ViewProps } from "@tarojs/components";
import React from "react";

interface T_tabItem {
  title: string;
  [props: string]: any;
}
interface T_props extends ViewProps {
  tabList: T_tabItem[];
  value: any;
  tabClick: (index: number) => void;
}

const HeaderTabbar: React.FC<Partial<T_props>> = (props) => {
  let { tabList, value, tabClick } = props;
  return (
    <View className={`header_tab ${props.className}`} style={props.style}>
      {tabList?.length &&
        tabList.map((item: any) => {
          return (
            <View
              className={
                item?.value === value ? "tab-item  active" : "tab-item "
              }
              onClick={() => tabClick?.(item?.value)}
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
