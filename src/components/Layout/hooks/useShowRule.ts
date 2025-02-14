import Taro, { useDidShow, usePageScroll } from '@tarojs/taro';
import { useMemoizedFn } from 'ahooks';
import dayjs from 'dayjs';
import { useEffect, useRef } from 'react';

import { parsingActions, storage } from '../helper';

const STORAGE_KEY = 'layout_showRule';

export default function useShowRule(
  navHeightPxNum,
  placeholderHeight,
  pageId,
  windowData
) {
  const showRuleDataRef = useRef<any>([]);
  /** 显示规则处理 */
  const getShowRuleData = (showRule, id) => {
    const result: any = {
      id
    };
    const { timeType, timeValue, spaceType, spaceHeightStart, spaceHeightEnd } =
      showRule;
    if (spaceType) {
      result.openSpace = true;
      if (spaceType === 1) {
        const { windowHeight } = Taro.getSystemInfoSync?.();
        result.spaceStart = 0;
        result.spaceEnd = windowHeight;
        result.spaceHidden = false;
      }
      if (spaceType === 2) {
        const { windowHeight } = Taro.getSystemInfoSync?.();
        result.spaceStart = windowHeight;
        result.spaceEnd = 99999999;
        result.spaceHidden = true;
      }
      if (spaceType === 3) {
        result.spaceStart = spaceHeightStart;
        result.spaceEnd = spaceHeightEnd;
        result.spaceHidden = spaceHeightStart > 0 || spaceHeightEnd < 0;
      }
    }
    if (timeType) {
      result.openTime = true;
      result.timeType = timeType;
      result.timeValue = timeValue;
      if (timeType === 1) {
        result.timeHidden = false;
        if (timeValue && timeValue.length === 2) {
          const [startTime, endTime] = timeValue;
          result.timeHidden = !checkTime(startTime, endTime);
        }
      }
      if (timeType === 2) {
        if (storage.arrGet(STORAGE_KEY)?.findIndex(x => x.id === id) !== -1) {
          result.timeHidden = true;
        } else {
          if (timeValue && timeValue.length === 2) {
            const [startTime, endTime] = timeValue;
            result.timeHidden = !checkTime(startTime, endTime);
          }
          if (!result.timeHidden) {
            storage.arrAdd(STORAGE_KEY, {
              id,
              date: dayjs().format('YYYY-MM-DD')
            });
          }
        }
      }
    }
    return result;
  };
  /** 计算显示规则下的组件 */
  const initComputedShowRule = useMemoizedFn(() => {
    // 清除今天之前的Storage缓存
    let showRuleStorage = storage.arrGet(STORAGE_KEY);
    showRuleStorage = showRuleStorage.filter(x =>
      dayjs().isBefore(x.date + ' 23:59:59')
    );
    storage.set(STORAGE_KEY, showRuleStorage);
    windowData.forEach(item => {
      if (
        item.showRule &&
        showRuleDataRef.current?.findIndex(x => x.id === item.id) === -1
      ) {
        showRuleDataRef.current?.push(getShowRuleData(item.showRule, item.id));
      }
    });
    const updateList = showRuleDataRef.current?.reduce((pre, cur) => {
      if (cur.spaceHidden || cur.timeHidden) {
        pre.push({
          id: cur.id,
          update: {
            reactStyle: {
              display: 'none'
            }
          }
        });
      }
      return pre;
    }, []);
    actionsHandler(updateList);
  });
  /** 页面滚动-显示空间规则处理 */
  const pageScrollSpaceHandler = useMemoizedFn(async ({ scrollTop }) => {
    if (scrollTop < 0) {
      return;
    }
    scrollTop = scrollTop + navHeightPxNum + (placeholderHeight || 0);
    const updateList: any = [];
    showRuleDataRef.current?.forEach(item => {
      if (item.openSpace) {
        if (
          scrollTop >= item.spaceStart &&
          scrollTop <= item.spaceEnd &&
          item.spaceHidden
        ) {
          item.spaceHidden = false;
          updateList.push({
            id: item.id,
            update: {
              reactStyle: {
                display: 'flex'
              }
            }
          });
        }
        if (
          (scrollTop < item.spaceStart || scrollTop > item.spaceEnd) &&
          !item.spaceHidden
        ) {
          item.spaceHidden = true;
          updateList.push({
            id: item.id,
            update: {
              reactStyle: {
                display: 'none'
              }
            }
          });
        }
      }
    });
    actionsHandler(updateList);
  });
  /** 获取当前日期 */
  const checkTime = useMemoizedFn((startTime, endTime) => {
    const nowDate = dayjs().format('YYYY-MM-DD') + ' ';
    return (
      dayjs().isBefore(nowDate + endTime) &&
      dayjs().isAfter(nowDate + startTime)
    );
  });
  /** 重进页面处理
   *  1、每次重新进页面处理
   */
  const pageShowTimeHandler = useMemoizedFn(() => {
    const updateList: any = [];
    showRuleDataRef.current?.forEach(item => {
      if (item.timeType === 1) {
        let show = true;
        if (item.timeValue && item.timeValue.length === 2) {
          const [startTime, endTime] = item.timeValue;
          show = checkTime(startTime, endTime);
        }
        if (show) {
          updateList.push({
            id: item.id,
            update: {
              reactStyle: {
                display: 'flex'
              }
            }
          });
        }
      }
    });
    actionsHandler(updateList);
  });
  const actionsHandler = useMemoizedFn(styles => {
    if (styles?.length > 0) {
      parsingActions(
        [
          {
            actionId: Date.now() + '',
            actionType: {
              value: 'STYLE',
              style: styles
            },
            hasQueue: false
          }
        ] as any,
        pageId,
        {}
      );
    }
  });
  usePageScroll(res => {
    /** 空间显示规则操作 */
    pageScrollSpaceHandler(res);
  });
  useDidShow(() => {
    pageShowTimeHandler();
  });
  useEffect(() => {
    if (pageId && windowData) {
      initComputedShowRule();
    }
  }, [windowData, pageId]);

  return {
  };
}
