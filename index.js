var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
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

// DB schema // db에서 사용할 schema object를 생성 // 아래와 같은 형태로 db에 data가 저장됨
var contactSchema = mongoose.Schema({
    id:{type:String, required:true, unique:true}, // required: 반드시 입력되어야 한다, uique: 값이 중복되면 안된다.
    title:{type:String},
    text:{type:String}
  });
  // contact schema의 model 생성 ("데이터 collection의 이름", mongoose.Schema로 생성된 object)
  // 생성된 Contact object는 mongoDB의 contact collection의 model이며 DB에 접근하여 data를 변경할 수 있는 함수들을 가지고 있다.
  // 현재 DB에 contact라는 콜렉션이 존재하지 않더라도 괜찮.
  // 없는 콜렉션은 알아서 생성이 됩니다.
  var Contact = mongoose.model("contact", contactSchema);

// Routes
// Home // contacts로 redirect
app.get("/", function(req, res){
    res.redirect("/contacts");
  });

  // Contacts - Index // 7
  app.get("/contacts", function(req, res){
    Contact.find({}, function(err, contacts){ // find 함수 
      if(err) return res.json(err);
      res.render("contacts/index", {contacts:contacts}); // views/contacts/index.ejs를 render
    });
  });

  // Contacts - New // 8
  app.get("/contacts/new", function(req, res){
    res.render("contacts/new");
  });
  // Contacts - create // 9
  app.post("/contacts", function(req, res){
    Contact.create(req.body, function(err, contact){
      if(err) return res.json(err);
      res.redirect("/contacts");
    });
  });

// Port setting
var port = 3000;
app.listen(3000, function(){
  console.log("server on! http://localhost:"+port);
});