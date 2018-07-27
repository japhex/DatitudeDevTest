const tabs = {
	selectors: {
		$tabs: $('[data-js-tabs]')
	},
	bindTabs() {
		const self = this;

		self.selectors.$tabs.each(() => {
			$('.site-container').on('click', '.tab-trigger', (e) => {
				const $activeTab = $(e.currentTarget);
				const $target = $activeTab.data('target');

				$activeTab.siblings().removeClass('active');
				$activeTab.addClass('active');
				$activeTab.parents('.tabs').find('.tab-content').removeClass('active');
				$(`[data-content="${$target}"]`).addClass('active');

				return false;
			});
		});
	}
};

export  { tabs };
