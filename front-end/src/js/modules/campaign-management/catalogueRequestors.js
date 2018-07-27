const catalogueRequestors = {
	selectors: {
		$siteContainer: $('.site-container'),
		countryLookupTrigger: '[data-js-country-lookup]',
		countrySelectedTrigger: '[data-js-country-lookup-select]',
		postcodeLookup: '.postcode-lookup-section',
		addressFields: '.address_fields',
		additionalAddressFields: '.additional_address_fields',
		$createForm: $('.create-mode'),
		createAction: '[data-js-addrecord="true"]',
		editAction: '[data-form-action="edit"]',
		countryInput: 'input[name="country"]',
		postcodeReturnedSearchValue: 'input[name="postcode_search"]',
		countryReturnedValue: 'input[name="selected_country"]',
		countryReturnedCodeValue: 'input[name="selected_country_code"]'
	},
	init() {
		const self = this;
		self.catalogueRequestorsSearch();
	},
	catalogueRequestorsSearch() {
		const self = this;

		//config add form(display)
		$(self.selectors.createAction).on('click', self.selectors.$createForm, () => {
			//self.defaultFormDisplay();
			$(self.selectors.additionalAddressFields).hide();
			$(self.selectors.addressFields).hide();
			$(self.selectors.countryLookupTrigger).show();
		});

		//config edit form(display)
		$(self.selectors.editAction).on('click', self.selectors.$createForm, () => {
			//self.defaultFormDisplay();
			$(self.selectors.additionalAddressFields).show();
			$(self.selectors.addressFields).show();
			$(self.selectors.countryLookupTrigger).hide();
		});

		// set search values from selected set in utils.countrySelect();
		$(self.selectors.countryLookupTrigger).on('change', self.selectors.countrySelectedTrigger, () => {
			const selectedCountry = $(self.selectors.countryLookupTrigger).find("option:selected").val();
			const selectedCountryCode = $(self.selectors.countryLookupTrigger).find("option:selected").attr('iso-2');

			$(self.selectors.countryLookupTrigger).parent().closest('div').find(self.selectors.countryReturnedValue).val(selectedCountry);
			$(self.selectors.countryLookupTrigger).parent().closest('div').find(self.selectors.countryReturnedCodeValue).val(selectedCountryCode);

			if (selectedCountryCode==="GB") {
				// If UK display postcode lookup
				$(self.selectors.countryInput).val(selectedCountry);
				$(self.selectors.additionalAddressFields).removeAttr("required");
				$(self.selectors.additionalAddressFields).hide();
				$(self.selectors.addressFields).find('input[name^="address_"]').prop('readonly', true);
				$(self.selectors.addressFields).show();
				$(self.selectors.postcodeLookup).show();
			} else {
				// display standard address fields
				$(self.selectors.countryInput).show();
				$(self.selectors.countryInput).val(selectedCountry);
				$(self.selectors.postcodeReturnedSearchValue).removeAttr("required");
				$(self.selectors.postcodeLookup).removeAttr("required");
				$(self.selectors.postcodeLookup).hide();
				$(self.selectors.addressFields).find('input[name^="address_"]').removeAttr("readonly");
				$(self.selectors.addressFields).show();
				$(self.selectors.additionalAddressFields).removeAttr("readonly");
				$(self.selectors.additionalAddressFields).show();

			}
		});
	},
	defaultFormDisplay() {
		const self = this;
		$(self.selectors.postcodeLookup).hide();
		$(self.selectors.addressFields).hide();
		$(self.selectors.additionalAddressFields).hide();
	}
};

export { catalogueRequestors };
