;(function(jQuery){
	/* 
	Product Layer/Standalone jQuery Module by Rick Young 
	Version: 1.0
	Date: 3/9/2012 
	*/
	
	var styleChangedFlag = false;
	var setPDPRadioButtons = false;
	var getInformationFlag = false;
	var initProductModuleFlag = false;
	
	jQuery.fn.ProductModule = function(options) {			
		var thresholdQty = 10;		
		var validFlag = false;
		var selectionsFlag = false;
		var selectedSizeChartTab = 0;
		var itemInventorySizeStatus = "";
		var itemInventorySizeName = "";
		var itemInventoryColorStatus = "";
		var itemInventoryColorName = "";
		var zoomFullScreenFlag = false;
		var loadImageTransitionFlag = false;
		var selectedColorIdHash = "";
		var pricesLoaded = false; 
		var priceObjDB = {};	
		var addToWishList = false;
		var firstSelector = "";
		var comboPDPPage = false; //eob and clearance
		var clearanceSwatchFlag = false; //eob if user selects a clearance swatch
		var toolTipContentLoaded = false;
		var zoomMessage = "<div class='Zoomable'><span class='icon zoomMessage'></span><span class='text'>Roll over image to zoom in</span><a href='javascript:void(0);' class='zoomFullScreenAlt'><span class='icon imageMessage'></span><span class='text largerClick'>Click for larger image</span></a></div>";
		var currentCartCount = 0;	
		var selectedQty = 0;
		var maxItemsinCart = jQuery(targetPage+'#dash input[name=maxCartSize]').val() || 99;
		var cartItemsTotal = 0;
		var clearanceFlag = "N";
				
		//set any cookie info here
		var updateCookieIfNeeded = function (url, paramName) {
			 var cookieParams = stringToParams (GetCookie('productModulePrefs'), true) ;
			 var urlParams = stringToParams (url, false) ;
			 if (cookieParams[paramName] != urlParams[paramName]) {
				 cookieParams[paramName] = urlParams[paramName] ;
				 var newCookieValue = paramsToString("", cookieParams) ;
				 SetCookie('productModulePrefs', newCookieValue, null, "/") ;
			 }
		};
					
		// private		
		var o = options || {};	
		var cssClass = o.cssClass || {};
		var selectedTab = o.selectedTab || '';
		var cLog = jQuery('#console_log');
		var PP = jQuery('#dossier').hasClass('PP'); //set true if standalone Product Page
		var PPL = jQuery('#fbBox #dossier').hasClass('PPL'); //set true if Product Page Layer
		if (PPL){
			var eob = jQuery('#fbBox #dossier').hasClass('eob'); // set true if eob page and PPL
			var soldOut = jQuery('#fbBox #dossier').hasClass('soldout'); //set true if soldout and PPL
			var editMode = jQuery('#fbBox #dossier').hasClass('EDIT'); //set true if soldout and PPL			
		}else{
			var eob = jQuery('#dossier').hasClass('eob'); // set true if eob page
			var soldOut = jQuery('#dossier').hasClass('soldout'); //set true if soldout
			var editMode = jQuery('#dossier').hasClass('EDIT'); //set true if soldout
		}		
		if (PPL){
			var targetPage = '#fbBox #dossier.PPL ';
		}else{
			var targetPage = '#dossier ';
		}
		
		if (cssClass)					
			jQuery(this).addClass(cssClass);
					
			/* Common methods */	
				
		// UPDATE THE URL USED BY MAGICZOOM FOR THE LARGE IMAGE
		var defaultImageUrl = jQuery('#itemZoom').attr('href');
		if (defaultImageUrl != undefined){
			//var mainProductImageZoom = defaultImageUrl.replace('$mainImage$&wid=400&hei=496','&op_sharpen=1');
			//jQuery('#itemZoom').attr('href',mainProductImageZoom);
		}else{
			defaultImageUrl = "";
		}
		imageThumbScroll = function() {
			if (PP){
				var imageThumbsScroll = 5; // how many thumbs to show on Product Page before adding magic scroll
				var widthThumbsScroll = 400;
			}else{
				var imageThumbsScroll = 4; // how many thumbs to show on Product Page Layer before adding magic scroll
				var widthThumbsScroll = 332;
			}
			var imageThumbs = jQuery(targetPage+'#imageThumbs a');
			var imageThumbsCount = imageThumbs.length;
			if (imageThumbsCount > imageThumbsScroll) {
				jQuery(targetPage+'#imageThumbs').addClass("MagicScroll");	
					MagicScroll.options = {
						'items': imageThumbsScroll,						
						'width': widthThumbsScroll,
						'speed' : 0
					}				
			}
			
		}
		assignEventHandlers = function(){
		jQuery(targetPage+'.toolTip').click(function (event) {
			 if (event.stopPropagation){
			       event.stopPropagation();
			 }
			   else if(window.event){
			      window.event.cancelBubble=true;
			 }
		});
		jQuery(targetPage+'.toolTip').hover(
			function() {
				this.contentHref = jQuery(this).attr("href");
				jQuery(this).addClass('over');
				var isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
				var contentOffset = jQuery(this).position();
				alert(contentOffset.left);
				var contentXpos = contentOffset.left;
				var contentYpos = contentOffset.top;
				this.contentOverlay = '#overlay_' + this.contentHref.replace('#','');		
				jQuery(this).append(
					'<div id="ToolTipOverlay" class="toolTipWrapper" style="z-index:9999;width:250px">'		
					+'</div>'
				);
				if (jQuery(this).attr('id') == "DropShip") {
					jQuery('#ToolTipOverlay').html( jQuery(this.contentOverlay).html() );
					if (PPL) {
						jQuery('#ToolTipOverlay').css({marginLeft: contentXpos-40, marginTop: contentYpos-268, width: 350, position: "relative"});
					} else {
						jQuery('#ToolTipOverlay').css({marginLeft: contentXpos, marginTop: contentYpos-330, width: 350, position: "relative"});		
					}
					jQuery('.toolTipWrapper').fadeIn(300);
				} else {
					jQuery('#ToolTipOverlay').html( jQuery(this.contentOverlay).html() );
					jQuery('#ToolTipOverlay').css({left: contentXpos-100, top: contentYpos+15});		
					jQuery('.toolTipWrapper').fadeIn(300);
					jQuery('div#ToolTipOverlay').next().remove();
				}
			},
			function() {
				jQuery('.toolTipWrapper').fadeOut(100);
				jQuery(this).removeClass('over');
				jQuery(this).children().remove();
			}
		);
		// full screen zoom	
		zoomFullScreen();						
		// alt images
		jQuery(targetPage+'#imageThumbs a').click(function (){
			jQuery(targetPage+'#imageThumbs a').removeClass('selected');
			jQuery(this).addClass('selected');	
			zoomImageCheck(jQuery(this),'alt');					
		});	
		jQuery(targetPage+'#imageThumbs a').live('mouseover', function(){
			jQuery(targetPage+'#imageThumbs a').removeClass('hover');
			jQuery(this).addClass('hover');				
		});	
		jQuery(targetPage+'#imageThumbs a').live('mouseout', function(){
			jQuery(targetPage+'#imageThumbs a').removeClass('hover');								
		});				
		//swatches non-clearance
		jQuery(targetPage+'#swatches a').live('click', function (event){
			getInformationFlag = true;
			if (jQuery(this).parent().hasClass('soldout')){
				
			}else if(!loadImageTransitionFlag){
				loadImageTransitionFlag = true;
				comboPDPPage = false;
				clearanceSwatchFlag = false;
				jQuery(targetPage+'#swatches a').closest('dd').removeClass('hot');					
				jQuery(this).parent().addClass('hot');
				// set dropdown selection	
				var selectedColor = jQuery(this).find('img').attr('data-swatch-number');
				var selectedColorName = jQuery(this).find('img').attr('alt');
				
				if (clearanceFlag == "Y") {
					var colorSizeVal = jQuery(targetPage+'#colorsize').val();
					//jQuery(targetPage+'#colorsize').val(jQuery("optgroup[label='" + selectedColorName + "']").children('option:first').val());
					//jQuery(targetPage+'input[name=selectedColorSizeId]').val(jQuery(targetPage+'#colorsize').val());
					getInformationFlag=false;
				} else {
					// also set selected color here
					jQuery(targetPage+'#color').val(selectedColor);
					jQuery(targetPage+'input[name=selectedColorId]').val(selectedColor);
				}

					
				updateSwatchInfo();	
				updateContolPanel();																	
				validateSelections();											
				var swatchID = '#swatch'+ jQuery.trim(selectedColor);				
				zoomImageCheck(swatchID,'swatch');					
				loadMainProductImage(swatchID);							
			}					
		});				
		jQuery(targetPage+'#swatches a').live('mouseover', function(){							
			jQuery('#swatches a').closest('dd').removeClass('hover');
			var swatchHover = jQuery(this).closest('dd');
			var swatchHoverHref = jQuery(this).closest('dd a');
			swatchHover.addClass('hover');
			updateSwatchInfo(swatchHoverHref);				
		});
		jQuery(targetPage+'#swatches a').live('mouseout', function(){
			jQuery('#swatches a').closest('dd').addClass('not').removeClass('hover');
			updateSwatchInfo();				
		});	
		
		//swatches clearance
		jQuery(targetPage+'#swatchesClearance a').live('click', function (event){
			getInformationFlag = true;			
			if (jQuery(this).parent().hasClass('soldout')){
				
			}else if(!loadImageTransitionFlag){
				loadImageTransitionFlag = true;
				comboPDPPage = true;
				clearanceSwatchFlag = true;
				jQuery(targetPage+'#swatchesClearance a').closest('dd').removeClass('hot');					
				jQuery(this).parent().addClass('hot');
				// set dropdown selection	
				var selectedColor = jQuery(this).find('img').attr('data-swatch-number');					
				// also set selected color here
				jQuery(targetPage+'#color').val(selectedColor);
				jQuery(targetPage+'input[name=selectedColorId]').val(selectedColor); 						
				updateSwatchInfo();	
				updateContolPanel();																	
				validateSelections();											
				var swatchID = '#swatch'+ jQuery.trim(selectedColor);				
				zoomImageCheck(swatchID,'swatch');	
				loadMainProductImage(swatchID);							
			}					
		});				
		jQuery(targetPage+'#swatchesClearance a').live('mouseover', function(){							
			jQuery('#swatchesClearance a').closest('dd').removeClass('hover');
			var swatchHover = jQuery(this).closest('dd');
			var swatchHoverHref = jQuery(this).closest('dd a');
			swatchHover.addClass('hover');
			updateSwatchInfo(swatchHoverHref);				
		});
		jQuery(targetPage+'#swatchesClearance a').live('mouseout', function(){
			jQuery('#swatchesClearance a').closest('dd').addClass('not').removeClass('hover');
			updateSwatchInfo();				
		});			
		// add to bag button
		jQuery(targetPage+'#addToCart').click(function (event){
			addToWishList = false;
		});
		// add to wishlist button
		jQuery(targetPage+'.saveToWishList').click(function (){				
			addToWishList = true;
			addToBag(jQuery('form[name=productForm]'),'true');				
		});				
		// input options
		jQuery(targetPage+'#size').live('change', function(){
			getInformationFlag = true;
			validateSelections();
			jQuery(targetPage+'input[name=selectedSizeId]').val(jQuery(targetPage+'#size').val()); 
			// update control panel
			updateContolPanel();
		});
		jQuery(targetPage+'#color').live('change', function(){
			getInformationFlag = true;
			validateSelections();
			updateSwatchInfoDropdown();
			//update selected color
			jQuery(targetPage+'input[name=selectedColorId]').val(jQuery(targetPage+'#color').val());
			zoomImageCheck(jQuery(targetPage+'#swatches dd.hot'),'swatch');
			updateContolPanel();
		});
		jQuery(targetPage+'#colorsize').live('change', function(){
			getInformationFlag = false;
			validateSelections();
			updateSwatchInfoDropdown();
			//update selected color
			jQuery(targetPage+'input[name=selectedColorSizeId]').val(jQuery(targetPage+'#colorsize').val());
			zoomImageCheck(jQuery(targetPage+'#swatches dd.hot'),'swatch');
			updateContolPanel();
		});

		jQuery(targetPage+'#inSeamLength').live('change', function() {				
			if (jQuery(targetPage+'#inSeamLength').val() !="default") {
				jQuery(targetPage+'input[name=selectedInseamLength]').val(jQuery(targetPage+'#inSeamLength').val());
			} else {
				jQuery(targetPage+'input[name=selectedInseamLength]').val("");					
			}
			validateSelections();
		});
		jQuery(targetPage+'#hemStyle').live('change', function() {
			if (jQuery(targetPage+'#hemStyle').val() !="default") {
				jQuery(targetPage+'input[name=selectedHemStyle]').val(jQuery(targetPage+'#hemStyle').val());
			} else {
				jQuery(targetPage+'input[name=selectedHemStyle]').val("");					
			}
			validateSelections();
			updateInseamLength();
		});
		jQuery(targetPage+'#inSeamLength').attr("disabled", "disabled");		
		//radio buttons
		jQuery(targetPage+'.selectCut .radio').live('change', function() {	
			// get pid value from radio button
			jQuery(targetPage+'input[name=productId]').val( jQuery(targetPage+"input[name=cut]:checked").val() );
			//reset size
			jQuery(targetPage+'#size').val("null");
			jQuery(targetPage+'input[name=selectedSizeId]').val(jQuery(targetPage+'#size').val());
			styleChangedFlag = true;	
			updateInseam();
			updateItemNumber();					
		});
		// tool tips
		var tooltipID = jQuery(targetPage+'a.tipLink').each(function(index){
	        jQuery(this).attr("id", "tipLink" + index);
	    });
		if (PPL) {
			jQuery(tooltipID).each(function() {
		        jQuery(this).qtip({
					content: {
						text: jQuery(this).attr('data-tipText'),
						title: jQuery(this).attr('data-tipTitle')
					},
					style: {
						tip : {
							width: jQuery(this).attr('data-tipX'),
							height: jQuery(this).attr('data-tipY')
						},
						width: jQuery(this).attr('data-tipWidth'),
						classes: jQuery(this).attr('data-tipClass')
					},			
					show: 'mouseover',		
					hide: {
						event: 'mouseleave'
					},
					position: {
						at: jQuery(this).attr('data-tipTarget'),
						my: jQuery(this).attr('data-tipTip'),
						container: jQuery('#dossier'),
						viewport: false
					}	
				});
			});	
		} else {
			jQuery(tooltipID).each(function() {
		        jQuery(this).qtip({
					content: {
						text: jQuery(this).attr('data-tipText'),
						title: jQuery(this).attr('data-tipTitle')
					},
					style: {
						tip : {
							width: jQuery(this).attr('data-tipX'),
							height: jQuery(this).attr('data-tipY')
						},
						width: jQuery(this).attr('data-tipWidth'),
						classes: jQuery(this).attr('data-tipClass')
					},			
					show: 'mouseover',		
					hide: {
						event: 'mouseleave'
					},
					position: {
						at: jQuery(this).attr('data-tipTarget'),
						my: jQuery(this).attr('data-tipTip')
					}			
					
				});
			});
		}
		var tooltipID = jQuery(targetPage+'a.tipLinkMSG').each(function(index) {
	        jQuery(this).attr("id", "tipLink" + index);
	    });
		
	    jQuery(tooltipID).each(function() {
	        jQuery(this).qtip({
				content: {
					text: jQuery(this).attr('data-tiptext'),
					title: jQuery(this).attr('data-tiptitle')
				},				
				style: {
					tip : {
						width: 8,
						height: 16
					},
					width: jQuery(this).attr('data-tipwidth'),
					classes: jQuery(this).attr('data-tipclass')
				},			
				show: 'mouseover',
				events: {
					show: function(event, api) {
							var sizeValue = jQuery(targetPage+'#size').val();	
							var sizeText = jQuery(targetPage+'#size :selected').text();
							var colorValue = jQuery(targetPage+'#color').val();						
							var hemValue = jQuery(targetPage+'#hemStyle').val();
							var inseamValue = jQuery(targetPage+'#inSeamLength').val();
							var showMessage = true;
							var inputsCount = 0;
							var validatedCount = 0;
							var soldOutFlag = false;
							var colorSizeValue = jQuery(targetPage+'#colorsize').val();
					
							clearanceFlag = jQuery(targetPage+'#clearanceCategory').val();
					
							if (clearanceFlag === "Y") {
						
								// get count of inputs on page
								if (colorSizeValue != null && colorSizeValue.length != 0) {
									inputsCount ++;
								}
						
								// get vaild count; clearance page will never show soldout/only few left/available msg. still safe to check the flag here.
								if (colorSizeValue !="null" && colorSizeValue != null && colorSizeValue.length != 0 && soldOutFlag == false){
									validatedCount ++;
								}
						
							} else {

								if(sizeText.indexOf('Sold Out') !=-1) {
									//Size Sold Out							
									soldOutFlag = true;
								}
						
								// get count of inputs on page
								if (sizeValue != null && sizeValue.length != 0) {
									inputsCount ++;
								}
								if (colorValue != null && colorValue.length != 0) {
									inputsCount ++;
								}
						
								// get vaild count
								if (sizeValue !="null" && sizeValue != null && sizeValue.length != 0 && soldOutFlag == false) {
									validatedCount ++;
								}
								if (colorValue !="null" && colorValue !=null && colorValue.length != 0 && soldOutFlag == false) {
									validatedCount ++;
								}
						
							}
					
							if (hemValue == "Unfinished" && hemValue.length != 0) {
								inputsCount ++;
							} else {
								if (inseamValue != null && !jQuery(targetPage+'#inseamDetails').hasClass('errorHide')) {
									if (hemValue != null && hemValue.length != 0) {
										inputsCount ++;
									}
									if (inseamValue != null && inseamValue.length != 0) {
										inputsCount ++;
									}
								}
							}
					
					
							if (hemValue == "Unfinished" && hemValue.length != 0) {
								validatedCount ++;
							} else {
								if (!jQuery(targetPage+'#inseamDetails').hasClass('errorHide') && inseamValue != null) {
									if (hemValue !="null" && hemValue.length != 0) {
										validatedCount ++;
									}
									if (inseamValue !="null" && inseamValue.length != 0) {
										validatedCount ++;
									}	
								}
							}
							//console.log('inputsCount='+inputsCount+' validatedCount='+validatedCount);
							if(inputsCount == validatedCount) {								
								// IE might throw an error calling preventDefault(), so use a try/catch block.
								selectionsFlag = true;
								try { event.preventDefault(); } catch(e) {  }						
							} else {
								selectionsFlag = false;
							}
					}
				},
				hide: {
					event: 'mouseleave'
				},
				position: {
					at: jQuery(this).attr('data-tiptarget'),
					my: jQuery(this).attr('data-tiptip'),
					container: jQuery('#dossier'),
					viewport: true
				}			
				
			});
		}); 
	    addTooltips = function() { 
	    	if (!toolTipContentLoaded) {
			       	jQuery(targetPage).append("<div id='toolTipWrap'></div>");
			       	jQuery(targetPage+'#toolTipWrap').load('/assets/html/pdpTooltips/pdpTooltips.html'); 
			      // 	jQuery(targetPage + '#toolTipWrap').eq(1).remove();
			       	toolTipContentLoaded = true;
	    	}
		}
	    
	    if (PPL) {
		    var youtubeVideo = jQuery(targetPage+'.product_page_video');
		    if (youtubeVideo) {
				jQuery.fn.onYouTubePlayerReady(youtubeVideo);
			}
		} else if (PP) {
			var youtubeVideo = jQuery(targetPage+'.product_page_video');
			if (youtubeVideo) {
				jQuery.fn.onYouTubePlayerReady(youtubeVideo);
			}
		}
		
		jQuery("#aboutGiftBox #closeButton input[name=submit]").live('click', function () {
				jQuery('#fbClose').trigger('click');
        });
		
		// ui tabs
		jQuery(targetPage+"#tabs").tabs();
		
		}
		
		updateInseam = function() {
			var radioButton = jQuery(targetPage+'input:radio[name=cut]:checked');
			var cutID = jQuery(radioButton).attr('id');	
			if (cutID){
				var cutNumber = cutID.replace('cut','');
				var inseamId = 'inseamFlag_'+cutNumber;
				var itemNumberId = 'desCode'+cutNumber;
				var itemNumber = jQuery(radioButton).attr('data-item-number');			
				var itemNumberValue = itemNumber.substring(itemNumber.length-4, itemNumber.length);
				if (itemNumberValue !=""){
					jQuery(targetPage+'input[name=item]').val(itemNumberValue);
					jQuery(targetPage+'input[name=itemNumber]').val(itemNumberValue);
				}
			}
			var inseamFlag = jQuery(targetPage+'input[name='+inseamId+']').val();				
			if (inseamFlag == 'true'){
				jQuery('#inseamDetails').removeClass('errorShow').removeClass('errorHide');
				updateInseamLength();
			}else if(inseamFlag == 'false'){				
				jQuery('#inseamDetails').removeClass('errorShow').addClass('errorHide');
			}else{
				jQuery('#inseamDetails').removeClass('errorShow').addClass('errorHide');
			}
		}
			
		zoomFullScreen = function(){
			// full screen zoom
			jQuery(targetPage+'.zoomFullScreenAlt').click(function (event){	
				if (jQuery(targetPage+'.mainImage').hasClass('Zoom')){// check to see if image zoomable
					//get image info to pass to full screen html
					// image src, color ID, color name
					var imageSrc = jQuery(targetPage+'.MagicZoomPlus').attr('href');				
					var imageColorName = jQuery('.imageColor .name').html();
					var params = "?imageSrc="+imageSrc+"&imageColorName="+imageColorName;				
					var exitButton = "<div class='optionalExitControls'><div class='exitImage'><span class='icon'></span><span class='text'></span></div></div>";
					if (!zoomFullScreenFlag){
						var pdpURL = rewirteUrl('/catalog/dossier_zoom_fullscreen.jsp'+params);	
						console.log("pdpURL 1="+pdpUR);
						fb.start(pdpURL , 'type:iframe height:90% width:95% autoFitHTML:true scrolling:true outerClose:true controlsPos:tr beforeItemEnd:saveParams();');
						zoomFullScreenFlag = true;
					}
					//add exit button to modal	
					function displatExitButton(){
						jQuery('#fbBoxLiner').append(exitButton);
						jQuery('.optionalExitControls').live('click', function(){
							jQuery('#fbClose').trigger('click');
						});							
					}
					fb.DOMReady( displatExitButton );
				}
			});	
			jQuery(targetPage+'.zoomFullScreen').click(function (event){
				if (jQuery(targetPage+'.mainImage').hasClass('Zoom')){// check to see if image zoomable					
					//get image info to pass to full screen html
					// image src, color ID, color name
					var imageSrc = jQuery(targetPage+'.MagicZoomPlus').attr('href');				
					var imageColorName = jQuery('.imageColor .name').html();
					var params = "?imageSrc="+imageSrc+"&imageColorName="+imageColorName;				
					var exitButton = "<div class='optionalExitControls'><div class='exitImage'><span class='icon'></span><span class='text'></span></div></div>";
					if (!zoomFullScreenFlag){
						var pdpURL = rewirteUrl( '/catalog/dossier_zoom_fullscreen.jsp'+params);	
						console.log("pdpURL 2="+pdpUR);
						fb.start(pdpURL, 'type:iframe height:90% width:95% autoFitHTML:true scrolling:true outerClose:true controlsPos:tr beforeItemEnd:saveParams();');
						zoomFullScreenFlag = true;
					}
					//add exit button to modal	
					function displatExitButton(){
						jQuery('#fbBoxLiner').append(exitButton);
						jQuery('.optionalExitControls').live('click', function(){
							jQuery('#fbClose').trigger('click');
						});						
					}
					fb.DOMReady( displatExitButton );
				}
			});	
		}
		saveParams = function(){
			zoomFullScreenFlag = false;			
			var selectedColorId = jQuery("#fbContent").contents().find('#selectedColorId').val();
			updateColorInfoDropdown(selectedColorId);
			jQuery(targetPage+'#color').val(selectedColorId);
		}			
		getProductPageHash = function(){
			jQuery.extend({
				  getUrlVars: function(){
				    var vars = [], hash;
				    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
				    for(var i = 0; i < hashes.length; i++)
				    {
				      hash = hashes[i].split('=');
				      vars.push(hash[0]);
				      vars[hash[0]] = hash[1];
				    }
				    return vars;
				  },
				  getUrlVar: function(name){
				    return jQuery.getUrlVars()[name];
				  }
				});
			selectedColorIdHash = jQuery.getUrlVar('colorId');			
		}
		
		// Following setProductPageHash is commented out as this is not going to be used anywhere. It will get removed in future versions.
		/*setProductPageHash = function(){
			if (selectedColorIdHash != null || selectedColorIdHash !=""){
				//set dropdown 				
				jQuery(targetPage+'#color').val(selectedColorIdHash);
				//set swatches
				jQuery(targetPage+'#swatch'+selectedColorIdHash).addClass('hot');
				updateSwatchInfoDropdown();
				//update selected color
				jQuery(targetPage+'input[name=selectedColorId]').val(selectedColorIdHash);
				var selectedSwatchHash = targetPage+'#swatch'+selectedColorIdHash;				
				updateContolPanel();				
				zoomImageCheck(selectedSwatchHash,'swatch');
			}		
		}*/
		checkItemsInBag = function(){
			var currentCartItems = jQuery('#bagLink #itemsCount').html();			
			var currentCartSplit = currentCartItems.split(" ");
			currentCartCount = parseInt(currentCartSplit[0]);			
			selectedQty = parseInt( jQuery(targetPage+'#quantity').val() );
			cartItemsTotal = currentCartCount + selectedQty;
			//console.log("currentCartCount="+currentCartCount+" selectedQty="+selectedQty+" selectionsFlag="+selectionsFlag);			
			if(cartItemsTotal > maxItemsinCart && selectionsFlag == true && editMode == false){
				validFlag = false;
				shoppingBagFull();
			}else if (selectionsFlag == true && editMode == true){
				// allow save from shopping bag
			}
		}
		updateItemsInBagMessage = function(){
			// update maxItem Number, totlal and items over maxItem number here
			jQuery('#shoppingBagLimit .maxItemLimit').html("("+maxItemsinCart+")");
			jQuery('#shoppingBagLimit .currentShoppingBagItems').html("("+currentCartCount+")");			
			jQuery('#shoppingBagLimit .cartItemOvererage').html("(" +(cartItemsTotal - maxItemsinCart)+")");			
		}
		shoppingBagFull = function(){				
			fb.start('/assets/html/shoppingBagLimit/shoppingbaglimit.html','type:ajax height:210 width:450 autoFitHTML:true scrolling:no outerClose:true controlsPos:tr afterItemStart:updateItemsInBagMessage()');
		}
		updateItemNumber = function() {
			getInformationFlag = true;
			var selectInput = jQuery('input:radio[name=cut]:checked');				
			var itemTitle = jQuery('.itemNumber span');
			var itemNumber = jQuery('.itemNumber .number');
			var itemDataTitle = selectInput.attr('data-item-name');
			var itemDataNumber = selectInput.attr('data-item-number');
			if (itemDataNumber != undefined){
				itemTitle.html(itemDataTitle + ' Item #: ');
				itemNumber.html(itemDataNumber);
			}
			var mode = jQuery("#mode").val();			
			if (mode !== 'edit' || styleChangedFlag) {
				// Reset the styleChangedFlag back to false, to stop update control panel call.
				styleChangedFlag = false;
				// update control panel
				updateContolPanel(); //BUG01940 : For Editing product page, This call unnecessarily triggers getcolors and getsizes again and again. So commented out.				
			}		
		}
		
		function typeOf(o){
			var type = typeof o;
		         //If typeof return something different than object then returns it.
			if (type !== 'object') {
				return type;
		         //If it is an instance of the Array then return "array"
			} else if (Object.prototype.toString.call(o) === '[object Array]') {
				return 'array';
		         //If it is null then return "null"
			} else if (o === null) {
				return 'null';
		       //if it gets here then it is an "object"
			} else {
				return 'object';
			}
		}
		addToBag = function(productForm, addToWishListFlag){			
			var sizeValue = jQuery(targetPage+'#size').val();
			var sizeText = jQuery(targetPage+'#size :selected').text();
			var colorValue = jQuery(targetPage+'#color').val();
			var colorText = jQuery(targetPage+'#color :selected').text();
			var soldOutFlag = false;
			if (addToWishListFlag){
				addToWishList = true;
			}else{
				addToWishList = false;
			}				
			if (jQuery('#dossier').hasClass('WISHLIST')){
				addToWishList = true;			
			}			
			if(sizeText.indexOf('Sold Out') !=-1){
				//Size Sold Out
				itemInventorySizeStatus = "Sold Out";
				itemInventorySizeName = sizeText.replace(' - Sold Out','');
				itemInventoryColorStatus = "Sold Out";
				itemInventoryColorName = colorText.replace(' - Sold Out','');
				soldOutFlag = true;
			}
			
			if(addToWishList)
			{
				validateSelections('addtowishlist');
			}
			else
			{
				validateSelections('addtobag');
			}
			
			if(soldOutFlag && itemInventorySizeStatus =="Sold Out" && itemInventoryColorStatus =="Sold Out"){
				var message = itemInventoryColorName + ' in Size '+itemInventorySizeName+' is no longer available. Please try a different color or size.';
				errorTipSoldOutShow(targetPage+'#size',message);
				jQuery(targetPage+'#color').addClass('error');
			}				
			if (!addToWishList){
				//if monogram checked and form valid
				if (soldOutFlag == false && jQuery(targetPage+'#monogramCheck').is(':checked') && validFlag == true) {
					YAHOO.ebauer.productUtils.mgmEnabledFlag = true;
					YAHOO.ebauer.productUtils.isMonogramSelected = true;
				}
				//if gift box checked and form valid
				if (soldOutFlag == false && jQuery(targetPage+'#giftboxCheck').is(':checked') && validFlag == true) {
					var UUID = '';
					var SiteID = 'EB';
					YAHOO.ebauer.productUtils.editGiftBox(UUID, SiteID);
				}
				//if gift box checked and form valid			
				if (soldOutFlag == false && validFlag == true) {
					//alert('soldOutFlag='+soldOutFlag+' validFlag='+validFlag+' productForm='+productForm);
					if (eob) {
						YAHOO.ebauer.productUtils.checkProductOptions(productForm,true,false);
					} else {
						YAHOO.ebauer.productUtils.checkProductOptions(productForm,false,false);
					}
				}	
			}else{
				if (soldOutFlag == false && addToWishList == true && validFlag== true){
					if (eob) {
						YAHOO.ebauer.productUtils.checkProductOptions(document.forms["productForm"], true, true);
					} else {
						YAHOO.ebauer.productUtils.checkProductOptions(document.forms["productForm"], false, true);
					}
				}
			}		
			
		}
		
		getColorsSizesPage = function(){
			clearanceFlag = jQuery(targetPage+'#clearanceCategory').val();
			
			if (PPL && editMode){
				var ensemble_id = itemForEditValues.item.ensid;
				if (!setPDPRadioButtons){
					var product_id = itemForEditValues.item.productid;
					setPDPRadioButtons = true; //used to only set the defaut radio button state
				}else{
					if(eob){
						var product_id = jQuery(targetPage+"input[name=cut]:checked").val() || "-1";
					}else{
						var product_id = jQuery(targetPage+'input[name=productId]').val() || "-1";
					}
				}
				
				if (jQuery(targetPage+'input[name=selectedSizeId]').val() !="-1" && jQuery(targetPage+'input[name=selectedSizeId]').val() !="null" && jQuery(targetPage+'input[name=selectedSizeId]').val() !=""){
					var selectedSizeId = jQuery(targetPage+'input[name=selectedSizeId]').val();
				}else{
					var selectedSizeId = itemForEditValues.item.sizeid;
				}
				if (jQuery(targetPage+'input[name=selectedColorId]').val() !="-1" && jQuery(targetPage+'input[name=selectedColorId]').val() !="null" && jQuery(targetPage+'input[name=selectedColorId]').val() !=""){
					var selectedColorId = jQuery(targetPage+'input[name=selectedColorId]').val();
				}else{
					var selectedColorId = itemForEditValues.item.colorid;
				}
				
				var selectedColorSizeId = selectedColorId + "-"+selectedSizeId;
				jQuery(targetPage+'input[name=selectedSizeId]').val(selectedColorSizeId);
				var clearanceFlag = itemForEditValues.item.clearanceFlag;				
			}else{
				var ensemble_id = jQuery(targetPage+'#dash input[name=ensembleId]').val();
				if(eob){
					var product_id = jQuery(targetPage+"input[name=cut]:checked").val() || "-1";
				}else{
					var product_id = jQuery(targetPage+'input[name=productId]').val() || "-1";
				}
				
				var selectedColorSizeId = jQuery(targetPage+'input[name=colorsize]').val();
				
			}
			var siteId = "1";
			var params = "";
			
			if (ensemble_id != ""){
				params = params + "ensemble_id=" + ensemble_id;
			}else{
				params = params + "ensemble_id=-1";
			}

			if (product_id != ""){
				params = params + "&product_id=" + product_id;
			}else{
				params = params + "&product_id=-1";
			}
			
			if (selectedColorSizeId != ""){
				params = params + "&selectedColorSizeId=" + selectedColorSizeId;
			}else{
				params = params + "&selectedColorSizeId=-1";
			}
			
			if (clearanceFlag != ""){
				params = params + "&clearanceFlag=" + clearanceFlag;
			}else{
				params = params + "&clearanceFlag=N";
			}
			if (clearanceFlag == 'Y') {
				
			}

			if (siteId != ""){
				params = params + "&siteId=" + siteId;
			}else{
				params = params + "&siteId=1";
			}
			
			if (PPL) {
				params = params + "&ppl=y";
			}
			
			mySuccessColorSizeHandler = function(responseBody, XMLHttpRequest){	
				// update color dropdown
				var data = jQuery.parseJSON(responseBody);
				
				var selectedColorSizeId = data.selectedColorSizeId;
				
				var colorsSizesDB = data.colorsizes.colorsize;
				/*if(typeOf(data.swatchImages[0]) != 'undefined'){
					var pricesDB = data.swatchImages[0].value;
					if (pricesDB.length > 0) {
						var pricesRegDB = data.swatchImages[0].value[0].regPrice;
						var pricesCurDB = data.swatchImages[0].value[0].key;
					}
				}*/
				
				var colorSizeOptions = '';
				colorSizeOptions += '<option value="null">Select Size/Color</option>';				
				var lastSizeName = "";
				var oneColorSize = false;
				jQuery.each(colorsSizesDB, function(key, value){
					var colorSizeObj = eval(value[key]);
					var inventoryStatusDB = this.inventory_status;
					var available_quantityDB = this.available_quantity;	
					
					if (this.sizename === "One Size" && this.name === "One Color") {
						oneColorSize = true;
					}
					
					if (oneColorSize === false) {
				
						if (lastSizeName == "") {
							// open the option group
							colorSizeOptions += "<optgroup label='" + this.sizename + "'>";
						} else if (lastSizeName !== this.sizename) {
							// close the last one
							colorSizeOptions += '</optgroup>';
							//open the new one
							colorSizeOptions += "<optgroup label='" + this.sizename + "'>";
						}
						
						colorSizeOptions += '<option value="' + this.id + '-' + this.sizeid + '">' + this.sizename + ' - '+ this.name + '</option>';
						
					} else  {
						colorSizeOptions += '<option value="' + this.id + '-' + this.sizeid + '">' + 'One Size/Color' + '</option>';
					}

					if( parseInt(jQuery(targetPage+'input[name=selectedColorSizeId]').val()) == this.id + '-' + this.sizeid){
						//set hidden form feilds input values
						productVaraintId = this.productVariantId;
						jQuery(targetPage+'input[name=productVariantId]').val(productVaraintId);
						gProductVaraintId = productVaraintId;
						jQuery(targetPage+'input[name=productVariantType]').val(this.productVariantType);						
					}
					
					lastSizeName = this.sizename;
				});
				
				if (lastSizeName !== "" && oneColorSize === false) {
					// close the last one.
					colorSizeOptions += '</optgroup>';
				}
				
				jQuery(targetPage+'#colorsize').html(colorSizeOptions);
				if (parseInt(colorsSizesDB.length) == 1){
					//set as default value selected if only one Color avaiable
					if (oneColorSize === true) {
						jQuery(targetPage+'#colorsize>option:eq(1)').attr('selected', true);
					} else {
						jQuery(targetPage+'#colorsize optgroup option:first').attr('selected', true);	
					}

					jQuery(targetPage+'input[name=selectedColorSizeId]').val(jQuery(targetPage+'#colorsize').val()); 
				}else if(selectedColorSizeId !=""){
					jQuery(targetPage+'#colorsize').val(selectedColorSizeId);
					jQuery(targetPage+'input[name=selectedColorSizeId]').val(selectedColorSizeId);
				}					
				// swatches non-clearance
				var imageSwatchCount = 0;
				if(typeOf(data.swatchImages[0]) != 'undefined'){					
					var swatches = '';
					if (data.swatchImages[0].value.length > 0) {
						var swatchImagesDB = data.swatchImages[0].value[0].value;
						var mainImagesDB = data.images;						
						jQuery.each(swatchImagesDB, function(key, value){
							var imageObj = eval(value[key]);
							var imageURL = this.value;
							var imageLargeURL = mainImagesDB[key].zoomableSrc;
							var swatchImageURL = mainImagesDB[key].value;
							// check to see if color is not soldout							
							var selectedKey = key +1;
							var colorSizeValue = jQuery(targetPage+'#colorsize option:eq('+ selectedKey +')').text();						
							if ( colorSizeValue.indexOf("Sold Out") != -1 ){
								//swatches += '<dd id="swatch' + this.key +'" class="not soldout"><a href="javascript:void(0);" class="tipLink link" data-tiptitle="<span class=title>Size Select Size is no longer available.</span>" data-tiptext="<span class=message>Please try a different color or size.</span>" data-tipx="26" data-tipy="13"	data-tiptarget="right center" data-tiptip="left center"	data-tipwidth="200px" data-tipclass="colorSoldOut" title="' + this.name + ' - (Sold Out)"><img data-large-image="'+ imageLargeURL + '" data-swatch-image="' + swatchImageURL + '" src="' + imageURL + '" data-swatch-number="' + this.key + '"></a></dd>';
								swatches += '<dd id="swatch' + this.key +'" class="not"><a href="javascript:void(0);" title="' + this.name + '"><img data-large-image="'+ imageLargeURL + '" data-swatch-image="' + swatchImageURL + '" src="' + imageURL + '" alt="' + this.name + '" data-swatch-number="' + this.key + '"></a></dd>';							
							}else{
								swatches += '<dd id="swatch' + this.key +'" class="not"><a href="javascript:void(0);" title="' + this.name + '"><img data-large-image="'+ imageLargeURL + '" data-swatch-image="' + swatchImageURL + '" src="' + imageURL + '" alt="' + this.name + '" data-swatch-number="' + this.key + '"></a></dd>';							
							}	
							imageSwatchCount = imageSwatchCount + 1;
						});
				   }				
				   jQuery(targetPage+'#swatches').html(swatches);
				   //get radio button index
				 	var radioIdx = jQuery("input:radio[name='cut']:checked").index("input:radio[name='cut']");
				 	if (data.swatchImages[0].value[0] != undefined){
				 		var pricesRegDB = data.swatchImages[0].value[0].regPrice;
				 		var pricesRegDBValue = pricesRegDB.replace("$","");
					 	var pricesCurDB = data.swatchImages[0].value[0].key;
					 	var pricesCurDBValue = pricesCurDB.replace("$","");
					 	if (parseFloat(pricesRegDBValue) > parseFloat(pricesCurDBValue)){
							jQuery(targetPage+'.productPrice').html("<span class='strikethrough'>"+pricesRegDB + "</span>  <span class='salePrice'>$" + pricesCurDB + "</span>");
						}else{
							if (pricesCurDB >0){
								jQuery(targetPage+'.productPrice').html("$"+pricesCurDB);
							}
						}	
				 	}										
								 
				}
				
				// swatches clearance
				if(typeOf(data.swatchImages[1]) != 'undefined'){					
					var swatchesClearance = '';					
					if (data.swatchImages[1].value.length > 0) {
						var swatchImagesDB = data.swatchImages[1].value[0].value;
						var mainImagesDB = data.images;						
						jQuery.each(swatchImagesDB, function(key, value){
							var imageObj = eval(value[key]);
							var imageURL = this.value;													
							var imageLargeURL = mainImagesDB[imageSwatchCount].zoomableSrc;
							var swatchImageURL = mainImagesDB[imageSwatchCount].value;							
							// check to see if color is not soldout							
							var selectedKey = key +1;
							var colorSizeValue = jQuery(targetPage+'#colorsize option:eq('+ selectedKey +')').text();						
							if ( colorSizeValue.indexOf("Sold Out") != -1 ){
								//swatchesClearance += '<dd id="swatch' + this.key +'" class="not soldout"><a href="javascript:void(0);" class="tipLink link" data-tiptitle="<span class=title>Size Select Size is no longer available.</span>" data-tiptext="<span class=message>Please try a different color or size.</span>" data-tipx="26" data-tipy="13"	data-tiptarget="right center" data-tiptip="left center"	data-tipwidth="200px" data-tipclass="colorSoldOut" title="' + this.name + ' - (Sold Out)"><img data-large-image="'+ imageLargeURL + '" data-swatch-image="' + swatchImageURL + '" src="' + imageURL + '" data-swatch-number="' + this.key + '"></a></dd>';
								swatchesClearance += '<dd id="swatch' + this.key +'" class="not"><a href="javascript:void(0);" title="' + this.name + '"><img data-large-image="'+ imageLargeURL + '" data-swatch-image="' + swatchImageURL + '" src="' + imageURL + '" alt="' + this.name + '" data-swatch-number="' + this.key + '"></a></dd>';							
							}else{
								swatchesClearance += '<dd id="swatch' + this.key +'" class="not"><a href="javascript:void(0);" title="' + this.name + '"><img data-large-image="'+ imageLargeURL + '" data-swatch-image="' + swatchImageURL + '" src="' + imageURL + '" alt="' + this.name + '" data-swatch-number="' + this.key + '"></a></dd>';							
							}	
							imageSwatchCount = imageSwatchCount + 1;
						});
				   }
					 if (swatchesClearance !=""){
						 	var clearanceSwatchesDiv ='<dl id="swatchesClearance" class="swatches"/>';	
						 	var clearanceSwatchesHeader = '<div id="swatchesClearanceHeader"><span class="swatchesClearancePrice"></span><span class="clearance">Clearance</span></div>';
						 	if (jQuery(targetPage+'#swatchesClearance').length !=0){
						 		jQuery(targetPage+'#swatchesClearance').html(swatchesClearance);
						 	}else{
						 		jQuery(targetPage+'#swatches').after(clearanceSwatchesHeader);
						 		jQuery(targetPage+'#swatchesClearanceHeader').after(clearanceSwatchesDiv);
						 	}	
						 	//get radio button index
						 	var radioIdx = jQuery("input:radio[name='cut']:checked").index("input:radio[name='cut']");
						 	var pricesRegDB = data.swatchImages[1].value[0].regPrice;
						 	var pricesCurDB = data.swatchImages[1].value[0].key;
						 	jQuery(targetPage+'.productPrice').html(pricesRegDB);
						 	jQuery(targetPage+'.swatchesClearancePrice').html("<span class='strikethrough'>"+pricesRegDB + "</span>  <span class='clearancePrice'>$" + pricesCurDB+"</span>");
					 }
				}				
				
				updateSwatchIconSelected();			
				
				//update price				
				getPricesPage();
			}

			myErrorColorSizeHandler = function(message,errorThrown){
				if (errorThrown){
					alert(errorThrown);
				}
			}

			jQuery.ajax({
			        type: "GET",
			        timeout: 30000,
			        url: "/ajax/get_colors_sizes.jsp?" + params,       	
			        success: function(responseBody, textStatus, XMLHttpRequest) {
			                mySuccessColorSizeHandler(responseBody, XMLHttpRequest);
			        },
			        error: function(XMLHttpRequest, textStatus, errorThrown) {			        		
			                myErrorColorSizeHandler("An error has occurred making the request: " + errorThrown, errorThrown);
			        }
			});
			
		}
		
		
		getColorsPage = function(){				
			if (PPL && editMode){
				var ensemble_id = itemForEditValues.item.ensid;
				if (!setPDPRadioButtons){
					var product_id = itemForEditValues.item.productid;
					setPDPRadioButtons = true; //used to only set the defaut radio button state
				}else{
					if(eob){
						var product_id = jQuery(targetPage+"input[name=cut]:checked").val() || "-1";
					}else{
						var product_id = jQuery(targetPage+'input[name=productId]').val() || "-1";
					}
				}				
				if (jQuery(targetPage+'input[name=selectedSizeId]').val() !="-1" && jQuery(targetPage+'input[name=selectedSizeId]').val() !="null" && jQuery(targetPage+'input[name=selectedSizeId]').val() !=""){
					var selectedSizeId = jQuery(targetPage+'input[name=selectedSizeId]').val();
				}else{
					var selectedSizeId = itemForEditValues.item.sizeid;
				}
				if (jQuery(targetPage+'input[name=selectedColorId]').val() !="-1" && jQuery(targetPage+'input[name=selectedColorId]').val() !="null" && jQuery(targetPage+'input[name=selectedColorId]').val() !=""){
					var selectedColorId = jQuery(targetPage+'input[name=selectedColorId]').val();
				}else{
					var selectedColorId = itemForEditValues.item.colorid;
				}
				var clearanceFlag = itemForEditValues.item.clearanceFlag;				
			}else{
				var ensemble_id = jQuery(targetPage+'#dash input[name=ensembleId]').val();
				if(eob){
					var product_id = jQuery(targetPage+"input[name=cut]:checked").val() || "-1";
				}else{
					var product_id = jQuery(targetPage+'input[name=productId]').val() || "-1";
				}
				var selectedSizeId= jQuery(targetPage+'#size').val() || jQuery(targetPage+'input[name=selectedSizeId]').val() || "-1";			
				var selectedColorId= jQuery(targetPage+'#color').val() || jQuery(targetPage+'input[name=selectedColorId]').val() || "-1";
				var clearanceFlag = jQuery(targetPage+'input[name=clearanceCategory]').val() || "-1";
			}
			var siteId = "1";
			var params = "";
			
			if (ensemble_id != ""){
				params = params + "ensemble_id=" + ensemble_id;
			}else{
				params = params + "ensemble_id=-1";
			}

			if (product_id != ""){
				params = params + "&product_id=" + product_id;
			}else{
				params = params + "&product_id=-1";
			}
			
			if (selectedSizeId != ""){
				params = params + "&size_id=" + selectedSizeId;
			}else{
				params = params + "&size_id=-1";
			}
			
			if (selectedColorId != ""){
				params = params + "&selectedColorId=" + selectedColorId;
			}else{
				params = params + "&selectedColorId=-1";
			}

			if (clearanceFlag != ""){
				params = params + "&clearanceFlag=" + clearanceFlag;
			}else{
				params = params + "&clearanceFlag=N";
			}

			if (siteId != ""){
				params = params + "&siteId=" + siteId;
			}else{
				params = params + "&siteId=1";
			}
			
			if(eob){				
				var eobFlag= jQuery(targetPage+'input[name=eob]').val() || "-1";
				var dept= jQuery(targetPage+'input[name=dept]').val() || "-1";
				var itemType = jQuery(targetPage+'input[name=itemType]').val() || "-1";
				var effort = jQuery(targetPage+'input[name=effort]').val() || "-1";
				var pageType = jQuery(targetPage+'input[name=pageType]').val() || "-1";
				var item = jQuery(targetPage+'input[name=itemNumber]').val() || "-1";
				var web_ensemble_id = jQuery(targetPage+'input[name=webEnsembleId]').val() || "-1";
				
				if (eobFlag != ""){
					params = params + "&eob=" + eobFlag;
				}else{
					params = params + "&eob=1";
				}
				
				if (dept != ""){
					params = params + "&dept=" + dept;
				}else{
					params = params + "&dept=1";
				}

				if (itemType != ""){
					params = params + "&itemType=" + itemType;
				}else{
					params = params + "&itemType=1";
				}
				
				if (item != ""){
					params = params + "&item=" + item;
				}else{
					params = params + "&item=1";
				}
				
				if (effort != ""){
					params = params + "&effort=" + effort;
				}else{
					params = params + "&effort=1";
				}
				
				if (pageType != ""){
					params = params + "&pageType=" + pageType;
				}else{
					params = params + "&pageType=1";
				}				
				
				if (web_ensemble_id != ""){
					params = params + "&web_ensemble_id=" + web_ensemble_id;
				}else{
					params = params + "&web_ensemble_id=1";
				}				
				
			}
			
			if (PPL) {
				params = params + "&ppl=y";
			}
			
			mySuccessColorHandler = function(responseBody, XMLHttpRequest){	
				// update color dropdown
				var data = jQuery.parseJSON(responseBody);
				var colorsDB = data.colors.color;
				if(typeOf(data.swatchImages[0]) != 'undefined'){
					var pricesDB = data.swatchImages[0].value;
					if (pricesDB.length > 0) {
						var pricesRegDB = data.swatchImages[0].value[0].regPrice;
						var pricesCurDB = data.swatchImages[0].value[0].key;
					}
				}
				var colorOptions = '';				
					colorOptions += '<option value="null">Select Color</option>';					
				jQuery.each(colorsDB, function(key, value){
					var colorObj = eval(value[key]);
					var inventoryStatusDB = this.inventory_status;
					var available_quantityDB = this.available_quantity;					
					if (inventoryStatusDB){ //if inventory attr exist display status
						if (inventoryStatusDB == "IN" && available_quantityDB > thresholdQty){
							inventoryStatus = " - In Stock";					
						}else if (inventoryStatusDB == "IN" && available_quantityDB <= thresholdQty){
							inventoryStatus = " - Only a few left";							
						}else if (inventoryStatusDB == "SOLDOUT"){
							inventoryStatus = " - Sold Out";							
						}else if (inventoryStatusDB == "BO"){
							inventoryStatus = " - Ships by "+ this.back_order_date;							
						}else{
							inventoryStatus = " - Out Stock";							
						}
						if (inventoryStatusDB == "SOLDOUT"){
							//colorOptions += '<option value="' + this.id + '" style="color: gray;" disabled="disabled">' + this.name + inventoryStatus + '</option>';
							colorOptions += '<option value="' + this.id + '" style="color: gray;">' + this.name + inventoryStatus + '</option>';							
						}else{
							colorOptions += '<option value="' + this.id + '">' + this.name + inventoryStatus + '</option>';							
						}						
					}else{
						colorOptions += '<option value="' + this.id + '">' + this.name + '</option>';
					}	
					if( parseInt(jQuery(targetPage+'input[name=selectedColorId]').val()) == this.id){
						//set hidden form feilds input values
						productVaraintId = this.productVariantId;
						jQuery(targetPage+'input[name=productVariantId]').val(productVaraintId);
						gProductVaraintId = productVaraintId;
						jQuery(targetPage+'input[name=productVariantType]').val(this.productVariantType);						
					}
				});
				
				jQuery(targetPage+'#color').html(colorOptions);
				if (parseInt(colorsDB.length) == 1){
					//set as default value selected if only one Color avaiable
					jQuery(targetPage+'#color>option:eq(1)').attr('selected', true);
					jQuery(targetPage+'input[name=selectedColorId]').val(jQuery(targetPage+'#color').val()); 
				}else if(selectedColorId !=""){
					jQuery(targetPage+'#color').val(selectedColorId);
					jQuery(targetPage+'input[name=selectedColorId]').val(selectedColorId);
				}					
				// swatches non-clearance
				var imageSwatchCount = 0;
				if(typeOf(data.swatchImages[0]) != 'undefined'){					
					var swatches = '';
					if (data.swatchImages[0].value.length > 0) {
						var swatchImagesDB = data.swatchImages[0].value[0].value;
						var mainImagesDB = data.images;						
						jQuery.each(swatchImagesDB, function(key, value){
							var imageObj = eval(value[key]);
							var imageURL = this.value;
							var imageLargeURL = mainImagesDB[key].zoomableSrc;
							var swatchImageURL = mainImagesDB[key].value;
							// check to see if color is not soldout							
							var selectedKey = key +1;
							var colorValue = jQuery(targetPage+'#color option:eq('+ selectedKey +')').text();						
							if ( colorValue.indexOf("Sold Out") != -1 ){
								//swatches += '<dd id="swatch' + this.key +'" class="not soldout"><a href="javascript:void(0);" class="tipLink link" data-tiptitle="<span class=title>Size Select Size is no longer available.</span>" data-tiptext="<span class=message>Please try a different color or size.</span>" data-tipx="26" data-tipy="13"	data-tiptarget="right center" data-tiptip="left center"	data-tipwidth="200px" data-tipclass="colorSoldOut" title="' + this.name + ' - (Sold Out)"><img data-large-image="'+ imageLargeURL + '" data-swatch-image="' + swatchImageURL + '" src="' + imageURL + '" data-swatch-number="' + this.key + '"></a></dd>';
								swatches += '<dd id="swatch' + this.key +'" class="not"><a href="javascript:void(0);" title="' + this.name + '"><img data-large-image="'+ imageLargeURL + '" data-swatch-image="' + swatchImageURL + '" src="' + imageURL + '" alt="' + this.name + '" data-swatch-number="' + this.key + '"></a></dd>';							
							}else{
								swatches += '<dd id="swatch' + this.key +'" class="not"><a href="javascript:void(0);" title="' + this.name + '"><img data-large-image="'+ imageLargeURL + '" data-swatch-image="' + swatchImageURL + '" src="' + imageURL + '" alt="' + this.name + '" data-swatch-number="' + this.key + '"></a></dd>';							
							}	
							imageSwatchCount = imageSwatchCount + 1;
						});
				   }				
				   jQuery(targetPage+'#swatches').html(swatches);
				   //get radio button index
				 	var radioIdx = jQuery("input:radio[name='cut']:checked").index("input:radio[name='cut']");
				 	if (data.swatchImages[0].value[0] != undefined){
				 		var pricesRegDB = data.swatchImages[0].value[0].regPrice;
				 		var pricesRegDBValue = pricesRegDB.replace("$","");
					 	var pricesCurDB = data.swatchImages[0].value[0].key;
					 	var pricesCurDBValue = pricesCurDB.replace("$","");
					 	if (parseFloat(pricesRegDBValue) > parseFloat(pricesCurDBValue)){
							jQuery(targetPage+'.productPrice').html("<span class='strikethrough'>"+pricesRegDB + "</span>  <span class='salePrice'>$" + pricesCurDB + "</span>");
						}else{
							if (pricesCurDB >0){
								jQuery(targetPage+'.productPrice').html("$"+pricesCurDB);
							}
						}	
				 	}										
								 
				}
				
				// swatches clearance
				if(typeOf(data.swatchImages[1]) != 'undefined'){
					var swatchesClearance = '';					
					if (data.swatchImages[1].value.length > 0) {
						var swatchImagesDB = data.swatchImages[1].value[0].value;
						var mainImagesDB = data.images;						
						jQuery.each(swatchImagesDB, function(key, value){
							var imageObj = eval(value[key]);
							var imageURL = this.value;													
							var imageLargeURL = mainImagesDB[imageSwatchCount].zoomableSrc;
							var swatchImageURL = mainImagesDB[imageSwatchCount].value;							
							// check to see if color is not soldout							
							var selectedKey = key +1;
							var colorValue = jQuery(targetPage+'#color option:eq('+ selectedKey +')').text();						
							if ( colorValue.indexOf("Sold Out") != -1 ){
								//swatchesClearance += '<dd id="swatch' + this.key +'" class="not soldout"><a href="javascript:void(0);" class="tipLink link" data-tiptitle="<span class=title>Size Select Size is no longer available.</span>" data-tiptext="<span class=message>Please try a different color or size.</span>" data-tipx="26" data-tipy="13"	data-tiptarget="right center" data-tiptip="left center"	data-tipwidth="200px" data-tipclass="colorSoldOut" title="' + this.name + ' - (Sold Out)"><img data-large-image="'+ imageLargeURL + '" data-swatch-image="' + swatchImageURL + '" src="' + imageURL + '" data-swatch-number="' + this.key + '"></a></dd>';
								swatchesClearance += '<dd id="swatch' + this.key +'" class="not"><a href="javascript:void(0);" title="' + this.name + '"><img data-large-image="'+ imageLargeURL + '" data-swatch-image="' + swatchImageURL + '" src="' + imageURL + '" alt="' + this.name + '" data-swatch-number="' + this.key + '"></a></dd>';							
							}else{
								swatchesClearance += '<dd id="swatch' + this.key +'" class="not"><a href="javascript:void(0);" title="' + this.name + '"><img data-large-image="'+ imageLargeURL + '" data-swatch-image="' + swatchImageURL + '" src="' + imageURL + '" alt="' + this.name + '" data-swatch-number="' + this.key + '"></a></dd>';							
							}	
							imageSwatchCount = imageSwatchCount + 1;
						});
				   }
					 if (swatchesClearance !=""){
						 	var clearanceSwatchesDiv ='<dl id="swatchesClearance" class="swatches"/>';	
						 	var clearanceSwatchesHeader = '<div id="swatchesClearanceHeader"><span class="swatchesClearancePrice"></span><span class="clearance">Clearance</span></div>';
						 	if (jQuery(targetPage+'#swatchesClearance').length !=0){
						 		jQuery(targetPage+'#swatchesClearance').html(swatchesClearance);
						 	}else{
						 		jQuery(targetPage+'#swatches').after(clearanceSwatchesHeader);
						 		jQuery(targetPage+'#swatchesClearanceHeader').after(clearanceSwatchesDiv);
						 	}	
						 	//get radio button index
						 	var radioIdx = jQuery("input:radio[name='cut']:checked").index("input:radio[name='cut']");
						 	var pricesRegDB = data.swatchImages[1].value[0].regPrice;
						 	var pricesCurDB = data.swatchImages[1].value[0].key;
						 	jQuery(targetPage+'.productPrice').html(pricesRegDB);
						 	jQuery(targetPage+'.swatchesClearancePrice').html("<span class='strikethrough'>"+pricesRegDB + "</span>  <span class='clearancePrice'>$" + pricesCurDB+"</span>");
					 }
				}				
				
				updateSwatchIconSelected();			
				
				//update price				
				getPricesPage();
			}

			myErrorColorHandler = function(message,errorThrown){
				if (errorThrown){
					alert(errorThrown);
				}
			}

			jQuery.ajax({
			        type: "GET",
			        timeout: 30000,
			        url: "/ajax/get_colors.jsp?" + params,       	
			        success: function(responseBody, textStatus, XMLHttpRequest) {
			                mySuccessColorHandler(responseBody, XMLHttpRequest);
			        },
			        error: function(XMLHttpRequest, textStatus, errorThrown) {			        		
			                myErrorColorHandler("An error has occurred making the request: " + errorThrown, errorThrown);
			        }
			});
			
		}
		
		getSizesPage = function(){				
			if (PPL && editMode){
				var ensemble_id = itemForEditValues.item.ensid;
				if (!setPDPRadioButtons){
					var product_id = itemForEditValues.item.productid;
					setPDPRadioButtons = true; //used to only set the defaut radio button state
				}else{
					if(eob){
						var product_id = jQuery(targetPage+"input[name=cut]:checked").val() || "-1";
					}else{
						var product_id = jQuery(targetPage+'input[name=productId]').val() || "-1";
					}
				}		
				if (jQuery(targetPage+'input[name=selectedSizeId]').val() !="-1" && jQuery(targetPage+'input[name=selectedSizeId]').val() !="null" && jQuery(targetPage+'input[name=selectedSizeId]').val() !=""){
					var selectedSizeId = jQuery(targetPage+'input[name=selectedSizeId]').val();
				}else{
					var selectedSizeId = itemForEditValues.item.sizeid;
				}
				if (jQuery(targetPage+'input[name=selectedColorId]').val() !="-1" && jQuery(targetPage+'input[name=selectedColorId]').val() !="null" && jQuery(targetPage+'input[name=selectedColorId]').val() !=""){
					var selectedColorId = jQuery(targetPage+'input[name=selectedColorId]').val();
				}else{
					var selectedColorId = itemForEditValues.item.colorid;
				}
				var clearanceFlag = itemForEditValues.item.clearanceFlag;
			}else{
				var ensemble_id = jQuery(targetPage+'#dash input[name=ensembleId]').val();
				if(eob){
					var product_id = jQuery(targetPage+"input[name=cut]:checked").val() || "-1";
				}else{
					var product_id = jQuery(targetPage+'input[name=productId]').val() || "-1";					
				}
				var selectedSizeId= jQuery(targetPage+'#size').val() || jQuery(targetPage+'input[name=selectedSizeId]').val() || "-1";
				var selectedColorId= jQuery(targetPage+'input[name=selectedColorId]').val() || "-1";
				var clearanceFlag = jQuery(targetPage+'input[name=clearanceCategory]').val() || "-1";
			}
			
			var siteId = "1";
			var params = "";

			if (ensemble_id != ""){
				params = params + "ensemble_id=" + ensemble_id;
			}else{
				params = params + "ensemble_id=-1";
			}

			if (product_id != ""){
				params = params + "&product_id=" + product_id;
			}else{
				params = params + "&product_id=-1";
			}
			
			if (selectedSizeId != ""){
				params = params + "&size_id=" + selectedSizeId;
			}else{
				params = params + "&size_id=-1";
			}
			
			if (selectedColorId != ""){
				params = params + "&color_id=" + selectedColorId;
			}else{
				params = params + "&color_id=-1";
			}

			if (clearanceFlag != ""){
				params = params + "&clearanceFlag=" + clearanceFlag;
			}else{
				params = params + "&clearanceFlag=N";
			}

			if (siteId != ""){
				params = params + "&siteId=" + siteId;
			}else{
				params = params + "&siteId=1";
			}
			
			if(eob){				
				var eobFlag= jQuery(targetPage+'input[name=eob]').val() || "-1";
				var dept= jQuery(targetPage+'input[name=dept]').val() || "-1";
				var itemType = jQuery(targetPage+'input[name=itemType]').val() || "-1";
				var effort = jQuery(targetPage+'input[name=effort]').val() || "-1";
				var pageType = jQuery(targetPage+'input[name=pageType]').val() || "-1";
				var item = jQuery(targetPage+'input[name=itemNumber]').val() || "-1";				
				
				if (eobFlag != ""){
					params = params + "&eob=" + eobFlag;
				}else{
					params = params + "&eob=1";
				}
				
				if (dept != ""){
					params = params + "&dept=" + dept;
				}else{
					params = params + "&dept=1";
				}

				if (item != ""){
					params = params + "&item=" + item;
				}else{
					params = params + "&item=1";
				}
				
				if (itemType != ""){
					params = params + "&itemType=" + itemType;
				}else{
					params = params + "&itemType=1";
				}
				
				if (effort != ""){
					params = params + "&effort=" + effort;
				}else{
					params = params + "&effort=1";
				}
				
				if (pageType != ""){
					params = params + "&pageType=" + pageType;
				}else{
					params = params + "&pageType=1";
				}				
								
			}
			
			mySuccessSizeHandler = function(responseBody, XMLHttpRequest){	
				// update color dropdown
				var data = jQuery.parseJSON(responseBody);
				var sizesDB = data.sizes.size;					
				var sizesOptions = '';							
					sizesOptions += '<option value="null">Select Size</option>';					
				jQuery.each(sizesDB, function(key, value){
					var sizesObj = eval(value[key]);									
					var inventoryStatusDB = this.inventory_status;
					var available_quantityDB = this.available_quantity;					
					if (inventoryStatusDB){ //if inventory attr exist display status
						if (inventoryStatusDB == "IN" && available_quantityDB > thresholdQty){
							inventoryStatus = " - In Stock";
						}else if (inventoryStatusDB == "IN" && available_quantityDB <= thresholdQty){
							inventoryStatus = " - Only a few left";							
						}else if (inventoryStatusDB == "SOLDOUT"){
							inventoryStatus = " - Sold Out";
						}else if (inventoryStatusDB == "BO"){
							inventoryStatus = " - Ships by "+ this.back_order_date;							
						}else{
							inventoryStatus = " - Out Stock";							
						}
						if (inventoryStatusDB == "SOLDOUT"){
							//sizesOptions += '<option value="' + this.id + '" style="color: gray;" disabled="disabled">' + this.name + inventoryStatus + '</option>';
							sizesOptions += '<option value="' + this.id + '" style="color: gray;">' + this.name + inventoryStatus + '</option>';							
						}else{
							sizesOptions += '<option value="' + this.id + '">' + this.name + inventoryStatus + '</option>';							
						}						
					}else{
						sizesOptions += '<option value="' + this.id + '">' + this.name + '</option>';
					}				
				});
				
				jQuery(targetPage+'#size').html(sizesOptions);	
			
				if (parseInt(sizesDB.length) == 1){					
					//set as default value selected if only one size avaiable
					jQuery(targetPage+'#size>option:eq(1)').attr('selected', true);
					//jQuery('.selectSize .sizeChart').hide();
					jQuery(targetPage+'input[name=selectedSizeId]').val(jQuery(targetPage+'#size').val()); 
				}else if(selectedSizeId !=""){
					jQuery(targetPage+'#size').val(selectedSizeId);
					jQuery(targetPage+'input[name=selectedSizeId]').val(selectedSizeId);
				}	
				
				//updateSwatchIconSelected();
				
			}

			myErrorSizeHandler = function(message,errorThrown){
				if (errorThrown){
					alert(errorThrown);
				}
			}
			//alert('get_sizes params = '+params);
			jQuery.ajax({
			        type: "GET",
			        timeout: 30000,
			        url: "/ajax/get_sizes.jsp?" + params,       	
			        success: function(responseBody, textStatus, XMLHttpRequest) {
			                mySuccessSizeHandler(responseBody, XMLHttpRequest);
			        },
			        error: function(XMLHttpRequest, textStatus, errorThrown) {			        		
			                myErrorSizeHandler("An error has occurred making the request: " + errorThrown, errorThrown);
			        }
			});
			
		}
		
		getPageType = function() {
			var pageType = "web";
			if (eob) {
				pageType = "MATCHMATCH"; // default value
			}
			var pageTypeField = jQuery(targetPage+'input[name=pageType]');
			if (pageTypeField != null && pageTypeField != 'undefined') {
				pageType = pageTypeField.val();
			}
			
			return pageType;
		}
		if(jQuery('#clearanceCategory').val() == 'Y') {
			jQuery('span.clearance').remove();
    		jQuery('<div class="clearanceCopy" style="display:block;">clearance</div>').insertAfter(jQuery('div.productPrice'));
    		jQuery('#dossier.PPL dd.rating_reviews a.PR_Links').css({
    			color: '#0072CF !important',
	    	    fontFamily: 'Lucida Sans Unicode,Lucida Grande,Verdana,Arial,Helvetica,sans-serif',
	    	    fontSize: '11px',
	    	    left: '2px',
	    	    position: 'relative',
	    	    textDecoration: 'none !important',
	    	    marginTop: '2px'
    		});
    		jQuery('dd.rating_reviews .BV_Seperator').css({
    			left: '592px',
    			position: 'absolute',
    	    	top: '48px'
    		});
    		jQuery('div#dossier.PPL .infoModule .newRating').css({
    			color: '#333333 !important',
	    	    fontFamily: 'Lucida Sans Unicode,Lucida Grande,Verdana,Arial,Helvetica,sans-serif',
	    	    fontSize: '11px',
	    	    fontWeight: 'normal',
	    	    marginLeft: '6px',
	    	    position: 'relative',
    	    	marginTop: '2px'
    		});
    		jQuery('#dossier dd.rating_reviews').css({
    			padding: '4px 0 4px 0'
    		});
		}
		setTipToolStyle = function() {
			jQuery('div#dossier.PP .infoModule .content .singleTab #tabs-1 ul').removeClass('');
        	jQuery('div#dossier.PP .infoModule .content .singleTab #tabs-1 ul li').removeAttr('class');
        	jQuery('div#dossier.PP .infoModule .content .singleTab #tabs-1 ul li a.toolTip').removeClass('ui-tabs-panel ui-widget-content ui-corner-bottom');
        	jQuery('div#dossier.PPL .infoModule .content .singleTab #tabs-1 ul').removeClass('');
        	jQuery('div#dossier.PPL .infoModule .content .singleTab #tabs-1 ul li').removeAttr('class');
        	jQuery('div#dossier.PPL .infoModule .content .singleTab #tabs-1 ul li a.toolTip').removeClass('ui-tabs-panel ui-widget-content ui-corner-bottom');
		}
		getPricesPage = function(){			
			if(eob){
				var ensemble_id = jQuery(targetPage+'#dash input[name=ensembleId]').val(); 
			}else{
				var ensemble_id = jQuery(targetPage+'input[name=ensembleId]').val();
			}
			var clearanceFlag = jQuery(targetPage+'input[name=clearanceCategory]').val() || "-1";
			var displayClearaceVariants = jQuery(targetPage+'input[name=displayClearaceVariants]').val() || "-1";
			var siteId = "1";
			var params = "";
			
			updatePrice = function(){	
				//update price
				var stylesDB = priceObjDB;
				var cutsTypes = jQuery(targetPage+"input[name=cut]");
				if(eob){
					var productIdDB = jQuery(targetPage+"input[name=cut]:checked").val();
				}else{
					var productIdDB = jQuery(targetPage+'input[name=productId]').val();
				}
				if (clearanceFlag == "Y") {
					if(eob){
						var colorSizeSelectedId = jQuery(targetPage+'#colorsize').val();					
					}else{
						var colorSizeSelectedId = jQuery(targetPage+'input[name=selectedColorSizeId]').val();
					}
					
					if (colorSizeSelectedId != "-1" && colorSizeSelectedId !="null"){
						var colorSizeIdDB = colorSizeSelectedId;
					}else{
						var colorSizeIdDB = jQuery(targetPage+'input[name=defaultColorSizeId]').val();
					}				

				} else {
					if(eob){
						var colorSelectedId = jQuery(targetPage+'#color').val();					
					}else{
						var colorSelectedId = jQuery(targetPage+'input[name=selectedColorId]').val();
					}

					if (colorSelectedId != "-1" && colorSelectedId !="null"){
						var colorIdDB = colorSelectedId;
					}else{
						var colorIdDB = jQuery(targetPage+'input[name=defaultColorId]').val();
					}				

				}
				var pricesRegDB = "";
				var pricesCurDB = "";
				var allMarkedDownDB = false;
				var radioIdx = jQuery("input:radio[name='cut']:checked").index("input:radio[name='cut']");	
				jQuery.each(stylesDB, function(key, value){	
					// found style match now find price from prices where styleId = productId						
					//update radio button prices here										
					var pricesReg = stylesDB[key].regPrice;	
					var pricesRegValue = pricesReg.replace("$","");
					var pricehighestCurrent = stylesDB[key].highestCurrentPrice;
					var pricehighestCurrentValue = pricehighestCurrent.replace("$","");
					var price = "";
					if (!clearanceSwatchFlag){
						if (parseFloat(pricehighestCurrentValue) < parseFloat(pricesRegValue)){
							 price = "<span class='strikethrough'>"+pricesReg + "</span>  <span class='salePrice'>" + pricehighestCurrent + "</span>"
						}else if (parseFloat(pricehighestCurrentValue) == parseFloat(pricesRegValue)){
							price = pricehighestCurrent;
						}else{
							price = pricesReg;
						}
					}else{
						price = jQuery('#swatchesClearanceHeader .clearancePrice').html();
						
					}
					var radioButtonId = targetPage+'input:radio[name=cut]:eq('+key+')';		
					jQuery(radioButtonId).parent().parent().find(".sizeWrap .priceWrap").html(price);	
				});		
				
			}
			
			if (ensemble_id != ""){
				params = params + "ensembleId=" + ensemble_id;
			}else{
				params = params + "ensembleId=-1";
			}
			
			if (clearanceFlag != ""){
				params = params + "&clearanceFlag=" + clearanceFlag;
			}else{
				params = params + "&clearanceFlag=N";
			}
			
			if (displayClearaceVariants != ""){
				params = params + "&displayClearaceVariants=" + displayClearaceVariants;
			}else{
				params = params + "&displayClearaceVariants=N";
			}

			if (siteId != ""){
				params = params + "&siteId=" + siteId;
			}else{
				params = params + "&siteId=1";
			}
			if(eob){
				
				params = params + "&eob=true&pageType=" + getPageType();
			}			
			mySuccessPriceHandler = function(responseBody, XMLHttpRequest){	
				// update color dropdown
				var data = jQuery.parseJSON(responseBody);	
				if (data != null){
					priceObjDB = data.styles;	
					pricesLoaded = true;
					updatePrice();
				}
			};	
			
			myErrorPriceHandler = function(message,errorThrown){
				if (errorThrown){
					alert(errorThrown);
				}
			}
			
			if (!pricesLoaded && getPageType() != 'CATALOGONLY' ){
				jQuery.ajax({
			        type: "GET",
			        timeout: 30000,
			        url: "/ajax/get_ensemble_prices.jsp?" + params,       	
			        success: function(responseBody, textStatus, XMLHttpRequest) {
			                mySuccessPriceHandler(responseBody, XMLHttpRequest);
			        },
			        error: function(XMLHttpRequest, textStatus, errorThrown) {			        		
			                myErroPriceHandler("An error has occurred making the request: " + errorThrown, errorThrown);
			        }
				});
			}else{
				updatePrice();
			}			
		}
		
		updateInseamLength = function(){
			
			var product_id = jQuery(targetPage+'input[name=productId]').val();
			if (product_id != "-1" && product_id != "" && product_id != undefined){				
			}else{
				product_id = jQuery(targetPage+"input[name=cut]:checked").val();
			}			
			var cachedInseamLength = null;			
			cacheManagerObj = getCacheManager();
			cachedInseamLength = cacheManagerObj.getCacheContent(product_id + '_INSEAM_LENGTH');

			queryStr = getBaseURL() + "/ajax/get_inseam_length.jsp?product_id=" + product_id;
			
			mySuccessInseamHandler = function(responseBody, XMLHttpRequest){	
				// update Inseam Length dropdown
				var data = jQuery.parseJSON(responseBody);
				var minPlainLengthDB = data.minPlainLength;				
				var maxPlainLengthDB = data.maxPlainLength;	
				var minCuffLengthDB = data.minCuffLength;
				var maxCuffLengthDB = data.maxCuffLength;
				var sizesOptions = '<option value="default" selected="selected">Select Inseam Length</option>';
				jQuery(targetPage+'#inSeamLength').val(sizesOptions);
				var selectedHemStyleDB = jQuery(targetPage+'input[name=selectedHemStyle]').val();
				var selectedInseamLengthDB = jQuery(targetPage+'input[name=selectedInseamLength]').val();	
				var arrayStart = 0;
				var arrayEnd = 0;				
				if (selectedHemStyleDB == "Cuffed"){
					arrayStart = minCuffLengthDB;
					arrayEnd = maxCuffLengthDB;		
					jQuery(targetPage+'#hemStyle').val(selectedHemStyleDB);
					jQuery(targetPage+'#inSeamLength').removeAttr("disabled"); 
				}else if (selectedHemStyleDB == "Plain"){
					arrayStart = minPlainLengthDB;
					arrayEnd = maxPlainLengthDB;
					jQuery(targetPage+'#hemStyle').val(selectedHemStyleDB);
					jQuery(targetPage+'#inSeamLength').removeAttr("disabled"); 
				}else{
					jQuery(targetPage+'#inSeamLength').html(sizesOptions);
					jQuery(targetPage+'#inSeamLength').attr("disabled", "disabled");
					jQuery(targetPage+'input[name=selectedInseamLength]').val("");
				}				
				if (minPlainLengthDB >0 && minCuffLengthDB ==0 || minPlainLengthDB >0 && minCuffLengthDB == "" || minPlainLengthDB >0 && minCuffLengthDB == undefined){
					jQuery(targetPage+'#hemStyle').html('<option value="default">Select Hem Style</option><option value="Plain">Without Cuffs</option><option value="Unfinished">Unfinished</option>');
					jQuery(targetPage+'#hemStyle').val(selectedHemStyleDB);
				}else{
					jQuery(targetPage+'#hemStyle').html('<option value="default">Select Hem Style</option><option value="Cuffed">With Cuffs</option><option value="Plain">Without Cuffs</option><option value="Unfinished">Unfinished</option>');
					jQuery(targetPage+'#hemStyle').val(selectedHemStyleDB);
				}
				
				if (arrayStart !=0){
					for(var i=arrayStart; i<arrayEnd; i++){
						sizesOptions += '<option value="' + i + '">'+i+'</option><option value="' + i + '-1/4">'+i+' - 1/4</option><option value="' + i + '-1/2">'+i+' - 1/2</option><option value="' + i +'-3/4">'+i+' - 3/4</option>';
					}
					sizesOptions += '<option value="' + i + '">'+i+'</option>';
				}
				
				jQuery(targetPage+'#inSeamLength').html(sizesOptions);
				
				if(jQuery(targetPage+'input[name=selectedInseamLength]').val()){
					jQuery(targetPage+'#inSeamLength').val(jQuery(targetPage+'input[name=selectedInseamLength]').val());					
				}					
				
				
			}

			myErrorInseamHandler = function(message,errorThrown){
				if (errorThrown){
					alert(errorThrown);
				}
			}
			

			var eobFlag =jQuery(targetPage+'input[name=eob]').val();
			if (eobFlag == 'true') {
				var dept = jQuery(targetPage+'input[name=dept]').val();
				var effort = jQuery(targetPage+'input[name=effort]').val();
				var item = jQuery(targetPage+'input[name=item]').val();
				var pageType = jQuery(targetPage+'input[name=pageType]').val();
				queryStr = queryStr + '&eob=true&dept=' + dept + '&effort=' + effort + '&item=' + item + '&pageType=' + pageType;
			}
			
			jQuery.ajax({
			        type: "GET",
			        timeout: 30000,
			        url: queryStr,       	
			        success: function(responseBody, textStatus, XMLHttpRequest) {
			                mySuccessInseamHandler(responseBody, XMLHttpRequest);
			        },
			        error: function(XMLHttpRequest, textStatus, errorThrown) {			        		
			                myErrorInseamHandler("An error has occurred making the request: " + errorThrown, errorThrown);
			        }
			});
			
		}
		
		createdDefaultInseamOptions = function(){
			jQuery(targetPage+'#inSeamLength').html('<option value="default" selected="selected">Select Inseam Length</option>');			
		}
		
		createHemStyle = function(){			
			if ( jQuery(targetPage+'#hemStyle') ){
				jQuery(targetPage+'#hemStyle').html('<option selected="selected" value="default">Select Hem Style</option><option value="Cuffed">With Cuffs</option><option value="Plain">Without Cuffs</option><option value="Unfinished">Unfinished</option>');
			}			
		}
		
		updateSwatchIconSelected = function(){
			
			if (clearanceFlag=="Y") {
				var currentColor = jQuery(targetPage+'#colorsize').val();
			} else {
				var currentColor = jQuery(targetPage+'#color').val();
			}
		
			var swatchID = targetPage+'#swatch'+ jQuery.trim(currentColor);	
			jQuery(targetPage+'.swatches a').closest('dd').removeClass('hot');
			jQuery(swatchID).addClass('hot');				
		}
		
		updateContolPanel = function(){	
			//alert("getInformationFlag="+getInformationFlag);
			if (getInformationFlag){
				if (clearanceFlag == "Y") {
					getColorsSizesPage();
				} else {
					//AJAX Color inofo
					getColorsPage();				
					//AJAX Size Info				
					getSizesPage();
				}
				getInformationFlag = false;
			}
		}
		
		validateSelections = function(type){
			var typeValue = type;
			if (clearanceFlag =="Y") {
				var colorSizeValue = jQuery(targetPage+'#colorsize').val();

				if (colorSizeValue !=null && colorSizeValue !="null" && colorSizeValue.length != 0){
					errorTipHide(targetPage+'#colorsize');
					validFlag =  true;
				}

			} else {
				var sizeValue = jQuery(targetPage+'#size').val();				
				var colorValue = jQuery(targetPage+'#color').val();
				

				if (colorValue !=null && colorValue !="null" && colorValue.length != 0){
					errorTipHide(targetPage+'#color');
					validFlag =  true;
				}
				if (sizeValue !=null && sizeValue !="null" && sizeValue.length != 0){					
					errorTipHide(targetPage+'#size');
					validFlag =  true;
				}

			}
			var hemValue = jQuery(targetPage+'#hemStyle').val();
			var inseamValue = jQuery(targetPage+'#inSeamLength').val();
			var showMessage = true;
			var inputsCount = 0;
			var validatedCount = 0;			
			
			if (hemValue == "Unfinished" && hemValue.length != 0 ){
				jQuery(targetPage+'.selectInSeamLength').hide();
				validFlag =  true;
			}else{
				jQuery(targetPage+'.selectInSeamLength').show();
				if (inseamValue != null && !jQuery(targetPage+'#inseamDetails').hasClass('errorHide')){
					if (hemValue != null && hemValue.length != 0 || hemValue !="default" && hemValue.length != 0){						
						errorTipHide(targetPage+'#hemStyle');
						jQuery(targetPage+'#inSeamLength').removeAttr("disabled"); 
						validFlag =  true;
					}
					if (hemValue != null && hemValue.length != 0 || hemValue !="default" && hemValue.length != 0){
						//jQuery(targetPage+'#inSeamLength').attr("disabled", "disabled");
					}
					if (inseamValue != null && inseamValue.length != 0 || inseamValue !="default" && inseamValue.length != 0){							
						errorTipHide(targetPage+'#inSeamLength');
						validFlag =  true;
					}					
				}
			}
			
			if(typeValue == 'addtobag' || typeValue=='addtowishlist'){
				if (clearanceFlag == "Y") {
					if (colorSizeValue === "null" && colorSizeValue.length != 0){
						errorTipShow(targetPage+'#colorsize','Please select a color and a size');
						validFlag = false;
					}
				} else {
					if (colorValue =="null" && colorValue.length != 0){
						errorTipShow(targetPage+'#color','Please select a color');
						validFlag = false;
					}
					if (sizeValue =="null" && sizeValue.length != 0){				
						errorTipShow(targetPage+'#size','Please select a size');
						validFlag = false;
					}
				}
				
				if (hemValue == "Unfinished" && hemValue.length != 0 ){
					jQuery(targetPage+'.selectInSeamLength').hide();
					validFlag =  true;
				}else{
					jQuery(targetPage+'.selectInSeamLength').show();
					if (!jQuery(targetPage+'#inseamDetails').hasClass('errorHide')){
						if (hemValue =="null" && hemValue.length != 0 || hemValue =="default" && hemValue.length != 0){
							errorTipShow(targetPage+'#hemStyle','Please select a hem style');
							jQuery(targetPage+'#inSeamLength').attr("disabled", "disabled");					
							validFlag = false;
						}
						if (hemValue =="null" && hemValue.length != 0 || hemValue =="default" && hemValue.length != 0){
							//jQuery(targetPage+'#inSeamLength').attr("disabled", "disabled");
						}else{
							if (inseamValue =="null" && inseamValue.length != 0 || inseamValue =="default" && inseamValue.length != 0){
								errorTipShow(targetPage+'#inSeamLength','Please select a inseam length');
								validFlag = false;
							}
						}
					}
				}
				if(typeValue == 'addtobag'){
					checkItemsInBag();
				}
			}
			
		}		
		errorTipShow = function(id,msg) {
			var container = jQuery(id).closest('.container');
			var selectId = jQuery(id).closest('.dropdown');
			var selectInput = jQuery(id);
			var selectInputPos = selectInput.position();
			container.addClass('selectError');
			selectId.addClass('error');
			if ( container.find('.selectErrorMSG').length == 0){
				container.append('<div class="selectErrorMSG"><span class="arrow"></span>' + msg + '</div>');
			}
				var messageWidth = container.find('.selectErrorMSG').width();
				var leftPos = (selectInputPos.left-messageWidth)-25;		
				container.find('.selectErrorMSG').css({'left':leftPos});			
		}	
		errorTipSoldOutHide = function(id) {
			var container = jQuery(id).closest('.container');
			var selectId = jQuery(id).closest('.dropdown');
			container.removeClass('selectError');
			selectId.removeClass('error');
			container.find('.selectErrorMSG').remove();			
		}
		errorTipSoldOutShow = function(id,msg) {
			var container = jQuery(id).closest('.container');
			var selectId = jQuery(id).closest('.dropdown');
			var selectInput = jQuery(id);
			var selectInputPos = selectInput.position();
			container.addClass('selectError');
			selectId.addClass('error');
			if ( container.find('.selectErrorMSG').length == 0){
				container.append('<div class="selectErrorMSG soldOutMsg"><span class="arrow top"></span><span class="arrow bottom"></span>' + msg + '</div>');
			}
				var messageWidth = container.find('.selectErrorMSG').width();
				var leftPos = (selectInputPos.left-messageWidth)-25;		
				container.find('.selectErrorMSG').css({'left':leftPos});			
		}	
		errorTipHide = function(id) {
			var container = jQuery(id).closest('.container');
			var selectId = jQuery(id).closest('.dropdown');
			container.removeClass('selectError');
			selectId.removeClass('error');
			container.find('.selectErrorMSG').remove();			
		}		
		updateSwatchInfo = function(swatchHover){
			var displaySwatchNameFlag = true;
			if (swatchHover){
				var currentSwatchId = swatchHover;				
			}else if(jQuery(targetPage+'#swatches dd').hasClass('hot')){				
				var currentSwatchId = jQuery(targetPage+'#swatches dd.hot a');
			}else if(jQuery(targetPage+'#swatchesClearance dd').hasClass('hot')){				
				var currentSwatchId = jQuery(targetPage+'#swatchesClearance dd.hot a');
			}else{
				displaySwatchNameFlag = false;
			}	
			if (displaySwatchNameFlag){
				var currentColor = currentSwatchId.attr('title');
				// update color			
				jQuery(targetPage+'.imageColorName .colorName').html(currentColor);			
				if (!swatchHover){
					jQuery(targetPage+'.imageColor .name').html(currentColor);
				}
			}else{
				jQuery(targetPage+'#change_col_text .colorName').html("");
			}			
		}
		updateColorInfoDropdown = function(color){			
			var currentColor = color;
			var swatchID = '#swatch'+ jQuery.trim(currentColor);	
			jQuery(targetPage+'.swatches a').closest('dd').removeClass('hot');
			jQuery(swatchID).addClass('hot');			
			updateSwatchInfo();
			loadMainProductImage(swatchID);			
		}		
		updateSwatchInfoDropdown = function(){		
			if (clearanceFlag == "Y") {
				var currentColorSize = jQuery(targetPage+'#colorsize').val();
				var colorsizeArr = currentColorSize.split('-');
				var currentColor = colorsizeArr[0];
			} else {
				var currentColor = jQuery(targetPage+'#color').val();	
			}
			
			var swatchID = '#swatch'+ jQuery.trim(currentColor);	
			jQuery(targetPage+'.swatches a').closest('dd').removeClass('hot');
			jQuery(swatchID).addClass('hot');			
			updateSwatchInfo();
			loadMainProductImage(swatchID);				
		}		
		loadMainProductImage = function(swatchID){			
			var swatch = jQuery(targetPage+swatchID).find('img');			
			// get source from data-swatch-image
			var swatchImageSrc = swatch.attr('data-swatch-image');
			var mainImage = jQuery(targetPage+'.mainImage img');
			if (swatchImageSrc){
				//add loading class				
				jQuery(targetPage+'.imageStatus').removeClass('loaded').addClass('loading');								
				var zoomImage = swatchImageSrc;	
				zoomImage = zoomImage.replace("&op_sharpen=0","&op_sharpen=1");
				var zoomImageLarge = jQuery(targetPage+'.swatches dd.hot a img').attr('data-large-image')+"?rgn=0,0,0,0&op_sharpen=1";
				// set magic zoom attributes and show/hide zoomable here				
				MagicZoomPlus.update('itemZoom', zoomImageLarge, zoomImage, 'click-to-deactivate: true; show-title:false; disable-expand:true; zoom-position: inner; initialize-on: hover; selectors-class : Active; click-to-activate: false');							
				jQuery(targetPage+'.imageStatus').removeClass('loading').addClass('loaded');
				loadImageTransitionFlag = false;				
			}				
		}
		zoomImageCheck = function(obj, type){	
			if (type == "swatch"){				
				var imageSrc = jQuery(obj).find('img').attr('data-large-image');	
			}else{
				//if clicking on a alt image
				var imageSrc = jQuery(obj).attr('href');
				var colorSelectedAlt = jQuery(obj).attr('data-color-name');					
				jQuery(targetPage+'.mainImage .imageColor span.name').html(colorSelectedAlt);
			}		
			if (imageSrc != "" && imageSrc != undefined){
				//check to see if image zoomable
				var startIndex = imageSrc.indexOf('/EB');
				var imageCode = imageSrc.substr(startIndex,7);				
				if (imageCode.indexOf('I') == -1){				
					jQuery(targetPage+'.mainImage').removeClass('Zoom');
					jQuery(targetPage+'.zoomControls').removeClass('Zoom');
					jQuery(targetPage+'.zoomControls').html('<div class="nonZoomable"><span class="text">This image is not Zoomable</span></div>');
					jQuery(targetPage+'.MagicZoomPlusHint').css('display','none');
				}else{					
					jQuery(targetPage+'.mainImage').addClass('Zoom');
					jQuery(targetPage+'.zoomControls').addClass('Zoom');
					jQuery(targetPage+'.zoomControls').html(zoomMessage);
					jQuery(targetPage+'.MagicZoomPlusHint').css('display','block');
					zoomFullScreen();
				}
			}
			
		}
		setProductPageDefaults = function(){
			// Values to set
			selectedColorId = "";
			selectedSizeId = "";
			giftbox = "";
			monogramCheck ="";
		}
		resetProductPage = function(){	
			// reset any vars here			
			if(!initProductModuleFlag){
	            jQuery(targetPage+'input[name=selectedSizeId]').val("");
	            jQuery(targetPage+'input[name=selectedColorId]').val("");   
	            jQuery(targetPage+'#monogramCheck').attr('checked', false);
	            jQuery(targetPage+'#giftboxCheck').attr('checked', false);	           
	            if (!eob){
	            	jQuery(targetPage+'input[name=cut]:first').attr('checked', true);
	            }else{	            	
	            	var itemNumber = jQuery(targetPage+'input[name=itemNumber]').val();
	            	var selectedRadioButton =  jQuery(targetPage+'input:radio[data-item-number*='+itemNumber+']'); 	            	
	            	if(selectedRadioButton){	            		
	            		selectedRadioButton.attr('checked', true);
	            		updateInseamLength();
	            	}	            	
	            }
			}else{
				if(editMode){
					var itemNumber = jQuery(targetPage+'input[name=itemNumber]').val();
	            	var selectedRadioButton =  jQuery(targetPage+'input:radio[data-item-number*='+itemNumber+']'); 	            	
	            	if(selectedRadioButton){	            		
	            		selectedRadioButton.attr('checked', true);
	            		updateInseamLength();
	            	}	
				}else{
					jQuery(targetPage+'input[name=cut]:first').attr('checked', true);
				}
			}
            
            // private        
            o = options || {};      
            cssClass = o.cssClass || {};
            selectedTab = o.selectedTab || '';
            cLog = jQuery('#console_log');
            PP = jQuery('#dossier').hasClass('PP'); //set true if standalone Product Page
            PPL = jQuery('#fbBox #dossier').hasClass('PPL'); //set true if Product Page Layer
            EOB = jQuery('#dossier').hasClass('eob'); //set true if Product Page Layer EOB
            if (PPL){
                  eob = jQuery('#fbBox #dossier').hasClass('eob'); // set true if eob page and PPL
                  soldOut = jQuery('#fbBox #dossier').hasClass('soldout'); //set true if soldout and PPL
                  editMode = jQuery('#fbBox #dossier').hasClass('EDIT'); //set true if edit and PPL               
            }else if (EOB){
                  eob = jQuery('#dossier').hasClass('eob'); // set true if eob page
                  soldOut = jQuery('#dossier').hasClass('soldout'); //set true if soldout
                  editMode = jQuery('#dossier').hasClass('EDIT'); //set true if edi
            }           
            if (PPL){
                  targetPage = '#fbBox #dossier.PPL ';
            }else{
                  targetPage = '#dossier ';
            }

		}
		
        getGiftBoxStyle = function () {
            jQuery('#fbBox #fbCorners').css({
                left: "0",
                top: "0",
                borderWidth: "0"
            });
        }
		giftBoxDetails = function(sectionId, SiteCode){	
			var pdpURL = rewirteUrl('/ajax/get_product_info.jsp?sectionId=' + sectionId + '&sectionName=GiftBox&siteProductRef=' + SiteCode);	  
			if (sectionId !="" && SiteCode !=""){
				fb.start(pdpURL , 'type:ajax height:347 width:700 autoFitHTML:true scrolling:no outerClose:true controlsPos:tr afterItemStart:getGiftBoxStyle()');
			}
		}
        getMonogramStyle = function () {
            jQuery('#fbBox #fbCorners').css({
                left: "0",
                top: "0",
                borderWidth: "0"
            });
        }
		monogramDetails = function(sectionId, SiteCode){
			if (sectionId !="" && SiteCode !=""){
				var pdpURL = rewirteUrl('/ajax/get_product_info.jsp?sectionId=' + sectionId + '&sectionName=Monogram&siteProductRef=' + SiteCode);				
				fb.start(pdpURL, 'type:ajax height:454 width:800 autoFitHTML:true scrolling:no outerClose:true controlsPos:tr afterItemStart:getMonogramStyle()');
			}
		}
		hemDetails = function(sectionId, SiteCode){
			if (sectionId !="" && SiteCode !=""){
				sizeChartDetails(sectionId, SiteCode);
			}
		}	
		sizeChartDetails = function(sectionId, SiteCode){
			if (sectionId !="" && SiteCode !=""){
				var departId = "" + sectionId;
				var sizeChartFlag = false;
				var sections = "";
				var siteFlag = "eb";
				var sizeChartUrl = "/assets/html/sizecharts/";					
				
				if(jQuery("body").hasClass("EB") && jQuery(targetPage).hasClass("EB")){					
					siteFlag = "eb";
				}
				else if(jQuery("body").hasClass("FA") && jQuery(targetPage).hasClass("FA")){					
					siteFlag = "fa";
				}
				else if(jQuery("body").hasClass("EB") && jQuery(targetPage).hasClass("FA")){					
					siteFlag = "fa";
				}
				else{					
					siteFlag = "eb";
				}
				
				if(departId !=""){					
					//tab 1 womens clothing
					if (departId == "6" || departId == "8" || departId == "9" || departId == "06" || departId == "08" || departId == "09" || departId == "10" || departId == "11" || departId == "17" || departId == "31" || departId == "45"){
						
						sections = "1";	
						selectedSizeChartTab = 0;
						sizeChartName = "women."+siteFlag+".html";	
						sizeChartUrl = sizeChartUrl + sizeChartName;
						sizeChartFlag = true;
					}
					//tab 2 womens accessories
					if (departId == "16"){
						sections = "1";	
						selectedSizeChartTab = 1;
						sizeChartName = "women."+siteFlag+".html";	
						sizeChartUrl = sizeChartUrl + sizeChartName;
						sizeChartFlag = true;
					}
					//tab 3 womens footwear
					if (departId == "20"){
						sections = "1";	
						selectedSizeChartTab = 2;
						sizeChartName = "women."+siteFlag+".html";	
						sizeChartUrl = sizeChartUrl + sizeChartName;
						sizeChartFlag = true;
					}
					
					//tab 1 mens clothing
					if (departId == "1" || departId == "4" || departId == "01" || departId == "04" || departId == "3" || departId == "03" ||  departId == "15" || departId == "29" || departId == "33" || departId == "34" || departId == "38"){
						sections = "1";	
						selectedSizeChartTab = 0;
						sizeChartName = "men."+siteFlag+".html";	
						sizeChartUrl = sizeChartUrl + sizeChartName;
						sizeChartFlag = true;
					}
					//tab 2 mens accessories
					if (departId == "14"){
						sections = "1";	
						selectedSizeChartTab = 1;
						sizeChartName = "men."+siteFlag+".html";	
						sizeChartUrl = sizeChartUrl + sizeChartName;
						sizeChartFlag = true;
					}
					//tab 3 mens footwear
					if (departId == "19"){
						sections = "1";	
						selectedSizeChartTab = 2;
						sizeChartName = "men."+siteFlag+".html";	
						sizeChartUrl = sizeChartUrl + sizeChartName;
						sizeChartFlag = true;
					}
					//tab 4 mens pant hem styles
					if (departId == "103"){
						sections = "1";	
						selectedSizeChartTab = 1;
						sizeChartName = "men."+siteFlag+".html";	
						sizeChartUrl = sizeChartUrl + sizeChartName;
						sizeChartFlag = true;
					}
					
					//tab 1 FA Mens clothing
					if (departId == "88"){
						sections = "1";	
						selectedSizeChartTab = 0;
						sizeChartName = "technical."+siteFlag+".html";	
						sizeChartUrl = sizeChartUrl + sizeChartName;
						sizeChartFlag = true;
					}
					//tab 2 FA Womens clothing
					if (departId == "89"){
						sections = "1";	
						selectedSizeChartTab = 1;
						sizeChartName = "technical."+siteFlag+".html";	
						sizeChartUrl = sizeChartUrl + sizeChartName;
						sizeChartFlag = true;
					}
					//tab 3 FA accessories
					if (departId == "41"){
						sections = "1";	
						selectedSizeChartTab = 2;
						sizeChartName = "technical."+siteFlag+".html";	
						sizeChartUrl = sizeChartUrl + sizeChartName;
						sizeChartFlag = true;
					}	
					
					//tab 1 Baby clothing
					if (departId == "4000"){
						sections = "1";	
						selectedSizeChartTab = 0;
						sizeChartName = "kids."+siteFlag+".html";	
						sizeChartUrl = sizeChartUrl + sizeChartName;
						sizeChartFlag = true;
					}
					//tab 2 Boys clothing
					if (departId == "4001" || departId == "87"){
						sections = "1";	
						selectedSizeChartTab = 1;
						sizeChartName = "kids."+siteFlag+".html";	
						sizeChartUrl = sizeChartUrl + sizeChartName;
						sizeChartFlag = true;
					}
					//tab 3 Girls clothing
					if (departId == "4002"){
						sections = "1";	
						selectedSizeChartTab = 2;
						sizeChartName = "kids."+siteFlag+".html";	
						sizeChartUrl = sizeChartUrl + sizeChartName;
						sizeChartFlag = true;
					}			
					
					//tab 1 swim miracle suits
					if (departId == "3412"){
						sections = "1";	
						selectedSizeChartTab = 0;
						sizeChartName = "swim_miraclesuit."+siteFlag+".html";	
						sizeChartUrl = sizeChartUrl + sizeChartName;
						sizeChartFlag = true;
					}
					
					//tab 1 swim athena suits
					if (departId == "3415"){
						sections = "1";	
						selectedSizeChartTab = 0;
						sizeChartName = "swim."+siteFlag+".html";	
						sizeChartUrl = sizeChartUrl + sizeChartName;
						sizeChartFlag = true;
					}
										
					//tab 1 swim miracle suits
					if (departId == "12"){
						sections = "1";	
						selectedSizeChartTab = 0;
						sizeChartName = "swim."+siteFlag+".html";	
						sizeChartUrl = sizeChartUrl + sizeChartName;
						sizeChartFlag = true;
					}
				
				}
				
			}			
			
			if (sizeChartFlag){
				var pdpURL = rewirteUrl(sizeChartUrl);	
				fb.start(pdpURL, 'type:ajax height:600 width:996 doAnimations:false autoFitHTML:true scrolling:no showOuterClose:true boxLeft:10% controlsPos:tr afterItemStart:updateTabs('+selectedSizeChartTab+')');
			} else {
				alert("We're sorry but this product doesn't have a size chart!");
			}			
			
		}
		checkImageZoomable = function(){
			if (jQuery('#dossier').hasClass('PP') || jQuery('#dossier').hasClass('PPL')){
				var defaultImageUrlDB = jQuery(targetPage+'#itemZoom').attr('href');
				if (defaultImageUrlDB != undefined){// no images
					var mainProductImage = defaultImageUrlDB;
					var mainProductImageZoom = defaultImageUrlDB;
					//set main image with sharpened img
					var sharpenIndex = defaultImageUrlDB.indexOf("&op_sharpen=0");
					var sharpenFixedIndex = defaultImageUrlDB.indexOf("&op_sharpen=1");
					if (sharpenIndex >= 0) {
						mainProductImage = defaultImageUrlDB.replace("&op_sharpen=0","&op_sharpen=1");
						mainProductImageZoom = mainProductImage;
					} else if (sharpenFixedIndex < 0) {
						mainProductImage += "&op_sharpen=1";
						mainProductImageZoom = mainProductImage;
					}
					
					jQuery(targetPage+'#itemZoom').attr('src',mainProductImageZoom);	
					
					MagicZoomPlus.update('itemZoom', mainProductImageZoom, mainProductImage, 'click-to-deactivate: true; show-title:false; disable-expand:true; zoom-position: inner; initialize-on: hover; selectors-class : Active; click-to-activate: false');					
					jQuery(targetPage+'.imageStatus').removeClass('loading').addClass('loaded');
					
					//check to see if image zoomable
					var startIndex = mainProductImage.indexOf('/EB');
					var imageCode = mainProductImage.substr(startIndex,7);				
					if (imageCode.indexOf('I') == -1){				
						jQuery(targetPage+'.mainImage').removeClass('Zoom');
						jQuery(targetPage+'.zoomControls').removeClass('Zoom');
						jQuery(targetPage+'.zoomControls').html('<div class="nonZoomable"><span class="text">This image is not Zoomable</span></div>');
						jQuery(targetPage+'.MagicZoomPlusHint').css('display','none');
					}else{					
						jQuery(targetPage+'.mainImage').addClass('Zoom');
						jQuery(targetPage+'.zoomControls').addClass('Zoom');
						jQuery(targetPage+'.zoomControls').html(zoomMessage);
						jQuery(targetPage+'.MagicZoomPlusHint').css('display','block');
						zoomFullScreen();
					}
				}
			}
		}
		eobCheck = function(){			
			if (eob && editMode){				
				var updateCountExpected = 2;
				var cutType = itemForEditValues.item.cutType;
				var colorid = itemForEditValues.item.colorid;
				var defaultColorName = itemForEditValues.item.defaultColorName;
				var defaultImageUrl = itemForEditValues.item.defaultImageUrl;
				var sizeid = itemForEditValues.item.sizeid;
				var quantity = itemForEditValues.item.quantity;
				var productId = itemForEditValues.item.productid;
				var categoryid = itemForEditValues.item.categoryid;
				var clearanceFlag = itemForEditValues.item.clearanceFlag;
				var ensid = itemForEditValues.item.ensid;
				var itemType = itemForEditValues.item.itemType;
				var regularPrice = itemForEditValues.item.regularPrice;
				var totalPrice = itemForEditValues.item.totalPrice;
				var currentprice = itemForEditValues.item.currentprice;
				var invstatus = itemForEditValues.item.invstatus;
				var hemStyle = itemForEditValues.item.hemStyle;
				var inseamLength = itemForEditValues.item.inseamLength;
				var thresholdQty = 10;
				
				if (itemForEditValues.item.inseamflag == 'Y') {
					
					inseamFlag = itemForEditValues.item.inseamflag;
					selectValues("hemStyle", itemForEditValues.item.hemStyle);
					if (jQuery('#hemStyle').value != "Unfinished" && jQuery('#hemStyle').value != "default") {
						updateCountExpected = 3;
						//getInseamLength(jQuery('#hemStyle'));
						updateInseamLength();
					}
				}
				
				if (clearanceFlag == "Y") {
					getColorsSizesPage();
				} else {
					getColorsPage();
					// Set selected color name
					if(defaultColorName !=""){		
						jQuery('#change_col_text span.colorName').html(defaultColorName);
						jQuery('.imageColor span.name').html(defaultColorName);		
					}
					getSizesPage();
				}
				// Set radio cut type button
				if(cutType !=""){	
					var radioButton = "input:radio[value="+productId+"]";
					jQuery(radioButton).attr('checked',true);	
					//check for and update inseam info
					var cutID = jQuery(radioButton).attr('id');
					var cutNumber = cutID.replace('cut_','');
					var inseamFlag = jQuery('#inseamFlag_'+cutNumber).attr('value');
					if (inseamFlag == "Y"){
						jQuery('#inseamDetails').removeClass('errorShow').removeClass('errorHide');
					}else{
						jQuery('#inseamDetails').removeClass('errorShow').addClass('errorHide');
					}
				}	
				
				if (quantity !=""){
					jQuery('#quantity').val(quantity);
				}
				
				zoomImageCheckPP = function(){			
					var imageSrc = jQuery('.mainImage img').attr('src');
					if (imageSrc != "" && imageSrc != undefined){
						var zoomMessage = '<div class="Zoomable"><span class="icon zoomMessage"></span><span class="text">Roll over image to zoom in</span><a href="javascript:void(0);" class="zoomFullScreenAlt"><span class="icon imageMessage"></span><span class="text largerClick">Click for larger image</span></a></div>';
						//check to see if image zoomable
						var startIndex = imageSrc.indexOf('/EB');
						var imageCode = imageSrc.substr(startIndex,7);				
						if (imageCode.indexOf('I') == -1){				
							jQuery('.mainImage').removeClass('Zoom');
							jQuery('.zoomControls').removeClass('Zoom');
							jQuery('.zoomControls').html('<div class="nonZoomable"><span class="text">This image is not Zoomable</span></div>');
							jQuery('.MagicZoomPlusHint').css('display','none');
						}else{					
							jQuery('.mainImage').addClass('Zoom');
							jQuery('.zoomControls').addClass('Zoom');
							jQuery('.zoomControls').html(zoomMessage);
							jQuery('.MagicZoomPlusHint').css('display','block');				
						}
					}
				}
				
				// Set main image check for defaultImageUrl not null
				if(defaultImageUrl !== "" && defaultImageUrl !== undefined )
				{		
					jQuery('.imageStatus').removeClass('loaded').addClass('loading');		
					var mainImageObj = jQuery('#itemZoom img');	
					var mainImageSrc = mainImageObj.attr('src',defaultImageUrl);
					var swatchImage = jQuery('#swatches #swatch'+colorid+' img');			
					var mainImageSrcLarge = defaultImageUrl.replace('$mainImage$&wid=400&hei=496','&op_sharpen=1');	
					jQuery('#itemZoom').attr('href',mainImageSrcLarge);
					MagicZoomPlus.update('itemZoom', mainImageSrcLarge, mainImageSrc, 'disable-expand:true; show-title:false; zoom-position: inner; initialize-on: hover; selectors-class : Active; click-to-activate: false');
					zoomImageCheckPP();
					jQuery('.imageStatus').removeClass('loading').addClass('loaded');		
				}
				MagicZoomPlus.refresh();
				MagicScroll.init();				
			} else if (eob) {
				if (clearanceFlag == "Y") {
					getColorsSizesPage();
				} else {
					getColorsPage();
					getSizesPage();
				}
				MagicZoomPlus.refresh();
				MagicScroll.init();	
			}
		};	
		wishListCheck = function(){
			
		}
		setBreadCrumbVariable = function() {
			var $totalAnchors = jQuery('#breadcrumb a').length;
			switch ($totalAnchors) {
				case 4:
					var crumbVar = jQuery('#breadcrumb a.breadcrumbLevel_3').attr('href');
					break;
				case 3:
					var crumbVar = jQuery('#breadcrumb a.breadcrumbLevel_2').attr('href');
					break;
			}
			return crumbVar;
		}
		setDefaultFontColor = function () {
			jQuery('.infoModule .content p.overview font').css({
				color: '#333333'
			});
			jQuery('#footer_content .wrapper span.col1').add(jQuery('#footer_content .wrapper span.col2')).css({
				color: '#333333'
			});
		}
		setCoreMetricsProductData = function () {
			var isMPP = jQuery('#isMPP').val();
			if (isMPP !== '1') {
	            var piValue = '';
	            var isEob = jQuery(targetPage+'#eob').val()
	            if (isEob == 'true') {
	                var pid = jQuery(targetPage+'#deptIndex').val()
	    					+ jQuery(targetPage+'#dept').val() + ' '
	    					+ jQuery(targetPage+'#firstEffort').val() + ' '
	    					+ jQuery(targetPage+'#item').val();
	                piValue = 'T50';
	            } else {
	                var pid = shownEnsembleId;
	                if (YAHOO.ebauer.productUtils.buyAnotherMode === true) {
	                    piValue = 'T429P' + pid;
	                } else {
	                	piValue = document.forms.productForm.pathInfo.value;
	                }
	            }
	
	            var tempURL = GetCookie("REFERRAL_URL");
	            
	            if (tempURL == '' || tempURL == null) {
	                tempURL = GetCookie('PREVIOUS');
	            }
		           
	            var standaloneFlag = jQuery('#standaloneFlag').val();
	
	            if (standaloneFlag === "false") {
	                // SetCookie('REFERRAL_URL', document.location.href);
	                DelCookie("REFERRAL_URL");
	                var theEBPi = escape(document.forms.productForm.name.value + ' ' + pid);
	    			SetCookie('ebPi',theEBPi);	                
	            } else {
	            	SetCookie('PREVIOUS', escape(document.location.href));
	                DelCookie('REFERRAL_URL');
	            }
			}
        }
		faceBookButton = function() {
			var facebookURL = "//www.facebook.com/plugins/like.php?href=";
			var facebookPageURL = window.location;
			var facebookParams = "&amp;send=false&amp;layout=button_count&amp;width=90&amp;show_faces=false&amp;action=like&amp;colorscheme=light&amp;font&amp;height=21";
			var facebookAPIID = "&amp;appId=295380103910634";
			var facebookIframe = '<iframe src="'+facebookURL+facebookPageURL+facebookParams+facebookAPIID+'" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:90px; height:21px;" allowTransparency="true"></iframe>';
			jQuery('.social .like').html(facebookIframe);	
		}
		// init section
		init = function(){	
			clearanceFlag = jQuery(targetPage+'#clearanceCategory').val();
            if (!initProductModuleFlag){
            	setCoreMetricsProductData();
                getProductPageHash();
                resetProductPage();// reset variables                 
                assignEventHandlers();
                if(!soldOut){
                      imageThumbScroll();
                }
                updateItemNumber();                       
                createHemStyle(); //create Hem Style drop down options
                createdDefaultInseamOptions(); // create default inseam options
                checkImageZoomable();                     
                addTooltips();
                eobCheck();
                wishListCheck();        
                setDefaultFontColor();
                setBreadCrumbVariable();
                setTipToolStyle();
                updateInseamLength();
              //  MagicZoomPlus.refresh();
                MagicScroll.init();
                initProductModuleFlag = true;
                faceBookButton();
          } else {
                selectedColorIdHash = jQuery.getUrlVar('colorId');
                resetProductPage();// reset variables
                assignEventHandlers();
                if(!soldOut){
                      imageThumbScroll();
                }              
                updateItemNumber();                       
                createHemStyle(); //create Hem Style drop down options
                createdDefaultInseamOptions(); // create default inseam options
                checkImageZoomable();                     
                addTooltips();
                eobCheck();
                wishListCheck();        
                setDefaultFontColor();
                setBreadCrumbVariable();
                setTipToolStyle(); 
                updateInseamLength();
               // MagicZoomPlus.refresh();
                MagicScroll.init();
                initProductModuleFlag = true;
                faceBookButton();
          }
		}
					
		init();		      		
			
	};	
		
})(jQuery);
