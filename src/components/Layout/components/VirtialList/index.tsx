import { View } from '@tarojs/components';
import Taro, { usePageScroll } from '@tarojs/taro';
import { useLatest, useMemoizedFn, useUpdateEffect } from 'ahooks';
import React, { useEffect, useRef } from 'react';
import { useImmer } from 'use-immer';

import { getDomId, log } from '../../helper';

type VirtialListProps = {
  /** 列表数据 */
  list: [];
  /** 置顶依赖更新 */
  updateTopdata?: any[];
  /** 状态类依赖更新 */
  updateStatus?: any[];
  /** 业务组件依赖更新 */
  updateCustom?: any[];
  /** 虚拟列表开启规则 */
  rule?: {
    /**
     * 开启机型
     * getSystemInfoSync的model属性值,不配置相当于所有机型都开启
     * */
    model?: string[];
    /**
     * 数值越大,体验效果越好,性能越差
     * 数值越小,性能越好,体验效果越差
     * 最小值为1
     */
    screenCount: number;
    /** 加载元素 */
    loadingElement?: React.ReactElement;
  }[];
  /**
   * @param item 列表的单个数据项的值
   * @param index 列表的单个数据的index
   * @param mainIndex 二维数组index
   */
  onRender: (item: any, index: number, pageIndex: number) => React.ReactElement;
};

