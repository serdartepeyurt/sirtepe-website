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
                    withCredentials([
                        string(credentialsId: 'google-client-id', variable: 'GOOGLE_CLIENT_ID'),
                        string(credentialsId: 'google-client-secret', variable: 'GOOGLE_CLIENT_SECRET'),
                        string(credentialsId: 'google-redirect-uri', variable: 'GOOGLE_REDIRECT_URI'),
                        string(credentialsId: 'giscus-repo', variable: 'GISCUS_REPO'),
                        string(credentialsId: 'giscus-repo-id', variable: 'GISCUS_REPO_ID'),
                        string(credentialsId: 'giscus-category', variable: 'GISCUS_CATEGORY'),
                        string(credentialsId: 'giscus-category-id', variable: 'GISCUS_CATEGORY_ID')
                    ]) {
                        sh """
                            docker compose down --remove-orphans || true
                            docker compose build --no-cache
                            docker compose up -d
                        """
                    }
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
