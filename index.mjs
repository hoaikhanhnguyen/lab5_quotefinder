import express from 'express';
import mysql from 'mysql2/promise';

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

//for Express to get values using POST method
app.use(express.urlencoded({extended:true}));

//setting up database connection pool
const pool = mysql.createPool({
  host: "database-quotes.ctt0icgkikvx.us-west-1.rds.amazonaws.com",
  user: "admin",
  password: "quotesdb9876",
  database: "quotesdb",
  connectionLimit: 10,
  waitForConnections: true
});
const conn = await pool.getConnection();

//routes

app.get('/api/author/:id', async (req, res) => {
  let authorId =req.params.id;
  let sql  = `SELECT *
                    FROM q_authors
                    WHERE authorId = ?`;
  const [rows] = await conn.query(sql, [authorId]);
  res.send(rows);
})

app.get('/searchByKeyword', async (req, res) => {
  let keyword =req.query.keyword;
  let sql  = `SELECT quote, authorId, firstName, lastName
                    FROM q_quotes
                    NATURAL JOIN q_authors
                    WHERE quote LIKE ?`;
  let sqlParams = [`%${keyword}%`];
  const [rows] = await conn.query(sql, sqlParams);
  res.render("results", {"quotes":rows});
})

app.get('/searchByLikes', async (req, res) => {
  let min =req.query.min;
  let max =req.query.max;
  let sql  = `SELECT quote, authorId, firstName, lastName
                    FROM q_quotes
                    NATURAL JOIN q_authors
                    WHERE likes BETWEEN ? AND ?`;
  let sqlParams = [min, max];
  const [rows] = await conn.query(sql, sqlParams);
  //console.log(rows);
  res.render("results", {"quotes":rows});
})

app.get('/searchByAuthor', async (req, res) => {
  let userAuthorId =req.query.authorId;
  let sql  = `SELECT authorId, firstName, lastName, quote
                    FROM q_quotes
                    NATURAL JOIN q_authors
                    WHERE authorId = ?`;
  let sqlParams = [userAuthorId];
  const [rows] = await conn.query(sql, sqlParams);
  //console.log(rows);
  res.render("results", {"quotes":rows});
})

app.get('/searchByCategory', async (req, res) => {
  let category =req.query.category;
  let sql  = `SELECT authorId, firstName, lastName, quote
                    FROM q_quotes
                    NATURAL JOIN q_authors
                    WHERE category = ?`;
  //console.log(category);
  let sqlParams = [category];
  const [rows] = await conn.query(sql, sqlParams);
  //console.log(rows);
  res.render("results", {"quotes":rows});
})

app.get('/', async (req, res) => {
  let sql = `SELECT authorId, firstName, lastName
                    FROM q_authors
                    ORDER BY lastName`;
  const [rows] = await conn.query(sql);
  let sql2 = `SELECT DISTINCT category
                    FROM q_quotes
                    ORDER BY category`;
  const [rows2] = await conn.query(sql2);
  //console.log(rows2);
  res.render('index', {"authors":rows, "categories":rows2});
});

app.get("/dbTest", async(req, res) => {
  let sql = "SELECT CURDATE()";
  const [rows] = await conn.query(sql);
  res.send(rows);
});//dbTest

app.listen(3001, ()=>{
  console.log("Express server running")
})