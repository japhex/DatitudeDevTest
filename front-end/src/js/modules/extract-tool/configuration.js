// Include ui utils
import {utils} from './../ui/utils';
import {loaders} from './../ui/loaders';

// Include routes
import {routes} from './../routes/routes';

const extractToolConfiguration = {
	selectors: {
		$siteContainer: $('.site-container'),
		addFilterGroupTrigger: '[data-js-add-filter-group]',
		addFilterGroupForm: '[data-js-filter-group-form]',
		extractToolConfigForm: '[data-js="datalistedit"]'
	},
	init() {
		const self = this;

		if ($('.extract-tool-configuration').length > 0) {
			self.configuration();
			self.addFilterGroup();
		}
	},
	configuration() {
		const self = this;

		$('[data-js-extract-config]').submit((e) => {
			const $form = $(e.currentTarget);

			routes.post(
				$form.attr('action'),
				$form.serialize(),
				(data) => {
					self.selectors.$siteContainer.html(data);
				}
			);

			return false;
		});
	},
	addFilterGroup: function() {
        const self = this;

		// Show and setup forms
		self.selectors.$siteContainer.on('click', self.selectors.addFilterGroupTrigger, () => {
			utils.closeForm(self.selectors.extractToolConfigForm);
			utils.showForm(self.selectors.addFilterGroupForm);
		});


		// Close triggers
		self.selectors.$siteContainer.on('click', `${self.selectors.addFilterGroupForm} [data-js-close]`, () => {
			utils.closeForm(self.selectors.addFilterGroupForm);
			utils.showForm(self.selectors.extractToolConfigForm);
		});

		$(document).on('keyup', (e) => {
			// Clearing on keyup of the escape key
			if (e.keyCode === 27) {
				utils.closeForm(self.selectors.addFilterGroupForm);
			}
		});

		// Submit add filter group form
		self.selectors.$siteContainer.on('submit', `${self.selectors.addFilterGroupForm} form`, (e) => {
			loaders.addLoader(self.selectors.addFilterGroupForm);

			routes.dynamic(
				$(e.currentTarget).attr('action'),
				'POST',
				$(e.currentTarget).serialize(),
				(data) => {
                    const filterGroups = $(self.selectors.extractToolConfigForm).find('[name="filter_group"]');

					filterGroups.empty();

					data.results.forEach((result) => {
						filterGroups.append(`<option value="${result.id}">${result.group_name}'</option>`);
					});

					loaders.removeLoader();
					utils.closeForm(self.selectors.addFilterGroupForm);
					utils.showForm(self.selectors.extractToolConfigForm);
				}
			);

			return false;
		});
	}
};

export { extractToolConfiguration };
