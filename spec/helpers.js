var sinon   = require('sinon'),
    should  = require('should'),
    needle  = require('needle'),
    fs      = require('fs'),
    helpers = {};

console.log(' == NODE VERSION: ' + process.version);

helpers.path   = require('path');
helpers.sinon  = sinon;
helpers.must = should;

/*
helpers.base   = require('./../lib');

helpers.base.providers.map(function(){
  console.log('Providers loaded.')
}); // attaches providers
helpers.providers = helpers.base.providers;
*/

helpers.load = function(module_name){
  return require('./../lib/agent/' + module_name);
}

helpers.stub_request = function(type, err, response, body){

  var stub = sinon.stub(needle, type, function(){

    // look for callback
    var cb;

    for (var i = 0; i < arguments.length; i++) {
      if (typeof arguments[i] == 'function')
        cb = arguments[i];
    }

    cb(err, response, body);
    needle[type].restore();
  });

}

// http://stackoverflow.com/questions/11775884/nodejs-file-permissions
helpers.checkPermission = function (file, mask, cb){
    fs.stat (file, function (error, stats){
        if (error){
            cb (error, false);
        }else{
            cb (null, !!(mask & parseInt ((stats.mode & parseInt ("777", 8)).toString (8)[0])));
        }
    });
};

module.exports = helpers;
