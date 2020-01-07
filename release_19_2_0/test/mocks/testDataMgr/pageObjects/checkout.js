'use strict';

import _ from 'lodash';
import * as formHelpers from '../helpers/forms/common';
import * as common from '../helpers/common';

export const BTN_SHIPPING_EDIT = '.shipping-summary .edit-button';
export const BTN_NEXT_PAYMENT = '.submit-shipping';
export const BTN_NEXT_PLACE_ORDER = '.submit-payment';
export const BTN_PAYMENT_EDIT = '.payment-summary .edit-button';
export const BTN_PLACE_ORDER = '.place-order';
export const PAGE_TITLE = '.page-title';
export const SHIPPING_FORM_TITLE = '.shipping-form .card-header h4';
export const SHIPPING_ACTIVE_TAB = '.shipping-tab.active';
export const GHOST_PAYMENT_FORM = '.ghost.payment';
export const CHECK_BOX_SAME_BILLING_AND_SHIPPING = '.billing-same-as-shipping';
export const PAYMENT_FORM = '.payment-form';
export const PAYMENT_SUMMARY = '.payment-summary';
export const PAYMENT_FORM_TITLE = '.payment-form .card-header';
export const BILLING_ADDRESS_FORM = '.billing-address';
export const BILLING_ADDRESS_LABEL = '.billing-addr-label';

export const BTN_ADD_NEW = '.payment-form .btn-add-new';

export const BILLING_ADDR_FIRST_NAME = '.billing .firstName';
export const BILLING_ADDR_LAST_NAME = '.billing .lastName';
export const BILLING_ADDR_ADDRESS1 = '.billing .address1';
export const BILLING_ADDR_CITY = '.billing .city';
export const BILLING_ADDR_STATE_CODE = '.billing .stateCode';
export const BILLING_ADDR_POSTAL_CODE = '.billing .postalCode';

export const ORDER_SUMMARY_EMAIL = '.order-summary-email';
export const ORDER_SUMMARY_PHONE = '.order-summary-phone';

export const PAYMENT_INFO_LABEL = '.payment-info-label';
export const PAYMENT_DETAILS = '.payment-details';

export const SHIPPING_METHOD_2DAY_EXPRESS = '#shippingMethod-002';

export const SHIPPING_ADDRESS_LABEL = '.single-shipping .shipping-addr-label';
export const SHIPPING_ADDR_FIRST_NAME = '.shipping .firstName';
export const SHIPPING_ADDR_LAST_NAME = '.shipping .lastName';
export const SHIPPING_ADDR_ADDRESS1 = '.shipping .address1';
export const SHIPPING_ADDR_ADDRESS2 = '.shipping .address2';
export const SHIPPING_ADDR_CITY = '.shipping .city';
export const SHIPPING_ADDR_STATE_CODE = '.shipping .stateCode';
export const SHIPPING_ADDR_POSTAL_CODE = '.shipping .postalCode';
export const SHIPPING_ADDR_SHIPPING_PHONE = '.shipping .shipping-phone';

export const SHIPPING_METHOD_LABEL = '.shipping-method-label';
export const SHIPPING_METHOD_TITLE = '.shipping-method-title';
export const SHIPPING_METHOD_ARRIVAL_TIME = '.shipping-method-arrival-time';
export const SHIPPING_METHOD_PRICE = '.shipping-method-price';

// keys (IDs) for fields in shipping form
export const SHIPPING_FIRST_NAME = ' #shippingFirstName';
export const SHIPPING_LAST_NAME = ' #shippingLastName';
export const SHIPPING_ADDRESS_ONE = ' #shippingAddressOne';
export const SHIPPING_ADDRESS_TWO = ' #shippingAddressTwo';
export const SHIPPING_COUNTRY = ' #shippingCountry';
export const SHIPPING_STATE = ' #shippingState';
export const SHIPPING_ADDRESS_CITY = ' #shippingAddressCity';
export const SHIPPING_ZIP_CODE = ' #shippingZipCode';
export const SHIPPING_PHONE_NUMBER = ' #shippingPhoneNumber';

