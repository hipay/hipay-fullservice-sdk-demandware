'use strict';

/**
 * @function
 * @description Initializes the tooltip-content and layout
 */
exports.init = function () {
	$(document).tooltip({
		items: '.tooltip',
		track: true,
		content: function () {
			return $(this).find('.tooltip-content').html();
		}
	});
};
