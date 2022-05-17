const  urlModel = require("../models/urlModel");
const  validUrl = require("valid-url")
const  shortid  = require("shortid")

const isValid = (value)=> {
    if (typeof value === "string" && value.trim().length === 0) return false;
    if (typeof value === "undefined" || typeof value === null) return false;
    return true;
}

const isValid2 = (value) =>{
    const dv = /[a-zA-Z]/
    if (typeof value !== "string") return false;
    if (dv.test(value) === false) return false;
    return true;
}

module.exports.createUrl = async (req, res) => {

    try {

        // Extract Request Body
        const body = req.body;

        // Destruct the Request Body Object
        const { longUrl } = body;

        // The API base Url endpoint
        const baseUrl = 'http://localhost:3000'

        // Check Base URL if valid using the validUrl.isUri method
        if (!validUrl.isUri(baseUrl)) {
            return res.status(400).send({ status: false, msg: "Invalid Base Url Code to Shorten the Url " })
        }
        
        // Check longUrl is coming or not 
        if (!isValid(longUrl)) {
            return res.status(400).send({ status: false, msg: "Please Enter Long Url" })
        }

        // Long Url must not be a number
        if (!isValid2(longUrl)) {
            return res.status(400).send({ status: false, msg: "Long Url is Invalid!!" })
        }
        
        // Check longUrl is valid or not 
        if (!validUrl.isUri(longUrl)) {
            return res.status(400).send({ status: false, msg: "Invalid Long Url !! Please Check With it " })
        }

        // if Valid , we create the url code
        const urlCode = shortid.generate();

        // check that if long url is already exists or not 
        const existUrl = await urlModel.findOne({ longUrl: longUrl });

        // If exists then send error 
        if (existUrl) {
            // res.json(existUrl) 
            res.status(200).send({ status : true, data : existUrl});
        }

        // if not exists then create one 
        if (!existUrl) {

            // join the baseurl and generated short code 
            const shortUrl = baseUrl + "/" + urlCode;

            // send response as required
            const data = {
                longUrl: longUrl,
                shortUrl: shortUrl,
                urlCode: urlCode
            };

            const Url = await urlModel.create(data);
            return res.status(201).send({ status: true, data: data })
        }
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.msg })
    }
};



// GET URL 
module.exports.getShortUrl = async (req, res) => {

    try {

        // Extract urlCode from path params
        const urlCode = req.params.urlCode;

        // find a document match to the code in req.params.code
        const url = await urlModel.findOne({ urlCode: urlCode });

        // If urlCode exist then simply redirect it
        if (url) {
            res.redirect(url.longUrl)
        } else {
            res.status(404).send({ status: false, data: "No URL Found With this" })
        }

    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.msg })
    }
};