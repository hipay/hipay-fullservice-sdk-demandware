'use strict';

var dialog = require('./dialog'),
	util = require('./util'),
	validator = require('./validator');

var sendToFriend = {
	init: function () {
		$('#send-to-friend-dialog')
			.on('click', '.preview-button, .send-button, .edit-button', function (e) {
				e.preventDefault();
				var $form = $('#send-to-friend-form');
				$form.validate();
				if (!$form.valid()) {
					return false;
				}
				var requestType = $form.find('#request-type');
				if (requestType.length > 0) {
					requestType.remove();
				}
				$('<input/>').attr({
					id: 'request-type',
					type: 'hidden',
					name: $(this).attr('name'),
					value: $(this).attr('value')
				}).appendTo($form);
				dialog.replace({
					url: $form.attr('action'),
					data: $form.serialize(),
					callback: function () {
						validator.init();
						util.limitCharacters();
					}
				});
			})
			.on('click', '.cancel-button, .close-button', function (e) {
				e.preventDefault();
				dialog.close();
			});
	},
	initializeDialog: function (eventDelegate) {
		// detect withCredentials support to do CORS from HTTP to HTTPS
		// with browsers do not support withCredentials (mainly IE 8 and 9), fall back to page reload
		if (!('withCredentials' in new XMLHttpRequest())) {
			return;
		}
		$(eventDelegate).on('click', '.send-to-friend', function (e) {
			e.preventDefault();
			var data = util.getQueryStringParams($('.pdpForm').serialize());
			if (data.cartAction) {
				delete data.cartAction;
			}
			var url = util.appendParamsToUrl(this.href, data);

			dialog.open({
				target: '#send-to-friend-dialog',
				url: url,
				options: {
					title: this.title
				},
				callback: function () {
					sendToFriend.init();
					validator.init();
					util.limitCharacters();
				}
			});
		});
	}
};

module.exports = sendToFriend;
