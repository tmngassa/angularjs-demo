'use strict';

angular.module("bham.outcomeDirectives", [])
    .directive("deleteOutcome", function () {
        return {
            restrict: 'E',

            scope: {
                outcomeid: '@',
                name: '@',
                ondelete: '&'
            },
            template: '<a class="red" href="#">' +
                '<i class="icon-trash bigger-130"></i>' +
                '</a>',
            link: function (scope, element, attrs) {

                element.on('click', function (e) {
                    e.preventDefault();

                    var msg = 'Outcome on <b>' + scope.name + '</b> will be permanently deleted and cannot be recovered.';
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
                                    scope.ondelete({outcomeId: scope.outcomeid});
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
    .directive("showOutcome", function () {
        return {
            restrict: 'E', //only matches element name
            scope: {
                outcome: '='
            },
            template: '<a class="blue" href="#">' +
                '<i class="icon-zoom-in bigger-130"></i>' +
                '</a>',
            link: function (scope, element, attrs) {
                element.on('click', function (e) {
                    e.preventDefault();

                    var selectedoutcome = scope.outcome;

                    var visitDate = selectedoutcome.visitDate;
                    var symptoms = selectedoutcome.symptoms;
                    var tolerability = selectedoutcome.tolerability;
                    var procedureTypeName = selectedoutcome.procedureTypeName;
                    var cgiSCode = selectedoutcome.cgiSCode;
                    var cgiSName = selectedoutcome.cgiSName;
                    var cgiICode = selectedoutcome.cgiICode;
                    var cgiIName = selectedoutcome.cgiIName;

                    var outcomeDetails = '<div class="row">' +
                        '<div class="col-xs-12">' +
                        '<div class="table-responsive">' +
                        '<div class="modal-body no-padding" >' +
                        ' <table  class="table table-striped table-bordered table-hover no-bottom-margin">' +
                        '  <tbody>' +
                        ' <tr > <td  class="captionID" >  <b>Visit Date</b> </td> <td class="dataID"> ' + visitDate + ' </td></tr>' +
                        ' <tr > <td  class="captionID" >  <b>Symptoms</b> </td> <td class="dataID"> ' + symptoms + ' </td></tr>' +
                        ' <tr > <td  class="captionID" >  <b>Tolerability</b> </td> <td class="dataID"> ' + tolerability + ' </td></tr>' +
                        ' <tr > <td  class="captionID" >  <b>Procedures</b> </td> <td class="dataID"> ' + procedureTypeName + ' </td></tr>' +
                        ' <tr > <td  class="captionID" >  <b>CGI-S</b> </td> <td class="dataID"> ' + cgiSCode + ' - ' + cgiSName + ' </td></tr>' +
                        ' <tr > <td  class="captionID" >  <b>CGI-I</b> </td> <td class="dataID"> ' + cgiICode + ' - ' + cgiIName + ' </td></tr>' +
                        '</tbody>' +
                        ' </table>' +
                        ' </div>' +
                        ' </div>' +
                        ' </div>' +
                        ' </div>';

                    $('#dialog-outcome-details').html(outcomeDetails);

                    $("#dialog-outcome-details").removeClass('hide').dialog({
                        resizable: false,
                        modal: true,
                        title: 'Outcome',
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
