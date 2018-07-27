import io from 'socket.io-client';

// Include routes
import {routes} from './routes/routes';

const socketIoNotifications = {
	selectors: {
		$siteContainer: $('body'),
		notificationCloseTrigger: '.notification [data-js-close="true"]'
	},
	init() {
		const self = this;

		self.listenSocket();
		self.closeNotification();
	},
	listenSocket() {
		const socket = io.connect();

		socket.on('connect', () => {
		});

		socket.on('Job Requested Notification-extractSelectorInbound', (data) => {
			if (parseInt($('body').data('user-id')) === data.appUserId) {
				routes.customSocketExtractRequestedNotification(data.message);
			}
		});

		socket.on('Job Received Notification-extract-tool', (data) => {
			if (parseInt($('body').data('user-id')) === parseInt(JSON.parse(data.Body).appUserId)) {
				routes.customSocketExtractReceivedNotification(data);
			}
		});

		socket.on('Job Requested Notification-fileUploadInbound', (data) => {
			if (parseInt($('body').data('user-id')) === data.appUserId) {
				routes.customSocketExtractRequestedNotification(data.message);
			}
		});

        socket.on('Job Received Notification-file-upload', (data) => {
            if (parseInt($('body').data('user-id')) === parseInt(JSON.parse(data.Body).appUserId)) {
            	if (parseInt(JSON.parse(data.Body).status) === 'failed') {
		            routes.customFailure(JSON.parse(data.Body).message);
	            } else {
		            routes.customSocketFileReceivedNotification(data);
	            }
            }
        });

		socket.on('Job Requested Notification-dataExtractInbound', (data) => {
			if (parseInt($('body').data('user-id')) === data.appUserId) {
				routes.customSocketDataExtractRequestedNotification(data.message);
			}
		});

		socket.on('Job Received Notification-data-extract', (data) => {
			if (parseInt($('body').data('user-id')) === parseInt(JSON.parse(data.Body).appUserId)) {
				routes.customSocketFileReceivedNotification(data);
			}
		});
	},
	closeNotification() {
		const self = this;

		self.selectors.$siteContainer.on('click', self.selectors.notificationCloseTrigger, (e) => {
			$(e.currentTarget).parents('.notification').fadeOut();

			return false;
		});
	}
};

export { socketIoNotifications };
