import "./index.scss";

import { Swiper, SwiperItem, Text, View } from "@tarojs/components";
import { useDidShow, useRouter } from "@tarojs/taro";
import { useBoolean, useRequest } from "ahooks";
import { current } from "immer";
import { useEffect } from "react";
import { useSelector } from "react-redux";

import CImage from "@/src/components/Common/CImage";
import CPopup from "@/src/components/Common/CPopup";
import Page from "@/src/components/Page";
import PrivacyAuth from "@/src/components/PrivacyAuth";
import useAddUserActions from "@/src/hooks/useAddUserActions";
import useLoaclBehavior from "@/src/hooks/useLoaclBehavior";
import handleRoute from "@/src/utils/handleRoute";
import setShow from "@/src/utils/setShow";
import to from "@/src/utils/to";
import toast from "@/src/utils/toast";

import ServiceBox from "./components/ServiceBox";
import useProject from "./hooks/useProject";

const Index = () => {
  const [visible, { setFalse, setTrue }] = useBoolean(false);
  const router = useRouter();
  const {
    project,
    projectList,
    selectIndex,
    setSelectIndex,
    num = 0,
    reason,
  } = useProject(0);
  const [ruleShow, { setTrue: setRuleTrue, setFalse: setRuleFalse }] =
    useBoolean(false);
  const userInfo = useSelector((state: Store.States) => state.user);
  const { addActions } = useAddUserActions();
  const { addBehavior } = useLoaclBehavior("RESERVATION");

  useDidShow(() => {
    addActions("VIEW_CONTENT");
  });

  useEffect(() => {
    if (project) {
      addBehavior(`VIEW_HOMEPAGE_${project.projectCode}`);
    }
  }, [addBehavior, project]);

  /**
   * 轮播变化
   * @param e
   */
  const handleChange = (e) => {
    console.log(e);
    let { current } = e.detail;
    setSelectIndex(current);
  };

  return (
    <Page
      navConfig={{
        title: "MY NARS",
        fill: false,
        backgroundColor: "rgba(0,0,0,1)",
        titleColor: "#FFFFFF",
      }}
    >
      <PrivacyAuth></PrivacyAuth>
      <View
        className="w-screen min-h-screen pt-236 pb-70 box-border"
        style="background:url(https://cna-prd-nars-oss.oss-cn-shanghai.aliyuncs.com/service/bg.jpg);background-size:100%"
      >
        <View
          className="w-680 h-100 rounded-50 ml-35 text-white flex justify-between items-center text-22 px-55 box-border"
          style="background: rgba(255,255,255,0.1);"
        >
          {num > 0 ? (
            <View>
              您有 <Text className="ENGLISH_F_Z text-26">{num}</Text>{" "}
              次服务预约的机会
            </View>
          ) : (
            <View>您暂无预约的机会</View>
          )}
          <View
            className="underline text-26"
            onClick={() => {
              addBehavior("CLICK_RULE");
              setRuleTrue();
            }}
          >
            预约规则
          </View>
        </View>
        <View>
          <Swiper
            className="w-full h-922 mt-47"
            onChange={handleChange}
            current={selectIndex}
            autoplay
            circular
            interval={8000}
            // nextMargin="40"
          >
            {projectList?.map((item) => {
              return (
                <SwiperItem
                  className="w-full h-full vhCenter"
                  key={item.projectCode}
                >
                  <CImage
                    className="w-610 h-922 mt-47"
                    src={item?.imageKVList?.[0] || ""}
                  ></CImage>
                </SwiperItem>
              );
            })}
          </Swiper>
          <View
            className="flex justify-center m-20"
            style="--indicatorActiveColor:#fff;--indicatorColor:#999"
          >
            {new Array(projectList?.length).fill(true).map((elem, index) => {
              return (
                <View
                  key={elem.code}
                  className={`w-70 h-10 rounded-p50 ml-10 transition-all delay-500 doitItem  ${
                    selectIndex === index && "setDoitItem"
                  }`}
                ></View>
              );
            })}
          </View>
        </View>

        <View className="w-610 mt-64 ml-70 flex justify-start text-24">
          <View
            className="w-280 h-80 vhCenter bg-white mr-49"
            onClick={() => {
              project && addBehavior(`CLICK_DETAIL_${project.projectCode}`);
              let path = handleRoute("/subPages/service/introduce/index", {
                ...router.params,
                detailPageId: reason.detailPageId,
                index: selectIndex,
              });
              to(path);
            }}
          >
            查看详情
          </View>
          <View
            className="w-280 h-80 vhCenter bg-white"
            onClick={() => {
              addActions("RESERVATION");
              project &&
                addBehavior(`CLICK_RESERVATION_${project.projectCode}`);
              if (!userInfo?.isMember) {
                return to(`/pages/registerSecond/index?index=${selectIndex}`);
              }
              if (num <= 0) {
                return toast("您暂无预约的机会");
              }
              setTrue();
            }}
          >
            立即预约
          </View>
        </View>

        <View
          className="mt-80 text-center text-white text-26 underline"
          onClick={() => {
            if (!userInfo?.isMember) {
              return to("/pages/registerSecond/index");
            }
            to("/subPages/service/list/index");
          }}
        >
          <Text>我的预约</Text>
        </View>
      </View>

      {/* 服务预约弹窗 */}
      {visible && (
        <ServiceBox
          project={project}
          num={num}
          close={setFalse}
          modifyTime={reason?.modify}
        ></ServiceBox>
      )}

      {/* 规则弹窗 */}
      <View style={setShow(ruleShow)}>
        <CPopup maskClose closePopup={() => setRuleFalse()}>
          <View className="w-640 relative flex flex-col justify-center items-center">
            <CImage
              className="w-full"
              mode="widthFix"
              src={
                project?.detailList?.[0] ||
                "https://cna-prd-nars-oss.oss-cn-shanghai.aliyuncs.com/apponitment/rule3.png"
              }
            ></CImage>
            <View
              className="w-100 h-100 absolute top-0 right-0"
              onClick={() => setRuleFalse()}
            ></View>
          </View>
        </CPopup>
      </View>
    </Page>
  );
};
export default Index;
