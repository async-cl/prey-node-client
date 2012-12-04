var common = require('./../lib/common'),
	  system = require('../lib/system'),
		should = require('should'),
		helpers = require('./helpers'),
		fs = require('fs'),
		join = require('path').join;

describe('common', function(){

	it('should set Preys ROOT_PATH in process.env', function(){
		should.exist(process.env.ROOT_PATH);
	});

	describe('config path', function(){

		it('should default to OS config path', function(){
			common.config_path.should.equal(system.paths.config)
		})

		it('directory exists',function() {
			var stat = fs.statSync(common.config_path)
			should.exist(stat)
			stat.isDirectory().should.equal(true)		
		})

		it('should check if path is writable', function(done){
			helpers.checkPermission (common.config_path, 2, done);
		})

		it('should check if config file is readable', function(done){
			helpers.checkPermission(join(common.config_path, common.config_file),2,done)
		})

	})


})
