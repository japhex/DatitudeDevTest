// Include routes
import {routes} from './routes/routes';

// Include ui utils
import {utils} from './ui/utils';
import {loaders} from './ui/loaders';

// Include modules
import {datalistFunctions} from './ui/datalistFunctions';

// Include plugins/libraries
import Url from './../../vendor/domurl/url.min';

// Include templates
import {templates} from './../templates/templates';

// Include extract tool modules
import {extractToolTemplatesGroups} from './extract-tool/templates-groups';
import {features} from "./features";
import moment from "../../vendor/moment/min/moment.min";


const datalist = {
	selectors: {
		$siteContainer: $('.site-container'),
		$dataList: $('[data-js="datalist"]'),
		$dataListView: $('.datalist-view'),
		$dataListEdit: $('[data-js="datalistedit"]'),
		$dataListBody: $('[data-js="datalist"]').find('tbody'),
		$editForm: $('[data-js="datalistedit"]').find('form'),
		$uploadForm: $('[data-js="datalistupload"]'),
		$dataTiedTo: $('[data-js-tiedto]'),
		dataListEdit: '[data-js="datalistedit"]',
		$adminParent: $('[data-admin="true"]'),
		$userParent: $('[data-admin="false"]'),
		dataTypePopup: '.data-type',
		assistedDataListEdit: '[data-js="datalistassistededit"]',
		$storeLocations: $('[data-target="store-locations"]'),
		$storeDetailForm: $('[data-store-attribution]'),
		addInputTrigger: '[data-js-add-input]',
		$datesContainer: $('.date-filter'),
		$timeBetween: $('.time-between')
	},
	init() {
		const self = this;

		self.export();
		self.upload();
		self.edit();
		self.view();
		self.update();
		self.delete();
		self.tiedto();
		self.addInput();

		datalistFunctions.init();

		// When the user hits escape key, hide all forms.
		$(document).keyup(function(e) {
			if (e.keyCode === 27) {
				self.closeForms();
			}
		});
	},
	export() {
		const self = this;

		// Firstly get JSON route and build data object from DB schema/data properly and dynamically.
		self.selectors.$siteContainer.on('click', '[data-js-exportfile]', () => {
			const rows = self.selectors.$dataListView.find('tbody tr');
			const idArray = [];
			const $dataTypeChooser = $(templates.nonModels.dataTypeChooser());

			self.closeForms();

			for (let i=0; i < rows.length; i++) {
				idArray.push($(rows[i]).data('id'));
			}

			$('[data-js-exportform]').find('[name="idArray"]').val(idArray);

            $('.data-type').remove();
            self.selectors.$siteContainer.append($dataTypeChooser);
            utils.showForm($dataTypeChooser);

			return false;
		});

		// On submit of the data type chooser
		self.selectors.$siteContainer.on('click', `${self.selectors.dataTypePopup} .btn`, (e) => {
			$.ajax({
				url: `/files/export/request`,
				type: 'POST',
				data: {modelToExport: $('[name="modelName"]').val(), modelQuery: localStorage.getItem('searchQuery')},
				dataType: 'json',
				success() {
					// Forward to export routing
					self.closeForms();
				}
			});

			return false;
		});

		// Close data type chooser
		self.selectors.$siteContainer.on('click', `${self.selectors.dataTypePopup} [data-js-close-sub]`, () => {
			self.closeForms();
		});
	},
	upload() {
		const self = this;
		const $uploadForm = self.selectors.$uploadForm;

		self.selectors.$siteContainer.on('click', '[data-js-uploadfile]', () => {
            // Close other forms
			self.closeForms();
            // Show upload form
			utils.showForm('[data-js="datalistupload"]');
			return false;
		});

		$uploadForm.find('[data-js-close]').on('click', function(){
			self.closeForms();
		});
	},
	edit() {
		const self = this;
		let $form;

		self.selectors.$adminParent.on('click', '[data-form-action]', (e) => {
			const $activeRecord = $(e.currentTarget);

			if ($activeRecord.parent().data('custom-edit')) {
				$form = $($activeRecord.parent().data('custom-edit-form')).find('form:eq(0)');
			} else {
				$form = $(self.selectors.dataListEdit).find('form:eq(0)');
			}

			self.closeForms();

			$('.date-filter-inputs').find('input').datepicker({
				nextText: '',
				prevText: '',
				dateFormat: 'd M yy',
				onSelect: () =>
				{
					self.calculateDatesDifference();
				}
			});

			if($activeRecord.data('form-action') === 'assisted-create'){
				const $assistedCreateForm = $(self.selectors.assistedDataListEdit).find('form');

				// Replace form action from any update action to a create action.
				$form.attr('method','POST');
				$form.attr('action', $assistedCreateForm.attr('action').replace(/(\/update\/)[^?]+/,'/create'));
				$form.addClass('create-mode');
				$form.find('input').not('[type="hidden"]').val('');
				$form.find('textarea').val('');

				utils.showForm(self.selectors.assistedDataListEdit);
			} else if ($activeRecord.data('form-action') === 'create') {
				// If user has triggered CREATE action
				const $createForm = $(self.selectors.dataListEdit).find('form');

				// Replace form action from any update action to a create action.
				$form.attr('method','POST');
				$form.attr('action', $createForm.attr('action').replace(/(\/update\/)[^?]+/,'/create'));
				$form.addClass('create-mode');
				$form.find('input').not('[type="hidden"]').val('');
				$form.find('textarea').val('');

				utils.showForm(self.selectors.dataListEdit);
			} else if ($activeRecord.data('form-action') === 'edit') {
				// If user has triggered EDIT action
				const $td = $activeRecord.find('td');
				let recordObject = {};

				$form.removeClass('create-mode');
				$activeRecord.siblings().removeClass('currentEdit');
				$activeRecord.addClass('currentEdit');

				// Change form action to include ID of record we are updating, away from standard URL and also create URL.
				$form.attr('method','PUT');
				$form.attr('action', $form.attr('action').replace(/(\/update\/)[^?]+|\/create/,`/update/${$activeRecord.data('id')}`));

				// Set active record ID into local storage
				localStorage.setItem('activeRecordId', $activeRecord.data('id'));

				if ($activeRecord.parent().data('custom-edit')) {
					utils.showForm($activeRecord.parent().data('custom-edit-form'));
				} else {
					utils.showForm(self.selectors.dataListEdit);
				}

				for (let i=0;i< $td.length;i++){
					const currentProperty = $($td[i]);
					const cellContent = currentProperty.text();
					const fieldAssociation = currentProperty.data('js-field');
					const fieldType = currentProperty.data('js-fieldtype');
					const selectByText = currentProperty.data('js-selectbytext');

					// Fill form with values from selected record.
					if (fieldType === 'switch') {
						// For toggle switch field types.
						if (cellContent === 'Yes' || cellContent === 'True' || cellContent === 'true' || cellContent === 'TRUE'){
							$(`[name="${fieldAssociation}"]`).prop('checked',true);
						} else {
							$(`[name="${fieldAssociation}"]`).prop('checked',false);
						}
					} else if (fieldType === 'select') {
						// For select box field types.
						if (selectByText) {
							$(`[name="${fieldAssociation}"]`).find(`option:contains("${cellContent}")`).attr('selected','selected');
						} else {
							$(`[name="${fieldAssociation}"]`).find(`option[value="${cellContent}"]`).attr('selected','selected');
						}
					} else if (fieldType === 'daterange') {
						// For date range field types
						$(`.${fieldAssociation} [name="date_from"]`).val(currentProperty.find('.campaign-from').text().replace('st','').replace('th','').replace('rd','').replace('nd',''));
						$(`.${fieldAssociation} [name="date_to"]`).val(currentProperty.find('.campaign-to').text().replace('st','').replace('th','').replace('rd','').replace('nd',''));
						// Differently names columns per table
						$(`.${fieldAssociation} [name="valid_from"]`).val(currentProperty.find('.valid-from').text().replace('st','').replace('th','').replace('rd','').replace('nd',''));
						$(`.${fieldAssociation} [name="valid_to"]`).val(currentProperty.find('.valid-to').text().replace('st','').replace('th','').replace('rd','').replace('nd',''));
					} else if (fieldType === 'multiple') {
						// For multiple data set field types
						for (let j = 0; j < currentProperty.find('[data-js-multifield]').length; j++) {
							const currentField = currentProperty.find('[data-js-multifield]')[j];
							$(`[name="${$(currentField).data('js-multifield')}"]`).val($(currentField).text().replace(',', ''));
						}
					} else if (fieldType === 'duplicate') {
						$(`[data-js-base="${fieldAssociation}"]`).html(currentProperty.html());
					} else {
						// For bog standard text inputs!
						$(`[name="${fieldAssociation}"]`).val(cellContent.replace('£','').replace(',',''));
					}

					// Extra custom rules (to be extracted and refactored)
					if (fieldAssociation === 'postcode') {
						$('[name="postcode_search"]').val(cellContent);
					}

					// Build object for audit of record selected
					recordObject[fieldAssociation] = cellContent.replace(/\n/g,'').replace(/\t/g,'').trim();
				}

				// If its the store details module
				if ($('.ref_store_details').length > 0) {
					self.storeDetails($activeRecord.data('id'), $activeRecord.find('[data-js-field="store_code"]').text());
				}

				//If Mailing records search
				if ($('.search-and-suppress-mailing-records').length > 0){
					recordObject = self.mailingRecords();
				}

				// Set value of record object input to be the object built above.
				$('[name="recordObject"]').val(JSON.stringify(recordObject));

				// Create DELETE URL on Delete button element
				$form.find('.btn-danger').attr('href',$form.attr('action').replace('update','delete'));
			}

			$('.data-record-title').text($activeRecord.data('record-title'));
			$('.data-last-updated-dts').text($activeRecord.data('last-updated-dts'));
			$('.data-last-updated-by').text($activeRecord.data('last-updated-by'));
			self.calculateDatesDifference();
		});

		self.selectors.$siteContainer.on('click', '[data-js-close]', () => {
			self.closeForms();
		});
	},
	view() {
		const self = this;

		self.selectors.$userParent.on('click', '[data-form-action]', (e) => {
			const $activeRecord = $(e.currentTarget);
			const $td = $activeRecord.find('td');

			self.closeForms();

			// If user has triggered EDIT action
			$activeRecord.siblings().removeClass('currentEdit');
			$activeRecord.addClass('currentEdit');

			utils.showForm(self.selectors.dataListEdit);

			for (let i=0;i< $td.length;i++){
				const currentProperty = $($td[i]);
				const cellContent = currentProperty.text();
				const fieldAssociation = currentProperty.data('js-field');

				$(`[data-cell="${fieldAssociation}"]`).find('span[data-value]').text(cellContent.replace('£','').replace(',',''));
			}
		});
	},
	tiedto() {
		const self = this;

		if (self.selectors.$dataTiedTo.length > 0){
			self.selectors.$dataTiedTo.each(function(){
				const $dataTieField = $(this);

				$(`[name="${$dataTieField.data('js-tiedto')}"]`).change((e) => {
					$dataTieField.find(`option:eq(${$(e.currentTarget).prop('selectedIndex')})`).attr('selected','selected');
				});
			});
		}
	},
	delete() {
		const self = this;
		let $form = "";
		const confirmation = templates.nonModels.deleteConfirmation('record');
		let deleteUrl = "";

		// On delete click, add confirmation overlay
		self.selectors.$siteContainer.on('click', `${self.selectors.dataListEdit} .btn-danger`, (e) => {
			const $deleteButton = $(e.currentTarget);
			$('.site-container').append(confirmation);
			$('.confirmation-popup').show();
			deleteUrl = $deleteButton.attr('href');
			$form = $deleteButton.parents('form');
			$(self.selectors.dataListEdit).css({'z-index':'3'});
			return false;
		});

		// When a button in the confirmation overlay is clicked
		self.selectors.$siteContainer.on('click', '.confirmation-popup .btn', (e) => {
			if ($(e.currentTarget).data('js-delete')) {
				routes.delete(
					deleteUrl,
					$form.serialize(),
					(data) => {
						// Remove item we've just deleted from view
						$(`tr[data-id="${data.deleteId}"]`).remove();
						$('.confirmation-popup').remove();
						$(self.selectors.dataListEdit).css({'z-index':'4'});
						self.closeForms();
					},
					() => {
						$('.confirmation-popup').remove();
						$(self.selectors.dataListEdit).css({'z-index':'4'});
						self.closeForms();
					}
				);
			} else {
				$('.confirmation-popup').remove();
				$(self.selectors.dataListEdit).css({'z-index':'4'});
				return false;
			}
		});
	},
	update() {
		const self = this;

		self.selectors.$siteContainer.on('submit', `${self.selectors.dataListEdit} form`, (e) => {
			const $form = $(e.currentTarget);
			const $auditFormBody = $('.audit-history').find('tbody');
			const formMethod = $form.attr('method');
			const $viewToUpdate = $form.find('[name="viewToUpdate"]');
			const recordObject = {};
			const newRecordObject = {};

			if ($form.parsley().isValid() && !$form.hasClass('sub-form')){
				loaders.addLoader($form);

				// Cycle through fields in form to build recordObject for creation of records Audit Log.
				for (let i=0;i<$form.find('input').length;i++){
					const currentField = $form.find('input')[i];
					const fieldName = $(currentField).attr('name');
					const fieldValue = $(currentField).val();

					// If form needs to be uppercase on submit
					if ($form.parents('[data-uppercase-submit]').length > 0 && $(currentField).attr('type') == 'text') {
						$(currentField).val(fieldValue.toUpperCase().trim());
					}

					if (fieldName !== 'modelName' && fieldName !== 'recordObject' && fieldName !== 'newRecordObject'){
						if (formMethod === 'POST'){
							recordObject[fieldName] = fieldValue;
						} else {
							newRecordObject[fieldName] = fieldValue;
						}
					}
				}

				if (formMethod === 'POST'){
					$('[name="recordObject"]').val(JSON.stringify(recordObject));
				} else {
					$('[name="newRecordObject"]').val(JSON.stringify(newRecordObject));
				}

				// If form has custom fields (special cases below, to be made more generic with time, or alternatively move logic to server rather than frontend)
				if ($form.data('custom-attributes')) {
					features.init($form);
				}

				routes.dynamic(
					$form.attr('action'),
					formMethod,
					$form.serialize(),
					(data) => {
						self.closeForms();

						// Custom reset for reloading entire view
						if (data.refreshView === 'custom') {
							if (data.error !== '') {
								$('span.error').remove();
								$(`<span class="error">${data.error}</span>`).insertAfter('.sub-data-form legend');
							} else {
								self.storeDetailsCloseLocations();
							}
						} else if (data.refreshView) {
							// Refresh main URL and reset view
							const routeUrl = new Url;
							document.location.href = routeUrl.clearQuery().toString();
						} else {
							if ($viewToUpdate.length > 0) {
								$($viewToUpdate.val()).empty();
							} else {
								$('.datalist-view').find('tbody').empty();
							}

							$auditFormBody.empty();
							self.selectors.$dataList.removeClass('edit-active');

							if (data.auditHistory !== undefined) {
								for (let i=0;i<data.auditHistory.length;i++){
									// Refresh audit history after update
									$auditFormBody.append(templates.auditHistory(data.auditHistory[i]));
								}
							}

							for (let i=0;i<data.results.length;i++) {
								// data.template is set in our routes, it finds the relevant HTML template
								// for the model and renders the results from the AJAX request.
								if ($viewToUpdate.length > 0) {
									$($viewToUpdate.val()).append(templates[data.template](data.results[i]));
								} else {
									$('.datalist-view').find('tbody').append(templates[data.template](data.results[i]));
								}

								extractToolTemplatesGroups.draggableTemplate();
							}
						}
					},
					function(){
						self.closeForms();
					}
				);
			}
			return false;
		});
	},
	campaignSegments(recordId, modelType) {
		var $books = $('[data-content="books"]'),
			$recordSelection = $('[data-content="record-selection"]'),
			$promotion = $('[data-content="promotion"]'),
			$drop = $('[data-content="drop"]');

		if (modelType === 'books') {
			loaders.addLoader($books);

			// GET campaign record selections segments
			routes.get(
				`/campaign-management/campaigns/books/${recordId}`,
				function (data) {
					$books.find('.datalist-viewport').remove();
					$books.append(data);
				}
			);
		} else if (modelType === 'record-selection') {

			loaders.addLoader($recordSelection);

			// GET campaign record selections segments
			routes.get(
				`/campaign-management/campaigns/record-selection/${recordId}`,
				function (data) {
					$recordSelection.find('.datalist-viewport').remove();
					$recordSelection.append(data);
				}
			);
		} else if (modelType === 'promotion') {
			loaders.addLoader($promotion);

			// GET campaign promotion segments
			routes.get(
				`/campaign-management/campaigns/promotion/${recordId}`,
				function(data){
					$promotion.find('.datalist-viewport').remove();
					$promotion.append(data);
				}
			);
		} else if (modelType === 'drop') {
			loaders.addLoader($drop);

			// GET campaign drop segments
			routes.get(
				`/campaign-management/campaigns/drop/${recordId}`,
				function (data) {
					$drop.find('.datalist-viewport').remove();
					$drop.append(data);
				}
			);
		}
	},
	storeDetails(storeId, storeCode) {
		const self = this;
		const $storeLocations = $('[data-content="store-locations"]');

		loaders.addLoader($storeLocations);
		// GET stores via outcodes attributed to that store
		routes.get(
			`/administration/store-details/locations/${storeCode}`,
			(data) => {
				$storeLocations.find('.datalist-viewport').remove();
				$storeLocations.append(data);
				loaders.removeLoader();
			}
		);

		self.selectors.$siteContainer.on('click', '.nested-dataview tr', (e) => {
			const $row = $(e.currentTarget);
			const $storeCode = $row.find('[data-js-field="store_code"]').text();
			const $outcode = $row.find('[data-js-field="outcode_for_attribution"]').text();
			const storeName = $row.parents('.tabs').find('[name="store_name"]').val();

			self.selectors.$storeDetailForm.find('legend').text(`Editing store location for ${storeName}`);
			self.selectors.$storeDetailForm.attr('method','PUT');
			self.selectors.$storeDetailForm.attr('action', self.selectors.$storeDetailForm.attr('action').replace(/(\/update\/)[^?]+|\/create/,`/update/${$row.data('id')}`));
			self.selectors.$storeDetailForm.find('[name="store_code"]').val($storeCode);
			self.selectors.$storeDetailForm.find('[name="store_details_id"]').val(storeId);
			self.selectors.$storeDetailForm.find('[name="outcode_for_attribution"]').val($outcode);
			self.selectors.$storeDetailForm.show();
		});

		self.selectors.$siteContainer.on('click', '[data-js-close-nested="true"]', () => {
			self.storeDetailsCloseLocations();
		});

		self.selectors.$siteContainer.on('click', '[data-form-sub-action="create"]', (e) => {
			const storeName = $(e.currentTarget).parents('.tabs').find('[name="store_name"]').val();

			self.selectors.$storeDetailForm.find('legend').text(`Adding new store location for ${storeName}`);
			self.selectors.$storeDetailForm.attr('method','POST');
			self.selectors.$storeDetailForm.attr('action', self.selectors.$storeDetailForm.attr('action').replace(/(\/update\/)[^?]+/,'/create'));
			self.selectors.$storeDetailForm.find('[name="store_code"]').val(storeCode);
			self.selectors.$storeDetailForm.find('[name="store_details_id"]').val(storeId);
			self.selectors.$storeDetailForm.find('[name="outcode_for_attribution"]').val('');
			self.selectors.$storeDetailForm.show();
		});

		$('.ref_store_details').on('click', '[data-js-addrecord]', () => {
			self.storeDetailsCloseLocations();
			self.selectors.$storeLocations.hide();
		});
	},
	storeDetailsCloseLocations() {
		const self = this;

		$('.sub-data-form').hide();
		$(self.selectors.dataListEdit).find('.tab-trigger:eq(1)').click();
		utils.showForm($(self.selectors.dataListEdit));
		self.selectors.$storeLocations.show();
	},
	mailingRecords() {
		//build records object
		const self = this;
		let recordObject = {};

		// Cycle through fields in form to build recordObject for creation of records Audit Log.
		for (let i=0; i < self.selectors.$dataListEdit.find('input').length;i++){
			const currentField = self.selectors.$dataListEdit.find('input')[i];
			const fieldName = $(currentField).attr('name');

			recordObject[fieldName] = $(currentField).val();
		}
		return recordObject;
	},
	closeForms() {
		utils.closeForm('.audit-history');
		utils.closeForm('.ftp-upload');
		utils.closeForm('.data-type');
		utils.closeForm('.datalist-edit');
		utils.closeForm('[data-js="datalistupload"]');
	},
	addInput() {
		const self = this;

		$('.tab-content').on('click', self.selectors.addInputTrigger, (e) => {
			console.log($(e.currentTarget));
			$(e.currentTarget).parents('[data-js-accept="input"]').append('<input />');
		})
	},
	calculateDatesDifference() {
		const self = this;
		console.log(moment());
		const startDate = moment(self.selectors.$datesContainer.find('[name="date_from"]').val());
		const endDate = moment(self.selectors.$datesContainer.find('[name="date_to"]').val());
		const duration = endDate.diff(startDate, 'days');

		self.selectors.$timeBetween.text(`${duration} days`);

		if (Math.sign(duration) === -1) {
			self.selectors.$timeBetween.addClass('invalid-date').text(`Campaign cannot end before it starts.`);
		} else {
			self.selectors.$timeBetween.removeClass('invalid-date').text(`${duration} days`);
		}
	}
};

export { datalist };
