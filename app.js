var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var lessMiddleware = require('less-middleware'); //less实时编译
var routes = require('./routes/index');
//var users = require('./routes/users');
var settings = require('./settings');
var flash = require('connect-flash');

//会话相关：
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
/*var session = require('express-session');
var MongoStore = require('connect-mongo')(session);*/

var app = express();
app.use(lessMiddleware('/less', {
  dest: '/stylesheets',
  pathRoot: path.join(__dirname, 'public')
}));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//修改为html为后缀
/*app.set('view engine', 'html');
app.engine('.html', require('ejs').__express);*/
app.use(flash());
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico'))); //****设置/public/favicon.ico为favicon图标
app.use(logger('dev')); // ****加载日志中间件。
app.use(bodyParser.json()); //****加载解析json的中间件
app.use(bodyParser.urlencoded({
  extended: false
})); // ***加载解析urlencoded请求体的中间件
app.use(cookieParser()); //****加载解析cookie的中间件。
app.use(express.static(path.join(__dirname, 'public')));


//会话相关
/*app.use(session({
  secret: settings.cookieSecret,
  key: settings.db,//cookie name
  resave:true,
  saveUninitialized: true,
  cookie: {maxAge: 1000 * 60 * 60 * 24 * 30},//30 days
  store: new MongoStore({
    url: 'mongodb://localhost/miniblog'
  })
}));*/
app.use(session({
  secret: settings.cookieSecret,
  resave: true,
  saveUninitialized: true,
  key: settings.db, //cookie name
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 30
  }, //30 days
  store: new MongoStore({
    db: settings.db,
    host: settings.host,
    port: settings.port
  })
}));
/*app.use('/', routes);
app.use('/users', users);*/

routes(app);

// catch 404 and forward to error handler 捕获404错误，并转发到错误处理器
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace    ****开发环境下的错误处理器，将错误信息渲染error模版并显示到浏览器中
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user ****生产环境下的错误处理器，不会将错误信息泄露给用户。
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;