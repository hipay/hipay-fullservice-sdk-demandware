'use strict';

var View = require('ampersand-view');
var template = require('../../templates/section.hbs');
var DemoView = require('./demo');

module.exports = View.extend({
	template: template,
	render: function () {
		this.renderWithTemplate(this);
		for (var i = 0; i < this.model.demos.length; i++) {
			this.renderSubview(new DemoView({
				model: this.model.demos[i]
			}));
		}
	}
});
