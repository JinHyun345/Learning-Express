const express = require("express");
var router = express.Router();
var template = require('../lib/template.js');

// app.get('/', function(req, res){
//   return res.send('Hello World!')
// })   아래 코드는 이거랑 똑같은 코드 return 은 생략가능
router.get('/', (request, response) => {
    var title = 'Welcome';
    var description = 'Hello, Node.js';
    var list = template.list(request.list);
    var html = template.HTML(title, list,
      `<h2>${title}</h2>${description}
      <img src="/images/hello.jpg" style="width:300px; display:block; margin-top : 20px;">`,
      `<a href="/topic/create">create</a>`
    );
    response.send(html);
  });

  module.exports = router;