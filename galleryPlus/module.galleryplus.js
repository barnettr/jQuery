(function(jQuery){

	/* galleryPlus by Jym McMurdo */
	/* based off of thumbGallery by Keith Childers */
	jQuery.fn.galleryPlus = function(start,rotatenum,inttime) {
		return this.each(function(){	
			var e = jQuery(this);
			var t = e.find("div.galleryPlus div.galleryPlusSlides");
			var i = start || 0;
			var i2 = 0; /* index for number of times to rotate */
			var r = rotatenum || 1; /* number of times to rotate */
			var c = jQuery("<div class='carat' style='right: "+t.width()+"px;'></div>");
			var auto;
			c.appendTo(e);
			var change = function(s) {
				var b = jQuery(s.attr("rel"));
				var f = jQuery(t.filter(".selected").attr("rel"));
				var v = b.find("var");
				if ( v.length ) {
					var url = jQuery.trim(v.text());
					b.load(url,function(res,sta,xhr){
						if ( sta == "error" )
							b.text("Error loading slide content: "+xhr.status+" "+xhr.statusText);
					});
				}
				c.stop().animate({top: s.position().top},{queue:false});
				f.fadeOut();
				b.fadeIn();
				t.removeClass("selected");
				s.addClass("selected");
			};
			var advance = function() {
				i++;
				if (i == t.length) {
					i = 0;
					clearInterval(auto);
				}
				change( t.eq(i) );
				i2++;
			};
			t.mouseover(function(){
				var s = jQuery(this);
				t.removeClass("hover");
				s.addClass("hover");
				if (!s.hasClass("selected"))
					change(s);
			});
			t.mouseout(function(){
				var s = jQuery(this);
				s.removeClass("hover");
			});
			e.mouseover(function(){
				clearInterval(auto);
			});
			change( t.eq(i) );
			if (rotatenum <= i2) {
				auto = setInterval(advance,inttime);
			} else {
				clearInterval(auto);
			};
		})
	}
	
})(jQuery);