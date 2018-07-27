// Include plugins/libraries
import Url from './../../../vendor/domurl/url.min';

const pagination = {
	init() {
		$('.site-container').on('click', '.page-footer a', (e) => {
            const offset = $(e.currentTarget).attr('href');
            const url = new Url;

			$('[name="offsetQuery"]').val(offset);
			$('[name="filters"]').val(url.query.filters);
			$('[name="searchTerm"]').val(url.query.searchTerm);
			$('[name="searchType"]').val('pagination');

			url.query.offset = offset	;
			window.history.pushState('','',url);

			$('[data-js-search]').submit();
			$('[data-js-advsearch]').submit();

			return false;
		});
	}
};

export { pagination };
