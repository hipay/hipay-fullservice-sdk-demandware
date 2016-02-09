'use strict';

var View = require('ampersand-view');
var template = require('../../templates/elements.hbs');

var SectionView = require('./sectionWithDemos');
var SectionModel = require('../models/section');
var DemoModel = require('../models/demo');

module.exports = View.extend({
	template: template,
	render: function () {
		this.renderWithTemplate();
		// buttons
		this.renderSubview(new SectionView({
			model: new SectionModel({
				title: 'Buttons',
				slug: 'buttons',
				demos: [
					new DemoModel({
						code: require('../../templates/elements/button.hbs')(),
						column: 2
					}),
					new DemoModel({
						code: require('../../templates/elements/buttonLarge.hbs')()
					}),
					new DemoModel({
						code: require('../../templates/elements/buttonRaised.hbs')()
					}),
					new DemoModel({
						code: require('../../templates/elements/buttonSimple.hbs')()
					}),
					new DemoModel({
						code: require('../../templates/elements/buttonDisabled.hbs')()
					}),
					new DemoModel({
						code: require('../../templates/elements/buttonIcon.hbs')()
					})
				]
			})
		}));
		// breadcrumb
		this.renderSubview(new SectionView({
			model: new SectionModel({
				title: 'Breadcrumb',
				slug: 'breadcrumb',
				demos: [
					new DemoModel({
						code: require('../../templates/elements/breadcrumb.hbs')(require('../../data/breadcrumb.json'))
					})
				]
			})
		}));
		// variation swatches
		this.renderSubview(new SectionView({
			model: new SectionModel({
				title: 'Variations Swatches',
				slug: 'variations',
				demos: [
					new DemoModel({
						code: require('../../templates/elements/variations.hbs')(require('../../data/variations.json')),
						column: 2
					})
				]
			})
		}));
		return this;
	}
});
