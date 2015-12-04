app.factory('SliderFactory', function(){
    var pickedPlant;
    
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
        },
        hidePlant: function(plant){
            pickedPlant = plant;
            plant.addClass('make-invisible');
        },
        showPickedPlant: function(){
            pickedPlant.removeClass('make-invisible');
        }
    };
}); 