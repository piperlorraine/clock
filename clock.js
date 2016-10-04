var clock = {
	init: function() {
	}
}

/* to do: smooth transition by moving 1 degree every 4 minutes */
var pointer = {
	// moves at 15 degrees per hour for 24 hours
	increment: 15,
	rotated: 0,
	speed: .3,
	$el: $('.clock__pointer--sun'),
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
	init: function(time) {
		var self = this;
		this.rotated = time.getHours() * this.increment;
		this.$el.css('transform','rotate('+this.rotated+'deg)');
		
		var millisecondsLeft = (time.getMinutes() * 60 + time.getSeconds()) * 1000 + time.getMilliseconds();
		millisecondsLeft = 60*60*1000 - millisecondsLeft;
		
		setTimeout( function(){ self.move() }, millisecondsLeft);
	}
};

var sun = {
};

var moon = {
	$mainEl: $('.clock__pointer--moon'),
	$el: $('.clock__moon'),
	getSumR: function(d,m,m2,f,e) {
		var nums = [
			Math.cos(m2) * e * -20905355,
			Math.cos(2 * d - m2) * e * -3699111,
			Math.cos(2 * d) * e * -2955968,
			Math.cos(2 * m2) * e * -569925,
			Math.cos(m) * e * 48888,
			Math.cos(2 * f) * e * -3149,
			Math.cos(2 * d - 2 * m2) * e * 246158,
			Math.cos(2 * d - m - m2) * e * -152138,
			Math.cos(2 * d + m) * e * -170733,
			Math.cos(2 * d - m) * e * -204586,
			Math.cos(m - m2) * e * -129620,
			Math.cos(d) * e * 108743,
			Math.cos(m + m2) * e * 104755,
			Math.cos(2 * d - 2 * f) * e * 10321,
			//Math.cos(m2 + 2 * f) * e,
			Math.cos(m2 - 2 * f) * e * 79661,
			Math.cos(4 * d - m2) * e * -34782,
			Math.cos(3 * m2) * e * -23210,
			Math.cos(4 * d - 2 * m2) * e * -21636,
			Math.cos(2 * d + m - m2) * e * 24208,
			Math.cos(2 * d + m) * e * 30824,
			Math.cos(d - m2) * e * -8379,
			Math.cos(d + m) * e * -16675,
			Math.cos(2 * d - m + m2) * e * -12831,
			Math.cos(2 * d + 2 * m2) * e * -10445,
			Math.cos(4 * d) * e * -11650,
			Math.cos(2 * d - 3 * m2) * e * 14403,
			Math.cos(m - 2 * m2) * e * -7003,
			//Math.cos(2 * d - m2 + 2 * f) * e,
			Math.cos(2 * d - m - 2 * m2) * e * 10056,
			Math.cos(d + m2) * e * 6322,
			Math.cos(2 * d - 2 * m) * e * -9884,
			Math.cos(m + 2 * m2) * e * 5751,
			//Math.cos(2 * m) * e,
			Math.cos(2 * d - 2 * m - m2) * e * -4950,
			Math.cos(2 * d + m2 - 2 * f) * e * 4130,
			//Math.cos(2 * d + 2 * f) * e,
			Math.cos(4 * d - m - m2) * e * -3958,
			//Math.cos(2 * m2 + 2 * f) * e,
			Math.cos(3 * d - m2) * e * 3258,
			Math.cos(2 * d + m + m2) * e * 2616,
			Math.cos(4 * d - m - 2 * m2) * e * -1897,
			Math.cos(2 * m - m2) * e * -2117,
			Math.cos(2 * d + 2 * m - m2) * e * 2354,
			//Math.cos(2 * d + m - 2 * m2) * e,
			//Math.cos(2 * d - m - 2 * f) * e,
			Math.cos(4 * d + m2) * e * -1423,
			Math.cos(4 * m2) * e * -1117,
			Math.cos(4 * d - m) * e * -1571,
			Math.cos(d - 2 * m2) * e * -1739,
			//Math.cos(2 * d + m - 2 * f) * e,
			Math.cos(2 * m - 2 * f) * e * -4421,
			//Math.cos(d + m + m2) * e,
			//Math.cos(3 * d - 2 * m2) * e,
			//Math.cos(4 * d - 3 * m2) * e,
			//Math.cos(2 * d - m + 2 * m2) * e,
			Math.cos(2 * m + m2) * e * 1165,
			//Math.cos(d + m - m2) * e,
			//Math.cos(2 * d + 3 * m2) * e,
			Math.cos(2 * d - m2 - 2 * f) * e * 8752
		];
		return nums.reduce(add, 0);
	},
	reduceDegree: function(num) {
		return num - 360 * Math.floor(num / 360);
	},
	setPosition: function(time) {
		var year = time.getUTCFullYear();
		var month = time.getUTCMonth() + 1;
		var day = time.getUTCDate() + ((time.getUTCHours()+1) * 60 + time.getUTCMinutes() + 1) / 1440;
		var a = Math.floor(year/100);
		var b = 2 - a + Math.floor(a / 4);
		
		if(month <= 2) {
			year--;
			month += 12;
		}
		var jde = Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * ( month + 1)) + day + b - 1524.5;
		console.log("jde: "+jde);
		
		var t = (jde - 2451545) / 36525;
		var d = 297.8501921 + 445267.1114034 * t
				- .0018819 * Math.pow(t,2)
				+ Math.pow(t,3) / 545868
				- Math.pow(t,4) / 113065000;
		var m = 357.5291092 + 35999.0502909 * t
				- .0001536 * Math.pow(t,2)
				+ Math.pow(t,3) / 24490000;
		var m2 = 134.9633964 + 477198.8675055 * t
				+ .0087414 * Math.pow(t,2)
				+ Math.pow(t,3) / 69699
				- Math.pow(t,4) / 14712000;
		var f = 93.2720950 + 483202.0175233 * t
				- .0036539 * Math.pow(t,2)
				- Math.pow(t,3) / 3526000
				+ Math.pow(t,4) / 863310000;
		var e = 1 - .002516 * t - .0000074 * Math.pow(t,2);
		
		d = this.reduceDegree(d);
		m = this.reduceDegree(m);
		m2 = this.reduceDegree(m2);
		f = this.reduceDegree(f);
		
		console.log("t: "+t);
		console.log("d: "+d);
		console.log("m: "+m);
		console.log("m2: "+m2);
		console.log("f: "+f);
		console.log("e: "+e);
		
		var sumR = this.getSumR(d,m,m2,f,e);
		var delta = 385000.56 + sumR/1000;
		var deg = Math.cos(6378.14 / delta);
		console.log("deg1: "+deg);
		deg = Math.round((deg % 1) * 60);
		console.log("deg2: "+deg);
		this.$mainEl.css('transform','rotate('+deg+'deg)');
		
		console.log("sumR: "+sumR);
		console.log("delta: "+delta);
		console.log("deg: "+deg);
	},
	setPhase: function(time) {
		var year = time.getFullYear();
		var start = new Date(year, 0, 0);
		var diff = time - start;
		var oneDay = 1000 * 60 * 60 * 24;
		var day = Math.round(diff / oneDay) / 365;
		var date = year + day;
		
		var k = (date - 2000.01643835616) * 12.3685;
		
		this.$el.css('background-position',-100 * (k % 1)+'px 0');
		this.setPosition(time);
	},
};

