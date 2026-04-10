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

                        # First run setup
                        if ! docker compose exec -T web test -f /app/data/dev.db; then
                            echo "First run - running migrations"
                            docker compose exec -T web bash -c 'DATABASE_URL="file:./data/dev.db" npx prisma migrate deploy'
                        fi
                    """
                }
            }
        }

        stage('Health Check') {
            steps {
                waitUntil {
                    script {
                        def response = httpRequest(
                            url: 'http://localhost:5000',
                            validResponseCodes: '200'
                        )
                        return response.status == 200
                    }
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
