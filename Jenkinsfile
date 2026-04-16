pipeline {
    agent any

    environment {
        DEPLOY_DIR = "/opt/meuSite"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build') {
            steps {
                sh "docker build -t meusite:${env.BRANCH_NAME}-${BUILD_NUMBER} -t meusite:${env.BRANCH_NAME}-latest ."
            }
        }

        stage('Deploy') {
            when {
                branch 'main'
            }
            steps {
                withCredentials([file(credentialsId: 'meusite-env', variable: 'ENV_FILE')]) {
                    sh """
                        cp \$ENV_FILE ${DEPLOY_DIR}/.env
                        cd ${DEPLOY_DIR}
                        git pull origin main
                        docker compose up -d --build
                    """
                }
            }
        }
    }

    post {
        success {
            echo "Build #${BUILD_NUMBER} da branch '${env.BRANCH_NAME}' concluido com sucesso!"
        }
        failure {
            echo "Build #${BUILD_NUMBER} da branch '${env.BRANCH_NAME}' falhou."
        }
        cleanup {
            sh "docker image prune -f"
        }
    }
}
