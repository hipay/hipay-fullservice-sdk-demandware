'use strict';

var addressHelpers = require('./address');
var formHelpers = require('./formErrors');
var scrollAnimate = require('../components/scrollAnimate');

/**
 * updates the shipping address selector within shipping forms
 * @param {Object} productLineItem - the productLineItem model
 * @param {Object} shipping - the shipping (shipment model) model
 * @param {Object} order - the order model
 * @param {Object} customer - the customer model
 */
function updateShippingAddressSelector(productLineItem, shipping, order, customer) {
    var uuidEl = $('input[value=' + productLineItem.UUID + ']');
    var shippings = order.shipping;

    var form;
    var $shippingAddressSelector;
    var hasSelectedAddress = false;

    if (uuidEl && uuidEl.length > 0) {
        form = uuidEl[0].form;
        $shippingAddressSelector = $('.addressSelector', form);
    }

    if ($shippingAddressSelector && $shippingAddressSelector.length === 1) {
        $shippingAddressSelector.empty();
        // Add New Address option
        $shippingAddressSelector.append(addressHelpers.methods.optionValueForAddress(
            null,
            false,
            order
        ));

        if (customer.addresses && customer.addresses.length > 0) {
            $shippingAddressSelector.append(addressHelpers.methods.optionValueForAddress(
                order.resources.accountAddresses,
                false,
                order
            ));

            customer.addresses.forEach(function (address) {
                var isSelected = shipping.matchingAddressId === address.ID;
                $shippingAddressSelector.append(
                    addressHelpers.methods.optionValueForAddress(
                        { UUID: 'ab_' + address.ID, shippingAddress: address },
                        isSelected,
                        order
                    )
                );
            });
        }
        // Separator -
        $shippingAddressSelector.append(addressHelpers.methods.optionValueForAddress(
            order.resources.shippingAddresses, false, order, { className: 'multi-shipping' }
        ));
        shippings.forEach(function (aShipping) {
            var isSelected = shipping.UUID === aShipping.UUID;
            hasSelectedAddress = hasSelectedAddress || isSelected;
            var addressOption = addressHelpers.methods.optionValueForAddress(
                aShipping,
                isSelected,
                order,
                { className: 'multi-shipping' }
            );

            var newAddress = addressOption.html() === order.resources.addNewAddress;
            var matchingUUID = aShipping.UUID === shipping.UUID;
            if ((newAddress && matchingUUID) || (!newAddress && matchingUUID) || (!newAddress && !matchingUUID)) {
                $shippingAddressSelector.append(addressOption);
            }
            if (newAddress && !matchingUUID) {
                $(addressOption[0]).remove();
            }
        });
    }

    if (!hasSelectedAddress) {
        // show
        $(form).addClass('hide-details');
    } else {
        $(form).removeClass('hide-details');
    }

    $('body').trigger('shipping:updateShippingAddressSelector', {
        productLineItem: productLineItem,
        shipping: shipping,
        order: order,
        customer: customer
    });
}

/**
 * updates the shipping address form values within shipping forms
 * @param {Object} shipping - the shipping (shipment model) model
 */
function updateShippingAddressFormValues(shipping) {
    var addressObject = $.extend({}, shipping.shippingAddress);

    if (!addressObject) {
        addressObject = {
            firstName: null,
            lastName: null,
            address1: null,
            address2: null,
            city: null,
            postalCode: null,
            stateCode: null,
            countryCode: null,
            phone: null
        };
    }

    addressObject.isGift = shipping.isGift;
    addressObject.giftMessage = shipping.giftMessage;

    $('input[value=' + shipping.UUID + ']').each(function (formIndex, el) {
        var form = el.form;
        if (!form) return;
        var countryCode = addressObject.countryCode;

        $('input[name$=_firstName]', form).val(addressObject.firstName);
        $('input[name$=_lastName]', form).val(addressObject.lastName);
        $('input[name$=_address1]', form).val(addressObject.address1);
        $('input[name$=_address2]', form).val(addressObject.address2);
        $('input[name$=_city]', form).val(addressObject.city);
        $('input[name$=_postalCode]', form).val(addressObject.postalCode);
        $('select[name$=_stateCode],input[name$=_stateCode]', form)
            .val(addressObject.stateCode);

        if (countryCode && typeof countryCode === 'object') {
            $('select[name$=_country]', form).val(addressObject.countryCode.value);
        } else {
            $('select[name$=_country]', form).val(addressObject.countryCode);
        }

        $('input[name$=_phone]', form).val(addressObject.phone);

        $('input[name$=_isGift]', form).prop('checked', addressObject.isGift);
        $('textarea[name$=_giftMessage]', form).val(addressObject.isGift && addressObject.giftMessage ? addressObject.giftMessage : '');
    });

    $('body').trigger('shipping:updateShippingAddressFormValues', { shipping: shipping });
}

