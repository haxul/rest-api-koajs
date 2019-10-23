const pool = require('../helpers/pool');
const bcrypt = require('bcrypt');
const salt = require('../helpers/salt');

module.exports = async ctx => {
  const conn = await pool.getConnection();
  const inputData = ctx.request.body;
  const task = inputData.task;
  const accessToken = ctx.request.header['access-token'];
  if (!accessToken) ctx.throw(400, 'bad req');
  const response = await conn.query(
    'SELECT * FROM `task-manager`.`account` a INNER JOIN `task-manager`.`accessToken` t ON a.id = t.accountId WHERE t.token=(?)',
    [accessToken]
  );
  if (!response[0]) ctx.throw(422, 'user not found');
  const resp = await conn.query(
    'INSERT INTO `task-manager`.`currentTask` (task, accountId) VALUES (?, ?)',
    [task, response[0].id]
  );
  conn.end();
  ctx.body = {  
    "taskId": resp.insertId
  };
};
