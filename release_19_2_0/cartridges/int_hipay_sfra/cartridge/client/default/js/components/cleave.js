'use strict';

var Cleave = require('../components/libCleave.js');
var base = require('base/components/cleave');

base.handleCreditCardNumber = function (cardFieldSelector, cardTypeSelector) {
    var cleave = new Cleave(cardFieldSelector, {
        creditCard: true,
        onCreditCardTypeChanged: function (type) {
            var creditCardTypes = {
                visa: 'Visa',
                mastercard: 'Master Card',
                amex: 'Amex',
                discover: 'Discover',
                maestro: 'Maestro',
                bancontactMisterCash: 'BancontactMisterCash',
                unknown: 'Unknown'
            };

            var cardType = creditCardTypes[Object.keys(creditCardTypes).indexOf(type) > -1
                ? type
                : 'unknown'];
            $(cardTypeSelector).val(cardType);
            $('.card-number-wrapper').attr('data-type', type);
            if (type === 'visa' || type === 'mastercard' || type === 'discover') {
                $('#securityCode').attr('maxlength', 3);
            } else {
                $('#securityCode').attr('maxlength', 4);
            }

            if (type === 'maestro' || type === 'bancontactMisterCash') {
                $('input[name$="_saveCard"]').prop('checked', false);
                $('div.save-credit-card').hide();
                $('div[class*="_securityCode"]').removeClass('required');

                if (type === 'bancontactMisterCash') {
                    $('div[class*="_securityCode"]').hide();
                }
                $('div[class*="_securityCode"]').removeClass('required');
            } else {
                $('div.save-credit-card, div[class*="_securityCode"]').show();
                $('div[class*="_securityCode"]').addClass('required');
            }
        }
    });

    if (base.isCreditCard()) {
        $(cardFieldSelector).data('cleave', cleave);
    }
};

base.serializeData = function (form) {
    var serializedArray = form.serializeArray();

    serializedArray.forEach(function (item) {
        if (item.name.indexOf('cardNumber') > -1) {
            if (base.isCreditCard()) {
                item.value = $('#cardNumber').data('cleave').getRawValue(); // eslint-disable-line
            }
        }
    });

    return $.param(serializedArray);
};

base.isCreditCard = function () {
    return $('.tab-pane.active').length > 0 && $('.tab-pane.active').attr('id').toLowerCase().indexOf('credit') > -1 && $('.tab-pane.active').attr('id').toLowerCase().indexOf('hosted') < 0;
};

module.exports = base;
