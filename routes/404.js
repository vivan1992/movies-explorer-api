const router = require('express').Router();
const { pageNotFound } = require('../controllers/pageNotFound');

router.use('/*', pageNotFound);

module.exports = router;
