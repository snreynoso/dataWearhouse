const router = require('express').Router();

const apiUsersRouter = require('./api/user');
const apiAdminRouter = require('./api/admin');

router.use('/user', apiUsersRouter);
router.use('/admin', apiAdminRouter);

module.exports = router;