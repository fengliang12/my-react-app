import { View } from '@tarojs/components';
import { useMemoizedFn } from 'ahooks';
import { omit } from 'lodash-es';
import { useMemo } from 'react';

import { getBaseStyle, getWxButtonByEvent } from '../../helper';
import useHanlder from '../../hooks/useHanlder';
import usePopup from '../../hooks/usePopup';
import { store } from '../../store/index';
import ButtonAuth from '../ButtonAuth';
import ImagePR from '../ImagePR';
import VideoPR from '../VideoPR';

type PopupProps = {
  pageId: string;
  popupCloseInject?: any;
};

const Popup: React.FC<PopupProps> = ({ pageId, popupCloseInject }) => {
  const { popup } = usePopup({ pageId });
  const { hanlderEvent } = useHanlder({
    event: popup?.event ? [popup.event] : popup?.event,
    exclusiveEvent: [],
    id: 'popup'
  });
  const popupStyle = useMemo(() => {
    return getBaseStyle(popup?.style);
  }, [popup?.style]);

  const wxButton = useMemo(() => {
    return getWxButtonByEvent(popup?.event);
  }, [popup?.event]);

  const close = useMemoizedFn(e => {
    e.stopPropagation();
    store.setPopup({
      key: pageId,
      value: null
    });
  });
  return (
    <>
      {popup && (
        <View
          style={{
            width: '750rpx',
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            zIndex: 99999999999999,
            backgroundColor: popup.mask ? 'rgba(0,0,0,.5)' : 'transparent'
          }}
          catchMove
          onClick={e => {
            if (popup?.maskClosable) {
              close(e);
            }
          }}
        >
          <ButtonAuth
            type="popup"
            comInfo={{
              event: popup.event ? [popup.event] : popup.event,
              exclusiveEvent: [],
              id: 'popup'
            }}
            injectStyle={omit(popupStyle, ['width', 'height'])}
            componentType="popup"
          >
            {popup.type === 'image' && (
              <ImagePR
                src={popup.src}
                style={
                  wxButton
                    ? {
                      width: popupStyle.width,
                      height: popupStyle.height ?? 'auto'
                    }
                    : popupStyle
                }
                mode="widthFix"
                onClick={e => hanlderEvent(e)}
                showMenuByLongpress
              />
            )}
            {popup.type === 'video' && (
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
          {popupCloseInject?.map((popupClose, pIndex) => (
            <View
              style={{
                position: 'absolute',
                left: popupClose.left,
                top: popupClose.top,
                bottom: popupClose.bottom,
                right: popupClose.right,
                width: popupClose.width,
                height: popupClose.height,
                zIndex: 100 + pIndex
              }}
              onClick={e => {
                close(e);
                popupClose.onClose?.();
              }}
            ></View>
          ))}
        </View>
      )}
    </>
  );
};

export default Popup;
