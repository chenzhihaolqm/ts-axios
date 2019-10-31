import axios  from '../../src/index';
interface User{
  name:string
  age:number
}

function getUser<T>(){
  return axios.get<T>('/extend/user',{
    params:{}
  }).then((res) => {
    return res.data
  })
}
async function  testGetUser(){
  let user:User = await getUser<User>();
  console.log(user)
}
testGetUser();
console.log('------------test--------------');

axios({
  url: '/extend/post',
  method: 'post',
  data: {
    msg: 'hi'
  }
}).then((res) => {
  console.log(res)
})

axios.request({
  url: '/extend/post',
  method: 'post',
  data: {
    msg: 'hello'
  }
})

axios.request('/extend/post',{
  method:'post',
  data:{
    msg:'request reload By Two params'
  }
})


axios.get('/extend/get')
