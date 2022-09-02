module.exports = {
    QUERY_AUTHENTICATED: {
        query: "select org.description orgdesc, corp.description corpdesc, ous.corpid, ous.orgid, us.userid, us.usr, us.pwd, us.firstname, us.lastname, us.email, us.status, ous.redirect, role.description roledesc, COALESCE(org.country, 'PE') countrycode from usr us inner join orguser ous on ous.userid = us.userid inner join org org on org.orgid = ous.orgid inner join corp corp on corp.corpid = ous.corpid inner join role role on role.id_role = ous.id_role where us.usr = $usr and ous.bydefault and ous.status <> 'ELIMINADO' limit 1;",
        module: "",
        protected: false
    },
    QUERY_AUTHENTICATED_DRIVER: {
        query: "select dv.* from driver dv where email = $email and dv.status <> 'ELIMINADO' limit 1;",
        module: "",
        protected: false
    },
    UFN_USERTOKEN_INS: {
        // query: "select * from ufn_usertoken_ins($userid, $token, $origin)",
        query: "CALL UFN_USERTOKEN_INS($userid, $token, $origin)",
        module: "",
        protected: "SELECT"
    },
    UFN_USERSTATUS_UPDATE: {
        query: "CALL UFN_USERSTATUS_UPDATE($userid, $orgid, $type, $username, $status, $motive, $description)",
        module: "",
        protected: "SELECT"
    },
    UFN_APPLICATION_SEL: {
        query: "CALL UFN_APPLICATION_SEL($corpid, $orgid, $userid)",
        module: "",
        protected: ""
    },
    UFN_ORGANIZATION_CHANGEORG_SEL: {
        query: "CALL UFN_ORGANIZATION_CHANGEORG_SEL($userid)",
        module: "",
        protected: "SELECT"
    },
    QUERY_SEL_PROPERTY_ON_LOGIN: {
        query: "SELECT propertyname, propertyvalue FROM property p WHERE p.corpid = :corpid AND p.orgid = :orgid AND p.propertyname IN (:propertynames) and p.status = 'ACTIVO';",
        module: "",
        protected: "SELECT"
    },
    UFN_USERTOKEN_SEL: {
        query: "CALL UFN_USERTOKEN_SEL($corpid,$orgid,$userid,$token,$update,$origin)",
        module: "",
        protected: "SELECT"
    },
    SP_SEL_TEMPLATE: {
        query: "CALL SP_SEL_TEMPLATE($userid,$orgid,$status,$type)",
        module: "",
        protected: "SELECT"
    },
    UFN_SEL_MASSIVE_LOAD: {
        query: "SELECT * from massive_load where massiveloadid = $massiveloadid order by 1 desc limit 1",
        module: "",
        protected: false
    },
    UFN_SEL_MASSIVE_LOAD_DETAIL: {
        query: "SELECT * from massive_load_detail where massiveloadid = $massiveloadid order by guide_number, seg_code, client_barcode",
        module: "",
        protected: false
    },
    SP_CHECK_ADDRESS: {
        query: "CALL SP_CHECK_ADDRESS($ubigeo, $address, $address_refernce, $department, $district, $province, $usr)",
        module: "",
        protected: false
    },
    SP_INS_ADDRESS: {
        query: "CALL SP_INS_ADDRESS($ubigeo, $address, $address_refernce, $department, $district, $province, $usr)",
        module: "",
        protected: false
    },
    SP_SEL_MASSIVE_LOAD: {
        query: "CALL SP_SEL_MASSIVE_LOAD($userid,$orgid)",
        module: "",
        protected: "SELECT"
    },
    SP_INS_GUIDE: {
        query: "CALL SP_INS_GUIDE($corpid, $orgid, $clientid, $storeid, $massiveloadid, $addressid, $guide_number, $seg_code, $alt_code1, $alt_code2, $client_date, $client_barcode, $client_date2, $client_dni, $client_name, $client_phone1, $client_phone2, $client_phone3, $client_email, $gstatus, $usr, $collect_time_range, $collect_contact_name, $payment_method, $amount, $seller_name, $client_info, $delivery_type, $linea)",
        module: "",
        protected: false
    },
    UFN_INS_GUIDE_TRACKING_PENDING: {
        query: "INSERT INTO guide_tracking(guideid, status, motive) VALUES($guideid,'PROCESADO','Registro Automático.'),($guideid,'PENDIENTE','Registro Automático.')",
        module: "",
        protected: false
    },
    SP_INS_PRODUCT: {
        query: "CALL SP_INS_PRODUCT($guideid, $sku_code, $sku_description, $sku_weight, $sku_pieces, $sku_brand, $sku_size, $box_code, $status, $usr)",
        module: "",
        protected: false
    },
    UFN_PROCESS_MASSIVE_LOAD: {
        query: "UPDATE massive_load set status = 'PROCESADO', changeby = $usr where massiveloadid = $massiveloadid",
        module: "",
        protected: false
    },
    SP_SEL_GUIDES: {
        query: "CALL SP_SEL_GUIDES($userid, $orgid)",
        module: "",
        protected: false
    },
    SP_VEHICLE_DRIVER: {
        query: "CALL SP_VEHICLE_DRIVER($userid, $orgid)",
        module: "",
        protected: false
    },
    SP_CREATE_SHIPPING_ORDER: {
        query: "CALL SP_CREATE_SHIPPING_ORDER($vehicleid, $driverid, $quadrant_name, $guide_ids, $username, $corpid, $orgid)",
        module: "",
        protected: false
    },
    SP_REASIGNAR_ENVIO: {
        query: "CALL SP_REASIGNAR_ENVIO($vehicleid, $driverid, $shippingorderid, $username)",
        module: "",
        protected: false
    },
    SP_SEL_SHIPPING_DETAIL: {
        query: "CALL SP_SEL_SHIPPING_DETAIL($shippingorderid)",
        module: "",
        protected: false
    },
    SP_DEL_MASSIVE_LOAD: {
        query: "CALL SP_DEL_MASSIVE_LOAD($massiveloadid, $username)",
        module: "",
        protected: false
    },
    SP_DEL_GUIDE_IMAGE: {
        query: "CALL SP_DEL_GUIDE_IMAGE($guideid, $shippingorderid, $url, $username)",
        module: "",
        protected: false
    },
    SP_SEL_GUIDE_BY_BARCODE: {
        query: "CALL SP_SEL_GUIDE_BY_BARCODE($search, $filterBy, $userid, $orgid)",
        module: "",
        protected: false
    },
    SP_SEL_GUIDE_INFO: {
        query: "CALL SP_SEL_GUIDE_INFO($guideid, $userid, $orgid)",
        module: "",
        protected: false
    },
    SP_SEL_GUIDE_TRACKING: {
        query: "CALL SP_SEL_GUIDE_TRACKING($guideid, $userid, $orgid)",
        module: "",
        protected: false
    },
    SP_SEL_IMG_GUIDES: {
        query: "CALL SP_SEL_IMG_GUIDES($guideid, $userid, $orgid)",
        module: "",
        protected: false
    },
    SP_SEL_SHIPPING_ORDERS: {
        query: "CALL SP_SEL_SHIPPING_ORDERS($status, $userid, $orgid)",
        module: "",
        protected: false
    },
    SP_REPORTE_CONTROL: {
        query: "CALL SP_REPORTE_CONTROL($startdate, $enddate, '', $userid, $orgid)",
        module: "",
        protected: false
    },
    SP_REPORTE_CONTROL_SKU: {
        query: "CALL SP_REPORTE_CONTROL_SKU($startdate, $enddate, '', $userid, $orgid)",
        module: "",
        protected: false
    },
    SP_REPORTE_ASIGNACION_POR_GUIA: {
        query: "CALL SP_REPORTE_ASIGNACION_POR_GUIA($startdate, $enddate, '', $userid, $orgid)",
        module: "",
        protected: false
    },
    SP_SEL_USER: {
        query: "CALL SP_SEL_USER($status, $orgid)",
        module: "",
        protected: false
    },
    SP_INS_ORGUSER: {
        query: "CALL SP_INS_ORGUSER($corpid,$orgid,$userid,$id_role,$bydefault,$type,$status,$redirect,$clients,$stores,$username,$operation)",
        module: "",
        protected: "INSERT"
    },
    SP_USER_INS: {
        query: "CALL SP_USER_INS($id,$usr,$password,$email,$phone,$firstname,$lastname,$doctype,$docnum,$description,$type,$status,$username,$operation)",
        module: "",
        protected: "INSERT"
    },
    SP_ROLE_LST: {
        query: "CALL SP_ROLE_LST($userid)",
        module: "",
        protected: false
    },
    SP_SE_CORP_ORG: {
        query: "CALL SP_SE_CORP_ORG($corpid, $id, $username, $all)",
        module: "",
        protected: false
    },
    SP_SEL_APPS_DATA: {
        query: "CALL SP_SEL_APPS_DATA($id_role)",
        module: "",
        protected: false
    },
    SP_DOMAIN_LST: {
        query: "CALL SP_DOMAIN_LST($corpid, $orgid)",
        module: "",
        protected: false
    },
    SP_DOMAIN_LST_VALUES: {
        query: "CALL SP_DOMAIN_LST_VALUES($corpid, $orgid, $domainname)",
        module: "",
        protected: false
    },
    SP_INS_DRIVER: {
        query: "CALL SP_INS_DRIVER($driverid, $corpid, $orgid, $first_name, $last_name, $doc_number, $doc_type, $password, $email, $phone, $status, $username, $operation)",
        module: "",
        protected: "INSERT"
    },
    SP_INS_VEHICLE: {
        query: "CALL SP_INS_VEHICLE($vehicleid, $corpid, $orgid, $driverid, $providerid, $vehicle_type, $brand, $model, $plate_number, $soat, $status, $username, $operation)",
        module: "",
        protected: "INSERT"
    },
    SP_SEL_CLIENTS: {
        query: "CALL SP_SEL_CLIENTS($orgid, $userid)",
        module: "",
        protected: false
    },
    SP_SEL_STORES: {
        query: "CALL SP_SEL_STORES($orgid, $userid, $clientid, $storeid, $all)",
        module: "",
        protected: false
    },
    SP_SEL_PROVIDER: {
        query: "CALL SP_SEL_PROVIDER($corpid, $userid)",
        module: "",
        protected: false
    },
    SP_SEL_ORGUSER: {
        query: "CALL SP_SEL_ORGUSER($corpid, $orgid, $userid)",
        module: "",
        protected: false
    },
    SP_SEL_IMG_MONITOR: {
        query: "CALL SP_SEL_IMG_MONITOR($orgid, $take, $skip, $where, $order, $startdate, $enddate, $userid)",
        module: "",
        protected: false
    },
    SP_SEL_IMG_MONITOR_COUNT: {
        query: "CALL SP_SEL_IMG_MONITOR_COUNT($orgid, $where, $startdate, $enddate, $userid)",
        module: "",
        protected: false
    },
    SP_SEL_GUIDES_MONITOR: {
        query: "CALL SP_SEL_GUIDES_MONITOR($orgid, $take, $skip, $where, $order, $startdate, $enddate, $userid)",
        module: "",
        protected: false
    },
    SP_SEL_GUIDES_MONITOR_COUNT: {
        query: "CALL SP_SEL_GUIDES_MONITOR_COUNT($orgid, $where, $startdate, $enddate, $userid)",
        module: "",
        protected: false
    },
    SP_CAMBIAR_ESTADO: {
        query: "CALL SP_CAMBIAR_ESTADO($guideid, $status, $motive, $username)",
        module: "",
        protected: false
    },
    SP_SEL_MOTIVES: {
        query: "CALL SP_SEL_MOTIVES()",
        module: "",
        protected: false
    },
    SP_INS_TEMPLATE: {
        query: "CALL SP_INS_TEMPLATE($id, $corpid, $orgid, $clientid, $storeid, $name, $description, $json_detail, $status, $username, $operation)",
        module: "",
        protected: false
    },
    SP_INS_CLIENT: {
        query: "CALL SP_INS_CLIENT($id, $corpid, $orgid, $name, $description, $doctype, $docnum, $status, $username, $operation)",
        module: "",
        protected: false
    },
    SP_INS_STORE: {
        query: "CALL SP_INS_STORE($id, $clientid, $corpid, $orgid, $name, $description, $address, $status, $username, $operation)",
        module: "",
        protected: false
    },
}