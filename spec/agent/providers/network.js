/*global describe:true it:true */

"use strict";

var helpers    = require('./../../helpers'),
    should     = helpers.must,
    sinon      = helpers.sinon,
    provider   = helpers.load('providers').load('network');

var nic_check = function(nic) {
  nic.should.be.a('object');
  nic.should.have.property('name');
  nic.should.have.property('ip_address');
  nic.should.have.property('mac_address');
  nic.should.have.property('broadcast_address');
};

var ap_check = function(ap) {
  ap.should.have.property('ssid');
  ap.should.have.property('quality');
  ap.should.have.property('mac_address');
  ap.should.have.property('signal_strength');
  ap.should.have.property('noise_level');
  ap.should.have.property('security');
};

var nic_names = {
  linux: 'eth0',
  darwin: 'en0',
  win32: 'Local Area Connection'
}

var nic_name = nic_names[process.platform];

var ip_regex = /^((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})$/;


var stub = []

function stubit(obj,method,func) {
  stub.push(sinon.stub(obj,method,func))
}

function unstub() {
  if (stub.length > 0) {
    stub.pop().restore()
  } else {
    console.log('got an unstub without a stub')
  }
}

function sim_get_access_points_list_no_points() {
  stubit(provider,"get_access_points_list",function(callback) {
    callback(null,[])
  })
}

function sim_get_access_points_list_no_open() {
  stubit(provider,"get_access_points_list",function(callback) {
    callback(null,[])
  })
}

function sim_get_access_points_list_at_least_one() {
   stubit(provider,"get_access_points_list",function(callback) {
    callback(null,[{
      ssid:'',
      quality:'',
      mac_address:'',
      signal_strength:'',
      noise_level:'',
      security:false
    }])
  }) 
}

function sim_os_functions_get_active_access_point_NO_POINTS() {
  stubit(provider.os_functions,"get_active_access_point",function(callback) {
    callback(null,null)
  })
}

function sim_os_function_get_active_access_point_DUMMY_POINT() {
  stubit(provider.os_functions,"get_active_access_point",function(callback) {
    callback(null,'68:5d:43:84:f4:68')
  })
}

function sim_get_wireless_interface_names_HAVE_NAMES() {
  stubit(provider,"get_wireless_interface_names",function(callback) {
    callback(null,['wlan0'])
  })
}

function sim_get_wireless_interface_names_NO_NAMES() {
  stubit(provider,"get_wireless_interface_names",function(callback) {
    callback(new Error('No Wifi device found.'))
  })
}

function sim_needle_get_err() {
  helpers.stub_request('get',new Error(),null,null)
}

function sim_hardware_get_network_interfaces_list_NONE() {
  stubit(provider.hardware,'get_network_interfaces_list',function(callback) {
    callback(new Error('No valid network interfaces detected.'))
  })
}

function sim_hardware_get_network_interfaces_list_NO_PRIVATE() {
  stubit(provider.hardware,'get_network_interfaces_list',function(callback) {
    callback(null,[])
  })
}

function sim_os_functions_broadcast_address_for() {
  stubit(provider.os_functions,'broadcast_address_for',function(callback) {
  })
}

