import { Image, Video } from '@tarojs/components';
import React, { useMemo } from 'react';

import { getUrl } from '../../helper';

type PreMediaType = {
  medias: {
    type: 'image' | 'video';
    url: string;
  }[];
};

const PreMedia: React.FC<PreMediaType> = ({ medias = [] }) => {
  const list = useMemo(() => {
    return medias.map((x: any) => {
      x.url = getUrl(x.url);
      return x;
    });
  }, [medias]);
  return (
    <>
      {list.map((item: any) => {
        if (item.type === 'image') {
          return (
            <Image
              src={item.url}
              style={{ position: 'fixed', left: -99999999 }}
            ></Image>
          );
        }
        if (item.type === 'video') {
          return (
            <Video
              src={item.url}
              style={{ position: 'fixed', left: -99999999 }}
            ></Video>
          );
        }
        return <></>;
      })}
    </>
  );
};

export default PreMedia;
