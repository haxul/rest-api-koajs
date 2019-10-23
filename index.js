const Koa = require('koa');
const app = new Koa();
const Router = require('koa-router');
const router = new Router();
const fs = require('fs');
const bodyParser = require('koa-body');
const mariadb = require('mariadb');
const bcrypt = require('bcrypt');
const randomstring = require("randomstring");
const register = require("./controllers/register");
const pool = mariadb.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  connectionLimit: 5
});

app.use(bodyParser({ urlencoded: true }));
app.use(router.routes());

const salt = "$2b$10$kWnyCWwJwCbFMhvFOnkCAu";

router.post('/register', async ctx => {
  const conn = await pool.getConnection();
  const inputData =  ctx.request.body ;
  const email = inputData.email;
  const password = inputData.password;
  const response = await conn.query('select * from `task-manager`.`account` a  where `email`=(?)', [email]);
  const user = response.pop();
  if (user) {
    ctx.throw(400,"User exists");
    return;
  } 
  const hash = bcrypt.hashSync(password, salt)
  conn.query("INSERT INTO `task-manager`.`account` (email, password) VALUES (?, ?)", [email, hash]);
  conn.end();
  ctx.body = "Person is created successfully";
});

router.post("/signin", async ctx => {
  const conn = await pool.getConnection();
  const inputData =  ctx.request.body;
  const email = inputData.email;
  const inputPassword = inputData.password;
  const response = await conn.query('select * from `task-manager`.`account` a  where `email`=(?)', [email]);
  const account = response.pop();
  if (!account) {
    ctx.throw(422,"User doesnt exists");
    return;
  }
  const isMatched = await bcrypt.compare(inputPassword, account.password);
  if (!isMatched) {
    ctx.throw(403, "Auth error");
    return;
  }
  const accessToken = randomstring(40);
  conn.query("INSERT INTO `task-manager`.`accessToken` (token, created, account_id) VALUES (?, ?, ?)", [accessToken, new Date().getTime(), account.id]);
  ctx.body = "Auth is successful";
  conn.end();
});

router.post("/addTask", async ctx => {
  const conn = await pool.getConnection();
  const inputData =  ctx.request.body;
  const task = inputData.task;
  const accessToken = ctx.request.header["access-token"];
  const response = conn.query("SELECT * FROM `task-manager`.`account` a INNER JOIN `task-manager`.`accessToken` t ON a.id = t.accountId");
  if (!response[0].id) {
    ctx.throw(422, "user not found");
    return;
  }
  const resp = conn.query("INSERT INTO `task-manager`.`currentTask` (account_id, taskValue) VALUES (?, ?)", [response[0].id, task ]);
  conn.end();
  ctx.body = "task is added";
});

router.post("/removeTask", async ctx => {
  const conn = await pool.getConnection();
  const inputData =  ctx.request.body;
  const task = inputData.task;
  const accessToken = ctx.request.header["access-token"];
  const response = conn.query("SELECT * FROM `task-manager`.`account` a INNER JOIN `task-manager`.`accessToken` t ON a.id = t.accountId");
  if (!response[0].id) {
    ctx.throw(422, "user not found");
    return;
  }
});


app.listen(3000, () => console.log('server is running '));
