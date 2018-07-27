// Include ui utils
import {utils} from './ui/utils';

// Include routes
import {routes} from './routes/routes';

// Include extract tool modules
import {extractToolData} from './extract-tool/data';
import {extractToolFilters} from './extract-tool/filters';

const extractTemplates = {
	selectors: {
		$siteContainer: $('.site-container'),
		extractFilterContainer: '.extract-filter',
		templatesContainer: '.template-container',
		newSearchTrigger: '.template-container .btn',
		saveTemplateTrigger: '[data-js-savetemplate]',
		updateTemplateForm: '[data-form-updatetemplate]',
		saveTemplateForm: '[data-form-savetemplate]',
		loadTemplateTrigger: '.pick-templates li',
		sidebarFilter: '.sidebar-active-filter',
		dataFormDownload: '[data-form-action="download"]',
		dataSlideForward: '[data-slide-forward]',
		dataNewSearch: '[data-new-search]',
		dataLoadTemplate: '[data-load-template]'
	},
	init() {
		const self = this;

		if ($('.extract-tool-configuration').length < 1 && $('.segment-query-selector').length < 1) {
			self.loadTemplate();
			self.chooseTemplate();
			self.saveTemplate();
		}
	},
	chooseTemplate() {
		const self = this;

		if ($(self.selectors.templatesContainer).length > 0) {
			if ($(self.selectors.loadTemplateTrigger).length > 0) {
				utils.showForm(self.selectors.templatesContainer);
			}

			if ($(self.selectors.dataNewSearch).data('new-search') !== 'undefined') {
				// If new search
				$(self.selectors.newSearchTrigger).click();
			} else if ($(self.selectors.dataLoadTemplate).data('load-template') !== 'undefined') {
				// If loaded with template in URL
				for (let i=0; i < $(self.selectors.loadTemplateTrigger).length; i++) {
					if ($($(self.selectors.loadTemplateTrigger)[i]).text() === $(self.selectors.dataLoadTemplate).data('load-template')) {
						$($(self.selectors.loadTemplateTrigger)[i]).click();
					}
				}
			}
		} else {
			extractToolData.getDedupeCounts();
		}
	},
	loadTemplate() {
		const self = this;

		self.selectors.$siteContainer.on('click', self.selectors.loadTemplateTrigger, (e) => {
			const $trigger = $(e.currentTarget);
			const sidebar = $trigger.data('template-sidebar');
			const columnArray = $trigger.data('template-columnarray') === null ? [] : $trigger.data('template-columnarray');
			const groupBy = $trigger.data('template-groupby');
			const countsByGrouping = $trigger.data('template-countsbygrouping');
			const templateName = $trigger.text();

			$('body').data('default-template', ($trigger.data('default') ? 'true' : 'false')).addClass('template-loaded');

			// Build sidebar list of selected filters
			for (const property in sidebar) {
				if (sidebar.hasOwnProperty(property)) {
					extractToolFilters.buildActiveFilterList(property, sidebar[property]);
				}
			}

			// Build selected list of columns to display in extract
			columnArray.forEach((column) => {
				$('.extract-filter-options').find(`[name="${column}"]`).prop('checked',true);
			});

			// Build filters object
			extractToolFilters.buildFiltersObject(self.selectors.sidebarFilter,'.sidebar-active-filter-value',false);

			// Apply filters request
			// After initial request, add counts by grouping request.
			if (countsByGrouping !== null){
				$('[name="grouping"]').val(countsByGrouping).change();
			} else {
				extractToolFilters.applyFiltersRequest('',undefined,undefined, () => {});
			}


			// Select saved group by value
			$('.extract-summary').find(`[value="${groupBy}"]`).prop('checked', true);

			utils.closeForm(self.selectors.templatesContainer);
			$(self.selectors.dataFormDownload).show();

			// Enable configure order button for step 2 of wizard.
			$(self.selectors.dataSlideForward).removeAttr('disabled');

			// Say that template has been loaded to DOM.
			$(self.selectors.extractFilterContainer).addClass('template-loaded').attr('data-template-name',$trigger.text()).attr('data-template-group',$trigger.data('template-group')).attr('data-id',$trigger.data('id'));

			// Update form with the template details
			$('[data-form-updatetemplate="true"]').find('.form-element').append(`<p>${$trigger.text()}</p>`);
			$('.extract-filter-stats').prepend(`<p class="loaded-template-name">${$trigger.text()}</p>`);
		});

		self.selectors.$siteContainer.on('click', self.selectors.newSearchTrigger, () => {
			utils.closeForm(self.selectors.templatesContainer);
			extractToolData.getDedupeCounts();
		});
	},
	saveTemplate() {
		const self = this;
		let templateObject;

		self.selectors.$siteContainer.on('click', self.selectors.saveTemplateTrigger, () => {
			const groupByValue = $('[name="group-by"]:checked').val();
			const countsByGroupingValue = $('[name="grouping"]').val();
			const $selectColumns = $('.chosen-columns').find('li');
			const sidebar = localStorage.getItem('filterList');

			templateObject = {
				templateGroup: '',
				sidebar: {},
				columnArray: [],
				groupBy: '',
				countsByGrouping: '',
				context: ''
			};

			// Store sidebar values
			templateObject.sidebar = sidebar;

			// Build array of columns to select from DB
			for (let i=0; i<$selectColumns.length; i++) {
				templateObject.columnArray.push($($selectColumns[i]).data('value'));
			}

			// Store column array selection values
			templateObject.columnArray = JSON.stringify(templateObject.columnArray);

			// Store group by clause
			templateObject.groupBy = groupByValue;

			// Store grouping counts
			templateObject.countsByGrouping = countsByGroupingValue;

			utils.closeForm('.extract-options');
			utils.showForm('.template-details');
		});

		self.selectors.$siteContainer.on('submit', self.selectors.updateTemplateForm, () => {
			routes.put(
				`/tools/extract-tool/template/update/${$(self.selectors.extractFilterContainer).data('id')}`,
				templateObject,
				() => {
					utils.closeForm('.template-details');
				}
			);
			return false;
		});

		self.selectors.$siteContainer.on('submit', self.selectors.saveTemplateForm, (e) => {
			const $form = $(e.currentTarget);

			templateObject.templateName = $form.find('[name="templateName"]').val();
			templateObject.templateGroup = $form.find('[name="templateGroup"]').val();

			routes.post(
				'/tools/extract-tool/save-template',
				templateObject,
				(data) => {
					utils.showForm('.extract-options');
					utils.closeForm('.template-details');

					routes.put(
						`/datitude-administration/extract-tool-templates/update/${data.data.id}`,
						templateObject,
						function(){
						}
					);
				}
			);

			return false;
		});

		$('.template-details').on('click', '[data-js-close]', () => {
			utils.closeForm('.template-details');
		});
	}
};

export { extractTemplates };
