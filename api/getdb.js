const mysql      = require('mysql');
const dbconfig   = require('./authenticate.js');
const connection = mysql.createConnection(dbconfig);

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// connection.connect();

// connection.query('SELECT * from repository', (error, rows, fields) => {
//   if (error) throw error;
//   console.log('Repository info is: ', rows);
// });


// connection.end();

app.get('/', (req, res) => {
  res.send('hello node mysql~~');
});

app.get('/memo', (req, res) => {
  connection.query(`SELECT * from repository`, (err, results, fields) => {
    if (err) throw err;
    console.log('results: ', results);
    // console.log('fields: ', fields);
    res.json(results); // json
  });
});

app.get('/memo/:id', (req, res) => {
  connection.query(
    `SELECT * from repository WHERE id=?`,
    [req.params.id],
    (err, results, fields) => {
      if (err) throw err;
      console.log('results: ', results);

      res.json(results);
    }
  );
});

// maybe you need tool like 'Postman' or 'httpie'
app.post('/memo', (req, res) => {
  // assume Content-type in client request headers is application/json
  // {"user": "sherlock", "memo":"nodejs is..."}
  const { user, memo } = req.body;
  connection.query(
    `
  INSERT INTO repository(user, memo) VALUES(?, ?)
  `,
    [user, memo],
    (err, results, fields) => {
      if (err) throw err;

      console.log('results: ', results);
      res.send('memo ok');
    }
  );
});

app.patch('/memo/:id', (req, res) => {
  connection.query(
    `UPDATE repository SET memo=? WHERE id=? `,
    [req.body.memo, req.params.id],
    (err, results, field) => {
      if (err) throw err;
      console.log('results: ', results);
      res.send('update ok');
    }
  );
});

app.delete('/memo/:id', (req, res) => {
  connection.query(
    `DELETE FROM repository WHERE id=?`,
    [req.params.id],
    (err, results, fiels) => {
      if (err) throw err;
      console.log('results: ', results);
      res.send('delete ok');
    }
  );
});

app.listen(5000, () => {
  console.log('Server is running port 5000...');
});