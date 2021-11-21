const express= require('express');
var app = express();
var router= require('./app/routes/routes');
const dotenv=require('dotenv').config();
const db=require('../src/config/db'); 
var path = require('path');
const Accounts = require('./app/models/Accounts');
const Argon2=require('argon2');
const route= require('./app/routes/index')
const paypal = require('paypal-rest-sdk')
const exphbds= require('express-handlebars')
 


db.connect();

app.use(express.json());
app.use(express.urlencoded());



route(app),



app.set('views', path.join(__dirname,'app', 'resources', 'views'));
app.engine(
    'hbs',
    exphbds({
        extname: '.hbs',
    },{defaultLayout:'main'}
    ),
);
app.set('view engine', 'hbs');

app.listen(3535, () =>{
    console.log('server start on port');
}); 


