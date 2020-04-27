'use strict';

var Logger = require('dw/system/Logger');
var UUIDUtils = require('dw/util/UUIDUtils');
var CustomObjectMgr = require('dw/object/CustomObjectMgr');
var Transaction = require('dw/system/Transaction');

// Import Constants
var Constants = require('bm_hipay_controllers/cartridge/scripts/util/Constants');


/**
 * write To Custom Object
 * @returns STATUS_ERROR or STATUS_OK
 */
function writeToCustomObject(params) {
    var objectUUID = UUIDUtils.createUUID();
    try {
        Transaction.wrap(function () {
            var instance = CustomObjectMgr.createCustomObject(params.objName, objectUUID);            
            instance.custom.customerNo = params.data.customerNo;
            instance.custom.attemptDate = params.data.attemptDate;
        });
    } catch (e) {
        Logger.error('writeToCustomObject ERROR :' + e);
        return Constants.STATUS_ERROR;
    }
    return Constants.STATUS_OK;    
}

/* Exports of the modules */
 exports.writeToCustomObject = writeToCustomObject;
 