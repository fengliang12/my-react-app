import Taro from '@tarojs/taro';
import { useLatest, useMemoizedFn, useMount, useUpdateEffect } from 'ahooks';
import dayjs from 'dayjs';
import { useContext, useRef, useState } from 'react';

import {
  durationFormatter,
  formatDateTime,
  isBeforeValidTime
} from '../helper';
import { CountdownTemplateContext, LiveTemplateContext } from '../index';
import usePage from './usePage';

export default function useCountDown(props) {
  const { customData, type } = props;
  const { computedLiveByNoRoomId } = useContext(LiveTemplateContext);
  const { countdownEndTime } = useContext(CountdownTemplateContext);
  const { isNowPage } = usePage();
  const [value, setValue] = useState<string | null>(null);
  const [isShowValue, setIsShowValue] = useState<boolean>(true);
  const latestValueRef = useLatest(value);
  const countDownClearRef = useRef<any>();
  const init = useMemoizedFn(() => {
    if (customData?.countDown) {
      const countDown = customData?.countDown;
      if (countDown?.type === 'hide') {
        const fn = () => {
          const result = getCountDownValue();
          if (result) {
            countDownClearRef.current = setTimeout(fn, 1000);
          } else {
            setIsShowValue(false)
          }
        }
        countDownClearRef.current = setTimeout(fn, 1000);
        return
      }
      const isShow = checkIsShow(countDown)
      if (isShow) {
        const fn = () => {
          const result = getCountDownValue();
          if (result) {
            if (type === 'text' && latestValueRef.current !== result[countDown?.type]) {
              Taro.nextTick(() => setValue(result[countDown?.type]));
            }
            if (type === 'image') {
              const src = getImgSrcByStr(
                result[countDown?.type].charAt(countDown?.numType)
              );
              if (src !== latestValueRef.current) {
                if (isImgZero(result) && isShowValue) {
                  Taro.nextTick(() => setIsShowValue(false));
                } else if (isNotImgZero(result) && !isShowValue) {
                  Taro.nextTick(() => {
                    setIsShowValue(true);
                    setValue(src);
                  });
                } else {
                  Taro.nextTick(() => setValue(src));
                }
              }
            }
            const isNeedClear = isNeedClearInterval(countDown, result);
            if (!isNeedClear) {
              countDownClearRef.current = setTimeout(fn, 1000);
            }
          }
        };
        countDownClearRef.current = setTimeout(fn, 1000);
      } else {
        setIsShowValue(false)
      }
    }
    if (customData?.liveCountDown) {
      const fn = () => {
        const result = getLiveCountDownValue();
        if (result) {
          Taro.nextTick(() =>
            setValue(customData?.liveCountDown.prefix + result)
          );
          if (!['00:00:00', '0:0:0'].includes(result)) {
            countDownClearRef.current = setTimeout(fn, 1000);
          } else {
            setTimeout(() => {
              computedLiveByNoRoomId?.(customData?.liveCountDown?.comId);
            }, 1000);
          }
        }
      };
      countDownClearRef.current = setTimeout(fn, 1000);
    }
  });
  const getCountDownValue = useMemoizedFn(() => {
    let { endTime, addZero, showDay, showHour, showMinute, type } =
      customData?.countDown;
    if (countdownEndTime) {
      endTime = dayjs(countdownEndTime).format('YYYY-MM-DDTHH:mm:ssZ');
    }
    const isValid = dayjs().isBefore(endTime);
    if (isValid) {
      const duration: any = durationFormatter(
        (new Date(formatDateTime(endTime, 6, '/')).getTime() - Date.now()) /
        1000
      );
      let result: any = {
        day: addZero || props?.type === 'image' ? '00' : '0',
        hour: addZero || props?.type === 'image' ? '00' : '0',
        minute: addZero || props?.type === 'image' ? '00' : '0',
        second: addZero || props?.type === 'image' ? '00' : '0'
      };
      if (duration.dd) {
        result.day =
          duration.dd < 10 && (addZero || props?.type === 'image')
            ? `0${duration.dd}`
            : `${duration.dd}`;
      }
      if (duration.hh) {
        result.hour =
          duration.hh < 10 && (addZero || props?.type === 'image')
            ? `0${duration.hh}`
            : `${duration.hh}`;
      }
      if (duration.mm) {
        result.minute =
          duration.mm < 10 && (addZero || props?.type === 'image')
            ? `0${duration.mm}`
            : `${duration.mm}`;
      }
      if (duration.ss) {
        result.second =
          duration.ss < 10 && (addZero || props?.type === 'image')
            ? `0${duration.ss}`
            : `${duration.ss}`;
      }
      if (showDay === 'none' && duration.dd && type === 'hour') {
        result.hour = `${duration.dd * 24 + duration.hh || 0}`;
        if (result.hour.length > 2 && props?.type === 'image') {
          result.hour = '99';
        }
      }
      if (
        showHour === 'none' &&
        (duration.hh || duration.dd) &&
        type === 'minute'
      ) {
        result.minute = `${((duration.dd || 0) * 24 + duration.hh || 0) * 60 + duration.mm || 0
          }`;
        if (result.minute.length > 2 && props?.type === 'image') {
          result.minute = '99';
        }
      }
      if (
        showMinute === 'none' &&
        (duration.hh || duration.dd || duration.mm) &&
        type === 'second'
      ) {
        result.second = `${(((duration.dd || 0) * 24 + duration.hh || 0) * 60 + duration.mm ||
          0) *
          60 +
          duration.ss || 0
          }`;
        if (result.second.length > 2 && props?.type === 'image') {
          result.second = '99';
        }
      }
      return result;
    }
    return null;
  });
  const getLiveCountDownValue = useMemoizedFn(() => {
    let result = '';
    const { validTime, zero, hours, showHM } = customData?.liveCountDown;
    const isValid = isBeforeValidTime(validTime?.[0]);
    if (isValid) {
      const duration: any = durationFormatter(
        (new Date(formatDateTime(validTime?.[0], 6, '/')).getTime() -
          Date.now()) /
        1000
      );
      duration.dd = duration.dd ?? 0;
      duration.hh = duration.hh ?? 0;
      duration.mm = duration.mm ?? 0;
      duration.ss = duration.ss ?? 0;
      const sumHours = duration.dd * 24 + duration.hh;
      if (sumHours < hours) {
        const h = sumHours >= 10 && zero ? sumHours : '0' + sumHours;
        const m = duration.mm >= 10 && zero ? duration.mm : '0' + duration.mm;
        const s = duration.ss >= 10 && zero ? duration.ss : '0' + duration.ss;
        result = `${h}:${m}:${s}`;
        if (!showHM) {
          if (sumHours === 0) {
            result = `${m}:${s}`;
            if (duration.mm === 0) {
              result = `${s}`;
            }
          }
        }
      }
    }
    return result;
  });
  const isNeedClearInterval = useMemoizedFn((countDown, result) => {
    let res = false;
    if (type === 'text') {
      // 文本清除定时器
      if (['00', '0'].includes(result[countDown?.type] as string)) {
        if (countDown?.type === 'day') {
          res = true;
        }
        if (countDown?.type === 'hour' && ['00', '0'].includes(result.day)) {
          res = true;
        }
        if (
          countDown?.type === 'minute' &&
          ['00', '0'].includes(result.day) &&
          ['00', '0'].includes(result.hour)
        ) {
          res = true;
        }
      }
    }
    if (type === 'image') {
      const isNum0 = latestValueRef.current === countDown.num0;
      res =
        (isNum0 && countDown?.type === 'day' && countDown?.numType === 0) ||
        (isNum0 &&
          countDown?.type === 'day' &&
          result.day.charAt(0) === '0' &&
          countDown?.numType === 1) ||
        (isNum0 &&
          countDown?.type === 'hour' &&
          countDown?.numType === 0 &&
          result.day.charAt(0) === '0' &&
          result.day.charAt(1) === '0') ||
        (isNum0 &&
          countDown?.type === 'hour' &&
          countDown?.numType === 1 &&
          result.hour.charAt(0) === '0' &&
          result.day.charAt(0) === '0' &&
          result.day.charAt(1) === '0') ||
        (isNum0 &&
          countDown?.type === 'minute' &&
          countDown?.numType === 0 &&
          result.day.charAt(0) === '0' &&
          result.day.charAt(1) === '0' &&
          result.hour.charAt(0) === '0' &&
          result.hour.charAt(1) === '0') ||
        (isNum0 &&
          countDown?.type === 'minute' &&
          countDown?.numType === 1 &&
          result.minute.charAt(0) === '0' &&
          result.day.charAt(0) === '0' &&
          result.day.charAt(1) === '0' &&
          result.hour.charAt(0) === '0' &&
          result.hour.charAt(1) === '0') ||
        (isNum0 &&
          countDown?.type === 'second' &&
          countDown?.numType === 0 &&
          result.minute.charAt(0) === '0' &&
          result.minute.charAt(1) === '0' &&
          result.day.charAt(0) === '0' &&
          result.day.charAt(1) === '0' &&
          result.hour.charAt(0) === '0' &&
          result.hour.charAt(1) === '0');
    }
    return res;
  });
  const isImgZero = useMemoizedFn((result: any) => {
    return (
      customData?.countDown?.numType === 0 &&
      result[customData?.countDown?.type].charAt(0) === '0' &&
      !customData?.countDown?.addZero
    );
  });
  const isNotImgZero = useMemoizedFn((result: any) => {
    return (
      customData?.countDown?.numType === 0 &&
      result[customData?.countDown?.type].charAt(0) !== '0' &&
      !customData?.countDown?.addZero
    );
  });
  const getImgSrcByStr = useMemoizedFn((numStr: string) => {
    return customData?.countDown[`num${numStr}`];
  });
  const checkIsShow = useMemoizedFn((countDown: any) => {
    let result = false
    if (countDown) {
      const { type, endTime, showDay, autoHideDay, showHour, autoHideHour, showMinute, autoHideMinute, showSecond } = countDown
      const s = dayjs(endTime).unix() - dayjs().unix()
      const h24 = 24 * 60 * 60
      const m60 = 60 * 60
      const s60 = 60
      switch (type) {
        case 'day':
          if (showDay !== 'none' && (!autoHideDay || (autoHideDay && s > h24))) {
            result = true
          }
          break;
        case 'hour':
          if (showHour !== 'none' && (!autoHideHour || (autoHideHour && s > m60))) {
            result = true
          }
          break;
        case 'minute':
          if (showMinute !== 'none' && (!autoHideMinute || (autoHideMinute && s > s60))) {
            result = true
          }
          break;
        case 'second':
          if (showSecond !== 'none') {
            result = true
          }
          break;
      }
    }
    return result
  })

  useUpdateEffect(() => {
    if (!isNowPage && countDownClearRef.current) {
      clearTimeout(countDownClearRef.current);
      countDownClearRef.current = null;
    }
    if (isNowPage && !countDownClearRef.current) {
      init();
    }
  }, [isNowPage]);

  useMount(() => {
    init();
  });

  return {
    countDownValue: value,
    isShowCountDown: isShowValue
  };
}
