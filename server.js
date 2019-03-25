'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var shortUrlHandler = require('./handlers/shortUrlHandler');
var app = express();
var port = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true
});

app.use(bodyParser.urlencoded({
  extended: false
}));

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post("/api/shorturl/new", shortUrlHandler.newUrl);
app.get("/api/shorturl/:short_url", shortUrlHandler.getUrl);

// Error handler
app.use(function (err, req, res, next) {
  if (err) {
    res.status(err.status || 500)
      .json({
        error: err.message || 'SERVER ERROR'
      });
  }
});

app.listen(port, function () {
  console.log('Node.js listening ...');
});