// Include templates
import {templates} from './../../templates/templates';

// Include plugins/libraries
import Url from './../../../vendor/domurl/url.min';

// Include ui utils
import {utils} from './utils';
import {pagination} from './pagination';

const datalistFunctions = {
	selectors: {
		$siteContainer: $('.site-container'),
        $mainSiteContainer: $('.main-site-container'),
        $constrainer: $('#constrainer'),
		tableHeader: '.datalist-view th span:first-child',
		searchSort: '.sort-and-search',
		mainSearchForm: '[data-js-search]',
		filterBar: '.filter-bar',
		activeFilter: '.active-filter a',
		modelInformationTrigger: '[data-js-model-information]',
		modelInformationTarget: '[data-js-model-information-target]',
		fixedHeader: '.datalist--fixed-header',
        paginationTopContainer: '.pagination-top',
        pageFooterContainer: '.page-footer'
	},
	init() {
        const self = this;

        // Clean up views on start.
		localStorage.removeItem('activeRecordId');
		localStorage.removeItem('activeSegmentId');
		localStorage.removeItem('filterList');
		localStorage.removeItem('searchQuery');

		self.sortAndSearch();
		self.removeFilter();
		self.modelDescription();
		pagination.init();
		self.fixTableHeights();
	},
	sortAndSearch() {
        const self = this;

		// ------------
		// Show popover search and re-order box for table headings
		// ------------
		self.selectors.$siteContainer.on('click', self.selectors.tableHeader, (e) => {
            const $currentHeader = $(e.currentTarget);
            const headerText = $currentHeader.text();
            const currentColumn = $currentHeader.parent().data('js-datalist');

			$(self.selectors.mainSearchForm).find('[name="filterColumn"]').val(currentColumn);
			$(self.selectors.searchSort).remove();
			$currentHeader.parents('.datalist').append(templates.nonModels.sortAndSearch(headerText));

			return false;
		});

		// ------------
		// Submit inidividual filter
		// ------------
		self.selectors.$siteContainer.on('submit', self.selectors.searchSort, (e) => {
            const $submit = $(e.currentTarget);
            const url = new Url;
            const searchString = $submit.parent().find('[name="search"]').val();
            const filterColumn = $(self.selectors.mainSearchForm).find('[name="filterColumn"]').val();
            const searchBox = $(self.selectors.mainSearchForm).find('[name="searchTerm"]');
            const filters = $(self.selectors.mainSearchForm).find('[name="filters"]');

			// Put values into normal search form and submit.
			if (url.query.filters === undefined || url.query.filters === "") {
				url.query.filters = `${filterColumn}|${searchString}`;
			} else {
				url.query.filters = `${url.query.filters},${filterColumn}|${searchString}`;
			}

			searchBox.val(url.query.filters);
			filters.val(url.query.filters);

			window.history.pushState('','',url);

			$(self.selectors.mainSearchForm).submit();

			return false;
		});
	},
	storeFilter(activeColumn, activeString) {
        const self = this;

		// Get filters template from 'templates.js' and use for active filter
		if (activeColumn !== "" && activeString !== "") {
			$(self.selectors.filterBar).append(templates.nonModels.storedFilter(activeColumn, activeString));
		}
	},
	removeFilter() {
		const self = this;

		self.selectors.$siteContainer.on('click', self.selectors.activeFilter, (e) => {
			const filter = $(e.currentTarget);
			const url = new Url;
			const itemToRemove = `${filter.parent().find('span').text().trim().replace(/ /g,'_')}|${filter.text().trim()}`;
            const activeFilters = url.query.filters.split(',');
            const searchBox = $(self.selectors.mainSearchForm).find('[name="searchTerm"]');
            const filters = $(self.selectors.mainSearchForm).find('[name="filters"]');

			// Get querystring and see if item we've clicked on exists in the results from 'filters'
			if (activeFilters.indexOf(itemToRemove) > -1){

				// Remove item we've clicked on from array
				activeFilters.splice(activeFilters.indexOf(itemToRemove),1);
			}

			// Reset URL querystring (converting array back to string)
			url.query.filters = activeFilters.toString();

			// Set querystring in URL again
			window.history.pushState('','',url);
			filter.parents('.active-filter').remove();

			// Reset value in search box and filters input and submit
			searchBox.val(url.query.filters);
			filters.val(url.query.filters);
			$(self.selectors.mainSearchForm).submit();

			return false;
		});

		// Adding remove handlers for escape key and clicks outside of the element in question.
		$(document).keyup((e) => {
			if (e.keyCode === 27) {
				$(self.selectors.searchSort).remove();
			}
		});

		self.selectors.$siteContainer.on('click', `${self.selectors.searchSort} [data-js-close="true"]`, () => {
			$(self.selectors.searchSort).remove();
		});
	},
	modelDescription() {
		const self = this;

		self.selectors.$siteContainer.on('click', self.selectors.modelInformationTrigger, () => {
			utils.showForm(self.selectors.modelInformationTarget);
		});

		self.selectors.$siteContainer.on('click', `${self.selectors.modelInformationTarget} [data-js-close]`, () => {
			utils.closeForm(self.selectors.modelInformationTarget);
		});

		$(document).keyup((e) => {
			if (e.keyCode === 27) {
				utils.closeForm(self.selectors.modelInformationTarget);
			}
		});
	},
    fixTableHeights() {
	    const self = this;

        if ($(self.selectors.paginationTopContainer).find(self.selectors.pageFooterContainer).length > 0 && $(document).height() < 1000) {
            const paginationHeight = $(self.selectors.paginationTopContainer).outerHeight() + $(self.selectors.pageFooterContainer).outerHeight();
            self.selectors.$constrainer.height(self.selectors.$mainSiteContainer.height() - paginationHeight);
        } else if ($(document).height() > 1000) {
            self.selectors.$constrainer.height(self.selectors.$mainSiteContainer.height());
        }
    }
};
export { datalistFunctions };
