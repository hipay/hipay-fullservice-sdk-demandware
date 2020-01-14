'use strict';

/* eslint no-param-reassign: ["error", { "props": true, "ignorePropertyModificationsFor": ["model"] }] */
var PageRenderHelper = require('*/cartridge/experience/utilities/PageRenderHelper.js');


/**
 * Helper to encapsulate common code for building a carousel
 *
 * @param {Object} model - model object for a component
 * @param {Object} context - model object for a component
 * @return {Object} model - prepared model
 */
function init(model, context) {
    model.regions = PageRenderHelper.getRegionModelRegistry(context.component);

    var xsColSize = 12 / parseInt(context.content.xsCarouselSlidesToDisplay, 10);
    var smColSize = 12 / parseInt(context.content.smCarouselSlidesToDisplay, 10);
    var mdColSize = 12 / parseInt(context.content.mdCarouselSlidesToDisplay, 10);

    var sizeExtraSmall = ' col-' + xsColSize;
    var sizeSmall = ' col-sm-' + smColSize;
    var sizeMedium = ' col-md-' + mdColSize;

    model.regions.slides.setClassName('carousel-inner row');
    model.regions.slides.setComponentClassName('carousel-item' + sizeExtraSmall + sizeSmall + sizeMedium);
    model.regions.slides.setComponentClassName('carousel-item active' + sizeExtraSmall + sizeSmall + sizeMedium, { position: 0 });

    var numberOfSlides = model.regions.slides.region.size;


    for (var i = 0; i < numberOfSlides; i++) {
        model.regions.slides.setComponentAttribute('data-position', i, { position: i });
    }

    if (context.component.typeID === 'einstein.einsteinCarousel'
        || context.component.typeID === 'einstein.einsteinCarouselProduct'
        || context.component.typeID === 'einstein.einsteinCarouselCategory') {
        numberOfSlides = context.content.count;
    }

    model.id = 'carousel-' + context.component.getID();

    model.slidesToDisplay = {
        xs: context.content.xsCarouselSlidesToDisplay,
        sm: context.content.smCarouselSlidesToDisplay,
        md: context.content.mdCarouselSlidesToDisplay,
        sizeExtraSmall: sizeExtraSmall,
        sizeSmall: sizeSmall,
        sizeMedium: sizeMedium
    };

    model.displayIndicators = {
        xs: context.content.xsCarouselIndicators ? 'indicators-xs' : '',
        sm: context.content.smCarouselIndicators ? 'indicators-sm' : '',
        md: context.content.mdCarouselIndicators ? 'indicators-md' : ''
    };

    model.displayControls = {
        xs: context.content.xsCarouselControls ? 'controls-xs' : '',
        sm: context.content.smCarouselControls ? 'controls-sm' : '',
        md: 'controls-md'
    };

    model.insufficientNumberOfSlides = {
        xs: context.content.xsCarouselSlidesToDisplay >= numberOfSlides ? 'insufficient-xs-slides' : '',
        sm: context.content.smCarouselSlidesToDisplay >= numberOfSlides ? 'insufficient-sm-slides' : '',
        md: context.content.mdCarouselSlidesToDisplay >= numberOfSlides ? 'insufficient-md-slides' : ''
    };

    model.numberOfSlides = model.regions.slides.region.size;
    if (context.component.typeID === 'einstein.einsteinCarousel'
        || context.component.typeID === 'einstein.einsteinCarouselProduct'
        || context.component.typeID === 'einstein.einsteinCarouselCategory') {
        model.numberOfSlides = context.content.count - 1;
    }
    model.title = context.content.textHeadline ? context.content.textHeadline : null;
    return model;
}

module.exports = {
    init: init
};
