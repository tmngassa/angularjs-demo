
'use strict';

angular.module("bham.toolsandresourcesModule", ['treeControl'])

    .config(['$routeProvider', function($routeProvider) {
            $routeProvider
            .when('/toolsandresources', {
                    controller: 'ToolsAndResourcesCtrl',
                    templateUrl: "toolsandresources/toolsAndResources.tpl.html"
                });
    }])
    .controller("ToolsAndResourcesCtrl", ['$scope', '$window', function($scope, $window){
        $scope.treedata = [
            {"title": "Clinical Practice Guidelines", "name": "", "id": "0", "children": [
                {"title": "Federal Guidelines for Opioid Treatment, Aprile 2013", "name": "Federal_Guidelines_for_Opioid_Treatment_Aprile_2013.pdf", "id": "00", "children": []  },
                {"title": "Practice Guidelines for the Treatment of Patient with substance use disorder 2nd edition. American Psychatric Association", "name": "practice_guidelines_treatment_patient_substance_use_disorder_2_edition_apa.pdf", "id": "01", "children": []  },
                {"title": "VA/DoD Clinical Practice Guideline for Management of Susbtance Use disorders (SUD)", "name": "va_dod_clinical_practice_guideline_for_management.pdf", "id": "02", "children": []  }
            ]},
            {"title": "Comparative Effectiveness Research", "name": "", "id": "1", "children": [
                {"title": "Nonpharmacologic Interventions for Treatment-Resistant Depression in Adults", "name": "nonpharmacologic_interventions_for_treatment-Resistant_depressioni_n_adults.pdf", "id": "10", "children": []  },
                {"title": "Treatment for Depression After Unsatisfactory Response to SSRIs in Adults and Adolescents", "name": "treatment_for_depression_after_unsatisfactory_response_to_ssris_in_adults_and_adolescents.pdf", "id": "11", "children": []  },
                {"title": "Second-Generation Antidepressants for Treating Adult Depression: An Update", "name": "second-generation_antidepressants_for_treating_adult_depression.pdf", "id": "12", "children": []  }
            ]}
        ];

        $scope.option = { nodeChildren: "children", dirSelectable: false };

        $scope.openDocument = function(selectedNode) {
            var documentName = (selectedNode.name).trim();
            var extension = documentName.substring(documentName.lastIndexOf(".")+1, (documentName.length));
            var suffix = 'pdf';
            if(angular.isDefined(documentName) && (documentName.length > 0) && (extension===suffix) ){
                $window.open("assets/documents/" + documentName);
            }
        };
    }]);