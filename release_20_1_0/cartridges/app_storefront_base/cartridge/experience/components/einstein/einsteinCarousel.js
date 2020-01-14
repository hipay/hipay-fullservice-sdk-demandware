'use strict';

var Template = require('dw/util/Template');
var HashMap = require('dw/util/HashMap');
var PageRenderHelper = require('*/cartridge/experience/utilities/PageRenderHelper.js');
var carouselBuilder = require('*/cartridge/scripts/experience/utilities/carouselBuilder.js');
var URLUtils = require('dw/web/URLUtils');
var Resource = require('dw/web/Resource');

/**
 * Render logic for the storefront.einsteinCarousel.
 * @param {dw.experience.ComponentScriptContext} context The Component script context object.
 * @returns {string} The template to be displayed
 */
module.exports.render = function (context) {
    var model = new HashMap();
    var content = context.content;

    model = carouselBuilder.init(model, context);
    model.textHeadline = content.textHeadline ? content.textHeadline : null;
    model.displayRatings = context.content.displayRatings;
    model.swatches = true;

    model.regions = PageRenderHelper.getRegionModelRegistry(context.component);

    var recommender = content.recommender;
    model.limit = parseInt(content.count, 10) || 1;

    if (recommender) {
        model.recommender = recommender.value;
    } else {
        throw new Error(Resource.msg('pd.no.prods.error', 'error', null));
    }

    model.productLoadUrl = URLUtils.abs('EinsteinCarousel-Load');

    model.id = 'carousel-' + PageRenderHelper.safeCSSClass(context.component.getID());
    return new Template('experience/components/einstein/einsteinCarousel').render(model).text;
};
