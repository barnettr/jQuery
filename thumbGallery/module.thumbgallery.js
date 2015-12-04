(function(jQuery){

	/* thumbgallery by Keith Childers */
	jQuery.fn.thumbgallery = function(start) {
		return this.each(function(){	
			var e = jQuery(this);
			var a = e.find("div.thumbs a");
			var i = start || 0;
			var c = jQuery("<div class='carat' style='right: "+a.width()+"px;'></div>");
			var m = jQuery("<div class='main'></div>");
			var auto;
			c.appendTo(e);
			m.appendTo(e);
			var change = function(s) {
				var m = e.children("div.main");
				var l = jQuery("<div class='loading' style='display:none'></div>");
				var h = s.attr("href");
				if ( s.attr("rel") ) {
					l.html("");
					l.load(s.attr("rel"),function(r,s){
						if ( s == "error" )
							alert("Error: url specified in rel attribute is invalid");
						else
							swap(m,l)
					});
				} else if ( jQuery(h).length ) {
					var h = jQuery(h).clone();
					h.appendTo(l).show();
					swap(m,l);
				} else {
					alert("Error: no valid slide specified in anchor");
				}
				c.stop().animate({top: s.position().top},{queue:false});
			};
			var swap = function(f,b) {
				f.fadeOut().remove();
				b.appendTo(e).fadeIn().addClass("main").removeClass("loading");
			};
			var advance = function() {
				i++;
				if (i == a.length) {
					i = 0;
					clearInterval(auto);
				}
				change( a.eq(i) );
			}
			a.mouseover(function(){
				var s = jQuery(this);
				if (!s.hasClass("selected"))
					change(s);
				a.removeClass("selected");
				s.addClass("selected");
			});
			e.mouseover(function(){
				clearInterval(auto);
			});
			change(a.eq(i));
			auto = setInterval(advance,4000);
		})
	}
	
})(jQuery);