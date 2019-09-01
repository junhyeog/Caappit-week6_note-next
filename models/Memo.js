var mongoose = require("mongoose");

// db에서 사용할 schema object를 생성 // 아래와 같은 형태로 db에 data가 저장됨
var memoSchema = mongoose.Schema({
  id:{type:String, required:true, unique:true}, // required: 반드시 입력되어야 한다, uique: 값이 중복되면 안된다.
  title:{type:String},
  text:{type:String}
});
// memo schema의 model 생성 ("데이터 collection의 이름", mongoose.Schema로 생성된 object)
// 생성된 memo object는 mongoDB의 memo collection의 model이며 DB에 접근하여 data를 변경할 수 있는 함수들을 가지고 있다.
// 현재 DB에 memo라는 콜렉션이 존재하지 않더라도 괜찮.
// 없는 콜렉션은 알아서 생성이 됩니다.
var Memo = mongoose.model("memo", memoSchema);

module.exports = Memo;