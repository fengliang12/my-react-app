export type RecordQueryInitialState = {
  startTime: string;
  endTime: string;
  mobile: string;
  parentRegion: RecordQueryItem | null;
  region: RecordQueryItem | null;
  store: RecordQueryItem | null;
  point: RecordQueryItem | null;
};

export type RecordQueryItem = {
  label: string;
  value: string;
};
