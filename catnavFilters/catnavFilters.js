(function(jQuery){

	/* catNav Filters jQuery Module by Rick Young */
	
	jQuery.fn.catNavFilters = function(options) {
		
			// Following function will disable the href on the product image to be fired
			// as the onClick will take care of the call along with inventory check.
			jQuery('.prdImgClk').live('click', function(e) {
				e.preventDefault(); // stop default on click href
			});
			
			var updateCookieIfNeeded = function (url, paramName) {
				 var cookieParams = stringToParams (GetCookie('catNavPrefs'), true) ;
				 var urlParams = stringToParams (url, false) ;
				 if (cookieParams[paramName] != urlParams[paramName]) {
					 cookieParams[paramName] = urlParams[paramName] ;
					 var newCookieValue = paramsToString("", cookieParams) ;
					 SetCookie('catNavPrefs', newCookieValue, null, "/") ;
				 }
			} ;
			
			// private
			var o = options || {};	
			var cLog = jQuery('#console_log');
			
			//fix swatches
			if(jQuery.browser.msie && parseInt(jQuery.browser.version, 10) == 7 || jQuery.browser.msie && parseInt(jQuery.browser.version, 10) == 8) {
				jQuery('.productcolorswatches a:nth-child(7n)').addClass('last');
			}  
			
			
			// Add event listeners
			// type dropdown
			 jQuery('.categoryFilters #type').live('change', function(){
				 var typeURL = jQuery(this).val();
				 if(typeURL){
					 window.location = typeURL;
				 }else{
					 cLog.append("<span>Category Filter Type URL Error</span>");
				 }
			 });
			
			 // size dropdown
			 jQuery('.categoryFilters #size').live('change', function(){
				 var sizeURL = jQuery(this).val();
				 	if(sizeURL){
						window.location = sizeURL;
					 }else{
						 cLog.append("<span>Category Filter Size URL Error</span>");
					 }		 
			 });
			
			// color dropdown
			 jQuery('.categoryFilters #colorFilter').live('change', function(){
				 var colorURL = jQuery(this).val();
				 	if(colorURL){
						window.location = colorURL;
					 }else{
						 cLog.append("<span>Category Filter Color URL Error</span>");
					 }				 
			 });
			 
			 // page sort dropdown
			 jQuery('.paginator #pagesort').live('change', function(){
				 var pageSortURL = jQuery(this).val();
				 	if(pageSortURL){
						updateCookieIfNeeded (pageSortURL, 'sort') ;
						window.location = pageSortURL;
					 }else{
						 cLog.append("<span>Category Filter Page Sort URL Error</span>");
					 }				 
			 });
						 
			 // pagination links
			 jQuery('.paginator a').live('click', function(){
				 var pageURL = jQuery(this).attr('href');
				 	if(pageURL){
						updateCookieIfNeeded (pageURL, 'view') ;
						window.location = pageURL;
						return false ;
					 }		 
			 });
			 
			 // add swatch image listeners
				jQuery('.productcolorswatches a.swatch').live('click',function(e){		
					e.preventDefault(); // stop default on click href			
					var swatchID = jQuery(this);			
					var swatchImageSrc = swatchID.find('img').attr('data-main');
					var productCellID = swatchID.closest('.cell');				
					var mainImageID = productCellID.find('.productImages a img');
					var mainImageDataTagName = "data-src";
					var mainImageDataTagAttr = mainImageID.attr(mainImageDataTagName);
						jQuery(productCellID).find('.swatch').removeClass('selected');
						jQuery(swatchID).addClass('selected');
					if (!mainImageDataTagAttr){ // if tag exists don't store image src
						mainImageID.attr(mainImageDataTagName, swatchImageSrc);
					}
					// change image
					mainImageID.attr('src', swatchImageSrc);
					// SWATCH COLOR CHANGE, CHANGE HREF param.
					var colorid = swatchID.find('img').attr('colorid');
				   if (colorid) {
				          var pidvar = mainImageID.attr('pidvar');
				     if (pidvar) {
				                  var prodHrefId = pidvar+'_url';
				        if ($(pidvar)) {
	                        var hrefValue = $(pidvar).value;
	                    	hrefValue = hrefValue+"&colorId="+colorid;
	                    		if ($(prodHrefId)) {
	                    				$(prodHrefId).setAttribute('href',hrefValue);
	                    		}
	                    		$(pidvar).setAttribute('value', hrefValue);
				        }
				     }
				   }
								
				});
				
				jQuery('.productcolorswatches a.swatch').live('mouseover', function(){
					var swatchID = jQuery(this);					
					jQuery(swatchID).addClass('hover');			
				});
				
				jQuery('.productcolorswatches a.swatch').live('mouseout', function(){
					var swatchID = jQuery(this);					
					jQuery(swatchID).removeClass('hover');			
				});
				
			// add bread crumb remove listeners
			jQuery('#filters-breadcrumbs .removeButton').click( function(){
				 var pageURL = jQuery(this).val();
				 	if(pageURL){
						window.location = pageURL;
					 }else{
						 cLog.append("<span>Category Filter Page Remove URL Error</span>");
					 }				 
			 });
		};
		
		jQuery.fn.adjustCategoryLinks = function() {
			var currTime = new Date().getTime();
			var i = 0 ;

			var toCheck = ['sort', 'view'] ;
			var cookieParams = stringToParams (GetCookie('catNavPrefs'), true) ;
			
			jQuery('a:not(.paginator a)').each (function() {
				var thisLink = jQuery(this) ;
				var href = thisLink.attr('href') ;
				if (href && href.indexOf ("/index.cat") != -1) {

					var base  = href ;
					var params = "" ;
					
					if (href.indexOf ('?') != -1) {
						var temp = href.split('?') ;
						base = temp[0] ;
						params = temp[1] ;
					}
					
					var urlParams = stringToParams (params, true) ;
					var changed = false ;
					
					for (var j=0; j < toCheck.length; j++) {
						var key = toCheck[j] ;
						if (cookieParams[key] != urlParams[key]) {
							urlParams[key] = cookieParams[key] ;
							changed = true ;
						}
					}

					if (changed) {
						var newHref = paramsToString (base, urlParams) ;
						/*console.log ((++i) + " - " + href + " -> " + newHref) ;*/
						thisLink.attr ('href', newHref) ;
					}
				}
			}) ;
			currTime = new Date().getTime() - currTime ;
			/*console.log ("Time to run adjustCategoryLinks(): " + currTime) ;*/
		} ;
		
})(jQuery);