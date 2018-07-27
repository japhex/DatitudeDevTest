// Include ui utils
import {utils} from './ui/utils';
import {loaders} from './ui/loaders';
import {templates} from './../templates/templates';

const ftpTool = {
	selectors: {
		$siteContainer: $('.site-container'),
		ftpForm: '[data-js-ftpfile="true"]',
		$uploadForm: $('[data-js="datalistupload"]'),
		$uploadFormFull: $('[data-js-upload="full"]')
	},
	init() {
		const self = this;

		self.ftpFile();
	},
	ftpFile() {
		const self = this;
		let droppedFiles = false;
		const $uploadForm = self.selectors.$uploadForm;
		let fileExtension;

		function showFiles(files) {
			$uploadForm.find('label').html(files.length > 1 ? files.length + ' files selected.' : files[ 0 ].name + ' <small>(click to change)</small>');
			$uploadForm.find('.btn').show();
		}

		function validationWarning(message){
			$(`<span class="validation-error">${message}</span>`).insertAfter($uploadForm.find('label'));
		}

		$uploadForm.on('drag dragstart dragend dragover dragenter dragleave drop', (e) => {
			e.preventDefault();
			e.stopPropagation();
		}).on('dragover dragenter', () => {
			$uploadForm.addClass('is-dragover');
		}).on('dragleave dragend drop', () => {
			$uploadForm.removeClass('is-dragover');
		}).on('drop', (e) => {
			droppedFiles = e.originalEvent.dataTransfer.files;

			const fileExtensionIdx = droppedFiles[0].name.split('.').length
			fileExtension = droppedFiles[0].name.split('.')[fileExtensionIdx];

			$uploadForm.addClass('dropped');
			$('.validation-error').remove();

			if (fileExtension !== 'xlsx' && fileExtension !== 'csv') {
				$uploadForm.find('.btn').hide();
				validationWarning('The filetype of the file you\'re uploading must be .xlsx');
			} else {
				$uploadForm.find('.btn').show();
				showFiles(droppedFiles);
			}
		});

		$uploadForm.find('label').on('click', (e) => {
			e.preventDefault();
			$uploadForm.find('input[type="file"]').click();
		});

		$uploadForm.find('input[type="file"]').on('change', (e) => {
			droppedFiles = e.target.files;
			fileExtension = droppedFiles[0].name.split('.')[1];

			$('.validation-error').remove();

			if (fileExtension !== 'xlsx' && fileExtension !== 'csv') {
				$uploadForm.find('.btn').hide();
				validationWarning('The filetype of the file you\'re uploading must be .xlsx');
			} else {
				$('.uploaded').remove();
				$uploadForm.find('.btn').show();
				showFiles(droppedFiles);
			}
		});

		self.selectors.$siteContainer.on('submit', self.selectors.ftpForm, (e) => {
			const $form = $(e.currentTarget);
			const ajaxData = new FormData($form.get(0));

			if ($form.attr('data-js-full') === 'true') {
				// Full form upload
				utils.closeForm('.ftp-upload');
				self.selectors.$siteContainer.append(templates.nonModels.fileUploadConfirmation());
				utils.showForm('.upload-confirmation');

				return false;
			}

			if (droppedFiles) {
				$.each( droppedFiles, (i, file) => {
					// Issue here where this is being sent fine but the one above is maybe overwriting it?
					ajaxData.append( $uploadForm.find('input[type="file"]').attr('name'), file );
				});
			}

			// FTP FILE
			$.ajax({
				url: $form.attr('action'),
				type: 'POST',
				data: ajaxData,
				dataType: 'json',
				enctype: 'multipart/form-data',
				cache: false,
				contentType: false,
				processData: false,
				beforeSend() {
					loaders.addLoader($form);
				},
				success() {
					loaders.addLoader($form);
				},
				complete() {
					loaders.removeLoader();
					$uploadForm.find('label').html('<strong>Choose a file</strong><span class="dragndrop"> or drag it here</span>.');
					$uploadForm.find('.btn-primary').hide();
					$uploadForm.find('input[type="file"]').val('');
					$form.append('<p class="uploaded">Thank you, please be patient to see any data changes here as the data will be refreshed overnight. If this is a problem, please <a href="MAILTO:support@datitude.co.uk">contact us</a>.</p>');
					$form.attr('data-js-full', true);
				}
			});
			return false;
		});

		self.selectors.$siteContainer.on('click', '.upload-confirmation [data-js-close-sub]', () => {
			utils.closeForm('.upload-confirmation');
			utils.showForm('.ftp-upload');
		});

		self.selectors.$siteContainer.on('click', '.upload-confirmation .btn', () => {
			$(self.selectors.ftpForm).attr('data-js-full', false);
			utils.closeForm('.upload-confirmation');
			utils.showForm('.ftp-upload');
			$(self.selectors.ftpForm).submit();
		});
	}
};

export { ftpTool };
