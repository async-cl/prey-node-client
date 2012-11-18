"use strict";

//////////////////////////////////////////
// Prey JS Webcam Module
// (c) 2011 - Fork Ltd.
// By Tomas Pollak - http://forkhq.com
// GPLv3 Licensed
//////////////////////////////////////////

var
  common = _ns('common'),
  helpers = _ns('helpers'),
  tempfile_path = common.helpers.tempfile_path,
  fs = require('fs'),
  os_functions = require('./platform/' + common.os_name),
  exp = module.exports;

exp.get_picture = helpers.report(function(options, callback){
	var file_path = options.picture_file || tempfile_path('picture.' + process.pid + '.jpg');
	os_functions.get_picture(file_path, function(err, file_type){
		if (err) return callback(_error(err));
    
		fs.exists(file_path, function(exists){
			if (!exists) return callback(_error("Couldn't grab a picture using the webcam."));
      
			callback(null, {file: file_path, content_type: file_type});
			});
	});
});


