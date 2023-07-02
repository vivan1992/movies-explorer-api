const router = require('express').Router();

const { login, logout, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');
const { vlaidatorCreateUser, vlaidatorLogin } = require('../middlewares/validate');

router.post('/signin', vlaidatorLogin, login);
router.post('/signup', vlaidatorCreateUser, createUser);

router.use(auth);

router.post('/signout', logout);
router.use('/users', require('./users'));
router.use('/movies', require('./movies'));
router.use('/', require('./404'));

module.exports = router;
