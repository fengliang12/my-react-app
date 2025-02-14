import { Picker } from '@tarojs/components';
import { useState } from 'react';
import Compiler from '../../Compiler';

type ProPickerProps = {
    comInfo: Edit.IComponents & { path: string };
    comIndex: number;
};


const ProPicker: React.FC<ProPickerProps> = ({ comInfo, comIndex }) => {
    const [range, setRange] = useState([])
    return <>
        <Picker range={range} onChange={(e) => { }}>
            {comInfo?.children?.length > 0 && (
                <Compiler
                    data={comInfo?.children}
                    parentPath={comInfo.path ?? comInfo?.customData?.path}
                    parentIndex={comIndex}
                />
            )}
        </Picker>
    </>
}

export default ProPicker