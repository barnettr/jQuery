(function(jQuery){

/* Linepage flyouts jQuery Module by Rick Young */
// UL options :
// showtitle: true || false
// cssClass: class || false
// rel options :
// iconClass: class || false
// iconspeed: 400 || static
// mainspeed: 300 || static
// static: true ||  false
// $j('.contentFlyouts').linepageflyouts({showtitle:true, cssClass:'eb'});
// <a href="/EB/Mens/Index.cat" rel="{'layerbox':true}"></a>;
	
jQuery.fn.linepageflyouts = function(options) {
		// private
		var o = options || {};			
		var cssClass = o.cssClass || {};
		
			if (cssClass)					
				jQuery(this).addClass(cssClass);
				
		return this.each(function(){						
			var e = jQuery(this);	
			var l = e.children('li');	
				
			l.each( function(){
				var li = jQuery(this);
				var c = li.find('.content');
				var h = li.find('.header');
				var i = li.find('.icon');	
				var a = li.find('a'); 					
				var rel = a.attr('rel');
				var arel = {};
				var mcs = 400;
				var ics = 300;
				
				if(rel){
					arel = eval('(' + rel + ')');					
				}
				//if icon option in rel add icon to li
				if(arel.iconclass){
					li.append('<span class="icon '+arel.iconclass+'"></span>');
					// get new dom reference for icon
					i = jQuery(this).find('.icon');
					var ipos = i.position();
				}				
								
				if (!c)
					return false;
				if (!h)
					return false;						
											
					// default values;
					var contentFlyoutHeight = o.contentFlyoutHeight || li.outerHeight();				
					var contentHeight = o.contentHeight || c.outerHeight();				
					var slideUpHeight, 	slideDownHeight, showtitle;			
					var slideHeaderHeight = o.slideHeaderHeight || h.outerHeight();						
				
					var getCurentValues = function(){								
						showtitle = o.showtitle || false;
						//if icon has a speed set in rel
						if(rel){							 
							showtitle = arel.showtitle;								
						}
						 
						 //if icon has a speed rel
						if(arel.iconspeed){
							ics = arel.iconspeed;
						}
						
						//if main has a speed rel
						if(arel.mainspeed){
							mcs = arel.mainspeed;							
						}
				
						contentFlyoutHeight = li.outerHeight();										
						contentHeight = c.outerHeight();	
						slideHeaderHeight = h.outerHeight();									
						slideUpHeight = (contentFlyoutHeight - contentHeight)+'px';	
						
						if(arel.iconclass)
							slideUpHeightIcon = (ipos.top - contentHeight+ slideHeaderHeight)+'px';	
						
						if (showtitle){							
							slideDownHeight	= (contentFlyoutHeight - slideHeaderHeight)+'px';
							if(arel.iconclass)
								slideDownHeightIcon = ipos.top+'px';	
						}else{							
							slideDownHeight	= contentFlyoutHeight+'px';	
							if(arel.iconclass)
								slideDownHeightIcon = ipos.top+'px';								
						};	
					}
					
					var slideUp = function(){
						if (!arel.static){	
							getCurentValues();
							c.stop(true,true).animate({
								'top':slideUpHeight
							}, mcs)
							if(arel.iconclass && !isNaN(arel.iconspeed) ){
							
								i.stop(true,true).animate({
									'top':slideUpHeightIcon
								}, ics)
							}	
						}
					};
					
					var slideDown =  function(){
						getCurentValues();										
						c.stop(true,true).animate({
							'top':slideDownHeight
						}, mcs)
						if(arel.iconclass && !isNaN(arel.iconspeed) ){
							i.stop(true,true).animate({
								'top':slideDownHeightIcon
							}, ics)
						}
					};	
					
					var init = function(){
						slideDown();
					}	
										
					li.hover(slideUp,slideDown);						
					init();												
				
			});
								
			
		});
		
	}
	
})(jQuery);