import { AxiosRequestConfig,AxiosResponse, AxiosPromise,Method,PromiseChain } from '../types'
import dispatchRequest from './dispatchRequest'
import InterceptorManager from './InterceptorManager'
import mergeConfig from './mergeConfig'
export default class Axios{
   interceptor:any
   defaults: AxiosRequestConfig
   constructor(initConfig:AxiosRequestConfig){
     this.defaults = initConfig;
     this.interceptor = {
       request: new InterceptorManager<AxiosRequestConfig>(),
       response: new InterceptorManager<AxiosResponse>()
     }
   }
   request<T = any>(url: any, config?: AxiosRequestConfig): AxiosPromise<T>{
     if(typeof url === 'string'){
       if(!config){
         config = {} as AxiosRequestConfig;
       }
       config.url = url;
     }else{
       config = url as AxiosRequestConfig;
     }
     config = mergeConfig(this.defaults,config); // 合并配置
     let chain = [{
       resolve:dispatchRequest,
       reject:undefined
     }];
     let promise = Promise.resolve(config);
     this.interceptor.request.forEach((interceptor:any)=>{
       chain.unshift(interceptor);
     })
     this.interceptor.response.forEach((interceptor:any)=>{
       chain.push(interceptor);
     })
     while(chain.length){
       let chainItem = chain.shift()!;
       promise = promise.then(chainItem.resolve,chainItem.reject);
     }
     return promise as  AxiosPromise<T>;
   }
   get<T>(url: string,config?: AxiosRequestConfig): AxiosPromise<T>{
     return this._requestMethodWithoutData<T>('get',url,config)
   }
   delete<T>(url: string,config?: AxiosRequestConfig): AxiosPromise<T>{
    return this._requestMethodWithoutData<T>('delete',url,config)
   }
   post<T>(url: string,data?: any,config?: AxiosRequestConfig): AxiosPromise<T>{
    return this._requestMethodWithData<T>('post',url,data,config)
   }
   _requestMethodWithoutData<T>(method: Method,url: string, config?: AxiosRequestConfig): AxiosPromise<T>{
     return this.request(Object.assign(
       config||{},{
         method,
         url
       }
     ));
  }
  _requestMethodWithData<T>(method: Method,url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>{
     return this.request(Object.assign(config||{},
       {
         method,
         url,
         data
       }))
  }
}
