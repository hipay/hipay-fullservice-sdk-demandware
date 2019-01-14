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
var ISML               = require('dw/template/ISML'),
    Site               = require('dw/system/Site'),
    URLUtils           = require('dw/web/URLUtils'),
    CustomObjectMgr    = require('dw/object/CustomObjectMgr'),
    CatalogMgr         = require('dw/catalog/CatalogMgr'),
    ProductSearchModel = require('dw/catalog/ProductSearchModel'),
    ArrayList          = require('dw/util/ArrayList'),
    Transaction        = require('dw/system/Transaction'),
    Logger             = require('dw/system/Logger');

function start() {
    try {
        var categoriesDetailed    = new ArrayList(),
            customSitePreferences = Site.getCurrent().getPreferences().getCustom();
            categoriesCO          = CustomObjectMgr.getCustomObject('OneyExtensionConfig', 'category').getCustom()['settings'],
            categoriesConfig      = JSON.parse(categoriesCO);

        //get top level category
       	var topLevelCategory = getTopLevelCategory();
        var level1 = getSubcategories(topLevelCategory);

        for each (var topLevel in level1) {
            var dataobj = setDataObject(categoriesConfig, topLevel);
            categoriesDetailed.add(dataobj);
            
            //get next two levels subcategories
            var level2 = getSubcategories(topLevel);
            for each (var secondLevel in level2) {
            	var dataobj = setDataObject(categoriesConfig, secondLevel);
                categoriesDetailed.add(dataobj);
                
                var level3 = getSubcategories(secondLevel);
                for each (var thirdLevel in level3) {
                	var dataobj = setDataObject(categoriesConfig, thirdLevel);
                    categoriesDetailed.add(dataobj);
                }
            }
        }

        session.forms.hipayconfigcategories.categoryconfigs.copyFrom(categoriesDetailed);

    } catch(e) {
        Logger.error("[HiPayConfigurationCategories.js] crashed on line: " + e.lineNumber + " with error: " + e);
    }

    ISML.renderTemplate('hipay/configurecategories', {
        TOP_URL        : URLUtils.url('SiteNavigationBar-ShowMenuitemOverview', 'CurrentMenuItemId', 'hipaycustom_id01'),
        MAIN_MENU_NAME : 'HiPay Integration'
    });
}

function handleForm() {
    var categoryconfigs = request.triggeredForm.categoryconfigs,
        updDataObj      = {};

    for (var i in categoryconfigs) {
        var categoryconfig = categoryconfigs[i],
            itemObj        = {};

        itemObj.hipayCategory = categoryconfig.hipayCategory.value;

        updDataObj[categoryconfig.categoryid.value] = itemObj; 
    }

    try {
        var categoriesCO = CustomObjectMgr.getCustomObject('OneyExtensionConfig', 'category');

        Transaction.wrap(function () {
            categoriesCO.custom.settings = JSON.stringify(updDataObj); 
        });
    } catch (e) {
        Logger.error("[HiPayConfigurationCategories.js] crashed on line: " + e.lineNumber + " with error: " + e);
    }

    response.redirect(URLUtils.https("HiPayConfigurationCategories-Start"));
}

function getTopLevelCategory() {
	var siteCatalog      = CatalogMgr.getSiteCatalog();
	    topLevelCategory = null;

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
        dataobj.hipayCategory = "0";
    }

    dataobj.categoryid   = category.getID();
    dataobj.categoryName = category.getDisplayName();
    
    return dataobj;
}

/** @see {@link module:controllers/HiPayConfigurationCategories~start} */
exports.Start      = guard.ensure(['https', 'get'], start);
exports.HandleForm = guard.ensure(['https', 'post'], handleForm);
