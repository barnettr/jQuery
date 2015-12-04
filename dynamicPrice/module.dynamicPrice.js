(function(jQuery){

	/* dynamicPrice by Keith Childers */
	jQuery.fn.dynamicPrice = function(cat,label) {
		return this.each(function(){
			var el = jQuery(this);
			var url = "/services/ProductsInCategoryServicePort?method=getProducts&showProducts=N&includeColorsSizesSummaryFlag=N&includeColorsSizesDetailFlag=N&retrieveRelatedCategories=N";
			if ( jQuery("#sitePreviewDate h4").text().length )
				url = url + "&previewDate=" + jQuery("#sitePreviewDate h4").text().match(/[0-9]+\/[0-9]+\/[0-9]+/);
			if (!cat)
				var cat = el.attr("category");
			if (!label)
				var label = el.attr("label");
			url += "&categoryId=" + cat;
			var tsTimeStamp = new Date().getTime();
			jQuery.get(url,{ },function(data){
				var price = label + " $" + Number( jQuery(data).find("minCurrentPrice").text() ).toFixed(2);
				//alert(price);
				el.text(price).fadeIn();
			});
		});
	};
})(jQuery);