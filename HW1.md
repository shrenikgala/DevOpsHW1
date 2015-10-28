#HW1 Provisioning Servers

##Amazon EC2: 
Amazon EC2(Elastic Compute Cloud) platform provides where it allows the user to resize the computing capacity in the cloud. Amazon EC2 provides high scaling capacity, since creating and booting new instances is very quick. It grants users complete control of the resources which can be allocated for computing. Users only have to pay for the services they actually used purely based on capacity and time. There are lot of developer tools which help in building failure resilient systems really quickly. The scaling and load balancing is seamless and automatic.  

##Steps to install nginx web server on DigitalOcean and Amazonn

1. git clone https://github.ncsu.edu/sngala/CSC-DevOpsHW1.git

2. Setup SSH Keys
<pre>ssh-keygen -t rsa</pre>
   Add the public key generated after this step on the your digitalocean profile

3. Run the following command to install all the dependencies.
<pre>npm install</pre> 

4. Run the following command to get the SSH ID:
<pre>curl -X GET -H 'Content-Type: application/json' -H 'Authorization: Bearer <Your Access token>' "https://api.digitalocean.com/v2/account/keys"</pre>

5. Add the access token and ssh id in create_droplet.js. Also change the value of ansible_ssh_private_key_file in create_droplet.js with the path of the private key generated on the step 2.

6. Run the following commad
<pre> nodejs create_droplet.js</pre>
  This will create a droplet on the platform and return an ip address of the droplet and create an inventory file in the working directory.

7. In order to generate an ec2 instance, create a keypair on amazon ec2 console and add the access key id,secret key,keyname and path to the pem file generated while creating a keypair in the create_ec2.js and run the following command.
<pre>nodejs create_ec2.js</pre>
  This will create an ec2 instance which can be viewed on the ec2 platform.It will return an ip address and append the inventory file generate previously with details related to the ec2 instance created. 

8. Add ICMP,SSH,HTTP rules to the default security group through the ec2 console.

9. Get ansible
<pre><code>git clone git://github.com/ansible/ansible.git --recursive
cd ./ansible
git checkout tags/v1.9.2-1
git submodule update --recursive
source ./hacking/env-setup</code></pre>

10. Run the following command to check if both the instances can be pinged and respond successfully.
<pre> ansible all -i inventory -m ping</pre>
   This will result to success printed on the console if they can be pinged successfully.

11. Run the ansible playbook to install nginx server on both ec2 instance and the droplet created.
<pre>ansible-playbook provision_server.yml -i inventory</pre>
 This will install servers on both the ip addresses, if none of the tasks fail. You can check ip addresses on the browser to see the index page of nginx on successful installation.

##Screencast
[Screencase_demo](https://www.youtube.com/watch?v=nll-EmUr1Vk)

##Screenshots
![Screenshots][image_id]
[image_id]:https://github.ncsu.edu/sngala/CSC-DevOpsHW1/blob/master/Screenshot%20from%202015-09-16%2020:16:51.png
![Screenshot][image_2]
[image_2]:https://github.ncsu.edu/sngala/CSC-DevOpsHW1/blob/master/Screenshot%20from%202015-09-16%2020:17:06.png 
