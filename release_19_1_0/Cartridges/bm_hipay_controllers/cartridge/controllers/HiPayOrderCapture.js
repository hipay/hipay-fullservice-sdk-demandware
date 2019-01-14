'use strict';

/**
* HiPayOrderCapture.js
*
* HiPay extension controller. Handles search and capture order.
*
* @module  controllers/HiPayOrderCapture
*/

/* API includes */
var ISML  = require('dw/template/ISML'),
    guard = require('~/cartridge/scripts/guard');

function start() {
    var operationStatus = {};

    if (!empty(session.forms.searchorder.orderID.value)) {
        var orderNo = session.forms.searchorder.orderID.value,
            order   = dw.order.OrderMgr.getOrder(orderNo);

        if (empty(order)) { /* can not load requested order. */
            operationStatus.valid = false;
            operationStatus.msg   = dw.web.Resource.msg('hipay_bm.capture.order.error', 'hipay_bm', null);
        } else {
            session.forms.searchorder.clearFormElement();
        }

        return cont({
            Order           : order,
            OperationStatus : operationStatus
        });
    }

    return cont({
        OperationStatus : operationStatus
    });
}

function cont(args) {
    var top_url        = dw.web.URLUtils.url('SiteNavigationBar-ShowMenuitemOverview', 'CurrentMenuItemId', request.httpParameterMap.CurrentMenuItemId),
        main_menu_name = request.httpParameterMap.mainmenuname.stringValue;

    ISML.renderTemplate('hipay/searchorder', {
        ContinueURL     : dw.web.URLUtils.https('HiPayOrderCapture-HandleForm'),
        CurrentForms    : session.forms,
        Order           : args.Order,
        OperationStatus : args.OperationStatus,
        TOP_URL         : top_url,
        MAIN_MENU_NAME  : main_menu_name
    });
}

function handleForm() {
    var triggeredAction = request.triggeredFormAction,
        operationStatus = {};

    if (!empty(triggeredAction) && triggeredAction.formId === 'search') {
        start();
    } else if (!empty(triggeredAction) && triggeredAction.formId === 'capture') {
        var captureAmount = session.forms.searchorder.captureAmount.value,
            orderNo       = session.forms.searchorder.captureOrderID.value,
            order         = dw.order.OrderMgr.getOrder(orderNo);

        var response = require('int_hipay_controllers/cartridge/scripts/lib/hipay/HiPayMaintenanceModule').hiPayMaintenanceRequest(order, captureAmount);

        if (response.error) {
            operationStatus.valid = false;
            operationStatus.msg   = dw.web.Resource.msg('hipay_bm.capture.error', 'hipay_bm', null);
        } else {
            operationStatus.valid = true;
            operationStatus.msg   = dw.web.Resource.msg('hipay_bm.capture.success', 'hipay_bm', null);
        }

        return cont({
            OperationStatus : operationStatus,
            Order           : order
        });
    }
}

/** @see {@link module:controllers/HiPayOrderCapture~start} */
exports.Start      = guard.ensure(['https', 'get'], start);
exports.HandleForm = guard.ensure(['https', 'post'], handleForm);
