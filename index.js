var express = require("express");
var mongoose = require("mongoose");
var app = express();

// DB setting
mongoose.set('useNewUrlParser', true);    // mongoose 경고 안나게
mongoose.set('useFindAndModify', false);  // mongoose 경고 안나게
mongoose.set('useCreateIndex', true);     // mongoose 경고 안나게
//mongoose.connect(process.env); // 2
mongoose.connect("mongodb+srv://test_user:test_password@cluster0-kgspa.mongodb.net/test?retryWrites=true&w=majority")
var db = mongoose.connection; 
// db 연결 성공
db.once("open", function(){
  console.log("DB connected");
});
// db 사용 중 오류
db.on("error", function(err){
  console.log("DB ERROR : ", err);
});

// Other settings
app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));

// Port setting
var port = 3000;
app.listen(3000, function(){
  console.log("server on! http://localhost:"+port);
});