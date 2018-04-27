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

    $scope.accordionArray = [
        {
            "title": " 0.71 BTC / HORA", "topContent": "São Paulo, BRA", "bottomContent": "R$ 887,83"
        },{
            "title": " 0.63 BTC / HORA", "topContent": "Los Angeles, USA", "bottomContent": "R$ 932,85"
        }, {
            "title": " 0.62 BTC / HORA", "topContent": "Buenos Aires, ARG", "bottomContent": "R$ 1383,33"
        }, {
            "title": " 0.62 BTC / HORA", "topContent": "New York, USA", "bottomContent": "R$ 580,90"
        }, {
            "title": " 0.61 BTC / HORA", "topContent": "Los Angeles, USA", "bottomContent": "R$ 620,12"
        }, {
            "title": " 0.53 BTC / HORA", "topContent": "London, ENG", "bottomContent": "R$ 527,50"
        }, {
            "title": " 0.51 BTC / HORA", "topContent": "Paris, FRA", "bottomContent": "R$ 890,00"
        }, {
            "title": " 0.50 BTC / HORA", "topContent": "New Jersey, USA", "bottomContent": "R$ 385,44"
        }, {
            "title": " 0.43 BTC / HORA", "topContent": "Toronto, CAN", "bottomContent": "R$ 181,51"
        }
    ];

    $scope.activeArray = 1;
    $scope.coord = '';
    $scope.accordionConfig = {
        debug: false,
        animDur: 300,
        expandFirst: false,
        autoCollapse: true,
        watchInternalChanges: false,
        headerClass: '',
        beforeHeader: '</br><span><strong>Rendimento atual: </strong></span>',
        afterHeader: '',
        topContentClass: '',
        beforeTopContent: '<span><strong>Localização do farm: </strong></span>',
        afterTopContent: '<span><strong>Custo atual por % do farm: </strong></span>',
        bottomContentClass: '',
        beforeBottomContent: '',
        afterBottomContent: '</br>'
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
            "subcaption": "Últimos 12 meses",
            "xaxisname": "Mês",
            "yaxisname": "Quantia (em R$)",
            "numberprefix": "R$",
            "theme": "carbon"
        },
        "categories": [
            {
                "category": [
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
                    },
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