const express = require('express');
const app = express();
const path = require('path');


app.use(express.static(path.join(__dirname, 'Views')));
app.use(express.static(path.join(__dirname, 'WebsiteMedia')));
app.use(express.static(path.join(__dirname, 'Controllers')));
app.use(express.static(path.join(__dirname, 'Models')));
app.use(express.static(path.join(__dirname, 'UserMedia')));


//Used for reading form data from json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Bring over and execute the GET and POST route methods for login and create account

const dbFacade = require("./DatabaseFacade.js");
// const cloudStorage = require("./CloudStorage.js");
app.use(dbFacade);
// app.use(cloudStorage);

// Specify the starting page (login)
app.get('/', function (req, res) { 
    // res.sendFile(path.join(__dirname, 'Client','html','login.html'));
    res.sendFile(path.join(__dirname + "/Views/LoginViews/login.html"));
}); 


app.listen(8080, function()
{
    console.log('App deployed at port 8080')
});