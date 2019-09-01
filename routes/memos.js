var express = require("express");
var router = express.Router();
var Memo = require("../models/Memo"); // memo.js에는 Memo module을 require로 호출

/*
index.js에서
app.use("/memos", require("./routes/memos"));
로 이미 "/memos"인 경우에만 이 module이 호출되기 때문에
route 문자열에서 memos가 빠짐
*/

// Index
router.get("/", function (req, res) {
    Memo.find({}, function (err, memos) { // find 함수 
        if (err) return res.json(err);
        res.render("memos/index", { memos: memos }); // views/memos/index.ejs를 render
    });
});

// New 
router.get("/new", function (req, res) {
    res.render("memos/new");
});

// create 
router.post("/", function (req, res) {
    Memo.create(req.body, function (err, memo) {
        if (err) return res.json(err);
        res.redirect("/memos");
    });
});
// show
router.get("/:id", function (req, res) {
    Memo.findOne({ _id: req.params.id }, function (err, memo) {
        if (err) return res.json(err);
        res.render("memos/show", { memo: memo });
    });
});
/*
:id처럼 route에 콜론(:)을 사용하면 해당 위치의 값을 받아 req.params에 넣게 됩니다. 예를 들어 "contacts/abcd1234"가 입력되면 "contacts/:id" route에서 이를 받아 req.params.id에 "abcd1234"를 넣게 됩니다.
 
Model.findOne은 DB에서 해당 model의 document를 하나 찾는 함수입니다. 첫번째 parameter로 찾을 조건을 object로 입력하고 data를 찾은 후 콜백 함수를 호출합니다. Model.find와 비교해서 Model.find는 조건에 맞는 결과를 모두 찾아 array로 전달하는데 비해 Model.findOne은 조건에 맞는 결과를 하나 찾아 object로 전달합니다. (검색 결과가 없다면 null이 전달됩니다.)
 
위 경우에는 {_id:req.params.id}를 조건으로 전달하고 있는데, 즉 DB의 contacts collection에서 _id가 req.params.id와 일치하는 data를 찾는 조건입니다.
 
에러가 없다면 검색 결과를 받아 views/contacts/show.ejs를 render합니다.
*/

// edit // findOne의 검색 결과를 받아 views/memos/edit.ejs를 render한다.
router.get("/:id/edit", function (req, res) {
    Memo.findOne({ _id: req.params.id }, function (err, memo) {
        if (err) return res.json(err);
        res.render("memos/edit", { memo: memo });
    });
});

// update
router.put("/:id", function (req, res) {
    Memo.findOneAndUpdate({ _id: req.params.id }, req.body, function (err, memo) {
        if (err) return res.json(err);
        res.redirect("/memos/" + req.params.id);
    });
});
/*
Model.findOneAndUpdate는 DB에서 해당 model의 document를 하나 찾아 그 data를 수정하는 함수입니다.
첫번째 parameter로 찾을 조건을 object로 입력하고 두번째 parameter로 update할 정보를 object로 입력data를 찾은 후 callback함수를 호출합니다.
이때 callback함수로 넘겨지는 값은 수정되기 전의 값입니다.
만약 업데이트 된 후의 값을 보고 싶다면 콜백 함수 전에 parameter로 {new:true}를 넣어주면 됩니다.
*/

// destroy
router.delete("/:id", function (req, res) {
    Memo.deleteOne({ _id: req.params.id }, function (err, memo) {
        if (err) return res.json(err);
        res.redirect("/memos");
    });
});
/*
Model.deleteOne은 DB에서 해당 model의 document를 하나 찾아 삭제하는 함수.
첫번째 parameter로 찾을 조건을 object로 입력하고 data를 찾은 후 callback함수를 호출.
data 삭제 후 memos로 redirect한다.
*/
module.exports = router;