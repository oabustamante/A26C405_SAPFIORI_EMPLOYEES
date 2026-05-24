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
            oRouter.navTo("RouteOverviewEmployees", {});
        },

        onSignature : function () {
            const signatureUrl = "https://72ecba47trial-dev-a26c405-2-approuter.cfapps.us10-001.hana.ondemand.com";
            window.open(signatureUrl, "_blank");
        }
    });
});