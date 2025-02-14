import { MovableView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useUpdateEffect } from 'ahooks';
import { cloneDeep, pick } from 'lodash-es';
import React, { CSSProperties, useMemo, useState } from 'react';
import { getBaseStyle, getDomId } from '../../helper';

import useStore from '../../hooks/useStore';

type MovableProps = {
  comId?: string;
  movable?: any;
  comStyle?: CSSProperties;
  openMovableAreaHeight100VH?: boolean;
  children: any;
};

const Movable: React.FC<MovableProps> = ({
  movable = {},
  comId = '',
  comStyle = {},
  openMovableAreaHeight100VH,
  children
}) => {

  const { updateStyle } = useStore({ id: comId });
  const [height, setHeight] = useState('auto')
  const movableStyle: CSSProperties = useMemo(() => {
    let result: CSSProperties = {};
    if (movable) {
      const baseStyle = cloneDeep(getBaseStyle(comStyle));
      result = pick(baseStyle, [
        'width',
        'height',
        'position',
        'left',
        'top',
        'right',
        'bottom',
        'zIndex',
        'transition'
      ]);
      if (!result.width) {
        result.width = 'auto';
      }
      if (!result.height) {
        result.height = height ?? 'auto';
      }
      result.position = 'absolute';
    }
    return {
      ...result,
      pointerEvents: 'auto',
      ...(updateStyle ?? {})
    };
  }, [movable, comStyle, updateStyle, height]);

  useUpdateEffect(() => {
    Taro.nextTick(() => {
      const query = Taro.createSelectorQuery();
      query.select(`#${getDomId(comId)}`)
        .boundingClientRect()
        .exec((res) => {
          if (res?.[0]?.height) {
            setHeight(res[0].height)
          }
        });
    })
  }, [comStyle, updateStyle])

  return (
    <>
      {movable && (
        <MovableView
          y={openMovableAreaHeight100VH ? '0rpx' : '1000rpx'}
          style={movableStyle}
          {...movable}
        >
          {children}
        </MovableView>
      )
      }
      { !movable && children}
    </>
  );
};

export default Movable;
