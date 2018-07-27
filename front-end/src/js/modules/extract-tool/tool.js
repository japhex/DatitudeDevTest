// Include routes
import {routes} from './../routes/routes';

// Include ui utils
import {utils} from './../ui/utils';
import {loaders} from './../ui/loaders';

// Include extract tool modules
import {extractToolFilters} from './filters';
import {extractToolUtils} from './utils/utils';

const extractToolTool = {
	selectors: {
		$siteContainer: $('.site-container'),
		filterTrigger: '.extract-filter-options h2',
		previewTrigger: '[data-form-action="view"]',
		extractTrigger: '[data-form-action="extract"]',
		extractPreview: '.extract-preview',
		extractOptions: '.extract-options',
		filterList: 'select.filter-list, ul.filter-list, div.filter-list',
		extractFilterStats: '.sidebar-filters',
		sidebarFilter: '.sidebar-active-filter',
		sidebarFilterValue: '.sidebar-active-filter-value',
		dataSlideForward: '[data-slide-forward]',
		dataJsExtraction: '[data-js-extraction]',
		extractFilterWizard: '.extract-filter-wizard',
		extractFilterWizardContainer: '.extract-filter-wizard-container',
		wizardLists: '.extract-filter-wizard input',
		exportFormObject: '[data-js-export-form="true"]',
		refreshTrigger: '[data-js-refresh="true"]'
	},
	init() {
		const self = this;

		self.loadToolOptions();
		self.sidebar();
		self.extractData();
		self.extractPreview();
	},
	loadToolOptions() {
        const self = this;

		self.selectors.$siteContainer.on('click', self.selectors.filterTrigger, (e) => {
            const $expandFilters = $(e.currentTarget);
            const $filtersParents = $expandFilters.parents('li');
            const $filters = $filtersParents.find('.filter-selections');
            const $siblingFilters = $filtersParents.siblings().find('.filter-selections');
            const activeFilter = '&#xE15D;';
            const inactiveFilter = '&#xE148;';
            let icon;

			$siblingFilters.hide();
			$siblingFilters.removeClass('active');
			$siblingFilters.parents('li').removeClass('active');
			$siblingFilters.prev().find('i').html(inactiveFilter);
			$filters.toggleClass('active');
			$filtersParents.toggleClass('active');
			$filters.toggle();

			icon = $filters.hasClass('active') ? activeFilter : inactiveFilter;

			$expandFilters.find('i').html(icon);

			// Load select boxes with data on click of containing section
			extractToolUtils.loadSelectOptions($filtersParents);

			return false;
		});

		self.selectors.$siteContainer.on('click', self.selectors.refreshTrigger, () => {
			document.location = document.location;

			return false;
		});
	},
	extractPreview() {
        const self = this;

		self.selectors.$siteContainer.on('click', self.selectors.previewTrigger, () => {
            const sendObject = {
				filterValue: '',
				columnArray: [],
				aggregateColumnArray: [],
				groupByColumn: '',
				filtersObject: localStorage.getItem('filterList')
			};

			loaders.addLoader(self.selectors.extractOptions);

			for (let i=0; i<$('.chosen-columns li').length; i++) {
                const $currentColumn = $($('.chosen-columns li')[i]);

				sendObject.columnArray.push($currentColumn.data('value'));
				sendObject.aggregateColumnArray.push({column : $currentColumn.data('value'),aggregation : $currentColumn.data('aggregation')});
			}

			sendObject.columnArray = JSON.stringify(sendObject.columnArray);
			sendObject.aggregateColumnArray = JSON.stringify(sendObject.aggregateColumnArray);

			for (let i=0; i < $('[name="group-by"]').length; i++){
				let columnToOrderBy = $($('[name="group-by"]')[i]);

				if (columnToOrderBy.prop('checked')) {
					sendObject.groupByColumn = columnToOrderBy.val();
				}
			}

			routes.post(
				'/tools/extract-tool/preview',
				sendObject,
				function(data){
					$(self.selectors.extractPreview).find('tbody').empty();
					$(self.selectors.extractPreview).find('thead tr').empty();

					for (let i=0; i < data.records.length;i++) {
						let html = '<tr>';

						if (i === 0) {
							for (let property in data.records[i]) {
								$(self.selectors.extractPreview).find('thead tr').append(`<th>${property}</th>`);
							}
						}

						for (let property in data.records[i]) {
							html += `<td>${data.records[i][property]}</td>`;
						}

						html += '</tr>';

						$(self.selectors.extractPreview).find('tbody').append(html);
					}

					utils.closeForm($(self.selectors.extractOptions));
					utils.showForm($(self.selectors.extractPreview));
				}
			);
			return false;
		});

		self.selectors.$siteContainer.on('click', '.extract-preview [data-js-close]', () => {
			utils.closeForm($(self.selectors.extractPreview));
			utils.showForm($(self.selectors.extractOptions));
		});

		$(document).on('keyup', (e) => {
			if (e.keyCode === 27) {
				utils.closeForm($(self.selectors.extractPreview));
				utils.closeForm('.template-details');
				utils.closeForm(self.selectors.extractOptions);
				utils.closeForm('.confirmation-popup');
			}
		});
	},
	sidebar() {
        const self = this;

		self.selectors.$siteContainer.on('click', self.selectors.sidebarFilterValue, (e) => {
            const $filterValue = $(e.currentTarget);
            const filterDataValue = $filterValue.data('value');
            const filterDataColumn = $filterValue.data('filter-column');
            const filterGroup = $filterValue.data('filter-group');
			const $select = $(`[data-column="${filterDataColumn}"]`);
            const $parentForm = $select.parents('.form-element');
            const $input = $(`[data-value="${filterDataValue}"]`);
            const $selectParents = $('[data-select-column]:visible').first().parents('li');

			$input.removeClass('selected');
			$select.parents('.date-container').removeClass('active-search');
			$select.parents('.range-container').removeClass('active-search');

			// Clear date fields
			if (!$select.hasClass('range-filter')) {
				$select.find('input').val('');
			}

			if ($filterValue.siblings('.sidebar-active-filter-value').length === 0) {
				$filterValue.parent().remove();
			}

			// Remove value on click
			$filterValue.remove();

			// Rebuild filters object without value
			extractToolFilters.buildFiltersObject(self.selectors.sidebarFilter,'.sidebar-active-filter-value',false,$parentForm,false,true);

			// Re-send request to get new resultset count without value
			extractToolFilters.applyFiltersRequest('',filterGroup);

			// Re-load all select filters that are on screen
			extractToolUtils.loadSelectOptions($selectParents);

			if ($(self.selectors.sidebarFilterValue).length === 0) {
				$(self.selectors.sidebarFilter).remove();
				$(self.selectors.extractFilterStats).hide();
			}
		});
	},
	extractData() {
        const self = this;
        let newObject;

		self.selectors.$siteContainer.on('click', self.selectors.extractTrigger, () => {
			utils.showForm($(self.selectors.extractOptions));
		});

		// Format all data accordingly
		self.selectors.$siteContainer.on('click', self.selectors.dataJsExtraction, (e) => {
            const $trigger = $(e.currentTarget);
            let sendObject = {
					filtersObject: localStorage.getItem('filterList'),
					groupByColumn: '',
					columnArray: [],
					aggregateColumnArray: [],
					orderByColumn: '',
	                filename: '',
					dataType: ''
            };
            let $selectColumns;

			// Detect whether button has been triggered for download form saved template or wizard has been used
			if ($trigger.data('js-outside-wizard')) {
				$(self.selectors.dataSlideForward).click();
			}

			$selectColumns = $('.chosen-columns').find('li');

			// Build array of columns to select from DB
			for (let i=0; i<$selectColumns.length; i++) {
				sendObject.columnArray.push($($selectColumns[i]).data('value'));
				sendObject.aggregateColumnArray.push({column : $($selectColumns[i]).data('value'), aggregation : $($selectColumns[i]).data('aggregation')});
			}

			// Stringify Array of columns to be sent to DB
			sendObject.columnArray = JSON.stringify(sendObject.columnArray);
			sendObject.aggregateColumnArray = JSON.stringify(sendObject.aggregateColumnArray);

			// Set GROUP BY SQL clause
			for (let j=0; j < $('[name="group-by"]').length; j++){
                const columnToOrderBy = $($('[name="group-by"]')[j]);

				if (columnToOrderBy.prop('checked')) {
					sendObject.groupByColumn = columnToOrderBy.val();
				}
			}

			// Set ORDER BY clause to be the column at the top of the list
			sendObject.orderByColumn = $($selectColumns[0]).data('value');

			newObject = sendObject;

			loaders.addLoader(self.selectors.extractFilterWizardContainer);

			// Apply data type before exporting
			$(self.selectors.exportFormObject).find('[name="dataType"]').val('val');

			newObject.filtersObject = localStorage.getItem('filterList');
			newObject.format = 'csv';
			newObject.filename = $('[name="extractName"]').val();

			// Forward to export routing
			routes.post(
				'/tools/extract-tool/extract-data',
				newObject,
				function(){
					utils.closeForm(self.selectors.extractOptions);
				}
			);
		});

		// Click for lists within wixard to enable/disable buttons
		self.selectors.$siteContainer.on('click', self.selectors.wizardLists, () => {
			if ($('.filter-selections').find('input[type="checkbox"]:checked').length > 0) {
				$(`[data-slide="2"] ${self.selectors.dataSlideForward}`).removeAttr('disabled');
			} else {
				$(`[data-slide="2"] ${self.selectors.dataSlideForward}`).attr('disabled','disabled');
			}
		});

		self.selectors.$siteContainer.on('click', '.data-type [data-js-close-sub]',function(){
			$('.data-type').fadeOut().remove();
		});

		self.selectors.$siteContainer.on('click', '.extract-options [data-js-close]',function(){
			utils.closeForm(self.selectors.extractOptions);
		});
	}
};

export { extractToolTool };
