sap.ui.define([
    "./BaseController"
], (BaseController) => {
    "use strict";

    return BaseController.extend("employees.controller.MainView", {
        onInit() {
        },

        onNewEmployee : function () {
            let oRouter = this.getRouter();
            oRouter.navTo("RouteNewEmployee", {});
        },

        onDisplayEmployees : function () {
            let oRouter = this.getRouter();
            //oRouter.navTo("RouteMasterEmployee", {});
            oRouter.navTo("RouteOverviewEmployees", {});
        },

        onSignature : function () {
            //let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            //oRouter.navTo("orders", {});
        }
    });
});