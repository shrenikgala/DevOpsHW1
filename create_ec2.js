var AWS = require('aws-sdk');
var fs = require("fs");

// configure AWS security tokens
AWS.config.update({accessKeyId: "Enter your access key", 
  secretAccessKey: "Enter secret key"});

// Set your region for future requests.
AWS.config.update({region: 'us-west-1'});

var ec2 = new AWS.EC2();

var params = {
  ImageId: 'ami-df6a8b9b', 
  InstanceType: 't2.micro',
  KeyName :"Private",
  MinCount: 1, MaxCount: 1
};

// Create the instance
ec2.runInstances(params, function(err, data) {
  if (err) { console.log("Could not create instance", err); return; }
//  console.log(data.Instances[0]);

  var instanceId = data.Instances[0].InstanceId;
 // var ip_address = data.Instances[0].PublicIpAddress;
  console.log("Created instance", instanceId);
  //console.log("Ip address of instance",ip_address);
	
});

	setTimeout(function(){
		ec2.describeInstances(function(error, data) {
  			if (error) {
    				console.log(error); // an error occurred
 			 } else {
				
	  
				for(var i=0;i<data.Reservations.length;i++){
	         		  for(var j=0;j<data.Reservations[i].Instances.length;j++){
		     			 if(data.Reservations[i].Instances[j].State.Name!="terminated"){
				       		var ip_address=data.Reservations[i].Instances[j].PublicIpAddress;
					}
				  }
				}	

				console.log("ip address pf ec2 instance :",ip_address); 				
				text = "node1 ansible_ssh_host="+ip_address+" ansible_ssh_user=ubuntu ansible_ssh_private_key_file=Private.pem";
                		fs.appendFile('inventory', text, function(err) {
                		if(err) {
                     		   return console.log(err);
                        	}
                		});
			}			
  		
		});
	},120000);
