sap.ui.define([
    "sap/ui/core/format/DateFormat"
], (DateFormat) => {
    "use strict";
    
    return {
        dateValue : function (sDate) {
            if (!sDate) return "";
            //var oInstance = DateFormat.getDateInstance({ pattern: "MMM dd, yyyy" });
            var oInstance = DateFormat.getDateInstance({ pattern: "dd.MM.yyyy" });
            return oInstance.format(new Date(sDate));
        }
    };

});