import { Swiper, SwiperItem, View } from '@tarojs/components';
import { assign, cloneDeep, get, omit } from 'lodash-es';
import React, { CSSProperties, useContext, useMemo } from 'react';

import { getDomId, getHotStyle } from '../../../helper';
import useFullScreen from '../../../hooks/useFullScreen';
import useHanlder from '../../../hooks/useHanlder';
import useInsertSlot from '../../../hooks/useInsertSlot';
import usePage from '../../../hooks/usePage';
import useStore from '../../../hooks/useStore';
import useStyle from '../../../hooks/useStyle';
import {
  SwiperTemplateContext,
  TemplateContext
} from '../../../index';
import ButtonAuth from '../../ButtonAuth';
import Compiler from '../../Compiler';
import ImagePR from '../../ImagePR';

type ProSwiperProps = {
  comInfo: Edit.IComponents & { path: string };
  comIndex: number;
};

const ProSwiper: React.FC<ProSwiperProps> = ({ comInfo, comIndex }) => {
  const { templateCustomData } = useContext(TemplateContext);
  const { defaultCurrent, slots } = useContext(SwiperTemplateContext);
  const { iSlot } = useInsertSlot({ path: comInfo.path ?? comInfo?.customData?.path });
  const { updateCurrent } = useStore(comInfo);
  const { baseStyle, baseClassName } = useStyle(comInfo);
  const { fullScreenStyle } = useFullScreen(comInfo);
  const { hanlderEvent, hanlderSwiperChange } = useHanlder(comInfo);
  const { isNowPage } = usePage();
  const swiperStyle = useMemo(() => {
    let result: CSSProperties = cloneDeep(baseStyle);
    if (fullScreenStyle) {
      assign(result, fullScreenStyle);
    }
    return result ?? {};
  }, [comInfo, baseStyle, fullScreenStyle]);
  const swiperCurrent = useMemo(() => {
    return updateCurrent ?? defaultCurrent;
  }, [updateCurrent, defaultCurrent]);

  return (
    <Swiper
      id={getDomId(comInfo?.id)}
      style={swiperStyle}
      className={baseClassName}
      {...omit(comInfo.swiperView, [
        'current',
        'indicatorDots',
        'previousMargin',
        'nextMargin'
      ])}
      previousMargin={`${get(comInfo?.swiperView, 'previousMargin')}rpx`}
      nextMargin={`${get(comInfo?.swiperView, 'nextMargin')}rpx`}
      current={swiperCurrent}
      indicatorDots={false}
      autoplay={comInfo?.swiperView?.autoplay && isNowPage}
      onClick={hanlderEvent}
      onLongPress={hanlderEvent}
      onChange={e =>
        hanlderSwiperChange(
          e,
          { id: comInfo.id, relation: comInfo.relation },
          swiperCurrent
        )
      }
    >
      {comInfo?.children?.map((x, index) => {
        const slot: any = slots?.find(y => y.index === index);
        return (
          <>
            {iSlot && iSlot?.index === -1 && (
              <SwiperItem>{iSlot.element}</SwiperItem>
            )}
            <SwiperItem key={x.id}>
              {slot && slot.rerender && (
                <>{slot.getElement(templateCustomData, swiperCurrent)}</>
              )}
              {slot && !slot.rerender && (
                <>
                  <View
                    style={{
                      position: 'absolute',
                      left: slot.left,
                      top: slot.top,
                      bottom: slot.bottom,
                      right: slot.right,
                      zIndex: 1000
                    }}
                  >
                    {slot.getElement(templateCustomData, updateCurrent)}
                  </View>
                </>
              )}
              {!slot?.rerender && (
                <>
                  {x.hot?.map((hotItem: any, hotIndex: number) => (
                    <ButtonAuth
                      key={hotItem.id}
                      type="hot"
                      hot={hotItem}
                      hotIndex={hotIndex}
                      injectStyle={getHotStyle(hotItem.value, {
                        zIndex: 99 + hotIndex
                      })}
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
                  <Compiler data={[x]} parentIndex={comIndex} />
                </>
              )}
            </SwiperItem>
            {iSlot && iSlot.index === index && (
              <SwiperItem>{iSlot.element}</SwiperItem>
            )}
          </>
        );
      })}
    </Swiper>
  );
};

export default ProSwiper;
