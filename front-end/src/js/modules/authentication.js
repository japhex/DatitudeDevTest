// Include routes
import {routes} from './routes/routes';

// Include ui utils
import {loaders} from './ui/loaders';

const authentication = {
	selectors: {
		$siteContainer: $('.site-container'),
		createUserForm: '[data-js-create-user="true"]',
		usernameField: '[name="username"]',
		loginForm: '[action="/login"]'
	},
	init() {
		const self = this;

		self.ajaxLogin();
		self.checkEmail();
	},
	ajaxLogin() {
		const self = this;

		self.selectors.$siteContainer.on('submit', self.selectors.loginForm, (e) => {
			const $form = $(e.currentTarget);

			loaders.addLoader(self.selectors.loginForm);

			routes.post(
				$form.attr('action'),
				$form.serialize(),
				(data) => {
					$form.parent().parent().append($(data).find('.form-centered-control'));
					$form.parent().remove();
				}
			);
			return false;
		});
	},
	checkEmail() {
		const self = this;

		$(self.selectors.createUserForm).find('[name="username"]').blur(() => {
			const $usernameField = $(self.selectors.createUserForm).find(self.selectors.usernameField);
			const sendObject = {
				username: $usernameField.val()
			};

			loaders.addLoader(self.selectors.createUserForm);

			routes.post(
				'/check-email',
				sendObject,
				(data) => {
					$(self.selectors.createUserForm).find('.form-element:eq(0) .material-icons').remove();
					$(`<i class="material-icons ${data.user ? 'negative' : 'positive'} input-feedback">&#xE5CD;</i>`).insertAfter($usernameField);
				}
			);
		});
	}
};

export { authentication };
