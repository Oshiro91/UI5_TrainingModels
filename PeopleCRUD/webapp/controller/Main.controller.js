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

        return BaseController.extend("crud.controller.Main", {
            onInit: function () {
                if (!this.oModel) {
                    this.oModel = new JSONModel();
                    this.getView().setModel(this.oModel);
                };
                this.oModel.setProperty("/people", []);
                this.oModel.setProperty("/newEnable", false);                
            },

            onGetLocalStorage: function () {
                let badge = localStorage.getItem("badge");
                let gender = localStorage.getItem("gender");
                let name = localStorage.getItem("name");
                let ybirth = localStorage.getItem("ybirth");
                badge = JSON.parse(badge);
                gender = JSON.parse(gender);
                name = JSON.parse(name);
                ybirth = JSON.parse(ybirth);
                let people = [];
                for (let i = 0; i < badge.length; i++) {
                    let oRow = {badge:`${badge[i]}`,
                        gender:`${gender[i]}`,
                        name:`${name[i]}`,
                        ybirth:`${ybirth[i]}`};
                    people.push(oRow);               
                }
                this.oModel.setProperty("/people", people);
            },

            onNew: function (oEvent) {
                let EventId = oEvent.oSource.getId().split("-");
                EventId = EventId[EventId.length - 1];
                EventId = oEvent.oSource.getId().split("_");
                EventId = EventId[EventId.length - 1];
                this.SaveMode = "N"
                this.onCreateEditDialog(this.SaveMode, false, EventId);
                this.oModel.setProperty('/isNew', true);
                

            },

            onEdit: function (oEvent) {
                const rowSelected = this.onSelectRow(oEvent)
                this.SaveMode = "E"
                this.onCreateEditDialog(this.SaveMode, rowSelected);
                this.oModel.setProperty('/isNew', false);
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
                this.oDialog.destroy()
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
                oPeople.splice(this.SelectedRow,1);
                this.oModel.setProperty("/people",oPeople);
                this.refreshBKP();
            },

            onSelectRow: function (oEvent){
                const oTable = this.byId('person_table');
                const index = oEvent.getParameters().row.getIndex();
                const sPath = oTable.getContextByIndex(index).sPath;
                const rowSelected = this.oModel.getProperty(sPath);
                this.SelectedRow = index;
                return rowSelected
            },

            onSearch: function () {
                this.onGetLocalStorage();
                this.oModel.setProperty("/newEnable", true);
            },

            refreshBKP: function () {
                let badge, gender, name, ybirth
                badge=[]
                gender=[]
                name=[]
                ybirth=[]
                const oPeople = this.oModel.getProperty("/people")
                oPeople.forEach(element => {
                    badge.push(element.badge)
                    gender.push(element.gender)
                    name.push(element.name)
                    ybirth.push(element.ybirth)
                });
                badge=JSON.stringify(badge)
                gender=JSON.stringify(gender)
                name=JSON.stringify(name)
                ybirth=JSON.stringify(ybirth)
                localStorage.setItem("badge",badge)
                localStorage.setItem("gender",gender)
                localStorage.setItem("name",name)
                localStorage.setItem("ybirth",ybirth)
            },

            onTest: function (oEvent) {
                const oTable = this.byId("person_table")
                console.log(oTable)
            }

        });
    });
