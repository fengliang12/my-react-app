import { View } from "@tarojs/components"
import { getDomId, getHotStyle } from "../../../helper"
import ButtonAuth from "../../ButtonAuth"
import ImagePR from "../../ImagePR"
import Compiler from "../../Compiler"
import useHanlder from "../../../hooks/useHanlder"
import useView from "../../../hooks/useView"


type ProViewProps = {
    comInfo: Edit.IComponents & { movable: Edit.IMovable } & { path: string }
    comIndex: number
}

const ProView: React.FC<ProViewProps> = ({ comInfo, comIndex }) => {
    const { hanlderEvent } = useHanlder(comInfo)
    const { viewStyle, viewClassName } = useView({ comInfo, comIndex })

    return (<View
        id={getDomId(comInfo?.id)}
        className={viewClassName}
        style={viewStyle}
        {
        ...(comInfo?.view || {})
        }
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
        ))}
        {comInfo?.children?.length > 0 && <Compiler data={comInfo?.children} parentPath={comInfo.path} parentIndex={comIndex} />}
    </View>)
}

export default ProView