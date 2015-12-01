app.factory('SliderFactory', function(){
    return {
        slideOut: function(side){
            var sliders = [].slice.call(document.getElementsByClassName(side + '-slider'));
            sliders.forEach(slider => angular.element(slider).toggleClass(side + '-slider-pull'));
        },
        toggleSliderArrowsHandler: function(){
            var triangleBase = 'glyphicon-triangle',
                rightTriangle = '-right',
                leftTriangle = '-left',
                slider = angular.element([].slice.call(document.getElementsByClassName(triangleBase + rightTriangle)));
            return function() {
                slider.toggleClass(triangleBase + rightTriangle);
                slider.toggleClass(triangleBase + leftTriangle);
            }
        }
    };
}); 