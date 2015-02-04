'use strict';
angular.module('bham', [
        'templates-app',
        'templates-common',
        'ngRoute',
        'bham.dashboarModule',
        'bham.caremanagerModule',
        'bham.organizationModule',
        'bham.patientModule',
        'bham.conditionModule',
        'bham.socialhistoryModule',
        'bham.visualanalyticsModule',
        'bham.messagecenterModule',
        'bham.reportsModule',
        'bham.toolsandresourcesModule',
        'bham.directives',
        'bham.breadcrumbsModule',
        'bham.procedureModule',
        'bham.outcomeModule',
        'bham.reminderModule'
    ])

    //TODO: move those messages to a separate module
    .constant('I18N.MESSAGES', {
        'errors.route.changeError': 'Route change error',
        'crud.user.save.success': "A user with id '{{id}}' was saved successfully.",
        'crud.user.remove.success': "A user with id '{{id}}' was removed successfully.",
        'crud.user.remove.error': "Something went wrong when removing user with id '{{id}}'.",
        'crud.user.save.error': "Something went wrong when saving a user...",
        'crud.project.save.success': "A project with id '{{id}}' was saved successfully.",
        'crud.project.remove.success': "A project with id '{{id}}' was removed successfully.",
        'crud.project.save.error': "Something went wrong when saving a project...",
        'login.reason.notAuthorized': "You do not have the necessary access permissions.  Do you want to login as someone else?",
        'login.reason.notAuthenticated': "You must be logged in to access this part of the application.",
        'login.error.invalidCredentials': "Login failed.  Please check your credentials and try again.",
        'login.error.serverError': "There was a problem with authenticating: {{exception}}."
    })

    .config(['$routeProvider', '$locationProvider', '$compileProvider', function ($routeProvider, $locationProvider, $compileProvider) {

        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);

        //TODO: Enable html5mMode
        //$locationProvider.html5Mode(true);
        $routeProvider
            .when('/error', {
                templateUrl: 'error.tpl.html',
                controller: 'ErrorCtrl'
            })
            .otherwise({
                redirectTo: '/patients'
            });
    }])

    .config(['$httpProvider', function ($httpProvider) {
        // Enable cross domain calls
        $httpProvider.defaults.useXDomain = true;

        // Remove the header used to identify ajax call  that would prevent CORS from working
        // The 'X-Request-With' header is no longer present by default as of Angular 1.2
        //delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }
    ])

    .controller('ErrorCtrl', [ '$scope', '$routeParams', '$location', function ($scope, $routeParams, $location) {

        //Passed error message
        if ($routeParams.message) {
            $scope.message = $routeParams.message;
        }
        //Passed error url
        if ($routeParams.url) {
            $scope.url = $routeParams.url;
        }

        //Back from back button
        $scope.goBack = function () {
            window.history.back();
        };

        //Back from browser back button
        $scope.$back = function () {
            window.history.back();
        };
    }])
    .controller('AppCtrl', [ '$scope', '$location', 'BreadcrumbsService', 'SocialhistoryService', 'ConditionService', '$route', function ($scope, $location, BreadcrumbsService, SocialhistoryService, ConditionService,$route ) {

        $scope.headnavbar = '../head-navbar.tpl.html';
        $scope.breadcrums = '../breadcrums.tpl.html';
        $scope.sidenavbar = '../side-navbar.tpl.html';

        //Date pattern used by all the forms to check the format of the date
        $scope.datePattern = /(0[1-9]|1[012])[ \/.](0[1-9]|[12][0-9]|3[01])[ \/.](19|20)\d\d/;

        $scope.breadcrumbs = function () {
            var breadcrumbs = BreadcrumbsService.getAll();

            //updateing the current page
            if (breadcrumbs.length >= 1) {
                // Update the current page
                $scope.currentPage = breadcrumbs[0].name;
            }
            return breadcrumbs;
        };

        $scope.redirect = function (path) {
            $location.path(path);
            $route.reload();
        };


        $scope.getEntityById = function (entityList, entityId) {
            for (var i = 0; i < entityList.length; i++) {
                if (entityList[i].id === parseInt(entityId)) {
                    return entityList[i];
                }
            }
        };

        $scope.deleteEntityById = function (entityList, entityId) {
            for (var i = 0; i < entityList.length; i++) {
                if (entityList[i].id === parseInt(entityId)) {
                    entityList.splice(i, 1);
                    break;
                }
            }
        };

        $scope.openCustomMenu = false;

        $scope.populateCustomPatientMenu = function (selectedPatient) {
            $scope.selectedPatient =  selectedPatient;
            $scope.selectedPatientId = selectedPatient.id;
            $scope.selectedPatientFullName = selectedPatient.fullName;

            $scope.collapseDemographicsAccordion = "";
            $scope.toggleDemographicsAccordionClass = false;

            $scope.collapseConditionsAccordion = "";
            $scope.toggleConditionsAccordionClass = false;

            $scope.collapseSocialhistoryAccordion = "";
            $scope.toggleSocialhistoryAccordionClass = false;

            $scope.collapseProcedureAccordion = "";
            $scope.toggleProcedureAccordionClass = false;

            $scope.enableCustomPatientMenu();
            $scope.removeActiveClassInSideNavBar();
        };

        $scope.selectTreatmentPlanMenu = function(){
            $scope.treatmentPlanMenuitem = true;
        };

        $scope.selectSummaryRecordMenu = function(){
            $scope.summaryCareRecordMenuitem = true;
        };

        $scope.onToggledDemographicsAccordion = function () {
            $scope.collapseDemographicsAccordion = $scope.collapseDemographicsAccordion === "collapse" ? '' : 'collapse';
            $scope.toggleDemographicsAccordionClass = !$scope.toggleDemographicsAccordionClass;
        };

        $scope.onToggledConditionsAccordion = function () {
            $scope.collapseConditionsAccordion = $scope.collapseConditionsAccordion === "collapse" ? '' : 'collapse';
            $scope.toggleConditionsAccordionClass = !$scope.toggleConditionsAccordionClass;
        };

        $scope.onToggledSocialHistoryAccordion = function () {
            $scope.collapseSocialhistoryAccordion = $scope.collapseSocialhistoryAccordion === "collapse" ? '' : 'collapse';
            $scope.toggleSocialhistoryAccordionClass = !$scope.toggleSocialhistoryAccordionClass;
        };

        $scope.onToggledProcedureAccordion = function () {
            $scope.collapseProcedureAccordion = $scope.collapseProcedureAccordion === "collapse" ? '' : 'collapse';
            $scope.toggleProcedureAccordionClass = !$scope.toggleProcedureAccordionClass;
        };

        $scope.removeActiveClassInSideNavBar = function () {
            $scope.dashboardMenuitem = false;
            $scope.careManagerMenuitem = false;
            $scope.organizationMenuitem = false;
            $scope.patientListMenuitem = false;
            $scope.visualAnalyticsMenuitem = false;
            $scope.messageCenterMenuitem = false;
            $scope.reportsMenuitem = false;
            $scope.toolsResourceMenuitem = false;
            $scope.conditionsMenuitem = false;
            $scope.socialHistoryMenuitem = false;
            $scope.procedureMenuitem = false;
            $scope.treatmentPlanMenuitem = false;
            $scope.demographicsMenuitem = false;
            $scope.summaryCareRecordMenuitem = false;
            $scope.remindersMenuitem = false;
        };

        $scope.addActiveClassInSideNavBar = function (menuItem) {
            if (menuItem === 'dashboard') {
                $scope.dashboardMenuitem = true;
                $scope.disableCustomPatientMenu();
            } else if (menuItem === 'careManager') {
                $scope.careManagerMenuitem = true;
                $scope.disableCustomPatientMenu();
            } else if (menuItem === 'organization') {
                $scope.organizationMenuitem = true;
                $scope.disableCustomPatientMenu();
            } else if (menuItem === 'patientList') {
                $scope.patientListMenuitem = true;
                $scope.disableCustomPatientMenu();
            } else if (menuItem === 'visualAnalytics') {
                $scope.visualAnalyticsMenuitem = true;
                $scope.disableCustomPatientMenu();
            } else if (menuItem === 'messageCenter') {
                $scope.messageCenterMenuitem = true;
                $scope.disableCustomPatientMenu();
            } else if (menuItem === 'reports') {
                $scope.reportsMenuitem = true;
                $scope.disableCustomPatientMenu();
            } else if (menuItem === 'toolsAndResource') {
                $scope.toolsResourceMenuitem = true;
                $scope.disableCustomPatientMenu();
            } else if (menuItem === 'reminders') {
                $scope.remindersMenuitem = true;
                $scope.disableCustomPatientMenu();
            } else if (menuItem === 'conditions') {
                $scope.enableCustomPatientMenu();
                $scope.conditionsMenuitem = true;
            } else if (menuItem === 'socialHistory') {
                $scope.enableCustomPatientMenu();
                $scope.socialHistoryMenuitem = true;
            } else if (menuItem === 'procedure') {
                $scope.enableCustomPatientMenu();
                $scope.procedureMenuitem = true;
            } else if (menuItem === 'treatmentPlan') {
                $scope.enableCustomPatientMenu();
                $scope.treatmentPlanMenuitem = true;
            } else if (menuItem === 'demographics') {
                $scope.enableCustomPatientMenu();
                $scope.demographicsMenuitem = true;
            }
            else if (menuItem === 'summaryCareRecord') {
                $scope.enableCustomPatientMenu();
                $scope.summaryCareRecordMenuitem = true;
            }
        };

        $scope.onSelectmenu = function (menuItem) {
            $scope.removeActiveClassInSideNavBar();
            $scope.addActiveClassInSideNavBar(menuItem);
        };

        $scope.enableCustomPatientMenu = function () {
            $scope.openCustomMenu = true;
        };


        $scope.disableCustomPatientMenu = function(){
            $scope.openCustomMenu = false;
         };

        //For debugging
        $scope.toJSON = function (obj) {
            return JSON.stringify(obj, null, 2);
        };

        //hide or show elements use in demographics table
        //Determine whether to route to demographics or patientlist page
        $scope.isDemographics = false;

        $scope.toggleDemographicMode = function(isDemographics){
            $scope.isDemographics = isDemographics;
        };

        $scope.showPatientProfile = function(){
            $location.path("/patient/"+ $scope.selectedPatientId + "/patientprofile");
        };

        $scope.isFutureDate = function(currentDate){
            var result = false;
            if(currentDate){
                var today = new Date().getTime();
                var newDate = new Date(currentDate).getTime();

                if(newDate > today){
                    result = true;
                }
            }
            return result;

        };

        $scope.isEndDateBeforeStartDate = function(startDate, endDate){
            var result = false;
            if(startDate && endDate ){
                var start = new Date(startDate) ;
                var end = new Date(endDate);
                if(end < start){
                    result = true;
                }
            }
            return result;
        };
    }]);
