import { ScrollView } from "@tarojs/components"
import { CSSProperties, useMemo } from "react"
import { assign, cloneDeep } from "lodash-es"
import { getDomId, getHotStyle } from "../../../helper"
import ButtonAuth from "../../ButtonAuth"
import ImagePR from "../../ImagePR"
import Compiler from "../../Compiler"
import useHanlder from "../../../hooks/useHanlder"
import useStore from "../../../hooks/useStore"
import useStyle from "../../../hooks/useStyle"



type ProScrollViewProps = {
    comInfo: Edit.IComponents & { path: string }
    comIndex: number
}

const ProScrollView: React.FC<ProScrollViewProps> = ({ comInfo, comIndex }) => {
    const { updateOffset } = useStore(comInfo)
    const { baseStyle, baseClassName } = useStyle(comInfo)
    const { hanlderEvent } = useHanlder(comInfo)
    const scrollViewStyle = useMemo(() => {
        let result: CSSProperties = cloneDeep(baseStyle)
        if (comInfo.scrollView?.scrollType === 'x') {
            assign(result, { whiteSpace: 'nowrap' })
        } else {
            assign(result, { whiteSpace: 'normal' })
        }
        return result ?? {}
    }, [baseStyle, comInfo])
    return (<ScrollView
        className={baseClassName}
        id={getDomId(comInfo?.id)}
        style={scrollViewStyle}
        scrollX={comInfo?.scrollView?.scrollType === 'x'}
        scrollY={comInfo?.scrollView?.scrollType === 'y'}
        scrollLeft={updateOffset || 0}
        scrollTop={updateOffset || 0}
        scrollWithAnimation
        onClick={e => hanlderEvent(e)}
        onLongPress={e => hanlderEvent(e)}
    >
        {comInfo?.hot?.map((hotItem: any, hotIndex: number) => (
            <ButtonAuth
                key={hotItem.id}
                type="hot"
                hot={hotItem}
                hotIndex={hotIndex}
                injectStyle={getHotStyle(hotItem.value, { zIndex: 99 + hotIndex })}
            >
                {
                    hotItem.imgUrl && <ImagePR style={{ width: '100%', height: '100%' }} mode='aspectFit' src={hotItem.imgUrl} />
                }
            </ ButtonAuth>
        ))
        }
        { comInfo?.children?.length > 0 && <Compiler data={comInfo?.children} parentPath={comInfo.path} parentIndex={comIndex} />}
    </ScrollView >)
}

export default ProScrollView