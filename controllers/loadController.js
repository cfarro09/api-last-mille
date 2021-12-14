const sequelize = require('../config/database');
const { getErrorSeq } = require('../config/helpers');
const { QueryTypes } = require('sequelize');
const { setSessionParameters, errors, getErrorCode} = require('../config/helpers');

exports.insert = async (req, res) => {
    const { loadtemplateid, data } = req.body

    const transaction = await sequelize.transaction();
    let lasterror = null;
    try {
        const template = await sequelize.query("SELECT * from load_template where loadtemplateid = $loadtemplateid", {
            type: QueryTypes.RAW,
            bind: {loadtemplateid: loadtemplateid}
        }).catch(err => {
            console.log(err)
            return getErrorSeq(err)
        });

        if (!(template instanceof Array) || !template[0] instanceof Array || template[0].length === 0) {
            return res.status(401).json({ code: errors.NO_TEMPLATE });
        }

        const result = await sequelize.query("INSERT INTO massive_load(corpid,orgid,clientid,storeid,loadtemplateid,number_records,status,createby,changeby) VALUES($corpid, $orgid, $clientid, $storeid, $loadtemplateid, $count, 'PENDIENTE', $usr, $usr)", {
            type: sequelize.QueryTypes.INSERT,
            bind: {...req.user, ...template[0][0], count: data.length},
            transaction
        }).catch(err => getErrorSeq(err));

        console.log('result', result[0])
        await Promise.all(data.map(async (item) => {
            
            const check_ubigeo = await sequelize.query("SELECT * from ubigeo where LOWER(department) = $department and LOWER(province) = $province and LOWER(district) = $district limit 1", {
                type: QueryTypes.RAW,
                bind: {department: item.department.toUpperCase(), district: item.district.toUpperCase(), province: item.province.toUpperCase()},
            }).catch(err => {
                lasterror = getErrorSeq(err);
                throw 'error'
            });
            console.log('check_ubigeo', check_ubigeo[0][0])

            if (!(check_ubigeo instanceof Array) || !check_ubigeo[0] instanceof Array || check_ubigeo[0].length === 0) {
                lasterror = getErrorCode(errors.INVALID_UBIGEO);
                throw 'error'
            }

            if ('client_date' in item && !item.client_date instanceof String) {
                
            }

            item.massiveloadid = result[0];
            item.seg_code = item.seg_code || null;
            item.guide_number = item.guide_number || null;
            item.alt_code1 = item.alt_code1 || null;
            item.alt_code2 = item.alt_code2 || null;
            item.client_date = item.client_date || null;
            item.client_date2 = item.client_date2 || null;
            item.client_barcode = item.client_barcode || null;
            item.client_dni = item.client_dni || null;
            item.client_name = item.client_name || null;
            item.client_phone1 = item.client_phone1 || null;
            item.client_phone2 = item.client_phone2 || null;
            item.client_phone3 = item.client_phone3 || null;
            item.client_email = item.client_email || null;
            item.client_address = item.client_address || null;
            item.client_address_reference = item.client_address_reference || null;
            item.coord_latitude = item.coord_latitude || null;
            item.coord_longitude = item.coord_longitude || null;
            item.ubigeo = check_ubigeo[0][0].ubigeo || null;
            item.department = check_ubigeo[0][0].department || null;
            item.district = check_ubigeo[0][0].district || null;
            item.province = check_ubigeo[0][0].province || null;
            item.sku_code = check_ubigeo[0][0].sku_code || null;
            item.sku_description = item.sku_description || null;
            item.sku_weight = item.sku_weight || null;
            item.sku_pieces = item.sku_pieces || null;
            item.sku_brand = item.sku_brand || null;
            item.sku_size = item.sku_size || null;
            item.box_code = item.box_code || null;
            item.status = 'PENDIENTE';
            item.createby = req.user.usr;
            item.changeby = req.user.usr;
            item.delivery_type = item.delivery_type || null;
            item.contact_name = item.contact_name || null;
            item.contact_phone = item.contact_phone || null;
            item.payment_method = item.payment_method || null;
            item.amount = item.amount || null;
            item.collect_time_range = item.collect_time_range || null;
            item.date_loaded = item.date_loaded || null;
            
            console.log('item', item)
            let query = `
                INSERT massive_load_detail(
                    massiveloadid, guide_number, seg_code, alt_code1, alt_code2, client_date, client_date2, client_barcode, client_dni, client_name, client_phone1, 
                    client_phone2, client_phone3, client_email, client_address, client_address_reference, coord_latitude, coord_longitude, ubigeo, department, district, province, 
                    sku_code, sku_description, sku_weight, sku_pieces, sku_brand, sku_size, box_code, delivery_type, contact_name, contact_phone, collect_time_range, payment_method,
                    amount, status, createby, changeby
                ) VALUES (
                    $massiveloadid, $guide_number, $seg_code, $alt_code1, $alt_code2, $client_date, $client_date2, $client_barcode, $client_dni, $client_name, $client_phone1,
                    $client_phone2, $client_phone3, $client_email, $client_address, $client_address_reference, $coord_latitude, $coord_longitude, $ubigeo, $department, $district, $province,
                    $sku_code, $sku_description, $sku_weight, $sku_pieces, $sku_brand, $sku_size, $box_code, $delivery_type, $contact_name, $contact_phone, $collect_time_range, $payment_method,
                    $amount, $status, $createby, $changeby
                )
            ` 

            console.log('query', query);
            const insert = await sequelize.query(query, {
                type: sequelize.QueryTypes.INSERT,
                bind: item,
                transaction
            }).catch(err => {
                lasterror = getErrorSeq(err);
                throw 'error'
            });

            // if (functionsbd[item.method]) {
            //     const query = functionsbd[item.method];
            //     await sequelize.query(query, {
            //         type: QueryTypes.SELECT,
            //         bind: item.parameters,
            //         transaction
            //     }).catch(err => {
            //         lasterror = getErrorSeq(err);
            //         throw 'error'
            //     });
            // } else {
            //     lasterror = getErrorCode(errors.NOT_FUNCTION_ERROR);
            //     throw 'error'
            // }
        }))
        // await transaction.commit();
        // return {
        //     success: true,
        //     error: false
        // };



        // data.forEach(async element => {
        //     // chequear ubigeo
        //     const check_ubigeo = await sequelize.query("SELECT * from ubigeo where LOWER(department) = $department and LOWER(province) = $province and LOWER(district) = $district limit 1", {
        //         type: QueryTypes.RAW,
        //         bind: {department: element.department.toUpperCase(), district: element.district.toUpperCase(), province: element.province.toUpperCase()},
        //     }).catch(err => {
        //         console.log(err)
        //         return getErrorSeq(err)
        //     });

        //     if (!(check_ubigeo instanceof Array) || !check_ubigeo[0] instanceof Array || check_ubigeo[0].length === 0) {
        //         return res.status(401).json({ code: errors.INVALID_UBIGEO });
        //     }

        //     console.log('check_ubigeo', check_ubigeo)
        // })


        // insertar en detalle

        // console.log('result',result[0])
        await transaction.commit()
    } catch (e) {
        console.log(e)
        await transaction.rollback();
        return res.status(lasterror.rescode).json(lasterror);
    }

    // const { filter = null, data = null, sort = null, limit = null} = req.body;

    // setSessionParameters(parameters, req.user);

    return res.json({ error: false, success: true, data: 'true' });
}


