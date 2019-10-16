'use strict';

var View = require('ampersand-view');
var template = require('../../templates/main.hbs');

var FoundationView = require('./foundation');
var ElementsView = require('./elements');
var ComponentsView = require('./components');

var MainView = View.extend({
	template: template,
	render: function () {
		this.renderWithTemplate();
		this.renderSubview(new FoundationView());
		this.renderSubview(new ElementsView());
		this.renderSubview(new ComponentsView());
		return this;
	}
});

module.exports = MainView;
