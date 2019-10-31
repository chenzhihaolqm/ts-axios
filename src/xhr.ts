import {AxiosRequestConfig,AxiosResponse,AxiosPromise} from './types'
import {parseHeaders} from './helper/header'
import {createError} from './helper/error'
import {isFormData} from './helper/util'


export default function xhr(config:AxiosRequestConfig): AxiosPromise<any>{
  return new Promise((resolve,reject) => {
    const {data = null ,url = '',method = 'get',headers={},timeout = 0,onDownloadProgress,onUploadProgress} = config;
    const request = new XMLHttpRequest();
    request.open(method.toUpperCase(),url,true);
    Object.keys(headers).forEach((name) => {
      if(data === null && name.toLowerCase() === 'content-type'){
        delete headers[name]
      }else{
        request.setRequestHeader(name, headers[name])
      }
    })
    if(isFormData(data)){
      delete headers['Content-Type']
    }
    request.onreadystatechange = function handleLoad(){
      if(request.readyState !== 4){
        return;
      }
      if(request.status === 0){
        return;
      }
      console.log('stateChange');
      const respondHeader = parseHeaders(request.getAllResponseHeaders());
      const respondData = request.response || request.responseText;
      const res: AxiosResponse = {
        data:respondData,
        status:request.status,
        statusText:request.statusText,
        headers:respondHeader,
        config,
        request
      }
      handleResponse(res);
      function handleResponse(response:AxiosResponse){
        if(!(response.status >= 200 && response.status <= 300)){
          reject(createError(`Request failed with status code ${response.status}`,
                 config,request.status,request,response));
        }else{
          resolve(response);
        }
      }
    }
    if(onDownloadProgress){
      request.onprogress = onDownloadProgress;
    }
    if(onUploadProgress){
      request.upload.onprogress = onUploadProgress;
    }
    request.timeout = timeout;
    request.ontimeout = function handleTimeoutError(){
      console.log('timeout');
      reject(createError('Timeout Error',
        config,999,request));
      // reject(new Error('Timeout Error'));
    }
    request.onerror = function handleError(){
      reject(createError('Network Error',
        config,998,request));
      // reject(new Error('Network Error'));
    }
    request.send(data);
  });
}
