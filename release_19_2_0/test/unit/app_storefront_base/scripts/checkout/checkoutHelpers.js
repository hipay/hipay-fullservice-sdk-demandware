// checkoutHelpers.js unit tests

var assert = require('chai').assert;
var sinon = require('sinon');

var checkoutHelpers = require('../../../../mocks/helpers/checkoutHelpers');


describe('checkoutHelpers', function () {
    describe('prepareShippingForm', function () {
        it('should return a processed shipping form object', function () {
            var shippingForm = checkoutHelpers.prepareShippingForm();
            assert.equal(shippingForm.formName, 'shipping');
        });
    });

    describe('prepareBillingForm', function () {
        it('should return a processed billing form object', function () {
            var billingForm = checkoutHelpers.prepareBillingForm();
            assert.equal(billingForm.formName, 'billing');
        });
    });

    describe('validateShippingForm', function () {
        it('should return empty object when no invalid form field - with state field', function () {
            var shippingForm = {
                firstName: { valid: true, formType: 'formField' },
                lastName: { valid: true, formType: 'formField' },
                address1: { valid: true, formType: 'formField' },
                address2: { valid: true, formType: 'formField' },
                city: { valid: true, formType: 'formField' },
                states: { valid: true, formType: 'formField' },
                postalCode: { valid: true, formType: 'formField' },
                country: { valid: true, formType: 'formField' }
            };

            var invalidFields = checkoutHelpers.validateShippingForm(shippingForm);
            assert.equal(Object.keys(invalidFields).length, 0);
        });

        it('should return empty object when no invalid form field - without state field', function () {
            var shippingForm = {
                firstName: { valid: true, formType: 'formField' },
                lastName: { valid: true, formType: 'formField' },
                address1: { valid: true, formType: 'formField' },
                address2: { valid: true, formType: 'formField' },
                city: { valid: true, formType: 'formField' },
                postalCode: { valid: true, formType: 'formField' },
                country: { valid: true, formType: 'formField' }
            };

            var invalidFields = checkoutHelpers.validateShippingForm(shippingForm);
            assert.equal(Object.keys(invalidFields).length, 0);
        });

        it('should return an object containing invalid form field', function () {
            var shippingForm = {
                firstName: { valid: true, formType: 'formField' },
                lastName: { valid: true, formType: 'formField' },
                address1: { valid: true, formType: 'formField' },
                address2: {
                    valid: false,
                    htmlName: 'htmlNameAddress2',
                    error: 'address2 is an invalid field.',
                    formType: 'formField'
                },
                city: { valid: true, formType: 'formField' },
                states: { valid: true, formType: 'formField' },
                postalCode: { valid: true, formType: 'formField' },
                country: {
                    valid: false,
                    htmlName: 'htmlNameCountry',
                    error: 'country is an invalid field.',
                    formType: 'formField'
                }
            };

            var invalidFields = checkoutHelpers.validateShippingForm(shippingForm);
            assert.equal(Object.keys(invalidFields).length, 2);
            assert.equal(invalidFields.htmlNameAddress2, shippingForm.address2.error);
            assert.equal(invalidFields.htmlNameCountry, shippingForm.country.error);
        });
    });

    describe('isShippingAddressInitialized', function () {
        it('should return true for shipment with shipping address provided', function () {
            var shipment = {
                shippingAddress: {
                    stateCode: 'CA',
                    postalCode: '97123'
                }
            };
            var isAddrInitialized = checkoutHelpers.isShippingAddressInitialized(shipment);
            assert.isTrue(isAddrInitialized);
        });

        it('should return false for shipment with no shipping address provided', function () {
            var shipment = {};
            var isAddrInitialized = checkoutHelpers.isShippingAddressInitialized(shipment);
            assert.isFalse(isAddrInitialized);
        });

        it('should return true for shipment is null and defaulShipment shippingAddress is not null', function () {
            var shipment = null;
            var isAddrInitialized = checkoutHelpers.isShippingAddressInitialized(shipment);
            assert.isTrue(isAddrInitialized);
        });
    });

    describe('copyCustomerAddressToShipment', function () {
        var address = {
            firstName: 'James',
            lastName: 'Bond',
            address1: '10 Oxford St',
            address2: 'suite 20',
            city: 'London',
            postalCode: '02345',
            countryCode: { value: 'uk' },
            phone: '603-333-1212',
            stateCode: 'NH'
        };

        it('should copy customer address to shipment address for non-null shipment', function () {
            var shipment = {
                shippingAddress: {
                    firstName: 'David',
                    lastName: 'Johnson',
                    address1: '25 Quincy Rd.',
                    address2: '',
                    city: 'Boston',
                    postalCode: '01234',
                    countryCode: { value: 'us' },
                    phone: '617-777-1010',
                    stateCode: 'MA',

                    setFirstName: function (firstNameInput) { this.firstName = firstNameInput; },
                    setLastName: function (lastNameInput) { this.lastName = lastNameInput; },
                    setAddress1: function (address1Input) { this.address1 = address1Input; },
                    setAddress2: function (address2Input) { this.address2 = address2Input; },
                    setCity: function (cityInput) { this.city = cityInput; },
                    setPostalCode: function (postalCodeInput) { this.postalCode = postalCodeInput; },
                    setStateCode: function (stateCodeInput) { this.stateCode = stateCodeInput; },
                    setCountryCode: function (countryCodeInput) { this.countryCode.value = countryCodeInput; },
                    setPhone: function (phoneInput) { this.phone = phoneInput; }
                }
            };

            checkoutHelpers.copyCustomerAddressToShipment(address, shipment);

            assert.equal(shipment.shippingAddress.firstName, address.firstName);
            assert.equal(shipment.shippingAddress.lastName, address.lastName);
            assert.equal(shipment.shippingAddress.address1, address.address1);
            assert.equal(shipment.shippingAddress.address2, address.address2);
            assert.equal(shipment.shippingAddress.city, address.city);
            assert.equal(shipment.shippingAddress.postalCode, address.postalCode);
            assert.equal(shipment.shippingAddress.countryCode.value, address.countryCode.value);
            assert.equal(shipment.shippingAddress.phone, address.phone);
            assert.equal(shipment.shippingAddress.stateCode, address.stateCode);
        });

        it('should create shipment address and copy customer address to shipment address if shipment address is null', function () {
            var shipment = {
                shippingAddress: null,
                createShippingAddress: function () {
                    this.shippingAddress = {
                        firstName: '',
                        lastName: '',
                        address1: '',
                        address2: '',
                        city: '',
                        postalCode: '',
                        countryCode: { value: '' },
                        phone: '',
                        stateCode: '',

                        setFirstName: function (firstNameInput) { this.firstName = firstNameInput; },
                        setLastName: function (lastNameInput) { this.lastName = lastNameInput; },
                        setAddress1: function (address1Input) { this.address1 = address1Input; },
                        setAddress2: function (address2Input) { this.address2 = address2Input; },
                        setCity: function (cityInput) { this.city = cityInput; },
                        setPostalCode: function (postalCodeInput) { this.postalCode = postalCodeInput; },
                        setStateCode: function (stateCodeInput) { this.stateCode = stateCodeInput; },
                        setCountryCode: function (countryCodeInput) { this.countryCode.value = countryCodeInput; },
                        setPhone: function (phoneInput) { this.phone = phoneInput; }
                    };
                    return this.shippingAddress;
                }
            };

            checkoutHelpers.copyCustomerAddressToShipment(address, shipment);

            assert.equal(shipment.shippingAddress.firstName, address.firstName);
            assert.equal(shipment.shippingAddress.lastName, address.lastName);
            assert.equal(shipment.shippingAddress.address1, address.address1);
            assert.equal(shipment.shippingAddress.address2, address.address2);
            assert.equal(shipment.shippingAddress.city, address.city);
            assert.equal(shipment.shippingAddress.postalCode, address.postalCode);
            assert.equal(shipment.shippingAddress.countryCode.value, address.countryCode.value);
            assert.equal(shipment.shippingAddress.phone, address.phone);
            assert.equal(shipment.shippingAddress.stateCode, address.stateCode);
        });
    });

    describe('copyShippingAddressToShipment', function () {
        var shippingData = {
            address: {
                firstName: 'James',
                lastName: 'Bond',
                address1: '10 Oxford St',
                address2: 'suite 20',
                city: 'London',
                postalCode: '02345',
                countryCode: 'uk',
                phone: '603-333-1212',
                stateCode: 'NH'
            },
            shippingMethod: '002'
        };

        it('should copy information from the shipping form to shipment address for non-null shipment', function () {
            var shipment = {
                shippingAddress: {
                    firstName: 'David',
                    lastName: 'Johnson',
                    address1: '25 Quincy Rd.',
                    address2: '',
                    city: 'Boston',
                    postalCode: '01234',
                    countryCode: { value: 'us' },
                    phone: '617-777-1010',
                    stateCode: 'MA',

                    setFirstName: function (firstNameInput) {
                        this.firstName = firstNameInput;
                    },
                    setLastName: function (lastNameInput) {
                        this.lastName = lastNameInput;
                    },
                    setAddress1: function (address1Input) {
                        this.address1 = address1Input;
                    },
                    setAddress2: function (address2Input) {
                        this.address2 = address2Input;
                    },
                    setCity: function (cityInput) {
                        this.city = cityInput;
                    },
                    setPostalCode: function (postalCodeInput) {
                        this.postalCode = postalCodeInput;
                    },
                    setStateCode: function (stateCodeInput) {
                        this.stateCode = stateCodeInput;
                    },
                    setCountryCode: function (countryCodeInput) {
                        this.countryCode.value = countryCodeInput;
                    },
                    setPhone: function (phoneInput) {
                        this.phone = phoneInput;
                    }
                },
                selectedShippingMethod: {},
                setShippingMethod: function (shippingMethod) {
                    this.selectedShippingMethod = shippingMethod;
                }
            };

            checkoutHelpers.copyShippingAddressToShipment(shippingData, shipment);

            assert.equal(shipment.shippingAddress.firstName, shippingData.address.firstName);
            assert.equal(shipment.shippingAddress.lastName, shippingData.address.lastName);
            assert.equal(shipment.shippingAddress.address1, shippingData.address.address1);
            assert.equal(shipment.shippingAddress.address2, shippingData.address.address2);
            assert.equal(shipment.shippingAddress.city, shippingData.address.city);
            assert.equal(shipment.shippingAddress.postalCode, shippingData.address.postalCode);
            assert.equal(shipment.shippingAddress.countryCode.value, shippingData.address.countryCode);
            assert.equal(shipment.shippingAddress.phone, shippingData.address.phone);
            assert.equal(shipment.shippingAddress.stateCode, shippingData.address.stateCode);

            assert.equal(shipment.selectedShippingMethod.ID, shippingData.shippingMethod);
        });

        it('should create shipment address and copy information from the shipping form to shipment address if shipment address is null', function () {
            var shipment = {
                shippingAddress: null,
                selectedShippingMethod: {},
                setShippingMethod: function (shippingMethod) {
                    this.selectedShippingMethod = shippingMethod;
                },
                createShippingAddress: function () {
                    this.shippingAddress = {
                        firstName: '',
                        lastName: '',
                        address1: '',
                        address2: '',
                        city: '',
                        postalCode: '',
                        countryCode: { value: '' },
                        phone: '',
                        stateCode: '',

                        setFirstName: function (firstNameInput) { this.firstName = firstNameInput; },
                        setLastName: function (lastNameInput) { this.lastName = lastNameInput; },
                        setAddress1: function (address1Input) { this.address1 = address1Input; },
                        setAddress2: function (address2Input) { this.address2 = address2Input; },
                        setCity: function (cityInput) { this.city = cityInput; },
                        setPostalCode: function (postalCodeInput) { this.postalCode = postalCodeInput; },
                        setStateCode: function (stateCodeInput) { this.stateCode = stateCodeInput; },
                        setCountryCode: function (countryCodeInput) { this.countryCode.value = countryCodeInput; },
                        setPhone: function (phoneInput) { this.phone = phoneInput; }
                    };
                    return this.shippingAddress;
                }
            };

            checkoutHelpers.copyShippingAddressToShipment(shippingData, shipment);

            assert.equal(shipment.shippingAddress.firstName, shippingData.address.firstName);
            assert.equal(shipment.shippingAddress.lastName, shippingData.address.lastName);
            assert.equal(shipment.shippingAddress.address1, shippingData.address.address1);
            assert.equal(shipment.shippingAddress.address2, shippingData.address.address2);
            assert.equal(shipment.shippingAddress.city, shippingData.address.city);
            assert.equal(shipment.shippingAddress.postalCode, shippingData.address.postalCode);
            assert.equal(shipment.shippingAddress.countryCode.value, shippingData.address.countryCode);
            assert.equal(shipment.shippingAddress.phone, shippingData.address.phone);
            assert.equal(shipment.shippingAddress.stateCode, shippingData.address.stateCode);

            assert.equal(shipment.selectedShippingMethod.ID, shippingData.shippingMethod);
        });

        it('should copy information from the shipping form to shipment address for non-null shipment with shippingData having countryCode as an object', function () {
            shippingData.address.countryCode = {
                value: 'uk'
            };
            var shipment = {
                shippingAddress: {
                    firstName: 'David',
                    lastName: 'Johnson',
                    address1: '25 Quincy Rd.',
                    address2: '',
                    city: 'Boston',
                    postalCode: '01234',
                    countryCode: { value: 'us' },
                    phone: '617-777-1010',
                    stateCode: 'MA',

                    setFirstName: function (firstNameInput) {
                        this.firstName = firstNameInput;
                    },
                    setLastName: function (lastNameInput) {
                        this.lastName = lastNameInput;
                    },
                    setAddress1: function (address1Input) {
                        this.address1 = address1Input;
                    },
                    setAddress2: function (address2Input) {
                        this.address2 = address2Input;
                    },
                    setCity: function (cityInput) {
                        this.city = cityInput;
                    },
                    setPostalCode: function (postalCodeInput) {
                        this.postalCode = postalCodeInput;
                    },
                    setStateCode: function (stateCodeInput) {
                        this.stateCode = stateCodeInput;
                    },
                    setCountryCode: function (countryCodeInput) {
                        this.countryCode.value = countryCodeInput;
                    },
                    setPhone: function (phoneInput) {
                        this.phone = phoneInput;
                    }
                },
                selectedShippingMethod: {},
                setShippingMethod: function (shippingMethod) {
                    this.selectedShippingMethod = shippingMethod;
                }
            };

            checkoutHelpers.copyShippingAddressToShipment(shippingData, shipment);

            assert.equal(shipment.shippingAddress.firstName, shippingData.address.firstName);
            assert.equal(shipment.shippingAddress.lastName, shippingData.address.lastName);
            assert.equal(shipment.shippingAddress.address1, shippingData.address.address1);
            assert.equal(shipment.shippingAddress.address2, shippingData.address.address2);
            assert.equal(shipment.shippingAddress.city, shippingData.address.city);
            assert.equal(shipment.shippingAddress.postalCode, shippingData.address.postalCode);
            assert.equal(shipment.shippingAddress.countryCode.value, shippingData.address.countryCode.value);
            assert.equal(shipment.shippingAddress.phone, shippingData.address.phone);
            assert.equal(shipment.shippingAddress.stateCode, shippingData.address.stateCode);

            assert.equal(shipment.selectedShippingMethod.ID, shippingData.shippingMethod);
        });
    });

    describe('getFirstNonDefaultShipmentWithProductLineItems', function () {
        it('should return the first non-default shipment with more than one product line item', function () {
            var basket = {
                shipments: [
                    {
                        UUID: '1111',
                        shippingAddress: {
                            stateCode: 'MA',
                            postalCode: '01803'
                        },
                        default: true,
                        productLineItems: [
                            { 'id': '011111' },
                            { 'id': '011112' },
                            { 'id': '011113' }
                        ]
                    },
                    {
                        UUID: '1112',
                        shippingAddress: {
                            stateCode: 'CA',
                            postalCode: '97123'
                        },
                        default: false,
                        productLineItems: [
                            { 'id': '022221' },
                            { 'id': '022222' },
                            { 'id': '022223' }
                        ]
                    },
                    {
                        UUID: '1113',
                        shippingAddress: {
                            stateCode: 'CO',
                            postalCode: '85123'
                        },
                        default: false,
                        productLineItems: [
                            { 'id': '033331' },
                            { 'id': '033332' },
                            { 'id': '033333' }
                        ]
                    }
                ]
            };

            var myShipment = checkoutHelpers.getFirstNonDefaultShipmentWithProductLineItems(basket);
            assert.equal(myShipment.UUID, basket.shipments[1].UUID);
        });
    });

    describe('recalculateBasket', function () {
        it('should recalculate the basket', function () {
            var basket = {};
            checkoutHelpers.recalculateBasket(basket);
        });
    });

    describe('getProductLineItem', function () {
        it('should return the specified product line item', function () {
            var basket = {
                productLineItems: [
                    { 'UUID': 'pliuuid011111' },
                    { 'UUID': 'pliuuid011112' },
                    { 'UUID': 'pliuuid011113' },
                    { 'UUID': 'pliuuid011114' }
                ]
            };

            var targetPliUUID = basket.productLineItems[2].UUID;
            var myPli = checkoutHelpers.getProductLineItem(basket, targetPliUUID);
            assert.equal(myPli.UUID, targetPliUUID);
        });
    });

    describe('validateBillingForm', function () {
        it('should return empty object when no invalid form field - with state field', function () {
            var billingForm = {
                firstName: { valid: true, formType: 'formField' },
                lastName: { valid: true, formType: 'formField' },
                address1: { valid: true, formType: 'formField' },
                address2: { valid: true, formType: 'formField' },
                city: { valid: true, formType: 'formField' },
                states: { valid: true, formType: 'formField' },
                postalCode: { valid: true, formType: 'formField' },
                country: { valid: true, formType: 'formField' }
            };

            var invalidFields = checkoutHelpers.validateBillingForm(billingForm);
            assert.equal(Object.keys(invalidFields).length, 0);
        });

        it('should return empty object when no invalid form field - without state field', function () {
            var billingForm2 = {
                firstName: { valid: true, formType: 'formField' },
                lastName: { valid: true, formType: 'formField' },
                address1: { valid: true, formType: 'formField' },
                address2: { valid: true, formType: 'formField' },
                city: { valid: true, formType: 'formField' },
                postalCode: { valid: true, formType: 'formField' },
                country: { valid: true, formType: 'formField' }
            };

            var invalidFields = checkoutHelpers.validateBillingForm(billingForm2);
            assert.equal(Object.keys(invalidFields).length, 0);
        });

        it('should return an object containing invalid form field', function () {
            var billingForm3 = {
                firstName: { valid: true, formType: 'formField' },
                lastName: { valid: true, formType: 'formField' },
                address1: { valid: true, formType: 'formField' },
                address2: {
                    valid: false,
                    htmlName: 'htmlNameAddress2',
                    error: 'address2 is an invalid field.',
                    formType: 'formField'
                },
                city: { valid: true, formType: 'formField' },
                states: { valid: true, formType: 'formField' },
                postalCode: { valid: true, formType: 'formField' },
                country: {
                    valid: false,
                    htmlName: 'htmlNameCountry',
                    error: 'country is an invalid field.',
                    formType: 'formField'
                }
            };

            var invalidFields = checkoutHelpers.validateBillingForm(billingForm3);
            assert.equal(Object.keys(invalidFields).length, 2);
            assert.equal(invalidFields.htmlNameAddress2, billingForm3.address2.error);
            assert.equal(invalidFields.htmlNameCountry, billingForm3.country.error);
        });
    });

    describe('validateCreditCard', function () {
        it('should return an empty object when no invalid form field', function () {
            var creditCardForm = {
                paymentMethod: {
                    value: '$100.00',
                    htmlName: 'htmlName payment method error'
                },
                creditCardFields: {
                    cardNumber: { valid: true },
                    expirationYear: { valid: true },
                    expirationMonth: { valid: true },
                    securityCode: { valid: true },
                    email: { valid: true },
                    phone: { valid: true }
                }
            };

            var invalidFields = checkoutHelpers.validateCreditCard(creditCardForm);
            assert.equal(Object.keys(invalidFields).length, 0);
        });

        it('should return an object containing invalid form fields when no payment method value', function () {
            var creditCardForm = {
                paymentMethod: {
                    value: null,
                    htmlName: 'htmlNamePaymentMethodError'
                },
                creditCardFields: {
                    cardNumber: { valid: true },
                    expirationYear: { valid: true },
                    expirationMonth: { valid: true },
                    securityCode: { valid: true },
                    email: { valid: true },
                    phone: { valid: true }
                }
            };

            var invalidFields = checkoutHelpers.validateCreditCard(creditCardForm);
            assert.equal(Object.keys(invalidFields).length, 1);
            assert.equal(invalidFields.htmlNamePaymentMethodError, 'error.no.selected.payment.method');
        });
    });

    describe('calculatePaymentTransaction', function () {
        it('should return result with error = false when no exception', function () {
            var currentBasket = {
                totalGrossPrice: '$200.00',
                paymentInstrument: {
                    paymentTransaction: {
                        setAmount: function (orderTotal) { // eslint-disable-line no-unused-vars
                        }
                    }
                }
            };

            var result = checkoutHelpers.calculatePaymentTransaction(currentBasket);
            assert.isFalse(result.error);
        });

        it('should return result with error = true when there is an exception', function () {
            var currentBasket = {
                totalGrossPrice: '$200.00',
                paymentInstrument: {
                    paymentTransaction: {
                        setAmount: function (value) { // eslint-disable-line no-unused-vars
                            throw new Error();
                        }
                    }
                }
            };

            var result = checkoutHelpers.calculatePaymentTransaction(currentBasket);
            assert.isTrue(result.error);
        });
    });

    describe('createOrder', function () {
        it('should return the order object created from the current basket', function () {
            var currentBasket = {};

            var result = checkoutHelpers.createOrder(currentBasket);
            assert.equal(result.order, 'new order');
        });
    });

    describe('placeOrder', function () {
        var setConfirmationStatusStub = sinon.stub();
        var setExportStatusStub = sinon.stub();

        beforeEach(function () {
            setConfirmationStatusStub.reset();
            setExportStatusStub.reset();
        });

        var order = {
            setConfirmationStatus: setConfirmationStatusStub,
            setExportStatus: setExportStatusStub
        };

        it('should return result with error = false when no exception ', function () {
            var mockFraudDetectionStatus = {
                status: 'success',
                errorCode: '',
                errorMessage: ''
            };

            var result = checkoutHelpers.placeOrder(order, mockFraudDetectionStatus);

            assert.isTrue(setConfirmationStatusStub.calledOnce);
            assert.isTrue(setConfirmationStatusStub.calledWith('CONFIRMATION_STATUS_CONFIRMED'));
            assert.isFalse(result.error);
        });

        it('should return result with error = false when no exception and fraud status is flag', function () {
            var mockFraudDetectionStatus = {
                status: 'flag',
                errorCode: '',
                errorMessage: ''
            };

            var result = checkoutHelpers.placeOrder(order, mockFraudDetectionStatus);

            assert.isTrue(setConfirmationStatusStub.calledOnce);
            assert.isTrue(setConfirmationStatusStub.calledWith('ONFIRMATION_STATUS_NOTCONFIRMED'));
            assert.isFalse(result.error);
        });

        it('should return result with error = true when exception is thrown', function () {
            var result = checkoutHelpers.placeOrder(order);

            assert.isTrue(setConfirmationStatusStub.notCalled);
            assert.isTrue(result.error);
        });
    });

    describe('setGift', function () {
        var mockShipment = {
            setGift: function () {
                return;
            },
            setGiftMessage: function () {
                return;
            }
        };

        it('should return a result object with no errors', function () {
            var result = checkoutHelpers.setGift(mockShipment, true, 'gift Message');

            assert.isFalse(result.error);
            assert.equal(result.errorMessage, null);
        });

        it('should return a result object with errors', function () {
            var result = checkoutHelpers.setGift({}, false, 'gift Message');

            assert.isTrue(result.error);
            assert.equal(result.errorMessage, 'error.message.could.not.be.attached');
        });
    });
});
