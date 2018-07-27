// Include routes
import {routes} from './../routes/routes';

// Include ui utils
import {loaders} from './../ui/loaders';

import {urls} from './../../templates/templates';

const extractToolData = {
	selectors: {
		$siteContainer: $('.site-container'),
		filterList: 'select.filter-list, ul.filter-list, div.filter-list',
		filterButtons: '.filter-values-selector .btn',
		dataSlideForward: '[data-slide-forward]',
		wizardLists: '.extract-filter-wizard input',
		columnSelectionTrigger: '[data-column-selection]',
		searchColumnConfig: '[name="search-column-config"]',
		countsByGroupingContainer: '[data-js-counts-by-grouping="true"]',
		ulFilterList: 'ul.filter-list',
		dataShowAll: '[data-show-all="true"]',
		$activeList: $('ul.active-list')
	},
	URLS: {
		showAll(filterId) { return `/tools/extract-tool/filter-values/${filterId}`},
		dedupeCounts(selectValue) {return `/tools/extract-tool/dedupe-counts/${selectValue}`}
	},
	init() {
		const self = this;

		localStorage.setItem('filterList',JSON.stringify({}));
		self.getAllDatabaseRows(true);
		self.columnSelections();
		self.searchColumns();
		self.showAll();
		self.getCountsFromGrouping();
	},
	getAllDatabaseRows(pageload) {
		const sendObject = {
			filterValue: '',
			filtersObject: localStorage.getItem('filterList')
		};

		if (!pageload) {
			sendObject.grouping = $('[name="grouping"]').val();
		}

		loaders.addLoader('.selected-records');

		routes.post(
			'/tools/extract-tool/data-filter',
			sendObject,
			(data) => {
				const resultCount = parseInt(data.valuesCount);
				// Update value count on resultset
				$('.selected-records').find('strong').text(resultCount.toLocaleString());
				if (pageload) {
					$('.total-records').find('strong').text(resultCount.toLocaleString());
				}
				$('[data-js-counts-by-grouping="true"] select').change();
			}
		);
	},
	columnSelections() {
        const self = this;

		self.selectors.$siteContainer.on('click', self.selectors.columnSelectionTrigger, (e) => {
			const $trigger = $(e.currentTarget);
			const selectAll = $trigger.data('select-all');

			if (selectAll) {
				$(self.selectors.wizardLists).prop('checked', true);
			} else {
				$(self.selectors.wizardLists).prop('checked', false);
			}
		});
	},
	getDedupeCounts(sendObject) {
		const self = this;
		const selectedRecords = '.selected-records';

		loaders.addLoader(selectedRecords);

		routes.post(
			self.URLS.dedupeCounts($(self.selectors.countsByGroupingContainer + ' select').val()),
			sendObject === undefined ? '' : sendObject,
			function(data) {
				const recordCount = parseInt(data.count).toLocaleString();

				$(`${selectedRecords} strong`).text(recordCount);
				$('[data-toolbar-row-count]').text(recordCount);

				if (recordCount < 1) {
					$('[data-form-action="extract"]').attr('disabled','disabled');
				} else {
					$('[data-form-action="extract"]').removeAttr('disabled');
				}
			}
		);
	},
	getCountsFromGrouping() {
		const self = this;

		self.selectors.$siteContainer.on('change', `${self.selectors.countsByGroupingContainer} select`, (e) => {
			const $selected = $(e.currentTarget).val();

            let sendObject = {
				filterValue: '',
				grouping: $selected,
				filtersObject: localStorage.getItem('filterList')
			};


			if ($selected !== 'None' && $selected !== '' && $selected !== null) {
				self.getDedupeCounts(sendObject);
				$('[data-toolbar-grouping]').text($(e.currentTarget).find(':selected').text());
			}

			// On change, update the same selection within the configure extract wizard
			$('.extract-filter-options').find(`[data-wizard-grouping] [value="${$selected}"]`).prop('checked', true);
		});
	},
	searchColumns() {
		const self = this;

		// Catch keyup event in input searchbox
		$(self.selectors.searchColumnConfig).keyup((e) => {
			const regex = /^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$/;
			const $input = $(e.currentTarget);
			const text = $input.val();
			const filterItems = `${self.selectors.extractFilterWizard} .filter-selection-group span`;

			// If key pressed is alphabetical key and the key name is less than 2 characters OR the key is backspace
			if ((e.keyCode === 8 && text === '') || text === '') {
				self.selectors.$activeList.remove();
				$(self.selectors.extractFilterWizard).show();
			} else if (regex.test(e.key) || e.keyCode === 8){
				$(self.selectors.extractFilterWizard).hide();
				self.selectors.$activeList.remove();

				const $activeList = $('<ul class="active-list"></ul>');

				for (let i=0; i < $(filterItems).length; i++) {
					if ($($(filterItems)[i]).text().toLowerCase().indexOf(text) >= 0) {
						const $newFilter = $($(filterItems)[i]).parent().clone();
						$activeList.append(`<li><label>${$newFilter.html()}</label></li>`);
					}
				}

				$(self.selectors.extractFilterWizardContainer).append($activeList);
			}
		});

		self.selectors.$siteContainer.on('click', '.active-list input', (e) => {
			const $filter = $(e.currentTarget);

			$('.filter-selection-group').find(`[name="${$filter.attr('name')}"]`).prop('checked',true);

			if ($('.filter-selections').find('input[type="checkbox"]:checked').length > 0) {
				$(`[data-slide="2"] ${self.selectors.dataSlideForward}`).removeAttr('disabled');
			} else {
				$(`[data-slide="2"] ${self.selectors.dataSlideForward}`).attr('disabled','disabled');
			}
		});
	},
	showAll() {
		const self = this;

		self.selectors.$siteContainer.on('click', self.selectors.dataShowAll, (e) => {
			const $trigger = $(e.currentTarget);
			const $parentForm = $trigger.parents('.form-element');
			const parentColumn = $parentForm.find('[name="filterValue"]').data('column');
			const originalObject = JSON.parse(localStorage.getItem('filterList'));
			const object = {
				filterValue: '',
				filtersObject: '',
				filterName: $parentForm.find('[data-column]').data('column')
			};

			if ($parentForm.find(self.selectors.ulFilterList).is(':visible')) {
				// Rotate arrow on every click to match new action
				$trigger.find('i').css('transform', 'rotateX(0)');

				// Hide filter list
				$parentForm.find(self.selectors.ulFilterList).empty().hide();
				$parentForm.find(self.selectors.filterButtons).hide();
				$parentForm.removeClass('active-search');
			} else {
				// Add loader during AJAX
				loaders.addLoader($parentForm);

				// Remove current column from filter list to provide all other results that can be added to the same filter
				delete originalObject[parentColumn];
				object.filtersObject = JSON.stringify(originalObject);

				routes.post(
					self.URLS.showAll($parentForm.data('id')),
					object,
					(data) => {
						if (data.trim() !== '') {
							// Rotate arrow on every click to match new action
							$trigger.find('i').css('transform', 'rotateX(-180deg)');

							// Get rid of no results if that was the previous result
							$('.no-results').remove();

							if ($(data)[0].className !== 'no-results') {
								$parentForm.find(self.selectors.ulFilterList).show();
								$parentForm.find(self.selectors.filterButtons).show();
								$parentForm.addClass('active-search');
								$parentForm.find('.filter-values-selector').find('.filter-list').empty();
								$parentForm.find('.filter-values-selector').find('.filter-list').prepend(data);
							} else {
								$parentForm.find('.filter-values-selector').append(data);
							}

							$parentForm.find('.filter-list').attr('data-column',$trigger.data('column'));
						} else {
							$parentForm.find('.filter-values-selector').append('<span class="no-results">Sorry, there aren\'t any results.</span>');
						}
					}
				);
			}
			return false;
		});
	}
};

export { extractToolData };
