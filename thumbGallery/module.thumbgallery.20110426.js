(function (jQuery) {

    jQuery.fn.thumbgallery = function (options) {
        return this.each(function () {
            var defaults = {
                slide6: jQuery('div.slides div#slide6'),
                slide2: jQuery('div.slides div#slide2'),
                thumb2: jQuery('div.thumbs div#thumb2'),
                thumb3: jQuery('div.thumbs div#thumb3'),
                thumb4: jQuery('div.thumbs div#thumb4'),
                thumb5: jQuery('div.thumbs div#thumb5'),
                youtube: jQuery('#youtube'),
                timePlayed: jQuery("div.slides input#timePlayed"),
                playerState: jQuery("div.slides input#playerState"),
                milliseconds1: jQuery(this).find("div.thumbs div#thumb1").attr("data-interval"),
                milliseconds2: jQuery(this).find("div.thumbs div#thumb2").attr("data-interval"),
                milliseconds3: jQuery(this).find("div.thumbs div#thumb3").attr("data-interval"),
                milliseconds4: jQuery(this).find("div.thumbs div#thumb4").attr("data-interval"),
                milliseconds5: jQuery(this).find("div.thumbs div#thumb5").attr("data-interval"),
                defaultInterval: 3000,
                autoRotate: "",
                auto: true,
                playvideo: false
            };
            var options = jQuery.extend({}, defaults, options);

            var t = jQuery(this).find("div.thumbs div.thumb");
            var slides = jQuery(this).children('div.slides').children('div');
            var allslides = [];
            allslides = slides.length;
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

            var getYouTubeVideo = function () {
                try { options.slide6.add(options.youtube).show(); } catch (e) { }
            };
            var hideYouTubeVideo = function () {
                try {
                    ytplayer.pauseVideo();
                    options.playerState.data("playerState", ytplayer.getPlayerState());
                    options.timePlayed.data("elapsedTime", ytplayer.getCurrentTime());
                    options.slide6.add(options.slide2).hide();
                } catch (e) { }
            };
            var getVideoState = function () {
                try {
                    if (typeof (ytplayer) == "undefined") {
                    } else {
                        var s6 = options.slide6.is(":visible");
                        var et = options.timePlayed.data("elapsedTime");
                        t.each(function (s, value) {
                            var s = jQuery(this).attr('id').substring(5);
                            if (s != 2) {
                                if (jQuery(this).hasClass("hover") && s6) { hideYouTubeVideo(); }
                            }
                            if (s == 2) {
                                if (jQuery(this).hasClass("hover") && et > 0) { getVideoAgain(); }
                            }
                        });
                    }
                } catch (e) { }
            };
            var getVideoAgain = function () {
                try {
                    var s2 = options.slide2.is(":visible");
                    var ps = options.playerState.data("playerState");
                    if (s2 && (ps == 2)) { showYouTubeVideo(); }
                } catch (e) { }
            };
            var showYouTubeVideo = function () {
                try { options.slide6.add(options.youtube).show(); } catch (e) { }
            };

            var callAjax = function (b, f, v, s) {
                var url = jQuery.trim(v.text());
                b.load(url, function (responseText, statusText, xhr) {    //  completeCallback has the following signature: function( status, statusText, responses, headers ) {}
                    if (statusText == "error") {
                        b.text("<b>Error loading slide content: " + xhr.status + " " + xhr.statusText + "</b>");
                    } else if (statusText == "success") {
                    }
                });
                f.stop(true, true).fadeOut().removeClass('selected').css({ display: 'none' });
                b.stop(true, true).fadeIn().addClass('selected').css({ display: 'block' });
                t.removeClass("selected").clearQueue();
                t.removeClass("hover").clearQueue();
                s.addClass("selected").clearQueue();
                s.addClass("hover").clearQueue();
                var pv = b.find("div.playvideo");
                if (pv.hasClass('playvideo')) {
                    options.playvideo = true;
                    jQuery(pv).one('click', function () {
                        getYouTubeVideo();
                    });
                }
            };

            var callInlineImage = function (i, s, bool) {
                if (bool) {
                    var i = s.attr('id').substring(5);
                    switch (parseInt(allslides)) {
                        case 4: var e = slides.eq(i - 2); break;
                        case 5: var e = slides.eq(i - 1); break;
                    }
                    var slideId = e.attr('id');
                    var slideClass = e.attr('class');
                    var ss = slides.filter('.selected');
                    if (e.hasClass('selected'))
                        return;
                    ss.stop(true, true).fadeOut().removeClass('selected').css({ display: 'none' });
                    e.stop(true, true).fadeIn().addClass('selected').css({ display: 'block' });
                    t.removeClass("selected").clearQueue();
                    t.removeClass("hover").clearQueue();
                    s.addClass("selected").clearQueue();
                    s.addClass("hover").clearQueue();
                } else {
                    var e = slides.eq(i);
                    var slideId = e.attr('id');
                    var slideClass = e.attr('class');
                    var ss = slides.filter('.selected');
                    if (e.hasClass('selected'))
                        return;
                    ss.stop(true, true).fadeOut().removeClass('selected').css({ display: 'none' });
                    e.stop(true, true).fadeIn().addClass('selected').css({ display: 'block' });
                    t.removeClass("selected").clearQueue();
                    t.removeClass("hover").clearQueue();
                    s.addClass("selected").clearQueue();
                    s.addClass("hover").clearQueue();
                }
            };

            var getNewThumbSlide = function (s) {
                var b = jQuery(s.attr("rel"));
                var f = jQuery(t.filter(".selected").attr("rel"));
                var v = b.find("var");
                if (v.length) {
                    callAjax(b, f, v, s);
                }
                if (!v.length || v.length == 0) {
                    callInlineImage(i, s, false);
                }

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
                    getNewThumbSlide(t.eq(i));
                }
                if (y == 4 && i == 0) {
                    getNewThumbSlide(t.eq(0));
                    clearInterval(options.autoRotate);
                    return false;
                }
                if (i == 0) {
                    options.auto;
                    clearInterval(options.autoRotate);
                    options.autoRotate = setInterval(autoAdvance, options.milliseconds1);
                    getNewThumbSlide(t.eq(i));
                }
            };
            options.auto;
            options.autoRotate = setInterval(autoAdvance, options.milliseconds2);
            getNewThumbSlide(t.eq(0));

            t.mouseover(function () {
                var s = jQuery(this);
                t.removeClass("hover");
                s.addClass("hover");
                if (!s.hasClass("selected")) {
                    var b = jQuery(s.attr("rel"));
                    var f = jQuery(t.filter(".selected").attr("rel"));
                    var v = b.find("var");
                    if (v.length) {
                        callAjax(b, f, v, s);
                    }
                    if (!v.length || v.length == 0) {
                        callInlineImage(i, s, true);
                    }
                }
                if (s.hasClass("hover") && options.playvideo) {
                    var x = s.attr('id').substring(5);
                    switch (true) {
                        case (x <= 5): getVideoState(); break;
                    }
                }
            });
            t.mouseout(function () {
                var s = jQuery(this);
                //s.removeClass("hover");
                //s.clearQueue();
            });
            jQuery(this).mouseover(function () {
                clearInterval(options.autoRotate);
            });

            var decodeQuerystring = function (evt) {
                var slideDictionary = {}, currentSelectedIndex, currentSelectedSlide, slideReference;
                slideDictionary.bestofsummer = 0;
                slideDictionary.dadsday = 1;
                slideDictionary.styleelements = 2;
                slideDictionary.swim = 3;
                slideDictionary.clearance = 4;

                var pairs = window.location.search.substring(1).split('&');
                for (j in pairs) {
                    if (pairs[j] === "") continue;
                    pair = pairs[j].split("=");
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
                return false;
            };
        });
    }
})(jQuery);