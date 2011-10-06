//////////////////////////////////////////
// Prey JS Client Core Extensions
// (c) 2011 - Fork Ltd.
// by Tomas Pollak - http://usefork.com
// GPLv3 Licensed
//////////////////////////////////////////

//Object.prototype.length = function(){
//	var count = 0;
//	this.keys.forEach(function(el){
//		count++;
//	})
//	return count;
//}

String.prototype.first_line = function(){
	return this.split("\n")[0];
};


//Object.prototype.count = function() {
//	var count = 0;
//	for(var prop in this) {
//		if(this.hasOwnProperty(prop))
//			count++;
//	}
//	return count;
//}

//Object.prototype.merge = function(destination, source) {
//	for (var property in source)
//		destination[property] = source[property];
//	return destination;
//}


// by creationix -> github.com/creationix
// https://github.com/creationix/howtonode.org/blob/master/articles/prototypal-inheritance/spawn.js
Object.defineProperty(Object.prototype, "new", {value: function (props) {
	var defs = {}, key;
	for (key in props) {
		if (props.hasOwnProperty(key)) {
			defs[key] = {value: props[key], enumerable: true};
		}
	}
	return Object.create(this, defs);
}});


//Object.prototype.forEach = function(callback) {
//	var self = this;
//	for (prop in self) {
//		if (self.hasOwnProperty(prop) && typeof self[prop] !== "function") {
//			callback(prop);
//		}
//	}
//};