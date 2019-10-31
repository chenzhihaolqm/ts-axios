import axios,{AxiosError} from '../../src/index';
axios({
  method: 'get',
  url: '/error/get',
  params: {
    foo: ['bar', 'baz']
  }
}).then((res)=> {
//
}).catch((e: AxiosError) => {
  console.log(e);
});

axios({
  method: 'get',
  url: '/error/timeout',
  timeout:2000,
}).then((res)=>{
  debugger
}).catch((e: AxiosError) => {
  console.log(e);
});
