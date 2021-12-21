const express = require("express");
const router = express.Router();
const appController = require("../controllers/appController");
const auth_app = require('../middleware/auth_app');

router.post("/auth", appController.authenticate)

router.post("/test", auth_app, appController.test)

module.exports = router;