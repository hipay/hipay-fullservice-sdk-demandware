'use strict';

var Logger = require('dw/system/Logger');
var UUIDUtils = require('dw/util/UUIDUtils');
var CustomObjectMgr = require('dw/object/CustomObjectMgr');
var Transaction = require('dw/system/Transaction');

/**
 * write To Custom Object
 * @returns ERROR or OK
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
        return 'ERROR';
    }
    return 'OK';    
}

/* Exports of the modules */
 exports.writeToCustomObject = writeToCustomObject;
 