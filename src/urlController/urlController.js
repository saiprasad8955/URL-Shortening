const urlModel = require("../models/urlModel");

const shortid = require("shortid")

// Require Redis 
const redis = require("redis");
const { promisify } = require("util");


// Connect to Redis 
    const redisClient = redis.createClient(
        18740,
        "redis-18740.c264.ap-south-1-1.ec2.cloud.redislabs.com",
        { no_ready_check : true }
    );

    redisClient.auth("TPROsXKiJC9IYce2EdFK1m5LI0iPp77Q", (err) => {
        if (err) throw err ;
    });

    redisClient.on("connect", async function () {
        console.log("Connected to Redis......😍😍");
    });


    // Connection setup for redis 
    const GET_ASYNC = promisify(redisClient.GET).bind(redisClient)
    const SET_ASYNC = promisify(redisClient.SET).bind(redisClient)

const isValid = (value) => { 
    if ( typeof value === "string" && value.trim().length === 0 ) return false;
    if ( typeof value === "undefined" || typeof value === null ) return false;
    return true;
}

const isValid2 = (value) => {
    const dv = /[a-zA-Z]/ 
    if (typeof value !== "string") return false;
    if (dv.test(value) === false) return false;
    return true;
}

const isValidURL = function(url) {
    return (/^(ftp|http|https):\/\/[^ "]+$/).test(url);
 }

module.exports.createUrl = async (req, res) => {

    try {

        // Extract Request Body
        const body = req.body;

        // Check data is coming or not in body 
        if(! Object.getOwnPropertyNames(body).length > 0){
            return res.status(400).send({ status: false, msg: "Please give us Long Url to Shorten the Url" })
        }

        // Destruct the Request Body Object
        const { longUrl } = body ;

        // The API base Url endpoint
        const baseUrl = 'http://localhost:3000/'


//================================== Validations =======================================================================================================================
        // Validate the baseURL
        if (! isValidURL(baseUrl)) {
            return res.status(400).send({ status: false, msg: "Invalid Base Url Code to Shorten the Url " })
        }

        // Check longUrl is coming or not 
        if (! isValid(longUrl)) {
            return res.status(400).send({ status: false, msg: "Please Enter Long Url" })
        } 

        // Long Url must not be a number
        if (! isValid2(longUrl)) {
            return res.status(400).send({ status: false, msg: "Long Url is Invalid!!" })
        }

        // Check longUrl is valid or not 
        if (! isValidURL(longUrl)) {
            return res.status(400).send({ status: false, msg: "Invalid Long Url !! Please Check With it " })
        }

//================================== Validations-END ===================================================================================================================

        // Checking in Cache that data present or not 
        let cachedData = await GET_ASYNC(`${longUrl}`)
        if(cachedData) {
            console.log("Data is Comming From Redis....")

            // Convert JSON into Plain Object to send 
            let changedObject = JSON.parse(cachedData)
            return res.status(200).send({ status : true, data: changedObject });
        }

        // if Valid , we create the url code
        const urlCode = shortid.generate().toLowerCase() ;

        // Check that if long url is already exists or not 
        const existUrl = await urlModel.findOne({ longUrl: longUrl }).select({ shortUrl: 1, longUrl: 1, urlCode: 1, _id: 0 });

        // If exists then send error 
        if (existUrl) {
            
            // Set data in cache memory 
            const cacheData = await SET_ASYNC(`${longUrl}`, JSON.stringify(existUrl))
            // res.json(existUrl) 
            res.status(200).send({ status: true, data: existUrl });
        }

        // if not exists then create one 
        if (! existUrl) {

            // Join the baseurl and generated short code 
            const shortUrl = baseUrl + urlCode;

            // Send response as required
            const data = {
                longUrl : longUrl,
                shortUrl : shortUrl,
                urlCode : urlCode
            };

            // After that create data in collection 
            const Url = await urlModel.create(data);
            return res.status(201).send({ status: true, data: data });
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
        const urlCode = req.params.urlCode ;

        // Checking in Cache that data present or not 
        let cachedData = await GET_ASYNC(`${urlCode}`)
        if(cachedData) {
            console.log("Data Is Comming From Redis....")

            // Convert JSON into Plain Object to send 
            let changedObject = JSON.parse(cachedData)
            return res.status(302).redirect(changedObject.longUrl)
        }

        // find a document match to the code in req.params.code
        const url = await urlModel.findOne({ urlCode: urlCode });
        
        // If not found data in db then we will send error  
        if(! url){
            res.status(404).send({ status: false, data: "No URL Found With this URL CODE" })
        }
        
        // If data found then simply set the data in cache and redirect it
        const cacheData = await SET_ASYNC(`${urlCode}`, JSON.stringify(url))
        return res.status(302).redirect(url.longUrl)
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.msg })
    }
};``