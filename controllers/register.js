const salt = '$2b$10$kWnyCWwJwCbFMhvFOnkCAu';
const bodyParser = require('koa-body');
const mariadb = require('mariadb');
const bcrypt = require('bcrypt');
const randomstring = require('randomstring');

const pool = mariadb.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  connectionLimit: 5
});

module.exports = async ctx => {
  const conn = await pool.getConnection();
  const inputData = ctx.request.body;
  const email = inputData.email;
  const password = inputData.password;
  const response = await conn.query(
    'select * from `task-manager`.`account` a  where `email`=(?)',
    [email]
  );
  const user = response.pop();
  if (user) {
    ctx.throw(400, 'User exists');
    return;
  }
  const hash = bcrypt.hashSync(password, salt);
  conn.query(
    'INSERT INTO `task-manager`.`account` (email, password) VALUES (?, ?)',
    [email, hash]
  );
  conn.end();
  ctx.body = 'Person is created successfully';
};
