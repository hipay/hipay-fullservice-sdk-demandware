'use strict';

var Model = require('ampersand-model');

module.exports = Model.extend({
	props: {
		code: 'string',
		column: {
			type: 'number',
			default: 1
		},
		showMarkup: ['boolean', true, false]
	}
});
