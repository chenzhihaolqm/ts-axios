import {CancelExecutor,Canceler} from '../types'

interface PromiseResolve{
  (message?: any): void
}

export default class CancelToken{
  promise: Promise<string>
  reason?: string

  constructor(executor: CancelExecutor) {
    let promiseResolve: PromiseResolve;
    this.promise = new Promise<string>(function(resolve) {
      promiseResolve = resolve;
    })
    executor((message) =>{
      if(this.reason) {
        return;
      }
      this.reason = message;
      promiseResolve(this.reason);
    });
  }
  throwIfRequested(): void{
    if(this.reason) {
      throw this.reason;
    }
  }

  static source() {
    let cancel!:Canceler;
    const token = new CancelToken((c) => {
      cancel = c;
    });
    return {
      token,
      cancel
    }
  }
}
