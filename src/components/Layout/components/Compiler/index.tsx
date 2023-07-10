
import ButtonAuth from '../ButtonAuth'
import ProText from '../baseComponent/ProText'
import ProView from '../baseComponent/ProView'
import ProSwiper from '../baseComponent/ProSwiper'
import ProImage from '../baseComponent/ProImage'
import ProVideo from '../baseComponent/ProVideo'
import ProScrollView from '../baseComponent/ProScrollView'
import ProRichText from '../baseComponent/ProRichText'
import React from 'react'
import useInsertSlot from '../../hooks/useInsertSlot'

type CompilerProps = {
  data: any
  parentIndex?: number
  parentPath?: string
}

const Compiler: React.FC<CompilerProps> = props => {
  const { data, parentIndex, parentPath } = props
  const { iSlot } = useInsertSlot({ path: parentPath })
  return (
    <>
      {data?.map((item, comIndex) => {
        return (
          <>
            {iSlot && iSlot?.index === -1 && iSlot.element}
            <ButtonAuth
              comInfo={item}
              comIndex={comIndex}
            >
              {item.type === 'view' && <ProView comInfo={item} comIndex={comIndex} />}
              {item.type === 'swiperView' && <ProSwiper comInfo={item} comIndex={comIndex} />}
              {item.type === 'scrollView' && <ProScrollView comInfo={item} comIndex={comIndex} />}
              {item.type === 'image' && <ProImage comInfo={item} comIndex={comIndex} parentIndex={parentIndex} />}
              {item.type === 'video' && <ProVideo comInfo={item} comIndex={comIndex} />}
              {item.type === 'text' && <ProText comInfo={item} comIndex={comIndex} />}
              {item.type === 'richText' && <ProRichText comInfo={item} comIndex={comIndex} />}
            </ButtonAuth>
            { iSlot && iSlot.index === comIndex && iSlot.element}
          </>
        )
      })}
    </>
  )
}

export default React.memo(Compiler)
