sap.ui.define([
  "sap/ui/core/mvc/Control"
], (Control) => {
  "use strict";

    return Control.extend("employees.controller.Signature", {
        metadata: {
            properties: {
                "width" : {
                    type : "sap.ui.core.CSSSize",
                    defaultValue: "400px"
                },
                "height" : {
                    type : "sap.ui.core.CSSSize",
                    defaultValue: "100px"
                },
                "bgcolor" : {
                    type : "sap.ui.core.CSSColor",
                    defaultValue: "white"
                }
            }
        },

        onInit : function () {
        },

        renderer : function (oRM, oControl) {
            oRM.write("<div");
            oRM.addStyle("width", oControl.getProperty("width"));
            oRM.addStyle("height", oControl.getProperty("height"));
            oRM.addStyle("background-color", oControl.getProperty("height"));
            oRM.addStyle("border", "1px solid black");
            oRM.writeStylesS();
            oRM.write(">");
            oRM.write("<canvas width='" + oControl.getProperty("width") + "' height='" + oControl.getProperty("height") + "'");
            oRM.write("></canvas>");
            oRM.write("</div>");
        },

        onAfterRendering : function () {
            let canvas = document.querySelector("canvas");

            try {
                this.signaturePad = new SignaturePad(canvas);
            } catch (e) {
                console.error(e);
            }
        },

        clear : function () {
            this.signaturePad.clear();
        }

    });
});