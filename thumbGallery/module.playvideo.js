;(function (jQuery) {
    
	
	jQuery.fn.playvideo = function () {
        return {
            property: {slide2:null,slide6:null,thumb2:null,thumb3:null,thumb4:null,thumb5:null,youtube:null,timePlayed:null,playerState:null},
            init: function () {
                this.property.slide2 = jQuery('div.slides div#slide2');
                this.property.slide6 = jQuery('div.slides div#slide6');
                this.property.thumb2 = jQuery('div.thumbs div#thumb2');
                this.property.thumb3 = jQuery('div.thumbs div#thumb3');
                this.property.thumb4 = jQuery('div.thumbs div#thumb4');
                this.property.thumb5 = jQuery('div.thumbs div#thumb5');
                this.property.youtube = jQuery('#youtube');
                this.property.timePlayed = jQuery("div.slides input#timePlayed");
                this.property.playerState = jQuery("div.slides input#playerState");
            },

            getYouTubeVideo: function () {
                this.init();
                this.property.slide6.add(this.property.youtube).show();
            },

            hideYouTubeVideo: function () {
                this.init();
                try {
                    ytplayer.pauseVideo();
                    this.property.playerState.data("playerState", ytplayer.getPlayerState());
                    this.property.timePlayed.data("elapsed", ytplayer.getCurrentTime());
                    this.property.slide6.add(this.property.slide2).hide();
                } catch (e) { }
            },

            getVideoState: function () {
                this.init();
                try {
                    if (typeof (ytplayer) == "undefined") {
                    } else {
                    	var thumbs = jQuery("div.thumbgallery").find("div.thumbs div.thumb");
                        var s6 = this.property.slide6.is(":visible");
                        var secondsPlayed = this.property.timePlayed.data("elapsed");
                        thumbs.each(function (i, value) {
                            var i = jQuery(this).attr('id').substring(5);
                            if (i > 1) {
                                if (jQuery(this).hasClass("hover") && s6) { jQuery.fn.playvideo().hideYouTubeVideo(); }
                            }
                            if (i == 1) {
                                if (jQuery(this).hasClass("hover") && secondsPlayed > 0) { jQuery.fn.playvideo().getVideoAgain(); }
                            }
                        });
                    }
                } catch (e) { }
            },

            getVideoAgain: function () {
                this.init();
                try {
                    var s2 = this.property.slide2.is(":visible");
                    var i = this.property.playerState.data("playerState");
                    if (s2 && (i == 2)) { jQuery.fn.playvideo().showYouTubeVideo(); }
                } catch (e) { }
            },

            showYouTubeVideo: function () {
                this.init();
                this.property.slide6.add(this.property.youtube).show();
            }
        };
    }
})(jQuery);