export type Method = 'get'|'GET'|'delete'|'Delete'|'head'|'HEAD'|'options'|'OPTIONS'|'post'|'POST'
|'put'|'PUT'
|'patch'|'PATCH'
export interface AxiosTransformer {
  (data: any, header?: any): any
}
export interface AxiosRequestConfig{
  url?: string
  method ?: Method
  data ?: any
  params ?: any
  headers ?: any
  timeout ?:number
  transformRequest?: AxiosTransformer | AxiosTransformer[]
  transformResponse?: AxiosTransformer | AxiosTransformer[]
  cancelToken?: CancelToken
  withCredentials?: boolean
  xsrfCookieName?: string
  xsrfHeaderName?: string
  onDownloadProgress?: (e: ProgressEvent) => void
  onUploadProgress?: (e: ProgressEvent) => void
  [propName: string]: any
}

export interface AxiosResponse<T = any>{
  data:T,
  status:number,
  statusText:string,
  config:AxiosRequestConfig,
  headers:any,
  request:any
}
export interface AxiosPromise<T> extends Promise<AxiosResponse<T>>{

}

export interface AxiosError extends Error{
  config: AxiosRequestConfig
  code?: string
  request?: any
  response?: AxiosResponse
  isAxiosError: boolean
}

export interface Interceptor {
  request?: any,
  response?: any
}

export interface Axios{
  defaults: AxiosRequestConfig
  interceptor: Interceptor
  request<T = any>(url:any,config?: AxiosRequestConfig):  AxiosPromise<T>
  get<T = any>(url: string, config?: AxiosRequestConfig):  AxiosPromise<T>
  post<U = any>(url: string, data?: any, config?: AxiosRequestConfig):  AxiosPromise<U>
}

export interface AxiosInstance extends Axios{
  <T = any>(config: AxiosRequestConfig):  AxiosPromise<T>
  <T = any>(url:string, config?: AxiosRequestConfig):  AxiosPromise<T>
}

export interface AxiosStatic extends AxiosInstance{
  create(config?: AxiosRequestConfig): AxiosInstance
  cancelToken: CancelTokenStatic
  cancel: CancelStatic
  isCancel: (value:any) => boolean
}

export interface AxiosInterceptorManager<T>{
  use(resolve:ResolveFn<T>,reject:RejectFn) : number
  eject(n:number):void
}

export interface ResolveFn<T>{
  (val:T):(T|Promise<T>)
}
export interface RejectFn{
  (error:any):any
}

export interface PromiseChain<T = any> {
  resolved: ResolveFn<T> | ((config: AxiosRequestConfig) => AxiosPromise<T>)
  rejected?: RejectFn
}

export interface Canceler{
  (message?: string): void
}

export interface CancelExecutor{
  (cancel: Canceler): void
}

export interface CancelToken{
  promise: Promise<string>,
  reason?: string
  throwIfRequested(): void
}

export interface CancelTokenSource{
  token: CancelToken
  cancel: Canceler
}

export interface CancelTokenStatic{
  new(executor: CancelExecutor): CancelToken
  source() : CancelTokenSource
}

export interface Cancel{
  message?: string
}

export interface CancelStatic{
  new(message?: string): Cancel
}

