import { Input } from '@tarojs/components';
import { CSSProperties, useMemo, useRef, useContext } from 'react';
import { cloneDeep } from 'lodash-es';
import { useMemoizedFn } from 'ahooks';
import { getDomId } from '../../../helper';
import useHanlder from '../../../hooks/useHanlder';
import useStyle from '../../../hooks/useStyle';
import useStore from '../../../hooks/useStore';
import { pageStore } from '../../../store';
import { LayoutContext } from '../../../index';


type ProInputProps = {
    comInfo: Edit.IComponents;
    comIndex: number;
};

const ProInput: React.FC<ProInputProps> = ({ comInfo }) => {
    const { pageId } = useContext(LayoutContext);
    const { hanlderEvent } = useHanlder(comInfo);
    const { baseStyle } = useStyle(comInfo);
    const { updateValue } = useStore(comInfo)
    const valueRef = useRef<string>()
    const inputValue = useMemo(() => {
        let result: any = updateValue ?? comInfo?.customData?.input?.placeholder
        return result
    }, [updateValue, comInfo])
    const inputStyle = useMemo(() => {
        let result: CSSProperties = cloneDeep(baseStyle);
        return result;
    }, [baseStyle])
    const inputChange = useMemoizedFn((e) => {
        valueRef.current = e.detail.value
        pageStore.setPage({ key: 'keyword', value: e.detail.value }, pageId)
    })
    const inputConfirm = useMemoizedFn((e) => {
        hanlderEvent(e)
    })

    return <>
        <Input
            id={getDomId(comInfo?.id)}
            {...(comInfo?.customData?.input ?? {})}
            value={inputValue}
            style={inputStyle}
            onConfirm={inputConfirm}
            onInput={inputChange}
        />
    </>
}

export default ProInput