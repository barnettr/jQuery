	(function(jQuery){

	/* Tabs jQuery Module by Rick Young */
	// UL options :	
	// cssClass: class || false	
	// selectedTab: # || 1
	// $j('.tabsEB').tabsEB({cssClass:'fa', selectedTab:3});	
	
	jQuery.fn.tabsEB = function(options) {
			// private
			var o = options || {};			
			var cssClass = o.cssClass || {};
			var selectedTab = o.selectedTab || 1;
			
				if (cssClass)					
					jQuery(this).addClass(cssClass);
					
			return this.each(function(){			
				var e = jQuery(this);	
				var l = e.find('div.tabsEB li.button');
				if (!e)
						return false;	
				if (!l)
						return false;	
						
				l.each( function(){
						var li = jQuery(this);
						li.bind('click', function(){
							updateTabs(li);	
							return false;
						})
						
						var updateTabs = function(li) {
							var currentTabId = jQuery(li);
							var currentPanelIda = currentTabId.find('a').attr('href');
							// find # and trim everything to the right to fix a ie bug
							var tabIndexId = currentPanelIda.indexOf("#");
							var currentPanelId = currentPanelIda.slice(tabIndexId,currentPanelIda.length);							
							jQuery('.tabsEB .tabs li').removeClass('selected');
							jQuery('.tabsEB .panel').removeClass('selected');
							jQuery(currentTabId).addClass('selected');
							jQuery(currentPanelId).addClass('selected');							
						}

						var init = function(li){
						var hash = window.location.hash.replace("#","").split("|") || {};
						var aTag = li.find('a');
						var aTagHrefTemp = aTag.attr('href');
						var tabIndexId = aTagHrefTemp.indexOf("#");
						var aTagHref = aTagHrefTemp.slice(tabIndexId,aTagHrefTemp.length); 
						
							if ('#tabs-'+selectedTab == aTagHref){
								var selectedli = aTag.parent();									
								updateTabs(selectedli);	
							}
														
						}	
					
						init(li);
				});
								
				
			});
			
		}
		
	})(jQuery);