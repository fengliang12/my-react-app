import "./index.scss";

import { ScrollView, Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useBoolean, useMemoizedFn } from "ahooks";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { cart1, Close } from "@/assets/image/index";
import api from "@/src/api";
import CImage from "@/src/components/Common/CImage";
import CPopup from "@/src/components/Common/CPopup";
import pageSettingConfig from "@/src/config/pageSettingConfig";
import { SET_EXCHANGE_GOOD, SET_RED_DOT } from "@/src/store/constants";
import setShow from "@/src/utils/setShow";
import to from "@/src/utils/to";
import toast from "@/src/utils/toast";

interface T_Props {
  goodClassList: any;
  originList: any;
}

const GoodClass: React.FC<T_Props> = (props) => {
  const { points, isMember } = useSelector((state: Store.States) => state.user);
  const dispatch = useDispatch();
  let { goodClassList, originList } = props;
  const [show, { setTrue, setFalse }] = useBoolean(false);
  const [clickGood, setClickGood] = useState<any>(null);
  const [activeIndex, setActiveIndex] = useState<string>("all");
  const [selectList, setSelectList] = useState([]);
  const { applyType, counter } = useSelector(
    (state: Store.States) => state.exchangeGood,
  );

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
      )?.[0]?.data;
      if (!list) {
        setActiveIndex("all");
      } else {
        setSelectList(list);
      }
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

  /**
   * 直接购买
   */
  const goPage = useMemoizedFn((good) => {
    if (!isMember) {
      to(pageSettingConfig.registerPath, "reLaunch");
      return;
    }

    if (points < good.point) return toast("您的积分不足");

    dispatch({
      type: SET_EXCHANGE_GOOD,
      payload: {
        goods: [{ ...good, quantity: 1 }],
        channelType: "immediately",
      },
    });
    to(`/subPages/redeem/confirm/index`, "navigateTo");
  });

  /**
   * 添加购物车
   */
  const addCart = useMemoizedFn(async (item: any) => {
    if (!isMember) {
      to(pageSettingConfig.registerPath, "reLaunch");
      return;
    }

    if (points < item.point) return toast("您的积分不足");

    Taro.showLoading({ title: "加载中", mask: true });

    let { data: cartList } = await api.cart.locate({
      integral: true,
      counterId: applyType === "self_pick_up" ? counter?.id : undefined,
      customPointsPayPlan: {
        usePoints: true,
        notValidateUsablePoints: true,
      },
    });

    // 查询购物测是否有改商品，如果有调更新接口，无调添加接口
    if (cartList?.goods?.length) {
      let isExistItem = cartList.goods.find((x: any) => x.skuId === item.skuId);
      if (isExistItem) {
        Taro.showLoading({ title: "加载中", mask: true });
        await api.cart.update({
          cartItemId: isExistItem.cartItemId,
          counterId: applyType === "self_pick_up" ? counter?.id : undefined,
          promotionCode: isExistItem.cartItemId,
          quantity: isExistItem.quantity + 1,
          selected: isExistItem.selected,
          skuId: item.skuId,
        });
        Taro.hideLoading();
        toast("已成功添加购物车");
        return;
      }
    }

    let { status, data } = await api.cart.append({
      integral: true,
      quantity: 1,
      skuId: item.skuId,
      counterId: applyType === "self_pick_up" ? counter?.id : undefined,
      customPointsPayPlan: {
        notValidateUsablePoints: false,
        usePoints: true,
      },
    });
    Taro.hideLoading();
    if (status === 200) {
      toast("已成功添加购物车");
      dispatch({
        type: SET_RED_DOT,
        payload: {
          goods: data.goods,
        },
      });
    }
  });

  return (
    <View className="MiniGoodClass h-full text-black text-center py-40 flex flex-col">
      {/* 积分导航 */}
      <View
        className="w-600 mx-75 h-50 text-black text-28 borderBottomBlack box-border overflow-y-scroll"
        style="white-space: nowrap;height:70rpx"
      >
        {goodClassList?.length > 0 &&
          goodClassList.map((item, index: number) => {
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
          })}
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
                  <View
                    className="w-full relative"
                    onClick={() => {
                      setClickGood(child);
                      setTrue();
                    }}
                  >
                    <CImage className="w-230 h-230" src={child.mainImage} />
                    <View className="w-full h-1 bg-black opacity-0"></View>
                    <View className="text-22 h-60 leading-30 mt-18 w-full text-left ENGLISH_FAMILY text-overflow-more">
                      {child.name}
                    </View>
                    <View className="text-22 mt-12 mb-25 w-full text-left ENGLISH_FAMILY">
                      {child.point}积分
                    </View>
                  </View>
                  {child?.sellOut && (
                    <View
                      className="w-full h-full font-thin absolute top-0 left-0 text-white vhCenter text-53 z-99 rounded-9"
                      style="background-color:rgba(0,0,0,0.5);letter-spacing: 2px;"
                      onClick={() => {
                        setClickGood(child);
                        setTrue();
                      }}
                    >
                      已兑完
                    </View>
                  )}
                  <View
                    className="w-full h-50 text-24 flex text-center mt-10 text-white"
                    style={{ border: "1px solid #000" }}
                  >
                    <View
                      className="flex-1 h-full bg-black vhCenter"
                      onClick={() => goPage(child)}
                    >
                      立即兑换
                    </View>
                    {child.type !== "PRODUCTCOUPON" && (
                      <View
                        className="w-80 vhCenter"
                        style="border-right:1px solid #ffffff"
                        onClick={() => addCart(child)}
                      >
                        <CImage className="w-44 h-44" src={cart1}></CImage>
                      </View>
                    )}
                  </View>
                </View>
              );
            })
          ) : (
            <View className="w-full text-center mt-400">暂无商品数据</View>
          )}
        </View>
      </ScrollView>
      {/* 商品详情 */}
      <View style={setShow(show)}>
        <CPopup
          maskClose
          closePopup={() => {
            setClickGood(null);
            setFalse();
          }}
        >
          <View className="w-647 pt-30 pb-50 bg-white rounded-20 overflow-hidden flex flex-col justify-center items-center">
            <CImage
              className="absolute w-34 h-34 top-53 right-40"
              onClick={() => {
                setClickGood(null);
                setFalse();
              }}
              src={Close}
            ></CImage>
            <CImage className="w-400 h-400" src={clickGood?.mainImage}></CImage>
            <Text decode className="w-450 text-27 text-center ENGLISH_FAMILY">
              {clickGood?.description}
            </Text>
            <View className="w-450 mt-41 mb-56 text-38 ENGLISH_FAMILY">
              {clickGood?.point}积分
            </View>
            <View
              className="w-410 h-67 text-26 rounded-4 bg-black vhCenter text-white"
              onClick={() => {
                setClickGood(null);
                setFalse();
              }}
            >
              我知道了
            </View>
          </View>
        </CPopup>
      </View>
    </View>
  );
};
export default GoodClass;
