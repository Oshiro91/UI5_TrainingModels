// @ts-ignore
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/UIComponent",
	"sap/m/library",
	'sap/m/MessageBox'
], function (Controller, UIComponent, mobileLibrary, MessageBox) {
	"use strict";

	return Controller.extend("rpgsheet.controller.BaseController", {
		/**
		 * Convenience method for accessing the router.
		 * @public
		 * @returns {sap.ui.core.routing.Router} the router for this component
		 */
		getRouter: function () {
			return UIComponent.getRouterFor(this);
		},

		/**
		 * Convenience method for getting the view model by name.
		 * @public
		 * @param {string} [sName] the model name
		 * @returns {sap.ui.model.Model} the model instance
		 */
		getModel: function (sName) {
			return this.getView().getModel(sName);
		},

		/**
		 * Convenience method for setting the view model.
		 * @public
		 * @param {sap.ui.model.Model} oModel the model instance
		 * @param {string} sName the model name
		 * @returns {sap.ui.mvc.View} the view instance
		 */
		setModel: function (oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		/**
		 * Getter for the resource bundle.
		 * @public
		 * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
		 */
		getResourceBundle: function () {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},

		/**
		 * 
		 * @param {string} template - Tipo de chamada do MII (QueryTemplate, Transaction)
		 * @param {string} query - Caminho da query no MII
		 * @param {string} params - (Parâmetros da Query)
		 * @param {string} action - Se aplicável, acção da query: Select (S) / Insert(I) / Update (U) / Delete (D) / "" (Nenhum)
		 * @returns 
		 */

		onAjaxRequest: function (template, query, params) {
			const queryTemplate = `/XMII/Illuminator?QueryTemplate=${query}&Content-Type=text/json`;
			const trxTemplate = `/XMII/Runner?Transaction=${query}&Content-Type=text/json`;
			const url = template == "QueryTemplate" ? queryTemplate : trxTemplate;
			const errMsgNoData = this.getResourceBundle().getText("errMsgNoData");
			const errGeneric = this.getResourceBundle().getText("errGeneric");
			const promise = new Promise(function (resolve, reject) {

				try {
					
					$.ajax({
						type: "POST",
						url: url,
						data: params ? params : "",
						timeout: 30000
					}).done((response) => {
	
						if (typeof response.Rowsets.Rowset == 'undefined') {
	
							if (typeof response.Rowsets.Messages == 'undefined') {
								reject(errGeneric);
							} else {
	
								if (response.Rowsets.Messages[0].Message == 'Command Query Successful') {
									resolve("Dados Gravados Com Sucesso!");
								} else {
									reject(response.Rowsets.Messages[0]);
								}
							}
	
						} else {
							if (response.Rowsets.Rowset[0].Row) {
	
								resolve(response.Rowsets.Rowset[0].Row);
	
							} else {
								reject(errMsgNoData);
							}
						}
	
					}).fail((jqXHR, textStatus, msg) => {
						reject(msg);
					})
					
				 }
				 catch (err) {
					
					reject( `${errGeneric} - ${err}` );
				 }


			});

			return promise;

		},

		onCheckRequiredInputs: function (inputs, type) {

			let isValid = true;
			let countToFocus = 0

			inputs.forEach(function (input) {
				const sInput = type == 'form' ? input : input.getControl();
				const isComboBox = sInput.getMetadata().getName().toLowerCase().includes("combobox");
				const isSelect = sInput.getMetadata().getName().toLowerCase().includes("select");

				if (isSelect) {
					if (!sInput.getSelectedKey()) {
						sInput.setValueState("Error");
						sInput.setValueStateText("Campo Obrigatório");
						countToFocus += 1;
						countToFocus <= 1 ? sInput.focus() : "";
						isValid = false;

					} else {
						sInput.setValueState("None");
						sInput.setValueStateText("");
					}
				} else {

					if (sInput.getRequired()) {
						if (isComboBox) {

							if (!sInput.getSelectedKey()) {
								sInput.setValueState("Error");
								sInput.setValueStateText("Campo Obrigatório");
								sInput.setValue("");
								countToFocus += 1;
								countToFocus <= 1 ? sInput.focus() : "";

								isValid = false;
							} else {

								sInput.setValueState("None");
							}

						} else {

							if (!sInput.getValue().trim()) {
								sInput.setValueState("Error");
								sInput.setValueStateText("Campo Obrigatório");
								countToFocus += 1;
								countToFocus <= 1 ? sInput.focus() : "";
								isValid = false;
							} else {
								sInput.setValueState("None");
							}
						}
					}

				}
			}.bind(this));

			return isValid;

		},

		/**
		 * 
		 * @param {Boolean} state - true or false to show Busy Indicator 
		 */
		onShowBusyLoading: function (state) {

			state ? sap.ui.core.BusyIndicator.show() : sap.ui.core.BusyIndicator.hide();

		},

		/**
		 * 
		 * @param {Boolean} state - True or false to show busy
		 * @param {Object} obj - Input, table, etc
		 */
		onBusyObjects: function (state, obj) {
			obj.setBusyIndicatorDelay(0);
			obj.setBusy(state)
		},

		/**
		 * 
		 * @param {type} type - Type of message (SUCCESS, ERROR, WARNING)
		 * @param {msg} msg - Message that will be displayed
		 */

		messageBoxFactory: function (type, msg) {

			switch (type.toUpperCase()) {
				case 'SUCCESS':
					MessageBox.success(
						msg, {
							icon: MessageBox.Icon.SUCCESS,
							title: this.getResourceBundle().getText("success"),
							styleClass: "sapUiSizeCompact",
						}
					);

					break;

				case 'ERROR':
					MessageBox.error(
						msg, {
							icon: MessageBox.Icon.ERROR,
							title: this.getResourceBundle().getText("error"),
							styleClass: "sapUiSizeCompact"
						}

					);

					break;
				case 'WARNING':
					MessageBox.error(
						msg, {
							icon: MessageBox.Icon.WARNING,
							title: this.getResourceBundle().getText("warning"),
							styleClass: "sapUiSizeCompact"
						}

					);

					break;

				default:
					break;
			}

		}

	});

});