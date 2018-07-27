// Include routes
import {routes} from './../routes/routes';

const usersUtils = {
	selectors: {
		$siteContainer: $('.site-container'),
		forgottenPasswordForm: '[data-util-forgotten-password]',
		forgottenPasswordTrigger: '[data-forgotten-password-trigger]'
	},
	checkEmail() {
		const self = this;

		self.selectors.$siteContainer.on('click', self.selectors.forgottenPasswordTrigger, function(){
			routes.dynamic(
				'/check-email',
				'POST',
				$('[name="username"]').serialize(),
				function(data){
					if (!data.user) {
						// even though user doesn't exist, blag that they do.
						routes.customSuccess(`Thanks, we've sent you an email with instructions.`);
					} else {
						$(self.selectors.forgottenPasswordForm).find('form').submit();
					}
				}
			);
		});
	}
};

export { usersUtils };
