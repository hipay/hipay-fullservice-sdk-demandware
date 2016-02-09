'use strict';

var dialog = require('../../dialog'),
	minicart = require('../../minicart'),
	page = require('../../page'),
	util = require('../../util'),
	TPromise = require('promise'),
	_ = require('lodash');

/**
 * @description Make the AJAX request to add an item to cart
 * @param {Element} form The form element that contains the item quantity and ID data
 * @returns {Promise}
 */
var addItemToCart = function (form) {
	var $form = $(form),
		$qty = $form.find('input[name="Quantity"]');
	if ($qty.length === 0 || isNaN($qty.val()) || parseInt($qty.val(), 10) === 0) {
		$qty.val('1');
	}
	return TPromise.resolve($.ajax({
		type: 'POST',
		url: util.ajaxUrl(Urls.addProduct),
		data: $form.serialize()
	}));
};

/**
 * @description Handler to handle the add to cart event
 */
var addToCart = function (e) {
	e.preventDefault();
	var $form = $(this).closest('form');

	addItemToCart($form).then(function (response) {
		var $uuid = $form.find('input[name="uuid"]');
		if ($uuid.length > 0 && $uuid.val().length > 0) {
			page.refresh();
		} else {
			// do not close quickview if adding individual item that is part of product set
			// @TODO should notify the user some other way that the add action has completed successfully
			if (!$(this).hasClass('sub-product-item')) {
				dialog.close();
			}
			minicart.show(response);
		}
	}.bind(this));
};

/**
 * @description Handler to handle the add all items to cart event
 */
var addAllToCart = function (e) {
	e.preventDefault();
	var $productForms = $('#product-set-list').find('form').toArray();
	TPromise.all(_.map($productForms, addItemToCart))
		.then(function (responses) {
			dialog.close();
			// show the final response only, which would include all the other items
			minicart.show(responses[responses.length - 1]);
		});
};

/**
 * @function
 * @description Binds the click event to a given target for the add-to-cart handling
 * @param {Element} target The target on which an add to cart event-handler will be set
 */
module.exports = function (target) {
	$('.add-to-cart[disabled]').attr('title', $('.availability-msg').text());

	if (target) {
		target.on('click', '.add-to-cart', addToCart);
	} else {
		$('.add-to-cart').on('click', addToCart);
	}

	$('#add-all-to-cart').on('click', addAllToCart);
};
