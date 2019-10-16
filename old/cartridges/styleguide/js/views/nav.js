'use strict';

var View = require('ampersand-view');
var template = require('../../templates/nav.hbs');

var NavView = View.extend({
	template: template
});

module.exports = NavView;
