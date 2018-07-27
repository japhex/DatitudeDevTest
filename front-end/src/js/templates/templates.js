// Include plugins/libraries
import * as moment from './../../vendor/moment/min/moment.min';

const templates = {
	auditHistory(data) {
		return `<tr><td class="user"><strong>${data.user}</strong> - ${data.client}</td><td class="record">${data.recordContent}</td><td class="date"><date>${moment(data.updated_at).format('Do MMM YYYY - HH:mm:ss a')}</date></td></tr>`;
	},
	segmentFrequency(data) {
		return `<tr data-id="${data.id}" data-form-action="edit"><td data-js-field="segment" data-js-datalist="segment" class="segment">${data.segment}</td><td data-js-fieldtype="select" data-js-field="segment_type" data-js-datalist="segment_type" class="segment_type">${data.segment_type}</td><td data-js-field="min_orders" data-js-datalist="min_orders" class="min_orders" data-js-val="minintervalrange">${data.min_orders}</td><td data-js-field="max_orders" data-js-datalist="max_orders" class="max_orders" data-js-val="maxintervalrange">${data.max_orders}</td></tr>`;
	},
	segmentMonetary(data) {
		return `<tr data-id="${data.id}" data-form-action="edit" class="currentEdit"><td data-js-field="segment" data-js-datalist="segment" class="segment">${data.segment}</td><td data-js-fieldtype="select" data-js-field="segment_type" data-js-datalist="segment_type" class="segment_type">${data.segment_type}</td><td data-js-field="min_spend" data-js-datalist="min_spend" class="min_spend" data-js-val="minintervalrange">£${data.min_spend_on_single_order_excl_vat}</td><td data-js-field="max_spend" data-js-datalist="max_spend" class="max_spend" data-js-val="maxintervalrange">£${data.max_spend_on_single_order_excl_vat}</td></tr>`;
	},
	segmentNursery(data) {
		return `<tr data-id="${data.id}" data-form-action="edit"><td data-js-field="segment" data-js-datalist="segment" class="segment">${data.segment}</td><td data-js-fieldtype="select" data-js-field="segment_type" data-js-datalist="segment_type" class="segment_type">${data.segment_type}</td><td data-js-fieldtype="select" data-js-field="interval" data-js-datalist="interval" class="interval">${data.interval}</td><td data-js-field="min_intervals" data-js-datalist="min_intervals" class="min_intervals" data-js-val="minintervalrange">${data.min_intervals_to_first_order}</td><td data-js-field="max_intervals" data-js-datalist="max_intervals" class="max_intervals" data-js-val="maxintervalrange">${data.max_intervals_to_first_order}</td></tr>`;
	},
	segmentRecency(data) {
		return `<tr data-id="${data.id}" data-form-action="edit"><td data-js-field="segment" data-js-datalist="segment" class="segment">${data.segment}</td><td data-js-fieldtype="select" data-js-field="segment_type" data-js-datalist="segment_type" class="segment_type">${data.segment_type}</td><td data-js-fieldtype="select" data-js-field="interval" data-js-datalist="interval" class="interval">${data.interval}</td><td data-js-field="min_intervals" data-js-datalist="min_intervals" class="min_intervals" data-js-val="minintervalrange">${data.min_intervals_to_last_order}</td><td data-js-field="max_intervals" data-js-datalist="max_intervals" class="max_intervals" data-js-val="maxintervalrange">${data.max_intervals_to_last_order}</td></tr>`;
	},
	tradingCalendar(data) {
		return `<tr data-id="${data.id}" data-form-action="edit"><td data-js-field="date" data-js-datalist="date" class="date">${moment(data.date).format('Do MMM YYYY')}</td><td data-js-field="day_name" data-js-datalist="day_name" class="day_name">${data.day_name}</td><td data-js-field="day_number_in_week" data-js-datalist="day_number_in_week" class="day_number_in_week">${data.day_number_in_week}</td><td data-js-field="day_number_in_month" data-js-datalist="day_number_in_month" class="day_number_in_month">${data.day_number_in_month}</td><td data-js-field="day_number_in_year" data-js-datalist="day_number_in_year" class="day_number_in_year">${data.day_number_in_year}</td><td data-js-field="month_number_in_year" data-js-datalist="month_number_in_year" class="month_number_in_year">${data.month_number_in_year}</td><td data-js-field="month_name" data-js-datalist="month_name" class="month_name">${data.month_name}</td><td data-js-field="quarter_in_year" data-js-datalist="quarter_in_year" class="quarter_in_year">${data.quarter_in_year}</td><td data-js-field="year" data-js-datalist="year" class="year">${data.year}</td><td data-js-field="trading_week_number" data-js-datalist="trading_week_number" class="trading_week_number">${data.trading_week_number}</td><td data-js-field="trading_week_name" data-js-datalist="trading_week_name" class="trading_week_name">${data.trading_week_name}</td><td data-js-field="trading_month_number" data-js-datalist="trading_month_number" class="trading_month_number">${data.trading_month_number}</td><td data-js-field="trading_quarter" data-js-datalist="trading_quarter" class="trading_quarter">${data.trading_quarter}</td><td data-js-field="trading_year_number" data-js-datalist="trading_year_number" class="trading_year_number">${data.trading_year_number}</td><td data-js-field="trading_year_name" data-js-datalist="trading_year_name" class="trading_year_name">${data.trading_year_name}</td><td data-js-field="trading_season" data-js-datalist="trading_season" class="trading_season">${data.trading_season}</td><td data-js-field="sale_description" data-js-datalist="sale_description" class="sale_description">${data.sale_description}</td><td data-js-field="custom_event_01" data-js-datalist="custom_event_01" class="custom_event_01">${data.custom_event_01}</td><td data-js-field="custom_event_02" data-js-datalist="custom_event_02" class="custom_event_02">${data.custom_event_02}</td><td data-js-field="custom_event_03" data-js-datalist="custom_event_03" class="custom_event_03">${data.custom_event_03}</td><td data-js-field="file_name" data-js-datalist="file_name" class="file_name">${data.file_name}</td></tr>`;
	},
	suppression(data) {
		return `<tr data-id="${data.id}" data-form-action="edit"><td data-js-field="campaign_id" data-js-datalist="campaign_id" class="campaign_id">${data.campaign_id}</td><td data-js-field="campaign" data-js-datalist="campaign" class="campaign">${data.campaign}</td><td data-js-field="campaign_type" data-js-datalist="campaign_type" class="campaign_type">${data.campaign_type}</td><td data-js-field="source" data-js-datalist="source" class="source">${data.source}</td><td data-js-field="source_type" data-js-datalist="source_type" class="source_type">${data.source_type}</td><td data-js-field="suppression_type" data-js-datalist="suppression_type" class="suppression_type">${data.suppression_type}</td><td data-js-field="customer_id" data-js-datalist="customer_id" class="customer_id">${data.customer_id}</td><td data-js-field="dedupe_key_line_1_postcode_country" data-js-datalist="dedupe_key_line_1_postcode_country" class="dedupe_key_line_1_postcode_country">${data.dedupe_key_line_1_postcode_country}</td><td data-js-field="dedupe_key_line_2_postcode_country" data-js-datalist="dedupe_key_line_2_postcode_country" class="dedupe_key_line_2_postcode_country">${data.dedupe_key_line_2_postcode_country}</td><td data-js-field="dedupe_key_line_1_2_postcode_country" data-js-datalist="dedupe_key_line_1_2_postcode_country" class="dedupe_key_line_1_2_postcode_country">${data.dedupe_key_line_1_2_postcode_country}</td><td data-js-field="dedupe_key_lastname_line_1_2_postcode_country" data-js-datalist="dedupe_key_lastname_line_1_2_postcode_country" class="dedupe_key_lastname_line_1_2_postcode_country">${data.dedupe_key_lastname_line_1_2_postcode_country}</td><td data-js-field="addressee" data-js-datalist="addressee" class="addressee">${data.addressee}</td><td data-js-field="title" data-js-datalist="title" class="title">${data.title}</td><td data-js-field="first_name" data-js-datalist="first_name" class="first_name">${data.first_name}</td><td data-js-field="last_name" data-js-datalist="last_name" class="last_name">${data.last_name}</td><td data-js-field="address_1" data-js-datalist="address_1" class="address_1">${data.address_1}</td><td data-js-field="address_2" data-js-datalist="address_2" class="address_2">${data.address_2}</td><td data-js-field="address_3" data-js-datalist="address_3" class="address_3">${data.address_3}</td><td data-js-field="address_4" data-js-datalist="address_4" class="address_4">${data.address_4}</td><td data-js-field="address_5" data-js-datalist="address_5" class="address_5">${data.address_5}</td><td data-js-field="address_6" data-js-datalist="address_6" class="address_6">${data.address_6}</td><td data-js-field="country" data-js-datalist="country" class="country">${data.country}</td><td data-js-field="country_code" data-js-datalist="country_code" class="country_code">${data.country_code}</td><td data-js-field="postcode" data-js-datalist="postcode" class="postcode">${data.postcode}</td><td data-js-field="email" data-js-datalist="email" class="email">${data.email}</td><td data-js-field="paf_code" data-js-datalist="paf_code" class="paf_code">${data.paf_code}</td><td data-js-field="filename" data-js-datalist="filename" class="filename">${data.filename}</td><td data-js-field="current_flag" data-js-fieldtype="switch" data-js-datalist="current_flag" class="current_flag">${data.current_flag}</td></tr>`;
	},
	exchangeRates(data) {
		return `<tr data-id="${data.id}" data-form-action="edit"><td data-js-field="scope" data-js-datalist="scope" class="scope">${data.scope}</td><td data-js-field="from_currency" data-js-datalist="from_currency" class="from_currency">${data.from_currency}</td><td data-js-field="to_currency" data-js-datalist="to_currency" class="to_currency">${data.to_currency}</td><td data-js-field="exchange_rate" data-js-datalist="exchange_rate" class="exchange_rate">${data.exchange_rate}</td><td data-js-field="dates" data-js-fieldtype="daterange" data-js-datalist="dates" class="dates"><span class="valid-from" data-date="${data.valid_from}">${moment(data.valid_from).format('Do MMM YYYY')}</span> - <span class="valid-to" data-date="${data.valid_to}">${moment(data.valid_to).format('Do MMM YYYY')}</span></td><td data-js-field="current_flag" data-js-fieldtype="switch" data-js-datalist="current_flag" class="current_flag">${data.current_flag}</td></tr>`;
	},
	lookupDataRewrite(data) {
		return `<tr data-id="${data.id}" data-form-action="edit"><td data-js-field="type" data-js-datalist="type" class="type">${data.type}</td><td data-js-field="table_to_rewrite" data-js-datalist="table_to_rewrite" class="table_to_rewrite">${data.table_to_rewrite}</td><td data-js-field="column_to_rewrite" data-js-datalist="column_to_rewrite" class="column_to_rewrite">${data.column_to_rewrite}</td><td data-js-field="rewrite_from" data-js-datalist="rewrite_from" class="rewrite_from">${data.rewrite_from}</td><td data-js-field="rewrite_to" data-js-datalist="rewrite_to" class="rewrite_to">${data.rewrite_to}</td></tr>`;
	},
	storeDetails(data) {
		return `<tr data-id="${data.id}" data-form-action="edit"><td data-js-field="retailer" data-js-datalist="retailer" class="retailer">${data.retailer}</td><td data-js-field="fascia" data-js-datalist="fascia" class="fascia hide-cell">${data.fascia}</td><td data-js-field="store_type" data-js-datalist="store_type" class="store_type">${data.store_type}</td><td data-js-field="store_code" data-js-datalist="store_code" class="store_code">${data.store_code}</td><td data-js-field="store_name" data-js-datalist="store_name" class="store_name">${data.store_name}</td><td data-js-field="outcode" data-js-datalist="outcode" class="outcode hide-cell">${data.outcode}</td><td data-js-field="address" data-js-datalist="address" class="address" data-js-fieldtype="multiple"><span data-js-multifield="address_1">${data.address_1} , <br></span><span data-js-multifield="address_2">${data.address_2} , <br></span><span data-js-multifield="address_3">${data.address_3} , <br></span><span data-js-mutlifield="address_4">${data.address_4}, <br></span><span data-js-multifield="address_5">${data.address_5} , <br></span><span data-js-multifield="address_6">${data.address_6} , <br></span><span data-js-multifield="postcode">${data.postcode}<br></span><span data-js-multifield="country">${data.country}</span></td><td data-js-field="country_code" data-js-datalist="country_code" class="country_code hide-cell">${data.country_code}</td></tr>`;
	},
	customerGroups(data) {
		return `<tr data-id="${data.id}" data-form-action="edit"><td data-js-field="group_type" data-js-datalist="group_type" class="group_type">${data.group_type}</td><td data-js-field="group_name" data-js-datalist="group_name" class="group_name">${data.group_name}</td><td data-js-field="customer_id" data-js-datalist="customer_id" class="customer_id">${data.customer_id}</td></tr>`;
	},
	customerAcquisition(data) {
		return `<tr data-id="${data.id}" data-form-action="edit"><td data-js-field="customer_id" data-js-datalist="customer_id" class="customer_id">${data.customer_id}</td><td data-js-field="order_id" data-js-datalist="order_id" class="order_id">${data.order_id}</td><td data-js-field="first_order_date" data-js-datalist="first_order_date" class="first_order_date">${moment(data.first_order_date).format('Do MMM YYYY')}</td><td data-js-field="online_campaign_that_customer_was_aquired_from" data-js-datalist="online_campaign_that_customer_was_aquired_from" class="online_campaign_that_customer_was_aquired_from">${data.online_campaign_that_customer_was_aquired_from}</td><td data-js-field="online_source_that_customer_was_aquired_from" data-js-datalist="online_source_that_customer_was_aquired_from" class="online_source_that_customer_was_aquired_from">${data.online_source_that_customer_was_aquired_from}</td><td data-js-field="online_medium_that_customer_was_aquired_from" data-js-datalist="online_medium_that_customer_was_aquired_from" class="online_medium_that_customer_was_aquired_from">${data.online_medium_that_customer_was_aquired_from}</td><td data-js-field="offline_campaign_that_customer_was_aquired_from" data-js-datalist="offline_campaign_that_customer_was_aquired_from" class="offline_campaign_that_customer_was_aquired_from">${data.offline_campaign_that_customer_was_acquired_from}</td><td data-js-field="offline_record_source_of_customer" data-js-datalist="offline_record_source_of_customer" class="offline_record_source_of_customer">${data.offline_record_source_of_customer}</td></tr>`;
	},
	mailingCampaigns(data) {
		return `<tr data-id="${data.id}" data-form-action="edit"><td data-js-field="name" data-js-datalist="name" class="name">${data.campaign}</td><td data-js-field="dates" data-js-fieldtype="daterange" data-js-datalist="dates" class="dates"><span class="campaign-from" data-date="${data.analysis_start_date}">${moment(data.analysis_start_date).format('Do MMM YYYY')}</span> - <span class="campaign-to" data-date="${data.analysis_end_date}">${moment(data.analysis_end_date).format('Do MMM YYYY')}</span></td><td data-js-field="runanalysis" data-js-fieldtype="switch" data-js-datalist="analysis" class="datalist-view-runanalysis-${data.run_analysis.toLowerCase()} analysis">${data.run_analysis}</td><td data-js-field="mailingcost" data-js-datalist="cost" class="cost">£${data.overall_mailing_cost}</td><td data-js-field="season" data-js-datalist="season" class="season">${data.season}</td><td data-js-field="format" data-js-datalist="format" class="format">${data.format}</td></tr>`;
	},
	mailingSelectionCriteria(data) {
		return `<tr data-id="${data.id}" data-form-action="edit"><td>${data.campaign_id}</td><td>${data.campaign}</td><td>${data.load_order_for_dedupe}</td><td>${data.campaign_segment}</td><td>${data.source}</td><td>${data.source_segment}</td><td>${data.segmentation_cell}</td><td>${data.active_recency}</td><td>${data.active_frequency}</td><td>${data.active_monetary}</td><td>${data.lifetime_recency}</td><td>${data.lifetime_frequency}</td><td>${data.lifetime_monetary}</td><td>${data.quantity_to_use}</td><td>${data.order_by_criteria_1}</td><td>${data.order_by_criteria_2}</td><td>${data.order_by_criteria_3}</td></tr>`;
	},
	isoCountry(data) {
		return `<tr data-id="${data.id}" data-form-action="edit"><td data-js-field="country_name" data-js-datalist="country_name" class="country_name">${data.country_name}</td><td data-js-field="country_code" data-js-datalist="country_code" class="country_code">${data.country_code}</td><td data-js-field="filename" data-js-datalist="filename" class="filename">${data.filename}</td></tr>`;
	},
	lookupTitleGender(data) {
		return `<tr data-id="${data.id}" data-form-action="edit"><td data-js-field="title" data-js-datalist="title" class="title">${data.title}</td><td data-js-field="gender" data-js-datalist="gender" class="gender">${data.gender}</td></tr>`;
	},
	alertAuditConfiguration(data) {
		return `<tr data-id="${data.id}" data-form-action="edit"><td data-js-field="context" data-js-datalist="context" class="context">${data.context}</td><td data-js-field="alert_main_group" data-js-datalist="alert_main_group" class="alert_main_group">${data.alert_main_group}</td><td data-js-field="alert_group" data-js-datalist="alert_group" class="alert_group">${data.alert_group}</td><td data-js-field="alert_title" data-js-datalist="alert_title" class="alert_title">${data.alert_title}</td><td data-js-field="alert_description" data-js-datalist="alert_description" class="alert_description">${data.alert_description}</td><td data-js-field="alert_query" data-js-datalist="alert_query" class="alert_query">${data.alert_query}</td><td data-js-field="low_result_value" data-js-datalist="low_result_value" class="low_result_value">${data.low_result_value}</td><td data-js-field="high_result_value" data-js-datalist="high_result_value" class="high_result_value">${data.high_result_value}</td></tr>`;
	},
	extractToolTemplates(data) {
		return `<tr data-id="${data.id}" data-form-action="edit" class="currentEdit"><td data-js-field="templateName" data-js-datalist="templateName" class="templateName">${data.templateName}</td><td data-js-field="defaultTemplate" data-js-datalist="defaultTemplate" class="defaultTemplate">${data.defaultTemplate}</td></tr>`;
	},
	talendContextKeyValue(data) {
		return `<tr data-id="${data.id}" data-form-action="edit"><td data-js-field="context" data-js-datalist="context" class="context">${data.context}</td><td data-js-field="key" data-js-datalist="key" class="key">${data.key}</td><td data-js-field="value" data-js-datalist="value" class="value">${data.value}</td></tr>`;
	},
	repTransactionsFilters(data) {
		return `<tr data-id="${data.id}" data-form-action="edit"><td data-js-field="filter_group" data-js-datalist="filter_group" class="filter_group">${data.filter_group}</td><td data-js-field="filter_name" data-js-datalist="filter_name" class="filter_name">${data.filter_name}</td><td data-js-field="filter_type" data-js-datalist="filter_type" class="filter_type">${data.filter_type}</td><td data-js-field="filter_order" data-js-datalist="filter_order" class="filter_order">${data.filter_order}</td><td data-js-field="filter_tooltip" data-js-datalist="filter_tooltip" class="filter_tooltip">${data.filter_tooltip}</td><td data-js-field="column_to_filter" data-js-datalist="column_to_filter" class="column_to_filter">${data.column_to_filter}</td><td data-js-field="filter" data-js-datalist="filter" class="filter">${data.filter}</td></tr>`;
	},
	segmentData(data) {
		return `<tr data-id="${data.id}"><td data-js-field="campaign_segment" data-js-datalist="campaign_segment" class="campaign_segment">${data.campaign_segment}</td><td data-js-field="load_order_for_dedupe" data-js-datalist="load_order_for_dedupe" class="load_order_for_dedupe">${data.load_order_for_dedupe}</td><td data-js-field="load_type" data-js-datalist="load_type" class="load_type">${data.load_type}</td><td data-js-field="volume_estimate" data-js-datalist="volume_estimate" class="volume_estimate">${data.volume_estimate}</td><td data-js-field="volume_available" data-js-datalist="volume_available" class="volume_available">${data.volume_available}</td></tr>`;
	},
	extractGroups(data) {
		return `<div data-id="${data.id}" data-form-action="edit"><span data-js-field="groupName" data-js-datalist="groupName" class="groupName">${data.name}</span><ul class="extract-tool-group-lists ui-sortable"><!-- Droppable area --></ul></div>`;
	},
	appFeatures(data) {
		return `<tr data-id="${data.id}" data-form-action="edit"><td data-js-field="feature_name" data-js-datalist="feature_name" class="feature_name">${data.feature_name}</td><td data-js-field="section" data-js-datalist="section" class="section">${data.section}</td><td data-js-field="sub_section" data-js-datalist="sub_section" class="sub_section">${data.sub_section}</td><td data-js-field="icon" data-js-datalist="icon" class="icon">${data.icon}</td><td data-js-field="url" data-js-datalist="url" class="url">${data.url}</td><td data-js-field="tooltip" data-js-datalist="tooltip" class="tooltip">${data.tooltip}</td><td data-js-field="results_limit" data-js-datalist="results_limit" class="results_limit">${data.results_limit}</td><td data-js-field="order_column" data-js-datalist="order_column" class="order_column">${data.order_column}</td><td data-js-field="order_direction" data-js-datalist="order_direction" class="order_direction">${data.order_direction}</td><td data-js-field="reference_table" data-js-datalist="reference_table" class="reference_table">${data.reference_table}</td></tr>`;
	},
	extractToolTemplateAdmin(data) {
		return `<li data-id="${data.id}"><p><span data-js-field="templateName" data-js-datalist="templateName" class="template-name">${data.templateName}</span></p><div class="template-actions"><a href="#" data-edit-extract-template>Edit</a></div></li>`;
	},
	extractToolGroupAdmin(data) {
        return `<div data-id="${data.id}" data-template-group class="extract-tool-group"><span data-js-field="groupName" data-js-datalist="groupName" class="group-name">${data.name}</span><div class="template-actions"><a href="#" data-edit-extract-group><i class="material-icons">&#xE3C9;</i></a></div><ul class="extract-tool-group-lists"></ul></div>`;
	},
	addQueryTemplate(campaignQueryId, campaignId, segmentId) {
		return `
			<tr data-id="${campaignQueryId}">
				<td data-js-field="volume_available" data-js-datalist="volume_available" class="volume_available">0</td>
				<td>
					<a href="/tools/segment-query-selector?campaignId=${campaignId}&amp;segmentId=${segmentId}&amp;segmentQueryId=${campaignQueryId}" class="badge badge-primary">Segment Query Selector &gt;</a>
					<a href="/campaign-management/campaigns/queries/delete/${campaignQueryId}" class="badge badge-delete" data-js-delete-segment-query>Delete</a>
				</td>
			</tr>		
		`;
	},
	addQueryFullTemplate(campaignQueryId, campaignId, segmentId) {
		return `
			<div class="datalist-viewport">
				<div class="container">
					<div class="datalist datalist--fixed-header" data-js="datalist">
						<div class="datalist-data">
							<div id="constrainer">
							    <div class="scrolltable">
									<table class="datalist-view header">
										<thead class="no-tooltips">
											<tr>
												<th data-js-datalist="volume_available" data-sort="volume_available">Volume Available</th>
												<th data-js-datalist="volume_deduped" data-sort="volume_deduped">Volume Deduped</th>
												<th data-js-datalist="volume_selected" data-sort="volume_selected">Volume Selected</th>
												<th>Edit Query</th>
											</tr>
										</thead>
									</table>
									<div class="body">
										<table class="datalist-view sortable" data-js="datalistview">
											<tbody class="list">
												<tr data-id="${campaignQueryId}">
													<td data-js-field="volume_available" data-js-datalist="volume_available" class="volume_available">0</td>
													<td data-js-field="volume_deduped" data-js-datalist="volume_deduped" class="volume_deduped">0</td>
													<td data-js-field="volume_selected" data-js-datalist="volume_selected" class="volume_selected">0</td>
													<td>
														<a href="/tools/segment-query-selector?campaignId=${campaignId}&amp;segmentId=${segmentId}&amp;segmentQueryId=${campaignQueryId}" class="badge badge-primary">Segment Query Selector &gt;</a>
														<a href="/campaign-management/campaigns/queries/delete/${campaignQueryId}" class="badge badge-delete" data-js-delete-segment-query>Delete</a>
													</td>
												</tr>
											</tbody>
										</table>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>		
		`;
	},
	emptyQueryTemplate() {
		return `
			<div class="datalist-viewport">
				<div class="container">
					<div class="datalist datalist--fixed-header" data-js="datalist">
						<div class="datalist-data">
							<div class="lead empty-table">
								No records to show.
							</div>
						</div>
					</div>
				</div>
			</div>		
		`;
	},
	nonModels: {
		sortAndSearch(headerText) {
			return `<div class="sort-and-search form-element"><i data-js-close="true" class="oi oi-x"></i><h5>${headerText}</h5><form action="pass-on"><input name="search" class="pop-over" /><button class="btn btn-primary">Search</button></form><div class="sorting">Sort: <a href="#" data-js-sort="asc">Asc <i class="material-icons">&#xE313;</i></a> or <a href="#" data-js-sort="desc">Desc <i class="material-icons">&#xE316;</i></a></div></div>`;
		},
		storedFilter(activeFilter, activeValue) {
			return `<div class="active-filter"><h5><span>${activeFilter.replace(/_/g,' ')}</span>: <a href="#">${activeValue} <i data-js-close="true" class="oi oi-x"></i></a></h5></div>`;
		},
		deleteConfirmation(item) {
			return `<div class="confirmation-popup"><p>Are you sure you want to delete this ${item}?</p><div class="confirmation-popup-buttons"><a href="#" class="btn btn-secondary" data-js-delete="true">Yes</a><a href="#" class="btn btn-secondary" data-js-delete="false">No</a></div></div>`;
		},
		saveQueryConfirmation(item) {
			return `<div class="confirmation-popup"><p>Save this query against: <strong>${item}?</strong></p><div class="confirmation-popup-buttons"><a href="#" class="btn btn-secondary" data-js-save="true">Save</a><a href="#" class="btn btn-secondary" data-js-save="false">Cancel</a></div></div>`;
		},
        dataTypeChooser() {
            return `<div class="data-type form-centered-control well"><i data-js-close-sub="true" class="oi oi-x"></i><p>Which data type would you like?</p><div class="form-element choose-resultset"><select name="dataOutput" id="dataOutput"><option value="filtered">Filtered Results</option><option value="full">Full Table</option></select></div><div class="confirmation-popup-buttons"><a href="#" class="btn btn-secondary" data-js-delete="true">Download</a></div></div>`;
        },
		fileUploadConfirmation() {
			return `<div class="form-centered-control well upload-confirmation"><i data-js-close-sub="true" class="oi oi-x"></i><p>WARNING: By doing this you are overwriting all data.<div class="confirmation-popup-buttons"><a href="#" class="btn btn-danger" data-js-delete="true">Continue</a></div></div>`;
		},
		auditHistoryWarning() {
			return `<div class="form-centered-control well audit-confirmation"><i data-js-close-sub="true" class="oi oi-x"></i><p>WARNING: You are about to revert this change, are you sure?<div class="confirmation-popup-buttons"><a href="#" class="btn btn-danger" data-js-commit="true">Continue</a></div></div>`;
		},
        dataTypeChooserExtractTool() {
            return `<div class="data-type form-centered-control well"><i data-js-close-sub="true" class="oi oi-x"></i><p>Which data type would you like?</p><div class="form-element half-width"><label for="dataTypeCsv">CSV</label><input type="radio" name="format" value="csv" id="csv" checked="checked" /></div><div class="form-element half-width"><label for="dataTypeXlsx">XLSX</label><input type="radio" name="format" value="xlsx" id="xlsx" /></div><div class="confirmation-popup-buttons"><a href="#" class="btn btn-secondary" data-js-delete="true" data-test-extract-tool="download-data">Download</a></div></div>`;
        }
	},
	socketMessaging: {
		genericSuccess(object) {
			return object !== undefined ? $(`<div class="success-text"><div class="container"><h2><i class="material-icons">&#xE876;</i></h2><p>Thanks...Your ${object} preferences have been updated</p></div></div>`) : $(`<div class="success-text"><div class="container"><h2><i class="material-icons">&#xE876;</i></h2><h3>Thanks!</h3><p>Your preferences have been updated</p></div></div>`);
		},
		genericFailure(object) {
			return object !== undefined ? $(`<div class="request-errors"><div class="container"><h2><i class="material-icons">&#xE002;</i></h2><p>Oops...Sorry, there seems to have been an error whilst updating your ${object} preferences.</p></div></div>`) : $(`<div class="request-errors"><div class="container"><h2><i class="material-icons">&#xE002;</i></h2><h3>Oops!</h3><p>Sorry, there seems to have been an error.</p></div></div>`);
		},
		customSuccess(object) {
			return object !== undefined ? $(`<div class="success-text"><div class="container"><h2><i class="material-icons">&#xE876;</i></h2><p>${object}</p></div></div>`) : $(`<div class="success-text"><div class="container"><h2><i class="material-icons">&#xE876;</i></h2><h3>Thanks!</h3><p>Your preferences have been updated</p></div></div>`);
		},
		customFailure(object) {
			return object !== undefined ? $(`<div class="request-errors"><div class="container"><h2><i class="material-icons">&#xE002;</i></h2><p>${object}</p></div></div>`) : $(`<div class="request-errors"><div class="container"><h2><i class="material-icons">&#xE002;</i></h2><h3>Oops!</h3><p>Sorry, there seems to have been an error.</p></div></div>`);
		},
		customSocketNotification(object) {
			return $(`<div class="notification">
						<div class="title-bar">
							<i class="material-icons">&#xE000;</i>
							<span>File processed notification</span>
							<span data-js-close="true" class="oi oi-x"></span>
						</div>
						<div class="container">
							<p class="content">
								Your file <strong>${object.name}</strong> has been successfully processed.
							</p>
						</div>
					</div>`);
		},
		customSocketExtractRequestedNotification(object) {
			return $(`<div class="notification">
						<div class="title-bar">
							<i class="material-icons">&#xE000;</i>
							<span>Extract tool notification</span>
							<span data-js-close="true" class="oi oi-x"></span>
						</div>
						<div class="container">
							<p class="content">
								${object}
							</p>
						</div>
					</div>`);
		},
		customSocketDataExtractRequestedNotification(object) {
			return $(`<div class="notification">
						<div class="title-bar">
							<i class="material-icons">&#xE000;</i>
							<span>Data extract notification</span>
							<span data-js-close="true" class="oi oi-x"></span>
						</div>
						<div class="container">
							<p class="content">
								${object}
							</p>
						</div>
					</div>`);
		},
		customSocketExtractReceivedNotification(object, objectBody) {
			return $(`<div class="notification notification--success" data-id="${object.id}" data-resolve-notification>
						<div class="title-bar">
							<i class="material-icons">&#xE000;</i>
							<span>Extract tool notification</span>
							<span data-js-close="true" class="oi oi-x"></span>
						</div>
						<div class="container">
							<p class="content">
								Hey <strong>${objectBody.requester}! Your file, ${objectBody.name}</strong> is ready to be downloaded. Please <a href="${objectBody.ftpServer}${objectBody.location}/${objectBody.name}">click here</a> to download your file.
							</p>
						</div>
					</div>`);
		},
		customSocketFileReceivedNotification(object, objectBody) {
			return $(`<div class="notification notification--success" data-id="${object.id}" data-resolve-notification>
						<div class="title-bar">
							<i class="material-icons">&#xE000;</i>
							<span>File upload notification</span>
							<span data-js-close="true" class="oi oi-x"></span>
						</div>
						<div class="container">
							<p class="content">
								Hey <strong>${objectBody.requester}! Your file, ${objectBody.name}</strong> has been uploaded and processed.
							</p>
						</div>
					</div>`);
		}
	}
};

export { templates };
