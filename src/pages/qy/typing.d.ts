export type RecordQueryInitialState = {
  startTime: string;
  endTime: string;
  mobile: string;
  bigRegion: RecordQueryItem | null;
  smallRegion: RecordQueryItem | null;
  store: RecordQueryItem | null;
  point: { value: string; label: string } | null;
};

export type InitialStateType = Pick<
  RecordQueryInitialState,
  "bigRegion" | "smallRegion" | "store"
>;

export type RecordQueryItem = {
  name: string;
  id: string;
  code?: string;
};