// exports.load = async (req, res) => {
//     const { filter = null, data = null, sort = null, limit = null} = req.body;
//     const { table_name, action } = req.params;
//     const coreTables = getCoreTables();
//     const validActions = ['insert_one', 'insert_many', 'update','remove','find_one','find_many']
//     // setSessionParameters(parameters, req.user);

//     if (coreTables.includes(table_name))
//         return res.status(400).json({ code: 'INVALID CORE TABLE' })

//     if (!validActions.includes(action))
//         return res.status(400).json({ code: 'INVALID ACTION' })
    

//     let columns, values, q_data, w_data, s_data = []
//     let query = '';
    
//     switch (action) {
//         case 'insert_one':
//             columns = getColumns(data)
//             values = getValues(data)
//             query = `INSERT INTO ${table_name}(${columns.join(',')}) VALUES(${values.join(',')})`
//             break;

//         case 'insert_many':
//             values = getValues(data)
//             columns = getColumns(data)
//             query = `INSERT INTO ${table_name}(${columns.join(',')}) VALUES ${values.map(e => "(" + e.join(',') + ")" )}`
//             break;

//         case 'update':
//             q_data = equalQuery(data)
//             w_data = equalQuery(filter)
//             query = `UPDATE ${table_name} SET ${q_data.join(', ')} WHERE ${w_data.join(' AND ')}`
//             break;

//         case 'remove':
//             w_data = equalQuery(filter)
//             query = `UPDATE ${table_name} SET status = 'ELIMINADO' WHERE ${w_data.join(' AND ')}`
//             break;

//         case 'find_one':
//             w_data = (filter) ? `WHERE ${equalQuery(filter).join(' AND ')}` : ''
//             s_data = (sort) ? `order by ${getSort(sort).join(', ')}` : ''
//             query = `SELECT * FROM ${table_name} ${w_data}  ${s_data} limit 1`;
//             break;

//         case 'find_many':
//             w_data = (filter) ? `WHERE ${equalQuery(filter).join(' AND ')}` : ''
//             s_data = (sort) ? `order by ${getSort(sort).join(', ')}` : ''
//             let s_limit = (limit) ? ` limit ${limit}` : ''
//             query = `SELECT * FROM ${table_name} ${w_data} ${s_data} ${s_limit}`;
//             break;

//         default:
//             break;
//     }
    
//     let result = await sequelize.query(query,{type: QueryTypes.SELECT}).catch(err => getErrorSeq(err));

//     if (result instanceof Array) {
//         result = (action === 'find_one') ? result[0] : result;
//         return res.json({ error: false, success: true, data: result });
//     }
//     else
//         return res.status(result.rescode).json(result);
// }

// function getColumns(data) {
//     data = (data instanceof Array) ? data[0] : data
//     return Object.keys(data)
// }

// function getValues(data) {
//     let values = []
//     if (data instanceof Array)
//         data.forEach((element, index) => {
//             values[index] = [];
//             Object.entries(element).forEach(([key, value]) => { values[index].push(`'${value}'`) })
//         })
//     else
//         Object.entries(data).forEach(([key, value]) => { values.push(`'${value}'`) })
//     return values;
// }

// function equalQuery(data) {
//     return Object.entries(data).map(([k,v]) => `${k} = '${v}'`)
// }

// function getSort(data) {
//     return Object.entries(data).map(([k,v]) => `${k} ${v}`)
// }

// function getCoreTables() {
//     return ['appintegration','application','block','blockversion','classification','communicationchannel','communicationchannelhook','communicationchannelstatus','conversation','conversationclassification','corp','domain','groupconfiguration','inappropriatewords','inputvalidation','integrationmanager','intelligentmodels','interaction','location','messagetemplate','org','orguser','person','personcommunicationchannel','post','productivity','property','quickreply','report','reportbiinteraction','role','roleapplication','sla','survey','surveyanswer','surveyquestion','tablevariable','tablevariableconfiguration','timezone','userhistory','userstatus','usertoken','usr','usrnotification','whitelist']
// }