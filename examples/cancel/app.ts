import axios, {Canceler} from '../../src/index'

const cancelToken = axios.cancelToken;
const source = cancelToken.source();

axios.get('/cancel/get',{
   cancelToken: source.token
}).catch(function(e) {
  if (axios.isCancel(e)) {
    console.log('Request canceled', e.message)
  }
})

setTimeout(function() {
  source.cancel('cancel by the user');
  axios.post('/cancel/post',{
    cancelToken: source.token,
    data: { a : 1 }
  }).catch(function (e) {
    if (axios.isCancel(e)) {
      console.log('Request post canceled', e.message)
    }
  })
},100)

let cancel: Canceler;

axios.get('/cancel/get',{
  cancelToken: new cancelToken((c) => {
    cancel = c;
  })
}).catch(function(e){
  if (axios.isCancel(e)) {
    console.log('Request again canceled', e.message)
  }
});
setTimeout(function(){
  cancel();
},200)
