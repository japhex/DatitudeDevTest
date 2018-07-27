define([
	'jquery'
],
function($) {
	var customerAndProspects = {
		selectors: {
			$siteContainer: $('.site-container'),
			addressContainer: '.customer-address-actions',
			addressSection: '[data-js-address-data] h2',
			addressData: '[data-js-address-data]'
		},
		init: function(){
			var self = this;
			self.addressExpand();
		},
		addressExpand: function(){
			var self = this;
			$(self.selectors.addressData).on('click', $(self.selectors.addressSection), function() {
				var address = $(this).attr('class');

				if ( $('.' + address + '-data').css('display') == 'none' ){
					$(self.selectors.addressData).find('div[class$="-address-data"]').hide();
					$('.' + address + '-data').show();
				} else {
					$('.' + address + '-data').hide();
				}
			});
		}
	};
	return customerAndProspects;
});
