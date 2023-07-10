import Taro from '@tarojs/taro';
import { useRef } from 'react';
import { useMemoizedFn } from 'ahooks';
import { layout } from "../config/index";


export default function useToken() {
    const clearTokenRef = useRef<any>()
    const getToken = useMemoizedFn(async () => {
        const fn = () => {
            const token = Taro.getStorageSync(layout.config.tokenStorageKey!)
            if (!token) {
                clearTokenRef.current = setTimeout(fn, 100)
            } else {
                return token
            }
        }
        clearTokenRef.current = setTimeout(fn, 100)

    })
    return {
        getToken
    }
}
