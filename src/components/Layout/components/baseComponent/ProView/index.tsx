import { View } from '@tarojs/components';
import { useMemoizedFn } from 'ahooks';
import { isNil } from 'lodash-es';
import React, { useMemo, useRef } from 'react';

import { getDomId, getHotStyle } from '../../../helper';
import useDynamic from '../../../hooks/useDynamic';
import useHanlder from '../../../hooks/useHanlder';
import useView from '../../../hooks/useView';
import ButtonAuth from '../../ButtonAuth';
import Compiler from '../../Compiler';
import ImagePR from '../../ImagePR';

type ProViewProps = {
  comInfo: Edit.IComponents & { movable: Edit.IMovable } & { path: string };
  comIndex: number;
  dynamicInfo?: any
};

const ProView: React.FC<ProViewProps> = ({ comInfo, comIndex, dynamicInfo }) => {
  const { hanlderEvent, touchHanlderEvent } = useHanlder(comInfo, dynamicInfo);
  const { dynamicData } = useDynamic(comInfo, dynamicInfo)
  const { viewStyle, viewClassName, updateCatchMove } = useView({ comInfo, dynamicData });
  const moveRef = useRef<any>()
  const listRender = useMemo(() => {
    if (dynamicData) {
      const cData = dynamicData?.find(x => x.type === 'condition')
      if (cData && !cData.value) {
        return null
      }
      const lData = dynamicData?.find(x => x.type === 'list')
      if (lData?.value?.length > 0) {
        return lData
      }
    }
    return {
      value: [0]
    }
  }, [dynamicData])
  const viewTouchEnd = useMemoizedFn((e) => {
    const moveX =
      moveRef.current.clientX - e.changedTouches[0].clientX;
    const moveY =
      moveRef.current.clientY - e.changedTouches[0].clientY;
    if (Math.abs(moveY) > Math.abs(moveX)) {
      if (moveY > 0) {
        touchHanlderEvent('top')
      } else if (moveY < 0) {
        touchHanlderEvent('bottom')
      }
    } else {
      if (moveX > 0) {
        touchHanlderEvent('left')
      } else if (moveX < 0) {
        touchHanlderEvent('right')
      }
    }
  })
  const viewProps = useMemo(() => {
    let result = Object.assign({}, comInfo?.view || {}, comInfo?.customData?.viewProps ?? {})
    if (!isNil(updateCatchMove)) {
      result.catchMove = updateCatchMove
    }
    return result
  }, [comInfo, updateCatchMove])
  return (
    <>
      {
        listRender?.value?.map((_, index) => <View
          key={comInfo?.id}
          id={getDomId(comInfo?.id)}
          className={viewClassName}
          style={viewStyle}
          {...viewProps}
          onClick={(e) => hanlderEvent(e, listRender?.key ? {
            key: listRender?.key + '.dynamicIndex',
            value: listRender?.key + `.${index}`
          } : null)}
          onLongPress={(e) => hanlderEvent(e, index)}
          onTouchStart={(e) => moveRef.current = e.changedTouches[0]}
          onTouchEnd={viewTouchEnd}
        >
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
          {comInfo?.children?.length > 0 && (
            <Compiler
              data={comInfo?.children}
              parentPath={comInfo.path ?? comInfo?.customData?.path}
              parentIndex={comIndex}
              dynamicInfo={listRender?.key ? {
                key: listRender?.key + '.dynamicIndex',
                value: listRender?.key + `.${index}`
              } : null}
            />
          )}
        </View>)
      }
    </>
  );
};

export default React.memo(ProView);
