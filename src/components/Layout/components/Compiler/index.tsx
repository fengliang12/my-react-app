import { CustomWrapper } from '@tarojs/components';
import { useMemoizedFn } from 'ahooks';
import { isNil } from 'lodash-es';
import React from 'react';

import { layout } from '../../config/index'
import useInsertSlot from '../../hooks/useInsertSlot';
import ProImage from '../baseComponent/ProImage';
import ProInput from '../baseComponent/ProInput';
import ProPicker from '../baseComponent/ProPicker';
import ProRichText from '../baseComponent/ProRichText';
import ProScrollView from '../baseComponent/ProScrollView';
import ProSwiper from '../baseComponent/ProSwiper';
import ProText from '../baseComponent/ProText';
import ProVideo from '../baseComponent/ProVideo';
import ProView from '../baseComponent/ProView';
import ButtonAuth from '../ButtonAuth';

type CompilerProps = {
  data: any;
  parentIndex?: number;
  parentPath?: string;
  dynamicInfo?: any
};

const Compiler: React.FC<CompilerProps> = props => {
  const { data, parentIndex, parentPath, dynamicInfo } = props;
  const { iSlot } = useInsertSlot({ path: parentPath });
  const computedCustomWrapper = useMemoizedFn((item, comIndex) => {
    let reactDom = <ButtonAuth comInfo={item} comIndex={comIndex}>
      {item.type === 'view' && (<ProView comInfo={item} comIndex={comIndex} dynamicInfo={dynamicInfo} />)}
      {item.type === 'swiperView' && (<ProSwiper comInfo={item} comIndex={comIndex} />)}
      {item.type === 'scrollView' && (<ProScrollView comInfo={item} comIndex={comIndex} />)}
      {item.type === 'image' && (<ProImage comInfo={item} comIndex={comIndex} parentIndex={parentIndex} />)}
      {item.type === 'video' && (<ProVideo comInfo={item} comIndex={comIndex} />)}
      {item.type === 'text' && (<ProText comInfo={item} comIndex={comIndex} dynamicInfo={dynamicInfo} />)}
      {item.type === 'richText' && (<ProRichText comInfo={item} comIndex={comIndex} />)}
      {item.type === 'input' && (<ProInput comInfo={item} comIndex={comIndex} />)}
      {item.type === 'picker' && (<ProPicker comInfo={item} comIndex={comIndex} />)}
    </ButtonAuth>
    if (isNil(item.customData?.customWrapper) || (!isNil(item.customData?.customWrapper) && item.customData?.customWrapper)) {
      if ((layout.config.customWrapperLevel && item.level === layout.config.customWrapperLevel) || item.customData?.customWrapper) {
        reactDom = <CustomWrapper>{reactDom}</CustomWrapper>
      }
    }

    return reactDom
  })
  return (
    <>
      {iSlot && iSlot?.index === -1 && iSlot.element}
      {data?.map((item, comIndex) => {
        return (
          <>
            {
              computedCustomWrapper(item, comIndex)
            }
            {iSlot && iSlot.index === comIndex && iSlot.element}
          </>
        );
      })}
    </>
  );
};

export default React.memo(Compiler);
