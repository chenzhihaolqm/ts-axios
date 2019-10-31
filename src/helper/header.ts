import {Method} from '../types'
import {isObject,deepMerge} from './util'
function normalizeHeaderName(headers: any, normalizeName: string){
  if(!headers){
    return;
  }
  Object.keys(headers).forEach((name) => {
    if(name !== normalizeName && name.toLowerCase() === normalizeName.toLowerCase() ){
      headers[normalizeName] = headers[name];
      delete headers[name];
    }
  })
}

export function processHeaders(headers:any = {}, data: any): any{
  normalizeHeaderName(headers,'Content-Type');
  if(isObject(data)){
    if(headers && !headers['Content-Type']){
      headers['Content-Type'] = 'application/json;charset=utf-8';
    }
  }
  return headers;
}

export function parseHeaders(headers: string): any{
  let parsed = Object.create(null);
  if(!headers){
    return parsed;
  }
  headers.split('\r\n').forEach((header) => {
    let [key,val] = header.split(':');
    key = key.trim();
    if(!key){
      return;
    }
    parsed[key] = val.trim();
  })
  return parsed;
}
export function flattenHeader(headers: any, method: Method) {
   if(!headers) {
     headers = {};
   }
  headers = deepMerge(headers.common || {},headers[method] || {}, headers)
  const methodsToDelete = ['post','get','delete','head','options','put','patch','common'];
  methodsToDelete.forEach((method) => {
    delete headers[method];
  })
  return headers;
}
