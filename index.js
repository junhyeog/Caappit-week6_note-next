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
// stream의 form data를 req.body에 옮겨 담는다.
app.use(bodyParser.json()); // json data를 분석해서 req.data를 생성
app.use(bodyParser.urlencoded({extended:true})); // unlencoded data를 분석해서 req.data를 생성
app.use(methodOverride("_method")); // _method의 query로 들어오는 값으로 HTTP method를 바꾼다.
// 예를들어 http://example.com/category/id?_method=delete를 받으면 _method의 값인 delete을 읽어 해당 request의 HTTP method를 delete으로 바꾼다.

// DB schema // db에서 사용할 schema object를 생성 // 아래와 같은 형태로 db에 data가 저장됨
var memoSchema = mongoose.Schema({
    id:{type:String, required:true, unique:true}, // required: 반드시 입력되어야 한다, uique: 값이 중복되면 안된다.
    title:{type:String},
    text:{type:String}
  });
  // memo schema의 model 생성 ("데이터 collection의 이름", mongoose.Schema로 생성된 object)
  // 생성된 memo object는 mongoDB의 memo collection의 model이며 DB에 접근하여 data를 변경할 수 있는 함수들을 가지고 있다.
  // 현재 DB에 memo라는 콜렉션이 존재하지 않더라도 괜찮.
  // 없는 콜렉션은 알아서 생성이 됩니다.
  var memo = mongoose.model("memo", memoSchema);

// Routes
// Home // memos로 redirect
app.get("/", function(req, res){
    res.redirect("/memos");
  });

  // memos - Index 
  app.get("/memos", function(req, res){
    memo.find({}, function(err, memos){ // find 함수 
      if(err) return res.json(err);
      res.render("memos/index", {memos:memos}); // views/memos/index.ejs를 render
    });
  });

  // memos - New 
  app.get("/memos/new", function(req, res){
    res.render("memos/new");
  });
  // memos - create 
  app.post("/memos", function(req, res){
    memo.create(req.body, function(err, memo){
      if(err) return res.json(err);
      res.redirect("/memos");
    });
  });
// memos - show // 예를 들어 "memos/abcd1234"가 입력되면 "memos/:id" route에서 이를 받아 req.params.id에 "abcd1234"를 넣는다.
app.get("/memos/:id", function(req, res){
  memo.findOne({_id:req.params.id}, function(err, memo){
    if(err) return res.json(err);
    res.render("memos/show", {memo:memo});  });
});
/*
:id처럼 route에 콜론(:)을 사용하면 해당 위치의 값을 받아 req.params에 넣게 됩니다. 예를 들어 "contacts/abcd1234"가 입력되면 "contacts/:id" route에서 이를 받아 req.params.id에 "abcd1234"를 넣게 됩니다.

Model.findOne은 DB에서 해당 model의 document를 하나 찾는 함수입니다. 첫번째 parameter로 찾을 조건을 object로 입력하고 data를 찾은 후 콜백 함수를 호출합니다. Model.find와 비교해서 Model.find는 조건에 맞는 결과를 모두 찾아 array로 전달하는데 비해 Model.findOne은 조건에 맞는 결과를 하나 찾아 object로 전달합니다. (검색 결과가 없다면 null이 전달됩니다.)

위 경우에는 {_id:req.params.id}를 조건으로 전달하고 있는데, 즉 DB의 contacts collection에서 _id가 req.params.id와 일치하는 data를 찾는 조건입니다.

에러가 없다면 검색 결과를 받아 views/contacts/show.ejs를 render합니다.
*/
// memos - edit // findOne의 검색 결과를 받아 views/memos/edit.ejs를 render한다.
app.get("/memos/:id/edit", function(req, res){
  memo.findOne({_id:req.params.id}, function(err, memo){
    if(err) return res.json(err);    res.render("memos/edit", {memo:memo});  });
});
// memos - update //
app.put("/memos/:id", function(req, res){
  memo.findOneAndUpdate({_id:req.params.id}, req.body, function(err, memo){
    if(err) return res.json(err);    res.redirect("/memos/"+req.params.id);  });
});
/*
Model.findOneAndUpdate는 DB에서 해당 model의 document를 하나 찾아 그 data를 수정하는 함수입니다.
첫번째 parameter로 찾을 조건을 object로 입력하고 두번째 parameter로 update할 정보를 object로 입력data를 찾은 후 callback함수를 호출합니다.
이때 callback함수로 넘겨지는 값은 수정되기 전의 값입니다.
만약 업데이트 된 후의 값을 보고 싶다면 콜백 함수 전에 parameter로 {new:true}를 넣어주면 됩니다.
*/
// memos - destroy // Model.deleteOne은 DB에서 해당 model의 document를 하나 찾아 삭제하는 함수.
// 첫번째 parameter로 찾을 조건을 object로 입력하고 data를 찾은 후 callback함수를 호출.
// data 삭제 후 memos로 redirect한다.
app.delete("/memos/:id", function(req, res){
  memo.deleteOne({_id:req.params.id}, function(err, memo){
    if(err) return res.json(err);    res.redirect("/memos");  });
});
// Port setting
var port = 3000;
app.listen(3000, function(){
  console.log("server on! http://localhost:"+port);
});