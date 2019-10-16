'use strict';

var MainView = require('./views/main');
var NavView = require('./views/nav');
require('./handlebars');

new NavView({
	el: document.querySelector('#nav')
}).render();

new MainView({
	el: document.querySelector('#main')
}).render();
