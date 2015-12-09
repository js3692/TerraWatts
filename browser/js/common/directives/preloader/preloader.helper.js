app.factory('preLoader', function(){
  return function (url, successCb, errCb) {
    angular.element(new Image()).bind('load', function () {
        successCb();
    }).bind('error', function () {
        errCb();
    }).attr('src', url); // ==> this is the line that makes the request for the image at the url
  };
});