const express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var sanitizeHtml = require('sanitize-html');
var template = require('../lib/template.js');


router.get('/create', (request, response) => {
    var title = 'WEB - create';
    var list = template.list(request.list);
    var html = template.HTML(title, list, `
        <form action="/topic/create_process" method="post">
          <p><input type="text" name="title" placeholder="title"></p>
          <p>
            <textarea name="description" placeholder="description"></textarea>
          </p>
          <p>
            <input type="submit">
          </p>
        </form>
      `, '');
    response.send(html);
  });
  router.post('/create_process', (request, response) => {
    var title = request.body.title;
    var description = request.body.description;
    fs.writeFile(`data/${title}`, description, 'utf8', function (err) {
      response.redirect(`/topic/${title}`);
    });
    // var body = '';
    // request.on('data', function(data){
    //     body = body + data;
    // });
    // request.on('end', function(){
    //     var post = qs.parse(body);
    //     var title = post.title;
    //     var description = post.description;
    //     fs.writeFile(`data/${title}`, description, 'utf8', function(err){
    //       response.redirect(`/page/${title}`);
    //     });
    // });
  });
  router.get('/:pageId', function (request, response, next) {
    var filteredId = path.parse(request.params.pageId).base;
    fs.readFile(`data/${filteredId}`, 'utf8', function (err, description) {
      if (err) {
        next(err);
      }
      else {
        var title = request.params.pageId;
        var sanitizedTitle = sanitizeHtml(title);
        var sanitizedDescription = sanitizeHtml(description, {
          allowedTags: ['h1']
        });
        var list = template.list(request.list);
        var html = template.HTML(sanitizedTitle, list,
          `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
          ` <a href="/create">create</a>
              <a href="/topic/update/${sanitizedTitle}">update</a>
              <form action="/topic/delete_process" method="post">
                <input type="hidden" name="id" value="${sanitizedTitle}">
                <input type="submit" value="delete">
              </form>`
        );
        response.send(html);
      }
    });
  });
  //위의 router.get 전체 코드는 /page/:pageId라는 path 로 들어왔을 때 처리하는 라우트라고 할 수 있다.
  
  router.get('/update/:pageId', function (request, response) {
    var filteredId = path.parse(request.params.pageId).base;
    fs.readFile(`data/${filteredId}`, 'utf8', function (err, description) {
      var title = request.params.pageId;
      var list = template.list(request.list);
      var html = template.HTML(title, list,
        `
          <form action="/topic/update_process" method="post">
            <input type="hidden" name="id" value="${title}">
            <p><input type="text" name="title" placeholder="title" value="${title}"></p>
            <p>
              <textarea name="description" placeholder="description">${description}</textarea>
            </p>
            <p>
              <input type="submit">
            </p>
          </form>
          `,
        `<a href="/create">create</a> <a href="/topic/update/${title}">update</a>`
      );
      response.send(html);
    });
  });
  router.post('/update_process', (request, response) => {
    var id = request.body.id;
    var title = request.body.title;
    var description = request.body.description;
    fs.rename(`data/${id}`, `data/${title}`, function (error) {
      fs.writeFile(`data/${title}`, description, 'utf8', function (err) {
        response.redirect(`/topic/${title}`);
      })
    });
  });
  router.post('/delete_process', (request, response) => {
    var id = request.body.id;
    var filteredId = path.parse(id).base;
    fs.unlink(`data/${filteredId}`, function (error) {
      response.redirect('/');
    })
  });

  module.exports = router;