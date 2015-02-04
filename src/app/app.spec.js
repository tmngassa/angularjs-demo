/**
 * Created by tomson.ngassa on 3/3/14.
 */

'use strict';

describe('bham module', function(){
    var module;

    beforeEach(function() {
        module = angular.module("bham");
    });

    it("should be registered", function() {
        expect(module).not.toEqual(null);
    });

    describe("Dependencies:", function() {

        var dependencies;

        var hasModule = function(m) {
            return dependencies.indexOf(m) >= 0;
        };
        beforeEach(function() {
            dependencies = module.value('bham').requires;
        });

        it("should have templates-app as a dependency", function() {
            expect(hasModule('templates-app')).toEqual(true);
        });

        it("should have templates-common as a dependency", function() {
            expect(hasModule('templates-common')).toEqual(true);
        });

        it("should have ngRoute as a dependency", function() {
            expect(hasModule('ngRoute')).toEqual(true);
        });

        it("should have bham.dashboarModule as a dependency", function() {
            expect(hasModule('bham.dashboarModule')).toEqual(true);
        });

        it("should have bham.caremanagerModul as a dependency", function() {
            expect(hasModule('bham.caremanagerModule')).toEqual(true);
        });

        it("should have bham.organizationModule as a dependency", function() {
            expect(hasModule('bham.organizationModule')).toEqual(true);
        });

        it("should have bham.patientModule as a dependency", function() {
            expect(hasModule('bham.patientModule')).toEqual(true);
        });

        it("should have bham.visualanalyticsModule as a dependency", function() {
            expect(hasModule('bham.visualanalyticsModule')).toEqual(true);
        });

        it("should have bham.messagecenterModule as a dependency", function() {
            expect(hasModule('bham.messagecenterModule')).toEqual(true);
        });

        it("should have bham.reportsModule as a dependency", function() {
            expect(hasModule('bham.reportsModule')).toEqual(true);
        });

        it("should have bham.toolsandresourcesModul as a dependency", function() {
            expect(hasModule('bham.toolsandresourcesModule')).toEqual(true);
        });

        it("should have bham.directives as a dependency", function() {
            expect(hasModule('bham.directives')).toEqual(true);
        });

        it("should have bham.breadcrumbsModule as a dependency", function() {
            expect(hasModule('bham.breadcrumbsModule')).toEqual(true);
        });

        it("should have bham.conditionModule as a dependency", function() {
            expect(hasModule('bham.conditionModule')).toEqual(true);
        });

        it("should have bham.socialhistoryModule as a dependency", function() {
            expect(hasModule('bham.socialhistoryModule')).toEqual(true);
        });

        it("should have bham.procedureModule as a dependency", function() {
            expect(hasModule('bham.procedureModule')).toEqual(true);
        });

        xit("should have security module as a dependency", function() {
            expect(hasModule('security')).toEqual(true);
        });
    });
});

describe("App route:", function() {
    var $route, $location, $rootScope, AppCtrl, scope, $controller;

    beforeEach(module('bham'));

    beforeEach(inject(function(_$route_, _$location_, _$rootScope_, _$controller_){
        $route = _$route_;
        $location = _$location_;
        $rootScope = _$rootScope_;
        scope = $rootScope.$new();
        $controller = _$controller_;

        AppCtrl = $controller('AppCtrl', {
            $scope: scope
        });
    }));

    xit('should route to the patient module', function(){
        expect($route.current).toBeUndefined();
        $location.path('/blablabla');
        $rootScope.$digest();

        expect($route.current.templateUrl).toBe('patient/patient-list.tpl.html');
        expect($location.path()).toBe('/patients');

        $location.path('/otherwise');
        $rootScope.$digest();

        expect($location.path()).toBe('/patients');
    });

    it('should contain index page template', function(){
        expect(scope.headnavbar).toEqual('../head-navbar.tpl.html');
        expect(scope.breadcrums).toEqual('../breadcrums.tpl.html');
        expect(scope.sidenavbar).toEqual('../side-navbar.tpl.html');
    });

    //TODO
    it('should get breadcrumbs', function(){
        expect(scope.breadcrumbs()).toEqual([]);
        $location.path('/otherwise');
    });


});

