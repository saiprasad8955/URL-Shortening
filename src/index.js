require('dotenv').config()
const express = require("express");
const mongoose = require("mongoose");

const route = require("./route/route");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true })
    .then(() => { console.log("MongoDB is Successfully Connected😍😍") })
    .catch((err) => { console.log(err.message) });

app.use('/', route);

app.listen(process.env.PORT || 3000, () => {
    console.log("Express app is running on port " + (process.env.PORT || 3000) + "😍😍");
});
