(function (jQuery) {

    jQuery.fn.thumbgallery = function (options) {
        return this.each(function () {
            var defaults = {
                milliseconds1: jQuery(this).find("div.thumbs div#thumb1").attr("data-interval"),
                milliseconds2: jQuery(this).find("div.thumbs div#thumb2").attr("data-interval"),
                milliseconds3: jQuery(this).find("div.thumbs div#thumb3").attr("data-interval"),
                milliseconds4: jQuery(this).find("div.thumbs div#thumb4").attr("data-interval"),
                milliseconds5: jQuery(this).find("div.thumbs div#thumb5").attr("data-interval"),
                defaultInterval: 3000,
                autoRotate: "",
                auto: true
            };
            var options = jQuery.extend({}, defaults, options);

            var t = jQuery(this).find("div.thumbs div.thumb");
            var startIndex = jQuery(this).attr('data-startIndex');
            var endIndex = jQuery(this).attr('data-endIndex');
            var loop = jQuery(this).attr('data-loop');
            var y = 0 - 1;
            var i = 0;
            var j = 0;
            var l = 1;
            var lc = 0;
            (startIndex != "") ? i = parseInt(startIndex - 1) : "";
            (endIndex != "") ? j = parseInt(endIndex - 1) : "";
            (loop != "") ? l = parseInt(loop) : "";

            var getNewThumbSlide = function (s) {
                var b = jQuery(s.attr("rel"));
                var f = jQuery(t.filter(".selected").attr("rel"));
                var v = b.find("var");
                if (v.length) {
                    var url = jQuery.trim(v.text());
                    b.load(url, function (responseText, statusText, xhr) {    //  completeCallback has the following signature: function( status, statusText, responses, headers ) {}
                        if (statusText == "error") {
                            b.text("<b>Error loading slide content: " + xhr.status + " " + xhr.statusText + "</b>");
                        } else if (statusText == "success") {
                        }
                    });
                }
                f.fadeOut();
                b.fadeIn();
                t.removeClass("selected");
                t.removeClass("hover");
                s.addClass("selected");
                s.addClass("hover");
            };

            var autoAdvance = function () {
                i++; y++;

                if (lc >= l) {
                    i = j;
                    clearInterval(options.autoRotate);
                }
                if (i >= parseInt(t.length)) {
                    lc++;
                    i = 0;
                }

                if (i != 0) {
                    options.auto;
                    clearInterval(options.autoRotate);
                    options.autoRotate = setInterval(autoAdvance, options.defaultInterval);
                    return getNewThumbSlide(t.eq(i));
                }
                if (y == 4 && i == 0) {
                    getNewThumbSlide(t.eq(0));
                    return clearInterval(options.autoRotate);
                    return false;
                }
                if (i == 0) {
                    options.auto;
                    clearInterval(options.autoRotate);
                    options.autoRotate = setInterval(autoAdvance, options.milliseconds1);
                    return getNewThumbSlide(t.eq(i));
                }
            };
            options.auto;
            options.autoRotate = setInterval(autoAdvance, options.milliseconds2);
            getNewThumbSlide(t.eq(i));

            t.mouseover(function () {
                var s = jQuery(this);
                t.removeClass("hover");
                s.addClass("hover");
                if (!s.hasClass("selected")) {
                    getNewThumbSlide(s);
                }
            });
            t.mouseout(function () {
                var s = jQuery(this);
                //s.removeClass("hover");
            });
            jQuery(this).mouseover(function () {
                clearInterval(options.autoRotate);
            });

            var decodeQuerystring = function () {
                var slideDictionary = {}, currentSelectedIndex, currentSelectedSlide, slideReference;
                slideDictionary.newarrivals = 0;
                slideDictionary.camp = 1;
                slideDictionary.dresses = 2;
                slideDictionary.clearance = 3;

                var pairs = window.location.search.substring(1).split('&');
                for (i in pairs) {
                    if (pairs[i] === "") continue;
                    pair = pairs[i].split("=");
                    if (pair[0] == "slide") {
                        currentSelectedSlide = decodeURIComponent(pair[1]);
                    }
                }
                for (slideReference in slideDictionary) {
                    if (slideDictionary.hasOwnProperty(slideReference)) {
                        if (slideReference == currentSelectedSlide) {
                            currentSelectedIndex = slideDictionary[slideReference];
                        }

                    }
                }
                return currentSelectedIndex;
            };

            var thisSelectedIndex = null;
            thisSelectedIndex = parseInt(decodeQuerystring());
            if (!isNaN(thisSelectedIndex)) {
                options.auto = false;
                getNewThumbSlide(t.eq(thisSelectedIndex));
                clearInterval(options.autoRotate);
            } else {
                i = 0;
                return false;
            }
        });
    }
})(jQuery);