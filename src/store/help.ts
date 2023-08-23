import produce from "immer";

export function createReducer(cases: any = {}, defaultState: any) {
  return (state = defaultState, action: any) =>
    produce(state, (draft: any) => {
      if (action && action.type && cases[action.type] instanceof Function) {
        cases[action.type](draft, action);
      }
    });
}
