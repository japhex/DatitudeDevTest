const layout = {
	selectors: {
		$body: $('body')
	},
	getNavigation() {
		const self = this;

		$.get('/layout/navigation', (data) => {
			console.log(data);
		});
	}
};

export { layout };
