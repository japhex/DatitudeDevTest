const loaders = {
	addLoader(element) {
		$(element).append('<div class="loader"></div>');
	},
	addMiniLoader(element) {
		$(element).append('<div class="mini-loader"></div>');
	},
	addExtractLoader(element) {
		$(element).append('<div class="extract-mini-loader-container"><div class="extract-mini-loader"></div></div>');
	},
	removeLoader() {
		$('.loader').remove();
	},
	removeMiniLoader() {
		$('.mini-loader').remove();
	},
};

export { loaders };
