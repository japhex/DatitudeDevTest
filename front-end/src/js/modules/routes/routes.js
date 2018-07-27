// Include ui utils
import {loaders} from './../ui/loaders';
import {templates} from './../../templates/templates';


const routes = {
	dynamic(url,type,object,done,fail,element) {
		const self = this;
		// Make request to server to POST (insert) data
		$.ajax({
			url: url,
			type:type,
			data: object,
			success(data) {
				if (done !== undefined){
					done(data);
				}

				if (data.successMessage !== undefined && data.successMessage.length > 0){
					self.customSuccess(data.successMessage);
				} else if (data.successMessage !== undefined){
					self.genericSuccess(element);
				}

				loaders.removeLoader();
			},
			error(data) {
				if (fail === undefined) {
					self.customFailure(data);
				} else {
					fail(data);
					self.customFailure(data);
				}

				loaders.removeLoader();
			}
		});
	},
	put(url,object,done) {
		// Make request to server to POST (insert) data
		$.ajax({
			url:url,
			type:'PUT',
			data: object,
			success(data) {
				done(data);
				loaders.removeLoader();
			}
		});
	},
	post(url,object,done,fail,element) {
        const self = this;
		// Make request to server to POST (insert) data
		$.post(url,object).done((data) => {
			if (done === undefined){
				self.genericSuccess(element);
			} else {
				done(data);
			}

			loaders.removeLoader();
		}).fail(() => {
			if (fail === undefined){
				self.genericFailure(element);
			} else {
				fail();
				self.genericFailure(element);
			}
			loaders.removeLoader();
		});
	},
	delete(url,object,done,fail,element) {
        const self = this;
		// Make request to server to POST (insert) data
		$.ajax({
			url:url,
			type:'DELETE',
			data: object,
			success(data) {
				if (done !== undefined){
					done(data);
				}

				if (data.successMessage !== undefined && data.successMessage.length > 0){
					self.customSuccess(data.successMessage);
				} else {
					self.genericSuccess(element);
				}

				loaders.removeLoader();
			},
			error(data) {
				if (fail === undefined){
					self.customFailure(data);
				} else {
					fail(data);
					self.customFailure(data);
				}
				loaders.removeLoader();
			}
		});
	},
	get(url,done) {
		// Make request to server to GET (retrieve) data
		$.get(url, (data) => {
			if (done !== undefined) {
				done(data);
			}

			loaders.removeLoader();
		}).fail(() => {
			loaders.removeLoader();
		});
	},
	postForm(url,object) {
		// Make request to server to POST (insert) data
		$.ajax({
			url: url,
			data: object,
			enctype: 'multipart/form-data',
			processData: false,
			contentType: false,
			type: 'POST',
			success() {
			},
			error() {
			}
		});
	},
	genericSuccess(object) {
        const $message = templates.socketMessaging.genericSuccess(object);
		this.genericMessagingFunctions($message);
	},
	genericFailure(object) {
        const $message = templates.socketMessaging.genericFailure(object);
		this.genericMessagingFunctions($message);
	},
	customSuccess(object) {
        const $message = templates.socketMessaging.customSuccess(object);
		this.genericMessagingFunctions($message);
	},
	customFailure(object) {
		const $message = templates.socketMessaging.customFailure(object);
		this.genericMessagingFunctions($message);
	},
	customSocketNotification(object) {
        const $message = templates.socketMessaging.customSocketNotification(object);
		this.customMessagingFunctions($message);
	},
	customSocketExtractRequestedNotification(object) {
        const $message = templates.socketMessaging.customSocketExtractRequestedNotification(object);
		this.customMessagingFunctions($message);
	},
	customSocketDataExtractRequestedNotification(object) {
		const $message = templates.socketMessaging.customSocketDataExtractRequestedNotification(object);
		this.customMessagingFunctions($message);
	},
	customSocketExtractReceivedNotification(object) {
        const messageBody = JSON.parse(object.Body);
        const $message = templates.socketMessaging.customSocketExtractReceivedNotification(object, messageBody);

		this.customMessagingFunctions($message);
	},
    customSocketFileReceivedNotification(object) {
	    const messageBody = JSON.parse(object.Body);
	    const $message = templates.socketMessaging.customSocketFileReceivedNotification(object, messageBody);

	    this.customMessagingFunctions($message);
    },
	genericMessagingFunctions($message) {
		$('.success-text').remove();
		$('.error-text').remove();

		$message.find('.icon-icon_close').on('click', () => {
			$message.remove();
		});

		$('body').append($message);

		setTimeout(function(){$message.fadeOut();},3000);
	},
	customMessagingFunctions($message) {
		$('.success-text').remove();
		$('.error-text').remove();

		$message.find('.icon-icon_close').on('click', () => {
			$message.remove();
		});

		$('.notifications-container').append($message);
	}
};

export { routes };
