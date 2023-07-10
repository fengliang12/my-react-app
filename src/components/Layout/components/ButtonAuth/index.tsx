import { CSSProperties, useMemo, useContext } from 'react'
import { Button } from '@tarojs/components'
import { addButtonImportant, getWxButtonByEvent, log } from '../../helper'
import { LayoutContext } from '../../index'
import useHanlder from '../../hooks/useHanlder'
import { endsWith, omit, pick } from 'lodash-es'
import './index.less'

type ButtonAuthProps = {
  type?: 'hot' | 'component' | 'popup'
  comInfo?: Partial<Edit.IComponents>
  comIndex?: number
  injectStyle?: CSSProperties
  hot?: Edit.IHot
  hotIndex?: number
  componentType?: string
  popup?: any
  children: any
}

type WxButtonType = {
  openType?: string;
  show?: boolean
  title?: string
  path?: string
  imageUrl?: string
} | null

const ButtonAuth: React.FC<ButtonAuthProps> = ({
  type = 'component',
  comInfo,
  injectStyle,
  hot,
  hotIndex,
  componentType,
  popup,
  children
}) => {
  const { wxButtons, isCustomShare } = useContext(LayoutContext)
  const { hanlderEvent } = useHanlder({ ...(comInfo || {}), ...(hot || {}) })

  const wxBtn: WxButtonType = useMemo(() => {
    let result: WxButtonType = null
    if (type === 'component') {
      result = wxButtons?.find(x => x.id === comInfo?.id) || null
    }
    if (type === 'hot') {
      return getWxButtonByEvent(hot?.event?.find(x => x.type === "tap")) || {}
    }
    if (type === 'popup') {
      return getWxButtonByEvent(popup?.event?.find(x => x.type === "tap"))
    }
    if (result) {
      result.openType = isCustomShare && result?.openType === 'share' ? '' : result?.openType
    }

    return result
  }, [wxButtons, type, comInfo, hot, popup])
  const buttonStyle: CSSProperties = useMemo(() => {
    let result: any = comInfo?.style
    if (wxBtn) {
      if (type === 'component') {
        result = pick(result, [
          'position',
          'left',
          'top',
          'right',
          'bottom',
          'zIndex',
          'order',
          'flexGrow',
          'flexShrink',
          'alignSelf',
          'width',
          'height',
        ])
        if (endsWith(result.width as string, 'px')) {
          result = omit(result, ['width'])
        }
        if (endsWith(result.height as string, 'px')) {
          result = omit(result, ['height'])
        }
        result = addButtonImportant(result)
      }
      if (type === 'hot') {
        result = injectStyle || {}
      }
    }
    return result
  }, [wxBtn, type, injectStyle])
  return (
    <>
      {wxBtn && (
        <Button
          openType={wxBtn?.openType as any}
          showMessageCard={wxBtn?.show}
          sendMessageTitle={wxBtn?.title}
          sendMessagePath={wxBtn?.path}
          sendMessageImg={wxBtn?.imageUrl}
          className="button-no"
          onClick={e => {
            if (componentType === 'popup') {
              e.stopPropagation()
            }
            if (['subscribe', 'getUserProfile', 'qyContact', undefined].includes(wxBtn?.openType)) {
              hanlderEvent(e)
            }
          }}
          onGetPhoneNumber={e => hanlderEvent({ ...e, type: 'tap' })}
          onOpenSetting={e => hanlderEvent({ ...e, type: 'tap' })}
          onContact={e => hanlderEvent({ ...e, type: 'tap' })}
          style={buttonStyle}
          data-title={wxBtn?.title}
          data-path={wxBtn?.path}
          data-img={wxBtn?.imageUrl}
        >
          {children}
        </Button>
      )}
      {!wxBtn && children}
    </>
  )
}

export default ButtonAuth
