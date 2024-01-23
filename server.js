const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express()
const port = 3000;

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'post_db'
});

db.connect((err) => {
    if (err) {
        console.error('Error connection to database');
    } else {
        console.log('Connected to database');
    }
});

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    db.query('SELECT * FROM posts', (err, result) => {
      if (err) throw err;
      res.render('home', { posts: result });
    });
});

app.get('/add', (req, res) => {
    res.render('add');
});

app.post('/add', (req, res) => {
    const { title, image, content } = req.body;
    const post = { title, image, content };
    db.query('INSERT INTO posts SET ?', post, (err, result) => {
      if (err) throw err;
      console.log('Post added');
      res.redirect('/');
    });
});

app.get('/delete/:id', (req, res) => {
    const postId = req.params.id;
    db.query('DELETE FROM posts WHERE id = ?', postId, (err, result) => {
      if (err) throw err;
      console.log('Post deleted');
      res.redirect('/');
    });
});

app.listen(port, () => {
    console.log('Server is running');
});