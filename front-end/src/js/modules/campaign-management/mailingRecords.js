// Import and expose jQuery
import 'jquery-ui';

import Url from './../../../vendor/domurl/url.min';

const mailingRecords = {
	selectors: {
		$siteContainer: $('.site-container'),
		$searchForm: $('[data-js-advsearch="true"]'),
		searchForm: '.advance-search-filter',
		resultsContainer: '.datalist-viewport',
		siteContainer: '.site-container',
		activeFilters: '.active-filter',
		$emptyTable: $('.empty-table'),
		searchAction: '[data-js-filter-target="advsearch-filter"]',
		$searchAction: $('[data-js-filter-target="advsearch-filter"]'),
		formReset: ':reset',
		$countryChoice: $('select[name="country"]'),
		reasonChoice: 'select[name="reason_select"]',
		$editForm: $('[data-js="datalistedit"]')
	},
	init() {
		const self = this;
		self.displaySearch();
		self.reasonSelect();
	},
	displaySearch() {
		const self = this;
		if(self.selectors.$emptyTable.length > 0){
			$(self.selectors.searchAction).trigger("click");
			return false;
		}
	},
	reasonSelect() {
		const self = this;
		self.selectors.$siteContainer.on('change', $(self.selectors.reasonChoice), function(){
			let selected_reason = $(self.selectors.reasonChoice).find(":selected").val();
			if(selected_reason === "Other"){
				$('#reason_choice').show();
			} else {
				$('#reason').val(selected_reason);
			}
		});
	}
};

export { mailingRecords };
