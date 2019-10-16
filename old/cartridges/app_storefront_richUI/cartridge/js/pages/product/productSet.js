'use strict';

var addToCart = require('./addToCart'),
	ajax = require('../../ajax'),
	tooltip = require('../../tooltip'),
	util = require('../../util');

module.exports = function () {
	var $addToCart = $('#add-to-cart'),
		$addAllToCart = $('#add-all-to-cart'),
		$productSetList = $('#product-set-list');

	var updateAddToCartButtons = function () {
		if ($productSetList.find('.add-to-cart[disabled]').length > 0) {
			$addAllToCart.attr('disabled', 'disabled');
			// product set does not have an add-to-cart button, but product bundle does
			$addToCart.attr('disabled', 'disabled');
		} else {
			$addAllToCart.removeAttr('disabled');
			$addToCart.removeAttr('disabled');
		}
	};

	if ($productSetList.length > 0) {
		updateAddToCartButtons();
	}
	// click on swatch for product set
	$productSetList.on('click', '.product-set-item .swatchanchor', function (e) {
		e.preventDefault();
		var url = Urls.getSetItem + this.search,
			$container = $(this).closest('.product-set-item'),
			qty = $container.find('form input[name="Quantity"]').first().val();
		if (isNaN(qty)) {
			qty = '1';
		}
		url = util.appendParamToURL(url, 'Quantity', qty);

		ajax.load({
			url: url,
			target: $container,
			callback: function () {
				updateAddToCartButtons();
				addToCart($container);
				tooltip.init();
			}
		});
	});
};
