const express = require('express');
const path  =  require('path');
const app= express();
const bodyparser = require('body-parser');
const session = require('express-session');
const {v4:uuidv4} = require('uuid');

const router  = require('./router.js');
const dbcontroller = require('./modules/dbcontroller.js');

const port = process.env.PORT || 3895;

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}));

app.set('view engine', 'ejs');

app.use('/static',express.static(path.join(__dirname,'public'))); 
app.use('/assets',express.static(path.join(__dirname,'public/assets'))); //loading css , static assets

app.use(session({
    secret:uuidv4(),
    resave:false,
    saveUninitialized:true
}));

app.use('/route',router);

app.get('/',(req,res) => {//home page
    res.render('home',{title:"Result Management System"});
});

app.get('/tlogin',(req,res) => {//teacher page
    res.render('tlogin');
});

app.get('/slogin',(req,res) => {//students page
    res.render('slogin');
});

app.get('/addrecord',(req,res)=>{//add new result
    res.render('addrecord');
});



app.listen(port, () => {console.log("listening on port http://localhost:3895")});