describe('Network', function(){
  describe('get_public_ip', function(){
    describe('when not connected', function() {
       before(sim_needle_get_err) // does it's own unstub
       it('should return an error',function(done)  {
        provider.get_public_ip(function(err) {
          should.exist(err)
          done()
        })
      })
     })

    describe('when connected to the internet', function(){
      it('should cb a valid ipaddress', function(done) {
        provider.get_public_ip(function(err,ip) {
          should.not.exist(err)
          ip.should.match(ip_regex);
          done();
        });
      });
    })
  });

  describe('get_private_ip',function() {
    describe('when all interfaces are down', function(){
      before(sim_hardware_get_network_interfaces_list_NONE)
      after(unstub)

      it('should return an error',function(done) {
        provider.get_private_ip(function(err) {
          err.should.match(/No valid network interfaces detected./)
          done()
        })
      })
    })

    describe('when one interface is up', function(){
      describe('and with an assigned ip', function(){
        it('should cb a private ip',function(done) {
          provider.get_private_ip(function(err, ip) {
            should.not.exist(err);
            ip.should.match(ip_regex);
            done();
          });
        });

      })

      describe('with no assigned ip', function() {
        before(sim_hardware_get_network_interfaces_list_NO_PRIVATE)
        after(unstub)

        it('should return an error',function(done) {
          provider.get_private_ip(function(err) {
            err.message.should.match(/^No private IPs found/)
            done()
          })
        })
      })

    })


// Don't think these need tested for get_private_ip
/*
    describe('when multiple interfaces are up', function(){
      describe('and none have assigned IPs', function(){

      })

      describe('and one has assigned IP', function(){

      })

      describe('and more than one has an assigned IP', function(){

        // it should return the IP of the

      })

    })
*/

  });


  describe('broadcast_address', function() {

    describe('when interface does not exist', function(){

    })

    describe('when interface exists', function(){

      describe('and interface is down', function(){

      })

      describe('and interface has an active connection', function(){

        it('should cb a broadcast ip', function(done) {
          provider.broadcast_address_for(nic_name,function(err,broadcast) {
            should.exist(broadcast);
            done();
          });
        });

      })

    })

  });

  describe('get_active_network_interface',function() {

    describe('when no interfaces are active', function(){

    })

    describe('when one interface is active', function(){

      it('should return a nic object', function(done) {
        provider.get_active_network_interface(function(err, nic) {
          should.not.exist(err);
          nic_check(nic);
          done();
        });
      });

    })

    describe('when more than one interface is active', function(){

    })

  });

  describe('get_wireless_interface_names',function() {

    describe('when device has no wifi support', function(){
      before(sim_get_wireless_interface_names_NO_NAMES)
      after(unstub)

      it('should return an error',function(done) {
        provider.get_wireless_interface_names(function(err) {
          err.message.should.match(/No Wifi device found./)
          done()
        })
      })
    })

    describe('when device has wifi support', function() {
      before(sim_get_wireless_interface_names_HAVE_NAMES)
      after(unstub)

      it('should return an array of interfaces',function(done) {
        provider.get_wireless_interface_names(function(err,names) {
          names.should.be.an.instanceOf(Array);
          names.length.should.be.above(0);
          done();
        });
      });

    })

  });

  describe('get_first_wireless_interface',function() {
    describe('when device has no wifi support', function(){
      before(sim_get_wireless_interface_names_NO_NAMES)
      after(unstub)

      it('should return an error',function(done) {
        provider.get_first_wireless_interface(function(err) {
          err.message.should.match(/No Wifi device found./)
          done()
        })
      })
    })

    describe('when device has wifi support', function(){

      it('should return the first interface',function(done) {
        provider.get_first_wireless_interface(function(err, name) {
          should.not.exist(err);
          done();
        });
      });
    });
  });

  describe('get_active_access_point',function() {
    describe('when device is not connected via wifi', function(){
      before(sim_os_functions_get_active_access_point_NO_POINTS);
      after(unstub)
      
      it('should return an error',function() {
        provider.get_active_access_point(function(err) {
          err.message.should.equal("No active access point found.")
        })
      })
    })

    describe('when device is connected via wifi', function(){
      before(sim_get_wireless_interface_names_HAVE_NAMES)
      after(unstub)

      describe('and no access points are found (weird case)', function(){
        before(sim_get_access_points_list_no_points)
        after(unstub)
        
        it('should return an error',function(done) {
          provider.get_active_access_point(function(err) {
            err.message.should.match(/^Could not find matching access point/)
            done()
          })
        })
      })

      describe('and access points are found', function(){
        describe('and none match the MAC address of the active one', function(){
          before(sim_get_access_points_list_at_least_one)
          after(unstub)
          
          it('should return an error',function(done) {
            provider.get_active_access_point(function(err,ap) {
              err.message.should.match(/^Could not find/)
              done()

            })
          })
        })

        describe('and a match is found', function(){
          it('should return an active access point',function(done) {
            provider.get_active_access_point(function(err ,ap) {
              ap_check(ap); // actually mac address but that is checked by the func
              done();
            });
          });
        })
      })
    })
  });


  describe('get_open_access_points_list',function() {
    describe('when no access points are found', function(){
      before(sim_get_access_points_list_no_points)
      after(unstub)
      it('should return an empty array',function(done) {
         provider.get_open_access_points_list(function(err, aps) {
          if (err) return done()

          aps.should.be.an.instanceOf(Array);
          aps.should.have.length(0)
          done();
        });
       });
    });

    describe('when access points are found', function(){

       describe('and none have security=false', function(){
          before(sim_get_access_points_list_no_open)
          after(unstub)
          it('should return an empty array',function(done) {
            provider.get_open_access_points_list(function(err, aps) {
              if (err) return done()
                
              aps.should.be.an.instanceOf(Array);
              aps.should.have.length(0)
              done();
            })
          })
       })

       describe('and one or more are open', function(){
        before(sim_get_access_points_list_at_least_one)
        after(unstub)        
        it('should callback list of open access points',function(done) {
          provider.get_open_access_points_list(function(err, aps) {
            if (err) return done()
     
            aps.should.be.an.instanceOf(Array);
            if (aps.length > 0) {
              ap_check(aps[0]);
            }
            done();
          })
        })
      })

    })
  })

});
