// Include ui utils
import {utils} from './modules/ui/utils';
import {tabs} from './modules/ui/tabs';
import {filters} from './modules/ui/filters';

// Include modules
import {datalist} from './modules/datalist';
import {authentication} from './modules/authentication';
import {validation} from './modules/validation';
import {segmentQuerySelector} from './modules/segmentQuerySelector';
import {settings} from './modules/settings';
import {ftpTool} from './modules/ftpTool';
import {admintable} from './modules/admintable';
import {auditLog} from './modules/auditlog';
import {campaigns} from './modules/campaign-management/campaigns/base';
import {associations} from './modules/campaign-management/campaigns/associations';

//------------------------------------------

//import * as socketIo from 'https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.0.1/socket.io';

//------------------------------------------

import {socketIoNotifications} from './modules/socketNotifications';
import {mailingRecords} from './modules/campaign-management/mailingRecords';
import {catalogueRequestors} from './modules/campaign-management/catalogueRequestors';
import {usersUtils} from './modules/users/utils';
import {notifications} from './modules/notifications';

// Include extract tool modules
import {extractToolData} from './modules/extract-tool/data';
import {extractToolFilters} from './modules/extract-tool/filters';
import {extractToolTool} from './modules/extract-tool/tool';
import {extractToolWizard} from './modules/extract-tool/wizard';
import {extractToolConfiguration} from './modules/extract-tool/configuration';
import {extractToolTemplatesGroups} from './modules/extract-tool/templates-groups';
import {extractTemplates} from './modules/extractTemplates';
import {extractToolUtils} from './modules/extract-tool/utils/utils';

if ($('.filter-bar').length > 0) {
	filters.init();
}

// If datalist exists on screen, initialise datalist JS.
if (($('.datalist-viewport').length > 0 || $('.extract-tool-configuration').length > 0) && $('.extract-tool-templates').length === 0) {
	datalist.init();
}

// If extract filter exists on screen, initialise extract filter JS.
if ($('.extract-filter').length > 0 || $('.extract-tool-configuration').length > 0) {
	extractToolData.init();
	extractToolFilters.init();
	extractToolTool.init();
	extractToolWizard.init();
	extractToolConfiguration.init();
	extractTemplates.init();
	extractToolTemplatesGroups.init();
	extractToolUtils.fixedToolbar();
}

// If extract template/group admin screen.
if ($('.app_extract_templates').length > 0) {
	extractToolTemplatesGroups.init();
}

// If extract filter exists on screen, initialise extract filter JS.
if ($('.ftp-tool').length > 0 || $('.ftp-upload').length > 0) {
	ftpTool.init();
}

// If there is an admin table on the page, initialise admin table JS.
if ($('.admin-table').length > 0) {
	admintable.init();
	settings.init();
}

// If there are forms on the page, initialise validation
if ($('form').length > 0) {
	validation.init();
}

// If mailing campaign suppression search.
if ($('.search-and-suppress-mailing-records').length > 0) {
	mailingRecords.init();
	utils.countryLookup();
	utils.reasonsLookup();
	utils.campaignLookup();
}

if ($('.search-customers-and-prospects').length > 0) {
	utils.countryLookup();
}

// If mailing catalogue requestors
if ($('.ref_mailing_cat_requestors').length > 0) {
	catalogueRequestors.init();
	utils.postcodeLookup();
	utils.countryLookup();
}

// If forgotten password
if ($('.forgotten-password').length > 0) {
	usersUtils.checkEmail();
}

if ($('.ref_campaigns').length > 0) {
	campaigns.init();
	associations.init();
}

if ($('.segment-query-selector').length > 0) {
	segmentQuerySelector.init();
}

// Generic utils functions that will always run, dataToggle to
// bind globally and randomBackground where needed.
authentication.init();
utils.navScroll();
utils.tooltips();
utils.dataToggle();
tabs.bindTabs();
utils.messaging();
utils.randomBackground();
socketIoNotifications.init();
notifications.init();
auditLog.init();
