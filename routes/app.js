const express = require("express");
const router = express.Router();
const appController = require("../controllers/appController");
const auth = require('../middleware/auth');

router.post("/auth",
    appController.authenticate
)

module.exports = router;