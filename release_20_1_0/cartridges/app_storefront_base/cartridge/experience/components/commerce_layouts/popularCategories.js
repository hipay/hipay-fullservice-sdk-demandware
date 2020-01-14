'use strict';

var Template = require('dw/util/Template');
var HashMap = require('dw/util/HashMap');
var PageRenderHelper = require('*/cartridge/experience/utilities/PageRenderHelper.js');

/**
 * Render logic for the storefront.popularCategories.
 * @param {dw.experience.ComponentScriptContext} context The Component script context object.
 * @returns {string} The template to be displayed
 */
module.exports.render = function (context) {
    var model = new HashMap();
    var content = context.content;
    model.textHeadline = content.textHeadline ? content.textHeadline : null;

    model.regions = PageRenderHelper.getRegionModelRegistry(context.component);

    return new Template('experience/components/commerce_layouts/popularCategories').render(model).text;
};
