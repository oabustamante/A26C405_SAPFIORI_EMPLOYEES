sap.ui.define([
    "./BaseController",
    "sap/m/MessageBox",
    "sap/m/plugins/UploadSetwithTable",
    "employees/model/formatter"
], (BaseController, MessageBox, UploadSetwithTable, Formatter) => {
    "use strict";

    return BaseController.extend("employees.controller.NewEmployee", {

        formatter: Formatter,

        onInit : function () {
            /* */
            this._oNavContainer = this.byId("navContainer");
            this._oWizardContentPage = this.byId("dynPagNewEmployee");
            
            this._oWizard = this.byId("newEmployeeWizard");
            /* */
            /* */
            //this.documentTypes = this.getFileCategories();
            /* */
            let oRouter = this.getRouter();
			oRouter.getRoute("RouteNewEmployee").attachMatched(this._onRouteMatched, this);

        },

        _onRouteMatched : function () {
            /* this._oNavContainer = this.byId("navContainer");
            this._oWizardContentPage = this.byId("dynPagNewEmployee");

            this._oWizard = this.byId("newEmployeeWizard"); */
            this._oWizard.invalidateStep(this.byId("wsNewEmployeeStep1"));
            this._oWizard.invalidateStep(this.byId("wsNewEmployeeStep2"));

            this._iSelectedStepIndex = 0;
            this._oSelectedStep = this._oWizard.getSteps()[this._iSelectedStepIndex];

            this._oEmployee = {
                Type: null,             // {0: Internal, 1: Autonomous, 2: Manager}
                SapId: null,            // email SAP BTP account
                FirstName: null,
                //FirstNameState: "None",
                LastName: null,
                //LastNameState: "None",
                Dni: null,
                //DniState: "None",
                CreationDate: null,
                //CreationDateState: "None",
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
            // handle buttons visibility

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
            // handle buttons visibility

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
            // handle buttons visibility

            let oModel = this.getModel();
            oModel.setProperty("/Type", 2);
            oModel.refresh();
        },
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
                    // Error
                    return "Error";
                } else {
                    // None
                    return "None";
                }
            } else {
                // Error
                return "Error";
            }
        },

// Step 2 Validate mandatory fields
        validateStep2Info : function () {
            let oModel = this.getModel(), errorFlag = 0;
            let iFirstName = this.byId("firstName").getValue(),
                iLastName = this.byId("lastName").getValue(),
                iDni = this.byId("dni").getValue(),
                iCif = this.byId("cif").getValue();
                //iCreationDate = this.byId("creationDate").getValue();

            let oValidation = this.getModel("validation");

            let oCreationDate = this.byId("creationDate").getDateValue();



            // Mandatory fields
            if (iFirstName.length > 1) {
                //oModel.setProperty("/FirstNameState", "None");
                oValidation.setProperty("/FirstNameState", "None");
            } else {
                //this._oWizard.setCurrentStep(this.byId("wsNewEmployeeStep2"));
                //oModel.setProperty("/FirstNameState", "Error");
                oValidation.setProperty("/FirstNameState", "Error");
                errorFlag = 1;
            }

            if (iLastName.length > 1) {
                //oModel.setProperty("/LastNameState", "None");
                oValidation.setProperty("/LastNameState", "None");
            } else {
                //this._oWizard.setCurrentStep(this.byId("wsNewEmployeeStep2"));
                //oModel.setProperty("/LastNameState", "Error");
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

            let EmployeeType = oModel.getProperty("/Type");
            if (EmployeeType === 1) {
                if (iCif.length > 1) {
                    //oModel.setProperty("/CifState", "None");
                    oValidation.setProperty("/CifState", "None");
                } else {
                    //this._oWizard.setCurrentStep(this.byId("wsNewEmployeeStep2"));
                    //oModel.setProperty("/CifState", "Error");
                    oValidation.setProperty("/CifState", "Error");
                    errorFlag = 1;
                }
            } else {
                if (iDni.length > 1) {
                    //oModel.setProperty("/DniState", "None");
                    //oValidation.setProperty("/DniState", "None");
                    //console.log("Dni.length > 1: ", iDni);
                    
                    let sResult = this._validateDni(iDni);
                    if (sResult === "None") {
                        oModel.setProperty("/DniState", "None");
                        //this._oWizard.validateStep(this.byId("wsNewEmployeeStep2"));
                    } else {
                        //this._oWizard.setCurrentStep(this.byId("wsNewEmployeeStep2"));
                        errorFlag = 1;
                        oModel.setProperty("/DniState", "Error");
                        //this._oWizard.invalidateStep(this.byId("wsNewEmployeeStep2"));
                    }
                } else {
                    //this._oWizard.setCurrentStep(this.byId("wsNewEmployeeStep2"));
                    //oModel.setProperty("/DniState", "Error");
                    oValidation.setProperty("/DniState", "Error");
                    errorFlag = 1;
                }
            }
            console.log("errorFlag: ", errorFlag);
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
                //this._oWizard.validateStep(this.byId("wsNewEmployeeStep2"));
            } else {
                this._oWizard.setCurrentStep(this.byId("wsNewEmployeeStep2"));
                oModel.setProperty("/FirstNameState", "Error");
                //this._oWizard.invalidateStep(this.byId("wsNewEmployeeStep2"));
            }
            oModel.refresh();
        },

        changeLastName : function (oEvent) {
            let oModel = this.getModel("validation");
            let sValue = oEvent.getSource().getValue();

            if (sValue.length > 0) {
                oModel.setProperty("/LastNameState", "None");
                //this._oWizard.validateStep(this.byId("wsNewEmployeeStep2"));
            } else {
                this._oWizard.setCurrentStep(this.byId("wsNewEmployeeStep2"));
                oModel.setProperty("/LastNameState", "Error");
                //this._oWizard.invalidateStep(this.byId("wsNewEmployeeStep2"));
            }
            oModel.refresh();
        },

        changeCreationDate : function (oEvent) {
            //let oModel = this.getModel();
            let oModel = this.getModel("validation");
            let sValue = oEvent.getParameter("value");
            let bValid = oEvent.getParameter("valid");

            if (sValue && bValid) {
                oModel.setProperty("/CreationDateState", "None");
                //this._oWizard.validateStep(this.byId("wsNewEmployeeStep2"));
            } else {
                this._oWizard.setCurrentStep(this.byId("wsNewEmployeeStep2"));
                oModel.setProperty("/CreationDateState", "Error");
                //this._oWizard.invalidateStep(this.byId("wsNewEmployeeStep2"));
            }

            oModel.refresh();
        },

        changeDni : function (oEvent) {
            let oModel = this.getModel();
            let oValidation = this.getModel("validation");

            if (oModel.getProperty("/Type") !== 1) {
                let sValue = oEvent.getParameter("value");
                let sResult = this._validateDni(sValue);
                if (sResult === "None") {
                    oValidation.setProperty("/DniState", "None");
                    //this._oWizard.validateStep(this.byId("wsNewEmployeeStep2"));
                } else {
                    this._oWizard.setCurrentStep(this.byId("wsNewEmployeeStep2"));
                    oValidation.setProperty("/DniState", "Error");
                    this._oWizard.invalidateStep(this.byId("wsNewEmployeeStep2"));
                }
                oValidation.refresh();
            }
        },

        changeCfi : function () {
            let oModel = this.getModel();
            let oValidation = this.getModel("validation");

            if (oModel.getProperty("/Type") === 1) {
                //
            }
        },


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
						//this.byId("wizardDialog").close();
						//this.getView().getModel().setData(Object.assign({}, oData));
                        //this.onNavBack();
                        oRouter.navTo("RouteMainView", {});
                        
					}
				}.bind(this)
			});
		},

        onWizardCancel : function () {
            let resourceBundle = this.getResourceBundle();
            this._handleMessageBoxOpen(resourceBundle.getText("msgCancelCreateEmployeeProcess"), "warning");
        },

        onWizardSubmit : function () {},
/**
 * Files
 */
        onBeforeUploadStarts : function () {
            console.log("onBeforeUploadStarts");
        },

        onPluginActivated: function(oEvent) {
			this.oUploadPluginInstance = oEvent.getParameter("oPlugin");
		},

        onUploadCompleted: function(oEvent) {
			//const oModel = this.byId("table-uploadSet").getModel("documents");
			const iResponseStatus = oEvent.getParameter("status");

			// check for upload is sucess
			if (iResponseStatus === 201) {
				//oModel.refresh(true);
				setTimeout(function() {
					MessageToast.show("Document Added");
				}, 1000);
			}
			// This code block is only for demonstration purpose to simulate XHR requests, hence restoring the server to not fake the xhr requests.
			//this.oMockServer.restore();
		}


        /* getFileCategories: function() {
			return [
				{categoryId: "Invoice", categoryText: "Invoice"},
				{categoryId: "Specification", categoryText: "Specification"},
				{categoryId: "Attachment", categoryText: "Attachment"},
				{categoryId: "Legal Document", categoryText: "Legal Document"}
			];
		}, */









    });
});