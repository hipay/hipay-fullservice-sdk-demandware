'use strict';

var assert = require('chai').assert;
var formErrors = require('../../../../cartridges/app_storefront_base/cartridge/scripts/formErrors.js');

describe('formErrors', function () {
    it('should remove htmlValue and value from the form object', function () {
        var obj = {
            formType: 'formGroup',
            test1: {
                value: 'someValue',
                htmlValue: 'someHTMLValue',
                formType: 'formField',
                property1: 'someProperty'
            },
            test2: {
                formType: 'formGroup',
                subTest1: {
                    value: 'someValue',
                    htmlValue: 'someHTMLValue',
                    formType: 'formField',
                    property1: 'someProperty'
                },
                subTest2: {
                    htmlValue: 'someHTMLValue',
                    formType: 'formField',
                    property1: 'someProperty'
                }
            }
        };

        formErrors.removeFormValues(obj);

        assert.equal(obj.test1.value, undefined);
        assert.equal(obj.test1.htmlValue, undefined);
        assert.equal(obj.test2.subTest1.htmlValue, undefined);
        assert.equal(obj.test2.subTest1.value, undefined);
        assert.equal(obj.test2.subTest2.htmlValue, undefined);
        assert.equal(obj.test2.subTest2.value, undefined);
    });

    it('should return an empty object if null is passed in', function () {
        var result = formErrors.getFormErrors(null);

        assert.deepEqual(result, {});
    });

    it('should get form errors', function () {
        var testObject = {
            formType: 'formGroup',
            test1: {
                formType: 'formField',
                valid: true,
                error: '',
                htmlName: 'someName1'
            },
            test2: {
                formType: 'formGroup',
                subTest: {
                    formType: 'formField',
                    valid: false,
                    error: 'someError2',
                    htmlName: 'someName2'
                }
            }
        };

        var result = formErrors.getFormErrors(testObject);

        assert.deepEqual(result, { 'someName2': 'someError2' });
    });
});

