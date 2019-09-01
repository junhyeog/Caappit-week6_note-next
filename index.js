var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var app = express();

// DB setting
mongoose.set('useNewUrlParser', true);    // mongoose 경고 안나게
mongoose.set('useFindAndModify', false);  // mongoose 경고 안나게
mongoose.set('useCreateIndex', true);     // mongoose 경고 안나게
mongoose.connect("mongodb+srv://test_user:test_password@cluster0-kgspa.mongodb.net/test?retryWrites=true&w=majority")
var db = mongoose.connection;
// db 연결 성공
db.once("open", function () {
  console.log("DB connected");
});
// db 사용 중 오류
db.on("error", function (err) {
  console.log("DB ERROR : ", err);
});

// Other settings
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
// stream의 form data를 req.body에 옮겨 담는다.
app.use(bodyParser.json()); // json data를 분석해서 req.data를 생성
app.use(bodyParser.urlencoded({ extended: true })); // unlencoded data를 분석해서 req.data를 생성
app.use(methodOverride("_method")); // _method의 query로 들어오는 값으로 HTTP method를 바꾼다.
// 예를들어 http://example.com/category/id?_method=delete를 받으면 _method의 값인 delete을 읽어 해당 request의 HTTP method를 delete으로 바꾼다.

// DB schema
// DB schema는 route안에서만 사용되기 때문에 index.js에서는 require를 하지 않고, 해당 route안에서 require 된다.

// Routes
// 분리된 routes은 index.js의 app.use 안에서 직접 require를 한다.
app.use("/", require("./routes/home")); 
app.use("/memos", require("./routes/memos"));

// Port setting
var port = 3000;
app.listen(3000, function () {
  console.log("server on! http://localhost:" + port);
});