/**
 * Created by tomson.ngassa on 4/22/14.
 */
'use strict';

angular.module('bham.reminderModule', [
        'ngResource',
        'bham.reminderService',
        'bham.naturalSort'
    ])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/reminders', {
                templateUrl: "reminders/reminder-list.tpl.html",
                controller: 'ReminderListCtrl'
            }) .when('/reminder/:id/recommendations', {
                templateUrl: "reminders/reminder-recommendations.tpl.html",
                controller: 'ReminderRecommendationCtrl'
            });

    }])
    .run(["$rootScope", "NaturalService", function($rootScope, NaturalService) {
        $rootScope.natural = function (field) {
            if(field){
                return function (reminders) {
                    return NaturalService.naturalValue(reminders[field]);
                };
            }
        };
    }])

    .controller('ReminderListCtrl', ['$scope', 'ReminderService', '$location', '$log',  function ($scope, ReminderService, $location, $log) {


        //Initial table page size
        $scope.pageSize = 10;

        var reminders = ReminderService.query();

        $scope.reminders = reminders;
        $scope.filteredReminders = reminders;
        $scope.totalRecords = reminders.length;

        //Calculating the the size of the shown page
        $scope.showPageSize = $scope.pageSize > $scope.totalRecords ? $scope.totalRecords : $scope.pageSize;

        //Calcating the first record
        $scope.startRecord = 1;

        $scope.deleteReminder = function(reminderId){

        };

        //Refreshing table by making the first page the current page
        var refreshTable = function(){
            $scope.setActivePage(0);
        };

        $scope.onSearch = function(){
            //In case of search resetting the page number to the first page
            $scope.pageNo = 0;

            if(angular.isDefined($scope.searchBy) && ( $scope.searchBy.length > 0) ){
                if($scope.searchBy === 'subject'){
                    $scope.composedCriteria = {subject : "" + $scope.criteria};
                }else if($scope.searchBy === 'patient'){
                    $scope.composedCriteria = {patient : $scope.criteria};
                }else if($scope.searchBy === 'messageType'){
                    $scope.composedCriteria = {messageType : $scope.criteria};
                }
            }else{
                $scope.composedCriteria = $scope.criteria;
            }
        };


        $scope.onPageSizeChange = function(){
            if( $scope.pageSize > $scope.totalRecords) {
                $scope.showPageSize = $scope.filteredReminders.length;
            }else{
                $scope.showPageSize = $scope.pageSize ;
            }
            //On changing page size reset to first page and set the page number to 0
            $scope.startRecord = 1;
            $scope.pageNo = 0;
        };

        //SORTING
        $scope.sortField = undefined;
        $scope.reverse = false;

        $scope.sort = function (fieldName) {
            if ($scope.sortField === fieldName) {
                $scope.reverse = !$scope.reverse;
            } else {
                $scope.sortField = fieldName;
                $scope.reverse = false;
            }
        };

        $scope.isSortUp = function (fieldName) {
            return $scope.sortField === fieldName && !$scope.reverse;
        };

        $scope.isSortDown = function (fieldName) {
            return $scope.sortField === fieldName && $scope.reverse;
        };

        // PAGINATION
        $scope.pages = [];
        $scope.pageNo = 0;
        $scope.firstPage = 0;
        $scope.lastPage = 0;

        var calculatePaginationPages = function(numberReminders, pageSize){
            $scope.pages.length = 0;
            var noOfPages = Math.ceil(numberReminders / pageSize);
            $scope.lastPage = noOfPages;
            for (var i=0; i<noOfPages; i++) {
                $scope.pages.push(i);
            }

        };

        $scope.$watch('filteredReminders.length', function(filteredSize){
            calculatePaginationPages(filteredSize,$scope.pageSize );

            //Update showPageSize when filteredReminder length changes
            $scope.startRecord = parseInt($scope.pageSize) * parseInt( $scope.pageNo) + 1;
            var upperLimit = $scope.startRecord  + parseInt($scope.pageSize) - 1;
            $scope.showPageSize = upperLimit > filteredSize? filteredSize  : upperLimit;

        });

        $scope.$watch('pageSize', function(newPageSize){
            var totalReminder = 0;
            if(angular.isDefined($scope.filteredReminders)){
                totalReminder = $scope.filteredReminders.length;
            }else if(angular.isDefined($scope.totalRecords)){
                totalReminder = $scope.totalRecords.length;
            }
            calculatePaginationPages( totalReminder , newPageSize);
            //Reset current to first page after user changes the page size.
            $scope.pageNo = 0;
        });

        $scope.setActivePage = function (pageNo) {
            if (pageNo >=0 && pageNo < $scope.pages.length) {
                $scope.pageNo = pageNo;
                // Updating showing pages
                updateShowPageSize(pageNo);
            }
        };

        var updateShowPageSize = function(pageNo){
            // Updating showing pages
            $scope.startRecord = parseInt($scope.pageSize) * parseInt( pageNo) + 1;
            var upperLimit = $scope.startRecord  + parseInt($scope.pageSize) - 1;
            var filteredReminderslenght = $scope.filteredReminders.length;
            $scope.showPageSize = upperLimit > filteredReminderslenght ? filteredReminderslenght  : upperLimit;
        };
    }])

    .controller('ReminderRecommendationCtrl', ['$scope', 'ReminderService', '$location', '$log', '$routeParams',  function ($scope, ReminderService, $location, $log, $routeParams) {

        // Switch Tabs
        $scope.activeTab  = 'general';
        $scope.switchTabTo = function (tabId) {
            $scope.activeTab = tabId;
        };

        if($routeParams.id){
            $scope.reminder = ReminderService.get($routeParams.id);
        }



    }]);
