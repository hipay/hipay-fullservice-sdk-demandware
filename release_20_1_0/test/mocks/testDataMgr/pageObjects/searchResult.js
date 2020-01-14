'use strict';

export const searchForm = 'form[role*=search]';
export const pdpMain = '.search-results';
export const searchResultLarge = '.result-count.hidden-sm-up';
export const searchResultSmall = '.result-count.hidden-xs-down';
export const searchResultCount = '.grid-header .result-count';
export const searchResult = '.grid-header .result-count';
export const searchQuerySelector1 = '.hidden-xs-down .search-field';
export const searchQuerySelector2 = '.hidden-sm-up .search-field';
export const blueColorRefinementSelector = '.swatch-circle-blue';
export const blackColorRefinementSelector = '.swatch-circle-black';
export const redColorRefinementSelector = '.swatch-circle-red';
export const redColorRefinementSelectorChecked = '.swatch-circle-red.selected';
export const buttonfaCircleO = ' .fa-circle-o';
export const faSquareO = ' .fa-square-o';
export const valuesContent2 = ' .values.content li:nth-child(2)';
export const valuesContent3 = ' .values.content li:nth-child(3)';
export const valuesContent8 = ' .values.content li:nth-child(8)';

export const priceRefinementTitle = '.refinement-price.active' + valuesContent3;
export const priceRefinementTitleBrowser = '.refinement-price' + valuesContent3;
export const price3RefinementAppium = '.refinement-price.active' + valuesContent3 + buttonfaCircleO;
export const price3RefinementTitleBrowser = '.refinement-price' + valuesContent3;
export const priceRefinementAppium = priceRefinementTitle + buttonfaCircleO;
export const priceRefinementBrowser = priceRefinementTitleBrowser + buttonfaCircleO;
export const price3RefinementBrowser = '.refinement-price' + valuesContent3 + buttonfaCircleO;

export const newArrivalRefinementUnchecked = '.refinement-bar .fa-square-o';
export const resetButton = '.reset';
export const filterButton = '.filter-results';
export const refinementBarColor = '.refinement-color .card-header';
export const refinementBarPrice = '.refinement-price .card-header';
export const refinementBarNewArrival = '.refinement-new-arrival .card-header';
export const refinementBarSize = '.refinement-size .card-header';
export const refinementBarColorActive = '.refinement-color.active';
export const refinementBarPriceActive = '.refinement-price.active';
export const refinementBarSizeActive = '.refinement-size.active';
export const refinementBarNewArrivalActive = '.refinement-new-arrival.active';
export const customSelect = '.custom-select';
export const sortOrderProductAtoZ = '.custom-select option:nth-child(3)';
export const buttonClose = '.close';
export const size8RefinementSelector = refinementBarSizeActive + valuesContent8 + faSquareO;
export const size8RefinementBrowser = '.refinement-size' + valuesContent8 + faSquareO;

// search as you type
export const suggestionsContainer = '.suggestions .container';
export const suggestionsHeader = '.justify-content-end.header';
export const suggestionsItem = '.justify-content-end.items';
export const suggestionsHref = suggestionsItem + ' .name a';
export const suggestionsSrc = suggestionsItem + ' img';
