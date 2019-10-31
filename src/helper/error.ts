import { AxiosRequestConfig, AxiosResponse } from '../types'

export class AxiosError extends Error{
  isAxiosError: boolean
  config: AxiosRequestConfig
  request?: any
  code ?: number
  response?: AxiosResponse
  constructor(
    message:string,
    config: AxiosRequestConfig,
    code ?: number,
    request?: any,
    response?: AxiosResponse
  ){
     super(message);
     this.config = config;
     this.code = code;
     this.request = request;
     this.response = response;
     this.isAxiosError = true;
  }
}
export function createError(
  message:string,
  config: AxiosRequestConfig,
  code ?: number,
  request?: any,
  response?: AxiosResponse
): AxiosError{
  return new AxiosError(message,config,code,request,response);
}
