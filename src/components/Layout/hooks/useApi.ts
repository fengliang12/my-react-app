import { useMemoizedFn } from "ahooks";
import { get } from "lodash-es";
import http from '../api/axios'
import { pageStore } from '../store/index'
import { replaceStrTemplate } from '../helper'

export default function useApi() {
    const loadApiData = useMemoizedFn(async (apiConfig, pageId) => {
        let result: any = null;
        if (apiConfig) {
            let { method, url, body, errConfig } = apiConfig
            url = replaceStrTemplate(url, get(pageStore, pageId))
            if (body) {
                body = JSON.parse(replaceStrTemplate(body, get(pageStore, pageId)))
            }
            try {
                if (['get', 'delete'].includes(method)) {
                    result = await http[method](url);
                } else if (['post', 'put'].includes(method)) {
                    result = await http[method](url, body);
                }
                if (result.status === 200) {
                    result = result.data
                }
            } catch (err) { }
        }
        return result;
    })
    return {
        loadApiData
    };
}
