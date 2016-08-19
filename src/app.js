(function() {
  'use strict';

  /* @ngInject */
  function configureSlides(slidesConfig) {
// @ifdef slides
    /* @echo 'slidesConfig.slides = ' *//* @echo slides *//* @echo ';' */
    // @endif

    slidesConfig.slideTemplatePrefix= '@@cacheBustingDir/slides/';
    slidesConfig.slideTemplateSuffix = '.html';

    slidesConfig.masters = {
      'regular': '@@cacheBustingDir/masters/regular.html',
      'section-title': '@@cacheBustingDir/masters/section-title.html'
    };
  }

  var module = angular.module('app', [
    'app.templates',
    'w11k.slides',
    'w11k.slides.template',
    'ngSanitize'
  ]);

  // set presentation mode on startup
  module.run(function (SlidesService) {
   SlidesService.setMode('screen');
  });

  module.config (configureSlides);

  module.controller('HtmlInjectCtrl', function ($scope, $sce) {
    $scope.handleInsecureInput = function () {
      $scope.trustedHtml = $sce.trustAsHtml($scope.searchTerm);
    };
  });

}());
