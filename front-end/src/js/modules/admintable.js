// Include routes
import {routes} from './routes/routes';

// Include ui utils
import {utils} from './ui/utils';
import {loaders} from './ui/loaders';

// Include templates
import {templates} from './../templates/templates';

const admintable = {
	selectors: {
		$siteContainer: $('.site-container'),
		editTask: '[data-js-admin-task="edit"]',
		deleteTask: '[data-js-admin-task="delete"]',
		cancelTask: '[data-js-admin-task="cancel"]',
		saveTask: '[data-js-admin-task="save"]',
		deleteConfirmation: templates.nonModels.deleteConfirmation('record'),
		usernameForm: '[data-js-update-user]',
		dbLink: '[data-js-db]',
		addContext: '[data-js-admin-task="create"]',
		dataListEdit: '[data-js="datalistedit"]',
		datajsConnection: '[data-js-connection]',
		$formFields: $('[data-js-connection]').find('input'),
		addClient: '[data-js-addclient]',
		createClientForm: '[data-js-createclient]',
		createContext: '[data-content="create-context"]',
		chooseContext: '[data-content="choose-context"]',
		addContextUser: '[data-js-add-context]',
		addContextUserForm: '[data-js-create-user-context="true"]',
		addUserTrigger: '[data-js-adduser="true"]',
		createUserForm: '[data-js-create-user]',
		formCloseTrigger: '[data-js-close="true"]',
		featuresTrigger: '[data-features]',
		featuresForm: '[data-js-clientfeatures="true"]',
		userTask: '[data-js-user-task="true"]',
		clientFilter: '.client-filter select'
	},
	init() {
		const self = this;

		self.editRoles();
		self.editAccountDetails();
		self.getDBDetails();
		self.addClient();
		self.addContextToClient();
		self.addContextToUser();
		self.addUser();
		self.formClose();
		self.clientFeatures();
		self.changeUserState();
		self.clientFilter();
		self.deleteContext();
	},
	editRoles() {
		const self = this;

		self.selectors.$siteContainer.on('click', self.selectors.editTask, (e) => {
			const $editButton = $(e.currentTarget);
			const $dataUser = $editButton.parents('[data-js-user]');

			$dataUser.addClass('active-edit');

			return false;
		});

		self.selectors.$siteContainer.on('click', self.selectors.cancelTask, (e) => {
			const $cancelButton = $(e.currentTarget);
			const $dataUser = $cancelButton.parents('[data-js-user]');

			$dataUser.removeClass('active-edit');

			return false;
		});

		self.selectors.$siteContainer.on('click', self.selectors.saveTask, (e) => {
			const $saveButton = $(e.currentTarget);
			const $userRecord = $saveButton.parents('[data-js-user]');
			const $roleName = $userRecord.find('.user-roles .role-name');
			const $userForm = $userRecord.find('form');

			loaders.addLoader('.admin-table');

			routes.dynamic(
				$userForm.attr('action'),
				'POST',
				$userForm.serialize(),
                () => {
					const roleName = $userForm.find('option:selected').text();

					// Change text on update
					$userRecord.removeClass('active-edit');
					$roleName.text(roleName);

					// Change class to highlight admin user, or remove it.
					if (roleName.trim() === 'admin') {
						$roleName.addClass('role-admin');
					} else {
						$roleName.removeClass('role-admin');
					}

					loaders.removeLoader();
				}
			);

			return false;
		});

		self.selectors.$siteContainer.on('click', self.selectors.deleteTask, (e) => {
			const $delete = $(e.currentTarget);

			self.selectors.$siteContainer.append(self.selectors.deleteConfirmation);
			$('.confirmation-popup').show();

			// When a button in the confirmation overlay is clicked
			$('body').on('click', '.confirmation-popup .btn', (e) => {
				if ($(e.currentTarget).data('js-delete')) {
					loaders.addLoader('.admin-table');

					routes.delete(
						$delete.data('js-delete-url'),
						{},
						() => {
							// Remove item we've just deleted from view
							$delete.parents('[data-js-user]').remove();
							$('.confirmation-popup').remove();
							loaders.removeLoader();
						}
					);
				} else {
					$('.confirmation-popup').remove();
					return false;
				}
			});

			return false;
		});
	},
	editAccountDetails() {
		const self = this;

		self.selectors.$siteContainer.on('submit', self.selectors.usernameForm, (e) => {
			const $form = $(e.currentTarget);

			loaders.addLoader('.user-settings');

			routes.dynamic(
				$form.attr('action'),
				'PUT',
				$form.serialize(),
                (data) => {
					loaders.removeLoader();

					// Return error message
					if (data.error){
						routes.customFailure(data.error);
					} else {
						routes.customSuccess('Your preferences have been updated!');
					}
				}
			);

			return false;
		});
	},
	getDBDetails() {
		const self = this;

		self.selectors.$siteContainer.on('click', self.selectors.dbLink, (e) => {
			const $getDetails = $(e.currentTarget);
			const $form = $(self.selectors.createContext).find('form');
			const contextId = $getDetails.attr('href').split('/');

			self.formSwitch('update', null, null);

			$('.tab-trigger:eq(0)').click();
			$('.tab-trigger').hide();
			$('.tab-content.active').css({'background':'none'});

			routes.get(
				$getDetails.attr('href'),
                (data) => {
					$('[name="context"]').empty();
					$('[name="contextId"]').remove();

					if (data.database.length > 0) {
						// Replace form action to contain current DB ID
						$form.attr('action', `/datitude-administration/connection/${data.database[0].id}`);

						$.each(data.database[0], (key,value) => {
							for (let i=0;i<self.selectors.$formFields.length;i++) {
								if ($(self.selectors.$formFields[i]).attr('name') === key) {
									$(self.selectors.$formFields[i]).val(value);
								}
							}
						});

						data.contexts.forEach((context) => {
							$('[name="context"]').append(`<option value="${context.id}">${context.context}</option>`);
						});

						$(self.selectors.datajsConnection).find('.btn-danger').show().attr('href',`/context/delete/${data.contexts[0].id}`);
						utils.showForm($(self.selectors.datajsConnection));
					} else {
						// No connection details exist for context
						// Switch form to create view
						$form.attr('action', '/datitude-administration/connection/full/create');
						utils.showForm($(self.selectors.datajsConnection));

						$(self.selectors.$formFields).val('');

						// Add in context ID to create connection against
						$form.append(`<input type="hidden" name="contextId" id="contextId" value="${contextId[contextId.length - 1]}" />`);
					}
				}
			);

			self.selectors.$siteContainer.on('submit', `${self.selectors.createContext} form`, function(){
				const $form = $(this);

				routes.dynamic(
					$form.attr('action'),
					'PUT',
					$form.serialize(),
                    () => {
						self.utils.closeForm(self.selectors.datajsConnection);
						routes.customSuccess('Thanks! We\'ve updated the connection details');
					}
				);
				return false;
			});

			return false;
		});
	},
	addContextToClient: function(){
		const self = this;
		let $addContext;

		// Add new context to client
		self.selectors.$siteContainer.on('click', self.selectors.addContext, function(){
			const $form = $(self.selectors.createContext).find('form');
			const $contextSelect = $('[data-content="choose-context"]').find('select');

			$addContext = $(this);
			$('.tab-trigger').show();
			$('.tab-content.active').css({'background':'#444'});
			$form.find('input[type="text"]').val('');
			$form.find('input[type="password"]').val('');
			$(self.selectors.datajsConnection).find('.btn-danger').hide();
			utils.showForm($(self.selectors.datajsConnection));

			self.formSwitch('create', $addContext.parents('tr').find('td:eq(0)').text(), $addContext.parents('tr').data('id'));

			routes.get(
				'/datitude-administration/manage-contexts',
                (data) => {
					$contextSelect.empty();

					data.data.forEach((context) => {
						$contextSelect.append(`<option value="${context.id}">${context.client}-${context.context}</option>`);
					});
				}
			);

			return false;
		});

		// Submit form to create a new context and add it to a client.
		self.selectors.$siteContainer.on('submit', `${self.selectors.createContext} form`, (e) => {
			routes.dynamic(
				$(e.currentTarget).attr('action'),
				'POST',
				$(e.currentTarget).serialize(),
                (data) => {
					$addContext.parents('[data-js-user]').find('td[data-form-action="edit"]').append(`<a href="/datitude-administration/connection/${data.data.id}" data-js-db="true" data-connection-id="${data.data.id}">${data.data.context}</a><br />`);
					routes.customSuccess('Thanks! We\'ve updated the connection details');
					utils.closeForm($(self.selectors.datajsConnection));
				}
			);

			return false;
		});
	},
	addContextToUser() {
		const self = this;
		const $contextSelect = $('[data-js-create-user-context]').find('select');

		self.selectors.$siteContainer.on('click', self.selectors.addContextUser, (e) => {
			const $contextLink = $(e.currentTarget);

			routes.get(
				'/datitude-administration/contexts',
                (data) => {
					$contextSelect.empty();

					data.contexts.forEach((context) => {
						$contextSelect.append(`<option value="${context.id}">${context.client}-${context.context}</option>`);
					});
				}
			);

			$('[name="userId"]').val($contextLink.parents('tr').data('id'));
			$(self.selectors.addContextUserForm).find('.btn-danger').hide();
			utils.showForm($(self.selectors.addContextUserForm));

			return false;
		});

		self.selectors.$siteContainer.on('submit', `${self.selectors.addContextUserForm} form`, (e) => {
			const $form = $(e.currentTarget);

			routes.dynamic(
				$form.attr('action'),
				'POST',
				$form.serialize(),
                () => {
					document.location = document.location;
					utils.closeForm($(self.selectors.addContextUserForm));
				}
			);

			return false;
		});
	},
	addClient() {
		const self = this;

		self.selectors.$siteContainer.on('click', self.selectors.addClient, (e) => {
			utils.showForm($(self.selectors.createClientForm));
			$(self.selectors.createClientForm).find('.btn-danger').hide();
			return false;
		});

		// Add a new client.
		self.selectors.$siteContainer.on('submit', `${self.selectors.createClientForm} form`, (e) => {
			const $form = $(e.currentTarget);

			routes.dynamic(
				$form.attr('action'),
				'POST',
				$form.serialize(),
                (data) => {
					utils.closeForm('.datalist-edit');

					// Append new client to table
					$('.admin-table tbody').append(`<tr data-js-user="true" data-id="${data.data.id}"><td>${data.data.client}</td><td>${data.data.number_of_users}</td><td data-form-action="edit"></td><td><a href="#" class="icon-link" data-features="" data-client-id="${data.data.id}"><i class="material-icons"></i> FEATURES</a></td><td></td><td><a href="/datitude-administration/client/Datitude" class="btn btn-primary" data-js-admin-task="create">Add Context</a>&nbsp;<button class="btn btn-danger" data-js-admin-task="delete" data-js-delete-url="/datitude-administration/client/delete/${data.data.id}">Delete</button></td></tr>`);
				}
			);

			return false;
		});
	},
	formSwitch(action, client, clientID) {
		const self = this;
		const $form = $(self.selectors.createContext).find('form');

        $('[type="hidden"][name="client"]').remove();
        $('[type="hidden"][name="clientID"]').remove();

		if (action === 'create') {
			// Change select box into normal input
			$('[data-js-create-field]').val('').show();
			$('[data-js-update-field]').hide().attr('disabled','disabled');
			$form.append(`<input type="hidden" name="client" id="client" value="${client}" />`);
			$form.append(`<input type="hidden" name="clientID" id="clientID" value="${clientID}" />`);
			// Change action to create path rather than update path
			$form.attr('action','/datitude-administration/connection/full/create');
		} else {
			// Change select box into normal input
			$('[data-js-create-field]').hide();
			$('[data-js-update-field]').show().removeAttr('disabled');
			// Change action to create path rather than update path
			$form.attr('action', $form.attr('action').replace(/create/g, 'id'));
		}
	},
	addUser() {
		const self = this;

		self.selectors.$siteContainer.on('click', self.selectors.addUserTrigger, () => {
			utils.showForm(self.selectors.createUserForm);
			return false;
		});

		$('[data-js-create-user="true"]').on('click', self.selectors.formCloseTrigger, () => {
			utils.closeForm(self.selectors.createUserForm);
			return false;
		});

		$(document).keyup((e) => {
			if (e.keyCode === 27) {
				utils.closeForm(self.selectors.createUserForm);
			}
		});
	},
	formClose() {
		const self = this;

		self.selectors.$siteContainer.on('click', self.selectors.formCloseTrigger, () => {
			utils.closeForm(self.selectors.dataListEdit);
			return false;
		});

		$(document).keyup((e) => {
			if (e.keyCode === 27) {
				utils.closeForm(self.selectors.dataListEdit);
			}
		});
	},
	clientFeatures() {
		const self = this;

		self.selectors.$siteContainer.on('click', self.selectors.featuresTrigger, (e) => {
			const $trigger = $(e.currentTarget);
			const clientName = $trigger.parents('tr').find('td:first').text();
			const availableArray = $trigger.data('features').toString().split(',');

			// Set client name in popup
			$(self.selectors.featuresForm).find('.client-name').text(clientName);

			// Set client ID into form
			$(self.selectors.featuresForm).find('[name="clientId"]').val($trigger.data('client-id'));

			// Uncheck all features on every load
			$(self.selectors.featuresForm).find('input').prop('checked', false);

			// Find all active features and check them
			for (let i=0; i < availableArray.length; i++) {
				$(self.selectors.featuresForm).find(`input[id="${availableArray[i]}"]`).prop('checked', true);
			}

			// Show form.
			utils.showForm(self.selectors.featuresForm);
			return false;
		});

		self.selectors.$siteContainer.on('submit', self.selectors.featuresForm, (e) => {
			const $form = $(e.currentTarget);
			const sendObject = {
				clientId: $form.find('[name="clientId"]').val(),
				featuresArray: []
			};

			loaders.addLoader(self.selectors.featuresForm);

			for (let i=0; i < $form.find('input[type="checkbox"]').length;i++) {
				const $input = $($form.find('input[type="checkbox"]')[i]);

				if ($input.prop('checked')) {
					sendObject.featuresArray.push($input.attr('id'));
				}
			}

			sendObject.featuresArray = JSON.stringify(sendObject.featuresArray);

			routes.dynamic(
				'/datitude-administration/manage-clients/features',
				'POST',
				sendObject,
                () => {
					loaders.removeLoader();
				}
			);

			return false;
		});
	},
	changeUserState() {
		const self = this;

		self.selectors.$siteContainer.on('click', self.selectors.userTask, (e) => {
			const $trigger = $(e.currentTarget);
			const stateType = $trigger.data('js-admin-task');
			const sendObject = {
				userId: $trigger.parents('tr').data('id'),
				active: stateType === 'activate' ? 'True' : 'False'
			};

			routes.put(
				'/app-settings/user/state/update',
				sendObject,
                () => {
					const currentState = stateType === 'activate' ? 'deactivate' : 'activate';
					const iconClass = stateType === 'activate' ? 'icon-active-user' : 'icon-inactive-user';

					$trigger.data('js-admin-task', currentState);
					$trigger.text(currentState);
					$trigger.parents('tr').toggleClass('inactive-user');
	                $trigger.parents('tr').find('i').removeClass().addClass(iconClass);
				}
			);
		});
	},
	clientFilter() {
		const self = this;

		self.selectors.$siteContainer.on('change', self.selectors.clientFilter, (e) => {
			const selectedClient = $(e.currentTarget).val();

			$('[data-client]').hide();
			$(`[data-client="${selectedClient}"]`).show();

			if (selectedClient === 'All clients') {
				$('[data-client]').show();
			}
		});
	},
	deleteContext() {
		const self = this;

		self.selectors.$siteContainer.on('click', `${self.selectors.createContext} .btn-danger`, (e) => {
			const $trigger = $(e.currentTarget);

			routes.dynamic(
                `/datitude-administration${$trigger.attr('href')}`,
				'DELETE',
				{},
                (data) => {
					$(`[data-connection-id="${data.deleted}"]`).remove();
					utils.closeForm(self.selectors.datajsConnection);
				}
			);

			return false;
		});
	}
};

export { admintable };
