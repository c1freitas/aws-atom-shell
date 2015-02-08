
// Use to determine which tags to search by
var local = require('../config/local');
var AWS = require('aws');
var ec2 = new AWS.EC2();

module.export = function(callback) {
    var params = {
      DryRun: false,
      Filters: [
        {
          Name: 'tag:METRICS',
          Values: [ 'ALLTM_SERVER' ]
        },
      ],
    };
    ec2.describeInstances(params, function(err, data) {
        var servers = [];
        if (err != null) {
            callback(err); // an error occurred
        } else {
            for (var i=0; i < data.Reservations.length; i++) {
                if (data.Reservations[i].Instances) {
                    for (var x=0; x < data.Reservations[i].Instances.length; x++) {
                        var instance = data.Reservations[i].Instances[x];
                        var server = {};
                        server.instanceId = instance.InstanceId;
                        server.instanceType  = instance.InstanceType;
                        server.state = instance.State.Name;
                        server.stateCode = instance.State.Code;
                        server.location = instance.Placement.AvailabilityZone;
                        server.privateDns = instance.PrivateDnsName;
                        server.publicDns = instance.PublicDnsName;
                        server.privateIpAddress = instance.PrivateIpAddress;
                        server.publicIpAddress = instance.PublicIpAddress;

                        servers.push(server);
                    }
                }
            }
        }
        callback(null, servers);
    });
}
