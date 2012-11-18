
var 
  exp = module.exports,
  exec = require('child_process').exec;


exp.get_picture = function(file_path,callback) {
  exec('prey-webcam outfile '+file_path,function(err,stdout) {
    if (err) return callback(_error(err));

    callback(null);
  }); 
};