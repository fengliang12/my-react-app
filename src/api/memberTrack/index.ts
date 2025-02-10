import config from "src/config";

import { pageTrackRecord } from "@/src/model/api/memeberTrack";

import http from "../axios";

const { storeCode } = config;

const url = `/member-track/${storeCode}/mini`;

const pageTrack: pageTrackRecord.FuncT = (data) =>
  http.post(`${url}/page`, data);

export default { pageTrack };
