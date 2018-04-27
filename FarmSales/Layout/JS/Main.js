/**
 * Main AngularJS Web Application
 */
var app = angular.module('izerspa', ['ngRoute', 'ngCookies', 'ui.bootstrap', 'countTo', 'sir-accordion', 'ngSanitize', 'ng-fusioncharts']);

/**
 * Configure the Routes
 */
app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        // Home
        .when("/", { templateUrl: "SubPages/Home.html", controller: "PageCtrl" })
        // Pages
        .when("/noticias", { templateUrl: "SubPages/noticias.html", controller: "PageCtrl" })
        .when("/mercado", { templateUrl: "SubPages/mercado.html", controller: "PageCtrl" })
        .when("/investimentos", { templateUrl: "SubPages/investimentos.html", controller: "PageCtrl" })
        .when("/detalhes", { templateUrl: "SubPages/Detalhes.html", controller: "PageCtrl" })
        .when("/termosdeuso", { templateUrl: "SubPages/TermosDeUso.html", controller: "PageCtrl" })
        // else 404
        .when("/404", { templateUrl: "SubPages/Errors/404.html", controller: "PageCtrl" })
        .otherwise("/404", { templateUrl: "SubPages/Errors/404.html", controller: "PageCtrl" });
}]);

app.config(['$locationProvider', function ($locationProvider) {
    $locationProvider.hashPrefix('');
}]);

/**
 * Controla a maioria das páginas
 */
app.controller('PageCtrl', function ($scope, $http, $rootScope, $modal, $sanitize, $document) {

    console.log("Page Controller reporting for duty.");
});

/* Accordion -> Melhorar visual dos accordions. */

app.run([function () {
    if ('addEventListener' in document) {
        document.addEventListener('DOMContentLoaded', function () {
            FastClick.attach(document.body);
        }, false);
    }
}]);

app.controller('Principal', ['$scope', '$compile', '$http', function ($scope, $compile, $http) {
        $http.get('http://localhost:58255/api/v1/deliveries')
            .then(function (response) {
                $scope.accordionArray = response.data;
                console.log(response);
        });

    $scope.activeArray = 1;
    $scope.coord = '';
    $scope.accordionConfig = {
        debug: false,
        animDur: 300,
        expandFirst: false,
        autoCollapse: true,
        watchInternalChanges: false,
        headerClass: '',
        beforeHeader: '<span><strong>Urgência: </strong></span>',
        afterHeader: '',
        topContentClass: '',
        beforeTopContent: '<span><strong>Endereço de Retirada:</strong></span>',
        afterTopContent: '<span><strong>Tempo Estimado de Rota (em minutos):</strong></span>',
        bottomContentClass: '',
        beforeBottomContent: '<span><strong>Valor do Serviço (em reais):</strong></span>',
        afterBottomContent: ''
    };

    $scope.toggleAutoCollapse = function () {
        $scope.$broadcast('sacCollapseAll');
        $scope.accordionConfig.autoCollapse = !$scope.accordionConfig.autoCollapse;
    };

    $scope.expandByCoord = function () {
        $scope.$broadcast('sacExpandContentById', $scope.coord);
    }

    $scope.collapseByCoord = function () {
        $scope.$broadcast('sacCollapseContentById', $scope.coord);
    }

    $scope.expandAll = function () {
        $scope.$broadcast('sacExpandAll');
    };

    $scope.collapseAll = function () {
        $scope.$broadcast('sacCollapseAll');
    };

}]); 

app.controller('ChartController', function ($scope) {
    $scope.myDataSource = {
        "chart": {
            "caption": "Retorno Mensal dos Investimentos",
            "subcaption": "ANO PASSADO",
            "xaxisname": "Mês",
            "yaxisname": "Quantia (em R$)",
            "numberprefix": "R$",
            "theme": "carbon"
        },
        "categories": [
            {
                "category": [
                    {
                        "label": "Jan"
                    },
                    {
                        "label": "Fev"
                    },
                    {
                        "label": "Mar"
                    },
                    {
                        "label": "Abr"
                    },
                    {
                        "label": "Mai"
                    },
                    {
                        "label": "Jun"
                    },
                    {
                        "label": "Jul"
                    },
                    {
                        "label": "Ago"
                    },
                    {
                        "label": "Set"
                    },
                    {
                        "label": "Out"
                    },
                    {
                        "label": "Nov"
                    },
                    {
                        "label": "Dez"
                    }
                ]
            }
        ],
        "dataset": [
            {
                "seriesname": "Retorno obtido",
                "data": [
                    {
                        "value": "16000"
                    },
                    {
                        "value": "20000"
                    },
                    {
                        "value": "18000"
                    },
                    {
                        "value": "19000"
                    },
                    {
                        "value": "15000"
                    },
                    {
                        "value": "21000"
                    },
                    {
                        "value": "16000"
                    },
                    {
                        "value": "20000"
                    },
                    {
                        "value": "17000"
                    },
                    {
                        "value": "25000"
                    },
                    {
                        "value": "19000"
                    },
                    {
                        "value": "23000"
                    }
                ]
            },
            {
                "seriesname": "Retorno projetado",
                "renderas": "line",
                "showvalues": "0",
                "data": [
                    {
                        "value": "15000"
                    },
                    {
                        "value": "16000"
                    },
                    {
                        "value": "17000"
                    },
                    {
                        "value": "18000"
                    },
                    {
                        "value": "19000"
                    },
                    {
                        "value": "19000"
                    },
                    {
                        "value": "19000"
                    },
                    {
                        "value": "19000"
                    },
                    {
                        "value": "20000"
                    },
                    {
                        "value": "21000"
                    },
                    {
                        "value": "22000"
                    },
                    {
                        "value": "23000"
                    }
                ]
            }
        
        ]
    };
});