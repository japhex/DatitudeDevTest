// Include routes
import {routes} from './../../routes/routes';

// Include ui utils
import {utils} from './../../ui/utils';
import {loaders} from './../../ui/loaders';

// Include modules
import {datalist} from './../../datalist';

// Include templates
import {templates} from './../../../templates/templates';

// Include plugins/libraries
import Url from './../../../../vendor/domurl/url.min';

const associations = {
	selectors: {
		$siteContainer: $('.site-container'),
		campaignSegmentRecord: '[data-campaign-segment="true"]',
		addSegmentRecord: '[data-js-add-segment="true"]',
		updateSegmentRecord: '[data-js-update-segment="true"]',
		buttonAddSegment: '[data-add-segment="true"]',
		confirmationPopup: '.confirmation-popup',
		dataSaveSegment: '[data-save-segment="true"]',
		datalistViewport: '.datalist-viewport',
		segmentQueryParent: '[data-target="record-selection"]',
		getSegmentsTarget: '[data-segment-type="record-selection"] .container-segments',
		getQueryTarget: '[data-segment-type="record-selection"] .container-queries',
		queriesContainer: '[data-segment-type="record-selection"]'
	},
	init() {
		const self = this;

		self.loadCampaignOnSave();
	},
	loadCampaignOnSave() {
		const self = this;
		const url = new Url;
		const campaignId = url.query.campaign;
		const segmentId = url.query.segment;

		if (segmentId !== undefined) {
			$(`tr[data-id="${campaignId}"]`).click();
			$(self.selectors.segmentQueryParent).siblings().removeClass('active');
			$(self.selectors.segmentQueryParent).addClass('active');
			$(self.selectors.queriesContainer).siblings().removeClass('active');
			$(self.selectors.queriesContainer).addClass('active');

			loaders.addLoader($(self.selectors.getSegmentsTarget));

			routes.get(
				`/campaign-management/campaigns/${campaignId}/segments/${segmentId}/queries`,
				(data) => {
					$(self.selectors.getQueryTarget).show();
					$(self.selectors.getSegmentsTarget).hide();

					$(self.selectors.queriesContainer).find('.container-queries').remove();
					$(self.selectors.queriesContainer).append(data);

					localStorage.setItem('activeSegmentId', segmentId);
				}
			);
		}
	}
};

export { associations };
