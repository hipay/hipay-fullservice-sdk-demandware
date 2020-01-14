'use strict';

var keyboardAccessibility = require('./keyboardAccessibility');

module.exports = function () {
    $('.country-selector a').click(function (e) {
        e.preventDefault();
        var action = $('.page').data('action');
        var localeCode = $(this).data('locale');
        var localeCurrencyCode = $(this).data('currencycode');
        var queryString = $('.page').data('querystring');
        var url = $('.country-selector').data('url');

        $.ajax({
            url: url,
            type: 'get',
            dataType: 'json',
            data: {
                code: localeCode,
                queryString: queryString,
                CurrencyCode: localeCurrencyCode,
                action: action
            },
            success: function (response) {
                $.spinner().stop();
                if (response && response.redirectUrl) {
                    window.location.href = response.redirectUrl;
                }
            },
            error: function () {
                $.spinner().stop();
            }
        });
    });

    keyboardAccessibility('.navbar-header .country-selector',
        {
            40: function ($countryOptions) { // down
                if ($(this).is(':focus')) {
                    $countryOptions.first().focus();
                } else {
                    $(':focus').next().focus();
                }
            },
            38: function ($countryOptions) { // up
                if ($countryOptions.first().is(':focus') || $(this).is(':focus')) {
                    $(this).focus();
                    $(this).removeClass('show');
                } else {
                    $(':focus').prev().focus();
                }
            },
            27: function () { // escape
                $(this).focus();
                $(this).removeClass('show').children('.dropdown-menu').removeClass('show');
            },
            9: function () { // tab
                $(this).removeClass('show').children('.dropdown-menu').removeClass('show');
            }
        },
        function () {
            if (!($(this).hasClass('show'))) {
                $(this).addClass('show');
            }
            return $(this).find('.dropdown-country-selector').children('a');
        }
    );

    $('.navbar-header .country-selector').on('focusin', function () {
        $(this).addClass('show').children('.dropdown-menu').addClass('show');
    });
};
