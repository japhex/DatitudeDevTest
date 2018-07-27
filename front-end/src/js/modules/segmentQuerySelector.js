// Include ui utils
import {utils} from './ui/utils';
import {loaders} from './ui/loaders';

import {extractToolFilters} from "./extract-tool/filters";

const segmentQuerySelector = {
	selectors: {
		$siteContainer: $('.site-container'),
		dataSaveQuery: '[data-save-query]',
		dataSubmitSegmentQuery: '[data-submit-segment-query]',
		segmentOptions: '.segment-options',
		sidebarFilter: '.sidebar-active-filter',
		loadTemplateTrigger: '.pick-templates li'
	},
	init() {
		const self = this;

		self.segmentQuerySelectorActions();
		self.loadQuery();
	},
	segmentQuerySelectorActions() {
		const self = this;

		self.selectors.$siteContainer.on('click', self.selectors.dataSaveQuery, (e) => {
			const filtersObject = localStorage.getItem('filterList');
			utils.showForm(self.selectors.segmentOptions);

			$(self.selectors.segmentOptions).find('[name="volume_available"]').val(parseInt($('.selected-records strong:first').text().replace(/,/g,'')));
			$(self.selectors.segmentOptions).find('[name="grouping"]').val($('[data-js-counts-by-grouping="true"] [name="grouping"]').val());
			$(self.selectors.segmentOptions).find('[name="filtersObject"]').val(filtersObject);
		});

		self.selectors.$siteContainer.on('click', '[data-js-close]', () => {
			utils.closeForm(self.selectors.segmentOptions);
		});

		$(document).keyup(function(e) {
			if (e.keyCode === 27) {
				utils.closeForm(self.selectors.segmentOptions);
			}
		});
	},
	loadQuery() {
		const self = this;
		const $loadViewport = $('.segment-load');
		const sidebar = $loadViewport.data('template-sidebar');
		const countsByGrouping = $loadViewport.data('template-groupby');

		// Build sidebar list of selected filters
		for (const property in sidebar) {
			if (sidebar.hasOwnProperty(property)) {
				extractToolFilters.buildActiveFilterList(property, sidebar[property]);
			}
		}

		extractToolFilters.buildFiltersObject(self.selectors.sidebarFilter,'.sidebar-active-filter-value',false);

		if (countsByGrouping !== null){
			$('[name="grouping"]').val(countsByGrouping).change();
		} else {
			extractToolFilters.applyFiltersRequest('',undefined,undefined, () => {});
		}
	}
};

export { segmentQuerySelector };
