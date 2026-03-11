pipeline {
    agent any

    environment {
        SERVER_IP      = "98.81.119.196"        // Target EC2 Public IP
        SSH_CREDENTIAL = "node-app-key"         // Jenkins credential ID
        REPO_URL       = "https://github.com/SheetalKadolkar/nodejs-app-cicd.git"
        BRANCH         = "main"
        REMOTE_USER    = "ec2-user"
        REMOTE_PATH    = "/home/ec2-user/node-app"
    }

    stages {

        stage('Clone Repository') {
            steps {
                git branch: "${BRANCH}", url: "${REPO_URL}"
            }
        }

        stage('Upload Files to Target Server') {
            steps {
                sshagent([SSH_CREDENTIAL]) {
                    sh """
                        ssh -o StrictHostKeyChecking=no ${REMOTE_USER}@${SERVER_IP} "mkdir -p ${REMOTE_PATH}"
                        scp -o StrictHostKeyChecking=no -r . ${REMOTE_USER}@${SERVER_IP}:${REMOTE_PATH}
                    """
                }
            }
        }

        stage('Install Dependencies & Start App') {
            steps {
                sshagent([SSH_CREDENTIAL]) {
                    sh """
                        ssh -o StrictHostKeyChecking=no ${REMOTE_USER}@${SERVER_IP} "
                            cd ${REMOTE_PATH}

                            if ! command -v node &> /dev/null
                            then
                                sudo yum install -y nodejs
                            fi

                            if ! command -v pm2 &> /dev/null
                            then
                                sudo npm install -g pm2
                            fi

                            npm install
                            pm2 start app.js --name node-app || pm2 restart node-app
                        "
                    """
                }
            }
        }
    }

    post {
        success {
            echo '✅ Application deployed successfully!'
        }
        failure {
            echo '❌ Deployment failed.'
        }
    }
}