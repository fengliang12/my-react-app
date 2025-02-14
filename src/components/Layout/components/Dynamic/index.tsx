import { useMemo } from "react"
import useDynamic from "../../hooks/useDynamic"

type DynamicProps = {
    comInfo?: any
    dynamicInfo: any
    children?: any
}

const Dynamic: React.FC<DynamicProps> = ({ comInfo, dynamicInfo, children }) => {
    const { dynamicData } = useDynamic(comInfo, dynamicInfo)
    const isShowChildren = useMemo(() => {
        let result = true
        dynamicData?.forEach(item => {
            if (item.type === 'condition' && !item.value) {
                result = false
            }
            if (item.type === 'list' && !item?.value?.length) {
                result = false
            }
        })
        return result
    }, [dynamicData])
    return <>
        {isShowChildren ? children : <></>}
    </>
}

export default Dynamic