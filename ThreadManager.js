/**
 * ThreadManager.js
 * Copyright (c) 2013 Nao Fujimoto, TEA FACTORY, http://teafac.com/
 * Dual licensed under MIT and GPL.
 * Date: 2013.02.06
 *
 * @description manage animation thread
 * @author Nao Fujimoto, TEA FACTORY, http://teafac.com/
 * @version 1.3 - Last updated: 2017.10.24
 * 
 *
 */


function ThreadManager() {
	this.thread = [];
	this.timers = [];
	this.cssTimers = [];
	this.options = {
		props: {},
		duration: 400,
		delay: 0,
		easing : 'easeOutCubic', 
		isAnimated : false, 
		complete : function(){}
	};
}


ThreadManager.prototype = {
	extend : function(defParam, newParam){
		var len = this.count(defParam);
		var copy = {};
		for (var i = 0 ; i < len; i++ ){
			for ( var name in newParam ) {
				copy[name] = newParam[name];
			}
		}
		return copy;
	},

	count : function(obj) {
		var cnt = 0;
		for (var key in obj) {
			cnt++;
		}
		return cnt;
	},

	add: function(obj, option){
	
		var opt = this.options;
		var option = this.extend(opt, option);
		
		var ary = {target: obj, options: option};
		this.thread.push(ary);
	},
	removeThis : function(){
		delete this.thread;
		delete this.timers;
		delete this.options;
	},
	execute : function(){
		
		var _self = this;
		var ary = _self.thread;
		var l = ary.length;
		var val = [];		
		_self.timers = [];
		_self.cssTimers = [];		
		for(var i = 0; i < l; i++){
			var obj = ary[i];
			_self.doSetTimeout(obj);
		}
		_self.thread = [];	
		_self.options = [];		
		
	},
	
	doSetTimeout : function(obj){
		var _self = this;
		var target = obj.target,
		props = obj.options.props,
		duration = obj.options.duration ? obj.options.duration : 10,
		delay = obj.options.delay,
		isAnimated = obj.options.isAnimated,
		complete = obj.options.complete,
		easing = obj.options.easing;
		
		var timer = setTimeout(function(){
			
			if(isAnimated) {
				target.clearQueue().stop().animate(props, duration, easing, complete);
			} else {
				target.css(props);
				if(delay >= 0 && complete){
					var cssTimer = setTimeout(function(){
						complete();
					}, duration);	
					_self.cssTimers.push(cssTimer);
				}
			}
			
		//	alert(delay);
			
		}, delay);
		_self.timers.push(timer);
	},
	
	cancel : function(){
		var _self = this;
		var l = _self.timers.length;
		for(var i = 0; i < l; i++){
			clearTimeout(_self.timers[i]);
		}
		l = _self.cssTimers.length;
		for(var i = 0; i < l; i++){
			clearTimeout(_self.cssTimers[i]);
		}		
		_self.timers = [];
		_self.cssTimers = [];
		_self.thread = [];	
		_self.options = [];
	}
}
