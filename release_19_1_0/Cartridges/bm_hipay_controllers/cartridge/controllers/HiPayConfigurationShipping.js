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
var ISML            = require('dw/template/ISML'),
    Site            = require('dw/system/Site'),
    URLUtils        = require('dw/web/URLUtils'),
    CustomObjectMgr = require('dw/object/CustomObjectMgr'),
    ArrayList       = require('dw/util/ArrayList'),
    Transaction     = require('dw/system/Transaction'),
    Logger          = require('dw/system/Logger');

function start() {
    try {
        var shippingMethodsDetailed = new ArrayList(),
            customSitePreferences   = Site.getCurrent().getPreferences().getCustom(), 
            shippingMethods         = customSitePreferences.hipaySiteShippingMethodsList.split(',');
            shippingCO              = CustomObjectMgr.getCustomObject('OneyExtensionConfig', 'shipping').getCustom()['settings'],
            shippingConfig          = JSON.parse(shippingCO);

        for each (var shippingMethodId in shippingMethods) {
            var dataobj = {};

            if (!empty(shippingConfig) && !empty(shippingConfig[shippingMethodId])) {
                var details = shippingConfig[shippingMethodId];

                dataobj.preparationTime = details.preparationTime;
                dataobj.deliveryTime    = details.deliveryTime;
                dataobj.deliveryMode    = details.deliveryMode;
                dataobj.deliveryMethod  = details.deliveryMethod;
            } else {
                dataobj.preparationTime = null;
                dataobj.deliveryTime    = null;
                dataobj.deliveryMode    = "0";
                dataobj.deliveryMethod  = "0";
            }

            dataobj.shippingmethodid = shippingMethodId;

            shippingMethodsDetailed.add(dataobj);
        }

        session.forms.hipayconfigshipping.shippingconfigs.copyFrom(shippingMethodsDetailed);

    } catch(e) {
        Logger.error("[HiPayConfigurationShipping.js] crashed on line: " + e.lineNumber + " with error: " + e);
    }

    ISML.renderTemplate('hipay/configureshipping', {
        TOP_URL        : URLUtils.url('SiteNavigationBar-ShowMenuitemOverview', 'CurrentMenuItemId', 'hipaycustom_id01'),
        MAIN_MENU_NAME : 'HiPay Integration'
    });
}

function handleForm() {
    var shippingconfigs = request.triggeredForm.shippingconfigs,
        updDataObj      = {};

    for (var i in shippingconfigs) {
        var shippingconfig = shippingconfigs[i],
            itemObj        = {};

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
        Logger.error("[HiPayConfigurationShipping.js] crashed on line: " + e.lineNumber + " with error: " + e);
    }

    response.redirect(URLUtils.https("HiPayConfigurationShipping-Start"));
}

/** @see {@link module:controllers/HiPayConfigurationShipping~start} */
exports.Start      = guard.ensure(['https', 'get'], start);
exports.HandleForm = guard.ensure(['https', 'post'], handleForm);
