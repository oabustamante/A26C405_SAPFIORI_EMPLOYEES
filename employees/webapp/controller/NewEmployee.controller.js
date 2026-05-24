sap.ui.define([
    "./BaseController",
    "sap/m/MessageBox",
    "employees/model/formatter"
],
/**
 * 
 * @param (typeof sap.m.MessageBox) MessageBox 
 * @param (typeof sap.m.plugins.UploadSetwithTable) UploadSetwithTable 
 */
(BaseController, MessageBox, Formatter) => {
    "use strict";

    return BaseController.extend("employees.controller.NewEmployee", {

        formatter: Formatter,

        onInit : function () {
            let oRouter = this.getRouter();
			oRouter.getRoute("RouteNewEmployee").attachMatched(this._onRouteMatched, this);
        },

        _onRouteMatched : function () {
            this._oNavContainer = this.byId("navContainer");
            this._oWizardContentPage = this.byId("dynPagNewEmployee");
            this._oWizard = this.byId("newEmployeeWizard");
            this._oSlider = this.byId("sliderSalary");

            this._oEmployee = {
                Type: null,             // {0: Internal, 1: Autonomous, 2: Manager}
                SapId: null,            // email SAP BTP account
                FirstName: null,
                LastName: null,
                Dni: null,
                CreationDate: null,
                Comments: null,
                UserToSalary: {
                    Amount: null,       // Daily Wage or Annual Salary
                    Comments: null,
                    Waers: "EUR"
                }
            };
            let oModel = new sap.ui.model.json.JSONModel(this._oEmployee);
            this.setModel(oModel);

            let oValidation = new sap.ui.model.json.JSONModel({
                FirstNameState: "None",
                LastNameState: "None",
                DniState: "None",
                CreationDateState: "None"
            });
            this.setModel(oValidation, "validation");

            let oSalaryRanges = {
                Autonomous: [100, 2000, 0],
                Internal: [12000, 80000, 0],
                Manager: [50000, 200000, 0]
            };
            oSalaryRanges.Autonomous[2] =  (oSalaryRanges.Autonomous[1] -  oSalaryRanges.Autonomous[0])/10;
            oSalaryRanges.Internal[2] =  (oSalaryRanges.Internal[1] -  oSalaryRanges.Internal[0])/10;
            oSalaryRanges.Manager[2] =  (oSalaryRanges.Manager[1] -  oSalaryRanges.Manager[0])/10;
            let oModelSalaryRanges = new sap.ui.model.json.JSONModel(oSalaryRanges);
            this.setModel(oModelSalaryRanges, "salaryRanges");
        },
// >> Employee type selection
        onInternalEmployee : function () {
            this._iSelectedStepIndex = this._oWizard.getSteps().indexOf(this._oSelectedStep);
            let oNextStep = this._oWizard.getSteps()[this._iSelectedStepIndex + 1];

            if (this._oSelectedStep && !this._oSelectedStep.bLast) {
                this._oWizard.goToStep(oNextStep, true);
            } else {
                this._oWizard.nextStep();
            }
            this._iSelectedStepIndex ++;
            this._oSelectedStep = oNextStep;

            let oModel = this.getModel();
            oModel.setProperty("/Type", 0);
            oModel.refresh();
        },

        onAutonomousEmployee : function () {
            this._iSelectedStepIndex = this._oWizard.getSteps().indexOf(this._oSelectedStep);
            let oNextStep = this._oWizard.getSteps()[this._iSelectedStepIndex + 1];

            if (this._oSelectedStep && !this._oSelectedStep.bLast) {
                this._oWizard.goToStep(oNextStep, true);
            } else {
                this._oWizard.nextStep();
            }
            this._iSelectedStepIndex ++;
            this._oSelectedStep = oNextStep;

            let oModel = this.getModel();
            oModel.setProperty("/Type", 1);
            oModel.refresh();
        },

        onManagerEmployee : function () {
            this._iSelectedStepIndex = this._oWizard.getSteps().indexOf(this._oSelectedStep);
            let oNextStep = this._oWizard.getSteps()[this._iSelectedStepIndex + 1];

            if (this._oSelectedStep && !this._oSelectedStep.bLast) {
                this._oWizard.goToStep(oNextStep, true);
            } else {
                this._oWizard.nextStep();
            }
            this._iSelectedStepIndex ++;
            this._oSelectedStep = oNextStep;

            let oModel = this.getModel();
            oModel.setProperty("/Type", 2);
            oModel.refresh();
        },
// << Employee type selection
// Dni validation
        _validateDni : function (sDni) {
            let dni = sDni,
                number, letter, letterList;
            let regularExp = /^\d{8}[a-zA-Z]$/;
            // Se comprueba que el formato es válido
            if (regularExp.test(dni) === true) {
                // Número
                number = dni.substr(0, dni.length - 1);
                // Letra
                letter = dni.substr(dni.length - 1, 1);
                number = number % 23;
                letterList = "TRWAGMYFPDXBNJZSQVHLCKET";
                letterList = letterList.substring(number, number + 1);
                if (letterList !== letter.toUpperCase()) {
                    return "Error";
                } else {
                    return "None";
                }
            } else {
                return "Error";
            }
        },
// >> Step 2 Validate mandatory fields
        validateStep2Info : function () {
            let oModel = this.getModel(), errorFlag = 0;
            let iFirstName = this.byId("firstName").getValue(),
                iLastName = this.byId("lastName").getValue(),
                iDni = this.byId("dni").getValue(),
                EmployeeType = oModel.getProperty("/Type");
            let oValidation = this.getModel("validation");
            let oCreationDate = this.byId("creationDate").getDateValue();

            if (iFirstName.length > 1) {
                oValidation.setProperty("/FirstNameState", "None");
            } else {
                oValidation.setProperty("/FirstNameState", "Error");
                errorFlag = 1;
            }

            if (iLastName.length > 1) {
                oValidation.setProperty("/LastNameState", "None");
            } else {
                oValidation.setProperty("/LastNameState", "Error");
                errorFlag = 1;
            }

            if (oCreationDate) {
                if (!isNaN(oCreationDate)) {
                    oValidation.setProperty("/CreationDateState", "None");
                } else {
                    oValidation.setProperty("/CreationDateState", "Error");
                    errorFlag = 1;
                }
            } else {
                oValidation.setProperty("/CreationDateState", "Error");
                errorFlag = 1;
            }

            if (iDni.length > 1) {
                let sResult = this._validateDni(iDni);
                if (sResult === "None") {
                    oValidation.setProperty("/DniState", "None");
                } else {
                    errorFlag = 1;
                    oValidation.setProperty("/DniState", "Error");
                }
            } else {
                oValidation.setProperty("/DniState", "Error");
                errorFlag = 1;
            }

            if (errorFlag > 0) {
                this._oWizard.setCurrentStep(this.byId("wsNewEmployeeStep2"));
                this._oWizard.invalidateStep(this.byId("wsNewEmployeeStep2"));
            } else {
                this._oWizard.validateStep(this.byId("wsNewEmployeeStep2"));
            }
        },

        changeFirstName : function (oEvent) {
            let oModel = this.getModel("validation");
            let sValue = oEvent.getSource().getValue();

            if (sValue.length > 0) {
                oModel.setProperty("/FirstNameState", "None");
            } else {
                this._oWizard.setCurrentStep(this.byId("wsNewEmployeeStep2"));
                oModel.setProperty("/FirstNameState", "Error");
            }
            oModel.refresh();
        },

        changeLastName : function (oEvent) {
            let oModel = this.getModel("validation");
            let sValue = oEvent.getSource().getValue();

            if (sValue.length > 0) {
                oModel.setProperty("/LastNameState", "None");
            } else {
                this._oWizard.setCurrentStep(this.byId("wsNewEmployeeStep2"));
                oModel.setProperty("/LastNameState", "Error");
            }
            oModel.refresh();
        },

        changeCreationDate : function (oEvent) {
            let oModel = this.getModel("validation");
            let sValue = oEvent.getParameter("value");
            let bValid = oEvent.getParameter("valid");

            if (sValue && bValid) {
                oModel.setProperty("/CreationDateState", "None");
            } else {
                this._oWizard.setCurrentStep(this.byId("wsNewEmployeeStep2"));
                oModel.setProperty("/CreationDateState", "Error");
            }
            oModel.refresh();
        },

        changeDni : function (oEvent) {
            let oModel = this.getModel();
            let oValidation = this.getModel("validation");
            let sValue = oEvent.getParameter("value");
            let sResult = this._validateDni(sValue);
            if (sResult === "None") {
                oValidation.setProperty("/DniState", "None");
            } else {
                this._oWizard.setCurrentStep(this.byId("wsNewEmployeeStep2"));
                oValidation.setProperty("/DniState", "Error");
                this._oWizard.invalidateStep(this.byId("wsNewEmployeeStep2"));
            }
            oValidation.refresh();
        },
// << Step 2 Validate mandatory fields
        onWizardComplete : function () {
            this._oNavContainer.to(this.byId("dynPagWizardReview"));
        },

        backToWizardContent: function () {
			this._oNavContainer.backToPage(this._oWizardContentPage.getId());
		},

        _handleNavigationToStep : function (iStepNumber) {
            let fnAfterNavigate = function () {
				this._oWizard.goToStep(this._oWizard.getSteps()[iStepNumber]);
				this._oNavContainer.detachAfterNavigate(fnAfterNavigate);
			}.bind(this);
			this._oNavContainer.attachAfterNavigate(fnAfterNavigate);
			this.backToWizardContent();
        },

        editStep1 : function () {
            this._handleNavigationToStep(0);
        },

        editStep2 : function () {
            this._handleNavigationToStep(1);
        },

        editStep3 : function () {
            this._handleNavigationToStep(3);
        },

        _handleMessageBoxOpen: function (sMessage, sMessageBoxType) {
            let oRouter = this.getRouter();

			MessageBox[sMessageBoxType](sMessage, {
				actions: [MessageBox.Action.YES, MessageBox.Action.NO],
				onClose: function (oAction) {
					if (oAction === MessageBox.Action.YES) {
						this._oWizard.discardProgress(this._oWizard.getSteps()[0]);
                        oRouter.navTo("RouteMainView", {});
					}
				}.bind(this)
			});
		},

        onWizardCancel : function () {
            let resourceBundle = this.getResourceBundle();
            this._handleMessageBoxOpen(resourceBundle.getText("msgCancelCreateEmployeeProcess"), "warning");
        },

        onWizardSubmit : function () {
            let oResourceBundle = this.getResourceBundle();
            let oRouter = this.getRouter();

            let oModel = this.getModel();
            let oData = oModel.getData();

            let body = {
                SapId: this.getOwnerComponent().SapId,
                Type: oData.Type.toString(),
                FirstName: oData.FirstName,
                LastName: oData.LastName,
                Dni: oData.Dni,
                CreationDate: oData.CreationDate,
                Comments: oData.Comments,
                UserToSalary: [
                    {
                        Amount: parseFloat(oData.UserToSalary.Amount).toString(),
                        Comments: oData.Comments,
                        Waers: oData.UserToSalary.Waers
                    }
                ]
            };

            new Promise((resolve, reject) => {
                this.getView().getModel("employees").create("/Users", body, {
                    success: function (data) {
                        resolve(data);
                    },
                    error: function (e) {
                        reject(e);
                    }
                });
            }).then(
                function (data) {
                    this._startUploadFiles(data.EmployeeId);
                    sap.m.MessageToast.show(oResourceBundle.getText("createEmployeeSuccessMessage"));
                    this._setView();
                    oRouter.navTo("RouteMainView", {});
                }.bind(this),
                function (e) {
                    sap.m.MessageToast.show(oResourceBundle.getText("createEmployeeErrorMessage"));
                }.bind(this)
            );
        },

        _setView : function () {
            this._handleNavigationToStep(0);
            this._oWizard.discardProgress(this._oWizard.getSteps()[0]);

            this.byId("uploadSetNewEmployee").destroyItems();
            this.byId("uploadSetNewEmployee").destroyIncompleteItems();
        },

        _startUploadFiles : function (employeeId) {
            let oUploadSet = this.byId("uploadSetNewEmployee");
            let incompleteItems = oUploadSet.getIncompleteItems();
            let sSapId =this.getOwnerComponent().SapId;

            oUploadSet.removeAllHeaderFields();

            incompleteItems.forEach(item => {
                let oFile = item.getFileObject();

                item.addHeaderField(new sap.ui.core.Item({
                    key: "slug",
                    text: sSapId + ";" + employeeId + ";" + oFile.name
                }));

                item.addHeaderField(new sap.ui.core.Item({
                    key: "x-csrf-token",
                    text: this.getView().getModel("employees").getSecurityToken()
                }));

                oUploadSet.uploadItem(item);
            });
        }
//-----
        /* onFileDeleted : function (oEvent) {
        }, */

        /* downloadFile : function (oEvent) {
            //const sPath = oEvent.getSource().getBindingContext("incidence").getPath();
            //window.open("/sap/opu/odata/sap/YSAPUI5_SRV_01" + sPath + "/$value");
        } */
// << UploadCollection
        /* onBeforeUploadStarts : function (oEvent) {
            const sSapId = this.getOwnerComponent().SapId;
            let items = oEvent.getParameter("item");
            let sFileName = items.getFileName();
            let oModel = this.getView().getModel("employees");
            let sToken = oModel.getSecurityToken();
            
            items.addHeaderField(new sap.ui.core.Item({
                key: "slug",
                text: sSapId + ";" + sFileName + ";" + sFileName
            }));
            items.addHeaderField(new sap.ui.core.Item({
                key: "x-csrf-token",
                text: sToken
            }));
        } */

        /* onUploadCompleted: function(oEvent) {
            let oUploadCollection = oEvent.getSource();
        } */
    });
});