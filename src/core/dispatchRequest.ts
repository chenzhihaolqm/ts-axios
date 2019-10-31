import { AxiosRequestConfig, AxiosResponse,AxiosError } from '../types'
import {buildURL} from '../helper/url'
import {transformRequest, transformResponse} from '../helper/data'
import transform from './transform'
import {processHeaders, flattenHeader} from '../helper/header'
import xhr from './xhr'
function dispatchRequest<T>(config: AxiosRequestConfig){
  throwIfCancellationRequested(config);
  processConfig(config);
  return xhr<T>(config).then((res:AxiosResponse) => {
    return transformResponseData(res);
  }).catch((e:AxiosError) => {
    return Promise.reject(e);
  });
}
function throwIfCancellationRequested(config: AxiosRequestConfig): void{
  if(config.cancelToken){
    config.cancelToken.throwIfRequested();
  }
}
function processConfig(config: AxiosRequestConfig): void{
  config.url = transformUrl(config);
 // config.headers = transformRequestHeader(config);
  config.data = transformRequestData(config);
  config.headers = flattenHeader(config.headers, config.method!)
}
function transformUrl(config: AxiosRequestConfig): string{
  let {url = '',params} = config;
  return buildURL(url,params);
}
function transformRequestData(config: AxiosRequestConfig): string{
  return transform(config.data,config.headers, config.transformRequest);
}
function transformRequestHeader(config: AxiosRequestConfig): string{
  const headers =processHeaders(config.headers,config.data);
  return flattenHeader(headers, config.method!);
}
function transformResponseData(res: AxiosResponse): AxiosResponse{
  res.data = transform(res.data,res.headers,res.config.transformResponse)
  return res;
}

export default dispatchRequest

