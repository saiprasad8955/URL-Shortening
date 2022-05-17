const express = require("express");
const route = require("./route/route");
const bodyParser = require("body-parser")
const app = express();
const chalk = require("chalk");
const mongoose = require("mongoose")


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true }));

mongoose.connect(
    "mongodb+srv://Sai0047:rXxgqYKPqwnhcXX7@cluster0.qptsw.mongodb.net/group23DatabaseBook"
,{useNewUrlParser:true})
.then(()=>{console.log(chalk.bgCyan("MongoDB is Successfully Connected"))})
.catch((err)=> {console.log(err.message)});

app.use('/',route);

app.listen(process.env.PORT || 3000, function () {
    console.log(chalk.bgCyan("😍Express app running on port") + (process.env.PORT || chalk.bgCyan("3000")));
  });