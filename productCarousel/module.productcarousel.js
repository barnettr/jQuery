(function(jQuery){
	/* productcarousel by Keith Childers */
	jQuery.fn.productcarousel = function(d,p) {
		var d = 28390;
		var cs = "/services/CatalogServicePort?method=getSubCategories";
		var ds = "/services/ProductsInCategoryServicePort?method=getProducts&includeColorsSizesSummaryFlag=N&includeColorsSizesDetailFlag=N&retrieveRelatedCategories=N&imageTypeCode=B&imageDisplayTypeId=3";
		var ps;
		var subcats = {};
		var seq = [];
		var carousels = [];
		this.each(function(){
			var e = jQuery(this);
			e.empty();
			cs = cs + "&categoryId=" + d;
			if ( jQuery("#sitePreviewDate h4").text().length ) {
				var p = jQuery("#sitePreviewDate h4").text().match(/[0-9]+\/[0-9]+\/[0-9]+/);
			}
			if (p) {
				cs = cs + "&previewDate=" + p;
				ds = ds + "&previewDate=" + p;
			}
			var getFeaturedImage = function(p) {
				var c = p.find("categoryRelationshipColorId").text() || p.find("setRelationshipColorId").text();				
				var imgs = p.find("Image");
				var i = imgs.eq(0);
				imgs.each(function(){
					if (jQuery(this).children("colorId").text() == c) {
						i = jQuery(this);
						return false;
					}
				});
				return i;
			};
			var getCategories = function(data) {
				jQuery(data).find("SubCategory").each(function(){
					var p = jQuery(this);
					var c = Number( p.children("count").text() );
					var n = p.children("name").text();
					var id = p.children("id").text();
					if (c > 0) {
						subcats[id] = n;
						seq.push(id);
					}
				});
				getProductsCallback();
			};
			var carouselInitCallback = function(carousel) {
				carousels.push(carousel);
			    carousel.buttonNext.click(function(){
			    	for (var i in carousels)
			    		carousels[i].stopAuto();
			    });
			    carousel.buttonPrev.click(function(){
			    	for (var i in carousels)
			    		carousels[i].stopAuto();
			    });
			    carousel.clip.mouseover(function(){
			    	for (var i in carousels)
			    		carousels[i].stopAuto();
			    });
			};
			var getProducts = function(data) {
				var cat = Number( jQuery(data).find("categoryId").text() );
				var div = jQuery("<div class='subcat'></div>");
				var ul = jQuery("<ul class='jcarousel-skin-productcarousel'></ul>");
				jQuery(data).find("Product").each(function(){
					var p = jQuery(this);
					var id = p.children("id").text();
					var i = getFeaturedImage(p);
					var n = p.children("name").text();
					var r = Number( p.children("minRegularPrice").text() ).toFixed(2);
					var s = Number( p.children("minCurrentPrice").text() ).toFixed(2);
					var ra = p.children("Rating");
					var ar = Number( ra.children("ar").text() ).toFixed(1);
					var nr = Number( ra.children("nr").text() ).toFixed(0);
					var li = jQuery("<li></li>");
					var url = "/catalog/product.jsp?ensembleId="+id;
					var a = jQuery('<a href="'+url+'" rel="layerbox" title="'+n+'" alt="'+n+'" name="Product Carousel: Image: Product: '+n+'"></a>');
					var b = a.clone();
					var c = a.clone();					
					a.append("<img src='"+i.children("url").text()+"&wid=279'/>");
					b.addClass("product-name").text(n);
					c.addClass("shop-now").text("SHOP NOW");
					li.append("<img src='/assets/images/ratings/rating-"+ar.replace(".","_")+".gif' width='110' height='20'></img><span class='rating-number'>("+nr+")</span>");
					if ( parseFloat(Number(r).toFixed(2)) > parseFloat(Number(s).toFixed(2)) ) {
						li.append("<span class='price-regular sale'>$"+r+"</span>");
						li.append("<span class='price-sale'>$"+s+"</span>");
					}
					else {
						li.append("<span class='price-regular'>$"+r+"</span>");
					}
					li.prepend(b);
					li.prepend("<h4>"+subcats[cat]+"</h4>");
					li.prepend(a);
					li.append(c);
					ul.append(li);
				});
				div.append(ul);
				e.append(div);
				if (ul.children("li").length > 1)
					ul.jcarousel({wrap:'circular',scroll:1,auto:4,initCallback: carouselInitCallback});
				getProductsCallback();
			};
			var getProductsCallback = function() {
				if (seq.length) {
					ps = ds + "&categoryId=" + seq[0];
					seq.shift();
					jQuery.get(ps,getProducts,'xml');
				}				
			};
			jQuery.get(cs,getCategories,'xml');
		});
	}
})(jQuery);