/**
 * updates the shipping method radio buttons within shipping forms
 * @param {Object} shipping - the shipping (shipment model) model
 */
function updateShippingMethods(shipping) {
    var uuidEl = $('input[value=' + shipping.UUID + ']');
    if (uuidEl && uuidEl.length > 0) {
        $.each(uuidEl, function (shipmentIndex, el) {
            var form = el.form;
            if (!form) return;

            var $shippingMethodList = $('.shipping-method-list', form);

            if ($shippingMethodList && $shippingMethodList.length > 0) {
                $shippingMethodList.empty();
                var shippingMethods = shipping.applicableShippingMethods;
                var selected = shipping.selectedShippingMethod || {};
                var shippingMethodFormID = form.name + '_shippingAddress_shippingMethodID';
                //
                // Create the new rows for each shipping method
                //
                $.each(shippingMethods, function (methodIndex, shippingMethod) {
                    var tmpl = $('#shipping-method-template').clone();
                    // set input
                    $('input', tmpl)
                        .prop('id', 'shippingMethod-' + shippingMethod.ID + '-' + shipping.UUID)
                        .prop('name', shippingMethodFormID)
                        .prop('value', shippingMethod.ID)
                        .attr('checked', shippingMethod.ID === selected.ID);

                    $('label', tmpl)
                        .prop('for', 'shippingMethod-' + shippingMethod.ID + '-' + shipping.UUID);
                    // set shipping method name
                    $('.display-name', tmpl).text(shippingMethod.displayName);
                    // set or hide arrival time
                    if (shippingMethod.estimatedArrivalTime) {
                        $('.arrival-time', tmpl)
                            .text('(' + shippingMethod.estimatedArrivalTime + ')')
                            .show();
                    }
                    // set shipping cost
                    $('.shipping-cost', tmpl).text(shippingMethod.shippingCost);
                    $shippingMethodList.append(tmpl.html());
                });
            }
        });
    }

    $('body').trigger('shipping:updateShippingMethods', { shipping: shipping });
}

/**
 * Update list of available shipping methods whenever user modifies shipping address details.
 * @param {jQuery} $shippingForm - current shipping form
 */
function updateShippingMethodList($shippingForm) {
    // delay for autocomplete!
    setTimeout(function () {
        var $shippingMethodList = $shippingForm.find('.shipping-method-list');
        var urlParams = addressHelpers.methods.getAddressFieldsFromUI($shippingForm);
        var shipmentUUID = $shippingForm.find('[name=shipmentUUID]').val();
        var url = $shippingMethodList.data('actionUrl');
        urlParams.shipmentUUID = shipmentUUID;

        $shippingMethodList.spinner().start();
        $.ajax({
            url: url,
            type: 'post',
            dataType: 'json',
            data: urlParams,
            success: function (data) {
                if (data.error) {
                    window.location.href = data.redirectUrl;
                } else {
                    $('body').trigger('checkout:updateCheckoutView',
                        {
                            order: data.order,
                            customer: data.customer,
                            options: { keepOpen: true }
                        });

                    $shippingMethodList.spinner().stop();
                }
            }
        });
    }, 300);
}

/**
 * updates the order shipping summary for an order shipment model
 * @param {Object} shipping - the shipping (shipment model) model
 * @param {Object} order - the order model
 */
