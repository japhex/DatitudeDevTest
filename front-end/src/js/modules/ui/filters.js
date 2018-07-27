// Import and expose jQuery
import 'jquery-ui';

// Include plugins/libraries
import * as moment from './../../../vendor/moment/min/moment.min';
import Url from './../../../vendor/domurl/url.min';
import * as noUiSlider from './../../../vendor/nouislider/distribute/nouislider.min';

// Include ui utils
import {utils} from './utils';
import {loaders} from './loaders';

// Include modules
import {datalistFunctions} from './datalistFunctions';


const filters = {
	selectors: {
		siteContainer: $('.site-container'),
		$dataToggleTrigger: $('[data-js-trigger]'),
		$filterBar: $('.filter-bar'),
		$dataFilterTrigger: '[data-js-filter-target]',
		$dataListBody: $('[data-js="datalist"]').find('tbody'),
		$dataFilters: $('[data-js-filter]'),
		searchForm: '[data-js-search]',
		advSearchForm: '[data-js-advsearch]',
		$advSearchForm: $('[data-js-advsearch="true"]'),
		advSearchTrigger: '[data-js-filter-target="advsearch-filter"]',
		$advSearchTrigger: $('[data-js-filter-target="advsearch-filter"]'),
		searchTerm: '[name="searchTerm"]',
		offsetQuery: '[name="offsetQuery"]',
		filterColumn: '[name="filterColumn"]',
		filters: '[name="filters"]',
		activeFilters: '.active-filter',
		sortingSelector: '.sorting a',
		campaignForm: '[data-js-campaign="true"]',
		advSearchGroups: '[data-js-advsearch-filter-group] h2',
		campaignSelect: '[data-js-filter="campaign-filter"]'
	},
	init() {
		const self = this;

		self.enableFilters();
		self.search();
		self.refreshSearch();
		self.sorting();
		self.slideFilters();
		self.dateFilters();
		self.campaignFilter();

		if ($('.rep_mailing_records').length > 0 || $('.search-customers-and-prospects').length > 0) {
			self.advsearch();
		}
	},
	enableFilters() {
		const self = this;

		self.selectors.siteContainer.on('click', '[data-js-filter-target]', (e) => {
			const $trigger = $(e.currentTarget);
			const target = $(`[data-js-filter="${$trigger.data('js-filter-target')}"]`);

			$('[data-js-filter]').hide();
			target.toggle();
			target.find('input:eq(0)').click();

			target.find('.oi-x').click(() => {
				target.fadeOut();
				return false;
			});

			// Clearing on keyup of the escape key
			$(document).keyup((e) => {
				if (e.keyCode === 27) {
					target.fadeOut();
				}
			});

			$('.date-filter-inputs').find('input').datepicker({
				nextText: '',
				prevText: '',
				dateFormat: 'dd/mm/yy'
			});

			return false;
		});
	},
	queryStringSearch() {
		const url = new Url;
		const self = this;

		if (url.query.filters !== '' && url.query.filters !== undefined) {
			$(self.selectors.searchTerm).val(url.query.filters);
			$(self.selectors.filters).val(url.query.filters);
			$(self.selectors.searchForm).submit();
		} else if (url.query.searchTerm !== '' && url.query.searchTerm !== undefined) {
			$(self.selectors.searchTerm).val(url.query.searchTerm);
			$(self.selectors.offsetQuery).val(url.query.offset);
			$(self.selectors.filterColumn).val(url.query.filterColumn);
			$(self.selectors.searchForm).submit();
		}
	},
	search() {
		const self = this;

		self.selectors.siteContainer.on('submit', self.selectors.searchForm, (e) => {
			const url = new Url;
			const $searchTerm = $(self.selectors.searchTerm);
			const searchPath = '/search';
			let postUrl = '';
			let requestType;

			if (url.query.searchTerm === undefined && url.query.filters === undefined) {
				// If there's no search querystring, set the URL on submit with the field values
				postUrl = url.toString() + searchPath;
				url.query.offset = $(self.selectors.offsetQuery).val();
				window.history.pushState('','',url);
			} else {
				// There's already a search querystring
				postUrl = url.toString().replace('?', `${searchPath}?`);
			}

			// Always set querystring to value of input
			url.query.searchTerm = $searchTerm.val();
			window.history.pushState('','',url);

			// If there is a blank search term value, choose GET request to retrieve original data
			if ($searchTerm.val() === '') {
				postUrl = url.toString();
				requestType = 'GET';
			} else {
				if ($('[name="searchType"]').val() !== 'pagination'){
					url.query.offset = 0;
					window.history.pushState('','',url);
				}
				requestType = 'POST';
			}

			// Make POST request for search term
			$.ajax({
				url: postUrl,
				type: requestType,
				data: $(e.currentTarget).serialize(),
				dataType: 'json',
				beforeSend() {
					loaders.addLoader($('.datalist-view'));
					$('.search-filter').hide();
					localStorage.setItem('searchQuery', url.query.filters);
				},
				complete(data) {
					const filtersArray = url.query.filters !== undefined ? url.query.filters.split(',') : [];

					loaders.removeLoader();
					$('#search-filters').children().remove();
					$('.page-footer').remove();
					self.selectors.siteContainer.append(data.responseText);

					for (let i=0;i<filtersArray.length;i++){
						const index = filtersArray[i].indexOf("|");

						datalistFunctions.storeFilter(filtersArray[i].substr(0,index).replace('_', ' '), filtersArray[i].substr(index + 1));
					}

					$('[name="filterColumn"]').val('');
					$('[name="filters"]').val('');
					url.query.filters = "";
					$(self.selectors.activeFilters).remove();
				}
			});

			$searchTerm.val('');

			return false;
		});

		// Run querystring search on first pageload.
		self.queryStringSearch();
	},
	advsearch() {
		const self = this;
		const url = new Url;
		const searchPath = '/search';

		self.selectors.siteContainer.on('submit', self.selectors.advSearchForm, (e) => {
			e.preventDefault();

			let sendObject = '';
			let filterItem = '';
			let filtersObject = '';
			let postUrl = '';
			let requestType = '';

			// If there is a blank search term value, choose GET request to retrieve original data
			if (url.query.filters === '') {
				postUrl = url.toString();
				url.query.offset = 0;
				window.history.pushState('','',url);

				requestType = 'GET';
			} else {
				const offset = $(self.selectors.offsetQuery).val();

				url.query.offset = offset;
				postUrl = url.toString().replace('?', `${searchPath}?`);

				if ($('[name="searchType"]').val() != 'pagination'){

					//set selected country to search country
					let countrySelected = $('[data-js-country-lookup-select]').find('option:selected').val();
					let countryCodeSelected = $('[data-js-country-lookup-select]').find('option:selected').attr('iso-2');
					$(self.selectors.advSearchForm).find('input[name="search_country"]').val(countrySelected);
					$(self.selectors.advSearchForm).find('input[name="search_country_code"]').val(countryCodeSelected);

					//Process Search Fields
					$.each($('[data-js-advsearch="true"]').find('input[name^="search_"][value!=""]').serializeArray(), function (i, field) {
						if(field.value !== "" && field.value !== null && field.value !== "undefined" && field.value !== "Select a Country"){
							filterItem += field.name.replace("search_", "") + "|" + field.value + ",";
						}
					});

					// Always set querystring to value of input
					filtersObject = filterItem.slice(0, -1);
					url.query.filters = filtersObject;
					window.history.pushState('','',url);

				} else {
					filtersObject = url.query.filters; // is previous value each time
				}

				utils.closeForm($(self.selectors.advSearchForm));

				url.query.filters = filtersObject;
				window.history.pushState('','',url);

				sendObject = {
					filters:filtersObject,
					offsetQuery: offset,
					searchAction:"advance",
					_csrf: $('[data-js-advsearch="true"]').find('input[name="_csrf"][value!=""]').val()
				};

				requestType = 'POST';
			}

			$.ajax({
				url: postUrl,
				type: requestType,
				data: sendObject,
				dataType: 'json',
				beforeSend() {
					loaders.addLoader($(self.selectors.siteContainer));
					$('.search-filter').hide();
				},
				complete(data) {
					loaders.removeLoader();
					$('#search-filters').children().remove();
					$('.page-footer').remove();
					self.selectors.siteContainer.append(data.responseText);

					$('[name="filters"]').val('');
					$(self.selectors.activeFilters).remove();

					//populate Countrys again after each search
					utils.countryLookup();
				}
			});

			$(self.selectors.advSearchForm).find('input[type="text"]').val('');

			return false;

		});

		$(self.selectors.advSearchGroups).on('click', $(self.selectors.advSearchGroups), (e) => {
			$(e.currentTarget).parent("li").find(".filter-selections").toggle();
		});

		// Run querystring search on first pageload.
		self.queryStringSearch();
	},
	refreshSearch() {
		const self = this;
		const $refreshTrigger = '[data-js-refreshsearch]';
		const routeUrl = new Url;

		self.selectors.siteContainer.on('click', $refreshTrigger, () => {
			routeUrl.clearQuery();
			window.history.pushState('','',routeUrl);

			$(self.selectors.offsetQuery).val(0);
			$(self.selectors.searchTerm).val('');
			$(self.selectors.filters).val('none');
			$(self.selectors.searchForm).submit();

			return false;
		});
	},
	slideFilters() {
		const self = this;
		const minCost = document.getElementById('costMin');
		const maxCost = document.getElementById('costMax');
		const costSlider = document.getElementById('cost-slider');
		const $tableRow = self.selectors.$dataListBody.find('tr');

		if (minCost !== null){
			// Append the option elements
			for ( let i = 0; i <= 100; i++ ){
				const option = document.createElement("option");

				option.text = i;
				option.value = i;
				minCost.appendChild(option);
			}

			noUiSlider.create(costSlider, {
				start: [ 0, 200000 ],
				connect: true,
				range: {
					'min': 0,
					'max': 200000
				}
			});

			costSlider.noUiSlider.on('update', (values, handle) => {
				const value = values[handle];

				if ( handle ) {
					maxCost.value = `£${Math.round(value)}`;
				} else {
					minCost.value = `£${Math.round(value)}`;
				}
			});

			minCost.addEventListener('change', function(){
				costSlider.noUiSlider.set([this.value, null]);
			});

			maxCost.addEventListener('change', function(){
				costSlider.noUiSlider.set([null, this.value]);
			});
		}

		self.selectors.siteContainer.on('click', '.cost-filter-actions .btn-primary', () => {
			let resultCount = 0;

			$tableRow.css({'display':'none'});

			for (let i=0; i < $tableRow.length;i++) {
				const minCost = parseFloat($('#costMin').val().replace('£',''));
				const maxCost = parseFloat($('#costMax').val().replace('£',''));
				const rowCost = parseFloat($($tableRow[i]).find('[data-js-field="mailing_cost"]').text().replace('£','').replace(',','').replace('.00',''));

				if ((rowCost < maxCost) && (rowCost > minCost)) {
					$('.page-footer .pages').hide();
					$($tableRow[i]).show();
					resultCount++;
				}
			}

			$('.result-count').remove();
			$('.cost-filter-actions').append(`<span class="result-count">${resultCount} results</span>`);

			if (resultCount > 0) {
			} else {
				$tableRow.show();
				$('.page-footer .pages').show();
			}

			return false;
		});

		self.selectors.siteContainer.on('click', '.cost-filter-actions .btn-secondary', (e) => {
			$tableRow.show();
			$(e.currentTarget).parents('.cost-filter').find('.oi').click();
			$('.page-footer .pages').show();
			$('#costMax').val('200000');
			$('#costMin').val('0');
			$('.result-count').remove();

			return false;
		});
	},
	dateFilters() {
		const self = this;
		const $dateFrom = $('#date-from');
		const $dateTo = $('#date-to');
		const $tableRow = self.selectors.$dataListBody.find('tr');
		const $filterDatesTrigger = '[data-js-filter-dates]';
		const $clearDateTrigger = $('[data-js-filter-dates-clear]');

		self.selectors.siteContainer.on('click', $filterDatesTrigger, () => {
			let resultCount = 0;

			$('.page-footer .pages').hide();

			$tableRow.hide();

			if ($dateFrom.val() !== '' && $dateTo.val() !== '') {
				for (let i=0; i < $tableRow.length;i++) {
					const campaignStart = $($tableRow[i]).find('.campaign-from').data('date');
					const campaignTo = $($tableRow[i]).find('.campaign-to').data('date');

					if ((moment($dateFrom.val()).isBefore(campaignStart)) && (moment($dateTo.val()).isAfter(campaignTo))) {
						$($tableRow[i]).show();
						resultCount++;
					}
				}
			} else if ($dateFrom.val() !== '') {
				for (let i=0; i < $tableRow.length;i++) {
					let campaignStart = $($tableRow[i]).find('.campaign-from').data('date');

					if (moment($dateFrom.val()).isBefore(campaignStart)) {
						$($tableRow[i]).show();
						resultCount++;
					}
				}
			} else if ($dateTo.val() !== '') {
				for (let i=0; i < $tableRow.length;i++) {
					let campaignTo = $($tableRow[i]).find('.campaign-to').data('date');

					if (moment($dateTo.val()).isAfter(campaignTo)) {
						$($tableRow[i]).show();
						resultCount++;
					}
				}
			}

			$('.result-count').remove();
			$('.date-filter-actions').append(`<span class="result-count">${resultCount} results</span>`);

			if (resultCount > 0) {
			} else {
				$tableRow.show();
				$('.page-footer .pages').show();
			}
			return false;
		});

		$clearDateTrigger.click((e) => {
			$dateFrom.val('');
			$dateTo.val('');
			$('.result-count').remove();
			$tableRow.show();
			$(e.currentTarget).parents('.date-filter').find('.oi').click();
			$('.page-footer .pages').show();
			return false;
		});
	},
	sorting() {
		const self = this;
		const $table = $('[data-js="datalistview"]').find('tbody');
		let rows;
		let sortedRows;

		self.selectors.siteContainer.on('click', self.selectors.sortingSelector, (e) => {
			const $sortTrigger = $(e.currentTarget);
			const $parentHeader = $sortTrigger.parents('th');
			const $parentHeaderText = $parentHeader.children('span:first-child');
			const sortOrder = $sortTrigger.data('js-sort') === 'asc' ? true : false;
			const index = $parentHeader.index();
			const sortIcon = $sortTrigger.data('js-sort') == 'asc' ? '&#xE313;' : '&#xE316;';

			// sort rows
			if (!$sortTrigger.hasClass('active')) {
				rows = $table.find('tr');
				sortedRows = rows.sort(self.sortRows(index,sortOrder));
			}

			// call icons function to get sort icons into header
			self.sortIcons($sortTrigger,$parentHeader,$parentHeaderText,sortIcon);

			// replace the old rows with the new rows
			$table.remove('tr');
			$table.append(sortedRows);
		});
	},
	sortRows(index,sortOrder) {
		return function(a,b) {
			//sort the table row based on the text of the first div
			let firstValue = $(a).find(`td:eq(${index})`).text();
			let nextValue = $(b).find(`td:eq(${index})`).text();

			// Convert values to numbers so multiple integer numbers sort correctly.
			firstValue = isNaN(firstValue) ? firstValue.trim() : parseInt(firstValue);
			nextValue = isNaN(nextValue) ? nextValue.trim() : parseInt(nextValue);

			// Compare values to sort them
			if (firstValue > nextValue) {
				return (sortOrder) ? 1 : -1;
			}

			// Compare values to sort them
			if (firstValue < nextValue) {
				return (sortOrder) ? -1 : 1;
			}

			return -1;
		};
	},
	sortIcons($sortTrigger,$parentHeader,$parentHeaderText,sortIcon) {
		const self = this;

		if ($sortTrigger.hasClass('active')) {
			// Current active sort
			return;
		} else {
			// Get rid of all other icons in table
			$parentHeader.siblings().children('span:first-child').find('i').remove();

			// Get rid of current icon, add new one
			$parentHeaderText.find('i').remove();
			$parentHeaderText.append(`<i class="material-icons">${sortIcon}</i>`);

			// Remove active class from all other elements and add it to current one
			$(self.selectors.sortingSelector).removeClass('active');
			$sortTrigger.addClass('active');
		}
	},
	campaignFilter() {
		const self = this;

		self.selectors.siteContainer.on('submit', self.selectors.campaignForm,(e) => {
			e.preventDefault();

			console.log("Campaing Filter Clickeed");

			const url = new Url;
			const $searchTerm = $('select[name="searchTerm"]').find(":selected");
			const searchPath = '/search';
			let requestType = '';
			let postUrl = '';

			if (url.query.searchTerm === undefined && url.query.filters === undefined) {
				// If there's no search querystring, set the URL on submit with the field values
				postUrl = url.toString() + searchPath;
				url.query.offset = $(self.selectors.offsetQuery).val();
				window.history.pushState('','',url);
			} else {
				// There's already a search querystring
				postUrl = url.toString().replace('?', `${searchPath}?`);
			}

			// Always set querystring to value of input
			url.query.searchTerm = $('select[name="searchTerm"] option:selected').val();
			url.query.filterColumn = "campaign";
			url.query.filters = "campaign|" + $('select[name="searchTerm"] option:selected').val();
			url.query.searchAction = "advance";
			window.history.pushState('','',url);

			const offset = $(self.selectors.offsetQuery).val();
			const filterObject = "campaign|" + $('select[name="searchTerm"] option:selected').val();

			const sendObject = {
				filters:filterObject,
				offsetQuery: offset,
				searchAction:"advance",
				_csrf: $('[data-js-campaign="true"]').find('input[name="_csrf"][value!=""]').val()
			};

			// If there is a blank search term value, choose GET request to retrieve original data
			if ($searchTerm.val() === '') {
				postUrl = url.toString();
				requestType = 'GET';
			} else {
				if ($('[name="searchType"]').val() != 'pagination') {
					url.query.offset = 0;
					window.history.pushState('','',url);
				}
				requestType = 'POST';
			}

			// Make POST request for search term
			$.ajax({
				url: postUrl,
				type: requestType,
				data: sendObject,
				dataType: 'json',
				cache: false,
				beforeSend() {
					loaders.addLoader($('.datalist-view'));
					$('.search-filter').hide();
				},
				complete(data) {
					const filtersArray = url.query.filters !== undefined ? url.query.filters.split(',') : [];

					loaders.removeLoader();
					$('#search-filters').children().remove();
					$('.page-footer').remove();
					self.selectors.siteContainer.empty().append(data.responseText);

					for (let i=0; i < filtersArray.length; i++){
						const index = filtersArray[i].indexOf("|");

						datalistFunctions.storeFilter(filtersArray[i].substr(0,index).replace('_', ' '), filtersArray[i].substr(index + 1));
					}

					$('[name="filterColumn"]').val('');
					$('[name="filters"]').val('');
					url.query.filters = "";
					$(self.selectors.activeFilters).remove();
				}
			});

			$searchTerm.val('');

			return false;
		});

		return false;
	}
};
export { filters };
