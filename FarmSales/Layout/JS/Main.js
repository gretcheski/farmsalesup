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
        .when("/metas", { templateUrl: "SubPages/Metas.html", controller: "PageCtrl" })
        .when("/realizar", { templateUrl: "SubPages/Realizar.html", controller: "PageCtrl" })
        .when("/entregadores", { templateUrl: "SubPages/Entregadores.html", controller: "PageCtrl" })
        .when("/solicitar", { templateUrl: "SubPages/Solicitar.html", controller: "PageCtrl" })
        .when("/perfil", { templateUrl: "SubPages/MeuPerfil.html", controller: "PageCtrl" })
        .when("/termosdeuso", { templateUrl: "SubPages/TermosDeUso.html", controller: "PageCtrl" })
        .when("/login", { controller: "LoginController", templateUrl: "SubPages/Login/login.view.html", controllerAs: "vm" })
        .when("/register", { controller: "RegisterController", templateUrl: "SubPages/Register/register.view.html", controllerAs: "vm" })
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

    $scope.deliveries = [];
    $scope.urgencyId = "1";
    $scope.itemValue = "1";

    $scope.userLoggedIn = $rootScope.globals.currentUser;

    $scope.calculatePrice = function (routeTime, routeDistance, itemValue, urgencyId) {
        // seta variáveis de preço base
        var tarifaBase = 3;
        var custoPorMin = 0.30;
        var custoPorKm = 0.25;

        var preco = tarifaBase + (custoPorMin * routeTime) + (custoPorKm * routeDistance);

        // redefine preço de acordo com estimativa de valor do item
        if (itemValue === 2) {
            preco = preco * 1.2;
        }
        else if (itemValue === 3) {
            preco = preco * 1.4;
        }
        else {
            preco = preco;
        }

        // redefine preço de acordo com a urgência do pedido
        if (urgencyId === 2) {
            preco = preco * 1.3;
        }
        else if (urgencyId === 3) {
            preco = preco * 1.5;
        }
        else {
            preco = preco;
        }
        
        $rootScope.routeTime = routeTime;
        $rootScope.routeDistance = routeDistance;
        $rootScope.preco = preco;
        $scope.recebeOrigin = angular.element($document[0].querySelector('#origin'));
        $scope.origin = $scope.recebeOrigin[0].value;
        $scope.recebeDestination = angular.element($document[0].querySelector('#destination'));
        $scope.destination = $scope.recebeDestination[0].value;
        $rootScope.deliveryData = { "RouteTime": $scope.routeTime, "RouteDistance": $scope.routeDistance, "Price": $scope.preco, "UrgencyId": $scope.urgencyId, "PickupAddress": $scope.origin, "FinalAddress": $scope.destination }

        return $scope.preco;
    }

    $scope.body = '<div><p><strong>Preço calculado:</strong> R$: ' + $scope.preco + ' </p></div>';

    

    $scope.showModal = function () {

        $scope.calculatePrice(routeTime, routeDistance, $scope.itemValue, $scope.urgencyId);
        $rootScope.Delivery = $rootScope.deliveryData;
        $modal.open({
            templateUrl: 'myModal.html',
            controller: 'ModalCtrl',
            resolve: {
                body: function () {
                    return $scope.body;
                },
                preco: function () {
                    return $scope.preco;
                }
            }
        });
    }

}).controller("ModalCtrl", function ($scope, $rootScope, $modalInstance, $http) {
    $scope.Delivery = $rootScope.Delivery;
    $scope.ok = function () {

        $('#formPagSeguro').submit();

        $http.post('http://localhost:58255/api/v1/deliveries/postbyuser', $scope.Delivery)
            .then(function (response) {
                alert(response);
            });

        $modalInstance.close();
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});


app.run(['$rootScope', '$location', '$cookies', '$http',
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
    }]);

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

/*mapa do cadastro*/
function initMap() {
    var directionsDisplay = new google.maps.DirectionsRenderer;
    var directionsService = new google.maps.DirectionsService;
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 14,
        center: { lat: -25.44, lng: -49.35 }
    });
    directionsDisplay.setMap(map);

    document.getElementById("submit_mapinfo").addEventListener('click', function () {
        calculateAndDisplayRoute(directionsService, directionsDisplay);
    }); 

}

function calculateAndDisplayRoute(directionsService, directionsDisplay) {
    var selectedMode = document.getElementById('mode').value;
    directionsService.route({
        origin: document.getElementById('origin').value, 
        destination: document.getElementById('destination').value, 
        travelMode: google.maps.TravelMode[selectedMode]
    }, function (response, status) {
        if (status == 'OK') {
            directionsDisplay.setDirections(response);
            // Mostra Distância:
            document.getElementById('rtDistance').innerHTML =
                "<strong>Distäncia:</strong> " + Math.round(response.routes[0].legs[0].distance.value / 1000) + " Km";
            routeDistance = Math.round(response.routes[0].legs[0].distance.value / 1000);

            // Mostra Tempo de viagem:
            document.getElementById('rtTime').innerHTML =
                "<strong>Tempo de viagem:</strong> " + Math.round(response.routes[0].legs[0].duration.value / 60) + " Minutos";
            routeTime = Math.round(response.routes[0].legs[0].duration.value / 60);
            if (routeTime > 20) {
                    document.getElementById('urgencyDiv').style.display = "block";
            }
            else {
                document.getElementById('urgencyDiv').style.display = "none";
            }
        } else {
            window.alert('Requisição ao serviço do google falhou: ' + status);
        }
    });
}

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

// controller do histórico do motorista

app.controller('DriverHistoryController', function ($scope, $http) {

    $http.get('http://localhost:58255/api/v1/deliveries/driverhistory')
        .then(function (response) {
            $scope.deliveries = response.data;
            console.log(response);
        });

    $scope.changePanicHtml = function (delivery) {
        if (delivery.PanicPushed == true) {
            var panicHtml = "Sim";
            return panicHtml;
        } else {
            var panicHtml = "Não";
            return panicHtml;
        }
    }
})

// controller do histórico do usuário

app.controller('UserHistoryController', function ($scope, $http) {

    $http.get('http://localhost:58255/api/v1/deliveries/userhistory')
        .then(function (response) {
            $scope.deliveries = response.data;
            console.log(response);
        });

    $scope.changePanicHtml = function (delivery) {
        if (delivery.PanicPushed == true) {
            var panicHtml = "Sim";
            return panicHtml;
        } else {
            var panicHtml = "Não";
            return panicHtml;
        }
    }
})

// controller da nota do usuário

app.controller('RatingController', function ($scope, $http) {

    $http.get('http://localhost:58255/api/customers/rating')
        .then(function (response) {
            $scope.stars = response.data;
        });

})