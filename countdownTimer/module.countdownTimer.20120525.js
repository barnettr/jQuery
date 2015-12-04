; (function (jQuery) {
    jQuery.fn.countdown = function () {
        return this.each(function () {

            var counterId = jQuery(this).find("div.counters div.counter").each(function (index) {
                jQuery(this).attr("id", index);
            });

            var endSale = [], startSale = [], getNow = [], timeLeft = [], seconds = [], minutes = [], hours = [],
            days = [], showmessage = [], interval_handler = [], id = [], i = [], clock = [], clockdata = [], clockwhite = [], 
            clockgray = [];

            var updateClock = function (i) {
                jQuery(counterId).each(function () {
                    i = jQuery(this).attr('id');
                    if (i == jQuery(this).attr("id")) {
                        this.endSale = (new Date(jQuery(this).attr('data-endTime')));
                        this.startSale = (new Date(jQuery(this).attr('data-startTime')));
                        this.clock = jQuery(this).attr('data-clock');
                        this.clockdata = jQuery(this).attr('data-Animate');
                        this.clockwhite = jQuery(this).find("div.clock img#whiteclock");
                        this.clockgray = jQuery(this).find("div.clock img#whitegray");
                        this.getNow = (new Date());
                        this.timeLeft = this.endSale.getTime() - this.getNow.getTime();
                        delete this.getNow;
                        this.seconds = Math.floor(this.timeLeft / 1000);
                        this.minutes = Math.floor(this.seconds / 60);
                        this.hours = Math.floor(this.minutes / 60);
                        this.days = Math.floor(this.hours / 24);
                        this.hours %= 24;
                        this.minutes %= 60;
                        this.seconds %= 60;
                        this.id;
                        
                        if (this.clock == "white" && this.clockdata == "hasAnimated") {
                        	this.clockwhite = '<img class="whiteclock" data-Animate="hasAnimated" src="/assets/ocp/content/mens/120608/static_clock.png" />';
                        } else {
                            this.clockwhite = '<img class="whiteclock" src="/assets/ocp/content/mens/120608/animated_clock.gif" />';
                        }
                        if (this.clock == "gray" && this.clockdata == "hasAnimated") {
                        	this.clockgray = '<img class="grayclock" data-Animate="hasAnimated" src="/assets/ocp/content/mens/120608/gray_clock.png" />';
                        } else {
                            this.clockgray = '<img class="grayclock" src="/assets/ocp/content/mens/120608/animated_clock_gray.gif" />';
                        }
                        if (this.timeLeft > 0) {
                        	if (this.hours <= 1) {
                        		if (this.clockwhite || this.clockgray == undefined) {return}
                            	this.showmessage += "<div></div>";
                            	jQuery(this).html(this.showmessage);
                            	clearInterval(interval_handler[this.id]);
                            } else {
                            	this.showmessage = "<div class='clock'>" + ((this.clock=='white') ? this.clockwhite : this.clockgray) + "</div>";
                            	this.showmessage += "<div class='countdowncopy boost'>Ends in ";
                            	if (this.days != 0) { this.showmessage += this.days + " day" + ((this.days != 1) ? "s" : "") + ", "; } else if (this.days == 0) { }
                            	if (this.days != 0 || this.hours != 0) { this.showmessage += this.hours + " hour" + ((this.hours != 1) ? "s" : "") + " "; } else if (this.hours == 0) { }
                            	this.showmessage += "</div>";
                            	jQuery(this).html(this.showmessage);
                            	//if (this.days != 0 || this.hours != 0 || this.minutes != 0) { this.showmessage += this.minutes + " minute" + ((this.minutes != 1) ? "s" : "") + ", "; }
                            	//this.showmessage += this.seconds + "";
                            }
                        } else if (this.timeLeft <= 0) {
                            clearInterval(interval_handler[this.id]);
                        }
                    }
                });
            }
            var getIntervals = function (id, code, time) {
                jQuery(counterId).each(function () {
                    i = jQuery(this).attr('id');
                    if (i == jQuery(this).attr("id")) {
                        this.id;
                        interval_handler[this.id] = setInterval(code, time);
                    }
                });
            };
            getIntervals(-1, updateClock, 1000);
        });
    }
})(jQuery);