describe("bham module AppCTrl", function() {
    var $route, $location, $rootScope, AppCtrl, scope, $controller, breadcrumbsService, entityList, patient;

    beforeEach(module('bham'));

    beforeEach(function(){
        this.addMatchers({
            toEqualData: function(expected) {
                return angular.equals(this.actual, expected);
            }
        });
    });

    beforeEach(inject(function(_$route_, _$location_, _$rootScope_, _$controller_, _BreadcrumbsService_){
        $route = _$route_;
        $location = _$location_;
        $rootScope = _$rootScope_;
        scope = $rootScope.$new();
        $controller = _$controller_;
        breadcrumbsService = _BreadcrumbsService_;

        AppCtrl = $controller('AppCtrl', {
            $scope: scope,
            BreadcrumbsService: breadcrumbsService
        });

        entityList = [ {id:0, name:'Tomson'}, {id:1, name:'Himalay'}, {id:2, name:'Utish'}];

        patient = {id:0, fullName:"Tomson Ngassa"};

    }));

    xit('should route to the patient module', function(){
        expect($route.current).toBeUndefined();
        $location.path('/blablabla');
        $rootScope.$digest();

        expect($route.current.templateUrl).toBe('patient/patient-list.tpl.html');
        expect($location.path()).toBe('/patients');

        $location.path('/otherwise');
        $rootScope.$digest();

        expect($location.path()).toBe('/patients');
    });

    it('should have default values', function(){
        expect(scope.headnavbar).toEqual('../head-navbar.tpl.html');
        expect(scope.breadcrums).toEqual('../breadcrums.tpl.html');
        expect(scope.sidenavbar).toEqual('../side-navbar.tpl.html');

        expect(scope.datePattern).toEqual(/(0[1-9]|1[012])[ \/.](0[1-9]|[12][0-9]|3[01])[ \/.](19|20)\d\d/);

        expect(scope.openCustomMenu).toBeFalsy();
        expect(scope.isDemographics).toBeFalsy();

        expect(scope.selectedPatient).toBeUndefined();
        expect(scope.selectedPatientId).toBeUndefined();
        expect(scope.selectedPatientFullName).toBeUndefined();
        expect(scope.collapseDemographicsAccordion).toBeUndefined();
        expect(scope.toggleDemographicsAccordionClass).toBeUndefined();
        expect(scope.collapseConditionsAccordion).toBeUndefined();
        expect(scope.toggleConditionsAccordionClass).toBeUndefined();
        expect(scope.collapseSocialhistoryAccordion).toBeUndefined();
        expect(scope.toggleSocialhistoryAccordionClass).toBeUndefined();
        expect(scope.collapseProcedureAccordion).toBeUndefined();
        expect(scope.toggleProcedureAccordionClass).toBeUndefined();

        expect(scope.dashboardMenuitem).toBeUndefined();
        expect(scope.careManagerMenuitem).toBeUndefined();
        expect(scope.organizationMenuitem).toBeUndefined();
        expect(scope.patientListMenuitem).toBeUndefined();

        expect(scope.visualAnalyticsMenuitem).toBeUndefined();
        expect(scope.messageCenterMenuitem).toBeUndefined();
        expect(scope.reportsMenuitem).toBeUndefined();
        expect(scope.toolsResourceMenuitem).toBeUndefined();
        expect(scope.conditionsMenuitem).toBeUndefined();
        expect(scope.socialHistoryMenuitem).toBeUndefined();
        expect(scope.procedureMenuitem).toBeUndefined();
        expect(scope.treatmentPlanMenuitem).toBeUndefined();
        expect(scope.demographicsMenuitem).toBeUndefined();
        expect(scope.summaryCareRecordMenuitem).toBeUndefined();

    });

    //TODO
    it('should get breadcrumbs', function(){
        expect(scope.breadcrumbs()).toEqual([]);
        $location.path('/patients');
    });

    it('should get entity by Id', function(){
        expect(scope.getEntityById(entityList, 0)).toEqual({id:0, name:'Tomson'});
        expect(scope.getEntityById(entityList, 1)).toEqual({id:1, name:'Himalay'});
        expect(scope.getEntityById(entityList, 2)).toEqual({id:2, name:'Utish'});
    });

    it('should delete entity by Id', function(){
        expect(entityList.length).toEqual(3);
        scope.deleteEntityById(entityList, 0);
        expect(entityList.length).toEqual(2);
        scope.deleteEntityById(entityList, 1);
        expect(entityList.length).toEqual(1);
        scope.deleteEntityById(entityList, 2);
        expect(entityList.length).toEqual(0);
    });

    it('should populate custom patient menu', function(){
        scope.populateCustomPatientMenu(patient);

        expect( scope.selectedPatient ).toEqual(patient);
        expect( scope.selectedPatientId ).toEqual(patient.id);
        expect( scope.selectedPatientFullName ).toEqual(patient.fullName);

        expect( scope.collapseDemographicsAccordion ).toEqual('');
        expect( scope.toggleDemographicsAccordionClass ).toBeFalsy();

        expect( scope.collapseConditionsAccordion ).toEqual('');
        expect( scope.toggleConditionsAccordionClass ).toBeFalsy();

        expect( scope.collapseSocialhistoryAccordion ).toEqual('');
        expect( scope.toggleSocialhistoryAccordionClass ).toBeFalsy();

        expect( scope.collapseProcedureAccordion ).toEqual('');
        expect( scope.toggleProcedureAccordionClass ).toBeFalsy();

        expect(scope.openCustomMenu).toBeTruthy();

        expect(scope.visualAnalyticsMenuitem).toBeFalsy();
        expect(scope.messageCenterMenuitem).toBeFalsy();
        expect(scope.reportsMenuitem).toBeFalsy();
        expect(scope.toolsResourceMenuitem).toBeFalsy();
        expect(scope.conditionsMenuitem).toBeFalsy();
        expect(scope.socialHistoryMenuitem).toBeFalsy();
        expect(scope.procedureMenuitem).toBeFalsy();
        expect(scope.treatmentPlanMenuitem).toBeFalsy();
        expect(scope.demographicsMenuitem).toBeFalsy();
        expect(scope.summaryCareRecordMenuitem).toBeFalsy();

    });

    it('should select treatment menu', function(){
        expect(scope.treatmentPlanMenuitem).toBeUndefined();
        scope.selectTreatmentPlanMenu();
        expect(scope.treatmentPlanMenuitem).toBeTruthy();
    });

    it('should select summary record menu', function(){
        expect(scope.summaryCareRecordMenuitem).toBeUndefined();
        scope.selectSummaryRecordMenu();
        expect(scope.summaryCareRecordMenuitem).toBeTruthy();
    });

    it('should toggle demographics accordion', function(){
        scope.collapseDemographicsAccordion = "";
        scope.toggleDemographicsAccordionClass = false;

        scope.onToggledDemographicsAccordion();

        expect(scope.collapseDemographicsAccordion).toEqual('collapse');
        expect(scope.toggleDemographicsAccordionClass).toBeTruthy();
    });

    it('should toggle conditions accordion', function(){
        scope.collapseConditionsAccordion = "";
        scope.toggleConditionsAccordionClass = false;

        scope.onToggledConditionsAccordion();

        expect(scope.collapseConditionsAccordion).toEqual('collapse');
        expect(scope.toggleConditionsAccordionClass).toBeTruthy();
    });

    it('should toggle social history accordion', function(){
        scope.collapseSocialhistoryAccordion = "";
        scope.toggleSocialhistoryAccordionClass = false;

        scope.onToggledSocialHistoryAccordion();

        expect(scope.collapseSocialhistoryAccordion).toEqual('collapse');
        expect(scope.toggleSocialhistoryAccordionClass).toBeTruthy();
    });

    it('should toggle procedure accordion', function(){
        scope.collapseProcedureAccordion = "";
        scope.toggleProcedureAccordionClass = false;

        scope.onToggledProcedureAccordion();

        expect(scope.collapseProcedureAccordion).toEqual('collapse');
        expect(scope.toggleProcedureAccordionClass).toBeTruthy();
    });

    it('should remove active CSS class in side navigation bar', function(){

        expect(scope.dashboardMenuitem).toBeUndefined();
        expect(scope.careManagerMenuitem).toBeUndefined();
        expect(scope.organizationMenuitem).toBeUndefined();
        expect(scope.patientListMenuitem).toBeUndefined();
        expect(scope.visualAnalyticsMenuitem).toBeUndefined();
        expect(scope.messageCenterMenuitem).toBeUndefined();
        expect(scope.reportsMenuitem).toBeUndefined();
        expect(scope.toolsResourceMenuitem).toBeUndefined();
        expect(scope.conditionsMenuitem).toBeUndefined();
        expect(scope.socialHistoryMenuitem).toBeUndefined();
        expect(scope.procedureMenuitem).toBeUndefined();
        expect(scope.treatmentPlanMenuitem).toBeUndefined();
        expect(scope.demographicsMenuitem).toBeUndefined();
        expect(scope.summaryCareRecordMenuitem).toBeUndefined();

        scope.removeActiveClassInSideNavBar();

        expect(scope.dashboardMenuitem).toBeFalsy();
        expect(scope.careManagerMenuitem).toBeFalsy();
        expect(scope.organizationMenuitem).toBeFalsy();
        expect(scope.patientListMenuitem).toBeFalsy();
        expect(scope.visualAnalyticsMenuitem).toBeFalsy();
        expect(scope.messageCenterMenuitem).toBeFalsy();
        expect(scope.reportsMenuitem).toBeFalsy();
        expect(scope.toolsResourceMenuitem).toBeFalsy();
        expect(scope.conditionsMenuitem).toBeFalsy();
        expect(scope.socialHistoryMenuitem).toBeFalsy();
        expect(scope.procedureMenuitem).toBeFalsy();
        expect(scope.treatmentPlanMenuitem).toBeFalsy();
        expect(scope.demographicsMenuitem).toBeFalsy();
        expect(scope.summaryCareRecordMenuitem).toBeFalsy();
    });

    it('should add active CSS class in side navigation bar', function(){

        expect(scope.dashboardMenuitem).toBeUndefined();
        expect(scope.careManagerMenuitem).toBeUndefined();
        expect(scope.organizationMenuitem).toBeUndefined();
        expect(scope.patientListMenuitem).toBeUndefined();
        expect(scope.visualAnalyticsMenuitem).toBeUndefined();
        expect(scope.messageCenterMenuitem).toBeUndefined();
        expect(scope.reportsMenuitem).toBeUndefined();
        expect(scope.toolsResourceMenuitem).toBeUndefined();
        expect(scope.conditionsMenuitem).toBeUndefined();
        expect(scope.socialHistoryMenuitem).toBeUndefined();
        expect(scope.procedureMenuitem).toBeUndefined();
        expect(scope.treatmentPlanMenuitem).toBeUndefined();
        expect(scope.demographicsMenuitem).toBeUndefined();
        expect(scope.summaryCareRecordMenuitem).toBeUndefined();

        scope.addActiveClassInSideNavBar('dashboard');
        expect(scope.dashboardMenuitem).toBeTruthy();
        expect(scope.openCustomMenu).toBeFalsy();

        scope.addActiveClassInSideNavBar('careManager');
        expect(scope.careManagerMenuitem).toBeTruthy();
        expect(scope.openCustomMenu).toBeFalsy();

        scope.addActiveClassInSideNavBar('organization');
        expect(scope.organizationMenuitem).toBeTruthy();
        expect(scope.openCustomMenu).toBeFalsy();

        scope.addActiveClassInSideNavBar('visualAnalytics');
        expect(scope.visualAnalyticsMenuitem).toBeTruthy();
        expect(scope.openCustomMenu).toBeFalsy();

        scope.addActiveClassInSideNavBar('patientList');
        expect(scope.patientListMenuitem).toBeTruthy();
        expect(scope.openCustomMenu).toBeFalsy();

        scope.addActiveClassInSideNavBar('messageCenter');
        expect(scope.messageCenterMenuitem).toBeTruthy();
        expect(scope.openCustomMenu).toBeFalsy();

        scope.addActiveClassInSideNavBar('reports');
        expect(scope.reportsMenuitem).toBeTruthy();
        expect(scope.openCustomMenu).toBeFalsy();

        scope.addActiveClassInSideNavBar('toolsAndResource');
        expect(scope.toolsResourceMenuitem).toBeTruthy();
        expect(scope.openCustomMenu).toBeFalsy();

        scope.addActiveClassInSideNavBar('conditions');
        expect(scope.conditionsMenuitem).toBeTruthy();
        expect(scope.openCustomMenu).toBeTruthy();

        scope.addActiveClassInSideNavBar('socialHistory');
        expect(scope.socialHistoryMenuitem).toBeTruthy();
        expect(scope.openCustomMenu).toBeTruthy();

        scope.addActiveClassInSideNavBar('procedure');
        expect(scope.procedureMenuitem).toBeTruthy();
        expect(scope.openCustomMenu).toBeTruthy();

        scope.addActiveClassInSideNavBar('treatmentPlan');
        expect(scope.treatmentPlanMenuitem).toBeTruthy();
        expect(scope.openCustomMenu).toBeTruthy();

        scope.addActiveClassInSideNavBar('demographics');
        expect(scope.demographicsMenuitem).toBeTruthy();
        expect(scope.openCustomMenu).toBeTruthy();

        scope.addActiveClassInSideNavBar('summaryCareRecord');
        expect(scope.summaryCareRecordMenuitem).toBeTruthy();
        expect(scope.openCustomMenu).toBeTruthy();
    });

    it('should handle onSelectmenu event on top menu', function(){

        expect(scope.dashboardMenuitem).toBeUndefined();
        expect(scope.careManagerMenuitem).toBeUndefined();
        expect(scope.organizationMenuitem).toBeUndefined();
        expect(scope.patientListMenuitem).toBeUndefined();
        expect(scope.visualAnalyticsMenuitem).toBeUndefined();
        expect(scope.messageCenterMenuitem).toBeUndefined();
        expect(scope.reportsMenuitem).toBeUndefined();
        expect(scope.toolsResourceMenuitem).toBeUndefined();
        expect(scope.conditionsMenuitem).toBeUndefined();
        expect(scope.socialHistoryMenuitem).toBeUndefined();
        expect(scope.procedureMenuitem).toBeUndefined();
        expect(scope.treatmentPlanMenuitem).toBeUndefined();
        expect(scope.demographicsMenuitem).toBeUndefined();
        expect(scope.summaryCareRecordMenuitem).toBeUndefined();

        scope.onSelectmenu('messageCenter');

        expect(scope.dashboardMenuitem).toBeFalsy();
        expect(scope.careManagerMenuitem).toBeFalsy();
        expect(scope.organizationMenuitem).toBeFalsy();
        expect(scope.patientListMenuitem).toBeFalsy();
        expect(scope.visualAnalyticsMenuitem).toBeFalsy();
        expect(scope.reportsMenuitem).toBeFalsy();
        expect(scope.toolsResourceMenuitem).toBeFalsy();
        expect(scope.conditionsMenuitem).toBeFalsy();
        expect(scope.socialHistoryMenuitem).toBeFalsy();
        expect(scope.procedureMenuitem).toBeFalsy();
        expect(scope.treatmentPlanMenuitem).toBeFalsy();
        expect(scope.demographicsMenuitem).toBeFalsy();
        expect(scope.summaryCareRecordMenuitem).toBeFalsy();

        expect(scope.messageCenterMenuitem).toBeTruthy();
        expect(scope.openCustomMenu).toBeFalsy();
    });

    it('should handle onSelectmenu event on submenu', function(){
        expect(scope.dashboardMenuitem).toBeUndefined();
        expect(scope.careManagerMenuitem).toBeUndefined();
        expect(scope.organizationMenuitem).toBeUndefined();
        expect(scope.patientListMenuitem).toBeUndefined();
        expect(scope.visualAnalyticsMenuitem).toBeUndefined();
        expect(scope.messageCenterMenuitem).toBeUndefined();
        expect(scope.reportsMenuitem).toBeUndefined();
        expect(scope.toolsResourceMenuitem).toBeUndefined();
        expect(scope.conditionsMenuitem).toBeUndefined();
        expect(scope.socialHistoryMenuitem).toBeUndefined();
        expect(scope.procedureMenuitem).toBeUndefined();
        expect(scope.treatmentPlanMenuitem).toBeUndefined();
        expect(scope.demographicsMenuitem).toBeUndefined();
        expect(scope.summaryCareRecordMenuitem).toBeUndefined();

        scope.onSelectmenu('summaryCareRecord');

        expect(scope.dashboardMenuitem).toBeFalsy();
        expect(scope.careManagerMenuitem).toBeFalsy();
        expect(scope.organizationMenuitem).toBeFalsy();
        expect(scope.patientListMenuitem).toBeFalsy();
        expect(scope.visualAnalyticsMenuitem).toBeFalsy();
        expect(scope.messageCenterMenuitem).toBeFalsy();
        expect(scope.reportsMenuitem).toBeFalsy();
        expect(scope.toolsResourceMenuitem).toBeFalsy();
        expect(scope.conditionsMenuitem).toBeFalsy();
        expect(scope.socialHistoryMenuitem).toBeFalsy();
        expect(scope.procedureMenuitem).toBeFalsy();
        expect(scope.treatmentPlanMenuitem).toBeFalsy();
        expect(scope.demographicsMenuitem).toBeFalsy();

        expect(scope.summaryCareRecordMenuitem).toBeTruthy();
        expect(scope.openCustomMenu).toBeTruthy();
    });

    it('should enable custom menu', function(){
        expect(scope.openCustomMenu).toBeFalsy();
        scope.enableCustomPatientMenu();
        expect(scope.openCustomMenu).toBeTruthy();
    });

    it('should disenable custom menu', function(){
        scope.openCustomMenu = true;
        scope.disableCustomPatientMenu();
        expect(scope.openCustomMenu).toBeFalsy();
    });

    it('should conveert and object to a JSON', function(){
        var obj = [{id:0, name:"Tomson0"}, {id:1, name:"Tomson1"}, {id:2, name:"Tomson2"}];
        var jsonObject = scope.toJSON(obj);
        var expectedJsonObject =  JSON.stringify(obj, null, 2);
        expect(angular.equals(expectedJsonObject, jsonObject)).toBeTruthy();
    });

    it('should toggle demographic Mode', function(){
        expect(scope.isDemographics).toBeFalsy();
        scope.toggleDemographicMode(true);
        expect(scope.isDemographics).toBeTruthy();
    });


    it('should be future date', function(){
        var today = new Date();
        var futureDate = today.setDate(today.getDate() + 10);
        expect(scope.isFutureDate( futureDate )).toBeTruthy();

        var today1 = new Date();
        var futureDate1 = today1.setDate(today1.getDate() - 10);
        expect(scope.isFutureDate( futureDate1 )).toBeFalsy();
    });

    it('should end date not proceed start date', function(){
        var startDate = new Date();
        var today = new Date();
        var endDate = today.setDate(today.getDate() - 10);
        expect(scope.isEndDateBeforeStartDate(startDate, endDate )).toBeTruthy();

        var startDate1 = new Date();
        var today1 = new Date();
        var endDate1 = today1.setDate(today1.getDate() + 10);
        expect(scope.isEndDateBeforeStartDate(startDate1, endDate1 )).toBeFalsy();
    });
});
