// Include ui utils
import {utils} from './ui/utils';
import {loaders} from './ui/loaders';
import {templates} from '../templates/templates';


const auditLog = {
	selectors: {
	    $siteContainer: $('.site-container'),
		$auditTrigger: '[data-js-auditlog="true"]',
		$auditLog: '.audit-history',
		revertAuditTrigger: '[data-revert-audit-history]',
		warningForm: templates.nonModels.auditHistoryWarning(),
		warningAcceptance: '[data-js-commit]',
		$auditConfirmation: '.audit-confirmation',
		loadMoreLogs: '[data-js-load-more-audits]',
		record: {}
	},
	init() {
		const self = this;

		self.loadLog();
	},
	loadLog() {
		const self = this;

		self.selectors.$siteContainer.on('click', self.selectors.$auditTrigger, () => {
			// Close other forms
			utils.closeForm('[data-js="datalistupload"]');
			utils.closeForm('.datalist-edit');
			utils.closeForm('.data-type');
			// Open audit log
			utils.showForm(self.selectors.$auditLog);
			$(self.selectors.$auditLog).toggleClass('active');
			return false;
		});

		self.selectors.$siteContainer.on('click', '[data-js-close]', () => {
			utils.closeForm(self.selectors.$auditLog);
			return false;
		});

		// Clearing on keyup of the escape key
		$(document).keyup((e) => {
			if (e.keyCode === 27) {
				utils.closeForm(self.selectors.$auditLog);
			}
		});

		// Reverting audit history...[DANGEROUS]
		self.selectors.$siteContainer.on('click', self.selectors.revertAuditTrigger, (e) => {
			const $revert = $(e.currentTarget);
			const csrfToken = $revert.data('csrf');
			const recordId = $revert.data('record-id');
			const recordData = $revert.data('record');
			const recordAction = $revert.data('action');
			const $parentData = $revert.parents('.audit-history-entry');
			const modelName = $parentData.find('[name="modelName"]').val();
			const recordObject = $parentData.find('[name="recordObject"]').val();
			const newRecordObject = $parentData.find('[name="newRecordObject"]').val();

			recordData._csrf = csrfToken;
			recordData.modelName = modelName;
			recordData.recordObject = recordObject;
			recordData.newRecordObject = newRecordObject;

			if ($parentData.find('span.action').text() === 'create') {
				recordData.recordObject = recordObject;
				recordData.newRecordObject = recordObject;
			} else if ($parentData.find('span.action').text() === 'delete') {
				recordData.recordObject = newRecordObject;
				recordData.newRecordObject = newRecordObject;
			}

			self.selectors.record = {
				recordId: recordId,
				recordData: recordData,
				recordAction: recordAction
			};

			self.selectors.$siteContainer.append(self.selectors.warningForm);
			utils.closeForm(self.selectors.$auditLog);
			utils.showForm(self.selectors.$auditConfirmation);

			return false;
		});

		self.selectors.$siteContainer.on('click', self.selectors.warningAcceptance, () => {
			const recordObject = self.selectors.record;
			const id = self.selectors.record.recordId;
			let action = self.selectors.record.recordAction;
			let includeId;
			let postType = 'PUT';


			if (action === 'create') {
				action = 'delete';
				postType = 'DELETE';
			} else if (action === 'delete') {
				action = 'create';
				postType = 'POST';
			}

			includeId = (action === 'update' || action === 'delete') ? `/${id}` : '';

			loaders.addLoader(self.selectors.$auditConfirmation);

			$.ajax({
				url: `${window.location.pathname}/${action}${includeId}`,
				type: postType,
				data: recordObject.recordData,
				dataType: 'json',
				success:() => {
					loaders.removeLoader();
					$(self.selectors.$auditConfirmation).find('p').text('Record successfully updated.');
					$(self.selectors.$auditConfirmation).find('a').fadeOut();
					// Refresh screen
					window.location.reload();
				}
			});
		});

		self.selectors.$siteContainer.on('click', '.audit-confirmation [data-js-close-sub="true"]', () => {
			$(self.selectors.$auditConfirmation).remove();
		});
	}
};

export { auditLog };
