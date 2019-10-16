'use strict';

var View = require('ampersand-view');
var template = require('../../templates/demo.hbs');

module.exports = View.extend({
	template: template,
	props: {
		showMarkup: ['boolean', true, true]
	},
	derived: {
		showMarkupText: {
			deps: ['model.showMarkup'],
			fn: function () {
				return (this.model.showMarkup ? 'Hide' : 'Show') + ' markup';
			}
		}
	},
	events: {
		'click .toggle-markup': 'toggleMarkup'
	},
	bindings: {
		'model.showMarkup': {
			type: 'toggle',
			hook: 'markup'
		},
		'showMarkupText': {
			type: 'text',
			selector: '.toggle-markup'
		}
	},
	toggleMarkup: function () {
		this.model.showMarkup = !this.model.showMarkup;
	}
});
