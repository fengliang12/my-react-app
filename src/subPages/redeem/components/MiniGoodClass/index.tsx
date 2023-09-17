import "./index.scss";

import { ScrollView, View } from "@tarojs/components";
import { useMemoizedFn } from "ahooks";
import { useEffect, useState } from "react";

import { cart1 } from "@/assets/image/index";
import CImage from "@/src/components/Common/CImage";

interface T_Props {
  goodClassList: any;
  originList: any;
  clickSelectGood?: (e: any) => void;
  addCart: (e: any) => void;
  goPage: (e: any) => void;
}

const GoodClass: React.FC<T_Props> = (props) => {
  let { goodClassList, originList, clickSelectGood, addCart, goPage } = props;
  const [activeIndex, setActiveIndex] = useState<string>("all");
  const [selectList, setSelectList] = useState([]);

  /**
   * 对应tab下的商品
   */
  useEffect(() => {
    if (!goodClassList || !activeIndex) return;
    if (activeIndex === "all") {
      setSelectList(originList);
    } else {
      let list = goodClassList.filter(
        (item: any) => item.point === activeIndex,
      )[0].data;
      setSelectList(list);
    }
  }, [activeIndex, goodClassList, originList]);

  /**
   * 点击积分栏
   * @param index
   */
  const tabClick = useMemoizedFn((index: string) => {
    if (index === activeIndex) {
      setActiveIndex("all");
    } else {
      setActiveIndex(index);
    }
  });

  return (
    <View className="MiniGoodClass h-full text-black text-center py-40 flex flex-col">
      {/* 积分导航 */}
      <View
        className="w-full h-50 text-black text-28 borderBottomBlack px-70 box-border overflow-x-scroll"
        style="white-space: nowrap;height:100rpx"
      >
        {goodClassList?.length ? (
          goodClassList.map((item: any, index: number) => {
            return (
              <View
                className={`h-50 leading-50 mx-20 vhCenter ${
                  item.point === activeIndex ? "active" : ""
                }`}
                key={index}
                style="display:inline-block;"
                onClick={() => tabClick?.(item.point)}
              >
                {item.point}分
              </View>
            );
          })
        ) : (
          <View></View>
        )}
      </View>

      {/* 商品列表 */}
      <ScrollView className="flex-1 overflow-hidden" scrollY>
        <View className="w-full flex flex-wrap justify-between px-70 box-border py-40">
          {selectList?.length ? (
            selectList.map((child: any, index) => {
              return (
                <View
                  className="GoodItem w-290 px-30 py-20 shadow-custom flex flex-col items-center mb-40 relative box-border"
                  key={index}
                >
                  <View className="w-full relative">
                    <CImage className="w-230 h-230" src={child.mainImage} />
                    <View className="text-22 h-60 my-10 w-full text-left">
                      {child.name}
                    </View>
                    <View className="text-22 my-10 w-full text-left">
                      {child.point}分
                    </View>
                  </View>
                  {child?.sellOut && (
                    <View
                      className="w-full h-full absolute top-0 left-0 text-white vhCenter text-38 z-99 rounded-9"
                      style="background-color:rgba(0,0,0,0.5);"
                    >
                      售 罄
                    </View>
                  )}
                  <View
                    className="w-full h-50 text-24 flex text-center mt-10 text-white"
                    style={{ border: "1px solid #000" }}
                  >
                    <View
                      className="w-150 h-full bg-black vhCenter"
                      onClick={() => goPage(child)}
                    >
                      立即兑换
                    </View>
                    <View
                      className="flex-1 vhCenter"
                      style="border-right:1px solid #ffffff"
                      onClick={() => addCart(child)}
                    >
                      <CImage className="w-44 h-44" src={cart1}></CImage>
                    </View>
                  </View>
                </View>
              );
            })
          ) : (
            <View className="w-full text-center mt-400">暂无商品数据</View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};
export default GoodClass;
