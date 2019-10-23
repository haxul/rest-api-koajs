const Koa = require('koa');
const app = new Koa();
const Router = require('koa-router');
const router = new Router();
const fs = require('fs');
const bodyParser = require('koa-body');
const mariadb = require('mariadb');
const bcrypt = require('bcrypt');

const pool = mariadb.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  connectionLimit: 5
});

app.use(bodyParser({ urlencoded: true }));
app.use(router.routes());

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
  const salt = "$2b$10$kWnyCWwJwCbFMhvFOnkCAu";
  const hash = bcrypt.hashSync(password, salt)
  conn.query("INSERT INTO `task-manager`.`account` (email, password) VALUES (?, ?)", [email, hash]);
  conn.end();
  ctx.body = "Person is created successfully";
});

app.listen(3000, () => console.log('server is running '));
