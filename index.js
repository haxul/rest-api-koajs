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

const pool = mariadb.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  connectionLimit: 5
});

app.use(bodyParser({ urlencoded: true }));
app.use(router.routes());

router.post('/register', async ctx => register(ctx));
router.post('/signin', async ctx => signin(ctx));
router.post('/addTask', async ctx => addTask(ctx));

router.post('/removeTask', async ctx => {
  const conn = await pool.getConnection();
  const inputData = ctx.request.body;
  const task = inputData.task;
  const accessToken = ctx.request.header['access-token'];
  const response = conn.query(
    'SELECT * FROM `task-manager`.`account` a INNER JOIN `task-manager`.`accessToken` t ON a.id = t.accountId'
  );
  if (!response[0].id) ctx.throw(422, 'user not found');
});

app.listen(3000, () => console.log('server is running '));
