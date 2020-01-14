'use strict';

/**
 * Show a spinner inside a given element
 * @param {element} $target - Element to block by the veil and spinner.
 *                            Pass body to block the whole page.
 */
function addSpinner($target) {
    var $veil = $('<div class="veil"><div class="underlay"></div></div>');
    $veil.append('<div class="spinner"><div class="dot1"></div><div class="dot2"></div></div>');
    if ($target.get(0).tagName === 'IMG') {
        $target.after($veil);
        $veil.css({ width: $target.width(), height: $target.height() });
        if ($target.parent().css('position') === 'static') {
            $target.parent().css('position', 'relative');
        }
    } else {
        $target.append($veil);
        if ($target.css('position') === 'static') {
            $target.parent().css('position', 'relative');
            $target.parent().addClass('veiled');
        }
        if ($target.get(0).tagName === 'BODY') {
            $veil.find('.spinner').css('position', 'fixed');
        }
    }
    $veil.click(function (e) {
        e.stopPropagation();
    });
}

/**
 * Remove existing spinner
 * @param  {element} $veil - jQuery pointer to the veil element
 */
function removeSpinner($veil) {
    if ($veil.parent().hasClass('veiled')) {
        $veil.parent().css('position', '');
        $veil.parent().removeClass('veiled');
    }
    $veil.off('click');
    $veil.remove();
}

// element level spinner:
$.fn.spinner = function () {
    var $element = $(this);
    var Fn = function () {
        this.start = function () {
            if ($element.length) {
                addSpinner($element);
            }
        };
        this.stop = function () {
            if ($element.length) {
                var $veil = $('.veil');
                removeSpinner($veil);
            }
        };
    };
    return new Fn();
};

// page-level spinner:
$.spinner = function () {
    var Fn = function () {
        this.start = function () {
            addSpinner($('body'));
        };
        this.stop = function () {
            removeSpinner($('.veil'));
        };
    };
    return new Fn();
};
