/**
 * Main AngularJS Web Application
 */
var app = angular.module('izerspa', ['ngRoute', 'ngCookies', 'ui.bootstrap', 'countTo', 'sir-accordion', 'ngSanitize']);

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
        .when("/detalhes", { templateUrl: "SubPages/detalhes.html", controller: "PageCtrl" })
        .when("/investimentos", { templateUrl: "SubPages/investimentos.html", controller: "PageCtrl" })
        .when("/perfil", { templateUrl: "SubPages/MeuPerfil.html", controller: "PageCtrl" })
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


/*app.run(['$rootScope', '$location', '$cookies', '$http',
    function run($rootScope, $location, $cookies, $http) {
        // keep user logged in after page refresh
        $rootScope.globals = $cookies.getObject('globals') || {};
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = 'Bearer ' + $rootScope.globals.currentUser.authdata;
        }

        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            // redirect to login page if not logged in and trying to access a restricted page
            var restrictedPage = $.inArray($location.path(), ["/login", "/register", "/entregadores", "/termosdeuso", "/"]) === -1;
            var loggedIn = $rootScope.globals.currentUser;
            if (restrictedPage && !loggedIn) {
                $location.path("/login");
            }
        });
    }]);*/

/*progress bar*/
app.controller("progressBar", function ($scope, $timeout, $http) {

    $http.get('http://localhost:58255/api/customers/prizes')
        .then(function (response) {
            $scope.amt = response.data;
            $scope.countTo = response.data;
            $scope.countFrom = 0;
            console.log(response);
        });

   // $scope.countTo = countToGet;
   // $scope.countFrom = 0;

    $timeout(function () {
        $scope.progressValue = $scope.amt;
    }, 200);

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

// controller da nota do usuário

app.controller('RatingController', function ($scope, $http) {

    $http.get('http://localhost:58255/api/customers/rating')
        .then(function (response) {
            $scope.stars = response.data;
        });

})