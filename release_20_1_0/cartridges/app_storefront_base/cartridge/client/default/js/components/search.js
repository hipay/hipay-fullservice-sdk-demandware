'use strict';

var debounce = require('lodash/debounce');
var endpoint = $('.suggestions-wrapper').data('url');
var minChars = 3;
var UP_KEY = 38;
var DOWN_KEY = 40;
var DIRECTION_DOWN = 1;
var DIRECTION_UP = -1;

/**
 * Retrieves Suggestions element relative to scope
 *
 * @param {Object} scope - Search input field DOM element
 * @return {JQuery} - .suggestions-wrapper element
 */
function getSuggestionsWrapper(scope) {
    return $(scope).siblings('.suggestions-wrapper');
}

/**
 * Determines whether DOM element is inside the .search-mobile class
 *
 * @param {Object} scope - DOM element, usually the input.search-field element
 * @return {boolean} - Whether DOM element is inside  div.search-mobile
 */
function isMobileSearch(scope) {
    return !!$(scope).closest('.search-mobile').length;
}

/**
 * Remove modal classes needed for mobile suggestions
 *
 */
function clearModals() {
    $('body').removeClass('modal-open');
    $('header').siblings().attr('aria-hidden', 'false');
    $('.suggestions').removeClass('modal');
}

/**
 * Apply modal classes needed for mobile suggestions
 *
 * @param {Object} scope - Search input field DOM element
 */
function applyModals(scope) {
    if (isMobileSearch(scope)) {
        $('body').addClass('modal-open');
        $('header').siblings().attr('aria-hidden', 'true');
        getSuggestionsWrapper(scope).find('.suggestions').addClass('modal');
    }
}

/**
 * Tear down Suggestions panel
 */
function tearDownSuggestions() {
    $('input.search-field').val('');
    clearModals();
    $('.search-mobile .suggestions').unbind('scroll');
    $('.suggestions-wrapper').empty();
}

/**
 * Toggle search field icon from search to close and vice-versa
 *
 * @param {string} action - Action to toggle to
 */
function toggleSuggestionsIcon(action) {
    var mobileSearchIcon = '.search-mobile button.';
    var iconSearch = 'fa-search';
    var iconSearchClose = 'fa-close';

    if (action === 'close') {
        $(mobileSearchIcon + iconSearch).removeClass(iconSearch).addClass(iconSearchClose).attr('type', 'button');
    } else {
        $(mobileSearchIcon + iconSearchClose).removeClass(iconSearchClose).addClass(iconSearch).attr('type', 'submit');
    }
}

/**
 * Determines whether the "More Content Below" icon should be displayed
 *
 * @param {Object} scope - DOM element, usually the input.search-field element
 */
function handleMoreContentBelowIcon(scope) {
    if (($(scope).scrollTop() + $(scope).innerHeight()) >= $(scope)[0].scrollHeight) {
        $('.more-below').fadeOut();
    } else {
        $('.more-below').fadeIn();
    }
}

/**
 * Positions Suggestions panel on page
 *
 * @param {Object} scope - DOM element, usually the input.search-field element
 */
function positionSuggestions(scope) {
    var outerHeight;
    var $scope;
    var $suggestions;
    var top;

    if (isMobileSearch(scope)) {
        $scope = $(scope);
        top = $scope.offset().top;
        outerHeight = $scope.outerHeight();
        $suggestions = getSuggestionsWrapper(scope).find('.suggestions');
        $suggestions.css('top', top + outerHeight);

        handleMoreContentBelowIcon(scope);

        // Unfortunately, we have to bind this dynamically, as the live scroll event was not
        // properly detecting dynamic suggestions element's scroll event
        $suggestions.scroll(function () {
            handleMoreContentBelowIcon(this);
        });
    }
}

/**
 * Process Ajax response for SearchServices-GetSuggestions
 *
 * @param {Object|string} response - Empty object literal if null response or string with rendered
 *                                   suggestions template contents
 */
