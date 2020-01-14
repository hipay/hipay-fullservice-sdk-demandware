'use strict';

var Template = require('dw/util/Template');
var HashMap = require('dw/util/HashMap');

/**
 * Render logic for storefront.campaignBanner component.
 * @param {dw.experience.ComponentScriptContext} context The component script context object.
 * @returns {string} The template to be displayed
 */
module.exports.render = function (context) {
    var content = context.content;

    var model = new HashMap();
    model.bannerMessage = content.bannerMessage;

    return new Template('experience/components/commerce_assets/campaignBanner').render(model).text;
};
