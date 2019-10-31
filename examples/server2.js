const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const webpack = require('webpack');
const path = require('path')

const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const WebpackConfig = require('./webpack.config');
const compiler = webpack(WebpackConfig)
const app = new express();
const router = express.Router();
app.use(webpackDevMiddleware(compiler, {
  publicPath: '/__build__/',
  stats: {
    colors: true,
    chunks: false
  }
}))

app.use(webpackHotMiddleware(compiler))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
const cors = {
  'Access-Control-Allow-Origin' : 'http://localhost:8081',
  'Access-Control-Allow-Credentials': true,
  'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type,x-xsrf-token-d'
};
app.use(express.static(path.join(__dirname, ''), {
  setHeaders (res) {
    res.cookie('XSRF-TOKEN-D', '1234abc')
  }
}))
router.post('/more/server2', function(req, res) {
  console.log(req.cookies);
  res.set(cors);
  if(req.headers['x-xsrf-token-d'] === '1234abc') {
    res.json({
      cookies: req.cookies
    });
  }else {
    res.json({
      err: '访问异常'
    });
  }
});
router.options('/more/server2', function(req, res) {
  res.set(cors);
  res.end()
})

app.use(router);
const port = 8082;
module.defaults = app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}, Ctrl+C to stop`)
})
