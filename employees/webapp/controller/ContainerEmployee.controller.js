sap.ui.define([
    "./BaseController"

], (BaseController) => {
    "use strict";

    return BaseController.extend("employees.controller.ContainerEmployee", {
        onInit() {
            const oModel = new sap.ui.model.json.JSONModel({layout : "TwoColumnsMidExpanded"});
			this.setModel(oModel, "employeeView");
            // OneColumn
            // TwoColumnsMidExpanded
            //let oRouter = this.getRouter();
            //oRouter.navTo("RouteDetailEmployee", {});
        }
    });
});