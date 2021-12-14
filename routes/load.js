const express = require("express");
const router = express.Router();
const loadController = require("../controllers/loadController");
const auth = require('../middleware/auth');

// router.post('/:table_name/:action', loadController.load)

router.post('/insert', auth, loadController.insert)
router.post('/process', auth, loadController.process)

module.exports = router;