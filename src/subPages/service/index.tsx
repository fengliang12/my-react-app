import { Text, View } from "@tarojs/components";
import { useDidShow } from "@tarojs/taro";
import { useBoolean, useRequest } from "ahooks";
import { useSelector } from "react-redux";

import CImage from "@/src/components/Common/CImage";
import CPopup from "@/src/components/Common/CPopup";
import Page from "@/src/components/Page";
import PrivacyAuth from "@/src/components/PrivacyAuth";
import useAddUserActions from "@/src/hooks/useAddUserActions";
import setShow from "@/src/utils/setShow";
import to from "@/src/utils/to";
import toast from "@/src/utils/toast";

import ServiceBox from "./components/ServiceBox";
import useProject from "./hooks/useProject";

const Index = () => {
  const [visible, { setFalse, setTrue }] = useBoolean(false);
  const { project, num = 0, reason } = useProject();
  const [ruleShow, { setTrue: setRuleTrue, setFalse: setRuleFalse }] =
    useBoolean(false);
  const userInfo = useSelector((state: Store.States) => state.user);
  const { addActions } = useAddUserActions();

  useDidShow(() => {
    addActions("VIEW_CONTENT");
  });

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
          <View className="underline text-26" onClick={setRuleTrue}>
            预约规则
          </View>
        </View>
        <CImage
          className="w-610 h-922 mt-47 ml-70"
          src={project?.imageKVList?.[0] || ""}
        ></CImage>
        <View className="w-610 mt-64 ml-70 flex justify-start text-24">
          <View
            className="w-280 h-80 vhCenter bg-white mr-49"
            onClick={() => to("/subPages/service/introduce/index")}
          >
            查看详情
          </View>
          <View
            className="w-280 h-80 vhCenter bg-white"
            onClick={() => {
              addActions("RESERVATION");

              if (!userInfo?.isMember) {
                return to("/pages/registerSecond/index");
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
