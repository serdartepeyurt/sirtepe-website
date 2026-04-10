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
                        docker compose down || true
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
                        sleep 5
                        curl -f http://localhost:5000 || exit 1
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
