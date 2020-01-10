const path = require('path');
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();

const connection=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'esprit',
    database:'express'
});

connection.connect(function(error){
    if(!!error) console.log(error);
    else console.log('Database Connected!');
}); 

//set views file
app.set('views',path.join(__dirname,'views'));
			
//set view engine
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));



app.get('/',(req, res) => {
    // res.send('CRUD Operation using NodeJS / ExpressJS / MySQL');
    let sql = "SELECT * FROM items";
    let query = connection.query(sql, (err, rows) => {
        if(err) throw err;
        res.render('item_index', {
            title : 'Hello Tekru!',
            items : rows
        });
    });
});


app.get('/add',(req, res) => {
    res.render('item_add', {
        title : 'Add your element here'
    });
});

app.post('/save',(req, res) => { 
    let data = {name: req.body.name, type: req.body.type};
    let sql = "INSERT INTO items SET ?";
    let query = connection.query(sql, data,(err, results) => {
      if(err) throw err;
      res.redirect('/');
    });
});

app.get('/edit/:itemId',(req, res) => {
    const itemId = req.params.itemId;
    let sql = `Select * from items where id = ${itemId}`;
    let query = connection.query(sql,(err, result) => {
        if(err) throw err;
        res.render('item_edit', {
            title : 'Please edit your element',
            item : result[0]
        });
    });
});


app.post('/update',(req, res) => {
    const itemId = req.body.id;
    let sql = "update items SET name='"+req.body.name+"',  type='"+req.body.type+"' where id ="+itemId;
    let query = connection.query(sql,(err, results) => {
      if(err) throw err;
      res.redirect('/');
    });
});


app.get('/delete/:itemId',(req, res) => {
    const itemId = req.params.itemId;
    let sql = `DELETE from items where id = ${itemId}`;
    let query = connection.query(sql,(err, result) => {
        if(err) throw err;
        res.redirect('/');
    });
});


// Server Listening
app.listen(3004, () => {
    console.log('Server is running at port 3000');
});