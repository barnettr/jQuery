var selectedSizeChartTab = -1; //this is used to set size chart selected tab globaly
//assign page events
changeSizeChart = function(options) {
	var currentSelectedTab = jQuery(".sizeModule ul li.ui-tabs-selected");
	var currentSelectedTabID = currentSelectedTab.attr("id").replace("tab_","");
	if (currentSelectedTabID < 1){
		currentSelectedTabID = 1;
	}
	if (options == "View Centimeters"){			
		cmSrc= jQuery("#tabs-"+currentSelectedTabID);	
		imgId = cmSrc.find('img.table');				
		imgId.attr('src', imgId.data('cm'));// switch image
		imgId.attr('usemap','#tab_'+currentSelectedTabID+'_cm');// change image map
		MoreimgId = cmSrc.find('img.moreinfo');				
		MoreimgId.attr('src', MoreimgId.data('cm'));// switch more info image
	}else{
		cmSrc= jQuery("#tabs-"+currentSelectedTabID);	
		imgId = cmSrc.find('img.table');				
		imgId.attr('src', imgId.data('inches'));// switch image
		imgId.attr('usemap','#tab_'+currentSelectedTabID+'_inches');// change image map		
		MoreimgId = cmSrc.find('img.moreinfo');				
		MoreimgId.attr('src', MoreimgId.data('inches'));// switch more info image		
	}

};	