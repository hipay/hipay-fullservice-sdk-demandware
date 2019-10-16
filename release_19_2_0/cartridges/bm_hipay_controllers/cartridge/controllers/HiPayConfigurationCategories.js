'use strict';

/**
* HiPayConfigurationCategories.js
*
* HiPay extension controller. Handles categories configuration.
*
* @module  controllers/HiPayConfigurationCategories
*/

/* Script includes */
var guard = require('~/cartridge/scripts/guard');

/* API includes */
var ISML = require('dw/template/ISML');
var URLUtils = require('dw/web/URLUtils');
var CustomObjectMgr = require('dw/object/CustomObjectMgr');
var CatalogMgr = require('dw/catalog/CatalogMgr');
var ArrayList = require('dw/util/ArrayList');
var Transaction = require('dw/system/Transaction');
var Logger = require('dw/system/Logger');

function getTopLevelCategory() {
    var siteCatalog = CatalogMgr.getSiteCatalog();
    var topLevelCategory = null;

    if (siteCatalog != null) {
        topLevelCategory = siteCatalog.getRoot();
    }

    return topLevelCategory;
}

function getSubcategories(category) {
    return category.getOnlineSubCategories();
}

function setDataObject(categoriesConfig, category) {
    var dataobj = {};

    if (!empty(categoriesConfig) && !empty(categoriesConfig[category.getID()])) {
        dataobj.hipayCategory = categoriesConfig[category.getID()].hipayCategory;
    } else {
        dataobj.hipayCategory = '0';
    }

    dataobj.categoryid = category.getID();
    dataobj.categoryName = category.getDisplayName();

    return dataobj;
}

function start() {
    try {
        var categoriesDetailed = new ArrayList();
        var categoriesCO = CustomObjectMgr.getCustomObject('OneyExtensionConfig', 'category').custom.settings;
        var categoriesConfig = JSON.parse(categoriesCO);

        // get top level category
        var topLevelCategory = getTopLevelCategory();
        var level1 = getSubcategories(topLevelCategory);

        for (var lv1 = 0; lv1 < level1.length; lv1++) {
            var topLevel = level1[lv1];
            var dataobj = setDataObject(categoriesConfig, topLevel);
            categoriesDetailed.add(dataobj);

            // get next two levels subcategories
            var level2 = getSubcategories(topLevel);
            for (var lvl2 = 0; lvl2 < level2.length; lvl2++) {
                var secondLevel = level2[lvl2];
                dataobj = setDataObject(categoriesConfig, secondLevel);
                categoriesDetailed.add(dataobj);

                var level3 = getSubcategories(secondLevel);
                for (var lvl3 = 0; lvl3 < level3.length; lvl3++) {
                    var thirdLevel = level3[lvl3];
                    dataobj = setDataObject(categoriesConfig, thirdLevel);
                    categoriesDetailed.add(dataobj);
                }
            }
        }

        session.forms.hipayconfigcategories.categoryconfigs.copyFrom(categoriesDetailed);
    } catch (e) {
        Logger.error('[HiPayConfigurationCategories.js] crashed on line: ' + e.lineNumber + ' with error: ' + e);
    }

    ISML.renderTemplate('hipay/configurecategories', {
        TOP_URL: URLUtils.url('SiteNavigationBar-ShowMenuitemOverview', 'CurrentMenuItemId', 'hipaycustom_id01'),
        MAIN_MENU_NAME: 'HiPay Integration'
    });
}

function handleForm() {
    var categoryconfigs = request.triggeredForm.categoryconfigs;
    var updDataObj = {};

    for (var i = 0; i < categoryconfigs.childCount; i++) {
        var categoryconfig = categoryconfigs[i];
        var itemObj = {};

        itemObj.hipayCategory = categoryconfig.hipayCategory.value;

        updDataObj[categoryconfig.categoryid.value] = itemObj;
    }

    try {
        var categoriesCO = CustomObjectMgr.getCustomObject('OneyExtensionConfig', 'category');

        Transaction.wrap(function () {
            categoriesCO.custom.settings = JSON.stringify(updDataObj);
        });
    } catch (e) {
        Logger.error('[HiPayConfigurationCategories.js] crashed on line: ' + e.lineNumber + ' with error: ' + e);
    }

    response.redirect(URLUtils.https('HiPayConfigurationCategories-Start'));
}

/** @see {@link module:controllers/HiPayConfigurationCategories~start} */
exports.Start = guard.ensure(['https', 'get'], start);
exports.HandleForm = guard.ensure(['https', 'post'], handleForm);
