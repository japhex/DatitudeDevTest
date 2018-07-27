// Include plugins/libraries
import parsley from './../../vendor/parsleyjs/dist/parsley.min';

// Include modules
import * as customValidators from './customValidators';


const validation = {
	init() {
		const self = this;

		customValidators.customValidators.init();
		self.bindValidation();
	},
	bindValidation() {
		$('form').each(function(){
			const $form = $(this);
			const $popupForm = $form.parents('.datalist-edit').length > 0;
			const breakpoint = $('body').css('content').replace(/'/g, '').replace(/"/g, '');

			// Reset size if overlay extends window
			$form.parsley().on('form:validated', function() {
				if ($popupForm && breakpoint !== 'mobile') {
					if ($form.parents('.datalist-edit').height() > $(window).height()) {
						$form.parents('.datalist-edit').css({'height': ($(window).height() - 50) + 'px', 'overflow-y': 'auto'});
					} else {
						$form.parents('.datalist-edit').css({
							'top': '49.9%',
							'transform': 'translateX(-50.1%) translateY(-50.1%) translateZ(0)'
						});
					}
				}
			});
		});
	}
};

export { validation };
