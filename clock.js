var clock = {
	init: function() {
	}
}

var pointer = {
	// moves at 15 degrees per hour for 24 hours
	
	increment: 15,
	rotated: 0,
	speed: .3,
	$el: $('.clock__pointer'),
	move: function() {
		var self = this;
		
		if(this.rotated < (360 - this.increment)) {
			this.rotated += this.increment;
			this.$el.css('transform','rotate('+this.rotated+'deg)');
		} else {
			this.$el.css('transform','rotate(360deg)');
			this.rotated = 0;
			setTimeout( function() {
				self.$el.css('transition', 'transform 0s');
				self.$el.css('transform','rotate(0deg)');
				self.$el.css('padding');
				self.$el.css('transition', 'transform '+self.speed+'s');
				}, (self.speed*1000) );
		}
		
		setTimeout( function(){ self.move() }, 60*60*1000);
	},
	init: function(hour) {
		var self = this;
		this.rotated = hour;
		this.$el.css('transform','rotate('+this.rotated+'deg)');
		setTimeout( function(){ self.move() }, 60*60*1000);
	}
};

var sun = {
};

var moon = {
	$el: $('.clock__moon'),
	position: function() {},
	setPhase: function() {
		var now = new Date();
		var year = now.getFullYear();
		var start = new Date(year, 0, 0);
		var diff = now - start;
		var oneDay = 1000 * 60 * 60 * 24;
		var day = Math.round(diff / oneDay) / 365;
		var date = year + day;
		
		var k = (date - 2000.01643835616) * 12.3685;
		
		this.$el.css('background-position',-100 * (k % 1)+'px 0');
	},
};

var zodiac = {
};

var bohemian = {
};


$(function() {
	//pointer.init(0);
	moon.setPhase();
});

	
	/*
	var t = k/1236.85;
	var jde = 2451550.09766 + (29.530588861 * k) 
		+ (.000154 * Math.pow(t,2)) 
		- (.000000150 * Math.pow(t,3))
		+ (.00000000073 * Math.pow(t,5));
	var m = 2.5534 + 29.10535670 * k 
		- (.0000014 *	 Math.pow(t,2)) 
		- (.00000011 *  Math.pow(t,3));
	var m2 = 201.5643 
		+ 385.81693528 * k 
		+ (.0107582 *  Math.pow(t,2)) 
		+ (.00001238 *  Math.pow(t,3)) 
		- (.000000058 *  Math.pow(t,4));
	var f = 160.7108 + 390.67050284 * k - (.0016118 *  Math.pow(t,2)) - (.00000227 *  Math.pow(t,3)) - (.000000058 *  Math.pow(t,4));
	var om = 124.7746 - 1.56375588 * k + (.0020672 *  Math.pow(t,2)) + (.00000215 *  Math.pow(t,3));
	var e = 1 - .002516 * t - .0000074 * Math.pow(t,2);
	
	corrections(m2,m,f,om,e); // potentially rad
	*/
	
	
function corrections(m2,m,f,om,e) {
	// for new moon
	var nums = [
		-.4072 * Math.sin(m2),
		.17241 * e * Math.sin(m),
		.01608 * Math.sin(2 * m2),
		.01039 * Math.sin(2 * f),
		.00739 * e * Math.sin(m2 - m),
		-.00514 * e * Math.sin(m2 + m),
		.00208 * Math.pow(e,2) * Math.sin(2 * m),
		-.00111 * Math.sin(m2 - (2 * f)),
		-.00057 * Math.sin(m2 + (2 * f)),
		.00056 * e * Math.sin((2 * m2) + m),
		-.00042 * Math.sin(3 * m2),
		.00042 * e * Math.sin(m + (2 * f)),
		.00038 * e * Math.sin(m - (2 * f)),
		-.00024 * e * Math.sin((2 * m2) - m),
		-.00017 * Math.sin(om),
		-.00007 * Math.sin(m2 + (2 * m)),
		.00004 * Math.sin((2 * m2) - (2 * f)),
		.00004 * Math.sin(3 * m),
		.00003 * Math.sin(m2 + m - (2 * f)),
		.00003 * Math.sin((2 * m2) + (2 * f)),
		-.00003 * Math.sin(m2 + m + (2 * f)),
		.00003 * Math.sin(m2 - m + (2 * f)),
		-.00002 * Math.sin(m2 - m - (2 * f)),
		-.00002 * Math.sin(3 * m2 + m),
		.00002 * Math.sin(4 * m2)
	]
	
	var sum = nums.reduce(add, 0);
	console.log(sum);
}
function add(a, b) {
    return a + b;
}