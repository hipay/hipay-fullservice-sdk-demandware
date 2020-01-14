'use strict';

var processInclude = require('./util');

$(document).ready(function () {
    processInclude(require('./search/search'));
    processInclude(require('./product/quickView'));
});
