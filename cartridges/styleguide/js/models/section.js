'use strict';

var Model = require('ampersand-model');

module.exports = Model.extend({
	props: {
		title: 'string',
		slug: 'string',
		demos: 'array'
	}
});
