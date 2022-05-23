const express = require("express");
const router = express.Router();
const urlController = require("../urlController/urlController")


// POST API's 
router.post("/url/shorten", urlController.createUrl );


// GET API's
router.get("/:urlCode", urlController.getShortUrl )



module.exports = router ;