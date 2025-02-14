import { View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useMemoizedFn } from 'ahooks';
import { assign, cloneDeep, isNil, omit, set } from 'lodash-es';
import React, { CSSProperties, useContext, useMemo, useRef } from 'react';

import { getDomId, getHotStyle, safeFn } from '../../../helper';
import useCountDown from '../../../hooks/useCountDown';
import useFullScreen from '../../../hooks/useFullScreen';
import useHanlder from '../../../hooks/useHanlder';
import useImage from '../../../hooks/useImage';
import useStore from '../../../hooks/useStore';
import useStyle from '../../../hooks/useStyle';
import { LayoutContext, TemplateContext } from '../../../index';
import { store } from '../../../store';
import ButtonAuth from '../../ButtonAuth';
import ImagePR from '../../ImagePR';
import useDynamic from '../../../hooks/useDynamic';

type ProImageProps = {
  comInfo: Edit.IComponents;
  comIndex: number;
  parentIndex?: number;
};

const ProImage: React.FC<ProImageProps> = ({
  comInfo,
  comIndex,
  parentIndex
}) => {
  const { pageId } = useContext(LayoutContext);
  const { templateCode, templateName, templateIndex, templateCustomData } =
    useContext(TemplateContext);
  const { updateSrc } = useStore(comInfo);
  const { baseStyle, baseClassName } = useStyle(comInfo);
  const {
    swiperCurrentSrc,
    swiperNavImg,
    swiperNavImgs,
    slot,
    isIconExtend,
    isOpenEvent,
    swiperNavStyle
  } = useImage({ comInfo, comIndex, parentIndex });
  const { fullScreenStyle } = useFullScreen(comInfo);
  const iconExtendRef = useRef<boolean>(true);
  const { hanlderEvent } = useHanlder(comInfo);
  const { countDownValue, isShowCountDown } = useCountDown(comInfo);
  const { dynamicData } = useDynamic(comInfo)

  const src = useMemo(() => {
    const dv = dynamicData?.find(x => x.type === 'value' && !x?.styleKey)
    return (
      swiperCurrentSrc ?? swiperNavImg?.src ?? updateSrc ?? countDownValue ?? dv?.value ?? comInfo?.image?.src
    );
  }, [updateSrc, swiperNavImg, comInfo?.image?.src, countDownValue, swiperCurrentSrc, dynamicData]);

  const imageStyle = useMemo(() => {
    let result: CSSProperties = cloneDeep(baseStyle);
    if (dynamicData) {
      const dv = dynamicData?.find(x => x.type === 'value' && x?.styleKey)
      if (!isNil(dv?.value)) {
        if (dv?.styleKey === 'style') {
          result = assign(result, dv.value)
        } else {
          set(result, dv.styleKey, dv?.value)
        }
      }
    }
    if (fullScreenStyle) {
      assign(result, fullScreenStyle);
    }
    if (!isShowCountDown) {
      assign(result, { display: 'none' });
    }
    if (!((swiperNavImgs?.length > 0 && swiperNavImg) || swiperNavImgs.length === 0)) {
      assign(result, { opacity: '0', pointerEvent: 'none' });
    }
    if (!result.transform) {
      assign(result, { transform: "translate3d(0, 0, 0)" })
    }
    else if (result.transform?.indexOf('translate3d') === -1) {
      set(result, 'transform', `${result.transform} translate3d(0, 0, 0)`)
    }
    if (swiperNavStyle) {
      assign(result, swiperNavStyle);
    }
    return result ?? {};
  }, [
    comInfo,
    baseStyle,
    isShowCountDown,
    swiperNavImgs,
    swiperNavImg,
    fullScreenStyle,
    swiperNavStyle,
    dynamicData
  ]);

  const clickHandle = useMemoizedFn((e) => {
    if (isIconExtend) {
      iconExtendRef.current = !iconExtendRef.current;
      safeFn(() =>
        Taro.eventCenter.trigger(
          `layout_iconExtendChange_${pageId}`,
          iconExtendRef.current,
          {
            component: {
              code: templateCode,
              name: templateName,
              index: templateIndex,
              customData: templateCustomData
            }
          }
        )
      );
    }
    if (isOpenEvent) {
      hanlderEvent(e);
    }
  })

  const isRanderImg = useMemo(() => {
    const dc = dynamicData?.find(x => x.type === 'condition')
    if (dc && !dc.value) {
      return false
    }
    return true
  }, [dynamicData])

  return (
    <>
      {
        isRanderImg && <>
          {
            /** 轮播导航图片的特殊处理 */
            swiperNavImg &&
            swiperNavImgs?.map((swpItem: any, swpIndex: number) => (
              <View
                key={swpItem.src}
                style={{
                  width: `${100 / swiperNavImgs?.length}%`,
                  height: '100%',
                  display: 'inline-block',
                  position: 'relative',
                  zIndex: 2
                }}
                onClick={e => {
                  safeFn(() => {
                    Taro.eventCenter.trigger(
                      `layout_defaultEventCallBack_${pageId}`,
                      e
                    );
                    Taro.eventCenter.trigger(
                      `layout_trackingCallBack_${pageId}`,
                      {
                        component: {
                          code: templateCode,
                          name: templateName,
                          index: templateIndex
                        },
                        target: {
                          index: swpIndex,
                          type: 'swiperNav'
                        },
                        actions: [],
                        e
                      }
                    );
                  });
                  e.stopPropagation();
                  store.setCom(
                    {
                      key: comInfo?.swiperNav?.swiperId,
                      value: swpIndex,
                      type: 'current'
                    },
                    pageId
                  );
                }}
              />
            ))
          }
          {comInfo?.hot?.map((hotItem: any, hotIndex: number) => (
            <ButtonAuth
              key={hotItem.id}
              type="hot"
              hot={hotItem}
              hotIndex={hotIndex}
              injectStyle={getHotStyle(hotItem.value, { zIndex: 99 + hotIndex })}
            >
              {hotItem.imgUrl && (
                <ImagePR
                  style={{ width: '100%', height: '100%' }}
                  mode="aspectFit"
                  src={hotItem.imgUrl}
                />
              )}
            </ButtonAuth>
          ))}
          <ImagePR
            id={getDomId(comInfo?.id)}
            {...omit(comInfo.image, ['src'])}
            src={src as string}
            style={imageStyle}
            imgSlot={slot}
            className={baseClassName}
            onClick={clickHandle}
            onLongPress={hanlderEvent}
          />
        </>
      }

    </>
  );
};

export default ProImage;
