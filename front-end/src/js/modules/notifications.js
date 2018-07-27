// Include routes
import {routes} from './routes/routes';

const notifications = {
	selectors: {
		$siteContainer: $('.main-site-container'),
		resolveNotificationTrigger: '[data-resolve-notification]',
		$notificationCount: $('.notification-count'),
		pendingNotifications: '.pending-notifications',
		$notificationsContainer: $('.header-notifications-container'),
		closeNotifications: '.close-notifications'
	},
	init() {
		const self = this;

		self.resolveNotificaton();
		self.activateNotifications();
	},
	resolveNotificaton() {
		const self = this;

		self.selectors.$siteContainer.on('click', `${self.selectors.resolveNotificationTrigger}, .notification a`, (e) => {
			const $record = $(e.currentTarget);
			const $notification = $record.parents('.notification');

			routes.put(
				`/user/notifications/${$record.data('id')}/resolve`,
				{active:'false'},
				(data) => {
					if (data.updated) {
						$notification.remove();
						self.selectors.$notificationCount.text(self.updateNotificationCount());
					}

					if (self.updateNotificationCount() === 0) {
						$('.header-notifications-container').removeClass('active').remove();
						$('body').removeClass('active-notifications');
						$('.pending-notifications').addClass('no-notifications').removeClass('pending-notifications');
					}
				}
			);
		});
	},
	updateNotificationCount() {
		return $('.notification').length;
	},
	activateNotifications() {
		const self = this;

		self.selectors.$siteContainer.on('click', self.selectors.pendingNotifications, () => {
			self.selectors.$notificationsContainer.toggleClass('active');
			$('body').toggleClass('active-notifications');
			return false;
		});

		self.selectors.$siteContainer.on('click', self.selectors.closeNotifications, () => {
			self.selectors.$notificationsContainer.toggleClass('active');
			$('body').toggleClass('active-notifications');
		});
	}
};
export { notifications };
