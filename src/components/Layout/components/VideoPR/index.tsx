import { Video } from '@tarojs/components'
import { startsWith } from 'lodash-es'
import { useMemo } from 'react'
import { layout } from '../../config/index'

const VideoPR = ({ src, ...props }) => {
  const url: string = useMemo(() => {
    if (!src) {
      return src
    }
    if (startsWith(src, 'http')) {
      return src
    }
    if (startsWith(src, '.')) {
      return src
    }
    return layout.config.prefix + src
  }, [src])
  return (
    <>
      <Video src={url} {...props}></Video>
    </>
  )
}

export default VideoPR
