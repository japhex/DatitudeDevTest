import {routes} from './../routes/routes';
import {loaders} from './../ui/loaders';
import {extractToolData} from './../extract-tool/data';
import {extractToolUtils} from './../extract-tool/utils/utils';
import * as noUiSlider from "../../../vendor/nouislider/distribute/nouislider.min";

const extractToolFilters = {
	selectors: {
		$siteContainer: $('.site-container'),
		$filterSelections: $('.filter-selections'),
		$segmentQuerySelector: $('.segment-query-selector'),
		dataAutocomplete: '[data-autocomplete]',
		filterList: 'select.filter-list, ul.filter-list, div.filter-list',
		selectedFilters: '.filter-list.selected',
		unselectedFilters: '.filter-list.selection li',
		filterButtons: '.filter-values-selector .btn',
		extractFilterStats: '.sidebar-filters',
		filterGroup: '[data-js-filter-group]',
		dataDateDirectionFrom: '[data-date-direction="from"]',
		dataDateDirectionTo: '[data-date-direction="to"]',
		dataSelectColumn: '[data-select-column]',
		ulFilterList: 'ul.filter-list',
		mobileFilterTrigger: '[data-form-action="filters"]'
	},
	URLS: {
		filterValue(filterValueId) { return `/tools/extract-tool/filter-values/${filterValueId}`},
		dataFilter() {return `/tools/extract-tool/data-filter`}
	},
	init() {
		const self = this;

		localStorage.setItem('filterList',JSON.stringify({}));
		self.autocomplete();

		if ($('.extract-tool').length > 0) {
			extractToolUtils.searchFilterGroups();
			self.setFiltersHeight();
		}

		self.selectFilterValues();
		self.applyFilters();
		self.filterTypes();
		self.mobileFilters();
		self.rangeFilterType();
	},
	autocomplete() {
		const self = this;

		// Delay keyup function for half a second to stop the DOM with flooding
		$(self.selectors.dataAutocomplete).keyup((e) => {
			const $input = $(e.currentTarget);

			if (e.currentTarget.timer) {
				window.clearTimeout(e.currentTarget.timer);
			}
			e.currentTarget.timer = window.setTimeout(() => {
				const regex = /^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$/;
				const $parentForm = $input.parents('.form-element');
				const text = $input.val();
				const $columnName = $input.data('column');

				// If key pressed is alphabetical key and the key name is less than 2 characters OR the key is backspace
				if (e.keyCode === 8 && text === '') {
					if ($(self.selectors.selectedFilters).find('li').length < 1){
						$parentForm.find(self.selectors.ulFilterList).hide();
						$parentForm.find(self.selectors.filterButtons).hide();
						$parentForm.removeClass('active-search');
						$('.no-results').remove();
					}
				} else if (regex.test(e.key) || e.keyCode === 8){
					loaders.addLoader($parentForm);
					makeRequest($parentForm, $input, $columnName);
				}
				$('form.filter-search').submit(() => {
					return false;
				});
			}, 500);
		});

		// Make AJAX request to retrieve new filter values
		function makeRequest($parentForm, $input, $columnName){
			const object = {
				filterValue: $input.val(),
				filtersObject: JSON.parse(localStorage.getItem('filterList')),
				filterName: $parentForm.find('[data-column]').data('column')
			};

			delete object.filtersObject[$columnName];

			object.filtersObject = JSON.stringify(object.filtersObject);

			routes.post(
				self.URLS.filterValue($parentForm.data('id')),
				object,
				(data) => {
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

					self.reselectFilterValues($columnName);

					$parentForm.find('.filter-list').attr('data-column',$input.data('column'));
				}
			);
		}
	},
	selectFilterValues() {
		const self = this;

		// When user clicks an unselected filter.
		self.selectors.$siteContainer.on('click', self.selectors.unselectedFilters, (e) => {
			const $filter = $(e.currentTarget);
			const $parentForm = $filter.parents('.form-element');

			$parentForm.find(self.selectors.filterButtons).show();
			$filter.toggleClass('selected');
		});
	},
	applyFilters() {
		const self = this;

		self.selectors.$siteContainer.on('click', self.selectors.filterButtons, (e) => {
			const $button = $(e.currentTarget);
			const applyFilter = $button.data('filter-apply');
			const dropdownReset = $button.data('filter-reset-dropdown');
			const dateReset = $button.data('filter-reset-date');
			const $parentForm = $button.parents('.form-element');
			const $parentGroup = $button.parents('[data-js-filter-group]');
			const $input = $parentForm.find('[name="filterValue"]');
			const $dates = $parentForm.find('[data-date-column]');
			const $ranges = $parentForm.find('[data-range-column]');
			const filterColumn = $parentForm.find('[data-column]').data('column');

			// If apply button is clicked
			if (applyFilter) {
				// If the element being filtered is a dropdown
				if ($parentForm.hasClass('dropdown-container')) {
					$parentForm.addClass('active-search');
					$input.addClass('selected-select');
				} else if ($parentForm.hasClass('date-container')) {
					$parentForm.addClass('active-search');
					$dates.addClass('selected-date');
				} else if ($parentForm.hasClass('range-container')) {
					$parentForm.addClass('active-search');
					$ranges.addClass('selected-range');
				}

				// Loop through all current applied filters and build object out of columns and values to be filtered by
				self.buildFiltersObject(self.selectors.filterList,'li.selected',true);

				// Build send object out of active filter values and send request to return new count of results.
				self.applyFiltersRequest($input.val(),$parentGroup,filterColumn);
			} else if (dropdownReset) {
				//self.loadSelectOptions($parentGroup);
			} else if (dateReset) {
				$parentForm.find('input').val('');
				$parentForm.removeClass('active-search');
			} else {
				$input.val('');
				$parentForm.find('ul.filter-list').empty().hide();
				$parentForm.find(self.selectors.filterButtons).hide();
				$parentForm.removeClass('active-search');
			}
		});
	},
	buildActiveFilterList(filterName, filterValues) {
		const self = this;
		const filterGroup = $(`.form-element [data-column="${filterName}"]`).parents('li').data('js-filter-group');
		const filterOutput = $(`<div class="sidebar-active-filter" data-column="${filterName}"><span>${filterName.replace(/_/g,' ')}</span></div>`);
		const $dataColumn = $(`.sidebar-filters [data-column="${filterName}"]`);
		const $dateFilter = $('.date-container').find(`[data-column="${filterName}"]`);
		const $rangeFilter = $('.range-container').find(`[data-column="${filterName}"]`);

		// If the filter column already exists in the sidebar, don't add it again!
		if ($dataColumn.length > 0) {
			if ($dateFilter.length === 1 && filterValues.length === 2) {
				// Don't add again for dates, replace date in sidebar
				$dataColumn.find(`[data-filter-column="${filterName}"]`).remove();
				$dataColumn.append(`<span data-date-column="true" data-filter-group="${filterGroup}" data-filter-column="${filterName}" class="sidebar-active-filter-value" data-value="${filterValues[0]}-${filterValues[1]}">Between ${filterValues[0]} and ${filterValues[1]}</span>`);
			} else if ($rangeFilter.length === 1 && filterValues.length === 2) {
				// Don't add again for ranges, replace date in sidebar
				$dataColumn.find(`[data-filter-column="${filterName}"]`).remove();
				$dataColumn.append(`<span data-range-column="true" data-filter-group="${filterGroup}" data-filter-column="${filterName}" class="sidebar-active-filter-value" data-value="${filterValues[0]}-${filterValues[1]}">Between ${filterValues[0]} and ${filterValues[1]}</span>`);
			} else {

				filterValues.forEach((filterValue) => {
					filterValue = filterValue === null ? "null" : [filterValue].toString().trim();
					// If the filter is already in the list, replace it if values change
					$dataColumn.find(`[data-value="${filterValue}"]`).remove();
					$dataColumn.append(`<span data-filter-group="${filterGroup}" data-filter-column="${filterName}" class="sidebar-active-filter-value" data-value="${filterValue}">${filterValue}</span>`);
				});
			}
			$(self.selectors.extractFilterStats).show();
		} else {
			if ($dateFilter.length === 1 && filterValues.length === 2) {
				filterOutput.append(`<span data-date-column="true" data-filter-group="${filterGroup}" data-filter-column="${filterName}" class="sidebar-active-filter-value" data-value="${filterValues[0]}-${filterValues[1]}">Between ${filterValues[0]} and ${filterValues[1]}</span>`);
			} else if ($rangeFilter.length === 1 && filterValues.length === 2) {
				filterOutput.append(`<span data-range-column="true" data-filter-group="${filterGroup}" data-filter-column="${filterName}" class="sidebar-active-filter-value" data-value="${filterValues[0]}-${filterValues[1]}">Between ${filterValues[0]} and ${filterValues[1]}</span>`);
			} else {
				filterValues.forEach((filterValue) => {
                    filterValue = filterValue === null ? "null" : [filterValue].toString().trim();
					filterOutput.append(`<span data-filter-group="${filterGroup}" data-filter-column="${filterName}" class="sidebar-active-filter-value" data-value="${filterValue}">${filterValue}</span>`);
				});
			}

			// To protect against when the filter is opened or 'active-search' is applied but nothing is selected, don't want to add header to sidebar
			if (filterValues.length > 0) {
				$(self.selectors.extractFilterStats).show().append(filterOutput);
			}
		}
	},
	applyFiltersRequest(filterValue,selectParentGroup,columnName,callback) {
		// Build send object out of active filter values and send request to return new count of results.
		const self = this;
		const sendObject = {
			filterValue: filterValue,
			grouping: $('[name="grouping"]').val(),
			filtersObject: localStorage.getItem('filterList')
		};

		if (selectParentGroup !== undefined) {
			loaders.addExtractLoader($(selectParentGroup).find('.dropdown-container'));
		}

		loaders.addLoader('.selected-records');

		// Refresh dedupe counts if selected, otherwise fire data filter request
		if (self.selectors.$segmentQuerySelector.length === 0 && $('[name="grouping"]').val() !== 'no_grouping') {
			extractToolData.getDedupeCounts(sendObject);
		} else {
			routes.post(
				window.location.origin + self.URLS.dataFilter(),
				sendObject,
				function(data){
					// Update value count on resultset
					const resultCount = parseInt(data.valuesCount);

					$('.selected-records').find('strong').text(resultCount.toLocaleString());

					if (selectParentGroup !== undefined) {
						extractToolUtils.loadSelectOptions(selectParentGroup, true);
					}

					if (columnName !== undefined) {
						self.reselectFilterValues(columnName);
					}

					if (callback !== undefined) {
						callback();
					}
				}
			);
		}

		// Refresh dedupe counts
		if (self.selectors.$segmentQuerySelector.length === 0) {
			extractToolData.getDedupeCounts(sendObject);
		}
	},
	buildFiltersObject($filtersList, filters, mainFilters, selectSelector, removeDropdown, rebuildFilters) {
		const self = this;
		let filtersObject = (localStorage.getItem('filterList') === null || rebuildFilters) ? {} : JSON.parse(localStorage.getItem('filterList'));

		for (let i=0; i < $($filtersList).length; i++) {
			const filterList = [];
			const $appliedList = $($($filtersList)[i]);
			let $dataColumn = $appliedList.attr('data-column');

			$dataColumn = removeDropdown ? $(selectSelector).find('[data-column]').attr('data-column') : $dataColumn;

			if ((mainFilters && $appliedList.parents('.form-element').hasClass('active-search')) || !mainFilters) {
				// Build array of all active filter values for each filter
				for (let i=0; i < $appliedList.find(filters).length; i++) {
					const $appliedFilter = $($appliedList.find(filters)[i]);

					if ($appliedFilter.data('date-column') && !mainFilters) {
						// When we load template back in on, make sure to split date values back out
						filterList.push($appliedFilter.data('value').toString().substring(0,10));
						filterList.push($appliedFilter.data('value').toString().substring(11,21));
					} else if (($appliedFilter.data('filter-slider-input') || $appliedFilter.data('range-column')) && !mainFilters) {
						const splitValue = $appliedFilter.data('value').toString().split('-');
						// When we load template back in on, make sure to split date values back out
						filterList.push(splitValue[0]);
						filterList.push(splitValue[1]);
					} else {
                        filterList.push($appliedFilter.data('value').toString());
					}
				}

				// Continue building array out of active select boxes
				for (let i=0; i < $appliedList.parent().find('.selected-select').length; i++) {
					const dataValue = $($appliedList.parent().find('.selected-select')[i]).find('option:selected').data('value');

                    filterList.push(dataValue.toString());
				}

				// Continue building array out of active date pickers
				for (let i=0; i < $appliedList.find('.selected-date').length; i++) {
					filterList.push($($appliedList.find('.selected-date')[i]).val());
				}

				// Continue building array out of active range sliders
				for (let i=0; i < $appliedList.find('.selected-range').length; i++) {
					filterList.push($($appliedList.find('.selected-range')[i]).val());
				}

				if (removeDropdown) {
					delete filtersObject[$dataColumn];
				}

				// Set column with filter values into Local Storage object
				if (!removeDropdown) {
					filtersObject[$dataColumn] = filterList;
				}

				if (filterList.length < 1) {
					delete filtersObject[$dataColumn];
				}

				// Set filter list into Local Storage
				localStorage.setItem('filterList',JSON.stringify(filtersObject));

				// If its the main filters clicked on, re-build sidebar
				if (mainFilters) {
					self.buildActiveFilterList($dataColumn, filterList);
				}
			}
		}

		// When we've removed all filters and want to delete final object property
		if ($($filtersList).length === 0 && rebuildFilters) {
			filtersObject = {};
			localStorage.setItem('filterList',JSON.stringify(filtersObject));
		}
	},
	filterTypes() {
		const self = this;

		// Date pickers
		$(self.selectors.dataDateDirectionFrom).datepicker({
			nextText: '',
			prevText: '',
			dateFormat: 'dd/mm/yy'
		});
		$(self.selectors.dataDateDirectionTo).datepicker({
			nextText: '',
			prevText: '',
			dateFormat: 'dd/mm/yy'
		});

		// Dropdown selections
		$(self.selectors.dataSelectColumn).on('blur', (e) => {
			const $select = $(e.currentTarget);
			const $buttons = $select.parents('.form-element').find('.filter-buttons .btn');

			if ($select.val() !== 'Please select') {
				$buttons.show();
			} else {
				$buttons.hide();
			}
		});
	},
	reselectFilterValues(columnName) {
		const $sidebarColumn = $('.sidebar-filters').find(`[data-column="${columnName}"]`);
		const $filterColumn = $('.filter-values-selector').find(`[data-column="${columnName}"]`);
		const $sidebarColumnValues = $sidebarColumn.find('[data-filter-group]');
		const $filterColumnValues = $filterColumn.find('[data-value]');

		for (let i=0; i < $sidebarColumnValues.length; i++) {
			for (let j=0; j < $filterColumnValues.length; j++) {
				if ($($sidebarColumnValues[i]).data('value') === $($filterColumnValues[j]).data('value')) {
					$($filterColumnValues[j]).addClass('selected');
				}
			}
		}
	},
	mobileFilters() {
		const self = this;

		self.selectors.$siteContainer.on('click', self.selectors.mobileFilterTrigger, () => {
			$('.extract-filter-stats').toggle();
		});

		self.selectors.$siteContainer.on('click', '.extract-filter-stats > i', () => {
			$('.extract-filter-stats').toggle();
		});
	},
	setFiltersHeight() {
		const self = this;
		const $filtersContainer = $('.extract-filter-stats');
		const offsetTop = $filtersContainer.offset().top;
		const fixedHeight = $(window).height() - offsetTop;

		$filtersContainer.css({'height': fixedHeight + 'px'});

	},
	rangeFilterType() {
		const sliders = document.getElementsByClassName('filter-slider');

		// Setup sliders for all filters on page
		[].slice.call(sliders).forEach(function( slider, index ) {
			const minValue = $(slider).parents('.cost-filter-inputs').find('[name="filterValueFrom"]');
			const maxValue = $(slider).parents('.cost-filter-inputs').find('[name="filterValueTo"]');
			const minValueNumber = Math.round(minValue.val());
			const maxValueNumber = Math.round(maxValue.val());


			if (minValueNumber !== maxValueNumber) {
				noUiSlider.create(slider, {
					start: [0, 200000],
					connect: true,
					step: 25,
					range: {
						'min': minValueNumber,
						'max': maxValueNumber
					}
				});

				slider.noUiSlider.on('update', (values, handle) => {
					const value = values[handle];

					if (handle) {
						maxValue.val(`${Math.round(value)}`);
					} else {
						minValue.val(`${Math.round(value)}`);
					}
				});
			}
		});
	}
};

export  { extractToolFilters };
