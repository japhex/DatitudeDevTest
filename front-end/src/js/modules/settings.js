const settings = {
	DESC: false,
	init () {
		$('.table th').on('click', (e) => {
			const $this = $(e.target);

			if ($this.data('sort') !== false) {
				// Whenever you click the header, sort the opposite way
				this.DESC = !this.DESC;
				const index = $this.index() + 1;
				const rows = $this.parents('.table').find(`tbody td:nth-of-type(${index})`);

				this.sort(rows, $this);

				$('.table th').removeClass('sorting-desc sorting-asc');

				if (this.DESC) {
					$this.removeClass('sorting-desc');
					$this.addClass('sorting-asc');
				} else {
					$this.removeClass('sorting-asc');
					$this.addClass('sorting-desc');
				}
				$.each(rows, this.rearrange);
			}
		});
	},

	sort (rows, $this) {
		// Sort the array of $ objects using ES6 .sort()
		rows.sort((a, b) => {
			let first;
			let second;

			// For dates or integers
			// (dates/integers need to be declared on the th with a data attr of data-sort="date" or "integer"
			// and on the td with a data attr of data-date or date-integer)
			if ($this.data('sort') === 'date' || $this.data('sort') === 'integer') {
				first = $this.data('sort') === 'date' ? new Date($(a).data('date')) : $(a).data('integer');
				second = $this.data('sort') === 'date' ? new Date($(b).data('date')) : $(b).data('integer');

				if (this.DESC) {
					return first - second;
				} else {
					return second - first;
				}

				// For strings
				// (strings don't need to be declared - they'll be sorted by first letter of first word)
			} else {
				first = $(a).text().toLowerCase();
				second = $(b).text().toLowerCase();

				if (this.DESC) {
					if (first < second) return -1;
					if (first > second) return 1;
					return 0;
				} else {
					if (first > second) return -1;
					if (first < second) return 1;
					return 0;
				}
			}
		});
	},

	rearrange (index, el) {
		$(el).parents('tr').appendTo('.table tbody');
	}
};

export { settings };
