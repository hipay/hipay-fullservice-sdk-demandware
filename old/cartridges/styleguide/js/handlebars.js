'use strict';

var Handlebars = require('hbsfy/runtime');

Handlebars.registerHelper('log', function (stuff) {
	//jshint devel:true
	console.log(stuff);
});

Handlebars.registerHelper('ifeq', function (a, b, options) {
	if (a === b) {
		return options.fn(this);
	} else {
		return options.inverse(this);
	}
});
