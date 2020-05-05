const Koa = require('koa');
const app = new Koa();

const staticCache = require('koa-static-cache');
const { resolve } = require('path');
const assetspath = resolve(__dirname, 'public');

app.use(staticCache(assetspath));

const ReactView = require('./src/middlewares/react-view');
const view = new ReactView();

app.use(view.register());

const router = require('./src/routes')
app.use(router.routes())
    .use(router.allowedMethods());


const config = require('./config')

app.listen(config.PORT)