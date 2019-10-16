'use strict';

var View = require('ampersand-view');
var template = require('../../templates/components.hbs');

var SectionView = require('./sectionWithDemos');
var SectionModel = require('../models/section');
var DemoModel = require('../models/demo');

module.exports = View.extend({
	template: template,
	render: function () {
		this.renderWithTemplate();
		// header
		this.renderSubview(new SectionView({
			model: new SectionModel({
				title: 'Header',
				slug: 'header-with-nav',
				demos: [
					new DemoModel({
						code: require('../../templates/components/header.hbs')(require('../../data/header.json'))
					})
				]
			})
		}));
		// product tile
		this.renderSubview(new SectionView({
			model: new SectionModel({
				title: 'Product Tile',
				slug: 'product-tile',
				demos: [
					new DemoModel({
						code: require('../../templates/components/productTile.hbs')(require('../../data/productTile.json'))
					})
				]
			})
		}));
		return this;
	}
});
