const express = require("express");
const router = express.Router();
const rasaController = require("../controllers/rasaController");

var multer = require('multer');
var upload = multer();

router.post("/",
    upload.single('file'), 
    rasaController.CallRasa
)

module.exports = router;