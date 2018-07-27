// Include routes
import {routes} from './../../../routes/routes';

// Include ui utils
import {loaders} from './../../../ui/loaders';

import {templates} from "../../../../templates/templates";

import Url from './../../../../../vendor/domurl/url.min';
// ---------------------------------------------------------------------
// Status 1: Created and setting up to request selections in temp table
// ---------------------------------------------------------------------

const aCreated = {
	selectors: {
		$siteContainer: $('.site-container'),
		getSegmentsTrigger: '[data-target="record-selection"]',
		getSegmentsTarget: '[data-segment-type="record-selection"] .container-segments',
		addSegmentTrigger: '[data-add-segment="true"]',
		addSegmentSubmitForm: '[data-js-add-segment="true"]',
		addSegmentForm: '[data-js-add-segment="true"] .segment-form',
		cancelButton: '.btn-secondary',
		segmentsBackButton: '.segments-back-button',
		loadSegmentTrigger: '[data-campaign-segment="true"]',
		addQueryTrigger: '[data-add-query="true"]',
		getQueryTarget: '[data-segment-type="record-selection"] .container-queries',
		addQueryForm: '[data-js-create-segment-query]',
		deleteQueryTrigger: '[data-js-delete-segment-query]'
	},
	init() {
		const self = this;

		// Segments CRUD
		self.getSegments();
		self.addSegment();
		self.loadSegment();

		// Query CRUD
		self.addQuery();
		self.deleteQuery();

		// UI
		self.segmentsBackButton();
	},
	getSegments() {
		const self = this;

		// ---------------------------------------------------------------------------------
		// Form API actions
		self.selectors.$siteContainer.on('click', self.selectors.getSegmentsTrigger, () => {
			const campaignId = localStorage.getItem('activeRecordId');

			$(self.selectors.getSegmentsTarget).find('.datalist-viewport').remove();
			loaders.addLoader($(self.selectors.getSegmentsTarget));

			routes.get(
				`/campaign-management/campaigns/${campaignId}/segments`,
				(data) => {
					$(self.selectors.getSegmentsTarget).append(data);
					self.showSegments();
				}
			);
		});
		// ---------------------------------------------------------------------------------
	},
	addSegment() {
		const self = this;

		// ---------------------------------------------------------------------------------
		// Form UI actions
		self.selectors.$siteContainer.on('click', self.selectors.addSegmentTrigger, (e) => {
			const $addTrigger = $(e.currentTarget);
			const campaignId = localStorage.getItem('activeRecordId');

			$addTrigger.parents().find('.datalist-viewport').hide();
			$addTrigger.parents().find(self.selectors.addSegmentForm).show();
			$addTrigger.parents().find(self.selectors.addSegmentForm).find('[name="campaign_id"]').val(campaignId);

			return false;
		});

		self.selectors.$siteContainer.on('click', self.selectors.cancelButton, (e) => {
			const $cancelTrigger = $(e.currentTarget);

			$cancelTrigger.parents().find('.datalist-viewport').show();
			$cancelTrigger.parents().find(self.selectors.addSegmentForm).hide();
			self.showSegments();
		});
		// ---------------------------------------------------------------------------------

		// ---------------------------------------------------------------------------------
		// Form API actions
		self.selectors.$siteContainer.on('submit', self.selectors.addSegmentSubmitForm, (e) => {
			const $form = $(e.currentTarget);
			const $parentForm = $form.parents('li');

			routes.post(
				$form.attr('action'),
				$form.serialize(),
				() => {
					$parentForm.find('.datalist-viewport').show();
					$parentForm.find(self.selectors.addSegmentForm).hide();
					$(self.selectors.getSegmentsTrigger).click();
					self.showSegments();
				}
			);

			return false;
		});
		// ---------------------------------------------------------------------------------
	},
	loadSegment() {
		const self = this;

		// ---------------------------------------------------------------------------------
		// Form API actions
		self.selectors.$siteContainer.on('click', self.selectors.loadSegmentTrigger, (e) => {
			const $segment = $(e.currentTarget);
			const campaignId = localStorage.getItem('activeRecordId');
			const segmentId = $segment.data('id');

			loaders.addLoader($(self.selectors.getSegmentsTarget));

			routes.get(
				`/campaign-management/campaigns/${campaignId}/segments/${segmentId}/queries`,
				(data) => {
					self.showQueries();
					$segment.parents('li').find('.container-queries').remove();
					$segment.parents('li').append(data);

					localStorage.setItem('activeSegmentId', segmentId);
				}
			);
		});
		// ---------------------------------------------------------------------------------
	},
	addQuery() {
		const self = this;

		// ---------------------------------------------------------------------------------
		// Form API actions
		self.selectors.$siteContainer.on('click', self.selectors.addQueryTrigger, (e) => {
			const $addQueryTrigger = $(e.currentTarget);
			const campaignId = localStorage.getItem('activeRecordId');
			const segmentId = localStorage.getItem('activeSegmentId');
			const $addQueryForm = $(self.selectors.addQueryForm);

			loaders.addLoader($addQueryTrigger.parent().find('.datalist-viewport'));

			routes.post(
				$addQueryForm.attr('action'),
				$addQueryForm.serialize(),
				(data) => {
					// MOVE THE BELOW TO A TEMPLATE PRONTO
					if ($addQueryTrigger.parent().find('.datalist-viewport .empty-table').length > 0) {
						$('.container-queries .datalist-viewport').remove();

						$(templates.addQueryFullTemplate(data.campaignQueryId, campaignId, segmentId)).insertAfter($addQueryTrigger.parent().find('[data-js-create-segment-query]'));
					} else {
						$addQueryTrigger.parent().find('.datalist-viewport tbody').append($(templates.addQueryTemplate(data.campaignQueryId, campaignId, segmentId)));
					}
				}
			);
		});
		// ---------------------------------------------------------------------------------
	},
	deleteQuery() {
		const self = this;

		// ---------------------------------------------------------------------------------
		// Form API actions
		self.selectors.$siteContainer.on('click', self.selectors.deleteQueryTrigger, (e) => {
			const $deleteQueryTrigger = $(e.currentTarget);

			loaders.addLoader($deleteQueryTrigger.parent().find('.datalist-viewport'));

			routes.delete(
				$deleteQueryTrigger.attr('href'),
				{},
				() => {
					$deleteQueryTrigger.parents('tr').remove();

					if ($('.container-queries .datalist-viewport').find('tbody tr').length === 0) {
						$('.container-queries .datalist-viewport').remove();

						$(templates.emptyQueryTemplate()).insertBefore('.segments-back-button');
					}
				}
			);

			return false;
		});
	},
	showSegments() {
		const self = this;

		$(self.selectors.getQueryTarget).hide();
		$(self.selectors.getSegmentsTarget).show();
	},
	showQueries() {
		const self = this;

		$(self.selectors.getQueryTarget).show();
		$(self.selectors.getSegmentsTarget).hide();
	},
	segmentsBackButton() {
		const self = this;
		const url = new Url;
		const segmentId = url.query.segment;

		self.selectors.$siteContainer.on('click', self.selectors.segmentsBackButton, (e) => {
			self.showSegments();

			if (segmentId !== undefined) {
				$(self.selectors.getSegmentsTrigger).click();
			}
			return false;
		});
	}
};

export { aCreated };