import angular from 'angular';
import translate from 'angular-translate';
import uirouter from 'angular-ui-router';
import uibootstrap from 'angular-ui-bootstrap';
import ngAria from 'angular-aria';
import ngMessages from 'angular-messages';
import ngSanitize from 'angular-sanitize';
import ngTouch from 'angular-touch';
import ngCookies from 'angular-cookies';
import ngAnimate from 'angular-animate';
import config from './index.config';
import routerConfig from './index.route';
import runBlock from './index.run';
import CityController from './city/city.controller';
import CityService from './city/city.service';

angular.module('testAngular', [
  ngAnimate,
  ngCookies,
  ngTouch,
  ngSanitize,
  ngMessages,
  ngAria,
  uirouter,
  uibootstrap,
  translate])
  .constant('apiKey', '40f01bb2767c4027de88158ce076448f')
  .constant('openWeatherApi', 'http://api.openweathermap.org/data/2.5')
  .config(config)
  .config(routerConfig)
  .service('cityService', CityService)
  .controller('CityController', CityController)
  .run(runBlock);
