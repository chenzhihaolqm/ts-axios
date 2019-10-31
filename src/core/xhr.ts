import {AxiosRequestConfig,AxiosResponse,AxiosPromise} from '../types'
import {parseHeaders} from '../helper/header'
import {createError} from '../helper/error'
import {isURLSameOrigin} from '../helper/url'
import  cookie from '../helper/cookie'


export default function xhr<T>(config:AxiosRequestConfig): AxiosPromise<T>{
  return new Promise((resolve,reject) => {
    const {data = null ,url = '',method = 'get',headers={},timeout = 0, cancelToken, withCredentials,
      xsrfCookieName, xsrfHeaderName} = config;
    const request = new XMLHttpRequest();
    request.open(method.toUpperCase(),url,true);
    Object.keys(headers).forEach((name) => {
      if(data === null && name.toLowerCase() === 'content-type'){
        delete headers[name]
      }else{
        request.setRequestHeader(name, headers[name])
      }
    })
    if(withCredentials) {
      request.withCredentials = true;
    }
    if((withCredentials || isURLSameOrigin(url)) && xsrfCookieName && xsrfHeaderName){
      const xsrfValue = cookie.read(xsrfCookieName);
      if(xsrfValue) {
        request.setRequestHeader(xsrfHeaderName, xsrfValue)
      }
    }
    request.onreadystatechange = function handleLoad(){
      if(request.readyState !== 4){
        return;
      }
      if(request.status === 0){
        return;
      }
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
    if(cancelToken) {
      cancelToken.promise.then((reason) => {
        request.abort();
        reject(reason);
      })
    }
  });
}