function updateShippingSummaryInformation(shipping, order) {
    $('[data-shipment-summary=' + shipping.UUID + ']').each(function (i, el) {
        var $container = $(el);
        var $shippingAddressLabel = $container.find('.shipping-addr-label');
        var $addressContainer = $container.find('.address-summary');
        var $shippingPhone = $container.find('.shipping-phone');
        var $methodTitle = $container.find('.shipping-method-title');
        var $methodArrivalTime = $container.find('.shipping-method-arrival-time');
        var $methodPrice = $container.find('.shipping-method-price');
        var $shippingSummaryLabel = $container.find('.shipping-method-label');
        var $summaryDetails = $container.find('.row.summary-details');
        var giftMessageSummary = $container.find('.gift-summary');

        var address = shipping.shippingAddress;
        var selectedShippingMethod = shipping.selectedShippingMethod;
        var isGift = shipping.isGift;

        addressHelpers.methods.populateAddressSummary($addressContainer, address);

        if (address && address.phone) {
            $shippingPhone.text(address.phone);
        } else {
            $shippingPhone.empty();
        }

        if (selectedShippingMethod) {
            $('body').trigger('shipping:updateAddressLabelText',
                { selectedShippingMethod: selectedShippingMethod, resources: order.resources, shippingAddressLabel: $shippingAddressLabel });
            $shippingSummaryLabel.show();
            $summaryDetails.show();
            $methodTitle.text(selectedShippingMethod.displayName);
            if (selectedShippingMethod.estimatedArrivalTime) {
                $methodArrivalTime.text(
                    '( ' + selectedShippingMethod.estimatedArrivalTime + ' )'
                );
            } else {
                $methodArrivalTime.empty();
            }
            $methodPrice.text(selectedShippingMethod.shippingCost);
        }

        if (isGift) {
            giftMessageSummary.find('.gift-message-summary').text(shipping.giftMessage);
            giftMessageSummary.removeClass('d-none');
        } else {
            giftMessageSummary.addClass('d-none');
        }
    });

    $('body').trigger('shipping:updateShippingSummaryInformation', { shipping: shipping, order: order });
}

/**
 * Update the read-only portion of the shipment display (per PLI)
 * @param {Object} productLineItem - the productLineItem model
 * @param {Object} shipping - the shipping (shipment model) model
 * @param {Object} order - the order model
 * @param {Object} [options] - options for updating PLI summary info
 * @param {Object} [options.keepOpen] - if true, prevent changing PLI view mode to 'view'
 */
function updatePLIShippingSummaryInformation(productLineItem, shipping, order, options) {
    var $pli = $('input[value=' + productLineItem.UUID + ']');
    var form = $pli && $pli.length > 0 ? $pli[0].form : null;

    if (!form) return;

    var $viewBlock = $('.view-address-block', form);

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
        ? '(' + selectedMethod.estimatedArrivalTime + ')'
        : '';

    var tmpl = $('#pli-shipping-summary-template').clone();

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

    if (shipping.selectedShippingMethod) {
        $('.display-name', tmpl).text(methodNameLine);
        $('.arrival-time', tmpl).text(methodArrivalTime);
        $('.price', tmpl).text(shippingCost);
    }

    if (shipping.isGift) {
        $('.gift-message-summary', tmpl).text(shipping.giftMessage);
        var shipment = $('.gift-message-' + shipping.UUID);
        $(shipment).val(shipping.giftMessage);
    } else {
        $('.gift-summary', tmpl).addClass('d-none');
    }
    // checking h5 title shipping to or pickup
    var $shippingAddressLabel = $('.shipping-header-text', tmpl);
    $('body').trigger('shipping:updateAddressLabelText',
        { selectedShippingMethod: selectedMethod, resources: order.resources, shippingAddressLabel: $shippingAddressLabel });

    $viewBlock.html(tmpl.html());

    $('body').trigger('shipping:updatePLIShippingSummaryInformation', {
        productLineItem: productLineItem,
        shipping: shipping,
        order: order,
        options: options
    });
}

/**
 * Update the hidden form values that associate shipping info with product line items
 * @param {Object} productLineItem - the productLineItem model
 * @param {Object} shipping - the shipping (shipment model) model
 */
function updateProductLineItemShipmentUUIDs(productLineItem, shipping) {
    $('input[value=' + productLineItem.UUID + ']').each(function (key, pli) {
        var form = pli.form;
        $('[name=shipmentUUID]', form).val(shipping.UUID);
        $('[name=originalShipmentUUID]', form).val(shipping.UUID);

        $(form).closest('.card').attr('data-shipment-uuid', shipping.UUID);
    });

    $('body').trigger('shipping:updateProductLineItemShipmentUUIDs', {
        productLineItem: productLineItem,
        shipping: shipping
    });
}

/**
 * Update the shipping UI for a single shipping info (shipment model)
 * @param {Object} shipping - the shipping (shipment model) model
 * @param {Object} order - the order/basket model
 * @param {Object} customer - the customer model
 * @param {Object} [options] - options for updating PLI summary info
 * @param {Object} [options.keepOpen] - if true, prevent changing PLI view mode to 'view'
 */
