import { useMemoizedFn } from 'ahooks';
import { useContext, useMemo } from 'react';

import { LayoutContext } from '../index';

export default function useCommon(id) {
  const { common } = useContext(LayoutContext);
  const style = useMemo(() => common?.styles?.get(id), [common, id]);
  const event = useMemo(() => common?.events?.get(id), [common, id]);
  const exclusiveEvent = useMemo(
    () => common?.exclusiveEvents?.get(id),
    [common, id]
  );
  const level = useMemo(() => common?.levels?.get(id), [common, id]);
  const parentId = useMemo(() => common?.parentIds?.get(id), [common, id]);
  const currentIndex = useMemo(
    () => common?.currentIndexs?.get(id),
    [common, id]
  );
  const hot = useMemo(() => common?.hots?.get(id), [common, id]);
  const getHot = useMemoizedFn(key => common?.hots?.get(key));
  return {
    style,
    event,
    exclusiveEvent,
    level,
    parentId,
    currentIndex,
    hot,
    getHot
  };
}
