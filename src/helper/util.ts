let toString = Object.prototype.toString;

export function isDate(val : any):boolean{
  return toString.call(val) === '[object Date]';
}

export function isObject(val : any):boolean{
  return  toString.call(val) === '[object Object]'
}

export function isFormData(val : any): boolean{
  return val !== undefined && val instanceof FormData
}

export function extend<T, U>(to: T, from: U): T & U {
  for (const key in from) {
    ;(to as T & U)[key] = from[key] as any
  }
  return to as  T & U
}

export function deepMerge(...objs : any[]):any {
  const result = Object.create(null);
  objs.forEach((obj) => {
    if(obj) {
      Object.keys(obj).forEach((key) => {
        if( typeof result[key] === 'object' && typeof obj[key] === 'object'){
          result[key] = deepMerge(result[key],obj[key])
        }else if(typeof obj[key] === 'object') {
          result[key] = deepMerge(obj[key]);
        }else{
          result[key] = obj[key];
        }
      });
    }
  });
  return result;
}
