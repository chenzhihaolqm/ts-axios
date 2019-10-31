import {isDate, isObject} from './util'

interface URLOrigin {
  protocol: string
  host: string
}

function encode(val: string): string{
  return encodeURIComponent(val)
    .replace(/%40/g,'@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']')
}

export function buildURL(url: string,params?: any): string{
  if(!params){
    return url;
  }
  let parts: string[] = [];
  Object.keys(params).forEach((key) => {
    let val = params[key];
    if (val === null || val === undefined) {
      return;
    }
    let values: any[];
    if (Array.isArray(val)) {
      values = val;
      key += '[]';
    } else {
      values = [val];
    }
    values.forEach((item) => {
        if (isDate(item)) {
          item = item.toISOString();
        } else if (isObject(item)) {
          item = JSON.stringify(item);
        }
        parts.push(`${encode(key)}=${encode(item)}`);
      }
    )
  })
  let serializedParams = parts.join('&');
  if(serializedParams){
     let markIndex = url.indexOf('#');
     if(markIndex >= 0){
       url = url.substring(0,markIndex);
     }
     url += (url.indexOf('?') >= 0 ? '&': '?') + serializedParams;
  }
  return url;
}

export function isURLSameOrigin(requestURL: string):boolean {
  const urlParsingNode  = document.createElement('a')
  const currentOrigin = resolveUrl(window.location.href);
  const parsedOrigin =  resolveUrl(requestURL);
  return (parsedOrigin.protocol === currentOrigin.protocol && parsedOrigin.host === currentOrigin.host);
  function resolveUrl(url: string): URLOrigin{
    urlParsingNode.setAttribute('href', url);
    const { protocol, host } = urlParsingNode;
    return {protocol, host};
  }
}
