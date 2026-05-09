sap.ui.define([
  "./BaseController"
], (BaseController) => {
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
      }
  });
});