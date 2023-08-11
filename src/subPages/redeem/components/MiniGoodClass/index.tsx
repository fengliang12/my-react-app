import "./index.scss";

import { View } from "@tarojs/components";
import { useEffect, useState } from "react";

import CImage from "@/src/components/Common/CImage";

interface T_Props {
  goodClassList: any;
  clickSelectGood: (e: any) => void;
  addCart: (e: any) => void;
  goPage: (pageType: string, e: any) => void;
}

const GoodClass: React.FC<T_Props> = (props) => {
  let { goodClassList, clickSelectGood, addCart, goPage } = props;
  const [activeIndex, setActiveIndex] = useState<string>();
  const [selectList, setSelectList] = useState([]);
  useEffect(() => {
    if (!goodClassList?.length || activeIndex) return;
    setActiveIndex(goodClassList[0].point);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [goodClassList]);

  /**
   * 对应tab下的商品
   */
  useEffect(() => {
    if (!goodClassList || !activeIndex) return;
    let list = goodClassList.filter(
      (item: any) => item.point === activeIndex,
    )[0].data;
    setSelectList(list);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, goodClassList]);

  /**
   * 点击积分栏
   * @param index
   */
  const tabClick = (index: string) => {
    setActiveIndex(index);
  };

  return (
    <View className="MiniGoodClass text-black text-center py-40 px-70">
      {/* 积分导航 */}
      <View
        className="w-full text-black text-28 pb-40 mb-40 overflow-x-scroll"
        style="border-bottom:1px solid #000000"
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
      <View className="">
        <View className="w-full flex flex-wrap justify-between">
          {selectList?.length ? (
            selectList.map((child: any, index) => {
              return (
                <View
                  className="GoodItem w-290 px-30 py-20 shadow-custom flex flex-col items-center mb-40 relative box-border"
                  key={index}
                >
                  <View
                    className="w-full relative"
                    onClick={() => clickSelectGood(child.id)}
                  >
                    <CImage className="w-230 h-230" src={child.mainImage} />
                    <View className="w-full h-1 bg-black"></View>
                    {/* {(child?.sellOut ||
                      !child?.status ||
                      child?.perSkuLimit) && (
                      <View
                        className="w-125 h-52 absolute top-114 left-84 vhCenter text-21 text-black z-99 rounded-9"
                        style="background-color:rgba(0,0,0,0.5);border:1px solid #ffffff"
                      >
                        {child?.perSkuLimit
                          ? "已兑礼"
                          : !child?.status
                          ? "已下架"
                          : "暂无库存"}
                      </View>
                    )} */}
                    <View className="text-22 my-10 w-full text-left">
                      {child.name}
                    </View>
                    <View className="text-22 my-10 w-full text-left">
                      {child.point}分
                    </View>
                  </View>
                  <View
                    className="w-full h-50 text-24 text-center mt-10 text-white"
                    style={{ border: "1px solid #000" }}
                  >
                    <View
                      className="w-150 h-full flex-1 bg-black vhCenter"
                      onClick={() => goPage("vipExchange", child)}
                    >
                      立即兑换
                    </View>
                    <View
                      className="flex-1"
                      style="border-right:1px solid #ffffff"
                      onClick={() => addCart(child)}
                    >
                      加入购物车
                    </View>
                  </View>
                </View>
              );
            })
          ) : (
            <View className="w-full text-center">暂无商品数据</View>
          )}
        </View>
      </View>
    </View>
  );
};
export default GoodClass;
