const Koa = require('koa');
const app = new Koa();
const Router =  require("koa-router");
const router = new Router();
const fs = require("fs");
const bodyParser = require('koa-body');

const mariadb = require('mariadb');
const pool = mariadb.createPool({
     host: 'mydb.com', 
     user:'myUser', 
     password: 'myPassword',
     connectionLimit: 5
});

async function asyncFunction() {
  let conn;
  try {
	conn = await pool.getConnection();
	const rows = await conn.query("SELECT 1 as val");
	console.log(rows); //[ {val: 1}, meta: ... ]
	const res = await conn.query("INSERT INTO myTable value (?, ?)", [1, "mariadb"]);
	console.log(res); // { affectedRows: 1, insertId: 1, warningStatus: 0 }

  } catch (err) {
	throw err;
  } finally {
	if (conn) return conn.end();
  }
}
app.use(bodyParser( {urlencoded: true}));
app.use(router.routes());

router.get("/main", async ctx => {
  ctx.body = 'Hello World!!!';
  ctx.set('!!!!!!!!!!', '*');
  ctx.header = "Content: Application";
});

router.post("/main", async ctx => {
  console.log(ctx.request.body);
  ctx.body = { a: 1, b: 2, c: [3, 4]};
})

app.listen(3000, () => console.log("server is running "));