const VirtialList: React.FC<VirtialListProps> = props => {
  const {
    list = [],
    updateStatus,
    updateTopdata,
    updateCustom,
    rule = [{ screenCount: 99999 }],
    onRender
  } = props;
  const [twoList, setTwoList] = useImmer<any>([]);
  const latestTwoList = useLatest<any>(twoList);
  const pageHeightArrRef = useRef<number[]>([]);
  const twoHeightRef = useRef<any>([]);
  const systemInfoRef = useRef<any>();
  const initListRef = useRef<any>([]);
  const lastScrollTop = useRef<any>(0);
  const currentIndexRef = useRef<number[]>([0, 1]);
  const currentRuleRef = useRef<any>();
  const topDataRef = useRef<any>([]);
  /** 初始化 */
  const init = useMemoizedFn(() => {
    if (list?.length > 0) {
      getSystemInfo();
      formatList(list);
    }
  });
  /** 获取系统信息 */
  const getSystemInfo = useMemoizedFn(() => {
    systemInfoRef.current = Taro.getSystemInfoSync?.();
  });
  /** 计算单屏高度 */
  const computedWindowHeight = useMemoizedFn(() => {
    let currentRule: any = null;
    rule?.forEach(x => {
      if (!x.model) {
        currentRule = x;
      }
      if (x.model?.includes(systemInfoRef.current.model)) {
        currentRule = x;
      }
    });
    currentRuleRef.current = currentRule;
    return (
      systemInfoRef.current.windowHeight * currentRuleRef.current.screenCount
    );
  });
  /** 格式化初始数据 */
  const formatList = useMemoizedFn(data => {
    log('formatList', data);
    let arr: any = [];
    let height: number = 0;
    const _list: any = []; // 二维数组副本
    const windowHeight = computedWindowHeight();
    data.forEach((item, index) => {
      arr.push({ ...item, index });
      const isTopDataFixed = item.topData?.enable && item.topData?.fixed;
      height = height + (isTopDataFixed ? 0 : item.height);
      if (height > windowHeight) {
        // 够一个维度的量就装进_list
        _list.push({
          height,
          list: arr
        });
        pageHeightArrRef.current.push(height);
        arr = [];
        height = 0;
      }
      if (item.topData?.enable) {
        topDataRef.current.push(item.topData);
      }
    });
    if (arr.length > 0) {
      _list.push({
        height,
        list: arr
      });
      pageHeightArrRef.current.push(
        arr.reduce((pre, cur) => pre + cur.height, 0)
      );
    }
    updateTwoHeight();
    initListRef.current = _list;
    setTwoList(draft => {
      _list?.forEach((item, index) => {
        if (currentIndexRef.current.includes(index)) {
          draft[index] = {
            ...item,
            height:
              pageHeightArrRef.current?.length === 1 ? 'auto' : item.height,
            isVirtial: false
          };
        } else {
          draft[index] = {
            height: item.height,
            list: item.list.filter(x => x.topData?.fixed),
            isVirtial: true
          };
        }
      });
    });
  });
  /** 更新虚拟列表的高度 */
  const updateTwoHeight = useMemoizedFn(() => {
    let sumHeight = 0;
    twoHeightRef.current = pageHeightArrRef.current?.reduce((pre: any, cur) => {
      pre.push([sumHeight, cur + sumHeight]);
      sumHeight = cur + sumHeight;
      return pre;
    }, []);
  });
  /** 滑动计算虚拟列表 */
  const handleScroll = useMemoizedFn(({ scrollTop }) => {
    if (pageHeightArrRef.current?.length === 1) {
      return;
    }
    const toBottom = lastScrollTop.current < scrollTop;
    lastScrollTop.current = scrollTop;
    const currentIndex = twoHeightRef.current.findIndex(
      x => scrollTop > x[0] && scrollTop <= x[1]
    );
    const arr: any = [];
    if (toBottom) {
      const lastList = latestTwoList.current[currentIndex - 1];
      const nextList = latestTwoList.current[currentIndex + 1];
      if (lastList?.isVirtial) {
        arr.push({ type: 'add', index: currentIndex - 1 });
        const oldNextList = latestTwoList.current[currentIndex + 2];
        if (oldNextList && !oldNextList?.isVirtial) {
          arr.push({ type: 'subtract', index: currentIndex + 2 });
        }
      }
      if (nextList?.isVirtial) {
        arr.push({ type: 'add', index: currentIndex + 1 });
        const oldlastList = latestTwoList.current[currentIndex - 2];
        if (oldlastList && !oldlastList.isVirtial) {
          arr.push({ type: 'subtract', index: currentIndex - 2 });
        }
      }
    } else {
      const lastList = latestTwoList.current[currentIndex + 1];
      const nextList = latestTwoList.current[currentIndex - 1];
      if (lastList?.isVirtial) {
        arr.push({ type: 'add', index: currentIndex + 1 });
        const oldNextList = latestTwoList.current[currentIndex - 2];
        if (oldNextList && !oldNextList?.isVirtial) {
          arr.push({ type: 'subtract', index: currentIndex - 2 });
        }
      }
      if (nextList?.isVirtial) {
        arr.push({ type: 'add', index: currentIndex - 1 });
        const oldlastList = latestTwoList.current[currentIndex + 2];
        if (oldlastList && !oldlastList?.isVirtial) {
          arr.push({ type: 'subtract', index: currentIndex + 2 });
        }
      }
    }
    updateTwoList(arr);
  });
  /** 增减更新虚拟列表数据 */
  const updateTwoList = useMemoizedFn((data = []) => {
    if (data.length > 0) {
      Taro.nextTick(() => {
        setTwoList(draft => {
          data.forEach(item => {
            if (item.type === 'add') {
              draft[item.index] = {
                ...initListRef.current[item.index],
                isVirtial: false
              };
            } else {
              if (
                !draft[item.index].list.filter(x => x.topData?.fixed)?.length
              ) {
                draft[item.index].list = [];
              }
              draft[item.index].isVirtial = true;
            }
          });
          currentIndexRef.current = draft.reduce((pre, cur, index) => {
            if (!cur.isVirtial) {
              pre.push(index);
            }
            return pre;
          }, []);
        });
      });
    }
  });
  /** 计算状态类组件变化 */
  const computedUpdateStatus = useMemoizedFn(() => {
    let needUpdate = false
    const newInit = JSON.parse(JSON.stringify(initListRef.current))
    setTwoList(draft => {
      updateStatus?.forEach(item => {
        draft.forEach((x, xIndex) => {
          const myIndex = x.list.findIndex(y => y.id === item.id);
          if (myIndex !== -1) {
            const oldStatus = draft[xIndex].list[myIndex].isShow;
            const newStatus = item.type === 'show' ? true : false;
            draft[xIndex].list[myIndex].isShow = newStatus;
            newInit[xIndex].list[myIndex].isShow = newStatus;
            let oldHeight = draft[xIndex].height;
            if (newStatus && !oldStatus) {
              draft[xIndex].height = draft[xIndex].height + x.list[myIndex].defaultHeight;
            } else if (!newStatus && oldStatus) {
              draft[xIndex].height = draft[xIndex].height - x.list[myIndex].defaultHeight;
            }
            if (oldHeight !== draft[xIndex].height) {
              newInit[xIndex].height = draft[xIndex].height;
              pageHeightArrRef.current[xIndex] = draft[xIndex].height;
              needUpdate = true
            }
          }
        });
      });
    });
    if (needUpdate) {
      updateTwoHeight();
      initListRef.current = newInit
    }
  });
  /** 计算置顶组件变化 */
  const computedUpdateTopdate = useMemoizedFn(() => {
    let needUpdate = false
    const newInit = JSON.parse(JSON.stringify(initListRef.current))
    setTwoList(draft => {
      updateTopdata?.forEach(item => {
        draft.forEach((x, xIndex) => {
          const myIndex = x.list.findIndex(y => y.id === item.id);
          if (myIndex !== -1) {
            const oldFixed = draft[xIndex].list[myIndex].topData.fixed;
            draft[xIndex].list[myIndex].topData = item;
            newInit[xIndex].list[myIndex].topData = item;
            let oldHeight = draft[xIndex].height;
            if (oldHeight !== 'auto') {
              if (item.fixed && !oldFixed) {
                draft[xIndex].height = draft[xIndex].height - item.height;
              } else if (!item.fixed && oldFixed) {
                draft[xIndex].height = draft[xIndex].height + item.height;
              }
              if (oldHeight !== draft[xIndex].height) {
                needUpdate = true
                newInit[xIndex].height = draft[xIndex].height;
                pageHeightArrRef.current[xIndex] = draft[xIndex].height;
              }
            }
          }
        });
      });
    });
    if (needUpdate) {
      updateTwoHeight();
      initListRef.current = newInit
    }
  });
  /** 计算业务组件变化 */
  const computedUpdateCustom = useMemoizedFn(() => {
    let needUpdate = false
    const newInit = JSON.parse(JSON.stringify(initListRef.current))
    setTwoList(draft => {
      updateCustom?.forEach(item => {
        draft.forEach((x, xIndex) => {
          const myIndex = x.list.findIndex(y => getDomId(y.id) === item.id);
          if (myIndex !== -1) {
            const oldListItemHeight = draft[xIndex].list[myIndex].height;
            draft[xIndex].list[myIndex].height = item.height;
            draft[xIndex].list[myIndex].defaultHeight = item.height;
            newInit[xIndex].list[myIndex].height = item.height;
            let oldHeight = draft[xIndex].height;
            const gapHeight = item.height - oldListItemHeight;
            draft[xIndex].height = draft[xIndex].height + gapHeight;
            if (oldHeight !== draft[xIndex].height) {
              needUpdate = true
              newInit[xIndex].height = draft[xIndex].height;
              pageHeightArrRef.current[xIndex] = draft[xIndex].height;
            }
          }
        });
      });
    });
    if (needUpdate) {
      updateTwoHeight();
      initListRef.current = newInit
    }
  });
  usePageScroll(res => {
    handleScroll(res);
  });

  useEffect(() => {
    init();
  }, [list]);

  useUpdateEffect(() => {
    computedUpdateStatus();
  }, [updateStatus]);

  useUpdateEffect(() => {
    computedUpdateTopdate();
  }, [updateTopdata]);

  useUpdateEffect(() => {
    computedUpdateCustom();
  }, [updateCustom]);

  return (
    <>
      {twoList?.map((item: any, pageIndex) => (
        <View style={{ height: item.height, position: 'relative' }}>
          {item?.list.map(el => onRender(el, el.index, pageIndex))}
        </View>
      ))}
    </>
  );
};

export default VirtialList;
