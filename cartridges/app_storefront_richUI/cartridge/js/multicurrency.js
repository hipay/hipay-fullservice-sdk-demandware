'use strict';

var ajax = require('./ajax'),
	page = require('./page'),
	util = require('./util');

exports.init = function () {
	//listen to the drop down, and make a ajax call to mulitcurrency pipeline
	$('.currency-converter').on('change', function () {
		// request results from server
		ajax.getJson({
			url: util.appendParamsToUrl(Urls.setSessionCurrency, {
				format: 'ajax',
				currencyMnemonic: $('.currency-converter select').val()
			}),
			callback: function () {
				location.reload();
			}
		});
	});

	//hide the feature if user is in checkout
	if (page.title === 'Checkout') {
		$('.mc-class').css('display', 'none');
	}
};
