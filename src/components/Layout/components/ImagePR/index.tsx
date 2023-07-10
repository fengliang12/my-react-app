import { Image, View } from '@tarojs/components'
import { startsWith } from 'lodash-es'
import { CSSProperties, useMemo } from 'react'
import { layout } from '../../config/index'

type ImagePRProps = {
  src: string
  style?: CSSProperties
  imgSlot?: any
  [x: string]: any
}

const ImagePR: React.FC<ImagePRProps> = ({ src, imgSlot, ...props }) => {
  const url: string = useMemo(() => {
    if (!src) {
      return src
    }
    if (startsWith(src, 'http')) {
      return src
    }
    if (startsWith(src, 'data:image')) {
      return src
    }
    if (startsWith(src, '.')) {
      return src
    }
    return layout.config.prefix + src
  }, [src])
  return (
    <>
      {
        imgSlot && <View style={{ position: 'relative', opacity: imgSlot.hide ? '0' : '1', display: 'inline-flex' }}>
          {
            <View style={{ zIndex: 2, position: 'absolute', left: imgSlot.left ?? 0, top: imgSlot.top ?? 0, width: '100%', height: '100%', pointerEvents: 'none' }}>{imgSlot.element}</View>
          }
          <Image src={url} {...props}></Image>
        </View>
      }
      {
        !imgSlot && <Image src={url} {...props}></Image>
      }
    </>
  )
}

export default ImagePR
