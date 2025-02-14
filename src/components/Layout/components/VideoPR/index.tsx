import { Video } from '@tarojs/components';
import { startsWith, replace } from 'lodash-es';
import { useMemo } from 'react';

import { layout } from '../../config/index';

type VideoPRProps = {
  src: string;
  [prop: string]: any;
};

const VideoPR: React.FC<VideoPRProps> = ({ src, ...props }) => {
  const url: string = useMemo(() => {
    if (!src) {
      return src;
    }
    if (layout.config.mediaReplaceConfig && layout.config.mediaReplaceConfig.oldDomain && layout.config.mediaReplaceConfig.newDomain) {
      src = replace(src, layout.config.mediaReplaceConfig.oldDomain, layout.config.mediaReplaceConfig.newDomain)
    }
    if (startsWith(src, 'http')) {
      return src;
    }
    if (startsWith(src, '.')) {
      return src;
    }
    return layout.config.prefix + src;
  }, [src]);
  return (
    <>
      <Video src={url} {...props} autoPauseIfNavigate></Video>
    </>
  );
};

export default VideoPR;
