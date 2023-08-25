sap.ui.define([], function () {
    "use strict";
    return {
        numberSeparator: function (number) {
            return number ? number.toLocaleString('pt-br') : 0;
        },
        localeDate: function (sDate) {
            const date = new Date(sDate);

            // return date ? date.toLocaleDateString('pt-br').substr(0, 10) : "";
            return date ? date.toLocaleDateString('pt-br').substr(0, 10) + " " + date.toLocaleTimeString('pt-br') : "";
        },


    };
});