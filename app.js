var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const {decodeToken} = require('./utils/token');
var adminRouter = require('./routes/admin/index');
var appRouter = require('./routes/app');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// 将jwt解析还原成json字符串的中间件，只要配置成功，就可以把解析出来的用户信息挂载到req.user属性上
app.use(decodeToken());

app.use('/admin', adminRouter);
app.use('/app', appRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
// error handler
app.use(function(err, req, res, next) {
  // 判断token是否失效
  if (err.name === "UnauthorizedError") {
    res.json({
      code:50014,
      message: "登录过期",
      data:null,
    })
  } else {
    res.status(500);
  }
});

module.exports = app;