function updateShippingInformation(shipping, order, customer, options) {
    // First copy over shipmentUUIDs from response, to each PLI form
    order.shipping.forEach(function (aShipping) {
        aShipping.productLineItems.items.forEach(function (productLineItem) {
            updateProductLineItemShipmentUUIDs(productLineItem, aShipping);
        });
    });

    // Now update shipping information, based on those associations
    updateShippingMethods(shipping);
    updateShippingAddressFormValues(shipping);
    updateShippingSummaryInformation(shipping, order);

    // And update the PLI-based summary information as well
    shipping.productLineItems.items.forEach(function (productLineItem) {
        updateShippingAddressSelector(productLineItem, shipping, order, customer);
        updatePLIShippingSummaryInformation(productLineItem, shipping, order, options);
    });

    $('body').trigger('shipping:updateShippingInformation', {
        order: order,
        shipping: shipping,
        customer: customer,
        options: options
    });
}

/**
 * Update the checkout state (single vs. multi-ship)
 * @param {Object} order - checkout model to use as basis of new truth
 */
function updateMultiShipInformation(order) {
    var $checkoutMain = $('#checkout-main');
    var $checkbox = $('[name=usingMultiShipping]');
    var $submitShippingBtn = $('button.submit-shipping');
    $('.shipping-error .alert-danger').remove();

    if (order.usingMultiShipping) {
        $checkoutMain.addClass('multi-ship');
        $checkbox.prop('checked', true);
    } else {
        $checkoutMain.removeClass('multi-ship');
        $checkbox.prop('checked', null);
        $submitShippingBtn.prop('disabled', null);
    }

    $('body').trigger('shipping:updateMultiShipInformation', { order: order });
}

/**
  * Create an alert to display the error message
  * @param {Object} message - Error message to display
  */
function createErrorNotification(message) {
    var errorHtml = '<div class="alert alert-danger alert-dismissible valid-cart-error ' +
    'fade show" role="alert">' +
    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
    '<span aria-hidden="true">&times;</span>' +
    '</button>' + message + '</div>';

    $('.shipping-error').append(errorHtml);
    scrollAnimate($('.shipping-error'));
}

/**
 * Handle response from the server for valid or invalid form fields.
 * @param {Object} defer - the deferred object which will resolve on success or reject.
 * @param {Object} data - the response data with the invalid form fields or
 *  valid model data.
 */
function shippingFormResponse(defer, data) {
    var isMultiShip = $('#checkout-main').hasClass('multi-ship');
    var formSelector = isMultiShip
        ? '.multi-shipping .active form'
        : '.single-shipping form';

    // highlight fields with errors
    if (data.error) {
        if (data.fieldErrors.length) {
            data.fieldErrors.forEach(function (error) {
                if (Object.keys(error).length) {
                    formHelpers.loadFormErrors(formSelector, error);
                }
            });
            defer.reject(data);
        }

        if (data.serverErrors && data.serverErrors.length) {
            $.each(data.serverErrors, function (index, element) {
                createErrorNotification(element);
            });

            defer.reject(data);
        }

        if (data.cartError) {
            window.location.href = data.redirectUrl;
            defer.reject();
        }
    } else {
        // Populate the Address Summary

        $('body').trigger('checkout:updateCheckoutView', {
            order: data.order,
            customer: data.customer
        });
        scrollAnimate($('.payment-form'));
        defer.resolve(data);
    }
}
/**
 * Clear out all the shipping form values and select the new address in the drop down
 * @param {Object} order - the order object
 */
function clearShippingForms(order) {
    order.shipping.forEach(function (shipping) {
        $('input[value=' + shipping.UUID + ']').each(function (formIndex, el) {
            var form = el.form;
            if (!form) return;

            $('input[name$=_firstName]', form).val('');
            $('input[name$=_lastName]', form).val('');
            $('input[name$=_address1]', form).val('');
            $('input[name$=_address2]', form).val('');
            $('input[name$=_city]', form).val('');
            $('input[name$=_postalCode]', form).val('');
            $('select[name$=_stateCode],input[name$=_stateCode]', form).val('');
            $('select[name$=_country]', form).val('');

            $('input[name$=_phone]', form).val('');

            $('input[name$=_isGift]', form).prop('checked', false);
            $('textarea[name$=_giftMessage]', form).val('');
            $(form).find('.gift-message').addClass('d-none');

            $(form).attr('data-address-mode', 'new');
            var addressSelectorDropDown = $('.addressSelector option[value=new]', form);
            $(addressSelectorDropDown).prop('selected', true);
        });
    });

    $('body').trigger('shipping:clearShippingForms', { order: order });
}

/**
 * Does Ajax call to create a server-side shipment w/ pliUUID & URL
 * @param {string} url - string representation of endpoint URL
 * @param {Object} shipmentData - product line item UUID
 * @returns {Object} - promise value for async call
 */
