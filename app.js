const functions = require('firebase-functions');
const express = require('express'),
    app = express(),
    firebase  = require('firebase'),
    admin     = require('firebase-admin'),
    bodyParser = require('body-parser'),
    serviceAccount = require("./privateKey"),
    {Pool, Client} = require("pg"),
    multer = require("multer");

require("dotenv").config();
var path = require('path');
var dir = path.join(__dirname, 'public');
app.set("view engine", "ejs");
app.use(express.static(dir));

var connectionString = "postgres://fhebvtlgyvfwcf:a84b41e78b09d13a46684ae447ed3ca961ab6fc7a20f435dd59bdc1c20277138@ec2-79-125-110-209.eu-west-1.compute.amazonaws.com:5432/d998f4888e22o2?ssl=true";
const pool = new Pool({ connectionString: connectionString});

pool.query("SELECT * from hmm", function (err, result) {
    if(err) 
        return console.log(err);
    console.log(result.rows);
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
    storage: storage,
});

app.get('/', function(req,res){
    res.render("form");
});

app.post("/", upload.single('image'), function(req,response){
    let name = req.body.name;
    console.log(req.body);
    var x = [];
    if(typeof req.body.payment == "string")
        x.push(req.body.payment);
    else
        x = req.body.payment;

    var query = {
        text: 'insert into temp2(name, availability, number, fileName, foodItem, foodPrice, drinkItem, drinkPrice, payment,weekly, monthly, dumping, smartphone, location, startTime, endTime, pin, presence, seating, delivery, dAvailable, route) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22)',
        values: [req.body.name, req.body.availability, req.body.number, req.body.fileName, req.body.fitem, req.body.fprice, req.body.ditem, req.body.dprice, x,req.body.weekly, req.body.monthly, req.body.dumping, req.body.smartphone, req.body.location, req.body.start, req.body.last, req.body.pin, req.body.presence, req.body.seating, req.body.delivery, req.body.dAvailable, req.body.route],
    };
    pool.query(query, function (err, res) {
        if(err)
            console.log("ERROR:" + err);
        else {
            console.log(res.rows[0]);
            response.redirect("done");
        }
    });
});

app.get("/done", (req,res) => {
   res.render("done");
});

app.listen(process.env.PORT || 8000, function(){
    console.log("server started!");
});

