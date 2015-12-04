(function(jQuery) {
	/*
	******************************************
	onYouTubePlayerReady 04/01/2012 - rbarnett
	******************************************
	*/
	jQuery.fn.onYouTubePlayerReady = function(youtubeVideo) {
		if (youtubeVideo) {
			
			jQuery(youtubeVideo)
				.each(
						function (index, value) {
							var data_link_name = jQuery(this).attr(
									"data-link-name");
							var videoSrc = jQuery(this).attr(
									"data-image-static");
							var youtubeValue = jQuery(this).attr(
									"data-youtube-value");
							var objectWrapper = 'youtube_'+youtubeValue;
														
							/*if (jQuery('#cat27411').length > 0 && youtubeVideo) {
								sessionStorage.setItem("$left", 303);
							}*/
							sessionStorage.setItem("name", data_link_name);
							sessionStorage.setItem("background", videoSrc);
							sessionStorage.setItem("wrapper", objectWrapper);
							switch (index) {
								case 0: sessionStorage.setItem("videoId0", youtubeValue);
										if (data_link_name.length > 34) {$height = 30;}else {$height = 20;}
										var videoLinkHTML_PPL = '<div class="product_page_link_'
											+ youtubeValue
											+ '" style="position:absolute;left:0;top:0;width:305px;" height="' 
											+ $height 
											+ '" id="' 
											+ index 
											+ '"><a name="static:image:videomodal" onclick="fb.start(&quot;/assets/html/modalContent/videoDivOne.html&quot;,&quot;type:ajax height:448 width:632 autoFitHTML:true scrolling:no outerClose:true controlsPos:tr afterItemEnd:returnCloseButton();&quot;);" title="Watch Video" class="floatbox fetch camera" rel="floatbox" href="javascript:void(0);'
											+ '" style="text-decoration:none !important; display:inline;float:left;width:19px !important;text-align:left !important;" id="' 
											+ index 
											+ '"><img src="/assets/ocp/product_page/video/video_camera_icon.gif" class="camera" border="0" alt="Watch Video" style="margin-top: 3px; margin-right: 5px; vertical-align: bottom;"></a><a onclick="fb.start(&quot;/assets/html/modalContent/videoDivOne.html&quot;,&quot;type:ajax height:448 width:632 autoFitHTML:true scrolling:no outerClose:true controlsPos:tr afterItemEnd:returnCloseButton();&quot;);" class="floatbox fetch video' 
											+ index 
											+ '" style="font-size:12px !important;font-weight:bold;display:inline;float:left;width:250px !important;text-align:left !important;" name="static:link:videomodal" title="Watch Video" rel="floatbox" id="' 
											+ index 
											+ '" href="javascript:void(0);'
											+ '">'
											+ data_link_name
											+ '</a></div>';
									break;
								case 1: sessionStorage.setItem("videoId1", youtubeValue);
										if (data_link_name.length > 34) {$height = 30;}else {$height = 20;}
										var videoLinkHTML_PPL = '<div class="product_page_link_'
											+ youtubeValue
											+ '" style="position:absolute;left:0;top:0;width:305px;" height="' 
											+ $height 
											+ '" id="' 
											+ index 
											+ '"><a name="static:image:videomodal" onclick="fb.start(&quot;/assets/html/modalContent/videoDivTwo.html&quot;,&quot;type:ajax height:448 width:632 autoFitHTML:true scrolling:no outerClose:true controlsPos:tr beforeItemEnd:triggerStopVideo(); afterItemEnd:returnCloseButton();&quot;);" title="Watch Video" class="floatbox fetch camera" rel="floatbox" href="javascript:void(0);'
											+ '" style="text-decoration:none !important;display:inline;float:left;width:19px !important;text-align:left !important;" id="' 
											+ index 
											+ '"><img src="/assets/ocp/product_page/video/video_camera_icon.gif" class="camera" border="0" alt="Watch Video" style="margin-top: 3px; margin-right: 5px; vertical-align: bottom;"></a><a onclick="fb.start(&quot;/assets/html/modalContent/videoDivTwo.html&quot;,&quot;type:ajax height:448 width:632 autoFitHTML:true scrolling:no outerClose:true controlsPos:tr beforeItemEnd:triggerStopVideo(); afterItemEnd:returnCloseButton();&quot;);" class="floatbox fetch video' 
											+ index 
											+ '" style="font-size:12px !important;font-weight:bold;display:inline;float:left;width:250px !important;text-align:left !important;" name="static:link:videomodal" title="Watch Video" rel="floatbox" id="' 
											+ index 
											+ '" href="javascript:void(0);'
											+ '">'
											+ data_link_name
											+ '</a></div>';
									break;
							}
							
							var videoLinkHTML = '<div class="product_page_link_'
									+ youtubeValue
									+ '" style="position:absolute;left:0;top:0;width:305px;" height="' 
									+ $height 
									+ '" id="' 
									+ index 
									+ '"><a name="static:image:videomodal" title="Watch Video" class="floatbox fetch camera" rel="floatbox" rev="type:ajax centerOnResize:true autoFitHTML:true width:640 height:385 scrolling:no outerClose:true hideObjects:false controlsPos:tr beforeItemEnd:triggerStopVideo();" href="#product_page_video_'
									+ youtubeValue
									+ '" style="text-decoration:none !important;display:inline;float:left;width:19px !important;text-align:left !important;" id="' 
									+ index 
									+ '"><img src="/assets/ocp/product_page/video/video_camera_icon.gif" class="camera" border="0" alt="Watch Video" style="margin-top: 3px; margin-right: 5px; vertical-align: bottom;"></a><a class="floatbox fetch video' 
									+ index 
									+ '" style="font-size:12px !important;font-weight:bold;display:inline;float:left;width:250px !important;text-align:left !important;" name="static:link:videomodal" title="Watch Video" rel="floatbox" id="' 
									+ index 
									+ '" rev="type:ajax centerOnResize:true autoFitHTML:true width:640 height:385 scrolling:no outerClose:true hideObjects:false controlsPos:tr beforeItemEnd:triggerStopVideo();" href="#product_page_video_'
									+ youtubeValue
									+ '">'
									+ data_link_name
									+ '</a></div>';
							
						
							var videoContainerHTML = '<div id="ppv_container_'
									+ youtubeValue
									+ '" class="ppv_container" style="display: none;"><div id="product_page_video_'
									+ youtubeValue
									+ '" style="width: 664px; height: 448px; background-image: url('
									+ videoSrc
									+ ');"><div style="position: absolute; padding-left: 550px; padding-top: 12px; width: 105px;"><div style="position: absolute; top: 50px; left: 12px;"><div class="youtube_'
									+ youtubeValue
									+ '" style="display: none;"><div id="ytapiplayer_'
									+ youtubeValue
									+ '"></div></div></div></div></div></div>';
							
							
							if (jQuery('#dossier.PPL .Column2 .infoModule').length) {
								if (jQuery(this).find('div.product_page_link_'+youtubeValue).length > 0) {
								} else {
									jQuery(this).append(videoLinkHTML_PPL);
								}
							} else {
								if (jQuery(this).find('div.product_page_link_'+youtubeValue).length) {
								} else {
									jQuery(this).append(videoLinkHTML);
								}
								if (jQuery('.infoModule').find('div#ppv_container_'+youtubeValue).length) {
								} else {
									jQuery('.infoModule').append(videoContainerHTML);
								}
							}
			});
			
			jQuery('.fetch').bind(
				'click',
				function() {
					var $thisContainer = jQuery(this).closest(
					'.product_page_video');
					var youtubeValue = $thisContainer.attr("data-youtube-value");
					var playerObjId = 'myytplayer_'+youtubeValue;
					var objectWrapper = 'youtube_'+youtubeValue;
					var objectPlaceholder = 'ytapiplayer_'+youtubeValue;

					// cmTagging for video tracking by Rick Young 9-10-13
	                var cmTagElementId = $thisContainer.attr('data-link-cmtagelementid');
	    	
	                var cmTagElementCategory = $thisContainer.attr('data-link-cmtagelementcategory');
	    	
	                var cmTagAttributes = $thisContainer.attr('data-link-cmtagattributes');	               
	                if (cmTagElementId !="" && cmTagElementId != undefined && cmTagElementId !='undefined' && cmTagElementCategory !="" && cmTagElementCategory != undefined && cmTagElementCategory !='undefined' ){	                
	                	cmCreateElementTag(cmTagElementId, cmTagElementCategory);
	                } else if (cmTagElementId !="" && cmTagElementId != undefined && cmTagElementId !='undefined' && cmTagElementCategory !="" && cmTagElementCategory != undefined && cmTagElementCategory !='undefined' && cmTagAttributes !="" && cmTagAttributes != undefined && cmTagAttributes !='undefined'){
	                	cmCreateElementTag(cmTagElementId, cmTagElementCategory, cmTagAttributes);
	                }
					
					fetchYouTubeVideo(youtubeValue, playerObjId,
							objectWrapper, objectPlaceholder);
				});
				

			fetchYouTubeVideo = function(youtubeValue, playerObjId,
					objectWrapper, objectPlaceholder) {
				
				jQuery('.'+objectWrapper).addClass('selected').css(
						'display', 'block');
				
				var params = {
					allowScriptAccess: "always",
					wmode: "transparent"
				};
				
				var atts = {
				    id: playerObjId
				};
				
				function onYouTubePlayerReady(playerObjId) {
					var ytplayer = document.getElementById(playerObjId);
					ytplayer.addEventListener("onStateChange",
							"onytplayerStateChange");
					
					if (ytplayer) {
				        ytplayer.playVideo();
				    }
				}
				triggerStopVideo = function() {
					var ytplayer = document.getElementById(playerObjId);
					ytplayer.stopVideo();
					jQuery('.'+objectWrapper).removeClass('selected').css(
							'display', 'none');
					jQuery('#fbBox #fbtrPanel').remove();
				}
				swfobject
						.embedSWF(
								"http://www.youtube.com/v/"
										+ youtubeValue
										+ "?enablejsapi=1&playerapiid=ytplayer&allowFullScreen=true&autohide=1&version=3&fmt=22&hl=en_US&vq=hd1080&rel=0&showinfo=0&autoplay=0",
								objectPlaceholder, "640", "385", "8", null,
								null, params, atts);
				jQuery('head')
					.append(
						'<style>#fbBox #fbtrPanel{right:-35px !important}</style>');
			}
		}	
	}
})(jQuery);