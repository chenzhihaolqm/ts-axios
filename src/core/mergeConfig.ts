import {AxiosRequestConfig} from '../types'
import {deepMerge} from '../helper/util'

const strats = Object.create(null);
export default function mergeConfig(config1: AxiosRequestConfig, config2?: AxiosRequestConfig): AxiosRequestConfig{
  const config:AxiosRequestConfig = Object.create(null);
  if (!config2) {
    config2 = {};
  }
  for(let key in config2) {
    mergeField(key)
  }
  for(let key in config1) {
    if(!config2[key]) {
      mergeField(key)
    }
  }
  function mergeField(key:string) :void{
    const strat = strats[key] || defaultStrat;
    config[key] = strat(config1[key], config2![key]);
  }
  return config;
}


function defaultStrat(val1: any,val2: any): any{
  return typeof val2 !== 'undefined' ? val2 : val1;
}

function fromVal2Strat(val1:any, val2:any): any{
  if(val2) {
    return val2;
  }
}
const stratKeysFromVal2 = ['url', 'params', 'data']
stratKeysFromVal2.forEach((key) => {
  strats[key] = fromVal2Strat;
})

const stratKeysDeepMerge = ['headers']
stratKeysDeepMerge.forEach((key) => {
  strats[key] = deepMerge
})

