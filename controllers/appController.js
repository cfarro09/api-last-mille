require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const tf = require('../config/triggerfunctions');;
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { errors, getErrorCode } = require('../config/helpers');

exports.authenticate = async (req, res) => {
    const { data: { usr, password, facebookid, googleid } } = req.body;
    // let integration = false;
    try {
        let result = await tf.executesimpletransaction("QUERY_AUTHENTICATED_DRIVER", { email });
        if (!result instanceof Array || result.length === 0)
            return res.status(401).json({ code: errors.LOGIN_USER_INCORRECT });

        const user = result[0];

        const ispasswordmatch = await bcryptjs.compare(password, user.pwd)
        if (!ispasswordmatch)
            return res.status(401).json({ code: errors.LOGIN_USER_INCORRECT })

        const tokenzyx = uuidv4();

        const dataSesion = {
            userid: user.userid,
            orgid: user.orgid,
            corpid: user.corpid,
            username: usr,
            status: 'ACTIVO',
            motive: null,
            token: tokenzyx,
            origin: 'WEB',
            type: 'LOGIN',
            description: null
        };
        let notifications = [];
        
        if (user.status === 'ACTIVO') {
            let resultProperties = {};
            // const resConnection = await tf.executesimpletransaction("UFN_PROPERTY_SELBYNAME", { ...user, propertyname: 'CONEXIONAUTOMATICAINBOX' })

            // const automaticConnection = validateResProperty(resConnection, 'bool');
            const automaticConnection = false;
            await Promise.all([
                tf.executesimpletransaction("UFN_USERTOKEN_INS", dataSesion),
                ...(automaticConnection ? [tf.executesimpletransaction("UFN_USERSTATUS_UPDATE", {
                    ...user,
                    type: 'INBOX',
                    status: 'ACTIVO',
                    description: null,
                    motive: null,
                    username: user.usr
                })] : [])
            ]);
            
            user.token = tokenzyx;
            delete user.pwd;

            jwt.sign({ user }, (process.env.SECRETA ? process.env.SECRETA : "palabrasecreta"), {}, (error, token) => {
                if (error) throw error;
                delete user.corpid;
                delete user.orgid;
                delete user.userid;
                return res.json({ data: { ...user, token, automaticConnection, notifications }, success: true });
            })
        } else if (user.status === 'PENDIENTE') {
            return res.status(401).json({ code: errors.LOGIN_USER_PENDING })
        } else if (user.status === 'BLOQUEADO') {
            if (user.lastuserstatus === 'INTENTOSFALLIDOS') {
                return res.status(401).json({ code: errors.LOGIN_LOCKED_BY_ATTEMPTS_FAILED_PASSWORD })
            } else if (user.lastuserstatus === 'INACTIVITY') {
                return res.status(401).json({ code: errors.LOGIN_LOCKED_BY_INACTIVED })
            } else if (user.lastuserstatus === 'PASSEXPIRED') {
                return res.status(401).json({ code: errors.LOGIN_LOCKED_BY_PASSWORD_EXPIRED })
            } else {
                return res.status(401).json({ code: errors.LOGIN_LOCKED })
            }
        } else {
            return res.status(401).json({ code: errors.LOGIN_USER_INACTIVE })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json(getErrorCode(null, error));
    }
}
