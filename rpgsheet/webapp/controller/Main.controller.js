sap.ui.define(
    [
        './BaseController',
        'sap/ui/model/json/JSONModel',
        'sap/m/MessageBox',
        'sap/ui/model/Filter',
        'sap/ui/model/FilterOperator',
        'sap/ui/export/Spreadsheet',
        '../model/formatter',
        'sap/ui/core/Fragment',
        "sap/m/MessageToast",
        'sap/ui/model/BindingMode',
        'sap/viz/ui5/data/FlattenedDataset',
        'sap/viz/ui5/format/ChartFormatter',
        'sap/viz/ui5/api/env/Format',
    ],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (BaseController, JSONModel, MessageBox, Filter, FilterOperator, Spreadsheet, formatter, Fragment, MessageToast, BindingMode, FlattenedDataset, ChartFormatter, VizFomatter, Format) {
        "use strict";

        return BaseController.extend("rpgsheet.controller.Main", {
            onInit: function () {
            },

            onGetLocalStorage: function () {
                let badge = localStorage.getItem("badge");
                let gender = localStorage.getItem("gender");
                let name = localStorage.getItem("name");
                let ybirth = localStorage.getItem("ybirth");
                if (!badge) {
                    let people = [];
                } else {
                    badge = JSON.parse(badge);
                    gender = JSON.parse(gender);
                    name = JSON.parse(name);
                    ybirth = JSON.parse(ybirth);
                    let people = [];
                    for (let i = 0; i < badge.length; i++) {
                        let oRow = {
                            badge: `${badge[i]}`,
                            gender: `${gender[i]}`,
                            name: `${name[i]}`,
                            ybirth: `${ybirth[i]}`
                        };
                        people.push(oRow);
                    }
                    this.oModel.setProperty("/people", people);
                }
            },
            
            onCreateEditDialog: function (action, rowSelected, tableSelect) {
                const oModelDialog = new sap.ui.model.json.JSONModel()
                const selectgrid = tableSelect

                // @ts-ignore
                this.oDialog = new sap.ui.xmlfragment(
                    `crud.fragments.NewEditRegister`,
                    this
                )
                this.getView().addDependent(this.oDialog)

                if (action === 'N') {
                    this.oModel.setProperty('/NewOrEdit', 'Novo Cadastro')
                } else {
                    const resourceText = this.getResourceBundle().getText('editRecord').replace('&Person', rowSelected.name)

                    oModelDialog.setData(rowSelected)
                    this.oModel.setProperty('/NewOrEdit', resourceText)
                }

                this.oDialog.setModel(oModelDialog, 'form')
                this.oDialog.open()
            },

            onCancelEdit: function () {
                this.oDialog.close()
            },

            onAfterClose: function () {
                this.oDialog.destroy();
                this.onGetLocalStorage()
            },

            onSave: function () {
                const oData = this.oDialog.oModels.form.oData
                let people = this.oModel.getProperty("/people")
                this.refreshBKP()
                if (this.SaveMode == "N") {
                    people.push(oData)
                } else {
                    people[this.SelectedRow] = oData
                }
                this.oModel.setProperty("/people", people)
                this.oDialog.close()
                this.refreshBKP();
            },

            onDelete: function (oEvent) {
                const rowSelected = this.onSelectRow(oEvent);
                let oPeople = this.oModel.getProperty("/people");
                oPeople.splice(this.SelectedRow, 1);
                this.oModel.setProperty("/people", oPeople);
                this.refreshBKP();
            },

        });
    });
