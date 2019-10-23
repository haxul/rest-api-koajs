const pool = require("../helpers/pool");
const bcrypt = require('bcrypt');
const salt = require("../helpers/salt");

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
