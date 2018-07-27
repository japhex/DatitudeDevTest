// Include routes
import {routes} from './../../routes/routes';

// Include loaders
import {loaders} from './../../ui/loaders';

// Include ui utils
import {utils} from './../../ui/utils';

import Choices from 'choices.js';

const SELECTORS = {
	$filterGroup: $('.extract-filters-container').find('.extract-filter-options [data-js-filter-group]'),
	$filterContainer: $('.extract-filters-container').find('.filter-selections .form-element')
};

const extractToolUtils = {
	loadSelectOptions(filterParents, triggerSelect) {
		const $selects = $(filterParents).find('[data-select-column]');

		// Add loaders whilst requests are loading
		loaders.addExtractLoader($(filterParents).find('.dropdown-container'));

		// Load in select menus on click of section
		$selects.each((select) => {
			const $currentSelect = $(select);
			const $parentForm = $currentSelect.parents('[data-id]');

			(($currentSelect, $parentForm) => {
				const selectedFilterValue = $currentSelect.val(),
					object = {
						filterValue: '',
						filtersObject: localStorage.getItem('filterList'),
						filterName: $currentSelect.data('column'),
						filterType: 'dropdown'
					};

				routes.post(
					`/tools/extract-tool/filter-values/${$($parentForm).data('id')}`,
					object,
					(data) => {
						$currentSelect.empty().append('<option data-value="All" value="all">All</option>').append(data);
						$currentSelect.parents('li').find('.btn').show();
						$currentSelect.parents('[data-id]').find('.extract-mini-loader-container').remove();
						// Select active value again
						if (triggerSelect !== undefined) {
							$currentSelect.val(selectedFilterValue);
						}
					}
				);
			})($currentSelect, $parentForm);
		});
	},
	fixedToolbar() {
		const $pageHeader = $('.extract-tool .page-header, .segment-query-selector .page-header');
		const $pageStats = $('.extract-filter-stats');
		const breakpoint = $('body').css('content').replace(/'/g, '').replace(/"/g, '');

		const windowScroll = utils.debounce(() => {
			scrollTopAmount();
		}, 0);


			window.addEventListener('scroll', windowScroll);

		function scrollTopAmount(){
			const scrollAmount = breakpoint === 'desktop' ? 93 : 500;

			if ($(window).scrollTop() >= scrollAmount) {
				$pageHeader.addClass('fixed-toolbar');
				$pageStats.addClass('fixed-sidebar');
				$('.main-site-container').css({'padding-top': '169px'});
			} else {
				$pageHeader.removeClass('fixed-toolbar');
				$pageStats.removeClass('fixed-sidebar');
				if (breakpoint === 'desktop') {
					$('.main-site-container').css({'padding-top': '49px'});
				} else {
					$('.main-site-container').css({'padding-top': '0'});
				}
			}
		}
	},
	searchFilterGroups() {
		const groupNames = $('.filter-selections').find('.form-element .filter-title');
		const $list = $('<select class="extract-autocomplete"><option placeholder data-filter-name="display-all">Display all groups</option></select>');

		for (let i = 0; i < groupNames.length; i++) {
			const group = $(groupNames[i]);
			const groupName = $(group).text().toLowerCase();

			$list.append(`<option data-filter-name="${groupName.replace(/ /g, '_').toLowerCase()}">${groupName}</option>`);
		}

		$list.insertAfter('[name="searchGroups"]');

		const choicesSelect = new Choices('.extract-autocomplete', {
			searchResultLimit: 20,
		});

		choicesSelect.passedElement.addEventListener('choice', function(event) {
			const filterName = event.detail.choice.label.replace(/ /g, '_');
			const $filterGroup = $(`[data-filter-title="${filterName}"]`).parents('[data-js-filter-group]');

			if (filterName === 'Display_all_groups') {
				SELECTORS.$filterGroup.show();
				SELECTORS.$filterContainer.show();
				$('.form-element').removeClass('search-shown');
			} else {
				SELECTORS.$filterGroup.hide();
				SELECTORS.$filterContainer.hide();

				$filterGroup.show();
				$(`[data-filter-title="${filterName}"]`).parents('.form-element').addClass('search-shown').show();
				$filterGroup.find('h2').click();
				$filterGroup.find('h2').parent().find('.filter-selections').addClass('active').show();
				$filterGroup.find('h2').parents('[data-js-filter-group]').addClass('active').show();
			}
		}, false);
	}
};

export { extractToolUtils };
