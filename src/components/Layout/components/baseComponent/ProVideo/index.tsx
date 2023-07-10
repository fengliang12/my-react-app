import { CSSProperties, useMemo, useContext, useState } from "react"
import { assign, isBoolean, omit, cloneDeep } from 'lodash-es'
import { getDomId } from "../../../helper"
import VideoPR from '../../VideoPR'
import useHanlder from "../../../hooks/useHanlder"
import { LayoutContext } from '../../../index'
import Taro from "@tarojs/taro"
import useStore from "../../../hooks/useStore"
import useStyle from "../../../hooks/useStyle"

type ProVideoProps = {
  comInfo: Edit.IComponents
  comIndex: number
}


const ProVideo: React.FC<ProVideoProps> = ({ comInfo }) => {
  const { videoHeights } = useContext(LayoutContext)
  const { updateSrc, updateMuted } = useStore(comInfo)
  const { baseStyle } = useStyle(comInfo)
  const [isFull, setIsFull] = useState(false)
  const src = useMemo(() => {
    return updateSrc || comInfo?.video?.src
  }, [updateSrc, comInfo?.video?.src])
  const muted = useMemo(() => {
    return isBoolean(updateMuted)
      ? updateMuted
      : comInfo?.video?.muted
  }, [updateMuted, comInfo?.video?.muted])
  const videoHeight = useMemo(() => {
    return videoHeights?.find(x => x.id === comInfo?.id)?.height
  }, [videoHeights, comInfo?.id])
  const controls = useMemo(() => {
    return isFull || comInfo?.video?.controls
  }, [comInfo?.video?.controls, isFull])
  const videoStyle = useMemo(() => {
    let result: CSSProperties = cloneDeep(baseStyle)
    return assign({ height: videoHeight }, result)
  }, [baseStyle, videoHeight])
  const { hanlderEvent, autoHanlderEvent } = useHanlder(comInfo)
  return <>
    <VideoPR
      id={getDomId(comInfo?.id)}
      style={videoStyle}
      objectFit="cover"
      {...omit(comInfo?.video, ['src', 'muted', 'controls', 'onPlay', 'onPause', 'onEnded'])}
      controls={controls}
      muted={muted}
      src={src}
      onClick={e => hanlderEvent(e)}
      onLongPress={e => hanlderEvent(e)}
      onPlay={() => autoHanlderEvent(comInfo.video?.onPlay, comInfo.video?.loop, 'onPlay')}
      onPause={() => autoHanlderEvent(comInfo.video?.onPause, comInfo.video?.loop, 'onPause')}
      onEnded={() => autoHanlderEvent(comInfo.video?.onEnded, comInfo.video?.loop, 'onEnded')}
      onFullScreenChange={(e) => {
        setIsFull(e.detail.fullScreen)
        if (!e.detail.fullScreen) {
          // 关闭全屏是否停止播放
          if (comInfo?.customData?.afterExitFullScreen === 'pause') {
            const ctx = Taro.createVideoContext(getDomId(comInfo?.id))
            ctx.pause()
          }
          // 关闭全屏是否停止播放
          if (comInfo?.customData?.afterExitFullScreen === 'stop') {
            const ctx = Taro.createVideoContext(getDomId(comInfo?.id))
            ctx.stop()
          }
        }
        if (e.detail.fullScreen) {
          // 开启全屏是否自动播放
          if (comInfo?.customData?.isPlayVideoByRequestFullScreen) {
            const ctx = Taro.createVideoContext(getDomId(comInfo?.id))
            ctx.play()
          }
        }
      }}
    />
  </>
}

export default ProVideo