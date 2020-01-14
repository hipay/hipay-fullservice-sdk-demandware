'use strict';

var Calendar = require('dw/util/Calendar');
var URLUtils = require('dw/web/URLUtils');
var StringUtils = require('dw/util/StringUtils');

var collections = require('*/cartridge/scripts/util/collections');
var formatHelpers = require('*/cartridge/scripts/helpers/formatHelpers');

/**
 * get item promo reporting urls
 * @param {dw.order.ProductLineItem} productLineItem - the target product line item
 * @param {Array} reportingURLs - current array of reporting urls
 * @returns {Array} - an array of urls
 */
function getItemPromoReportingURLs(productLineItem, reportingURLs) {
    var result = reportingURLs;
    // Each item can have multiple price adjustments
    collections.forEach(productLineItem.priceAdjustments, function (PLIPriceAdjustments) {
        var ItemPromo = URLUtils.url('ReportingEvent-Start',
            'ID', 'ItemPromo',
            'ItemUUID', productLineItem.UUID,
            'campID', PLIPriceAdjustments.campaignID
                ? PLIPriceAdjustments.campaignID
                : 'N/A',
            'promoID', PLIPriceAdjustments.promotionID,
            'value', formatHelpers.formatPrice(PLIPriceAdjustments.price.value),
            'campaign', !PLIPriceAdjustments.isCustom(),
            'coupon', PLIPriceAdjustments.basedOnCoupon
        );

        result.push(ItemPromo);
    });

    return result;
}

/**
 * get shipping promo reporting urls
 * @param {dw.order.Shipment} shipment - the target shipment
 * @param {Array} reportingURLs - current array of reporting urls
 * @returns {Array} - an array of urls
 */
function getShippingPromoReportingURLs(shipment, reportingURLs) {
    var result = reportingURLs;

    // The shipment might have one or more price adjustments
    collections.forEach(shipment.shippingPriceAdjustments, function (shippingPriceAdjustment) {
        var shippingPromoUrl = URLUtils.url('ReportingEvent-Start',
            'ID', 'ShippingPromo',
            'campID', shippingPriceAdjustment.campaignID
                ? shippingPriceAdjustment.campaignID
                : 'N/A',
            'promoID', shippingPriceAdjustment.promotionID,
            'value', formatHelpers.formatPrice(shippingPriceAdjustment.price.value),
            'campaign', !shippingPriceAdjustment.isCustom(),
            'coupon', shippingPriceAdjustment.basedOnCoupon
        );

        result.push(shippingPromoUrl);
    });

    return result;
}

/**
 * get order promo reporting urls
 * @param {dw.util.Collection} priceAdjustments - the price adjustments for the line item container
 * @param {Array} reportingURLs - current array of reporting urls
 * @returns {Array} - an array of urls
 */
function getOrderPromoReportingURLs(priceAdjustments, reportingURLs) {
    var result = reportingURLs;

    // Report all price adjustments for the entire order, such as 25% of entire order.
    collections.forEach(priceAdjustments, function (priceAdjustment) {
        var OrderPromoUrl = URLUtils.url('ReportingEvent-Start',
            'ID', 'OrderPromo',
            'campID', priceAdjustment.campaignID ? priceAdjustment.campaignID : 'N/A',
            'promoID', priceAdjustment.promotionID,
            'value', formatHelpers.formatPrice(priceAdjustment.price.value),
            'campaign', !priceAdjustment.isCustom(),
            'coupon', priceAdjustment.basedOnCoupon
        );

        result.push(OrderPromoUrl);
    });

    return result;
}

/**
 * Build the urls that report on the order
 * @param {dw.order.Basket} currentBasket - the basket object
 * @returns {Array} - an array of urls that are used to report on the current basket
 */
