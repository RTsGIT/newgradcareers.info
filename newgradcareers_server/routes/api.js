var express = require('express');
var router = express.Router()
var CompanyPosts = require('../models/companyposts');;

/* GET users listing. */
router.get('/', function(req, res) {
  //res.send('respond with a resource');
  CompanyPosts.find(function(e, docs) {
    if (e) {
      res.send(e);
    } else
      res.json(docs);
  });
});

router.post('/', function(req, res, next) {
  CompanyPosts.create(req.body, function(err, post) {
    if (err) return next(err);
    res.json(post);
  });
});


module.exports = router;
