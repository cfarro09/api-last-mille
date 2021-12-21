require('dotenv').config({ path: 'variables.env' });
const axios = require('axios'); //para los request
const xlsx = require('xlsx'); //para pasar de buffer a json (para q entienda javscript y trabaje con los array)
const sequelize = require('../config/database');
const { QueryTypes } = require('sequelize');
const papaparse = require('papaparse');

var ibm = require('ibm-cos-sdk'); //subida de archivo
var config = {
    endpoint: 's3.us-east.cloud-object-storage.appdomain.cloud',
    ibmAuthEndpoint: 'https://iam.cloud.ibm.com/identity/token',
    apiKeyId: 'LwD1YXNXSp8ZYMGIUWD2D3-wmHkmWRVcFm-5a1Wz_7G1', //'GyvV7NE7QiuAMLkWLXRiDJKJ0esS-R5a6gc8VEnFo0r5',
    serviceInstanceId: '0268699b-7d23-4e1d-9d17-e950b6804633' //'9720d58a-1b9b-42ed-a246-f2e9d7409b18',
};
const COS_BUCKET_NAME = "staticfileszyxme"

var s3 = new ibm.S3(config);

exports.CallRasa = async (req, res) => {

    let query = `insert into ${req.body.table} (###COLUMNS###) values (###VALUES###)`;
    const { buffer, originalname } = req.file

    const obbs = req.body.observation
    const observations = obbs ? JSON.parse(obbs) : {};
    //bajar el excel de la nube
    const f = papaparse.parse(buffer.toString(), { header: true }).data;
    // console.log(f[1])
    const rr = Object.keys(f[0]).reduce((acc, key) => ({
        columns: acc.columns + `${key},`,
        values: acc.values + `$${key},`
    }), { columns: '', values: '' })

    query = query.replace('###COLUMNS###', rr.columns.substring(0, rr.columns.length - 1));
    query = query.replace('###VALUES###', rr.values.substring(0, rr.values.length - 1));

    const LIMIT_BLOCK = 500;

    const repeated = Math.ceil(f.length / LIMIT_BLOCK);
    let countrepeated = 0;

    while (countrepeated < repeated) {
        const rr =  f.slice(countrepeated * LIMIT_BLOCK, (countrepeated + 1) * LIMIT_BLOCK).map(data => {
            Object.entries(observations).forEach(([key, value]) => {
                if (value === "double") {
                    // console.log(value, data[key])
                    data[key] = data[key] ? parseFloat(data[key]) : null;
                }
            })
            return sequelize.query(query, {
                type: QueryTypes.RAW,
                bind: data
            }).catch(err => {
                console.log(err)
            });
        })
        console.log("countrepeated", countrepeated)
        await Promise.all(rr);
        countrepeated++;
    }
    // f.forEach(data => {

    //     Object.entries(observations).forEach(([key, value]) => {
    //         if (value === "double") {
    //             console.log(value, data[key])
    //             data[key] = data[key] ? parseFloat(data[key]) : null;
    //         }
    //     })
    //     sequelize.query(query, {
    //         type: QueryTypes.RAW,
    //         bind: data
    //     }).catch(err => {
    //         console.log(err)

    //     });
    // })
    //leer el excel
    // let workbook = xlsx.read(buffer);
    // const wsname = workbook.SheetNames[1];//se elige la hoja segun el orden

    // //leer la data de la hoja seleccionada previamente y lo pasa a json
    // const datatoprocess = xlsx.utils.sheet_to_row_object_array(workbook.Sheets[wsname]);


    return res.json({ success: true, query })
}




