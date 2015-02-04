/**
 * Created by tomson.ngassa on 2/19/14.
 */

'use strict';

angular.module("bham.conditionDirectives", [])
    .directive("deleteCondition", function () {
        return {
            restrict: 'E',

            scope: {
                conditionid: '@',
                name: '@',
                ondelete: '&'
            },
            template: '<a class="red" href="#">' +
                '<i class="icon-trash bigger-130"></i>' +
                '</a>',
            link: function (scope, element, attrs) {

                element.on('click', function (e) {
                    e.preventDefault();

                    var msg = 'Condition <b>' + scope.name + '</b> will be permanently deleted and cannot be recovered.';
                    $('#dialog-confirm-msg').html(msg);
                    $("#dialog-confirm").removeClass('hide').dialog({
                        resizable: false,
                        modal: true,
                        title: '',
                        title_html: true,
                        buttons: [
                            {
                                html: "<i class='icon-trash bigger-110'></i>&nbsp; Delete",
                                "class": "btn btn-danger btn-xs",
                                click: function () {
                                    scope.ondelete({conditionId: scope.conditionid});
                                    $(this).dialog("close");
                                }
                            },
                            {
                                html: "<i class='icon-remove bigger-110'></i>&nbsp; Cancel",
                                "class": "btn btn-xs",
                                click: function () {
                                    $(this).dialog("close");
                                }
                            }
                        ]
                    });
                });
            }
        };
    })
    .directive("showCondition", function () {
        return {
            restrict: 'E', //only matches element name
            scope: {
                condition: '='
            },
            template: '<a class="blue" href="#">' +
                '<i class="icon-zoom-in bigger-130"></i>' +
                '</a>',
            link: function (scope, element, attrs) {
                element.on('click', function (e) {
                    e.preventDefault();

                    var selectedcondition = scope.condition;
                    var problemDisplayName = selectedcondition.problemDisplayName;
                    var problemStatusCode = selectedcondition.problemStatusCode;
                    var startdate = selectedcondition.startDate;
                    var enddate = selectedcondition.endDate;

                    var conditionDetails = '<table class="table table-striped table-hover no-bottom-margin" >' +
                        '<thead></thead>' +
                        '<tbody>' +
                        '<tr><td class="captionID"><b>Name</b></td><td class="dataID">' + problemDisplayName + '</td></tr>' +
                        '<tr><td class="captionID"><b>Status</b></td><td class="dataID">' + problemStatusCode + '</td></tr>' +
                        '<tr><td class="captionID"><b>Start Date</b></td><td class="dataID">' + startdate + '</td></tr>' +
                        '<tr><td class="captionID"><b>End Date</b></td><td class="dataID"> ' + enddate + '</td></tr>' +
                        '</tbody>' +
                        '</table>';

                    $('#dialog-condition-details').html(conditionDetails);

                    $("#dialog-condition-details").removeClass('hide').dialog({
                        resizable: false,
                        modal: true,
                        title: '',
                        title_html: true,
                        buttons: [
                            {
                                html: "<i class='icon-remove bigger-110'></i>&nbsp; Close",
                                "class": "btn btn-xs",
                                click: function () {
                                    $(this).dialog("close");
                                }
                            }
                        ]
                    });
                });
            }
        };
    });
