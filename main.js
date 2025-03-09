const express = require('express');
const app = express();
const port = 3000
var fs = require('fs');
var bodyParser = require('body-parser');
var compression = require('compression');
var homeRouter = require('./routes/home');
var topicRouter = require('./routes/topic');
const helmet = require('helmet')

app.use(helmet());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression());
app.use( '*', function (request, response, next) {
  fs.readdir('./data', function (error, filelist) {
    request.list = filelist;
    next();
  });
});

app.use('/', homeRouter);
app.use('/topic', topicRouter);

app.use((req, res, next) => {
  res.status(404).send('Sorry cant find that!')
})
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})
app.listen(port, () => {
})