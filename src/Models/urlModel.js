const mongoose = require("mongoose");
// const Joi = require('joi');

const urlSchema = new mongoose.Schema({

    urlCode:{ type:String, required:true , lowercase:true, trim:true },

    longUrl: { type:String, required:true },

    shortUrl:{ type:String, unique:true, required:true}

},{timestamps:true} );

module.exports = mongoose.model("URl", urlSchema );