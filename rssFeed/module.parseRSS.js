(function(jQuery) {
	/*
	*********************************
	parseRSS 04/01/2012 - rbarnett
	*********************************
	*/
	jQuery.fn.parseRSS = function(url, callback) {
		var MaxCount = 3;

		jQuery
			.ajax({
				url : document.location.protocol
						+ '//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num='
						+ MaxCount + '&output=json&q='
						+ encodeURIComponent(url) + '&callback=?',
				crossDomain : true,
				dataType : 'json',
				success : function(data) {
					var feedList = '';
					feedList += '<ul id="rssEntries">';
					jQuery(data.responseData.feed.entries).each(function(i, entries) {
						feedList += '<li id="rssEntry'
								+ (i + 1) + '">'
								+ '<span class="rssEntry_title"><a href="'
								+ entries.link
								+ '">'
								+ entries.title
								+ '</a></span><br />';
						switch (i) {
							case 0:
								var imagestr = entries.content;
								var adventureLink = entries.link;
								var imgpos = imagestr
										.indexOf('src');
								var altpos = imagestr
										.indexOf('alt');
								var altContent = imagestr
										.substring(altpos);
								var newAltContent = altContent
										.match(/"([^"]+)"/)[1];
								var newimglink = imagestr
										.substring(imgpos);
								var imgLink = newimglink
										.match(/"([^"]+)"/)[1];
								var image = _getThumbnail(imgLink, newAltContent);
								feedList += '<div id="rssThumbnail" title="'
										+ image.newAltContent
										+ '"><a href="'
										+ adventureLink
										+ '"><img src="'
										+ image.imgLink
										+ '" width="150" height="90" alt="'
										+ image.newAltContent
										+ '" /></a></div>'
										+ '<span class="rssEntry_publishedDate">'
										+ _dateFormat(
												new Date(
														entries.publishedDate),
												"MM/DD/YYYY")
										+ '</span><br />';
								var str = entries.content;
								var pos = str.indexOf("<br>");
								pos = pos + 4
								var newContent = str
										.substring(pos);
								newContent = newContent.replace(/<\/?[a-z][a-z0-9]*[^<>]*>/ig, "");
								feedList += '<span class="rssEntry_description">'
										  + _truncateString(newContent)		
							break;
								
							case 1:
								var imagestr = entries.content;
								var adventureLink = entries.link;
								var imgpos = imagestr
										.indexOf('src');
								var altpos = imagestr
										.indexOf('alt');
								var altContent = imagestr
										.substring(altpos);
								var newAltContent = altContent
										.match(/"([^"]+)"/)[1];
								var newimglink = imagestr
										.substring(imgpos);
								var imgLink = newimglink
										.match(/"([^"]+)"/)[1];
								var image = _getThumbnail(imgLink, newAltContent);
								feedList += '<div id="rssThumbnail" title="'
										+ image.newAltContent
										+ '"><a href="'
										+ adventureLink
										+ '"><img src="'
										+ image.imgLink
										+ '" width="150" height="90" alt="'
										+ image.newAltContent
										+ '" /></a></div>'
										+ '<span class="rssEntry_publishedDate">'
										+ _dateFormat(new Date(entries.publishedDate),"MM/DD/YYYY") + '</span><br />';
								var str = entries.content;
								var pos = str.indexOf("<br>");
								pos = pos + 4
								var newContent = str
										.substring(pos);
								newContent = newContent.replace(/<\/?[a-z][a-z0-9]*[^<>]*>/ig, "");
								feedList += '<span class="rssEntry_description">' 
									+ _truncateString(newContent) 
							break;
								
							case 2:
								var imagestr = entries.content;
								var adventureLink = entries.link;
								var imgpos = imagestr
										.indexOf('src');
								var altpos = imagestr
										.indexOf('alt');
								var altContent = imagestr
										.substring(altpos);
								var newAltContent = altContent
										.match(/"([^"]+)"/)[1];
								var newimglink = imagestr
										.substring(imgpos);
								var imgLink = newimglink
										.match(/"([^"]+)"/)[1];
								var image = _getThumbnail(imgLink, newAltContent);
								feedList += '<div id="rssThumbnail" title="'
									+ image.newAltContent
									+ '"><a href="'
									+ adventureLink
									+ '"><img src="'
									+ image.imgLink
									+ '" width="150" height="90" alt="'
									+ image.newAltContent
									+ '" /></a></div>'
									+ '<span class="rssEntry_publishedDate">' + _dateFormat(new Date(entries.publishedDate),"MM/DD/YYYY") + '</span><br />'; 
								var str = entries.content;
								var pos = str.indexOf("<br>");
								pos = pos + 4
								var newContent = str
										.substring(pos);
								newContent = newContent.replace(/<\/?[a-z][a-z0-9]*[^<>]*>/ig, "");
								feedList += '<span class="rssEntry_description">'
									  	 + _truncateString(newContent)
							break;
						}
						feedList += '<dd><input type="button" value="" id="rssReadMore'
								+ i
								+ '" class="button" onclick="readMore(\''
								+ entries.link
								+ '\')"></dd>';
						feedList += '</span></li>';
					});
					feedList += '</ul>';
					jQuery('#rssFeed').append(feedList);
				}
			});

			var _dateFormat = function(date, format) {
				format = format.replace("MM", (date.getMonth() < 9 ? '0' : '')
						+ (date.getMonth() + 1));
				format = format.replace("DD", (date.getDate() < 10 ? '0' : '')
						+ date.getDate());
				format = format.replace("YYYY", date.getFullYear());
				return format;
			};
			
			var _getThumbnail = function(imgLink, newAltContent) { 
				if (!/.+\.(jpg|jpeg|png|gif)$/i.test(imgLink)) {
					var imgLink = '/assets/ocp/content/first_ascent/homepage/andes.jpg';
					var newAltContent = 'Live Your Adventure - The Official Blog of Eddie Bauer';
				} else {
					var imgLink = imgLink;
					var newAltContent = newAltContent; 
				}
				return {
			        imgLink: imgLink,
			        newAltContent: newAltContent
			    };
			};
	
			var _truncateString = function(strng, $truncateDesc) {
				var $length = 135;
				var $description = strng;
				var $truncateDesc = $description.substring(0, $length) + ' ...';
				return $truncateDesc;
			};
	}
})(jQuery)