function createNewShipment(url, shipmentData) {
    $.spinner().start();
    return $.ajax({
        url: url,
        type: 'post',
        dataType: 'json',
        data: shipmentData
    });
}

/**
 * Does Ajax call to select shipping method
 * @param {string} url - string representation of endpoint URL
 * @param {Object} urlParams - url params
 * @param {Object} el - element that triggered this call
 */
function selectShippingMethodAjax(url, urlParams, el) {
    $.spinner().start();
    $.ajax({
        url: url,
        type: 'post',
        dataType: 'json',
        data: urlParams
    })
        .done(function (data) {
            if (data.error) {
                window.location.href = data.redirectUrl;
            } else {
                $('body').trigger('checkout:updateCheckoutView',
                    {
                        order: data.order,
                        customer: data.customer,
                        options: { keepOpen: true },
                        urlParams: urlParams
                    }
                );
                $('body').trigger('checkout:postUpdateCheckoutView',
                    {
                        el: el
                    }
                );
            }
            $.spinner().stop();
        })
        .fail(function () {
            $.spinner().stop();
        });
}

/**
 * Hide and show to appropriate elements to show the multi ship shipment cards in the enter view
 * @param {jQuery} element - The shipping content
 */
function enterMultishipView(element) {
    element.find('.btn-enter-multi-ship').removeClass('d-none');

    element.find('.view-address-block').addClass('d-none');
    element.find('.shipping-address').addClass('d-none');
    element.find('.btn-save-multi-ship.save-shipment').addClass('d-none');
    element.find('.btn-edit-multi-ship').addClass('d-none');
    element.find('.multi-ship-address-actions').addClass('d-none');
}

/**
 * Hide and show to appropriate elements to show the multi ship shipment cards in the view mode
 * @param {jQuery} element - The shipping content
 */
function viewMultishipAddress(element) {
    element.find('.view-address-block').removeClass('d-none');
    element.find('.btn-edit-multi-ship').removeClass('d-none');

    element.find('.shipping-address').addClass('d-none');
    element.find('.btn-save-multi-ship.save-shipment').addClass('d-none');
    element.find('.btn-enter-multi-ship').addClass('d-none');
    element.find('.multi-ship-address-actions').addClass('d-none');
}

/**
 * Hide and show to appropriate elements that allows the user to edit multi ship address information
 * @param {jQuery} element - The shipping content
 */
function editMultiShipAddress(element) {
    // Show
    element.find('.shipping-address').removeClass('d-none');
    element.find('.btn-save-multi-ship.save-shipment').removeClass('d-none');

    // Hide
    element.find('.view-address-block').addClass('d-none');
    element.find('.btn-enter-multi-ship').addClass('d-none');
    element.find('.btn-edit-multi-ship').addClass('d-none');
    element.find('.multi-ship-address-actions').addClass('d-none');

    $('body').trigger('shipping:editMultiShipAddress', { element: element, form: element.find('.shipping-form') });
}

/**
 * perform the proper actions once a user has clicked enter address or edit address for a shipment
 * @param {jQuery} element - The shipping content
 * @param {string} mode - the address mode
 */
function editOrEnterMultiShipInfo(element, mode) {
    var form = $(element).closest('form');
    var root = $(element).closest('.shipping-content');

    $('body').trigger('shipping:updateDataAddressMode', { form: form, mode: mode });

    editMultiShipAddress(root);

    var addressInfo = addressHelpers.methods.getAddressFieldsFromUI(form);

    var savedState = {
        UUID: $('input[name=shipmentUUID]', form).val(),
        shippingAddress: addressInfo
    };

    root.data('saved-state', JSON.stringify(savedState));
}

