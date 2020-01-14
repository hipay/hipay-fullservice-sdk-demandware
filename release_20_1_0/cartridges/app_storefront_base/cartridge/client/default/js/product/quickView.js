'use strict';
var base = require('./base');
var focusHelper = require('../components/focus');

/**
 * Generates the modal window on the first call.
 *
 */
function getModalHtmlElement() {
    if ($('#quickViewModal').length !== 0) {
        $('#quickViewModal').remove();
    }
    var htmlString = '<!-- Modal -->'
        + '<div class="modal fade" id="quickViewModal" role="dialog">'
        + '<span class="enter-message sr-only" ></span>'
        + '<div class="modal-dialog quick-view-dialog">'
        + '<!-- Modal content-->'
        + '<div class="modal-content">'
        + '<div class="modal-header">'
        + '    <a class="full-pdp-link" href=""></a>'
        + '    <button type="button" class="close pull-right" data-dismiss="modal">'
        + '        <span aria-hidden="true">&times;</span>'
        + '        <span class="sr-only"> </span>'
        + '    </button>'
        + '</div>'
        + '<div class="modal-body"></div>'
        + '<div class="modal-footer"></div>'
        + '</div>'
        + '</div>'
        + '</div>';
    $('body').append(htmlString);
}

/**
 * @typedef {Object} QuickViewHtml
 * @property {string} body - Main Quick View body
 * @property {string} footer - Quick View footer content
 */

/**
 * Parse HTML code in Ajax response
 *
 * @param {string} html - Rendered HTML from quickview template
 * @return {QuickViewHtml} - QuickView content components
 */
function parseHtml(html) {
    var $html = $('<div>').append($.parseHTML(html));

    var body = $html.find('.product-quickview');
    var footer = $html.find('.modal-footer').children();

    return { body: body, footer: footer };
}

/**
 * replaces the content in the modal window on for the selected product variation.
 * @param {string} selectedValueUrl - url to be used to retrieve a new product model
 */
function fillModalElement(selectedValueUrl) {
    $('.modal-body').spinner().start();
    $.ajax({
        url: selectedValueUrl,
        method: 'GET',
        dataType: 'json',
        success: function (data) {
            var parsedHtml = parseHtml(data.renderedTemplate);

            $('.modal-body').empty();
            $('.modal-body').html(parsedHtml.body);
            $('.modal-footer').html(parsedHtml.footer);
            $('.full-pdp-link').text(data.quickViewFullDetailMsg);
            $('#quickViewModal .full-pdp-link').attr('href', data.productUrl);
            $('#quickViewModal .size-chart').attr('href', data.productUrl);
            $('#quickViewModal .modal-header .close .sr-only').text(data.closeButtonText);
            $('#quickViewModal .enter-message').text(data.enterDialogMessage);
            $('#quickViewModal').modal('show');

            $.spinner().stop();
        },
        error: function () {
            $.spinner().stop();
        }
    });
}

module.exports = {
    showQuickview: function () {
        $('body').on('click', '.quickview', function (e) {
            e.preventDefault();
            var selectedValueUrl = $(this).closest('a.quickview').attr('href');
            $(e.target).trigger('quickview:show');
            getModalHtmlElement();
            fillModalElement(selectedValueUrl);
        });
    },
    focusQuickview: function () {
        $('body').on('shown.bs.modal', '#quickViewModal', function () {
            $('#quickViewModal .close').focus();
        });
    },
    trapQuickviewFocus: function () {
        $('body').on('keydown', '#quickViewModal', function (e) {
            var focusParams = {
                event: e,
                containerSelector: '#quickViewModal',
                firstElementSelector: '.full-pdp-link',
                lastElementSelector: '.add-to-cart-global',
                nextToLastElementSelector: '.modal-footer .quantity-select'
            };
            focusHelper.setTabNextFocus(focusParams);
        });
    },
    availability: base.availability,
    addToCart: base.addToCart,
    showSpinner: function () {
        $('body').on('product:beforeAddToCart', function (e, data) {
            $(data).closest('.modal-content').spinner().start();
        });
    },
    hideDialog: function () {
        $('body').on('product:afterAddToCart', function () {
            $('#quickViewModal').modal('hide');
        });
    },
    beforeUpdateAttribute: function () {
        $('body').on('product:beforeAttributeSelect', function () {
            $('.modal.show .modal-content').spinner().start();
        });
    },
    updateAttribute: function () {
        $('body').on('product:afterAttributeSelect', function (e, response) {
            if ($('.modal.show .product-quickview>.bundle-items').length) {
                $('.modal.show').find(response.container).data('pid', response.data.product.id);
                $('.modal.show').find(response.container)
                    .find('.product-id').text(response.data.product.id);
            } else if ($('.set-items').length) {
                response.container.find('.product-id').text(response.data.product.id);
            } else {
                $('.modal.show .product-quickview').data('pid', response.data.product.id);
                $('.modal.show .full-pdp-link')
                    .attr('href', response.data.product.selectedProductUrl);
            }
        });
    },
    updateAddToCart: function () {
        $('body').on('product:updateAddToCart', function (e, response) {
            // update local add to cart (for sets)
            $('button.add-to-cart', response.$productContainer).attr('disabled',
                (!response.product.readyToOrder || !response.product.available));

            // update global add to cart (single products, bundles)
            var dialog = $(response.$productContainer)
                .closest('.quick-view-dialog');

            $('.add-to-cart-global', dialog).attr('disabled',
                !$('.global-availability', dialog).data('ready-to-order')
                || !$('.global-availability', dialog).data('available')
            );
        });
    },
    updateAvailability: function () {
        $('body').on('product:updateAvailability', function (e, response) {
            // bundle individual products
            $('.product-availability', response.$productContainer)
                .data('ready-to-order', response.product.readyToOrder)
                .data('available', response.product.available)
                .find('.availability-msg')
                .empty()
                .html(response.message);


            var dialog = $(response.$productContainer)
                .closest('.quick-view-dialog');

            if ($('.product-availability', dialog).length) {
                // bundle all products
                var allAvailable = $('.product-availability', dialog).toArray()
                    .every(function (item) { return $(item).data('available'); });

                var allReady = $('.product-availability', dialog).toArray()
                    .every(function (item) { return $(item).data('ready-to-order'); });

                $('.global-availability', dialog)
                    .data('ready-to-order', allReady)
                    .data('available', allAvailable);

                $('.global-availability .availability-msg', dialog).empty()
                    .html(allReady ? response.message : response.resources.info_selectforstock);
            } else {
                // single product
                $('.global-availability', dialog)
                    .data('ready-to-order', response.product.readyToOrder)
                    .data('available', response.product.available)
                    .find('.availability-msg')
                    .empty()
                    .html(response.message);
            }
        });
    }
};
