import { View } from "@tarojs/components";
import { useMemoizedFn } from "ahooks";
import Taro from "@tarojs/taro";

import "./index.less"

const app = Taro.getApp()

const bindDialog = ({ isShowDialog }) => {

    const toBind = useMemoizedFn((e) => {
        e.stopPropagation?.()
        app.to('/pages/bind/index')
    })

    return <>
        <View
            onClick={toBind}
            className="bindDialog"
            style={{ display: isShowDialog ? 'flex' : 'none' }}>
        </View>
    </>;
};

export default bindDialog;
