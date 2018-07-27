// Include routes
import {routes} from './../routes/routes';

// Include ui utils
import {utils} from './../ui/utils';
import {loaders} from './../ui/loaders';

// Include templates
import {templates} from './../../templates/templates';


const extractToolTemplatesGroups = {
	selectors: {
		$siteContainer: $('.site-container'),
		dataAddExtractTemplate: '[data-add-extract-template]',
		dataAddExtractGroup: '[data-add-extract-group]',
		dataEditExtractTemplate: '[data-edit-extract-template]',
		dataEditExtractGroup: '[data-edit-extract-group]',
		dataAddTemplateForm: '[data-js-add-template]',
		dataAddGroupForm: '[data-js-add-group]',
		dataFilterTemplates: '[data-js-filter-templates]',
		unassignedTemplateGroup: '.extract-tool-group--unassigned',
		$pickTemplates: $('[data-js-group-templates] .pick-templates')
	},
	init() {
		const self = this;

		if ($('.app_extract_templates').length > 0) {
			self.createTriggers();
			self.editTriggers();
			self.submitTriggers();
			self.deleteTriggers();
			self.closeTriggers();
		}

		self.filterDropdownTemplates();
		self.showTemplateGroups();
		self.draggableTemplate();
	},
	createTriggers() {
		const self = this;

		self.selectors.$siteContainer.on('click', `${self.selectors.dataAddExtractTemplate}, ${self.selectors.dataAddExtractGroup}`, (e) => {
			const addTemplateForm = $(e.currentTarget).data('add-extract-template');
			const $form = addTemplateForm ? $(`${self.selectors.dataAddTemplateForm} form`) : $(`${self.selectors.dataAddGroupForm} form`);
			const $createForm = addTemplateForm ? $(self.selectors.dataAddTemplateForm) : $(self.selectors.dataAddGroupForm);

			$form.attr('method','POST');
			$form.attr('action', $form.attr('action').replace(/(\/update\/)[^?]+/,'/create'));

			$createForm.addClass('create-mode');
			utils.showForm($createForm);
			return false;
		});
	},
	editTriggers() {
		const self = this;

		// REFACTOR FOR BOTH TO WORK
		self.selectors.$siteContainer.on('click', self.selectors.dataEditExtractTemplate, (e) => {
			const $template = $(e.currentTarget).parents('li');
			const templateId = $template.data('id');
			const templateName = $template.find('.template-name').text();
			const $addForm = $(self.selectors.dataAddTemplateForm).find('form');

			$addForm.attr('action', $addForm.attr('action').replace(/(\/update\/)[^?]+|\/create/,`/update/${templateId}`));
			$addForm.find('.btn-danger').attr('href',$addForm.attr('action').replace('update','delete'));
			$addForm.attr('method','PUT');
			$addForm.find('[name="templateName"]').val(templateName.trim());

			$(self.selectors.dataAddTemplateForm).removeClass('create-mode');
			utils.showForm(self.selectors.dataAddTemplateForm);
			return false;
		});

		self.selectors.$siteContainer.on('click', self.selectors.dataEditExtractGroup, (e) => {
			const $group = $(e.currentTarget).parents('[data-template-group]');
			const groupId = $group.data('id');
			const groupName = $group.find('.group-name').text();
			const $addForm = $(self.selectors.dataAddGroupForm).find('form');

			$addForm.attr('action', $addForm.attr('action').replace(/(\/update\/)[^?]+|\/create/,`/update/${groupId}`));
			$addForm.find('.btn-danger').attr('href',$addForm.attr('action').replace('update','delete'));
			$addForm.attr('method','PUT');
			$addForm.find('[name="groupName"]').val(groupName);

			$(self.selectors.dataAddGroupForm).removeClass('create-mode');
			utils.showForm(self.selectors.dataAddGroupForm);
			return false;
		});
	},
	submitTriggers() {
		const self = this;

		$(`${self.selectors.dataAddTemplateForm} form, ${self.selectors.dataAddGroupForm} form`).on('submit', (e) => {
			const $form = $(e.currentTarget);
			const formMethod = $form.attr('method');
			const addTemplateForm = $form.parents('[data-js-add-template]').data('js-add-template');

			if ($form.parsley().isValid()){
				loaders.addLoader($form);

				routes.dynamic(
					$form.attr('action'),
					formMethod,
					$form.serialize(),
					(data) => {
						if (addTemplateForm) {
							if (formMethod === 'POST') {
								$(self.selectors.unassignedTemplateGroup).find('.extract-tool-group-lists').empty();

								for (let i=0;i < data.results.length;i++) {
									$(self.selectors.unassignedTemplateGroup).find('.extract-tool-group-lists').append(templates['extractToolTemplateAdmin'](data.results[i]));
								}
							} else {
								$('[data-extract-tool-templates], .extract-tool-group-lists').find(`[data-id="${data.result.id}"]`).find('.template-name').text(data.result.templateName);
							}
						} else {
							if (formMethod === 'POST') {
								$('[data-extract-tool-groups]').append(templates['extractToolGroupAdmin'](data.result));
							} else {
								$('[data-extract-tool-groups]').find(`[data-id="${data.result.id}"]`).find('.group-name').text(data.result.name);
							}
						}

						utils.closeForm(addTemplateForm ? self.selectors.dataAddTemplateForm : self.selectors.dataAddGroupForm);
						self.draggableTemplate();
					},
					function(){
						utils.closeForm(self.selectors.dataListEdit);
					}
				);
			}
			return false;
		});
	},
	deleteTriggers() {
		const self = this;

		$(`${self.selectors.dataAddTemplateForm} .btn-danger, ${self.selectors.dataAddGroupForm} .btn-danger`).on('click', (e) => {
			const $deleteButton = $(e.currentTarget);
			const $popup = $deleteButton.parents('.datalist-edit');
			const confirmation = templates.nonModels.deleteConfirmation('record');
			const addTemplateForm = $deleteButton.parents('[data-js-add-template]').data('js-add-template');

			// On delete click, add confirmation overlay
			self.selectors.$siteContainer.append(confirmation);
			$('.confirmation-popup').show();
			$('.confirmation-popup .btn[data-js-delete="true"]').attr('href', $deleteButton.attr('href'));
			$('.confirmation-popup .btn[data-js-delete="true"]').data('form', addTemplateForm ? 'template' : 'group');
			$popup.css({'z-index':'3'});

			return false;
		});
		// When a button in the confirmation overlay is clicked
		$('body').on('click', '.confirmation-popup .btn', (e) => {
			const $deleteButton = $(e.currentTarget);
			const $popup = $deleteButton.parents('.datalist-edit');
			const addTemplateForm = $deleteButton.data('form') === 'template';

			if ($deleteButton.data('js-delete')) {
				routes.delete(
					$deleteButton.attr('href'),
					{},
					(data) => {
						// Remove item we've just deleted from view
						if (addTemplateForm) {
							$('[data-extract-tool-templates], .extract-tool-group-lists').find(`[data-id="${data.deleteId}"]`).remove();
							utils.closeForm(self.selectors.dataAddTemplateForm);
						} else {
							$('[data-extract-tool-groups]').find(`[data-id="${data.deleteId}"]`).remove();
							utils.closeForm(self.selectors.dataAddGroupForm);
						}

						$popup.css({'z-index':'4'});
					},
					() => {
						$popup.css({'z-index':'4'});
						utils.closeForm(self.selectors.dataListEdit);
					}
				);
			} else {
				$popup.css({'z-index':'4'});
			}
			$('.confirmation-popup').remove();
			return false;
		});
	},
	closeTriggers() {
		const self = this;

		$(`${self.selectors.dataAddTemplateForm}, ${self.selectors.dataAddGroupForm}`).find('[data-js-close]').on('click', () => {
			utils.closeForm(self.selectors.dataAddTemplateForm);
			utils.closeForm(self.selectors.dataAddGroupForm);
		});

		// Clearing on keyup of the escape key
		$(document).keyup((e) => {
			if (e.keyCode === 27) {
				utils.closeForm(self.selectors.dataAddTemplateForm);
				utils.closeForm(self.selectors.dataAddGroupForm);
			}
		});
	},
	filterDropdownTemplates() {
		const self = this;

		$(self.selectors.dataFilterTemplates).on('change', (e) => {
			const activeGroup = $(e.currentTarget).val();

			self.selectors.$pickTemplates.find('li').hide();
			self.selectors.$pickTemplates.find(`[data-template-group="${activeGroup}"]`).show();
		});

		$(self.selectors.dataFilterTemplates).change();
	},
	showTemplateGroups(){
		const self = this;

		if ($(self.selectors.dataFilterTemplates).find('option').length === 0) {
			$(self.selectors.dataFilterTemplates).hide();
			self.selectors.$pickTemplates.find('li').show();
		}
	},
	draggableTemplate() {
		const self = this;

        $('.extract-tool-group-lists').sortable({
            connectWith: ['.extract-tool-group-lists'],
            stop: (event,ui) => {
                const templateId = ui.item.data('id');
                const groupId = $(ui.item).parents('[data-template-group]').data('id');

                self.addTemplateToGroup(templateId,groupId);
            }
        });
	},
	addTemplateToGroup(templateId, groupId) {
		const templateObject = {templateGroup:groupId};

		if (groupId === 0) {
			templateObject.templateGroup = null;
		}

		routes.put(
			`/tools/extract-tool/template/update/group/${templateId}`,
			templateObject,
			function(){
			}
		);
	}
};

export { extractToolTemplatesGroups };
