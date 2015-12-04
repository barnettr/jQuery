;(function(jQuery){
	/* youtubegallery (rbarnett  10/19/2012) */
	jQuery.fn.youtubegallery = function(playlist) {
		
		return this.each(function() {
			var e = jQuery(this); // video
			var f = e.children("div"); // youtube
			var m_object = f.find('#myytplayer_fa'); // movie <object>
			var embed = m_object.children('#embed_movie');
			var paramMovie = m_object.children('#movie');
			var movieName = embed.attr('name');
			var t = e.children("ul");
			var isIE = (navigator.appVersion.indexOf("MSIE") != -1) ? true : false;
			var p = playlist || "5916B8D1F2B5F5DB";
			var baseURL = "http://gdata.youtube.com/feeds/api/playlists/"
					+ p
					+ "?alt=json&max-results=50&noStore=true&callback=?"
			
			jQuery.getJSON(baseURL, function(data) {
				var init = false;
				jQuery.each(data.feed.entry, function() {
					var url = this.media$group.media$content[0].url.split("?")[0];
					var videoId = url.substring(25);
					var img = this.media$group.media$thumbnail[1].url;
					var title = this.title.$t.replace("FIRST ASCENT: ","");
					var a = jQuery("<li><a href='"
						+ url
						+ "'><img src='"
						+ img
						+ "' width='120' height='90' target='_blank' /><span class='title'>"
						+ title.toUpperCase()
						+ "</span></a></li>");
					
					a.click(function() {
						var object = jQuery('#myytplayer_fa');
						var utoobVideoSrc = 'http://www.youtube.com/v/'
							+ videoId
							+ '?enablejsapi=1&playerapiid=video&allowFullScreen=true&autohide=1&version=3&fmt=22&hl=en_US&vq=hd1080&rel=0&showinfo=0&autoplay=0';
						
						var theMovie = '';
						theMovie += '<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0" id="myytplayer_fa" width="440" height="277">\n';
						theMovie += '<param id="movie" name="movie" value="' + utoobVideoSrc + '" />\n';
						theMovie += '<param name="allowFullScreen" value="true" />\n';
						theMovie += '<param name="allowscriptaccess" value="always" />\n';
						theMovie += '<param name="quality" value="hd1080" />';
						theMovie += '<embed name="myytplayer_fa" id="embed_movie" src="' + utoobVideoSrc + '" type="application/x-shockwave-flash" style="border:solid 1px #333333;" allowscriptaccess="always" allowfullscreen="true" width="440" height="277" />\n';
						theMovie += '</object>\n';
						
						object.replaceWith(theMovie);
						return false;
					});
					t.append(a);
					if (!init) {
						var utoobVideoSrc = 'http://www.youtube.com/v/'
							+ videoId
							+ '?enablejsapi=1&playerapiid=video&allowFullScreen=true&autohide=1&version=3&fmt=22&hl=en_US&vq=hd1080&rel=0&showinfo=0&autoplay=0';
						embed.attr('src', utoobVideoSrc);
						paramMovie.val(utoobVideoSrc);
						init = true;
					}
				});
				t.jcarousel({wrap:'circular',scroll:3});
	        });
		});
	}
})(jQuery);