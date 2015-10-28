var needle = require("needle");
var os   = require("os");
var fs = require("fs");

var config = {};
config.token = "Enter your access token here";
var headers =
{
	'Content-Type':'application/json',
	Authorization: 'Bearer ' + config.token
};

// Documentation for needle:
// https://github.com/tomas/needle

var client =
{
	getDropletIp: function(droplet_id, onResponse)
	{
		needle.get("https://api.digitalocean.com/v2/droplets/"+droplet_id, {headers:headers}, onResponse)
	},

	createDroplet: function (dropletName, region, imageName, onResponse)
	{
		var data = 
		{
			"name": dropletName,
			"region":region,
			"size":"512mb",
			"image":imageName,
			// Id to ssh_key already associated with account.
			"ssh_keys":[XXXXX],
			//"ssh_keys":null,
			"backups":false,
			"ipv6":false,
			"user_data":null,
			"private_networking":null
		};

		console.log("Attempting to create: "+ JSON.stringify(data) );

		needle.post("https://api.digitalocean.com/v2/droplets", data, {headers:headers,json:true}, onResponse );
	}
};



var name = "shrenik"+os.hostname();
var region = "nyc3"; 
var image = "ubuntu-14-04-x64"; 

client.createDroplet(name, region, image, function(err, resp, body)
{
var data = resp.body;
// StatusCode 202 - Means server accepted request.
if(!err && resp.statusCode == 202)
{
 	var droplet_id = JSON.stringify(data.droplet.id);
 	

		setTimeout(function(){
 		client.getDropletIp(droplet_id, function(error, response)
		{
			var data = response.body;

			var dropletIP = JSON.stringify(data.droplet.networks.v4[0].ip_address);
			console.log( "droplet ip address: ", dropletIP );
			
			text = "[servers]\n"+"node0 ansible_ssh_host="+dropletIP+" ansible_ssh_user=root ansible_ssh_private_key_file=~/.ssh/id_rsa\n";
    		fs.writeFile('inventory', text, function(err) {
    		if(err) {
        		return console.log(err);
    			}
    		});
		});
 		}, 70000);
}
});
