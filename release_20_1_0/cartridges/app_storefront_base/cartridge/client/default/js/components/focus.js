'use strict';

module.exports = {
    setTabNextFocus: function (focusParams) {
        var KEYCODE_TAB = 9;
        var isTabPressed = (focusParams.event.key === 'Tab' || focusParams.event.keyCode === KEYCODE_TAB);

        if (!isTabPressed) {
            return;
        }

        var firstFocusableEl = $(focusParams.containerSelector + ' ' + focusParams.firstElementSelector);
        var lastFocusableEl = $(focusParams.containerSelector + ' ' + focusParams.lastElementSelector);

        if ($(focusParams.containerSelector + ' ' + focusParams.lastElementSelector).is(':disabled')) {
            lastFocusableEl = $(focusParams.containerSelector + ' ' + focusParams.nextToLastElementSelector);
            if ($('.product-quickview.product-set').length > 0) {
                var linkElements = $(focusParams.containerSelector + ' a#fa-link.share-icons');
                lastFocusableEl = linkElements[linkElements.length - 1];
            }
        }

        if (focusParams.event.shiftKey) /* shift + tab */ {
            if ($(':focus').is(firstFocusableEl)) {
                lastFocusableEl.focus();
                focusParams.event.preventDefault();
            }
        } else /* tab */ {
            if ($(':focus').is(lastFocusableEl)) { // eslint-disable-line
                firstFocusableEl.focus();
                focusParams.event.preventDefault();
            }
        }
    }
};
