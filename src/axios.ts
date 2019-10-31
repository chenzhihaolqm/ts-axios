import {AxiosRequestConfig,AxiosResponse,AxiosStatic} from './types/index'
import Axios from './core/Axios'
import {extend} from './helper/util'
import defaults from './defaults'
import mergeConfig from './core/mergeConfig'
import CancelToken from './cancel/CancelToken'
import Cancel, {isCancel} from './cancel/Cancel'

function createInstance(config: AxiosRequestConfig): AxiosStatic{
   let instance = new Axios(config);
/*   instance.interceptor.request.use((config:AxiosRequestConfig)=>{
     config.headers = config.headers || {};
     config.headers.test += '1'
     return config;
    })
  instance.interceptor.request.use((config:AxiosRequestConfig)=>{
    config.headers = config.headers || {};
    config.headers.test = '2'
    return new Promise((resolve) =>{
      setTimeout(() =>{
        resolve(config)
      },1000);
    });
  })*/
/*   instance.interceptor.response.use((res:AxiosResponse)=>{
     res.data.test = 'one'
     return res;
   })
  instance.interceptor.response.use((res:AxiosResponse)=>{
    res.data.test += 'two'
    return res;
  })*/
   let request = Axios.prototype.request.bind(instance);
   extend(request,instance);
   return request as AxiosStatic;
}
const axios = createInstance(defaults);
axios.create = function(config: AxiosRequestConfig) {
  return createInstance(mergeConfig(defaults, config));
}
axios.cancelToken = CancelToken;
axios.cancel = Cancel;
axios.isCancel = isCancel;
export default axios

/*
import { AxiosRequestConfig, AxiosResponse } from './types'
import {buildURL} from './helper/url'
import {transformRequest, transformResponse} from './helper/data'
import {processHeaders} from './helper/header'
import xhr from './xhr'
function axios(config: AxiosRequestConfig){
  processConfig(config);
  return xhr(config).then((res) => {
    return transformResponseData(res);
  }).catch((e) => {
    return Promise.reject(e);
  });
}
function processConfig(config: AxiosRequestConfig): void{
  config.url = transformUrl(config);
  config.headers = transformRequestHeader(config);
  config.data = transformRequestData(config);
}
function transformUrl(config: AxiosRequestConfig): string{
  let {url,params} = config;
  return buildURL(url,params);
}
function transformRequestData(config: AxiosRequestConfig): string{
  return transformRequest(config.data);
}
function transformRequestHeader(config: AxiosRequestConfig): string{
  return processHeaders(config.headers,config.data);
}
function transformResponseData(res: AxiosResponse): AxiosResponse{
  res.data = transformResponse(res.data)
  return res;
}

export default axios

*/
