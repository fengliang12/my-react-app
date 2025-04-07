import { freeze, produce } from "immer";
import { useCallback, useState } from "react";

type initialState<T> = T | (() => T);

export type DraftFunction<S> = (draft: S) => void;
export type Updater<S> = (arg: S | DraftFunction<S>) => void;
export type ImmerHook<S> = [state: S, update: Updater<S>];

export type useImmerType = <T>(initialState: initialState<T>) => ImmerHook<T>;

export const useImmer = <T>(initialState: T) => {
  const [state, setState] = useState(() => {
    freeze(
      typeof initialState === "function" ? initialState() : initialState,
      true,
    );
  });
  const handleUpdate = useCallback((newState) => {
    if (typeof newState === "function") setState(produce(newState));
    else setState(freeze(newState));
  }, []);

  return [state, handleUpdate];
};
