(function() {
  'use strict';

  angular
    .module('frontend')
    .constant('SERVER_API', { 
      URL: '@@SERVER_URL' 
    })
    .config(RoutingConfig)

  RoutingConfig.$inject = [
    '$stateProvider',
    '$urlRouterProvider',
  ];

  function RoutingConfig($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');

    const rootState = {
      name: 'root',
      url: '/',
      templateUrl: 'partials/home.html',
      controller: 'HomeController',
      controllerAs: 'home',
      resolve: {
        mocks: ['mockService', (mockService) => mockService.getMocks()],
      }
    };

    $stateProvider.state(rootState);
  }
})();
