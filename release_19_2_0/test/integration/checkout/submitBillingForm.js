var assert = require('chai').assert;
var request = require('request-promise');
var config = require('../it.config');
var jsonHelpers = require('../helpers/jsonUtils');

/**
 * Test case:
 * should be able to submit an order with billingForm
 */

describe('billingForm', function () {
    this.timeout(5000);

    describe('positive test', function () {
        var cookieJar = request.jar();

        var myRequest = {
            url: config.baseUrl + '/CSRF-Generate',
            method: 'POST',
            rejectUnauthorized: false,
            resolveWithFullResponse: true,
            jar: cookieJar,
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        };

        before(function () {
            return request(myRequest)
                .then(function (csrfResponse) {
                    var csrfJsonResponse = JSON.parse(csrfResponse.body);
                    myRequest.url = config.baseUrl + '/CheckoutServices-SubmitPayment?' +
                        csrfJsonResponse.csrf.tokenName + '=' +
                        csrfJsonResponse.csrf.token;
                });
        });

        it('should submit billing form successfully', function () {
            myRequest.form = {
                dwfrm_billing_shippingAddressUseAsBillingAddress: 'true',
                dwfrm_billing_addressFields_firstName: 'John',
                dwfrm_billing_addressFields_lastName: 'Smith',
                dwfrm_billing_addressFields_address1: '10 main St',
                dwfrm_billing_addressFields_address2: '',
                dwfrm_billing_addressFields_country: 'us',
                dwfrm_billing_addressFields_states_stateCode: 'MA',
                dwfrm_billing_addressFields_city: 'burlington',
                dwfrm_billing_addressFields_postalCode: '09876',
                dwfrm_billing_paymentMethod: 'CREDIT_CARD',
                dwfrm_billing_creditCardFields_cardType: 'Visa',
                dwfrm_billing_creditCardFields_cardNumber: '4111111111111111',
                dwfrm_billing_creditCardFields_expirationMonth: '2',
                dwfrm_billing_creditCardFields_expirationYear: '2020.0',
                dwfrm_billing_creditCardFields_securityCode: '342',
                dwfrm_billing_creditCardFields_email: 'blahblah@gmail.com',
                dwfrm_billing_creditCardFields_phone: '9786543213'
            };

            var ExpectedResBody = {
                locale: 'en_US',
                address: {
                    firstName: { value: 'John' },
                    lastName: { value: 'Smith' },
                    address1: { value: '10 main St' },
                    address2: { value: null },
                    city: { value: 'burlington' },
                    stateCode: { value: 'MA' },
                    postalCode: { value: '09876' },
                    countryCode: { value: 'us' }
                },
                paymentMethod: { value: 'CREDIT_CARD', htmlName: 'CREDIT_CARD' },
                email: { value: 'blahblah@gmail.com' },
                phone: { value: '9786543213' },
                error: true,
                cartError: true,
                fieldErrors: [],
                serverErrors: [],
                saveCard: false
            };

            return request(myRequest)
                .then(function (response) {
                    var bodyAsJson = JSON.parse(response.body);
                    var strippedBody = jsonHelpers.deleteProperties(bodyAsJson, ['redirectUrl', 'action', 'queryString']);
                    assert.equal(response.statusCode, 200, 'Expected CheckoutServices-SubmitPayment statusCode to be 200.');
                    assert.deepEqual(strippedBody, ExpectedResBody, 'Expecting actual response to be equal match expected response');
                });
        });
    });
});
