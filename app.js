const functions = require('firebase-functions');
const app = require('express')(),
firebase  = require('firebase'),
admin     = require('firebase-admin'),
bodyParser = require('body-parser'),
serviceAccount = require("./privateKey");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://dreeco-19834.firebaseio.com"
});

const db = admin.firestore();

const formData = db.collection("formData");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(req,res){
    res.render("form");
});

app.post("/", function(req,res){

});
app.listen(process.env.PORT || 8080, function(){
    console.log("server started!");
});

