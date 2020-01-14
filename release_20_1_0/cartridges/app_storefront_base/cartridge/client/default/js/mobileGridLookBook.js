'use strict';

$(document).ready(function () {
    $('body').on('click', '.show-more-button', function (e) {
        e.preventDefault();

        var $set2Element = $(this).closest('.look-book-layout').find('.look-book-set2');
        $set2Element.removeClass('hide-set');

        var $showMoreElement = $(this).closest('.look-book-layout').find('.show-more');
        $showMoreElement.addClass('d-none');
    });
});
