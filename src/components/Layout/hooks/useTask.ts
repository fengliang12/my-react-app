import { forOwn, isFunction } from "lodash-es";
import { useMemoizedFn, useUpdateEffect } from "ahooks";
import { useRef } from "react";
import usePage from "./usePage";

export default function useTask() {
  const { isNowPage } = usePage();
  const taskListRef = useRef<any>([]);
  const clearRef = useRef<any>({});
  const initTask = useMemoizedFn(tasks => {
    taskListRef.current = tasks;
    tasks?.forEach(({ func, params, timer }, index) => {
      const fn = () => {
        if (isFunction(func)) {
          func(...params);
        }
        clearRef.current[`task${index}`] = setTimeout(fn, timer);
      };
      clearRef.current[`task${index}`] = setTimeout(fn, timer);
    });
  });
  const addTask = useMemoizedFn(({ func, params, timer }) => {
    const index = taskListRef.current.length;
    const fn = () => {
      if (isFunction(func)) {
        func(...params);
      }
      clearRef.current[`task${index}`] = setTimeout(fn, timer);
    };
    clearRef.current[`task${index}`] = setTimeout(fn, timer);
  });
  useUpdateEffect(() => {
    if (!isNowPage) {
      forOwn(clearRef.current, function(value, key) {
        if (value) {
          clearTimeout(value);
          clearRef.current[key] = null;
        }
      });
    }
    if (isNowPage) {
      forOwn(clearRef.current, function(value) {
        if (!value) {
          initTask(taskListRef.current);
        }
      });
    }
  }, [isNowPage]);
  return {
    initTask,
    addTask
  };
}
