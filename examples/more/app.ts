import axios  from '../../src/index';
import NProgress = require('nprogress');

/*------------------------------cookie && xsrf ----- begin-------------------------------*/
document.cookie = 'a=b';
axios.get('/more/get').then(function(res) {
  console.log(res);
});
axios.post('http://localhost:8082/more/server2', {}, {
  headers: {
    'X-XSRF-TOKEN-D': "1234abc"
  },
  withCredentials: true
}).then(function(res) {
  console.log(res);
});
/*------------------------------cookie && xsrf ----- end-------------------------------*/


/*------------------------------progress----- begin-------------------------------*/
const instance = axios.create();
function loadProgress() {
  const setupStartProgress = function() {
    instance.interceptor.request.use();
  }
}


/*------------------------------progress----- end---------------------------------*/
