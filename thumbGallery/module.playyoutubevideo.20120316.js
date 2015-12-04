if (typeof (EddieBauer_UI) == 'undefined') {
    EddieBauer_UI = {};
}

EddieBauer_UI.PlayAllVideoStates = function () {
    return {
        vars: {
            slide2: null,
            slide6: null,
            thumb2: null,
            thumb3: null,
            thumb4: null,
            thumb5: null,
            timePlayed: null,
            playerState: null,
            youtube: null
        },

        initialize: function () {
            this.vars.slide2 = jQuery('div.slides div#slide2');
            this.vars.slide6 = jQuery('div.slides div#slide6');
            this.vars.thumb2 = jQuery('div.thumbs div#thumb2');
            this.vars.thumb3 = jQuery('div.thumbs div#thumb3');
            this.vars.thumb4 = jQuery('div.thumbs div#thumb4');
            this.vars.thumb5 = jQuery('div.thumbs div#thumb5');
            this.vars.youtube = jQuery('#youtube');
            this.vars.timePlayed = jQuery("div.slides input#timePlayed");
            this.vars.playerState = jQuery("div.slides input#playerState");
        },

        getYouTubeVideo: function () {
            this.initialize();
            this.vars.slide6.add(this.vars.youtube).show();
        },

        hideYouTubeVideo: function () {
            this.initialize();
            try {
                ytplayer.pauseVideo();
                this.vars.playerState.data("playerState", ytplayer.getPlayerState());
                this.vars.timePlayed.data("elapsed", ytplayer.getCurrentTime());
                this.vars.slide6.add(this.vars.slide2).hide();
            } catch (e) { }
        },

        getVideoState: function () {
            this.initialize();
            try {
                if (typeof (ytplayer) == "undefined") {
                } else {
                	var thumb 			= jQuery("div.thumbgallery").find("div.thumbs div.thumb");
                	var s6 				= this.vars.slide6.is(":visible");
                	var secondsPlayed 	= this.vars.timePlayed.data("elapsed");
                	thumb.each(function(i, value) {
                		var thumb_num = jQuery(this).attr('id').substring(5);
                		if (thumb_num>2) {
                			if (jQuery(this).hasClass("hover") && s6) {EddieBauer_UI.PlayAllVideoStates.hideYouTubeVideo();}
                		}
                		if (thumb_num==2) {
                			if (jQuery(this).hasClass("hover") && secondsPlayed>0) {EddieBauer_UI.PlayAllVideoStates.getVideoAgain();}
                		}
                	});
                }
            } catch (e) { }
        },

        getVideoAgain: function () {
            this.initialize();
            try {
            	var s2 			= this.vars.slide2.is(":visible");
            	var playerState	= this.vars.playerState.data("playerState");
            	if (s2 && (playerState==2)) {EddieBauer_UI.PlayAllVideoStates.showYouTubeVideo();}
            } catch (e) { }
        },

        showYouTubeVideo: function () {
            this.initialize();
            this.vars.slide6.add(this.vars.youtube).show();
        }
    };
} ();