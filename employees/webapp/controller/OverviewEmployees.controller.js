sap.ui.define([
    "./BaseController",
    "sap/m/MessageBox",
],

/**
 * 
 * @param {typeof sap.m.MessageBox} MessageBox 
 */

(BaseController, MessageBox) => {
    "use strict";

    return BaseController.extend("employees.controller.OverviewEmployees", {
        onInit : function () {
            this._splitApp = this.byId("splitApp");
          
        },

        /* _bindElement : function (oEvent) {
            console.log("oEvent from _bindElement: ", oEvent);
            console.log("Arguments: ", oEvent.getParameter("arguments"));
        }, */


        onSelectedItem : function (oEvent) {
            const oItem = oEvent.getSource();
            const oContext = oItem.getBindingContext("employees");

            //console.log("context: ", oContext);
            /* console.log("Item: ", oItem);
            console.log("context: ", oContext);
            console.log("Object: ", oContext.getObject());
            console.log("Path: ", oContext.getPath());
            console.log("EmployeeId: ", oContext.getProperty("EmployeeId"));
            console.log("Type: ", oContext.getProperty("Type")); */


            /* let oContext = oEvent.getSource().getBindingContext("employees").getObject();
            let sPath = oEvent.getSource().getBindingContext("employees").getPath();
            let aArgs =  oEvent.getParameter("arguments"); */
            //let oItem =  oEvent.getParameter("listItem");

            /* console.log("Context: ", oContext);
            console.log("Path: ", sPath);
            console.log("Arguments: ", aArgs);
            console.log("List Item: ", oContext.EmployeeId); */

            this.byId("detail").bindElement("employees>" + oContext.getPath());
            this._splitApp.toDetail(this.byId("detail"));
        },

        onBeforeUploadStarts : function (oEvent) {
            const item = oEvent.getParameter("item");
            const sFileName = item.getFileName();
            const context = this.getView().getBindingContext("employees");
            const model = this.getView().getModel("employees");
            const sOrderId = context.getProperty("EmployeeId");
            const sSapId = context.getProperty("SAPId");
        },

        onAfterItemRemoved : function (oEvent) {},

        onUploadCompleted : function (oEvent) {},

        onDeleteEmployee : function (oEvent) {
            let resourceBundle = this.getResourceBundle();
            let contextObject = oEvent.getSource().getBindingContext("employees").getObject();

            MessageBox.confirm(resourceBundle.getText("deleteUserQuestion"), {
                onClose : function (oAction) {
                    if (oAction === MessageBox.Action.OK) {
                        this.getView().getModel("employees").remove("/Users(EmployeeId='"+ contextObject.EmployeeId + "',SapId='"+ this.getOwnerComponent().SapId +"')", {
                            success : function () {
                                sap.m.MessageToast.show(resourceBundle.getText("confirmUserDeletion"));
                                this.byId("lstEmployees").getBinding("items").refresh();
                                this._splitApp.toDetail(this.byId("detailNone"));
                            }.bind(this),
                            error : function (error) {
                                sap.m.MessageToast.show(resourceBundle.getText("userDeletionFailed"));
                            }
                        });
                    }
                }
            });
        },

        onPromoteEmployee : function (oEvent) {}
    });
});