// Include routes
import {routes} from './../routes/routes';
// Include ui utils
import {loaders} from './loaders';
// Include plugins/libraries
//import imagesLoaded from './../../../vendor/imagesloaded/imagesloaded.pkgd.min';

const utils = {
	selectors: {
		$siteContainer: $('.site-container'),
		$dataToggleTrigger: $('[data-js-trigger]'),
		$block: $('.block'),
		$body: $('body'),
		dataTooltip: '[data-tooltip]',
		postcodeLookupTrigger: '[data-js-postcode-lookup]',
		postcodeLookupValue: '[data-js-postcode-lookup-value]',
		addressSelect: '[data-js-postcode-lookup-select]',
		$fieldAddressee: '[name="addressee"]',
		countrySwitch: '[data-country-switch]',
		countryLookupTrigger: '[data-js-country-lookup]',
		countryLookupSelect: '[data-js-country-lookup-select]',
		countryLookup: '[data-js-country-lookup]',
		countryLoopupContainer: '.country-lookup-section',
		reasonLookupTrigger: '[data-js-reason-lookup]',
		reasonSelectedTrigger: '[data-js-reason-lookup-select]',
		filterCampaign: '[data-js-campaign="true"]',
		campaignResults: '[data-js-campign-rows="true"]',
		campaignFilter: '[data-js-filter-target="campaign-filter"]'
	},
	dataToggle() {
		const self = this;

		self.selectors.$dataToggleTrigger.click((e) => {
			const $trigger = $(e.currentTarget);
			const $dataToggleTarget = $(`[data-js-target="${$trigger.data('js-trigger')}"]`);
			const dataIconChange = $trigger.data('icon-change');
			const originalIcon = $trigger.data('original-icon');

			if (dataIconChange && !$trigger.hasClass('active')) {
				$trigger.html('<i class="material-icons">&#xE5CD;</i>');
			} else {
				$trigger.html(`<i class="material-icons">${originalIcon}</i>`);
			}

			$trigger.toggleClass('active');
			$dataToggleTarget.toggle();
			return false;
		});
	},
	showForm($form) {
		const self = this;
		const $block = $('<div class="block"></div>');
		const breakpoint = $('body').css('content').replace(/'/g, '').replace(/"/g, '');

		// Reset size if overlay extends window
		if (breakpoint !== 'mobile') {
			if ($($form).height() > $(window).height()){
				$($form).css({'height':($(window).height() - 50) + 'px','overflow-y':'auto'});
			} else {
				$($form).css({'top':'49.9%','transform':'translateX(-50.1%) translateY(-50.1%) translateZ(0)'});
			}
		}

		self.selectors.$siteContainer.append($block);
		$block.css({'height':$(document).height()});
		self.selectors.$block.fadeIn();
		self.selectors.$body.css({'overflow-y':'hidden'});
		$($form).fadeIn();
		$block.hide();
	},
	closeForm($form) {
		const self = this;

		//$('form').parsley().reset();
		$('.block').fadeOut('slow', function() {
			$(this).remove();
		});

		$($form).fadeOut();
		self.selectors.$body.css({'overflow-y':'auto'});
		self.selectors.$body.css({'overflow-x':'hidden'});

		$('.query-selector-forms .tab-content .segment-form').hide();
		$('.query-selector-forms .tab-content .segment-update-form').hide();
		return false;
	},
	randomBackground() {
		const self = this;
		const backgrounds = ['../images/login_bg_1.jpg','../images/login_bg_2.jpg','../images/login_bg_3.jpg','../images/login_bg_4.jpg','../images/login_bg_5.jpg','../images/login_bg_6.jpg','../images/login_bg_7.jpg','../images/login_bg_8.jpg','../images/login_bg_9.jpg','../images/login_bg_10.jpg','../images/login_bg_11.jpg','../images/login_bg_12.jpg'];
		const randomBackground = backgrounds[Math.floor(Math.random()*backgrounds.length)];
		const $body = self.selectors.$body;

		if (!$($body).hasClass('authenticated') || ($($body).hasClass('authenticated') && $($body).hasClass('context'))){
			$($body).css({'background-image':`url(${randomBackground})`});
			//$($body).imagesLoaded(function() {
			$($body).fadeIn();
			//});
		}
	},
	navScroll() {
		const self = this;
		const pageTitle = $('.page-header').find('h1').data('title');
		const $navbar = $('.navbar');
		const $brandName = $('.brand-name');
		const originalText = $brandName.html();

		const windowScroll = self.debounce(() => {
			scrollTopAmount();
		}, 250);

		window.addEventListener('scroll', windowScroll);

		function scrollTopAmount(){
			if ($(window).scrollTop() >= 68) {
				$navbar.addClass('scrolled');
				$brandName.text(pageTitle);
			} else {
				$navbar.removeClass('scrolled');
				$brandName.html(originalText);
			}
		}
	},
	tooltips() {
		const self = this;

		self.selectors.$siteContainer.on({
			mouseenter() {
				let $toggle = $(this);
				$toggle.parent().find($toggle.data('tooltip')).show();
			},
			mouseleave() {
				let $toggle = $(this);
				$toggle.parent().find($toggle.data('tooltip')).hide();
			}
		}, self.selectors.dataTooltip);
	},
	debounce(func, wait, immediate) {
		let timeout;

		return function() {
			const context = this, args = arguments;
			const later = function() {
				timeout = null;
				if (!immediate) func.apply(context, args);
			};

			const callNow = immediate && !timeout;
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
			if (callNow) func.apply(context, args);
		};
	},
	messaging() {
		const self = this;

		self.selectors.$siteContainer.on('click', '.active-message [data-js-close]', (e) => {
			const $message = $(e.currentTarget);
			$message.parent().fadeOut();
			return false;
		});
	},
	formatExportObject(dataObject, formSelector) {
		const tableObject = {
			cols: [],
			rows: []
		};

		for(const name in dataObject.results[0]) {
			tableObject.cols.push(name);
		}
		tableObject.rows = dataObject;

		const tableObjectRows = tableObject.rows.results;

		// Convert all property values into strings so Excel converter reads them correctly
		tableObjectRows.forEach((tableRow) => {
			for (const key in tableRow){
				if (tableRow.hasOwnProperty(key)) {
					if (tableRow[key] !== null && tableRow[key] !== ''){
						tableRow[key] = tableRow[key].toString();
					}
				}
			}
		});

		// Set newly formatted object into form
		$(formSelector).find('[name="sendObject"]').val(JSON.stringify(tableObject));

		// Submit form to AJAX route.
		$(formSelector).submit();

		loaders.removeLoader();
		$('.data-type').remove();
	},
	postcodeLookup() {
		const self = this;

		// Functionality to hide postcode lookup and remove validation if not needed.
		$(self.selectors.countrySwitch).on('change', (e) => {
			const currentCountry = $(e.currentTarget).val();
			const currentCountryName = $(e.currentTarget).find('option:selected').text();
			const $requiredText = $(self.selectors.postcodeLookupValue).parent().find('.required-text');

			if (currentCountry === 'GB') {
				$(self.selectors.postcodeLookupTrigger).show();
				$(self.selectors.postcodeLookupValue).attr('required','required');
				$requiredText.show();
			} else {
				$(self.selectors.postcodeLookupTrigger).hide();
				$(self.selectors.postcodeLookupValue).removeAttr('required');
				$requiredText.hide();
			}

			$('[name="country"]').val(currentCountryName);
			$('[name="country_code"]').val(currentCountry);
		});

		// Fire postcode lookup function
		$(self.selectors.postcodeLookupTrigger).on('click', () => {
			const postcodeLookupList = $('<select data-js-postcode-lookup-select></select>');

			routes.dynamic(
				'/datitude-utils/postcode-lookup',
				'POST',
				$(self.selectors.postcodeLookupValue).serialize(),
				(data) => {
					const addresses = data.data;

					$(postcodeLookupList).append('<option>Please select...</option>');

					addresses.forEach((address) => {
						const organisation = address.su_organisation_indicator.trim();
						const organisationName = address.organisation_name.trim();
						const poBox = address.po_box;
						const subBuildingName = address.sub_building_name;
						const postcode = address.postcode;
						const postTown = address.post_town;
						const dependantThroughfareAndDescriptor = address.dependent_throughfare_and_descriptor;
						const throughfareAndDescriptor = address.throughfare_and_descriptor;
						const buildingName = address.building_name;
						const buildingNumber = address.building_number;
						const departmentName = address.department_name;

						$(postcodeLookupList).append(`<option data-organisation="${organisation}" data-organisation_name="${organisationName}" data-po_box="${poBox}" data-sub_building_name="${subBuildingName}" data-postcode="${postcode}" data-post_town="${postTown}" data-dependent_throughfare_and_descriptor="${dependantThroughfareAndDescriptor}" data-throughfare_and_descriptor="${throughfareAndDescriptor}" data-building_name="${buildingName}" data-building_number="${buildingNumber}" data-department_name="${departmentName}" data-building_name="${buildingName}">${(organisationName !== '' ? self.toTitleCase(organisationName) + ', ' : '')}${(departmentName !== '' ? self.toTitleCase(departmentName) + ', ' : '')}${(buildingNumber !== '' ? self.toTitleCase(buildingNumber) + ' ' : '')}${(buildingName !== '' ? self.toTitleCase(buildingName) + ', ' : '')}${(dependantThroughfareAndDescriptor !== '' ? self.toTitleCase(dependantThroughfareAndDescriptor) + ', ' : '')}${(throughfareAndDescriptor !== '' ? self.toTitleCase(throughfareAndDescriptor) + ', ' : '')}${(postTown !== '' ? self.toTitleCase(postTown) + ', ' : '')}${(postcode !== '' ? postcode : '')}</option>`);
					});

					// Append below to view then write click function to fill in other fields!
					$('[data-js-postcode-lookup-select]').remove();
					$('.postcode-lookup-section > .half-width:last-child').append(postcodeLookupList);
					self.addressSelect();
				}
			);
		});
	},
	addressSelect() {
		const self = this;

		self.selectors.$siteContainer.on('change', self.selectors.addressSelect, (e) => {

			const $option = $(e.currentTarget).find('option:selected');
			const $poBox = $option.data('po_box');
			const $poBoxDisplay = $option.data('po_box') === undefined ? '' : `PO BOX ${self.toAutofill($option.attr('data-po_box'))}`;
			const $organisationName = $option.data('organisation_name') === undefined ? '' : self.toAutofill($option.attr('data-organisation_name'));
			const $departmentName = $option.data('department_name') === undefined ? '' : self.toAutofill($option.attr('data-department_name'));
			const $postTown = $option.data('post_town') === undefined ? '' : self.toAutofill($option.attr('data-post_town'));
			const $postcode = $option.data('postcode') === undefined ? '' : self.toAutofill($option.attr('data-postcode'));
			const $subBuildingName = $option.data('sub_building_name') === undefined ? '' : self.toAutofill($option.attr('data-sub_building_name'));
			const $buildingName = $option.data('building_name') === undefined ? '' : self.toAutofill($option.attr('data-building_name'));
			const $buildingNumber = $option.data('building_number') === undefined ? '' : self.toAutofill($option.attr('data-building_number'));
			const $dependantThroughfareAndDescriptor = $option.data('dependent_throughfare_and_descriptor') === undefined ? '' : self.toAutofill($option.attr('data-dependent_throughfare_and_descriptor'));
			const $throughfareAndDescriptor = $option.data('throughfare_and_descriptor') === undefined ? '' : self.toAutofill($option.attr('data-throughfare_and_descriptor'));

			// Fields taking values
			const $address1Value = $('[name="address_1"]');
			const $address2Value = $('[name="address_2"]');
			const $address4Value = $('[name="address_4"]');
			const $postcodeValue = $('[name="postcode"]');

			self.resetValues($(e.currentTarget).parents('form'));

			//Business address without PO Box
			if ($poBox === '' && $organisationName !== '') {
				$address1Value.val(`${$organisationName} ${$buildingName}`);
				$address2Value.val(`${$dependantThroughfareAndDescriptor} ${$throughfareAndDescriptor}`);
				$address4Value.val($postTown);
				$postcodeValue.val($postcode);
			//Business address with PO Box and organisation name
			} else if ($poBox !== '' && $organisationName !== '') {
				$address1Value.val(`${$departmentName} ${$organisationName}`);
				$address2Value.val($poBoxDisplay);
				$address4Value.val($postTown);
				$postcodeValue.val($postcode);
			//Business address with PO Box and without organisation name
			} else if ($poBox !== '' && $organisationName === '') {
				$address1Value.val($poBoxDisplay);
				$address4Value.val($postTown);
				$postcodeValue.val($postcode);
			//Flat or apartment
			} else if ($poBox === '' && $organisationName === '' && $subBuildingName !== '') {
				$address1Value.val(`${$subBuildingName} ${$buildingName}`);
				$address2Value.val(`${$buildingNumber} ${$dependantThroughfareAndDescriptor} ${$throughfareAndDescriptor}`);
				$address4Value.val($postTown);
				$postcodeValue.val($postcode);
			//Normal address with dependant_throughfare_and_descriptor
			} else if ($poBox === '' && $organisationName === '' && $subBuildingName === '' && $dependantThroughfareAndDescriptor !== '') {
				$address1Value.val(`${$buildingName} ${$buildingNumber} ${$dependantThroughfareAndDescriptor}`);
				$address2Value.val($throughfareAndDescriptor);
				$address4Value.val($postTown);
				$postcodeValue.val($postcode);
			//Normal address
			} else if ($poBox === '' && $organisationName === '' && $subBuildingName === '' && $dependantThroughfareAndDescriptor === '') {
				$address1Value.val(`${$buildingName} ${$buildingNumber} ${$throughfareAndDescriptor}`);
				$address4Value.val($postTown);
				$postcodeValue.val($postcode);
			}
		});
	},
	toTitleCase(str) {
		return str.replace(/\w\S*/g, (txt) => {return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
	},
	toAutofill(str) {
		return str.toString().toUpperCase().trim();
	},
	resetValues(form) {
		$(form).find('[data-lookup-field]').val('');
	},
	countryLookup() {
		const self = this;

			$.ajax({
				type: "POST",
				url: "/datitude-administration/iso-country.json",
				data: {idArray: "", dataOutput:"full"},
				dataType:'json',
				success(data) {
					let html = "<option>Select a Country</option>";
					$(self.selectors.countryLookupSelect).empty();

					data.results.forEach((iso_country) => {
						html += `<option id="${iso_country.id}" name="${iso_country.country_name}" iso-2="${iso_country.country_code}">${iso_country.country_name}</option>`;
					});

					$(self.selectors.countryLookupSelect).append(html);
				}
			});

	},
	reasonsLookup() {
		const self = this;

		self.selectors.$siteContainer.one('click', self.selectors.reasonSelectedTrigger, () => {
			$.ajax({
				type: "POST",
				url: "/administration/reason-codes.json",
				data: {idArray: "", dataOutput:"full"},
				dataType:'json',
				success(data){
					console.log(data);
					let html = "<option>Select a Reason</option>";
					$(self.selectors.reasonSelectedTrigger).empty();

					data.results.forEach((reasons) => {
						html += `<option name="${reasons.reason.toLowerCase().replace(' ', '_')}" value="${reasons.reason}">${reasons.reason}</option>`;
					});

					$(self.selectors.reasonSelectedTrigger).append(html);
				}
			});
		});
	},
	campaignLookup(){
		const self = this;

		self.selectors.$siteContainer.on('click', self.selectors.campaignFilter, () => {
			loaders.addLoader(self.selectors.campaignResults);

			$.ajax({
				type: "POST",
				url: "/campaign-management/campaigns.json",
				data: {idArray: "", dataOutput:"full"},
				dataType:'json',
				success(data) {
					$(self.selectors.filterCampaign).find('select').empty();
					data.results.forEach((record) =>{
						let html = `<option id="${record.id}" name="${record.campaign}">${record.campaign}</option>`;

						$(self.selectors.filterCampaign).find('select').append(html);
					});

					loaders.removeLoader();

					$(self.selectors.campaignResults).find('select').show();
				}
			});
		});
	}
};

export { utils };
