# NodeJS Application CI/CD using Jenkins on AWS EC2

This document explains how to deploy a **NodeJS application using Jenkins CI/CD Pipeline to an AWS EC2 server**.

The setup includes:

* Jenkins Server (CI/CD)
* Target EC2 Server (Application server)
* GitHub Repository
* Jenkins Pipeline Deployment
* SSH Authentication
* PM2 Process Manager

---

# 1. Architecture Overview

Developer → GitHub → Jenkins → Target EC2 → NodeJS Application

Flow:

1. Developer pushes code to GitHub
2. Jenkins pulls the code
3. Jenkins connects to target EC2 via SSH
4. Jenkins copies application files
5. Target server installs dependencies
6. Application starts using PM2

---

# 2. Create AWS Infrastructure

Create **two EC2 instances**.

### Jenkins Server

Purpose:
Runs Jenkins CI/CD pipelines.

Recommended configuration:

* Amazon Linux 2
* t2.micro
* 20GB storage

Open Security Group ports:

* 22 (SSH)
* 8080 (Jenkins)

---

### Target Server

Purpose:
Runs NodeJS application.

Recommended configuration:

* Amazon Linux 2
* t2.micro

Open Security Group ports:

* 22 (SSH)
* 3000 (NodeJS app)

---

# 3. Connect to Jenkins Server

Use SSH to connect:

```
ssh -i your-key.pem ec2-user@JENKINS_SERVER_PUBLIC_IP
```

---

# 4. Install Java (Required for Jenkins)

```
sudo yum update -y
sudo yum install java-17-amazon-corretto -y
```

Verify installation:

```
java -version
```

---

# 5. Install Jenkins

```
sudo wget -O /etc/yum.repos.d/jenkins.repo https://pkg.jenkins.io/redhat-stable/jenkins.repo
sudo rpm --import https://pkg.jenkins.io/redhat-stable/jenkins.io-2023.key
sudo yum install jenkins -y
```

Start Jenkins:

```
sudo systemctl start jenkins
```

Enable Jenkins on boot:

```
sudo systemctl enable jenkins
```

Check status:

```
sudo systemctl status jenkins
```

---

# 6. Access Jenkins UI

Open browser:

```
http://JENKINS_SERVER_IP:8080
```

Get initial password:

```
sudo cat /var/lib/jenkins/secrets/initialAdminPassword
```

Paste password in browser and complete setup.

---

# 7. Install Required Jenkins Plugins

Go to:

Manage Jenkins → Plugins → Available Plugins

Install:

Git Plugin
Pipeline Plugin
SSH Agent Plugin
GitHub Integration Plugin

Restart Jenkins after installation.

---

# 8. Setup Jenkins Credentials (SSH Key)

Jenkins must connect to the target EC2 instance using SSH.

Go to:

Manage Jenkins → Credentials → Global → Add Credentials

Select:

Kind → SSH Username with Private Key

Fill:

Username:

```
ec2-user
```

Credential ID:

```
node-app-key
```

Private Key:

Paste the contents of your EC2 `.pem` key.

Save credentials.

---

# 9. Prepare Target Server

Connect to target EC2:

```
ssh -i your-key.pem ec2-user@TARGET_SERVER_IP
```

Update system:

```
sudo yum update -y
```

---

# 10. Install NodeJS

```
sudo yum install nodejs -y
```

Verify installation:

```
node -v
npm -v
```

---

# 11. Install PM2 (Process Manager)

PM2 keeps the NodeJS application running.

Install globally:

```
sudo npm install -g pm2
```

Verify:

```
pm2 -v
```

---

# 12. Setup Jenkins Pipeline Job

Open Jenkins Dashboard.

Click:

New Item

Enter name:

```
nodejs-app
```

Select:

Pipeline

Click OK.

---

# 13. Configure Pipeline

Scroll to Pipeline section.

Select:

Pipeline script from SCM

SCM:

```
Git
```

Repository URL:

```
https://github.com/SheetalKadolkar/nodejs-app-cicd.git
```

Branch:

```
main
```

Script Path:

```
Jenkinsfile
```

Save.

---

# 14. Jenkins Pipeline Stages

The pipeline performs the following steps.

Stage 1 – Clone Repository
Jenkins downloads code from GitHub.

Stage 2 – Upload Files
Jenkins connects to target server via SSH and copies files.

Stage 3 – Install Dependencies
Runs npm install on the target server.

Stage 4 – Start Application
PM2 starts the NodeJS application.

---

# 15. Run the Pipeline

Click:

Build Now

Jenkins will execute the pipeline stages.

If successful, the application will be deployed automatically.

---

# 16. Access Application

Open browser:

```
http://TARGET_SERVER_IP:3000
```

You should see the NodeJS application response.

---

# 17. Useful PM2 Commands

Check running applications:

```
pm2 list
```

Restart application:

```
pm2 restart node-app
```

Stop application:

```
pm2 stop node-app
```

View logs:

```
pm2 logs
```

Monitor processes:

```
pm2 monit
```

---

# 18. Troubleshooting

### SSH Permission Error

Make sure Jenkins server can SSH into target server.

Test from Jenkins server:

```
ssh -i key.pem ec2-user@TARGET_SERVER_IP
```

---

### Application Not Accessible

Check if application is running:

```
pm2 list
```

Check logs:

```
pm2 logs
```

---

### Port Not Accessible

Verify security group allows port:

```
3000
```

---



