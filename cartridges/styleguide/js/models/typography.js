'use strict';

var Model = require('ampersand-model');

module.exports = Model.extend({
	props: {
		fonts: 'array',
		headings: {
			type: 'array',
			default: function () {return ['h1', 'h2', 'h3', 'h4', 'h5'];}
		}
	}
});
