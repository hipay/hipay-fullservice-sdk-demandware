'use strict';

/**
* HiPayConfigurationShipping.js
*
* HiPay extension controller. Handles shipping methods configuration.
*
* @module  controllers/HiPayConfigurationShipping
*/

/* Script includes */
var guard = require('~/cartridge/scripts/guard');

/* API includes */
var ISML = require('dw/template/ISML');
var Site = require('dw/system/Site');
var URLUtils = require('dw/web/URLUtils');
var CustomObjectMgr = require('dw/object/CustomObjectMgr');
var ArrayList = require('dw/util/ArrayList');
var Transaction = require('dw/system/Transaction');
var Logger = require('dw/system/Logger');

function start() {
    try {
        var shippingMethodsDetailed = new ArrayList();
        var customSitePreferences = Site.getCurrent().getPreferences().getCustom();
        var shippingMethods = customSitePreferences.hipaySiteShippingMethodsList.split(',');
        var shippingCO = CustomObjectMgr.getCustomObject('OneyExtensionConfig', 'shipping').custom.settings;
        var shippingConfig = JSON.parse(shippingCO);

        for (var i = 0; i < shippingMethods.length; i++) {
            var shippingMethodId = shippingMethods[i];
            var dataobj = {};

            if (!empty(shippingConfig) && !empty(shippingConfig[shippingMethodId])) {
                var details = shippingConfig[shippingMethodId];

                dataobj.preparationTime = details.preparationTime;
                dataobj.deliveryTime = details.deliveryTime;
                dataobj.deliveryMode = details.deliveryMode;
                dataobj.deliveryMethod = details.deliveryMethod;
            } else {
                dataobj.preparationTime = null;
                dataobj.deliveryTime = null;
                dataobj.deliveryMode = '0';
                dataobj.deliveryMethod = '0';
            }

            dataobj.shippingmethodid = shippingMethodId;

            shippingMethodsDetailed.add(dataobj);
        }

        session.forms.hipayconfigshipping.shippingconfigs.copyFrom(shippingMethodsDetailed);
    } catch (e) {
        Logger.error('[HiPayConfigurationShipping.js] crashed on line: ' + e.lineNumber + ' with error: ' + e);
    }

    ISML.renderTemplate('hipay/configureshipping', {
        TOP_URL: URLUtils.url('SiteNavigationBar-ShowMenuitemOverview', 'CurrentMenuItemId', 'hipaycustom_id01'),
        MAIN_MENU_NAME: 'HiPay Integration'
    });
}

function handleForm() {
    var shippingconfigs = request.triggeredForm.shippingconfigs;
    var updDataObj = {};

    for (var i = 0; i < shippingconfigs.childCount; i++) {
        var shippingconfig = shippingconfigs[i];
        var itemObj = {};

        itemObj.preparationTime = shippingconfig.preparationTime.value;
        itemObj.deliveryTime = shippingconfig.deliveryTime.value;
        itemObj.deliveryMode = shippingconfig.deliveryMode.value;
        itemObj.deliveryMethod = shippingconfig.deliveryMethod.value;

        updDataObj[shippingconfig.shippingmethodid.value] = itemObj;
    }

    try {
        var shippingCO = CustomObjectMgr.getCustomObject('OneyExtensionConfig', 'shipping');

        Transaction.wrap(function () {
            shippingCO.custom.settings = JSON.stringify(updDataObj);
        });
    } catch (e) {
        Logger.error('[HiPayConfigurationShipping.js] crashed on line: ' + e.lineNumber + ' with error: ' + e);
    }

    response.redirect(URLUtils.https('HiPayConfigurationShipping-Start'));
}

/** @see {@link module:controllers/HiPayConfigurationShipping~start} */
exports.Start = guard.ensure(['https', 'get'], start);
exports.HandleForm = guard.ensure(['https', 'post'], handleForm);
