'use strict';

/**
 * Renders a modal window that will track the users consenting to accepting site tracking policy
 */
function showConsentModal() {
    if (!$('.tracking-consent').data('caonline')) {
        return;
    }

    var urlContent = $('.tracking-consent').data('url');
    var urlAccept = $('.tracking-consent').data('accept');
    var urlReject = $('.tracking-consent').data('reject');
    var textYes = $('.tracking-consent').data('accepttext');
    var textNo = $('.tracking-consent').data('rejecttext');
    var textHeader = $('.tracking-consent').data('heading');

    var htmlString = '<!-- Modal -->'
        + '<div class="modal show" id="consent-tracking" role="dialog" style="display: block;">'
        + '<div class="modal-dialog">'
        + '<!-- Modal content-->'
        + '<div class="modal-content">'
        + '<div class="modal-header">'
        + textHeader
        + '</div>'
        + '<div class="modal-body"></div>'
        + '<div class="modal-footer">'
        + '<div class="button-wrapper">'
        + '<button class="affirm btn btn-primary" data-url="' + urlAccept + '">'
        + textYes
        + '</button>'
        + '<button class="decline btn btn-primary" data-url="' + urlReject + '">'
        + textNo
        + '</button>'
        + '</div>'
        + '</div>'
        + '</div>'
        + '</div>'
        + '</div>';
    $.spinner().start();
    $('body').append(htmlString);

    $.ajax({
        url: urlContent,
        type: 'get',
        dataType: 'html',
        success: function (response) {
            $('.modal-body').html(response);
        },
        error: function () {
            $('#consent-tracking').remove();
        }
    });

    $('#consent-tracking .button-wrapper button').click(function (e) {
        e.preventDefault();
        var url = $(this).data('url');
        $.ajax({
            url: url,
            type: 'get',
            dataType: 'json',
            success: function () {
                $('#consent-tracking').remove();
                $.spinner().stop();
            },
            error: function () {
                $('#consent-tracking').remove();
                $.spinner().stop();
            }
        });
    });
}

module.exports = function () {
    if ($('.consented').length === 0 && $('.tracking-consent').hasClass('api-true')) {
        showConsentModal();
    }

    if ($('.tracking-consent').hasClass('api-true')) {
        $('.tracking-consent').click(function () {
            showConsentModal();
        });
    }
};
