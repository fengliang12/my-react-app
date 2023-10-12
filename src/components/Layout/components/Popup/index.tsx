import { View } from "@tarojs/components";
import { useMemo } from "react";
import { useMemoizedFn } from "ahooks";
import { omit } from "lodash-es";
import ImagePR from "../ImagePR";
import VideoPR from "../VideoPR";
import { getBaseStyle, getWxButtonByEvent } from "../../helper";
import ButtonAuth from "../ButtonAuth";
import useHanlder from "../../hooks/useHanlder";
import usePopup from "../../hooks/usePopup";
import { store } from "../../store/index";

const Popup = ({ pageId }) => {
  const { popup } = usePopup({ pageId });
  const { hanlderEvent } = useHanlder({
    event: popup?.event ? [popup.event] : popup?.event,
    exclusiveEvent: [],
    id: "popup"
  });
  const popupStyle = useMemo(() => {
    return getBaseStyle(popup?.style);
  }, [popup?.style]);

  const wxButton = useMemo(() => {
    return getWxButtonByEvent(popup?.event);
  }, [popup?.event]);

  const close = useMemoizedFn(e => {
    e.stopPropagation();
    if (popup?.maskClosable) {
      store.setPopup({
        key: pageId,
        value: null
      }, pageId);
    }
  });
  return (
    <>
      {popup && (
        <View
          style={{
            width: "100vw",
            height: "100vh",
            position: "fixed",
            left: 0,
            top: 0,
            zIndex: 9999,
            backgroundColor: popup.mask ? "rgba(0,0,0,.5)" : "transparent"
          }}
          catchMove
          onClick={e => close(e)}
        >
          <ButtonAuth
            type="popup"
            comInfo={{
              event: popup.event ? [popup.event] : popup.event,
              exclusiveEvent: [],
              id: "popup"
            }}
            injectStyle={omit(popupStyle, ["width", "height"])}
            componentType="popup"
          >
            {popup.type === "image" && (
              <ImagePR
                src={popup.src}
                style={
                  wxButton
                    ? { width: popupStyle.width, height: popupStyle.height }
                    : popupStyle
                }
                mode="widthFix"
                onClick={e => hanlderEvent(e)}
                showMenuByLongpress
              />
            )}
            {popup.type === "video" && (
              <VideoPR
                src={popup.src}
                style={
                  wxButton
                    ? { width: popupStyle.width, height: popupStyle.height }
                    : popupStyle
                }
                autoplay
                loop
                muted
                controls={false}
                onClick={e => hanlderEvent(e)}
              />
            )}
          </ButtonAuth>
        </View>
      )}
    </>
  );
};

export default Popup;
