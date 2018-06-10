const functions = require('firebase-functions');
const express = require('express'),
    app = express(),
    firebase  = require('firebase'),
    admin     = require('firebase-admin'),
    bodyParser = require('body-parser'),
    serviceAccount = require("./privateKey"),
    {Pool, Client} = require("pg");
    require("dotenv").config();
var path = require('path'),
    multer = require("multer");

var dir = path.join(__dirname, 'public');
app.set("view engine", "ejs");
// app.use(bodyParser.urlencoded({extended: false}));
// app.use(bodyParser.json());
app.use(express.static(dir));

var connectionString = "postgres://fhebvtlgyvfwcf:a84b41e78b09d13a46684ae447ed3ca961ab6fc7a20f435dd59bdc1c20277138@ec2-79-125-110-209.eu-west-1.compute.amazonaws.com:5432/d998f4888e22o2?ssl=true";
const pool = new Pool({ connectionString: connectionString});

pool.query("SELECT * from hmm", function (err, result) {
    if(err) return console.log(err);
    console.log(result.rows);
    pool.end();
});

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://dreeco-19834.firebaseio.com"
});
const db = admin.firestore();
const formData = db.collection("formData");
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '-' + path.extname(file.originalname));
    }
});
const upload = multer({
    storage: storage
});

app.get('/', function(req,res){
    res.render("form");
});

app.post("/", upload.single("image"), function(req,res){
    let name = req.body.name;
    console.log(req.body);
    res.render("form");
});
app.listen(process.env.PORT || 8080, function(){
    console.log("server started!");
});

