var express = require("express");
var router = express.Router(); // express.Router()를 사용해서 router함수를 초기화

//Home
router.get("/", function (req, res) { // "/"에 get 요청이 오는 경우를 router함수에 설정
    res.redirect("/memos");
});

module.exports = router; // module.exports에 담긴 object(여기서는 router object)가 module이 되어 require 시에 사용된다.