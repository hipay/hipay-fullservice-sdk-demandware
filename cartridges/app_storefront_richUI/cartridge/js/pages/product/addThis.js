/* global addthis */

'use strict';

/**
 * @function
 * @description Initializes the 'AddThis'-functionality for the social sharing plugin
 */
module.exports = function () {
	var addThisServices = ['compact', 'facebook', 'myspace', 'google', 'twitter'],
		$addThisToolbox = $('.addthis_toolbox'),
		addThisLinks = '',
		i,
		len = addThisServices.length;

	for (i = 0; i < len; i++) {
		if ($addThisToolbox.find('.addthis_button_' + addThisServices[i]).length === 0) {
			addThisLinks += '<a class="addthis_button_' + addThisServices[i] + '"></a>';
		}
	}
	if (addThisLinks.length === 0) { return; }

	$addThisToolbox.html(addThisLinks);
	try {
		addthis.toolbox('.addthis_toolbox');
	} catch (e) {
		return;
	}
};
