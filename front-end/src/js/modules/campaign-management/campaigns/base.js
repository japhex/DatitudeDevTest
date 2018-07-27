// Include plugins/libraries
import {aCreated} from './status/a-created';

const campaigns = {
	selectors: {
		$siteContainer: $('.site-container'),
		$popup: $('.query-selector-forms'),
		targetLoad: '[data-target]',
		$datesContainer: $('.date-filter'),
		unitCostCold: '[name="unit_cost_cold"]',
		unitCostHouse: '[name="unit_cost_house"]',
		volumeCold: '[name="volume_cold"]',
		volumeHouse: '[name="volume_house"]'

	},
	init() {
		const self = this;

		self.getAssociatedRecords();
		self.calculateMailingCost();

		// Wizard campaign process
		aCreated.init();
	},
	getAssociatedRecords() {
		const self = this;


	},
	calculateMailingCost() {
		const self = this;;

		self.selectors.$siteContainer.on('click', '[data-js="calculateMailingCost"]', () => {
			const coldCost = $(self.selectors.unitCostCold).val() * $(self.selectors.volumeCold).val();
			const houseCost = $(self.selectors.unitCostHouse).val() * $(self.selectors.volumeHouse).val();
			const mailingCost = coldCost + houseCost;

			$('[name="overall_mailing_cost"]').val(mailingCost);
		});
	}
};

export { campaigns };
