import { Image, View } from '@tarojs/components';
import { replace, startsWith } from 'lodash-es';
import React, { CSSProperties, useMemo } from 'react';

import { layout } from '../../config/index';

type ImagePRProps = {
  src: string;
  style?: CSSProperties;
  imgSlot?: any;
  noSuffix?: boolean
  [x: string]: any;
};

const ImagePR: React.FC<ImagePRProps> = ({ src, imgSlot, noSuffix, ...props }) => {
  const url: string = useMemo(() => {
    if (!src) {
      return src;
    }
    if (layout.config.mediaReplaceConfig && layout.config.mediaReplaceConfig.oldDomain && layout.config.mediaReplaceConfig.newDomain) {
      src = replace(src, layout.config.mediaReplaceConfig.oldDomain, layout.config.mediaReplaceConfig.newDomain)
    }
    if (startsWith(src, 'http')) {
      return src + (noSuffix ? '' : (layout.config.suffix ?? ''));
    }
    if (startsWith(src, 'data:image')) {
      return src;
    }
    if (startsWith(src, '.')) {
      return src;
    }
    return layout.config.prefix + src + (noSuffix ? '' : (layout.config.suffix ?? ''));
  }, [src]);
  return (
    <>
      {imgSlot && (
        <View
          style={{
            position: 'relative',
            opacity: imgSlot.hide ? '0' : '1',
            display: 'inline-flex'
          }}
        >
          <View
            style={{
              zIndex: 2,
              position: 'absolute',
              left: imgSlot.left ?? 0,
              top: imgSlot.top ?? 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none'
            }}
          >
            {imgSlot.element}
          </View>
          <Image src={url} {...props}></Image>
        </View>
      )}
      {!imgSlot && <Image src={url} {...props}></Image>}
    </>
  );
};

export default ImagePR;
