sap.ui.define([
    "./BaseController",
    "sap/m/MessageBox",
    "sap/m/upload/UploadSetItem"
],

/**
 * 
 * @param {typeof sap.m.MessageBox} MessageBox 
 * @param {typeof sap.m.upload.UploadSetItem} UploadSetItem 
 */

(BaseController, MessageBox, UploadSetItem) => {
    "use strict";

    return BaseController.extend("employees.controller.OverviewEmployees", {
        onInit : function () {
            this._splitApp = this.byId("splitApp");

            let oJSONPromotion = new sap.ui.model.json.JSONModel({
                employeeId: "",
                salary: "",
                creationDate: new Date(),
                comments: ""
            });
            this.setModel(oJSONPromotion, "promotion");
        },

        onSelectedItem : function (oEvent) {
            const oItem = oEvent.getSource();
            const oContext = oItem.getBindingContext("employees");

            this.byId("detail").bindElement("employees>" + oContext.getPath());
            this._splitApp.toDetail(this.byId("detail"));

            this._selectEmployeeFiles(oContext.getProperty("EmployeeId"));
        },

        onSearch : function (oEvent) {
            let oSearch = oEvent.getSource();
            let sQuery = oSearch.getValue();
            let aFilter = [];

            if (sQuery) {
                  let filter = new sap.ui.model.Filter({
                    filters: [
                        new sap.ui.model.Filter("FirstName", sap.ui.model.FilterOperator.Contains, sQuery),
                        new sap.ui.model.Filter("LastName", sap.ui.model.FilterOperator.Contains, sQuery),
                        new sap.ui.model.Filter("Dni", sap.ui.model.FilterOperator.Contains, sQuery)
                    ],
                    and: false
                });
                aFilter.push(filter);
            }

            let oList = this.byId("lstEmployees");
            let oBinding = oList.getBinding("items");
            oBinding.filter(aFilter);
        },
// --> Files
        _selectEmployeeFiles : function (employeeId) {
            let oUploadSet = this.byId("uploadSetOverview");
            let sSapId = this.getOwnerComponent().SapId;

            oUploadSet.bindAggregation("items", {
                path: "employees>/Attachments",
                filters: [
                    new sap.ui.model.Filter("SapId", "EQ", sSapId),
                    new sap.ui.model.Filter("EmployeeId", "EQ", employeeId.toString())   
                ],
                template: new UploadSetItem({
                    fileName: "{employees>DocName}",
                    mediaType: "{employees>MimeType}",
                    visibleEdit: false,
                    visibleRemove: true,
                    url: "temp",
                    openPressed: this._downloadFile.bind(this)
                })
            });
        },

        onBeforeUploadStarts : function (oEvent) {
            let item = oEvent.getParameter("item");
            const sFileName = item.getFileName();
            const oContext = item.getBindingContext("employees");
            const sEmployeeId = oContext.getProperty("EmployeeId");
            const sSapId = oContext.getProperty("SapId");
            const sSlug = sSapId + ";" +  sEmployeeId + ";"+ sFileName;     // El orden es de acuerdo al metadata

            let oToken = new sap.ui.core.Item({
                key: "x-csrf-token",
                text: this.getView().getModel("employees").getSecurityToken()
            });
            let oSlug = new sap.ui.core.Item({
                key: "slug",
                text: sSlug
            });

            item.addHeaderField(oSlug);
            item.addHeaderField(oToken);
        },

        /* onItemAdded: function (oEvent) {
            let item = oEvent.getParameter("item");
            const sFileName = item.getFileName();
            const oContext = item.getBindingContext("employees");
            const sEmployeeId = oContext.getProperty("EmployeeId");
            const sSapId = oContext.getProperty("SapId");

            let oToken = new sap.ui.core.Item({
                key: "x-csrf-token",
                text: this.getView().getModel("employees").getSecurityToken()
            });
            let oSlug = new sap.ui.core.Item({
                key: "slug",
                text: sEmployeeId + ";" + sSapId + ";" + sFileName
            });
            //oItem.addHeaderField(oToken).addHeaderField(oSlug);
            //oItem.setVisibleEdit(false);
            item.addHeaderField(oToken);
            item.addHeaderField(oSlug);
        }, */

        onUploadCompleted : function (oEvent) {
            const oUploadSet = oEvent.getSource();
            oUploadSet.getBinding("items").refresh();
        },

        onAfterItemRemoved : function (oEvent) {
            const oItem = oEvent.getParameter("item");
            const oContext = oItem.getBindingContext("employees");
            const sPath = oContext.getPath();

            this.getView().getModel("employees").remove(sPath, {
                success : function () {
                    sap.m.MessageToast.show(this.getResourceBundle().getText("fileDeletionSuccess"));
                }.bind(this),
                error : function () {
                    sap.m.MessageToast.show(this.getResourceBundle().getText("fileDeletionFailed"));
                }.bind(this)
            });
        },

        _downloadFile : function (oEvent) {
            const oItem = oEvent.getSource();
            const oContext = oItem.getBindingContext("employees");
            const sPath = oContext.getPath();
            const sUrl = this.getView().getModel("employees").sServiceUrl + sPath + "/$value";
            oItem.setUrl(sUrl);
        },
// <-- Files
// Delete employee
        onDeleteEmployee : function (oEvent) {
            let resourceBundle = this.getResourceBundle();
            let contextObject = oEvent.getSource().getBindingContext("employees").getObject();
            let that = this;

            MessageBox.confirm(resourceBundle.getText("deleteUserQuestion"), {
                onClose : function (oAction) {
                    if (oAction === MessageBox.Action.OK) {
                        that.getView().getModel("employees").remove("/Users(EmployeeId='"+ contextObject.EmployeeId + "',SapId='"+ that.getOwnerComponent().SapId +"')", {
                            success : function () {
                                sap.m.MessageToast.show(resourceBundle.getText("userrDeletionSucceded"));
                                that.byId("lstEmployees").getBinding("items").refresh();
                                that._splitApp.toDetail(that.byId("detailNone"));
                            }.bind(this),
                            error : function (error) {
                                sap.m.MessageToast.show(resourceBundle.getText("userDeletionFailed"));
                            }
                        });
                    }
                }
            });
        },
// Promote employee
        onPromoteEmployeeOpenDialog : function (oEvent) {
            let oContext = oEvent.getSource().getBindingContext("employees");
            this._employeeId = oContext.getProperty("EmployeeId");

            if (!this._oDialogPromote) {
                this._oDialogPromote = sap.ui.xmlfragment("employees.fragment.PromoteEmployee", this);
                this.getView().addDependent(this._oDialogPromote);
            }
            this._oDialogPromote.bindElement("promotion>/");
            this._oDialogPromote.open();
        },

        onPromoteEmployeeDialogClose : function (oEvent) {
            this._oDialogPromote.close();
        },

        onPromoteEmployee : function (oEvent) {
            let oResourceBundle = this.getResourceBundle();
            let oPromotionContext = oEvent.getSource().getBindingContext("promotion");
            let CreationDate = oPromotionContext.getProperty("/creationDate") ?? null;
            let Amount = oPromotionContext.getProperty("/salary");

            if (Amount && CreationDate) {
                let body = {
                    SapId: this.getOwnerComponent().SapId,
                    EmployeeId: this._employeeId,
                    CreationDate: oPromotionContext.getProperty("/creationDate"),
                    Amount: oPromotionContext.getProperty("/salary").toString(),
                    Waers: "EUR",
                    Comments: oPromotionContext.getProperty("/comments"),
                };

                new Promise((resolve, reject) => {
                    this.getView().getModel("employees").create("/Salaries", body, {
                        success: function (data) {
                            resolve(data);
                        },
                        error: function (e) {
                            reject(e);
                        }
                    });
                }).then(
                    function (data) {
                        oPromotionContext.setProperty("/employeeId", "");
                        oPromotionContext.setProperty("/salary", "");
                        oPromotionContext.setProperty("/creationDate", "");
                        oPromotionContext.setProperty("/comments", "");
                        sap.m.MessageToast.show(oResourceBundle.getText("promoteEmployeeSuccess"));
                    }.bind(this),
                    function (e) {
                        sap.m.MessageToast.show(oResourceBundle.getText("promoteEmployeeFailed"));
                    }.bind(this)
                );
            }
            this._oDialogPromote.close();
        }
    });
});