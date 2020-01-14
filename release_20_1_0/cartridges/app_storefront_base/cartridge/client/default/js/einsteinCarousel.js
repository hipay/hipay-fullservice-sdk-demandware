'use strict';

/**
 * Validates and Return the cquotient namespace provided by the commerce cloud platform
 * @returns {Object} - einsteinUtils or null
 */
function getEinsteinUtils() {
    var einsteinUtils = window.CQuotient;
    if (einsteinUtils && (typeof einsteinUtils.getCQUserId === 'function') && (typeof einsteinUtils.getCQCookieId === 'function')) {
        return einsteinUtils;
    }
    return null;
}

/**
 * Renders the einstein response into a given dom element
 * @param {jQuery} $parentElement parent element where recommendations will show.
 */
function showControls($parentElement) {
    var $liTemplate = $parentElement.find('.hidden-indicators-template li');
    var $carouselItems = $parentElement.find('.carousel-item');

    $carouselItems.each(function (index) {
        var $newIndiator = $liTemplate.clone();
        if (index === 0) {
            $parentElement.find('.pd-carousel-indicators').append($newIndiator);
        } else {
            $newIndiator.removeClass('active');
            $parentElement.find('.pd-carousel-indicators').append($newIndiator);
        }
        $parentElement.find('.pd-carousel-indicators li').last().attr('data-position', index);
        $parentElement.removeClass('hide-indicators');
    });
}

/**
 * fills in the carousel with product tile html objects
 * @param {string} einsteinResponse string html for product tiles
 * @param {jQuery} $parentElement parent element where recommendations will show.
 */
function fillDomElement(einsteinResponse, $parentElement) {
    var recommendedProducts = einsteinResponse[$parentElement.data('recommender')].recs;
    if (recommendedProducts && recommendedProducts.length > 0) {
        var template = $parentElement.data('template');
        var swatches = $parentElement.data('swatches');
        var displayRatings = $parentElement.data('displayratings');
        var components = [];
        components = recommendedProducts.map(function (recommendedProduct) {
            var tiledefinition = {};
            tiledefinition.classxs = $parentElement.data('bsxs');
            tiledefinition.classsm = $parentElement.data('bssm');
            tiledefinition.classmd = $parentElement.data('bsmd');
            tiledefinition.template = template;
            tiledefinition.swatches = swatches;
            tiledefinition.displayratings = displayRatings;
            tiledefinition.model = {
                type: 'product',
                id: recommendedProduct.id
            };
            return tiledefinition;
        });

        var url = new URL($parentElement.data('product-load-url'));
        url.searchParams.append('components', JSON.stringify(components));
        url.searchParams.append('limit', $parentElement.data('limit'));
        $.ajax({
            url: url.href,
            type: 'get',
            dataType: 'html',
            success: function (html) {
                $parentElement.find('.carousel-inner').html(html);
                showControls($parentElement);
                $('body').trigger('carousel:setup', {});
            },
            error: function () {
                $parentElement.spinner().stop();
            }
        });
    }
}

 /**
 * Processes a recommendation tile, with an already initialized category specific anchors array
 * @param {jQuery} $parentElement parent element where recommendations will show.
 * @param {Object} einsteinUtils cquotient object
 * @param {Array} anchorsArray array of objects representing anchors
 */
function processRecommendationsTile($parentElement, einsteinUtils, anchorsArray) {
    var recommender = $parentElement.data('recommender');

    var params = {
        userId: einsteinUtils.getCQUserId(),
        cookieId: einsteinUtils.getCQCookieId(),
        ccver: '1.01'
    };

    if (anchorsArray) {
        params.anchors = anchorsArray;
    }

    /**
    * Processes a recommendation responses
    * @param {Object} einsteinResponse cquotient object
    */
    function recommendationsReceived(einsteinResponse) {
        fillDomElement(einsteinResponse, $parentElement);
        $parentElement.spinner().stop();
    }

    if (einsteinUtils.getRecs) {
        einsteinUtils.getRecs(einsteinUtils.clientId, recommender, params, recommendationsReceived);
    } else {
        einsteinUtils.widgets = einsteinUtils.widgets || []; // eslint-disable-line no-param-reassign
        einsteinUtils.widgets.push({
            recommenderName: recommender,
            parameters: params,
            callback: recommendationsReceived
        });
    }
}

/**
 * Processes a recommendation tile, with an already initialized product specific anchors array
 * @param {jQuery} $parentElement parent element where recommendations will show.
 * @returns {Array} - containing an anchor object
 */
function createProductAnchor($parentElement) {
    return [{
        id: $parentElement.data('primaryProductId'),
        sku: $parentElement.data('secondaryProductId'),
        type: $parentElement.data('alternativeGroupType'),
        alt_id: $parentElement.data('alternativeGroupId')
    }];
}

/**
 * Rerieves data attributes from parent element and converts to gretel compatible recommenders array
 * @param {jQuery} $parentElement parent element where recommendations will show.
 * @returns {Array} - containing an anchor object
 */
function createCategoryAnchor($parentElement) {
    return [{ id: $parentElement.data('categoryId') }];
}

/**
 * Gets all placeholder elements, which hold einstein recommendations queries the details from the
 * einstein engine and feeds them back to the dom element
 */
function loadRecommendations() {
    var einsteinUtils = getEinsteinUtils();
    if (einsteinUtils) {
        var $recommendationTiles = $('.einstein-carousel');
        $recommendationTiles.each(function () {
            var $parentElement = $(this);
            $parentElement.spinner().start();
            if ($(this).closest('.experience-einstein-einsteinCarouselProduct').length) {
                return processRecommendationsTile($parentElement, einsteinUtils, createProductAnchor($parentElement));
            } else if ($(this).closest('.experience-einstein-einsteinCarouselCategory').length) {
                return processRecommendationsTile($parentElement, einsteinUtils, createCategoryAnchor($parentElement));
            }
            return processRecommendationsTile($parentElement, einsteinUtils);
        });
    }
}

$(document).ready(function () {
    loadRecommendations();
});
