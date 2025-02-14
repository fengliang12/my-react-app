import { transformRequest, transformResponse } from './helpers/data';
import { processHeaders } from './helpers/headers';
import { AxiosRequestConfig, Method } from './types/index';

const defaults: AxiosRequestConfig = {
  method: 'GET',
  timeout: 0,
  headers: {
    common: {
      Accept: 'application/json, text/plain, */*'
    }
  },
  transformRequest: [
    function (data: any, headers: any): any {
      processHeaders(headers, data);
      return transformRequest(data);
    }
  ],

  transformResponse: [
    function (data: any): any {
      return transformResponse(data);
    }
  ]
};
const methodsNoData: Array<Method> = [
  'DELETE',
  'GET',
  'HEAD',
  'OPTIONS',
  'TRACE'
];

methodsNoData.forEach(method => {
  const methodLower = method.toLowerCase();
  defaults.headers[methodLower] = {};
});

const methodsWithData: Array<Method> = ['POST', 'PUT', 'CONNECT'];

methodsWithData.forEach(method => {
  const methodLower = method.toLowerCase();
  defaults.headers[methodLower] = {};
});

export default defaults;