function getBasketOpenReportingURLs(currentBasket) {
    var reportingURLs = [];

    // Some common statistic for this cart
    var basketOpen = URLUtils.url('ReportingEvent-Start',
        'ID', 'BasketOpen',
        'BasketID', currentBasket.UUID,
        'Items', formatHelpers.formatNumber(currentBasket.productLineItems.length),
        'MerchandizeTotal', formatHelpers.formatPrice(
            currentBasket.merchandizeTotalPrice.value
        ),
        'AdjMerchandizeTotal', formatHelpers.formatPrice(
            currentBasket.getAdjustedMerchandizeTotalPrice(false).value
        ),
        'AdjMerchandizeTotalPromo', formatHelpers.formatPrice(
            currentBasket.getAdjustedMerchandizeTotalPrice(true).value
        ),
        'ShippingTotal', formatHelpers.formatPrice(currentBasket.shippingTotalPrice.value),
        'AdjShippingTotal', formatHelpers.formatPrice(
            currentBasket.adjustedShippingTotalPrice.value
        )
    );

    reportingURLs.push(basketOpen);

    // Report all price adjustments for the entire cart
    reportingURLs = getOrderPromoReportingURLs(currentBasket.priceAdjustments, reportingURLs);

    // Check all shipments for shipping promotions, lineitems and their promotions
    collections.forEach(currentBasket.shipments, function (shipment) {
        // The shipment might have one or more price adjustments
        reportingURLs = getShippingPromoReportingURLs(shipment, reportingURLs);

        // Each item can have multiple price adjustments
        collections.forEach(shipment.productLineItems, function (productLineItem) {
            reportingURLs = getItemPromoReportingURLs(productLineItem, reportingURLs);
        });
    });


    return reportingURLs;
}

/**
 * Build the urls that report on order placed by a customer
 * @param {number} orderCount - The number of orders this customer placed in the system
 * @param {Array} reportingURLs - current array of reporting urls
 * @returns {Array} - an array of urls that are used to report
 */
function getOrderPlacedReportingURLs(orderCount, reportingURLs) {
    var result = reportingURLs;

    result.push(URLUtils.url('ReportingEvent-Start', 'ID', 'UserOrders', 'Count', formatHelpers.formatNumber(orderCount)));

    return result;
}

/**
 * Build the urls that report on the order
 * @param {dw.order.Order} order - the order object
 * @returns {Array} - an array of urls that are used to report on the current order
 */
function getOrderReportingURLs(order) {
    var reportingURLs = [];

    // Report the general information about the order
    var orderEvent = URLUtils.url('ReportingEvent-Start',
        'ID', 'Order',
        'CurrencyCode', order.currencyCode,
        'CreationDate', StringUtils.formatCalendar(
            new Calendar(order.creationDate), 'yyyyMMdd\'T\'HH:mm:ss.SSSZ'
        ),
        'CreatedBy', order.createdBy,
        'MerchandizeTotalNet', formatHelpers.formatPrice(order.merchandizeTotalNetPrice.value),
        'MerchandizeTotalTax', formatHelpers.formatPrice(order.merchandizeTotalTax.value),
        'MerchandizeTotalGross', formatHelpers.formatPrice(order.merchandizeTotalGrossPrice.value),
        'ShippingNet', formatHelpers.formatPrice(order.shippingTotalNetPrice.value),
        'ShippingTax', formatHelpers.formatPrice(order.shippingTotalTax.value),
        'ShippingGross', formatHelpers.formatPrice(order.shippingTotalGrossPrice.value),
        'AdjMerchandizeTotalNet', formatHelpers.formatPrice(
            order.adjustedMerchandizeTotalNetPrice.value
        ),
        'AdjMerchandizeTotalTax', formatHelpers.formatPrice(
            order.adjustedMerchandizeTotalTax.value
        ),
        'AdjMerchandizeTotalGross', formatHelpers.formatPrice(
            order.adjustedMerchandizeTotalGrossPrice.value
        ),
        'AdjShippingNet', formatHelpers.formatPrice(order.adjustedShippingTotalNetPrice.value),
        'AdjShippingTax', formatHelpers.formatPrice(order.adjustedShippingTotalTax.value),
        'AdjShippingGross', formatHelpers.formatPrice(order.adjustedShippingTotalGrossPrice.value),
        'Net', formatHelpers.formatPrice(order.totalNetPrice.value),
        'Tax', formatHelpers.formatPrice(order.totalTax.value),
        'Gross', formatHelpers.formatPrice(order.totalGrossPrice.value)
    );

    reportingURLs.push(orderEvent);

    // Report all price adjustments for the entire order
    reportingURLs = getOrderPromoReportingURLs(order.priceAdjustments, reportingURLs);
    reportingURLs = getOrderPlacedReportingURLs(order.customer.orderHistory.orderCount, reportingURLs);

    // Check all shipments for shipping promotions, lineitems and their promotions
    collections.forEach(order.shipments, function (shipment) {
        // The shipment might have one or more price adjustments
        reportingURLs = getShippingPromoReportingURLs(shipment, reportingURLs);

        // Log event for each product line item
        collections.forEach(shipment.productLineItems, function (productLineItem) {
            var itemUrl = URLUtils.url('ReportingEvent-Start',
                'ID', 'Item',
                'SKU', productLineItem.productID,
                'Name', productLineItem.productName,
                'UUID', productLineItem.UUID,
                'Quantity', formatHelpers.formatNumber(productLineItem.quantity.value),
                'CurrencyCode', order.currencyCode,
                'Base', formatHelpers.formatPrice(productLineItem.basePrice.value),
                'Net', formatHelpers.formatPrice(productLineItem.netPrice.value),
                'Tax', formatHelpers.formatPrice(productLineItem.tax.value),
                'Gross', formatHelpers.formatPrice(productLineItem.grossPrice.value),
                'AdjNet', formatHelpers.formatPrice(productLineItem.adjustedNetPrice.value),
                'AdjTax', formatHelpers.formatPrice(productLineItem.adjustedTax.value),
                'AdjGross', formatHelpers.formatPrice(productLineItem.adjustedGrossPrice.value),
                'Mfg', productLineItem.manufacturerName,
                'Bonus', productLineItem.bonusProductLineItem
            );

            reportingURLs.push(itemUrl);

            // Each item can have multiple price adjustments
            reportingURLs = getItemPromoReportingURLs(productLineItem, reportingURLs);
        });
    });

    return reportingURLs;
}

