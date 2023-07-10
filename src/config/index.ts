import Taro from '@tarojs/taro'
import { merge } from 'lodash-es'
import dev from './dev'
import prod from './prod'

// 配置生产项目APPID
const IS_PRO = Taro.getAccountInfoSync()?.miniProgram?.appId === 'wx5db42fa407c94947'


const baseConfig = {
    /** 品牌StoreCode */
    storeCode: 'yoseido',
    /** 网络图片前缀 */
    cosImgPrefix: 'https://storage.yoseido.com.cn/',
    /** 主题页面Code配置 */
    pageCode: {
        /** 会员中心首页 */
        home: 'home',
        /** 二级活动页 */
        activity: 'activity',
        /** 个人中心 */
        user: 'user'
    },
    /** 内置H5页面 */
    webView: {
        pagePath: '/pages/h5/index',
        queryName: 'url'
    },
    errCodeList: []
}
const config = merge(baseConfig, IS_PRO ? prod : dev)
config.loginUrl = `${config.basePathUrl}/sp-portal/store/${config.storeCode}/wechat/login/`
export default config