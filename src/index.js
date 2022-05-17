const express = require("express");
const route = require("./route/route");
const bodyParser = require("body-parser")
const app = express();
const mongoose = require("mongoose");


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true }));

mongoose.connect(
    "mongodb+srv://Sai0047:rXxgqYKPqwnhcXX7@cluster0.qptsw.mongodb.net/group59Database"
,{useNewUrlParser:true})
.then(()=>{ console.log("MongoDB is Successfully Connected")})
.catch((err)=> {console.log(err.message)});

app.use('/',route);

app.listen(process.env.PORT || 3000, function () {
    console.log("😍Express app running on port " + (process.env.PORT || 3000));
  });