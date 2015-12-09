app.directive('preloadBgImage', function (preLoader) {
  return {
    restrict: 'A',
    link: function (scope, element, attr) {   
      preLoader(attr.preloadBgImage, function () {
        element.css({
          'background-image': 'url("' + attr.preloadBgImage + '")'
        });
        if (attr.animationType) element.addClass("animated " + attr.animationType);
      }, function () {
        if (attr.fallbackImage) {
          element.css({
            'background-image': 'url("' + attr.fallbackImage + '")'
          });
        }
      });
    }
  };
});