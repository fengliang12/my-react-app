import Taro from '@tarojs/taro';
import { assign, cloneDeep, isBoolean, omit } from 'lodash-es';
import React, { CSSProperties, useContext, useMemo, useState } from 'react';

import { getDomId } from '../../../helper';
import useHanlder from '../../../hooks/useHanlder';
import useStore from '../../../hooks/useStore';
import useStyle from '../../../hooks/useStyle';
import { LayoutContext } from '../../../index';
import VideoPR from '../../VideoPR';
import { store } from '../../../store/index'
import usePage from '../../../hooks/usePage';
import useObserver from '../../../hooks/useObserver';

type ProVideoProps = {
  comInfo: Edit.IComponents;
  comIndex: number;
};

const ProVideo: React.FC<ProVideoProps> = ({ comInfo }) => {
  const { videoHeights, pageId } = useContext(LayoutContext);
  const { updateSrc, updateMuted } = useStore(comInfo);
  const { baseStyle } = useStyle(comInfo);
  const { isNowPage } = usePage()
  useObserver(comInfo)
  const [isFull, setIsFull] = useState(false);
  const src = useMemo(() => {
    return updateSrc || comInfo?.video?.src;
  }, [updateSrc, comInfo?.video?.src]);
  const muted = useMemo(() => {
    if (!isNowPage) return true;
    return isBoolean(updateMuted) ? updateMuted : comInfo?.video?.muted;
  }, [updateMuted, comInfo?.video?.muted]);
  const videoHeight = useMemo(() => {
    return videoHeights?.find(x => x.id === comInfo?.id)?.height;
  }, [videoHeights, comInfo?.id]);
  const controls = useMemo(() => {
    return isFull || comInfo?.video?.controls;
  }, [comInfo?.video?.controls, isFull]);
  const videoStyle = useMemo(() => {
    let result: CSSProperties = cloneDeep(baseStyle);
    if (videoHeight && !result.height) {
      result = assign(result, { height: videoHeight })
    }
    return result;
  }, [baseStyle, videoHeight]);
  const { hanlderEvent, autoHanlderEvent } = useHanlder(comInfo);
  return (
    <>
      <VideoPR
        id={getDomId(comInfo?.id)}
        style={videoStyle}
        objectFit="cover"
        {...omit({ ...(comInfo?.video ?? {}), ...(comInfo?.customData?.videoProps ?? {}) }, [
          'src',
          'muted',
          'controls',
          'onPlay',
          'onPause',
          'onEnded'
        ])}
        controls={controls}
        muted={muted}
        src={src!}
        onClick={hanlderEvent}
        onLongPress={hanlderEvent}
        onPlay={() => autoHanlderEvent(comInfo.video?.onPlay, comInfo.video?.loop, 'onPlay')}
        onPause={() =>
          autoHanlderEvent(
            comInfo.video?.onPause,
            comInfo.video?.loop,
            'onPause'
          )
        }
        onEnded={() =>
          autoHanlderEvent(
            comInfo.video?.onEnded,
            comInfo.video?.loop,
            'onEnded'
          )
        }
        onFullScreenChange={e => {
          setIsFull(e.detail.fullScreen);
          if (!e.detail.fullScreen) {
            store.setRef({ isFullScreen: false }, pageId, 'video')
            // 关闭全屏是否停止播放
            if (comInfo?.customData?.afterExitFullScreen === 'pause') {
              const ctx = Taro.createVideoContext(getDomId(comInfo?.id));
              ctx.pause();
            }
            // 关闭全屏是否停止播放
            if (comInfo?.customData?.afterExitFullScreen === 'stop') {
              const ctx = Taro.createVideoContext(getDomId(comInfo?.id));
              ctx.stop();
            }
          }
          if (e.detail.fullScreen) {
            store.setRef({ isFullScreen: true }, pageId, 'video')
            // 开启全屏是否自动播放
            if (comInfo?.customData?.isPlayVideoByRequestFullScreen) {
              const ctx = Taro.createVideoContext(getDomId(comInfo?.id));
              ctx.play();
            }
          }
        }}
      />
    </>
  );
};

export default ProVideo;
