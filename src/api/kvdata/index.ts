import config from "@/src/config";

import http from "../axios";
import { KVData } from "./typings";

export type * from "./typings";

const commonUrl = `/sp-portal/store/${config.storeCode}/config/kvdata`;

const getKvDataById = (id: string) => http.get<KVData>(`${commonUrl}/${id}`);

const getKvDataByType = (type: string) =>
  http.post<KVData[]>(`${commonUrl}/findType/${type}`);

export default { getKvDataById, getKvDataByType };