// keys (IDs) for fields in billing form
export const BILLING_FIRST_NAME = 'FirstName';
export const BILLING_LAST_NAME = 'LastName';
export const BILLING_ADDRESS_ONE = 'AddressOne';
export const BILLING_ADDRESS_TWO = 'AddressTwo';
export const BILLING_COUNTRY = 'Country';
export const BILLING_STATE = 'State';
export const BILLING_ADDRESS_CITY = 'AddressCity';
export const BILLING_ZIP_CODE = 'ZipCode';

// keys (IDs) for fields in payment form
export const PAYMENT_CARD_NUMBER = 'cardNumber';
export const PAYMENT_EXPIRATION_MONTH = 'expirationMonth';
export const PAYMENT_EXPIRATION_YEAR = 'expirationYear';
export const PAYMENT_SECURITY_CODE = 'securityCode';
export const PAYMENT_EMAIL = 'email';
export const PAYMENT_PHONE_NUMBER = 'phoneNumber';


export function fillOutShippingForm(shippingData, locale) {
    let fieldTypes = new Map();
    let fieldsPromise = [];
    fieldTypes.set(SHIPPING_FIRST_NAME, 'input');
    fieldTypes.set(SHIPPING_LAST_NAME, 'input');
    fieldTypes.set(SHIPPING_ADDRESS_ONE, 'input');
    fieldTypes.set(SHIPPING_ADDRESS_TWO, 'input');

    if (locale && locale === 'x_default') {
        fieldTypes.set(SHIPPING_COUNTRY, 'selectByValue');
    }
    if (locale && locale === 'x_default') {
        fieldTypes.set(SHIPPING_STATE, 'selectByValue');
    }

    fieldTypes.set(SHIPPING_ADDRESS_CITY, 'input');
    fieldTypes.set(SHIPPING_ZIP_CODE, 'input');
    fieldTypes.set(SHIPPING_PHONE_NUMBER, 'input');

    _.each(shippingData, (value, key) => {
        let prefix = '.single-shipping';
        let selector = prefix + key;
        fieldsPromise.push(formHelpers.populateField(selector, value, fieldTypes.get(key)));
    });
    return Promise.all(fieldsPromise);
}

export function fillOutBillingForm(billingData, locale) {
    let fieldTypes = new Map();
    let fieldsPromise = [];
    fieldTypes.set(BILLING_FIRST_NAME, 'input');
    fieldTypes.set(BILLING_LAST_NAME, 'input');
    fieldTypes.set(BILLING_ADDRESS_ONE, 'input');
    fieldTypes.set(BILLING_ADDRESS_TWO, 'input');
    if (locale && locale === 'x_default') {
        fieldTypes.set(BILLING_COUNTRY, 'selectByValue');
    }
    if (locale && locale === 'x_default') {
        fieldTypes.set(BILLING_STATE, 'selectByValue');
    }


    fieldTypes.set(BILLING_ADDRESS_CITY, 'input');
    fieldTypes.set(BILLING_ZIP_CODE, 'input');

    _.each(billingData, (value, key) => {
        let prefix = '#billing';
        let selector = prefix + key;
        fieldsPromise.push(formHelpers.populateField(selector, value, fieldTypes.get(key)));
    });
    return Promise.all(fieldsPromise);
}

export function fillOutPaymentForm(billingFields) {
    let fieldTypes = new Map();
    let fieldsPromise = [];

    fieldTypes.set(PAYMENT_CARD_NUMBER, 'input');
    fieldTypes.set(PAYMENT_EXPIRATION_MONTH, 'selectByValue');
    fieldTypes.set(PAYMENT_EXPIRATION_YEAR, 'selectByValue');
    fieldTypes.set(PAYMENT_SECURITY_CODE, 'input');
    fieldTypes.set(PAYMENT_EMAIL, 'input');
    fieldTypes.set(PAYMENT_PHONE_NUMBER, 'input');

    _.each(billingFields, (value, key) => {
        let fieldType = fieldTypes.get(key);
        let selector = '#' + key;
        fieldsPromise.push(formHelpers.populateField(selector, value, fieldType));
    });

    return Promise.all(fieldsPromise);
}

export function checkSameBillingShipping() {
    return common.checkCheckbox(CHECK_BOX_SAME_BILLING_AND_SHIPPING);
}

