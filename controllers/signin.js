const pool = require('../helpers/pool');
const bcrypt = require('bcrypt');
const salt = require('../helpers/salt');
const randomstring = require('randomstring');

module.exports = async ctx => {
  const conn = await pool.getConnection();
  const inputData = ctx.request.body;
  const email = inputData.email;
  const inputPassword = inputData.password;
  const response = await conn.query(
    'select * from `task-manager`.`account` a  where `email`=(?)',
    [email]
  );
  const account = response.pop();
  if (!account) ctx.throw(422, 'User doesnt exists');

  const isMatched = await bcrypt.compare(inputPassword, account.password);
  if (!isMatched) ctx.throw(403, 'Auth error');

  const accessToken = randomstring.generate(40);

  conn.query(
    'INSERT INTO `task-manager`.`accessToken` (token, accountId) VALUES (?, ?)',
    [accessToken, account.id]
  );

  ctx.body = {
    accessToken,
    accountId: account.id
  };
  
  conn.end();
};
