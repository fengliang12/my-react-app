import { useMemoizedFn, useUnmount } from "ahooks";
import { get, merge, cloneDeep, replace, set, startsWith } from "lodash-es";
import { reaction } from "mobx";
import { useEffect, useRef, useContext } from "react";
import { useImmer } from "use-immer";
import { pageStore, appStore } from "../store/index";
import { LayoutContext } from "../index";
import { parsingCQL, replaceStrTemplate } from "../helper";

export default function usePageStore(comInfo: any, dynamicInfo) {
  const { pageId } = useContext(LayoutContext);
  const [pageData, setPageData] = useImmer<any>({});
  const pageDataReactionRef = useRef<any>();
  const init = useMemoizedFn(() => {
    clear();
    pageDataReactionRef.current = reaction(
      () => {
        const result = {};
        cloneDeep(comInfo.customData.dynamics).forEach(item => {
          if (dynamicInfo && item.dataKey) {
            if (item.dataKey) {
              item.dataKey = replace(
                item.dataKey,
                dynamicInfo.key,
                dynamicInfo.value + ""
              );
            }
            if (item.conditionExpression) {
              item.conditionExpression = replace(
                item.conditionExpression,
                dynamicInfo.key,
                dynamicInfo.value + ""
              );
            }
          }
          const isAppStore = startsWith(item.dataKey, "app.")
          if (item.type === "condition") {
            item.conditionExpression = replaceStrTemplate(
              item.conditionExpression,
              pageStore,
              appStore
            );
            const cResult = parsingCQL(item.conditionExpression);
            set(result, "condition", cResult);
          }
          if (item.type === "list") {
            const value = get(pageStore, `${pageId}.${item.dataKey}`);
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            value?.length;
            set(result, item.dataKey, cloneDeep(value));
          }
          if (item.type === "value") {
            if (isAppStore) {
              const key = item.dataKey.substr(4);
              const value = get(appStore, key);
              set(result, key, cloneDeep(value));
            } else {
              const value = get(pageStore, `${pageId}.${item.dataKey}`);
              set(result, item.dataKey, cloneDeep(value));
            }
          }
        });
        return result;
      },
      data => {
        setPageData(draft => {
          merge(draft, data ?? {});
        });
      }
    );
  });

  const clear = useMemoizedFn(() => {
    pageDataReactionRef.current?.();
  });
  useEffect(() => {
    if (comInfo?.customData?.dynamics && pageId) {
      init();
    }
  }, [comInfo?.customData?.dynamics, pageId]);
  useUnmount(() => {
    clear();
  });
  return {
    pageData
  };
}
