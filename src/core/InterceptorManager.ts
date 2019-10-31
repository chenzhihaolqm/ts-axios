import { ResolveFn, RejectFn,AxiosInterceptorManager } from '../types'
interface Interceptor<T>{
  resolve:ResolveFn<T>
  reject?:RejectFn
}
export default class InterceptorManager<T> implements AxiosInterceptorManager<T>{
  private interceptors:Array<Interceptor<T>|null> = [];
  use(resolve: ResolveFn<T>, reject: RejectFn): number {
    this.interceptors.push({
      resolve,
      reject
    })
    return this.interceptors.length - 1;
  }
  eject(n: number): void {
    if(this.interceptors[n]){
      this.interceptors[n] = null;
    }
  }
  forEach(fn:(interceptor:Interceptor<T>)=>void):void{
    this.interceptors.forEach((interceptor) =>{
      if(interceptor !== null){
        fn(interceptor);
      }
    });
 }

}
