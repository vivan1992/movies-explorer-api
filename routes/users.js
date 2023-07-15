const router = require('express').Router();
const { vlaidatorUserMe } = require('../middlewares/validate');

const { updateUser, getUserMe } = require('../controllers/users');

router.get('/me', getUserMe);

router.patch('/me', vlaidatorUserMe, updateUser);

module.exports = router;
