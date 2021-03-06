(function(jQuery) {
    /*************************************************  
        openYouTubeVideos by rbarnett  10/19/2012
     *************************************************/
    jQuery.fn.openYouTubeVideos = function(options) {
        var youtubeVideo = jQuery('.product_youtube_video');
        if (youtubeVideo) {
            jQuery('.product_youtube_video').each(function() {
                
            	var videoModalData = jQuery(this);
                
            	var billboard = jQuery('.contentWrap');
                
            	var vidID = videoModalData
            			.attr('data-link-videoid');
            	
            	if (vidID == 'M7CMnONJxsI') {
                    var bgImage = '/assets/ocp/product_page/video/video_bkgd_product_page.gif';
                } else {
                    var bgImage = '/assets/ocp/product_page/video/eb_video_bkgd_product_page_new.gif';
                }
                
            	var outerContainer = videoModalData
                        .attr('data-link-outercontainer');
                
            	var href = videoModalData
                        .attr('data-link-href');
                
            	var objectWrapper = videoModalData
                        .attr('data-link-objectwrapper');
                
            	var objectPlaceholder = videoModalData
                        .attr('data-link-objectplaceholder');            	

                var videoContainerHTML = '<div id="'
                    + outerContainer
                    + '" style="display: none;"><div id="'
                    + href
                    + '" style="width: 664px; height: 448px; z-index:999999; background-image: url('
                    + bgImage
                    + ');"><div style="position: absolute; padding-left: 550px; padding-top: 12px; width: 105px;"><div style="position: absolute; top: 50px; left: 12px;"><div class="'
                    + objectWrapper
                    + '" style="display: block;"><div id="'
                    + objectPlaceholder
                    + '"></div></div></div></div></div></div>';
                
                billboard.append(videoContainerHTML);
            });
            
            jQuery('.floatbox').click(function() {
                
            	var applyModalData = jQuery(this).closest(
                        '.product_youtube_video');
                
                var videoId = applyModalData.attr('data-link-videoid');
                
                var fName = applyModalData.attr('data-link-fname');
                
                var playerObjId = applyModalData
                        .attr('data-link-playerobjid');
                
                var objectPlaceholder = applyModalData
                        .attr('data-link-objectplaceholder');
                
                var objectWrapper = applyModalData
                        .attr('data-link-objectwrapper');
                
                var timestamp = Math
                        .round((new Date()).getTime() / 1000);
                
                
                // cmTagging for video tracking by Rick Young 9-10-13
                var cmTagElementId = applyModalData
        			.attr('data-link-cmtagelementid');
    	
                var cmTagElementCategory = applyModalData
					.attr('data-link-cmtagelementcategory');
    	
                var cmTagAttributes = applyModalData
					.attr('data-link-cmtagattributes');
                
                if (cmTagElementId !="" && cmTagElementId != undefined && cmTagElementId !='undefined' && cmTagElementCategory !="" && cmTagElementCategory != undefined && cmTagElementCategory !='undefined' ){
                	cmCreateElementTag(cmTagElementId, cmTagElementCategory);
                } else if (cmTagElementId !="" && cmTagElementId != undefined && cmTagElementId !='undefined' && cmTagElementCategory !="" && cmTagElementCategory != undefined && cmTagElementCategory !='undefined' && cmTagAttributes !="" && cmTagAttributes != undefined && cmTagAttributes !='undefined'){
                	cmCreateElementTag(cmTagElementId, cmTagElementCategory, cmTagAttributes);
                }
                
                fetchYouTubeVideo(videoId, fName, playerObjId,
                        objectPlaceholder, objectWrapper, timestamp);
            });

            fetchYouTubeVideo = function(videoId, fName, playerObjId,
                    objectPlaceholder, objectWrapper, timestamp) {
                
                var params = {
                    allowScriptAccess: "always",
                    wmode: "transparent"
                };
                var atts = {
                    id: playerObjId
                };
                
                onYouTubePlayerReady = function(playerId) {
                    var ytplayer = document.getElementById(playerObjId);
                    
                    ytplayer.addEventListener("onStateChange",
                            "onytplayerStateChange");
                }
                
                triggerStopVideo = function() {
                    var ytplayer = document.getElementById(playerObjId);
                    ytplayer.stopVideo();
                    jQuery(objectWrapper).removeClass('selected').css(
                            'display', 'none');
                }
                
                swfobject.embedSWF("http://www.youtube.com/v/" + videoId + "?enablejsapi=1&playerapiid=ytplayer&allowFullScreen=true&autohide=1&version=3&fmt=22&rel=0&vq=hd1080&autoplay=0&showinfo=0&ts="+ timestamp, objectPlaceholder, "640", "385", "8", null, null, params, atts); 
            }
        }
    }
})(jQuery);