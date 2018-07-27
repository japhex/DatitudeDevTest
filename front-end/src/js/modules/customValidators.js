const customValidators = {
	init() {
		const self = this;

		self.segmentRangeCheck();
		self.segmentMaxIntervalCheck();
		self.dateRangeCheck();
		self.oneOfManyCheck();
	},
	segmentRangeCheck() {
		const $tableRow = $('.list').find('tr');
		const $maxIntervals = $('[data-js-val="maxintervalrange"]');
		const $minIntervals = $('[data-js-val="minintervalrange"]');

		window.Parsley.addValidator('intervalrange', (value) => {
			for (let i=0; i < $tableRow.length;i++){
				const minInterval = $($tableRow[i]).find($minIntervals).text().replace(',','').replace('£','');
				const maxInterval = $($tableRow[i]).find($maxIntervals).text().replace(',','').replace('£','');
				const rangeCheck = $('.currentEdit').find('[data-js-field="segment_type"]').text();
				const errorField = $('[data-parsley-intervalrange]').parsley();

				// Do not check against the current row that is selected, also take into account Segment Type and only check against similar types
				if ((!$($tableRow[i]).hasClass('currentEdit')) && ($($tableRow[i]).find('[data-js-field="segment_type"]').text() == rangeCheck)){
					// Make sure value is not in between range of existing segment types
					if ((parseInt(value) >= parseInt(minInterval)) && (parseInt(value) < parseInt(maxInterval))) {
						const errorRow = `The number entered falls between the existing intervals: ${$($tableRow[i]).find('[data-js-field="segment"]').text()}`;

						window.ParsleyUI.removeError(errorField, 'intervalrange-error');
						window.ParsleyUI.addError(errorField, 'intervalrange-error', errorRow);
						return false;
					}
				}
			}
			return true;
		}, 32);
	},
	segmentMaxIntervalCheck() {
		const $minInterval = $('[data-parsley-intervalrange]');

		window.Parsley.addValidator('maxinterval', (value) => {
			return parseInt(value) > parseInt($minInterval.val());
		}, 32).addMessage('en','maxinterval','The number entered must be greater than the minimum interval.');
	},
	dateRangeCheck() {
		window.Parsley.addValidator('daterange', (value) => {
			const $fromDate = $('form [name="date_from"]').val();
			// Make sure end date is after start date for campaign data.
			return new Date(value) > new Date($fromDate);
		}, 32).addMessage('en','daterange','Campaign end date cannot be before the campaign start date.');
	},
	oneOfManyCheck() {
		const $form = $('[data-parsley-oneofmany="true"]');
		const $oneOfManyFields = $('[data-parsley-oneofmany]');

		if($form.length>0){
			$form.parsley().on('form:submit', () => {
				const $inputs = $oneOfManyFields;
				const $errorDiv = $('.error-message');
				let hasValue = false;

				for (let i=0; i < $inputs.length; i++) {
					if ($($inputs[i]).val() !== '') {
						hasValue = true;
					} else {
						$errorDiv.html('You must fill at least one search field!');
						$errorDiv.show();
						$form.validationResult = false;
					}
				}

				return hasValue;
			});
		}
	}
};

export { customValidators };
