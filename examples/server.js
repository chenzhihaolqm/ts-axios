const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const WebpackConfig = require('./webpack.config')

const app = express()
const compiler = webpack(WebpackConfig)

app.use(webpackDevMiddleware(compiler, {
  publicPath: '/__build__/',
  stats: {
    colors: true,
    chunks: false
  }
}))

app.use(webpackHotMiddleware(compiler))

app.use(express.static(__dirname))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser());


const router = express.Router()

router.get('/simple/get', function(req, res) {
  res.json({
    msg: `hello world`
  })
})

router.get('/base/get', function(req, res) {
  res.json({
    query:req.query
  })
})

router.post('/base/post', function(req, res) {
  res.json(req.body)
})

router.post('/base/buffer', function(req, res) {
  let msg = []
  req.on('data', (chunk) => {
    if (chunk) {
      msg.push(chunk)
    }
  })
  req.on('end', () => {
    console.log('msg',msg);
    let buf = Buffer.concat(msg)
    res.json(buf.toJSON())
  })
})

router.get('/error/get', function(req, res) {
  if(Math.random() >1){
    res.json({
      msg: 'hello world'
    })
  }else{
    res.status(500);
    res.end();
  }
})

router.get('/error/timeout', function(req, res){
  setTimeout(() => {
    res.json({
      successTimeout:true
    });
  },3000)
})

router.get('/extend/get', function(req, res) {
  res.json({
    msg: 'extend get Success'
  })
})
router.post('/extend/post', function(req, res) {
  res.json({
    data: req.body
  })
})

router.get('/extend/user', function(req, res) {
  res.json({
    data: {name:'Jack',age:'20'}
  })
})

router.post('/config/post', function(req, res) {
  res.json({
    data: {name:'Marry',age:'22'}
  })
})

router.get('/cancel/get', function(req, res) {
  setTimeout(() => {
    res.json({
      data: {name:'Jack',age:'20'}
    })
  },1000)
})

router.post('/cancel/post', function(req, res) {
  setTimeout(() => {
    res.json({
      data: {name:'Jack',age:'20'}
    })
  },1000)
})

router.get('/more/get', function(req, res) {
  res.cookie('c', 'd')
  console.log(req.cookies);
  res.json({
      cookies: req.cookies
  });
});

app.use(router)

const port = process.env.PORT || 8081
module.exports = app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}, Ctrl+C to stop`)
})
