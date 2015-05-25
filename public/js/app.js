require('babel/polyfill');
let angular = require('angular');
require('angular-ui-router');

import addCustomMethods from './custom_methods';
import DrawSurface from'./draw_surface';
import DrawController from './controllers/draw_controller';
import MapController from './controllers/map_controller';
import MusicController from './controllers/music_controller';

let app = angular.module('app',
                         ['ui.router', 'DrawCtrl', 'MapCtrl', 'MusicCtrl']);

document.addEventListener('DOMContentLoaded', function () {
  addCustomMethods();

  app.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/draw');

    $stateProvider
      .state('draw', {
        url: '/draw',
        templateUrl: 'partials/draw.html',
        controller: DrawCtrl
      })
      .state('map', {
        url: '/map',
        templateUrl: 'partials/map.html',
        controller: MapController
      })
      .state('music', {
        url: '/music',
        templateUrl: 'partials/music.html',
        controller: MusicController
      });
  });
});

export default app;