function processResponse(response) {
    var $suggestionsWrapper = getSuggestionsWrapper(this).empty();

    $.spinner().stop();

    if (!(typeof (response) === 'object')) {
        $suggestionsWrapper.append(response).show();
        $(this).siblings('.reset-button').addClass('d-sm-block');
        positionSuggestions(this);

        if (isMobileSearch(this)) {
            toggleSuggestionsIcon('close');
            applyModals(this);
        }

        // Trigger screen reader by setting aria-describedby with the new suggestion message.
        var suggestionsList = $('.suggestions .item');
        if ($(suggestionsList).length) {
            $('input.search-field').attr('aria-describedby', 'search-result-count');
        } else {
            $('input.search-field').removeAttr('aria-describedby');
        }
    } else {
        $suggestionsWrapper.hide();
    }
}

/**
 * Retrieve suggestions
 *
 * @param {Object} scope - Search field DOM element
 */
function getSuggestions(scope) {
    if ($(scope).val().length >= minChars) {
        $.spinner().start();
        $.ajax({
            context: scope,
            url: endpoint + encodeURIComponent($(scope).val()),
            method: 'GET',
            success: processResponse,
            error: function () {
                $.spinner().stop();
            }
        });
    } else {
        toggleSuggestionsIcon('search');
        $(scope).siblings('.reset-button').removeClass('d-sm-block');
        clearModals();
        getSuggestionsWrapper(scope).empty();
    }
}

/**
 * Handle Search Suggestion Keyboard Arrow Keys
 *
 * @param {Integer} direction takes positive or negative number constant, DIRECTION_UP (-1) or DIRECTION_DOWN (+1)
 */
function handleArrow(direction) {
    // get all li elements in the suggestions list
    var suggestionsList = $('.suggestions .item');
    if (suggestionsList.filter('.selected').length === 0) {
        suggestionsList.first().addClass('selected');
        $('input.search-field').each(function () {
            $(this).attr('aria-activedescendant', suggestionsList.first()[0].id);
        });
    } else {
        suggestionsList.each(function (index) {
            var idx = index + direction;
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
                $(this).removeAttr('aria-selected');
                if (suggestionsList.eq(idx).length !== 0) {
                    suggestionsList.eq(idx).addClass('selected');
                    suggestionsList.eq(idx).attr('aria-selected', true);
                    $(this).removeProp('aria-selected');
                    $('input.search-field').each(function () {
                        $(this).attr('aria-activedescendant', suggestionsList.eq(idx)[0].id);
                    });
                } else {
                    suggestionsList.first().addClass('selected');
                    suggestionsList.first().attr('aria-selected', true);
                    $('input.search-field').each(function () {
                        $(this).attr('aria-activedescendant', suggestionsList.first()[0].id);
                    });
                }
                return false;
            }
            return true;
        });
    }
}

module.exports = function () {
    $('form[name="simpleSearch"]').submit(function (e) {
        var suggestionsList = $('.suggestions .item');
        if (suggestionsList.filter('.selected').length !== 0) {
            e.preventDefault();
            suggestionsList.filter('.selected').find('a')[0].click();
        }
    });

    $('input.search-field').each(function () {
        /**
         * Use debounce to avoid making an Ajax call on every single key press by waiting a few
         * hundred milliseconds before making the request. Without debounce, the user sees the
         * browser blink with every key press.
         */
        var debounceSuggestions = debounce(getSuggestions, 300);
        $(this).on('keyup focus', function (e) {
            // Capture Down/Up Arrow Key Events
            switch (e.which) {
                case DOWN_KEY:
                    handleArrow(DIRECTION_DOWN);
                    e.preventDefault(); // prevent moving the cursor
                    break;
                case UP_KEY:
                    handleArrow(DIRECTION_UP);
                    e.preventDefault(); // prevent moving the cursor
                    break;
                default:
                    debounceSuggestions(this, e);
            }
        });
    });

    $('body').on('click', function (e) {
        if (!$('.suggestions').has(e.target).length && !$(e.target).hasClass('search-field')) {
            $('.suggestions').hide();
        }
    });

    $('body').on('click touchend', '.search-mobile button.fa-close', function (e) {
        e.preventDefault();
        $('.suggestions').hide();
        toggleSuggestionsIcon('search');
        tearDownSuggestions();
    });

    $('.site-search .reset-button').on('click', function () {
        $(this).removeClass('d-sm-block');
    });
};
