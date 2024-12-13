import "./index.scss";

import { ScrollView, View } from "@tarojs/components";
import { useMemoizedFn } from "ahooks";
import React, { useEffect, useState } from "react";

import CHeader from "@/src/components/Common/CHeader";
import CImage from "@/src/components/Common/CImage";
import HeaderTabbar from "@/src/components/Common/HeaderTabbar";
import config from "@/src/config";

const tabList: Array<any> = [
  { title: "会员规则", value: "rule" },
  { title: "隐私政策", value: "privacy" },
];

const Rule = () => {
  useEffect(() => {});
  const [list, setList] = useState<any>(new Array(8).fill(0));
  const [typeStatus, setTypeStatus] = useState<string>("rule");
  /**
   * 点击菜单栏切换
   */
  const tabClick = useMemoizedFn((val) => {
    if (typeStatus === val) return;
    setTypeStatus(val);
    if (val === "rule") {
      setList(new Array(8).fill(0));
    } else {
      setList(new Array(12).fill(0));
    }
  });

  return (
    <View
      className="rule_page text-white w-screen h-screen flex flex-col items-start justify-start box-border"
      style="background-color: #000000;"
    >
      <CHeader
        back
        titleColor="#ffffff"
        fill
        backgroundColor="rgba(0,0,0,0)"
      ></CHeader>

      <View className="w-full h-60 mt-20">
        <CImage
          className="w-138 ml-40"
          mode="widthFix"
          src={`${config.imgBaseUrl}/icon/title_image.png`}
        ></CImage>
      </View>
      <View className="w-full text-53 text-left px-40 mt-20 box-border">
        会员条款
      </View>

      <View className="w-500 mt-20">
        <HeaderTabbar
          tabList={tabList}
          value={typeStatus}
          tabClick={tabClick}
          style="font-size:42rpx"
        ></HeaderTabbar>
      </View>

      {typeStatus === "rule" && (
        <ScrollView className="flex-1 overflow-hidden mb-50" scrollY>
          {list.map((item, index) => (
            <CImage
              key={index}
              className="w-full"
              mode="widthFix"
              src={`${config.imgBaseUrl}/rule/rule0${index + 1}.jpg?v=1`}
            ></CImage>
          ))}
        </ScrollView>
      )}

      {typeStatus === "privacy" && (
        <ScrollView className="flex-1 overflow-hidden mb-50 -mt-20" scrollY>
          {list.map((item, index) => (
            <CImage
              key={index}
              className="w-full"
              mode="widthFix"
              src={`${config.imgBaseUrl}/privacy/${index + 1}.jpg?v=1`}
            ></CImage>
          ))}
        </ScrollView>
      )}
    </View>
  );
};
export default Rule;
