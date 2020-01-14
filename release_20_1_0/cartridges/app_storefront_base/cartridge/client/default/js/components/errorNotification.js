'use strict';

module.exports = function (element, message) {
    var errorHtml = '<div class="alert alert-danger alert-dismissible ' +
        'fade show" role="alert">' +
        '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
        '<span aria-hidden="true">&times;</span>' +
        '</button>' + message + '</div>';

    $(element).append(errorHtml);
};
