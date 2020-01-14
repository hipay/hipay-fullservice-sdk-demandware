'use strict';

/**
 * updates the totals summary
 * @param {Array} totals - the totals data
 */
function updateTotals(totals) {
    $('.shipping-total-cost').text(totals.totalShippingCost);
    $('.tax-total').text(totals.totalTax);
    $('.sub-total').text(totals.subTotal);
    $('.grand-total-sum').text(totals.grandTotal);

    if (totals.orderLevelDiscountTotal.value > 0) {
        $('.order-discount').show();
        $('.order-discount-total').text('- ' + totals.orderLevelDiscountTotal.formatted);
    } else {
        $('.order-discount').hide();
    }

    if (totals.shippingLevelDiscountTotal.value > 0) {
        $('.shipping-discount').show();
        $('.shipping-discount-total').text('- ' +
            totals.shippingLevelDiscountTotal.formatted);
    } else {
        $('.shipping-discount').hide();
    }
}

/**
 * updates the order product shipping summary for an order model
 * @param {Object} order - the order model
 */
function updateOrderProductSummaryInformation(order) {
    var $productSummary = $('<div />');
    order.shipping.forEach(function (shipping) {
        shipping.productLineItems.items.forEach(function (lineItem) {
            var pli = $('[data-product-line-item=' + lineItem.UUID + ']');
            $productSummary.append(pli);
        });

        var address = shipping.shippingAddress || {};
        var selectedMethod = shipping.selectedShippingMethod;

        var nameLine = address.firstName ? address.firstName + ' ' : '';
        if (address.lastName) nameLine += address.lastName;

        var address1Line = address.address1;
        var address2Line = address.address2;

        var phoneLine = address.phone;

        var shippingCost = selectedMethod ? selectedMethod.shippingCost : '';
        var methodNameLine = selectedMethod ? selectedMethod.displayName : '';
        var methodArrivalTime = selectedMethod && selectedMethod.estimatedArrivalTime
            ? '( ' + selectedMethod.estimatedArrivalTime + ' )'
            : '';

        var tmpl = $('#pli-shipping-summary-template').clone();

        if (shipping.productLineItems.items && shipping.productLineItems.items.length > 1) {
            $('h5 > span').text(' - ' + shipping.productLineItems.items.length + ' '
                + order.resources.items);
        } else {
            $('h5 > span').text('');
        }

        var stateRequiredAttr = $('#shippingState').attr('required');
        var isRequired = stateRequiredAttr !== undefined && stateRequiredAttr !== false;
        var stateExists = (shipping.shippingAddress && shipping.shippingAddress.stateCode)
            ? shipping.shippingAddress.stateCode
            : false;
        var stateBoolean = false;
        if ((isRequired && stateExists) || (!isRequired)) {
            stateBoolean = true;
        }

        var shippingForm = $('.multi-shipping input[name="shipmentUUID"][value="' + shipping.UUID + '"]').parent();

        if (shipping.shippingAddress
            && shipping.shippingAddress.firstName
            && shipping.shippingAddress.address1
            && shipping.shippingAddress.city
            && stateBoolean
            && shipping.shippingAddress.countryCode
            && (shipping.shippingAddress.phone || shipping.productLineItems.items[0].fromStoreId)) {
            $('.ship-to-name', tmpl).text(nameLine);
            $('.ship-to-address1', tmpl).text(address1Line);
            $('.ship-to-address2', tmpl).text(address2Line);
            $('.ship-to-city', tmpl).text(address.city);
            if (address.stateCode) {
                $('.ship-to-st', tmpl).text(address.stateCode);
            }
            $('.ship-to-zip', tmpl).text(address.postalCode);
            $('.ship-to-phone', tmpl).text(phoneLine);

            if (!address2Line) {
                $('.ship-to-address2', tmpl).hide();
            }

            if (!phoneLine) {
                $('.ship-to-phone', tmpl).hide();
            }

            shippingForm.find('.ship-to-message').text('');
        } else {
            shippingForm.find('.ship-to-message').text(order.resources.addressIncomplete);
        }

        if (shipping.isGift) {
            $('.gift-message-summary', tmpl).text(shipping.giftMessage);
        } else {
            $('.gift-summary', tmpl).addClass('d-none');
        }

        // checking h5 title shipping to or pickup
        var $shippingAddressLabel = $('.shipping-header-text', tmpl);
        $('body').trigger('shipping:updateAddressLabelText',
            { selectedShippingMethod: selectedMethod, resources: order.resources, shippingAddressLabel: $shippingAddressLabel });

        if (shipping.selectedShippingMethod) {
            $('.display-name', tmpl).text(methodNameLine);
            $('.arrival-time', tmpl).text(methodArrivalTime);
            $('.price', tmpl).text(shippingCost);
        }

        var $shippingSummary = $('<div class="multi-shipping" data-shipment-summary="'
            + shipping.UUID + '" />');
        $shippingSummary.html(tmpl.html());
        $productSummary.append($shippingSummary);
    });

    $('.product-summary-block').html($productSummary.html());
}

module.exports = {
    updateTotals: updateTotals,
    updateOrderProductSummaryInformation: updateOrderProductSummaryInformation
};
