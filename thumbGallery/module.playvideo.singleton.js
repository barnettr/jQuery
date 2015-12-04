var playvideo = (function (jQuery) {

    var instantiated;
    function init() {
        return {
            slide2:jQuery('div.slides div#slide2'),slide6:jQuery('div.slides div#slide6'),thumb2:jQuery('div.thumbs div#thumb2'),thumb3:jQuery('div.thumbs div#thumb3'),thumb4:jQuery('div.thumbs div#thumb4'),thumb5:jQuery('div.thumbs div#thumb5'),youtube:jQuery('#youtube'),timePlayed:jQuery("div.slides input#timePlayed"),playerState:jQuery("div.slides input#playerState"),

            getYouTubeVideo: function () {
                try { this.slide6.add(this.youtube).show(); } catch (e) { }
            },

            hideYouTubeVideo: function () {
                try {
                    ytplayer.pauseVideo();
                    this.playerState.data("playerState", ytplayer.getPlayerState());
                    this.timePlayed.data("elapsedTime", ytplayer.getCurrentTime());
                    this.slide6.add(this.slide2).hide();
                } catch (e) { }
            },

            getVideoState: function () {
                try {
                    if (typeof (ytplayer) == "undefined") {
                    } else {
                        var thumbs = jQuery("div.thumbgallery").find("div.thumbs div.thumb");
                        var s6 = this.slide6.is(":visible");
                        var t = this.timePlayed.data("elapsedTime");
                        thumbs.each(function (i, value) {
                            i = jQuery(this).attr('id').substring(5);
                            if (i > 1) { (jQuery(this).hasClass("hover") && s6) ? playvideo.getInstance().hideYouTubeVideo() : ""; }
                            if (i == 1) { (jQuery(this).hasClass("hover") && (t > 0)) ? playvideo.getInstance().getVideoAgain() : ""; }
                        });
                    }
                } catch (e) { }
            },

            getVideoAgain: function () {
                try {
                    var s2 = this.slide2.is(":visible");
                    var i = this.playerState.data("playerState");
                    (s2 && (i == 2)) ? playvideo.getInstance().showYouTubeVideo():"";
                } catch (e) { }
            },

            showYouTubeVideo: function () {
                try { this.slide6.add(this.youtube).show(); } catch (e) { }
            }
        };
    }
    return {
        getInstance: function () {
            if (!instantiated) {
                instantiated = init();
            }
            return instantiated;
        }
    };
})(jQuery);