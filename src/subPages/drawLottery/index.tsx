import { Image, Text, View } from "@tarojs/components";
import Taro, { useDidShow, useRouter } from "@tarojs/taro";
import { useMemoizedFn, useSetState } from "ahooks";
import dayjs from "dayjs";
import { useRef } from "react";
import { useSelector } from "react-redux";

import api from "@/src/api";
import CHeader from "@/src/components/Common/CHeader";
import CPopup from "@/src/components/Common/CPopup";
import pageSettingConfig from "@/src/config/pageSettingConfig";
import useLoaclBehavior from "@/src/hooks/useLoaclBehavior";
import { debounceImme } from "@/src/utils";
import { getHeaderHeight } from "@/src/utils/getHeaderHeight";

interface IInitState {
  activityBg: string;
  navHeight: string;
  activityTitle: string;
  activityStartTime: string;
  activityEndTime: string;
  giftsList: any[];
  surplusDrawTimes: number;
  showRulePopup: boolean;
  showDrawPopup: boolean;
  /**设置的圈数*/
  turn: number;
  /**中奖的奖品信息*/
  prize: any;
  showFailPopup: "noTimes" | "noPrize" | "";
  ruleImage: string;
  activityStatus: string;
}

const app: App.GlobalData = Taro.getApp();
const now = dayjs();
const Index = () => {
  const userInfo = useSelector((state: Store.States) => state.user);
  const router = useRouter();
  const { id = "d3dhh28hd" } = router.params;
  const { addBehavior } = useLoaclBehavior("DRAW");
  const [state, setState] = useSetState<IInitState>({
    activityBg: "",
    navHeight: "",
    activityTitle: "",
    activityStartTime: "",
    activityEndTime: "",
    giftsList: [],
    surplusDrawTimes: 0,
    showRulePopup: false,
    showDrawPopup: false,
    turn: 3,
    prize: {},
    showFailPopup: "",
    ruleImage: "",
    activityStatus: "",
  });
  let _userInfo = useRef<any>({});
  let _activityLuckDrawId = useRef<any>("");
  /**是否正在抽奖*/
  const drawing = useRef<boolean>(false);

  useDidShow(async () => {
    addBehavior("DRAW_VIEW");
    Taro.hideShareMenu();

    let userInfo = await app.init(true);
    _userInfo.current = userInfo;

    await getDrawDetail();
    const rectInfo = getHeaderHeight();
    setState({ navHeight: rectInfo?.headerHeight + "Px" });
    surplusDrawTimes();
  });

  /**根据code获取抽奖活动详情 */
  const getDrawDetail = useMemoizedFn(async () => {
    const { data } = await api.draw.getDrawDetail({
      code: id,
      customerId: _userInfo.current?.id,
    });
    let giftsList: any[] = [];
    if (data) {
      giftsList = data?.awardItems.splice(0, 6) || [];
      let noPrizeSetting = data?.noPrizeSetting?.imageList?.[0] || {};

      // 谢谢参与
      giftsList.splice(2, 0, {
        prizeId: "thanks0",
        id: "thanks_id_0",
        auxiliaryImage: noPrizeSetting,
      });
      // 按钮
      giftsList.splice(4, 0, {
        prizeId: "draw",
        id: "draw_id_1",
        auxiliaryImage:
          "https://cna-prd-nars-oss.oss-cn-shanghai.aliyuncs.com/lottery/button.png",
      });
      giftsList.splice(6, 0, {
        prizeId: "thanks1",
        id: "thanks_id_1",
        auxiliaryImage: noPrizeSetting,
      });

      // 判断活动是否开始
      if (now.isBefore(dayjs(data?.activityStartTime))) {
        setState({ activityStatus: "notStart" });
      }

      if (now.isAfter(dayjs(data?.activityEndTime))) {
        setState({ activityStatus: "isOver" });
      }

      setState({
        activityBg: data?.headPicture,
        activityTitle: data?.activityTitle,
        activityStartTime: data?.activityStartTime,
        activityEndTime: data?.activityEndTime,
        giftsList: giftsList,
        ruleImage: data?.ruleImage,
      });
      _activityLuckDrawId.current = data?.id;
    } else {
      Taro.showToast({ title: "活动不存在", icon: "none", duration: 1500 });
      setTimeout(() => {
        app.to(pageSettingConfig.homePath);
      }, 2000);
    }
  });

  /**剩余抽奖次数 */
  const surplusDrawTimes = useMemoizedFn(async () => {
    if (!_userInfo.current?.id || !_activityLuckDrawId.current) return;
    const { data } = await api.draw.surplusDrawTimes({
      customerId: _userInfo.current?.id,
      activityLuckDrawId: _activityLuckDrawId.current,
    });
    setState({ surplusDrawTimes: data || 0 });
    return data;
  });

  /**开始抽奖 */
  const startDraw = debounceImme(async () => {
    if (!_userInfo.current?.isMember) {
      app.to(pageSettingConfig.registerPath);
      return;
    }
    if (!_userInfo.current?.id || !_activityLuckDrawId.current) return;

    // 判断活动是否开始
    if (now.isBefore(dayjs(state.activityStartTime))) {
      setState({ activityStatus: "notStart" });
      return;
    }

    if (now.isAfter(dayjs(state.activityEndTime))) {
      setState({ activityStatus: "isOver" });
      return;
    }

    if (drawing.current || state.surplusDrawTimes <= 0) {
      if (state.surplusDrawTimes <= 0) {
        setState({ showFailPopup: "noTimes" });
        return;
      }
      if (drawing.current) {
        Taro.showToast({ title: "正在抽奖", icon: "none" });
        return;
      }
    }
    drawing.current = true;
    const { data } = await api.draw.startDraw({
      customerId: _userInfo.current?.id,
      activityLuckDrawId: _activityLuckDrawId.current,
      locationId: "",
    });
    // 更新抽奖次数
    surplusDrawTimes();
    //顺时针
    const path = [0, 1, 2, 5, 8, 7, 6, 3];
    let curIndex = 0;
    let turn = 0; //

    let curId = data.id || null;
    // 谢谢参与
    if (!curId || null) {
      let array = ["thanks_id_0", "thanks_id_1"];
      curId = array[Math.floor(Math.random() * array.length)];
    }

    const intervalId = setInterval(() => {
      if (curIndex > 7) {
        curIndex = 0;
        turn = turn + 1;
      }

      // 圈数够了且奖品是指定的就停止
      if (turn === state.turn && curId === state.giftsList[path[curIndex]].id) {
        clearInterval(intervalId);
        let prize = data;
        prize.visible = true;
        drawing.current = false;
        setState({ prize });
        if (
          !["thanks_id_0", "thanks_id_0", "draw_id_1"].includes(data?.id) &&
          data?.id
        ) {
          setTimeout(() => {
            setState({ showDrawPopup: true });
          }, 1000);
        } else {
          setState({ showFailPopup: "noPrize" });
        }
      }

      // if (stop) clearInterval(intervalId)
      let prizeList = state.giftsList.map((item) => {
        if (item?.id === state.giftsList[path[curIndex]]?.id) {
          item.action = true;
        } else {
          item.action = false;
        }
        return item;
      });
      setState({ giftsList: prizeList });
      curIndex++;
    }, 50);
  }, 2000);

  return (
    <>
      <View className=" w-screen h-screen  flex flex-col">
        <CHeader
          back
          backgroundColor="transparent"
          title=""
          fill={false}
        ></CHeader>
        <View
          className="w-screen h-screen  relative bg-no-repeat bg-center bg-cover"
          style={{
            backgroundImage: `url(${state.activityBg})`,
            paddingTop: state.navHeight,
          }}
        >
          <View className="w-full mt-30 flex flex-col items-center">
            <View className="text-white text-48">{state.activityTitle}</View>
            <View className="text-white text-20 mt-32">
              活动时间:
              {dayjs(state?.activityStartTime).format("YYYY年MM月DD日")} -{" "}
              {dayjs(state?.activityEndTime).format("YYYY年MM月DD日")}
            </View>
            <View className="text-white text-20 mt-22">
              至指定柜台任意消费即可随单加赠奖品
            </View>
          </View>
          {/* 九宫格 */}
          {state.giftsList.length > 0 && (
            <View
              className="w-668 h-668 overflow-hidden box-border relative mt-512 flex justify-between z-100 mx-auto flex-wrap border-4 "
              style={{
                border: "2px solid #ce1f1f",
                boxShadow: "0px 0px 20px #e02727",
              }}
            >
              {state.giftsList.map((itm, idx) => {
                return (
                  <View
                    key={idx}
                    className="relative w-220 z-10"
                    onClick={() => {
                      idx === 4 && startDraw();
                    }}
                  >
                    <View className="flex justify-center items-center w-220">
                      <Image
                        src={itm?.auxiliaryImage}
                        mode="widthFix"
                        className="w-full block"
                      />
                    </View>
                    {idx === 4 && (
                      <View
                        className="absolute text-18 top-137 left-43"
                        style={{ color: "#979797" }}
                      >
                        {state.surplusDrawTimes <= 0 ? (
                          "当前无抽奖机会"
                        ) : (
                          <>
                            {" "}
                            当前有{" "}
                            <Text
                              className="text-30 "
                              style={{ color: "#fff" }}
                            >
                              {state.surplusDrawTimes}
                            </Text>{" "}
                            次机会
                          </>
                        )}
                      </View>
                    )}
                    <View
                      className="absolute top-0 right-0 bottom-0 left-0 z-999"
                      style={{
                        backgroundColor: "rgba(224,39,39,0.2)",
                        opacity: itm.action ? 1 : 0,
                        border: "1px solid #ce1f1f",
                      }}
                    ></View>
                  </View>
                );
              })}
            </View>
          )}

          {/* 记录&规则 */}
          <View className="w-full box-border  flex flex-row justify-between px-133 text-18 underline  text-white">
            <View
              className="px-60 py-30 bg-red"
              onClick={() => {
                app.to(
                  `/subPages/drawLottery/records/index?id=${
                    _activityLuckDrawId.current
                  }&shopName=${encodeURIComponent(userInfo?.belongShopName)}`,
                );
              }}
            >
              中奖记录
            </View>
            <View
              className="px-60 py-30  bg-red"
              onClick={() => {
                setState({ showRulePopup: true });
              }}
            >
              活动规则
            </View>
          </View>
        </View>

        {/* 活动未开始、已结束弹窗 */}
        {!!state.activityStatus && (
          <CPopup closePopup={() => setState({ activityStatus: "" })}>
            <View className="w-460 pt-120 pb-40 bg-white flex flex-col justify-center items-center relative">
              <View>
                {state.activityStatus === "notStart"
                  ? "活动尚未开始"
                  : "活动已经结束"}
              </View>
              <View
                onClick={() => {
                  app.to(pageSettingConfig.homePath);
                }}
                className="flex justify-center items-center px-60 py-10 mt-100 text-white bg-black"
              >
                好的
              </View>
            </View>
          </CPopup>
        )}

        {/* 谢谢参与、暂无机会弹窗 */}
        {!!state.showFailPopup && (
          <CPopup closePopup={() => setState({ showFailPopup: "" })}>
            <View className="w-660 bg-white relative">
              <View
                className="w-100 h-100 absolute top-0 right-0 "
                onClick={() => setState({ showFailPopup: "" })}
              ></View>
              <Image
                className="w-full h-full "
                mode="widthFix"
                src={
                  state.showFailPopup === "noTimes"
                    ? "https://cna-uat-nars-oss.oss-cn-shanghai.aliyuncs.com/nars/20240815/LiE9b4U9g2Tk9sUkJQFiuD.png"
                    : "https://cna-uat-nars-oss.oss-cn-shanghai.aliyuncs.com/nars/20240813/7e8Cs1nGbTK8zAMU1TuM1c.jpg"
                }
              />
            </View>
          </CPopup>
        )}

        {/* 活动规则弹窗 */}
        {state.showRulePopup && (
          <CPopup closePopup={() => setState({ showRulePopup: false })}>
            <View className="w-660 bg-white relative">
              <View
                className="w-100 h-100 absolute top-0 right-0 "
                onClick={() => setState({ showRulePopup: false })}
              ></View>
              <Image src={state.ruleImage} mode="widthFix" className="w-full" />
            </View>
          </CPopup>
        )}

        {/* 获得奖品弹窗 */}
        {state.showDrawPopup && (
          <CPopup closePopup={() => setState({ showDrawPopup: false })}>
            <View className="w-610 py-62 text-center relative bg-white">
              <View
                className="w-100 h-100 absolute top-0 right-0"
                onClick={() => setState({ showDrawPopup: false })}
              >
                <Image
                  className="w-22 h-22 absolute top-22 right-25"
                  mode="widthFix"
                  src="https://cna-prd-nars-oss.oss-cn-shanghai.aliyuncs.com/lottery/close.png"
                />
              </View>
              <View>
                <View className="text-36">恭喜您</View>
                <View className="text-24 mt-35">获得NARS随单礼一份</View>
                <View className="text-24 mt-20">
                  前往所属专柜消费任意金额可立即随单带走
                </View>
              </View>
              <View
                className="my-50 mx-auto w-500 h-157 flex justify-between items-center bg-no-repeat bg-center bg-cover"
                style={{
                  backgroundImage: `url('https://cna-prd-nars-oss.oss-cn-shanghai.aliyuncs.com/lottery/giftBg.png')`,
                }}
              >
                <View className="w-194 h-full flex justify-center items-center">
                  <Image
                    mode="aspectFit"
                    className="w-full h-100"
                    src={state.prize?.prizePicture}
                  />
                </View>
                <View className="w-270 pr-34 flex justify-start items-center">
                  <View>
                    <View className="text-20 text-right leading-28 line-clamp-3  overflow-hidden h-78 w-270 ">
                      {state.prize?.prizeName}
                    </View>
                    {!!Number(state.prize?.money) && (
                      <View className="text-20 text-right mt-4 w-270 ">
                        {`产品价值¥${state.prize?.money || 0}`}
                      </View>
                    )}
                  </View>
                </View>
              </View>
              {userInfo?.belongShopName && (
                <View className="w-441 h-60 border-3 border-solid mx-auto flex justify-center items-center mb-50">
                  <Image
                    className="w-17 h-26 mr-20"
                    mode="heightFix"
                    src="https://cna-prd-nars-oss.oss-cn-shanghai.aliyuncs.com/lottery/weizhi.png"
                  />
                  <View className="text-24 w-372 overflow-hidden  whitespace-nowrap text-ellipsis text-left">
                    领取柜台:{userInfo?.belongShopName}
                  </View>
                </View>
              )}

              <View
                onClick={() => {
                  app.to("/subPages/coupon/index");
                }}
                className=" w-210 h-70 mx-auto bg-black flex justify-center items-center text-24 text-white"
              >
                查看卡券
              </View>
            </View>
          </CPopup>
        )}
      </View>
    </>
  );
};

export default Index;
