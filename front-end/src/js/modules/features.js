const features = {
	selectors: {
		$siteContainer: $('.site-container'),
		$featuresForm: '[data-custom-trigger="features"]',
		featuresFilters: '[data-js-base="filters"]',
		featuresRequiredFields: '[data-js-base="required-fields"]'
	},
	init($form) {
		const self = this;

		self.formSubmission($form);
	},
	formSubmission($form) {
		const self = this;

		self.buildFilters($form);
		self.buildRequiredFields($form);
	},
	buildFilters($form) {
		const self = this;
		// Format filters into object
		let filters = [];

		$(self.selectors.featuresFilters).find('.form-element').each(function(){
			let $currentItem = $(this);
			let filterItem = {};

			filterItem.name = $currentItem.find('label').text().trim();
			filterItem.active = $currentItem.find('input').prop('checked').toString();

			filters.push(filterItem);
		});

		$form.find('[name="filters"]').remove();
		$form.append(`<input type="hidden" value=${JSON.stringify(filters)} name="filters" id="filters" />`);
	},
	buildRequiredFields($form) {
		const self = this;

		let requiredFields = [];

		$(self.selectors.featuresRequiredFields).find('[data-js-accept] input').each(function(){
			let $currentItem = $(this);

			if ($currentItem.val() !== '') {
				requiredFields.push($currentItem.val());
			}
		});

		$form.find('[name="required_fields"]').remove();
		$form.append(`<input type="hidden" value=${JSON.stringify(requiredFields)} name="required_fields" id="required_fields" />`);
	}
};

export { features };