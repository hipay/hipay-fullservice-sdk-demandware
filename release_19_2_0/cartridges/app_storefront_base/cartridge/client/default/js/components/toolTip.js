'use strict';

module.exports = function () {
    $('.info-icon').on('mouseenter focusin', function () {
        $(this).find('.tooltip').removeClass('d-none');
    });

    $('.info-icon').on('mouseleave focusout', function () {
        $(this).find('.tooltip').addClass('d-none');
    });
};