module.exports = {
    methods: {
        updateShippingAddressSelector: updateShippingAddressSelector,
        updateShippingAddressFormValues: updateShippingAddressFormValues,
        updateShippingMethods: updateShippingMethods,
        updateShippingSummaryInformation: updateShippingSummaryInformation,
        updatePLIShippingSummaryInformation: updatePLIShippingSummaryInformation,
        updateProductLineItemShipmentUUIDs: updateProductLineItemShipmentUUIDs,
        updateShippingInformation: updateShippingInformation,
        updateMultiShipInformation: updateMultiShipInformation,
        shippingFormResponse: shippingFormResponse,
        createNewShipment: createNewShipment,
        selectShippingMethodAjax: selectShippingMethodAjax,
        updateShippingMethodList: updateShippingMethodList,
        clearShippingForms: clearShippingForms,
        editMultiShipAddress: editMultiShipAddress,
        editOrEnterMultiShipInfo: editOrEnterMultiShipInfo,
        createErrorNotification: createErrorNotification,
        viewMultishipAddress: viewMultishipAddress
    },

    selectShippingMethod: function () {
        var baseObj = this;

        $('.shipping-method-list').change(function () {
            var $shippingForm = $(this).parents('form');
            var methodID = $(':checked', this).val();
            var shipmentUUID = $shippingForm.find('[name=shipmentUUID]').val();
            var urlParams = addressHelpers.methods.getAddressFieldsFromUI($shippingForm);
            urlParams.shipmentUUID = shipmentUUID;
            urlParams.methodID = methodID;
            urlParams.isGift = $shippingForm.find('.gift').prop('checked');
            urlParams.giftMessage = $shippingForm.find('textarea[name$=_giftMessage]').val();

            var url = $(this).data('select-shipping-method-url');

            if (baseObj.methods && baseObj.methods.selectShippingMethodAjax) {
                baseObj.methods.selectShippingMethodAjax(url, urlParams, $(this));
            } else {
                selectShippingMethodAjax(url, urlParams, $(this));
            }
        });
    },

    toggleMultiship: function () {
        var baseObj = this;

        $('input[name="usingMultiShipping"]').on('change', function () {
            var url = $('.multi-shipping-checkbox-block form').attr('action');
            var usingMultiShip = this.checked;

            $.ajax({
                url: url,
                type: 'post',
                dataType: 'json',
                data: { usingMultiShip: usingMultiShip },
                success: function (response) {
                    if (response.error) {
                        window.location.href = response.redirectUrl;
                    } else {
                        $('body').trigger('checkout:updateCheckoutView', {
                            order: response.order,
                            customer: response.customer
                        });

                        if ($('#checkout-main').data('customer-type') === 'guest') {
                            if (baseObj.methods && baseObj.methods.clearShippingForms) {
                                baseObj.methods.clearShippingForms(response.order);
                            } else {
                                clearShippingForms(response.order);
                            }
                        } else {
                            response.order.shipping.forEach(function (shipping) {
                                $('input[value=' + shipping.UUID + ']').each(function (formIndex, el) {
                                    var form = el.form;
                                    if (!form) return;

                                    $(form).attr('data-address-mode', 'edit');
                                    var addressSelectorDropDown = $(form).find('.addressSelector option[value="ab_' + shipping.matchingAddressId + '"]');
                                    $(addressSelectorDropDown).prop('selected', true);
                                    $('input[name$=_isGift]', form).prop('checked', false);
                                    $('textarea[name$=_giftMessage]', form).val('');
                                    $(form).find('.gift-message').addClass('d-none');
                                });
                            });
                        }

                        if (usingMultiShip) {
                            $('body').trigger('shipping:selectMultiShipping', { data: response });
                        } else {
                            $('body').trigger('shipping:selectSingleShipping', { data: response });
                        }
                    }

                    $.spinner().stop();
                },
                error: function () {
                    $.spinner().stop();
                }
            });
        });
    },

    selectSingleShipping: function () {
        $('body').on('shipping:selectSingleShipping', function () {
            $('.single-shipping .shipping-address').removeClass('d-none');
        });
    },

    selectMultiShipping: function () {
        var baseObj = this;

        $('body').on('shipping:selectMultiShipping', function (e, data) {
            $('.multi-shipping .shipping-address').addClass('d-none');

            data.data.order.shipping.forEach(function (shipping) {
                var element = $('.multi-shipping .card[data-shipment-uuid="' + shipping.UUID + '"]');

                if (shipping.shippingAddress) {
                    if (baseObj.methods && baseObj.methods.viewMultishipAddress) {
                        baseObj.methods.viewMultishipAddress($(element));
                    } else {
                        viewMultishipAddress($(element));
                    }
                } else {
                    /* eslint-disable no-lonely-if */
                    if (baseObj.methods && baseObj.methods.enterMultishipView) {
                        baseObj.methods.enterMultishipView($(element));
                    } else {
                        enterMultishipView($(element));
                    }
                    /* eslint-enable no-lonely-if */
                }
            });
        });
    },

    selectSingleShipAddress: function () {
        $('.single-shipping .addressSelector').on('change', function () {
            var form = $(this).parents('form')[0];
            var selectedOption = $('option:selected', this);
            var attrs = selectedOption.data();
            var shipmentUUID = selectedOption[0].value;
            var originalUUID = $('input[name=shipmentUUID]', form).val();
            var element;

            Object.keys(attrs).forEach(function (attr) {
                element = attr === 'countryCode' ? 'country' : attr;
                $('[name$=' + element + ']', form).val(attrs[attr]);
            });

            $('[name$=stateCode]', form).trigger('change');

            if (shipmentUUID === 'new') {
                $(form).attr('data-address-mode', 'new');
            } else if (shipmentUUID === originalUUID) {
                $(form).attr('data-address-mode', 'shipment');
            } else if (shipmentUUID.indexOf('ab_') === 0) {
                $(form).attr('data-address-mode', 'customer');
            } else {
                $(form).attr('data-address-mode', 'edit');
            }
        });
    },

    selectMultiShipAddress: function () {
        var baseObj = this;

        $('.multi-shipping .addressSelector').on('change', function () {
            var form = $(this).closest('form');
            var selectedOption = $('option:selected', this);
            var attrs = selectedOption.data();
            var shipmentUUID = selectedOption[0].value;
            var originalUUID = $('input[name=shipmentUUID]', form).val();
            var pliUUID = $('input[name=productLineItemUUID]', form).val();
            var createNewShipmentScoped = baseObj.methods && baseObj.methods.createNewShipment ? baseObj.methods.createNewShipment : createNewShipment;

            var element;
            Object.keys(attrs).forEach(function (attr) {
                if (attr === 'isGift') {
                    $('[name$=' + attr + ']', form).prop('checked', attrs[attr]);
                    $('[name$=' + attr + ']', form).trigger('change');
                } else {
                    element = attr === 'countryCode' ? 'country' : attr;
                    $('[name$=' + element + ']', form).val(attrs[attr]);
                }
            });

            if (shipmentUUID === 'new' && pliUUID) {
                var createShipmentUrl = $(this).attr('data-create-shipment-url');
                createNewShipmentScoped(createShipmentUrl, { productLineItemUUID: pliUUID })
                    .done(function (response) {
                        $.spinner().stop();
                        if (response.error) {
                            if (response.redirectUrl) {
                                window.location.href = response.redirectUrl;
                            }
                            return;
                        }

                        $('body').trigger('checkout:updateCheckoutView',
                            {
                                order: response.order,
                                customer: response.customer,
                                options: { keepOpen: true }
                            }
                        );

                        $(form).attr('data-address-mode', 'new');
                    })
                    .fail(function () {
                        $.spinner().stop();
                    });
            } else if (shipmentUUID === originalUUID) {
                $('select[name$=stateCode]', form).trigger('change');
                $(form).attr('data-address-mode', 'shipment');
            } else if (shipmentUUID.indexOf('ab_') === 0) {
                var url = $(form).attr('action');
                var serializedData = $(form).serialize();
                createNewShipmentScoped(url, serializedData)
                    .done(function (response) {
                        $.spinner().stop();
                        if (response.error) {
                            if (response.redirectUrl) {
                                window.location.href = response.redirectUrl;
                            }
                            return;
                        }

                        $('body').trigger('checkout:updateCheckoutView',
                            {
                                order: response.order,
                                customer: response.customer,
                                options: { keepOpen: true }
                            }
                        );

                        $(form).attr('data-address-mode', 'customer');
                        var $rootEl = $(form).closest('.shipping-content');
                        editMultiShipAddress($rootEl);
                    })
                    .fail(function () {
                        $.spinner().stop();
                    });
            } else {
                var updatePLIShipmentUrl = $(form).attr('action');
                var serializedAddress = $(form).serialize();
                createNewShipmentScoped(updatePLIShipmentUrl, serializedAddress)
                    .done(function (response) {
                        $.spinner().stop();
                        if (response.error) {
                            if (response.redirectUrl) {
                                window.location.href = response.redirectUrl;
                            }
                            return;
                        }

                        $('body').trigger('checkout:updateCheckoutView',
                            {
                                order: response.order,
                                customer: response.customer,
                                options: { keepOpen: true }
                            }
                        );

                        $(form).attr('data-address-mode', 'edit');
                    })
                    .fail(function () {
                        $.spinner().stop();
                    });
            }
        });
    },

    updateShippingList: function () {
        var baseObj = this;

        $('select[name$="shippingAddress_addressFields_states_stateCode"]')
            .on('change', function (e) {
                if (baseObj.methods && baseObj.methods.updateShippingMethodList) {
                    baseObj.methods.updateShippingMethodList($(e.currentTarget.form));
                } else {
                    updateShippingMethodList($(e.currentTarget.form));
                }
            });
    },

    updateDataAddressMode: function () {
        $('body').on('shipping:updateDataAddressMode', function (e, data) {
            $(data.form).attr('data-address-mode', data.mode);
        });
    },

    enterMultiShipInfo: function () {
        var baseObj = this;

        $('.btn-enter-multi-ship').on('click', function (e) {
            e.preventDefault();

            if (baseObj.methods && baseObj.methods.editOrEnterMultiShipInfo) {
                baseObj.methods.editOrEnterMultiShipInfo($(this), 'new');
            } else {
                editOrEnterMultiShipInfo($(this), 'new');
            }
        });
    },

    editMultiShipInfo: function () {
        var baseObj = this;

        $('.btn-edit-multi-ship').on('click', function (e) {
            e.preventDefault();

            if (baseObj.methods && baseObj.methods.editOrEnterMultiShipInfo) {
                baseObj.methods.editOrEnterMultiShipInfo($(this), 'edit');
            } else {
                editOrEnterMultiShipInfo($(this), 'edit');
            }
        });
    },

    saveMultiShipInfo: function () {
        var baseObj = this;

        $('.btn-save-multi-ship').on('click', function (e) {
            e.preventDefault();

            // Save address to checkoutAddressBook
            var form = $(this).closest('form');
            var $rootEl = $(this).closest('.shipping-content');
            var data = $(form).serialize();
            var url = $(form).attr('action');

            $rootEl.spinner().start();
            $.ajax({
                url: url,
                type: 'post',
                dataType: 'json',
                data: data
            })
                .done(function (response) {
                    formHelpers.clearPreviousErrors(form);
                    if (response.error) {
                        if (response.fieldErrors && response.fieldErrors.length) {
                            response.fieldErrors.forEach(function (error) {
                                if (Object.keys(error).length) {
                                    formHelpers.loadFormErrors(form, error);
                                }
                            });
                        } else if (response.serverErrors && response.serverErrors.length) {
                            $.each(response.serverErrors, function (index, element) {
                                createErrorNotification(element);
                            });
                        }
                    } else {
                        // Update UI from response
                        $('body').trigger('checkout:updateCheckoutView',
                            {
                                order: response.order,
                                customer: response.customer
                            }
                        );

                        if (baseObj.methods && baseObj.methods.viewMultishipAddress) {
                            baseObj.methods.viewMultishipAddress($rootEl);
                        } else {
                            viewMultishipAddress($rootEl);
                        }
                    }

                    if (response.order && response.order.shippable) {
                        $('button.submit-shipping').attr('disabled', null);
                    }

                    $rootEl.spinner().stop();
                })
                .fail(function (err) {
                    if (err.responseJSON.redirectUrl) {
                        window.location.href = err.responseJSON.redirectUrl;
                    }

                    $rootEl.spinner().stop();
                });

            return false;
        });
    },

    cancelMultiShipAddress: function () {
        var baseObj = this;

        $('.btn-cancel-multi-ship-address').on('click', function (e) {
            e.preventDefault();

            var form = $(this).closest('form');
            var $rootEl = $(this).closest('.shipping-content');
            var restoreState = $rootEl.data('saved-state');

            // Should clear out changes / restore previous state
            if (restoreState) {
                var restoreStateObj = JSON.parse(restoreState);
                var originalStateCode = restoreStateObj.shippingAddress.stateCode;
                var stateCode = $('[name$=_stateCode]', form).val();

                if (baseObj.methods && baseObj.methods.updateShippingAddressFormValues) {
                    baseObj.methods.updateShippingAddressFormValues(restoreStateObj);
                } else {
                    updateShippingAddressFormValues(restoreStateObj);
                }

                if (stateCode !== originalStateCode) {
                    $('[data-action=save]', form).trigger('click');
                } else {
                    $(form).attr('data-address-mode', 'edit');
                    if (baseObj.methods && baseObj.methods.editMultiShipAddress) {
                        baseObj.methods.editMultiShipAddress($rootEl);
                    } else {
                        editMultiShipAddress($rootEl);
                    }
                }
            }

            return false;
        });
    },

    isGift: function () {
        $('.gift').on('change', function (e) {
            e.preventDefault();
            var form = $(this).closest('form');

            if (this.checked) {
                $(form).find('.gift-message').removeClass('d-none');
            } else {
                $(form).find('.gift-message').addClass('d-none');
                $(form).find('.gift-message').val('');
            }
        });
    }
};
