const Koa = require('koa');
const app = new Koa();
const Router = require('koa-router');
const router = new Router();
const bodyParser = require('koa-body');
const mariadb = require('mariadb');
const bcrypt = require('bcrypt');

//controllers ================
const register = require('./controllers/register');
const signin = require("./controllers/signin");
const addTask = require("./controllers/addTask");
//============================

app.use(bodyParser({ urlencoded: true }));
app.use(router.routes());

router.post('/register', async ctx => register(ctx));
router.post('/signin', async ctx => signin(ctx));
router.post('/addTask', async ctx => addTask(ctx));

app.listen(3000, () => console.log('server is running '));
