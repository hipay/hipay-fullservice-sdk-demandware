'use strict';

var SuggestModel = require('dw/suggest/SuggestModel');
var ArrayList = require('dw/util/ArrayList');

function getProductSuggestions(suggestModel) {
	var suggestions = suggestModel.getProductSuggestions();
	if (!suggestions) {
		return {
			available: false
		};
	}
	return {
		available: suggestions.hasSuggestions(),
		terms: suggestions.getSuggestedTerms(),
		products: suggestions.getSuggestedProducts(),
		phrases: suggestions.getSuggestedPhrases()
	};
}

function getBrandSuggestions(suggestModel) {
	var suggestions = suggestModel.getBrandSuggestions();
	if (!suggestions) {
		return {
			available: false
		};
	}
	return {
		available: suggestions.hasSuggestions(),
		phrases: suggestions.getSuggestedPhrases()
	};
}

function getContentSuggestions(suggestModel) {
	var suggestions = suggestModel.getContentSuggestions();
	if (!suggestions) {
		return {
			available: false
		};
	}
	return {
		available: suggestions.hasSuggestions(),
		content: suggestions.getSuggestedContent()
	};
}

function getCategorySuggestions(suggestModel) {
	var suggestions = suggestModel.getCategorySuggestions();
	if (!suggestions) {
		return {
			available: false
		};
	}
	return {
		available: suggestions.hasSuggestions(),
		phrases: suggestions.getSuggestedPhrases(),
		categories: suggestions.getSuggestedCategories()
	};
}

function getCustomSuggestions(suggestModel) {
	var suggestions = suggestModel.getCustomSuggestions();
	if (!suggestions) {
		return {
			available: false
		};
	}
	return {
		available: suggestions.hasSuggestedPhrases(),
		phrases: suggestions.getSuggestedPhrases()
	};
}

function getPhraseSuggestions(product, brand, category, content, custom) {
	var phrases = new ArrayList();
	var available = brand.available || category.available || content.available || custom.available;
	if (custom.available || category.available) {
		while (custom.phrases.hasNext()) {
			phrases.push(custom.phrases.next().getPhrase());
		}
		while (category.phrases.hasNext()) {
			phrases.push(category.phrases.next().getPhrase());
		}
	}
	if (phrases.length === 1 && !brand.available && !content.available && !category.available) {
		var firstPhrase = phrases.get(0).toString().toUppercase();
		var suggestedTerms, firstTerm;
		while (product.terms.hasNext()) {
			suggestedTerms = product.terms.next();
			if (suggestedTerms.isEmpty()) {
				continue;
			}
			firstTerm = suggestedTerms.getFirstTerm.getValue().toString().toUpperCase();
			if (firstTerm !== firstPhrase) {
				available = false;
			}
		}
	}
	return {
		available: available,
		phrases: phrases
	};
}

module.exports = function(searchPhrase, maxSuggestions) {
	var suggestModel = new SuggestModel();
	suggestModel.setSearchPhrase(searchPhrase);
	suggestModel.setMaxSuggestions(maxSuggestions);
	if (!suggestModel) {
		return;
	}

	var product = getProductSuggestions(suggestModel);
	var brand = getBrandSuggestions(suggestModel);
	var category = getCategorySuggestions(suggestModel);
	var content = getContentSuggestions(suggestModel);
	var custom = getCustomSuggestions(suggestModel);
	var phrase = getPhraseSuggestions(product, brand, category, content, custom);

	return {
		product: product,
		brand: brand,
		category: category,
		content: content,
		custom: custom,
		phrase: phrase
	};
};
