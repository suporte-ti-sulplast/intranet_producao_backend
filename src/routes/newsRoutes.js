const express = require('express');
const router = express.Router();

const NewsController = require('../controllers/NewsControler');

router.post('/new-addbd', NewsController.createNews); 
router.post('/new-list', NewsController.listNews);
router.post('/news-delete', NewsController.newsDelete);
router.post('/news-alterStatus', NewsController.newsAlterStatus);
router.post('/news-updatebd', NewsController.newsUpdateBD);
router.post('/news-findBirthdayPeople', NewsController.findBirthdayPeople);


module.exports = router;