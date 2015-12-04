	(function (jQuery) {

	    /* size charts jQuery Module by Rick Young */
	    // UL options :	
	    // cssClass: class || false	
	    // selectedTab: # || 1
	    // $j('.sizeModule').sizecharts({cssClass:'fa', selectedTab:3});	

	    jQuery.fn.sizecharts = function (options) {
	        // private
	        var o = options || {};
	        var cssClass = o.cssClass || {};
	        var selectedTab = o.selectedTab || '';

	        if (cssClass)
	            jQuery(this).addClass(cssClass);

	        return this.each(function () {
	            var e = jQuery(this);
	            var l = e.find('div.tabs li.button');
	            var selectedTabFlag = false;

	            if (!e)
	                return false;
	            if (!l)
	                return false;

	            l.each(function () {
	                var li = jQuery(this);
	                li.bind('click', function (e) {
	                    updateTabs(li);
	                    e.preventDefault(); // stop on click href
	                })

	                var updateTabs = function (li) {
	                    var currentTabId = jQuery(li);
	                    var currentPanelIda = currentTabId.find('a').attr('href');
	                    // find # and trim everything to the right to fix a ie bug
	                    var tabIndexId = currentPanelIda.indexOf("#");
	                    var currentPanelId = currentPanelIda.slice(tabIndexId, currentPanelIda.length);
	                    jQuery('.sizeModule .tabs li').removeClass('selected');
	                    jQuery('.sizeModule .panel').removeClass('selected');
	                    jQuery(currentTabId).addClass('selected');
	                    jQuery(currentPanelId).addClass('selected');
	                }

	                var init = function (li) {
	                    var hash = window.location.hash.replace("#", "").split("|") || {};
	                    var aTag = li.find('a');
	                    var aTagHrefTemp = aTag.attr('href');
	                    var tabIndexId = aTagHrefTemp.indexOf("#");
	                    var aTagHref = aTagHrefTemp.slice(tabIndexId, aTagHrefTemp.length);
	                    // check to see if li has a selected state already if so make default tab								
	                    if ('#tabs-' + selectedTab == aTagHref && selectedTabFlag == false) {
	                        var selectedli = aTag.parent();
	                        selectedTabFlag = true;
	                        updateTabs(selectedli);
	                    }

	                }

	                init(li);
	            });


	        });

	    }

	})(jQuery);