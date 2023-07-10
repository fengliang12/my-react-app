import { useDidHide, useDidShow } from "@tarojs/taro";
import { useState } from "react"



export default function usePage() {
    const [isNowPage, setIsNowPage] = useState<boolean>(true)
    useDidShow(() => {
        !isNowPage && setIsNowPage(true);
    });
    useDidHide(() => {
        isNowPage && setIsNowPage(false);
    });
    return {
        isNowPage,
    }
}
