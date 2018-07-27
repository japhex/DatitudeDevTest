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
		datalistViewport: '.datalist-viewport'
	},
	init() {
		const self = this;

		
		self.loadCampaignOnSave();
	},
	loadCampaignOnSave() {
		const url = new Url;
		const campaignId = url.query.campaign;

		if (campaignId !== undefined) {
			$(`tr[data-id="${campaignId}"]`).click();
		}
	}
};

export { associations };
