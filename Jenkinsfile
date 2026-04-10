pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build & Deploy') {
            steps {
                script {
                    sh """
                        docker compose down --remove-orphans || true
                        docker compose build --no-cache
                        docker compose up -d
                    """
                }
            }
        }

        stage('Health Check') {
            steps {
                script {
                    sh """
                        sleep 15
                        docker compose ps && docker compose logs --tail=5
                    """
                }
            }
        }
    }

    post {
        failure {
            echo 'Pipeline failed. Check logs.'
        }
        success {
            echo 'Deployment successful!'
        }
    }
}
