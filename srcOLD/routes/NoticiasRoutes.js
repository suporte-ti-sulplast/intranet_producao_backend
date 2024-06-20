const express = require('express');
const router = express.Router();

const NoticiasControler = require('../controllers/NoticiasControler');

router.post('/new-addbd', NoticiasControler.createNews); 
router.post('/new-list', NoticiasControler.listNews);
router.post('/new-get', NoticiasControler.getNews);
router.post('/news-delete', NoticiasControler.newsDelete);
router.post('/news-alterStatus', NoticiasControler.newsAlterStatus);
router.post('/news-updatebd', NoticiasControler.newsUpdateBD);
router.post('/news-findBirthdayPeople', NoticiasControler.findBirthdayPeople);




module.exports = router;