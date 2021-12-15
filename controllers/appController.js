require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const tf = require('../config/triggerfunctions');;
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { errors, getErrorCode } = require('../config/helpers');

exports.authenticate = async (req, res) => {
    return res.status(200).json({ code: errors.LOGIN_USER_INACTIVE })
}
