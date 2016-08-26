import cityTemplate from './city/city.html';

export default function routerConfig($stateProvider, $urlRouterProvider) {
  'ngInject';
  $stateProvider
    .state('city', {
      url: '/:cityName',
      template: cityTemplate,
      controller: 'CityController',
      controllerAs: 'cityController',
    });

  $urlRouterProvider.otherwise('/');
}
