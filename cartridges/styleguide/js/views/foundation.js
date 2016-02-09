'use strict';

var View = require('ampersand-view');
var template = require('../../templates/foundation.hbs');

var ColorsView = require('./colors');
var TypographyView = require('./typography');
var IconsView = require('./icons');

var ColorsModel = require('../models/colors');
var TypographyModel = require('../models/typography');
var IconsModel = require('../models/icons');

module.exports = View.extend({
	template: template,
	render: function () {
		this.renderWithTemplate();
		this.renderSubview(new ColorsView({
			model: new ColorsModel({
				colors: require('../../data/colors.json')
			})
		}));
		this.renderSubview(new TypographyView({
			model: new TypographyModel({
				fonts: require('../../data/fonts.json')
			})
		}));
		this.renderSubview(new IconsView({
			model: new IconsModel({
				icons: require('../../data/icons.json')
			})
		}));
		return this;
	}
});
