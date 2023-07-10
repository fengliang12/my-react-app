import { Text } from '@tarojs/components'
import { useMemoizedFn, useSetState, useLatest, useUpdateEffect } from 'ahooks'
import { CSSProperties, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { assign, omit, cloneDeep } from 'lodash-es'
import { getDomId, log, rpxTopx } from '../../../helper'
import { layout } from '../../../config/index'
import useHanlder from "../../../hooks/useHanlder"
import { LayoutContext } from '../../../index'
import useStore from '../../../hooks/useStore'
import useStyle from "../../../hooks/useStyle"
import useCountDown from '../../../hooks/useCountDown'
import usePage from "../../../hooks/usePage"

import './index.less'
import Taro from '@tarojs/taro'


type ProTextProps = {
    comInfo: Edit.IComponents
    comIndex: number
}

type MyContentType = {
    list: string[],
    len: number,
    index: number,
    name: string,
}

const timeCount = 8
const duration = 400

const ProText: React.FC<ProTextProps> = ({
    comInfo,
}) => {
    const { notices } = useContext(LayoutContext)
    const { updateNodes } = useStore(comInfo)
    const { baseStyle } = useStyle(comInfo)
    const { hanlderEvent } = useHanlder(comInfo)
    const { countDownValue } = useCountDown(comInfo)
    const { isNowPage } = usePage()
    const [myContent, setMyContent] = useSetState<MyContentType>({
        list: [],
        len: 0,
        index: 0,
        name: '',
    })
    const [noticeStyle, setNoticeStyle] = useState<CSSProperties>({})
    const latestMyContentRef = useLatest(myContent)
    const latestNoticeStyleRef = useLatest(noticeStyle)
    const myContextCountRef = useRef<number>(1)
    const contextClearRef = useRef<any>()
    const noticeClearRef = useRef<any>()
    const noticeRef = useRef<any>()
    const content = useMemo(() => {
        return updateNodes || comInfo?.text?.nodes
    }, [comInfo?.text?.nodes, updateNodes])

    const textStyle = useMemo(() => {
        let result: CSSProperties = cloneDeep(baseStyle)
        assign(result, noticeStyle)
        return result ?? {}
    }, [baseStyle, noticeStyle])

    const computedMyContext = useMemoizedFn(() => {
        if (content?.includes(layout.config.scrollText!)) {
            const list = content.split(layout.config.scrollText!)
            setMyContent({
                list,
                len: list.length,
                index: 0,
                name: 'fadeInUp',
            })
            const fn = () => {
                const myContent = latestMyContentRef.current
                if (myContent.name === 'fadeInUp') {
                    if (myContextCountRef.current >= timeCount) {
                        Taro.nextTick(() => setMyContent({ name: 'fadeOutUp' }))
                    } else {
                        myContextCountRef.current = myContextCountRef.current + 1
                    }
                }
                if (myContent.name === 'fadeOutUp') {
                    const nextIndex = myContent.index + 1 >= myContent.len ? 0 : myContent.index + 1
                    Taro.nextTick(() => setMyContent({
                        name: 'fadeInUp',
                        index: nextIndex,
                    }))
                    myContextCountRef.current = 1
                }
                contextClearRef.current = setTimeout(fn, duration)
            }
            contextClearRef.current = setTimeout(fn, duration)

        } else {
            setMyContent({
                list: [(countDownValue ?? content) as string],
                len: 1,
                index: 0,
                name: ''
            })
        }
    })
    const computedNotices = useMemoizedFn(() => {
        const notice = notices?.find(x => x.id === comInfo.id)
        if (notice) {
            noticeRef.current = notice
            const fn = () => {
                if (latestNoticeStyleRef.current?.left === '100%') {
                    Taro.nextTick(() => setNoticeStyle({
                        left: rpxTopx(-noticeRef.current?.width),
                        transition: `left ${noticeRef.current?.interval}ms linear`
                    }))
                    noticeClearRef.current = setTimeout(fn, noticeRef.current?.interval)
                } else {
                    Taro.nextTick(() => setNoticeStyle({
                        left: '100%'
                    }))
                    noticeClearRef.current = setTimeout(fn, 100)
                }
            }
            noticeClearRef.current = setTimeout(fn, 100)
        }
    })

    useUpdateEffect(() => {
        if (!isNowPage) {
            if (contextClearRef.current) {
                clearTimeout(contextClearRef.current)
                contextClearRef.current = null
            }
            if (noticeClearRef.current) {
                clearTimeout(noticeClearRef.current)
                noticeClearRef.current = null
            }
        }
        if (isNowPage) {
            if (!contextClearRef.current) {
                computedMyContext()
            }
            if (!noticeClearRef.current) {
                computedNotices()
            }
        }
    }, [isNowPage])

    useEffect(() => {
        computedMyContext()
    }, [content, countDownValue])

    useEffect(() => {
        computedNotices()
    }, [notices, comInfo])

    return (
        <>
            <Text
                id={getDomId(comInfo?.id)}
                style={textStyle}
                {...omit(comInfo?.text, ['nodes'])}
                onClick={e => hanlderEvent(e)}
                onLongPress={e => hanlderEvent(e)}
            >
                {myContent?.len === 1 && myContent?.list[0]}
                {myContent?.len > 1 && (
                    <Text
                        className={myContent.name}
                        style={{
                            animationFillMode: 'forwards',
                            animationDuration: `${duration}ms`,
                            display: 'inline-block'
                        }}
                    >
                        {myContent.list[myContent.index]}
                    </Text>
                )}
            </Text>
        </>
    )
}

export default ProText
