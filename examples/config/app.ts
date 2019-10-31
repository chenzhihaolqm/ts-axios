import axios, { AxiosTransformer } from '../../src/index'
import qs from 'qs';
axios.defaults.headers.common['test'] = 'commonTest';
axios.defaults.headers.post['test'] ='postTest';
axios.defaults.headers.get['getTest'] = 'getTest';
/*axios({
  url: '/config/post',
  method: 'post',
  data: qs.stringify({
    a: 1
  }),
  headers:{
    test2: 321
  }
}).then((res) =>{
  console.log(res);
})
  axios({
    url: '/config/post',
    method: 'post',
    data: {
      a :1
    },
    transformRequest: [...(axios.defaults.transformRequest as AxiosTransformer[])],
    transformResponse: [...(axios.defaults.transformResponse as AxiosTransformer[]), function(data) {
      if(typeof data === 'object'){
        data.b = 2;
      }
      return data;
    }]
  }).then((res) => {
    console.log(res);
  })*/

const instance = axios.create({
  transformRequest: [(function(data, headers) {
    headers.post = {test: 'new Val'}
    return qs.stringify(data)
  }), ...(axios.defaults.transformRequest as AxiosTransformer[])],
  transformResponse: [...(axios.defaults.transformResponse as AxiosTransformer[]), function(data) {
    if (typeof data === 'object') {
      data.b = 2
    }
    return data
  }]
})

instance({
  url: '/config/post',
  method: 'post',
  data: {
    a: 1
  }
})

instance({
  method: 'get',
  url: '/base/get?foo=bar',
  params: {
    bar: 'baz'
  }
})
