sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/UIComponent",
	"sap/ui/core/routing/History",
], (Controller, UIComponent, History) => {
	"use strict";

    return Controller.extend("employees.controller.BaseController", {

        /**
		 * Convenience method for accessing the router.
		 * @public
		 * @returns {sap.ui.core.routing.Router} the router for this component
		 */
		getRouter : function () {
			return UIComponent.getRouterFor(this);
			//return this.getOwnerComponent.getRouter();
		},

        /**
		 * Convenience method for getting the view model by name.
		 * @public
		 * @param {string} [sModelName] the model name
		 * @returns {sap.ui.model.Model} the model instance
		 */
		getModel : function (sModelName) {
			return this.getView().getModel(sModelName);
		},

        /**
		 * Convenience method for setting the view model.
		 * @public
		 * @param {sap.ui.model.Model} oModel the model instance
		 * @param {string} sName the model name
		 * @returns {sap.ui.mvc.View} the view instance
		 */
		setModel : function (oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		getResourceBundle : function () {
			let resourceBundle = this.getOwnerComponent().getModel("i18n");
			return resourceBundle.getResourceBundle();
		},

        /**
		 * Convenience method history
		 */
        onNavBack : function () {
			var oHistory, sPreviousHash;

			oHistory = History.getInstance();
			sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				this.getRouter().navTo("tiles", {}, true /*no history*/);
			}
		}
    });
});