/**
 * Build the urls that report on the product search
 * @param {Object} productSearch - product search model
 * @returns {Array} - an array of urls that are used to report
 */
function getProductSearchReportingURLs(productSearch) {
    var result = [];

    result.push(URLUtils.url('ReportingEvent-Start',
        'ID', 'ProductSearch',
        'Phrase', productSearch.searchKeywords,
        'ResultCount', formatHelpers.formatNumber(productSearch.count)
    ));

    return result;
}

/**
 * Build the urls that report on the checkout
 * @param {string} UUID - the target basket's uuid
 * @param {number} step - the step in the checkout
 * @param {string} stepName - the name of the step in checkout
 * @returns {Array} - an array of urls that are used to report
 */
function getCheckoutReportingURLs(UUID, step, stepName) {
    var result = [];

    result.push(URLUtils.url('ReportingEvent-Start',
        'ID', 'Checkout',
        'BasketID', UUID,
        'Step', formatHelpers.formatNumber(step),
        'Name', stepName
    ));

    return result;
}

/**
 * Build the urls that report on account open
 * @param {number} registeredCustomerCount - The number of registered customers in the system
 * @returns {Array} - an array of urls that are used to report
 */
function getAccountOpenReportingURLs(registeredCustomerCount) {
    var result = [];

    result.push(URLUtils.url('ReportingEvent-Start',
        'ID', 'AccountOpen',
        'TotalUserCount', formatHelpers.formatNumber(registeredCustomerCount)
    ));

    return result;
}

module.exports = {
    getItemPromoReportingURLs: getItemPromoReportingURLs,
    getShippingPromoReportingURLs: getShippingPromoReportingURLs,
    getOrderPromoReportingURLs: getOrderPromoReportingURLs,
    getBasketOpenReportingURLs: getBasketOpenReportingURLs,
    getOrderReportingURLs: getOrderReportingURLs,
    getProductSearchReportingURLs: getProductSearchReportingURLs,
    getCheckoutReportingURLs: getCheckoutReportingURLs,
    getAccountOpenReportingURLs: getAccountOpenReportingURLs,
    getOrderPlacedReportingURLs: getOrderPlacedReportingURLs
};