var zodiac = {
};

var bohemian = {
};


$(function() {
	var now = new Date();
	pointer.init(now);
	moon.setPhase(now);
});



// note: only good for later than year 2000 predictions
function getNextMoon(date, phase) {
	var k = (date - 2000.01643835616) * 12.3685,
		i = 0;
	var decimal = k % 1;
	
	if(decimal > phase) {
		i++;
	}
	k = Math.floor(k) + i + phase;
	
	var t = k/1236.85,
		jde = 2451550.09766 + (29.530588861 * k) 
			+ (.000154 * Math.pow(t,2)) 
			- (.000000150 * Math.pow(t,3))
			+ (.00000000073 * Math.pow(t,5)),
		m = 2.5534 + 29.10535670 * k 
			- (.0000014 *	 Math.pow(t,2)) 
			- (.00000011 *  Math.pow(t,3)),
		m2 = 201.5643 + 385.81693528 * k 
			+ (.0107582 *  Math.pow(t,2)) 
			+ (.00001238 *  Math.pow(t,3)) 
			- (.000000058 *  Math.pow(t,4)),
		f = 160.7108 + 390.67050284 * k 
			- (.0016118 *  Math.pow(t,2)) 
			- (.00000227 *  Math.pow(t,3)) 
			- (.000000058 *  Math.pow(t,4)),
		om = 124.7746 - 1.56375588 * k 
			+ (.0020672 *  Math.pow(t,2)) 
			+ (.00000215 *  Math.pow(t,3)),
		e = 1 - .002516 * t 
			- .0000074 * Math.pow(t,2);
	console.log(jde);
	console.log(t);
	//corrections(m2,m,f,om,e,phase); // potentially rad
}

function corrections(m2,m,f,om,e,p) {
	// for new moon
	var nums = [];
	
	if(p == 0) {
		nums = [
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
	}
	
	var sum = nums.reduce(add, 0);
	console.log(sum);
}

function add(a, b) {
    return a + b;
}