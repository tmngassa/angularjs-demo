'use strict';

angular.module("bham.socialhistoryDirectives", [])
    .directive("deleteSocialhistory", function () {
        return {
            restrict : 'E',

            scope : {
                socialhistoryid: '@',
                name: '@',
                ondelete: '&'
            },
            template: '<a class="red" href="#">' +
                '<i class="icon-trash bigger-130"></i>' +
                '</a>',
            link: function(scope, element, attrs) {
                element.on('click', function (e) {
                    e.preventDefault();

                    var msg = 'Social History <b>' + scope.name + '</b> will be permanently deleted and cannot be recovered.';
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
                                    scope.ondelete({socialhistoryId: scope.socialhistoryid});
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
    .directive("showSocialhistory", function() {
        return {
            restrict: 'E',
            scope: {
                socialhistory: '='
            },
            template : '<a class="blue" href="#">' +
                '<i class="icon-zoom-in bigger-130"></i>' +
                '</a>',
            link : function(scope, element, attrs) {
                element.on('click', function (e) {
                    e.preventDefault();

                    var selection = scope.socialhistory;
                    var socialHistoryTypeName = selection.socialHistoryTypeName;
                    var socialHistoryStatusCode = selection.socialHistoryStatusCode;
                    var startDate = selection.startDate;
                    var endDate = selection.endDate;

                    var socialhistoryDetails = '<table class="table table-striped table-hover no-bottom-margin" >' +
                        '<thead></thead>' +
                        '<tbody>' +
                        '<tr><td class="captionID"><b>Name</b></td><td class="dataID">' + socialHistoryTypeName + '</td></tr>' +
                        '<tr><td class="captionID"><b>Status</b></td><td class="dataID">' + socialHistoryStatusCode + '</td></tr>' +
                        '<tr><td class="captionID"><b>Start Date</b></td><td class="dataID">' + startDate + '</td></tr>' +
                        '<tr><td class="captionID"><b>End Date</b></td><td class="dataID"> ' + endDate + '</td></tr>' +
                        '</tbody>' +
                        '</table>';

                    $('#dialog-socialhistory-details').html(socialhistoryDetails);

                    $("#dialog-socialhistory-details").removeClass('hide').dialog({
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