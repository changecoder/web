const Router = require('koa-router');
const router = new Router();
const { homeHandle } = require('../handles');

router.get('/', homeHandle);

module.exports = router