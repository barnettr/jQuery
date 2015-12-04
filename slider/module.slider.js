(function(jQuery) {	
    jQuery.fn.layerSlider = function() {

     /* data attributes:
        data-position
        data-Z
        data-top
        data-bottom
        data-left
        data-right
        data-width
        data-height */

    // container layer for sliders - always requires 'eventContainer' class, id varies by index
    var con = jQuery('.eventContainer').each(function(index){jQuery(this).attr("id", "eventContainer" + index);});
    con.each(function(){
        var c = jQuery(this);
        c.css({
        "top" : c.data("posTop") + "px",
        "left" : c.data("posLeft") + "px",
        "bottom" : c.data("posBottom") + "px",
        "right" : c.data("posRight") + "px",
        "width" : c.data("width") + "px",
        "height" : c.data("height") + "px",
        "position" : c.data("position"),
        "z-index" : c.data("Z")
        });
    });

    // sets css for all DIV containers within each container (based on id) - any amount of data and/or div layers can be added, but be careful with z-index
    var eachDiv = con.find('div'); // all divs in container layer
    eachDiv.each(function(){ 
        var eD = jQuery(this);
        eD.css({
            "top" : eD.data("posTop") + "px",
            "left" : eD.data("posLeft") + "px",
            "bottom" : eD.data("posBottom") + "px",
            "right" : eD.data("posRight") + "px",
            "width" : eD.data("width") + "px",
            "height" : eD.data("height") + "px",
            "position" : eD.data("position"),
            "z-index" : eD.data("Z")
            });
        });

        // previous & next (these should work with eachDiv, but it doesn't)
        var prev = jQuery('.prev');
        prev.each(function(){
            prev = jQuery(this);
            prev.css({
                "top" : prev.data("top") + "px",
                "left" : prev.data("left") + "px",
                "width" : prev.data("width") + "px",
                "height" : prev.data("height") + "px",
                "z-index" : prev.data("Z")
            });
        });

        var next = jQuery('.next');
        next.each(function() {
            n = jQuery(this);
            n.css({
                "top" : n.data("top") + "px",
                "right" : n.data("right") + "px",
                "width" : n.data("width") + "px",
                "height" : n.data("height") + "px",
                "z-index" : n.data("Z")
            });
        });

    // slides layer - always requires 'slides' class, id should change for each slider needed
    var slidesID = jQuery('.slides').each(function(){jQuery(this).attr("id");});
    var sl = jQuery(slidesID);

    // setup for slide functionality, explanation follows each option, can vary for each slide
	jQuery(slidesID).slides({
		preload: sl.data('preload'), // boolean, Set true to preload images in an image based slideshow
		preloadImage: sl.data('preloadImage'), // string, Name and location of loading image for preloader. Default is "/img/loading.gif"
        container: sl.data('container'), // string, Class name for slides container. Default is "slides_container"

        generateNextPrev: sl.data('generateNextPrev'), // boolean, Auto generate next/prev buttons
        next: sl.data('next'), // string, Class name for next button
        prev: sl.data('prev'), // string, Class name for previous button

        pagination: sl.data('pagination'), // boolean, If you're not using pagination you can set to false, but don't have to
        generatePagination: sl.data('generatePagination'), // boolean, Auto generate pagination
        prependPagination: sl.data('prependPagination'), // boolean, prepend pagination
        paginationClass: sl.data('paginationClass'), // string, Class name for pagination, default is 'pagination'

        currentClass: sl.data('current'), // default 'current', string, Class name for current class
        fadeSpeed: sl.data('fadeSpeed'), // default is 350, number, Set the speed of the fading animation in milliseconds
        slideSpeed: sl.data('slideSpeed'), // default is 350, number, Set the speed of the sliding animation in milliseconds
        start: sl.data('start'), //default is 1, number, Set the speed of the sliding animation in milliseconds
        effect: sl.data('slide'), // default is 'slide', string, '[next/prev], [pagination]', e.g. 'slide, fade' or simply 'fade' for both
        crossfade: sl.data('crossfade'), // default is false, boolean, Crossfade images in a image based slideshow
        randomize: sl.data('randomize'), // default is false, boolean, Set to true to randomize slides

        play: sl.data('play'), //5000
		pause: sl.data('pause'), //2500,
		hoverPause: sl.data('hoverPause'),
        autoHeight: sl.data('autoHeight'), // default is false, boolean, Set to true to auto adjust height
        autoHeightSpeed: sl.data('autoHeightSpeed'), // default is 350, number, Set auto height animation time in milliseconds
        bigTarget: sl.data('bigTarget'), // default is false, boolean, Set to true and the whole slide will link to next slide on click

        // animates 'caption' if required
		animationStart: function(current){
			jQuery('.caption').animate({
				bottom:-35
			},100);
		},
		animationComplete: function(current){
			jQuery('.caption').animate({
				bottom:0
			},200);
		},
		slidesLoaded: function() {
			jQuery('.caption').animate({
				bottom:0
			},200);
		}
	});
};
})(jQuery);