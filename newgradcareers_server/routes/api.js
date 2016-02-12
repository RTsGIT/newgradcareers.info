var express = require('express');
var router = express.Router();
var CompanyPosts = require('../models/companyposts');
var Feedback = require('../models/feedback');

/* GET users listing. */
router.get('/', function(req, res) {
  //res.send('respond with a resource');
  CompanyPosts.find({
      company: req.param('name')
    },
    null, {
      sort: '-updated_at'
    },
    function(e, docs) {
      if (e) {
        res.send(e);
      } else
        res.json(docs);
    });
});

router.post('/', function(req, res, next) {
  delete req.body._id;
  CompanyPosts.create(req.body, function(err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

router.get('/feedback', function(req, res) {
  //res.send('respond with a resource');
  Feedback.find({},
    function(e, docs) {
      if (e) {
        res.send(e);
      } else
        res.json(docs);
    });
});

router.post('/feedback', function(req, res, next) {
  Feedback.create(req.body, function(err, post) {
    if (err) return next(err);
    res.json(post);
  });
});


module.exports = router;
