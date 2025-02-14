import './index.less';

import { Button } from '@tarojs/components';
import { useMemoizedFn } from 'ahooks';
import { assign, endsWith, omit, pick } from 'lodash-es';
import React, { CSSProperties, useContext, useMemo, useRef } from 'react';

import { addButtonImportant, getBaseStyle, getWxButtonByEvent, safeFn } from '../../helper';
import useHanlder from '../../hooks/useHanlder';
import { LayoutContext } from '../../index';
import useStore from '../../hooks/useStore';
import useSwiperCurrent from '../../hooks/useSwiperCurrent';
import Taro from '@tarojs/taro';

type ButtonAuthProps = {
  type?: 'hot' | 'component' | 'popup';
  comInfo?: Partial<Edit.IComponents>;
  comIndex?: number;
  injectStyle?: CSSProperties;
  hot?: Edit.IHot;
  hotIndex?: number;
  componentType?: string;
  popup?: any;
  children: any;
};

type WxButtonType = {
  openType?: string;
  show?: boolean;
  title?: string;
  path?: string;
  imageUrl?: string;
} | null;

const ButtonAuth: React.FC<ButtonAuthProps> = ({
  type = 'component',
  comInfo,
  injectStyle,
  hot,
  componentType,
  popup,
  children
}) => {
  const { wxButtons, isCustomShare, pageId } = useContext(LayoutContext);
  const { hanlderEvent } = useHanlder({ ...(comInfo || {}), ...(hot || {}) });
  const { updateStyle } = useStore(comInfo ?? {})
  const { swiperCurrentStyle } = useSwiperCurrent(comInfo ?? {})
  const trackedRef = useRef<any>('')
  const swiperCurrentStyleMemo = useMemo(() => {
    trackedRef.current = 'swiperCurrentStyle'
    return swiperCurrentStyle
  }, [swiperCurrentStyle])
  const updateStyleMemo = useMemo(() => {
    trackedRef.current = 'updateStyle'
    return updateStyle
  }, [updateStyle])
  const wxBtn: WxButtonType = useMemo(() => {
    let result: WxButtonType = null;
    if (type === 'component') {
      result = wxButtons?.find(x => x.id === comInfo?.id) || null;
    }
    if (type === 'hot') {
      return getWxButtonByEvent(hot?.event?.find(x => x.type === 'tap')) || {};
    }
    if (type === 'popup') {
      return getWxButtonByEvent(popup?.event?.find(x => x.type === 'tap'));
    }
    if (result) {
      result.openType =
        isCustomShare && result?.openType === 'share' ? '' : result?.openType;
    }
    return result;
  }, [wxButtons, type, comInfo, hot, popup]);
  const buttonStyle: CSSProperties = useMemo(() => {
    let result: any = getBaseStyle(comInfo?.style);
    if (wxBtn) {
      if (type === 'component') {
        result = pick(result, [
          'position',
          'left',
          'top',
          'right',
          'bottom',
          'zIndex',
          'order',
          'flexGrow',
          'flexShrink',
          'alignSelf',
          'width',
          'height',
          'display',
          'transform',
          'opacity',
          'pointerEvents',
          'flex',
          'marginLeft',
          'marginRight',
          'marginTop',
          'marginBottom'
        ]);
        result = addButtonImportant(result);
      }
      if (type === 'hot') {
        result = injectStyle || {};
      }
    }
    if (trackedRef.current === 'swiperCurrentStyle') {
      result = assign(
        result,
        updateStyleMemo,
        swiperCurrentStyleMemo
      )
    }
    if (trackedRef.current === 'updateStyle') {
      result = assign(
        result,
        swiperCurrentStyleMemo,
        updateStyleMemo,
      )
    }
    return result;
  }, [wxBtn, type, injectStyle, updateStyleMemo, swiperCurrentStyleMemo]);

  const buttonHanlder = useMemoizedFn(e => {
    if (componentType === 'popup') {
      e.stopPropagation();
    }
    if (
      ['subscribe', 'getUserProfile', 'qyContact', 'copy', 'makePhoneCall', undefined].includes(
        wxBtn?.openType
      )
    ) {
      hanlderEvent(e);
    }
    if (
      wxBtn?.openType === 'contact' &&
      comInfo?.customData?.setTimeoutEvent.time
    ) {
      hanlderEvent(e);
    }
  });
  return (
    <>
      {wxBtn && (
        <Button
          openType={wxBtn?.openType as any}
          showMessageCard={wxBtn?.show}
          sendMessageTitle={wxBtn?.title}
          sendMessagePath={wxBtn?.path}
          sendMessageImg={wxBtn?.imageUrl}
          className="button-no"
          onClick={buttonHanlder}
          onGetPhoneNumber={e => hanlderEvent({ ...e, type: 'tap' })}
          onOpenSetting={e => hanlderEvent({ ...e, type: 'tap' })}
          onContact={e => {
            if (
              !(
                wxBtn?.openType === 'contact' &&
                comInfo?.customData?.setTimeoutEvent.time
              )
            ) {
              hanlderEvent({ ...e, type: 'tap' });
            }
          }}
          onChooseAvatar={e => safeFn(() => Taro.eventCenter.trigger(`layout_onChooseAvatar_${pageId}`, e))}
          style={buttonStyle}
          data-title={wxBtn?.title}
          data-path={wxBtn?.path}
          data-img={wxBtn?.imageUrl}
        >
          {children}
        </Button>
      )}
      {!wxBtn && children}
    </>
  );
};

export default ButtonAuth;
