import Taro from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import { T12 } from "@/assets/image/index"
import "./index.less"

const app = Taro.getApp()

const NoData = ({ title }) => {
    return <View className="nodata">
        <Image src={T12} mode="widthFix" className="img" />
        <View className="txt">{title}</View>
        <View className="back" onClick={() => app.to(1)}>返回</View>
    </View>
}

export default NoData;