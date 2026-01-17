
📌 Overview
This project demonstrates deployment of a Node.js Express.js application using Docker, running on EC2 instances inside an Auto Scaling Group (ASG) and exposed through an Application Load Balancer (ALB).
The Docker image is stored in Amazon ECR and is automatically pulled and run during instance launch using User Data in the Launch Template.



🛠 Tech Stack
Node.js

Express.js

Docker

AWS EC2 (Amazon Linux 2023)

Amazon ECR

Application Load Balancer

Auto Scaling Group

AWS Systems Manager (SSM)🌍 AWS Configuration
Item

Value

Region

ap-south-1

AMI
Amazon Linux 2023

ECR Repository
rest

Docker Image
restful:latest

HTTPS
No

App Port
3000

ALB Port
80


🔐 IAM Roles Attached to EC2
The EC2 instances in the Auto Scaling Group have the following IAM roles:
1. ECR Role
Allows EC2 to:
Authenticate with Amazon ECR
Pull Docker images
2. SSM Role
Allows:
Access via AWS Systems Manager Session Manager


🚀 Push Docker Image to Amazon ECR
Login to ECR
aws ecr get-login-password --region ap-south-1 
docker login --username AWS --password-stdin <account-id>.dkr.ecr.ap-south-1.amazonaws.com

Pull Docker Image
docker pull <account-id>.dkr.ecr.ap-south-1.amazonaws.com/restful:latest

Run Docker Container
docker run -d -p 3000:3000 <account-id>.dkr.ecr.ap-south-1.amazonaws.com/restful:latest


⚙️ Auto Scaling Group – Launch Template User Data
The User Data script in the Launch Template performs the following actions:

Installs Docker
Starts Docker servicet
Logs in to Amazon ECR
Pulls the Docker image
Runs the container on port 3000

#!/bin/bash

dnf update -y

dnf install docker -y

systemctl start docker

systemctl enable docker

aws ecr get-login-password --region ap-south-1 

docker login --username AWS --password-stdin <account-id>.dkr.ecr.ap-south-1.amazonaws.com

docker pull <account-id>.dkr.ecr.ap-south-1.amazonaws.com/rest:latest

docker run -d -p 3000:3000 <account-id>.dkr.ecr.ap-south-1.amazonaws.com/rest:latest



🔁 Auto Scaling Group Setup

Launch Template: Configured with above User Data

IAM Role: ECR + SSM attached

Desired Capacity: 2

Min: 1
Max: 4
Target Group: Attached to ALB


🌐 Application Load Balancer Setup

Listener: Port 80

Forward to: Target Group

Target Type: Instance

Health Check Path: /health

ALB (80)  --->  App Security Group  --->  EC2 (Docker :3000)


🧪 Access the Application

After deployment, open in browser:
http://<ALB-DNS-NAME>


❗ Troubleshooting

Check Docker
systemctl status docker

Check Running Containers
docker ps 

View Logs
docker logs <container-id>


