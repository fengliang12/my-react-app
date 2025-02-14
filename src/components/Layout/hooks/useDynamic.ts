import { useContext, useMemo } from "react";
import { get, cloneDeep, replace, startsWith, isNil } from "lodash-es";
import { LayoutContext } from "../index";
import { pageStore, appStore } from "./../store/index";
import { parsingCQL, replaceStrTemplate } from "../helper";

import usePageStore from "./usePageStore";

export default function useDynamic(comInfo, dynamicInfo?) {
  const { pageId } = useContext(LayoutContext);
  const { pageData } = usePageStore(comInfo, dynamicInfo);
  const dynamicData: any = useMemo(() => {
    let result = null;
    if (comInfo?.customData?.dynamics) {
      result = cloneDeep(comInfo.customData.dynamics)?.map(item => {
        let value: any = null;
        if (dynamicInfo) {
          item.dataKey = replace(
            item.dataKey,
            dynamicInfo.key,
            dynamicInfo.value + ""
          );
        }
        if (["list", "value"].includes(item.type)) {
          if (startsWith(item.dataKey, "app.")) {
            const key = item.dataKey.substr(4);
            value = get(appStore, key);
          } else {
            value = get(pageStore, `${pageId}.${item.dataKey}`);
          }
        } else if (["condition"].includes(item.type)) {
          if (!isNil(pageData.condition)) {
            value = pageData.condition;
          } else {
            item.conditionExpression = replaceStrTemplate(
              item.conditionExpression,
              pageStore,
              appStore
            );
            value = parsingCQL(item.conditionExpression);
          }
        }
        return {
          type: item.type,
          key: item.dataKey,
          styleKey: item.styleKey,
          value
        };
      });
    }
    return result;
  }, [pageData, comInfo?.customData?.dynamics, dynamicInfo]);

  return {
    dynamicData
  };
}
