import { MovableView } from '@tarojs/components'
import { cloneDeep, pick } from 'lodash-es';
import { CSSProperties, useMemo } from 'react'
import useStore from '../../hooks/useStore';


type MovableProps = {
  comId?: string
  movable?: Edit.IMovable;
  comStyle?: CSSProperties;
  openMovableAreaHeight100VH?: boolean
  children: any
};

const Movable: React.FC<MovableProps> = ({ movable = null, comId = "", comStyle = {},openMovableAreaHeight100VH, children }) => {
  const { updateStyle } = useStore({ id: comId })
  const movableStyle: CSSProperties = useMemo(() => {
    let result: CSSProperties = {}
    if (movable) {
      const baseStyle = cloneDeep(comStyle)
      result = pick(baseStyle, [
        'width',
        'height',
        'position',
        'left',
        'top',
        'right',
        'bottom',
        'zIndex',
        'transition',
      ])
      if (!result.width) {
        result.width = 'auto'
      }
      if (!result.height) {
        result.height = 'auto'
      }
      result.position = 'absolute'
    }
    return {
      ...result,
      pointerEvents: 'auto'
    }
  }, [movable, comStyle])
  return (
    <>
      {movable && <MovableView y={openMovableAreaHeight100VH ? '0rpx' : '1000rpx'} style={{ ...movableStyle, ...(updateStyle ?? {}) }} {...movable}>
        {children}
      </MovableView>}
      {!movable && children}
    </>
  )
}

export default Movable
