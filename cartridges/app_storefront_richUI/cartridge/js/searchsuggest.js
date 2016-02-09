'use strict';

var util = require('./util');

var qlen = 0,
	listTotal = -1,
	listCurrent = -1,
	delay = 300,
	fieldDefault = null,
	suggestionsJson = null,
	$searchForm,
	$searchField,
	$searchContainer,
	$resultsContainer;
/**
 * @function
 * @description Handles keyboard's arrow keys
 * @param keyCode Code of an arrow key to be handled
 */
function handleArrowKeys(keyCode) {
	switch (keyCode) {
		case 38:
			// keyUp
			listCurrent = (listCurrent <= 0) ? (listTotal - 1) : (listCurrent - 1);
			break;
		case 40:
			// keyDown
			listCurrent = (listCurrent >= listTotal - 1) ? 0 : listCurrent + 1;
			break;
		default:
			// reset
			listCurrent = -1;
			return false;
	}

	$resultsContainer.children().removeClass('selected').eq(listCurrent).addClass('selected');
	$searchField.val($resultsContainer.find('.selected .suggestionterm').first().text());
	return true;
}
var searchsuggest = {
	/**
	 * @function
	 * @description Configures parameters and required object instances
	 */
	init: function (container, defaultValue) {
		// initialize vars
		$searchContainer = $(container);
		$searchForm = $searchContainer.find('form[name="simpleSearch"]');
		$searchField = $searchForm.find('input[name="q"]');
		fieldDefault = defaultValue;

		// disable browser auto complete
		$searchField.attr('autocomplete', 'off');

		// on focus listener (clear default value)
		$searchField.focus(function () {
			if (!$resultsContainer) {
				// create results container if needed
				$resultsContainer = $('<div/>').attr('id', 'suggestions').appendTo($searchContainer).css({
					'top': $searchContainer[0].offsetHeight,
					'left': 0,
					'width': $searchField[0].offsetWidth
				});
			}
			if ($searchField.val() === fieldDefault) {
				$searchField.val('');
			}
		});
		// on blur listener
		$searchField.blur(function () {
			setTimeout(this.clearResults, 200);
		}.bind(this));
		// on key up listener
		$searchField.keyup(function (e) {

			// get keyCode (window.event is for IE)
			var keyCode = e.keyCode || window.event.keyCode;

			// check and treat up and down arrows
			if (handleArrowKeys(keyCode)) {
				return;
			}
			// check for an ENTER or ESC
			if (keyCode === 13 || keyCode === 27) {
				this.clearResults();
				return;
			}

			var lastVal = $searchField.val();

			// if is text, call with delay
			setTimeout(function () {
				this.suggest(lastVal);
			}.bind(this), delay);
		}.bind(this));
		// on submit we do not submit the form, but change the window location
		// in order to avoid https to http warnings in the browser
		// only if it's not the default value and it's not empty
		$searchForm.submit(function (e) {
			e.preventDefault();
			var searchTerm = $searchField.val();
			if (searchTerm === fieldDefault || searchTerm.length === 0) {
				return false;
			}
			window.location = util.appendParamToURL($(this).attr('action'), 'q', searchTerm);
		});
	},

	/**
	 * @function
	 * @description trigger suggest action
	 * @param lastValue
	 */
	suggest: function (lastValue) {
		// get the field value
		var part = $searchField.val();

		// if it's empty clear the resuts box and return
		if (part.length === 0) {
			this.clearResults();
			return;
		}

		// if part is not equal to the value from the initiated call,
		// or there were no results in the last call and the query length
		// is longer than the last query length, return
		// #TODO: improve this to look at the query value and length
		if ((lastValue !== part) || (listTotal === 0 && part.length > qlen)) {
			return;
		}
		qlen = part.length;

		// build the request url
		var reqUrl = util.appendParamToURL(Urls.searchsuggest, 'q', part);
		reqUrl = util.appendParamToURL(reqUrl, 'legacy', 'true');

		// get remote data as JSON
		$.getJSON(reqUrl, function (data) {
			// get the total of results
			var suggestions = data,
				ansLength = suggestions.length;

			// if there are results populate the results div
			if (ansLength === 0) {
				this.clearResults();
				return;
			}
			suggestionsJson = suggestions;
			var html = '';
			for (var i = 0; i < ansLength; i++) {
				html += '<div><div class="suggestionterm">' + suggestions[i].suggestion + '</div><span class="hits">' + suggestions[i].hits + '</span></div>';
			}

			// update the results div
			$resultsContainer.html(html).show().on('hover', 'div', function () {
				$(this).toggleClass = 'selected';
			}).on('click', 'div', function () {
				// on click copy suggestion to search field, hide the list and submit the search
				$searchField.val($(this).children('.suggestionterm').text());
				this.clearResults();
				$searchForm.trigger('submit');
			}.bind(this));
		}.bind(this));
	},
	/**
	 * @function
	 * @description
	 */
	clearResults: function () {
		if (!$resultsContainer) { return; }
		$resultsContainer.empty().hide();
	}
};

module.exports = searchsuggest;
