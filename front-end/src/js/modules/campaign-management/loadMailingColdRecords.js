define([
	'jquery',
	'jqueryui',
	'utils',
	'routes',
	'loaders'
],
function($, jqueryui, utils, loaders) {
	var loadMailingColdRecords = {
		selectors: {
			$siteContainer: $('.site-container'),
			$searchForm: $('[data-js-advsearch="true"]'),
			searchForm: '.advance-search-filter',
			resultsContainer: '.datalist-viewport',
			siteContainer: '.site-container',
			activeFilters: '.active-filter',
			$emptyTable: $('.empty-table'),
			searchAction: '[data-js-filter-target="searchadv"]',
			$searchAction: $('[data-js-filter="searchadv"]'),
			formReset: ':reset',
			$countryChoice: $('select[name="country"]'),
			reasonChoice: 'select[name="reason_select"]',
			$editForm: $('[data-js="datalistedit"]')
		},
		init: function() {
			var self = this;
			localStorage.setItem('filterList',JSON.stringify({}));
		}
	};

	return loadMailingColdRecords;
});
