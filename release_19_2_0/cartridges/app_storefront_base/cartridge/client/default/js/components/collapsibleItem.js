'use strict';
module.exports = function () {
    var sizes = ['xs', 'sm', 'md', 'lg', 'xl'];

    sizes.forEach(function (size) {
        var selector = '.collapsible-' + size + ' .title';
        $('body').on('click', selector, function (e) {
            e.preventDefault();
            $(this).parents('.collapsible-' + size).toggleClass('active');

            if ($(this).parents('.collapsible-' + size).hasClass('active')) {
                $(this).attr('aria-expanded', true);
            } else {
                $(this).attr('aria-expanded', false);
            }
        });
    });
};
