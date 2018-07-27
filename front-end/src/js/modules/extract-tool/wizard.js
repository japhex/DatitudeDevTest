var extractToolWizard = {
	selectors: {
		$siteContainer: $('.site-container'),
		filterList: 'select.filter-list, ul.filter-list, div.filter-list',
		dataSlideForward: '[data-slide-forward]',
		dataSlideBack: '[data-slide-back]',
		extractFilterWizard: '.extract-filter-wizard'
	},
	init() {
        const self = this;

		self.extractToolWizard();
	},
	extractToolWizard() {
        const self = this;
        const $columns = $('.chosen-columns');


		// Shift wizard forward a step.
		self.selectors.$siteContainer.on('click', self.selectors.dataSlideForward, () => {
            const $activeSlide = $('.slide-active');

			$activeSlide.next().show().addClass('slide-active');
			$activeSlide.removeClass('slide-active').hide();
			commonSteps($activeSlide.next());
		});

		// Shift wizard back a step
		self.selectors.$siteContainer.on('click', self.selectors.dataSlideBack, () => {
			const $activeSlide = $('.slide-active');

			$activeSlide.prev().show().addClass('slide-active');
			$activeSlide.removeClass('slide-active').hide();
			commonSteps($activeSlide.prev());
		});

		// Steps to always take when moving between wizard slides
		function commonSteps($activeSlide) {
            const $input = $('.filter-selections').find('input[type="checkbox"]');
            const extractGroupingType = $('[data-grouping-type]:checked').data('grouping-type');
            const $hideColumns = $(`[data-${extractGroupingType}-grouping="false"]`);
            const $showColumns = $(`[data-${extractGroupingType}-grouping="true"]`);
            let checkedArray = [];

			// Reset columns
			$columns.empty();

			// Hide/Show columns based on grouping type
			$hideColumns.prop('checked',false);

			// Not sure why this was here...
			$hideColumns.parents('.form-element').hide();
			$showColumns.parents('.form-element').show();

			// Set column counts after hiding columns that aren't available for grouping type and hide their containers
			//extractToolData.columnCounts();

			if (parseInt($($activeSlide).data('slide')) === 2) {
				$('.extract-options-action-buttons').show();
			} else {
				$('.extract-options-action-buttons').hide();
			}

			// Build columns to order in step 3
			for (let i=0; i<$input.length; i++) {
				if ($($input[i]).prop('checked')) {
					checkedArray.push({column:$($input[i]).val(),aggregation:$($input[i]).data('aggregation')});
				}
			}

			checkedArray.forEach((arrayItem) => {
                $columns.append(`<li data-value="${arrayItem.column}" data-aggregation="${arrayItem.aggregation}">${arrayItem.column} <i class="material-icons">&#xE8FE;</i></li>`);
            });

			$columns.sortable({
				revert: true
			});

			$('ul,li').disableSelection();
		}
	}
};

export { extractToolWizard };
