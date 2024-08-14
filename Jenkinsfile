pipeline {
    agent any
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    sh 'docker build -t frontend:${BUILD_NUMBER} -f ./front/Dockerfile .'
                }
            }
        }
        
        stage('Build Backend') {
            steps {
                dir('backend') {
                    sh 'docker build -t backend:${BUILD_NUMBER} -f ./back/Dockerfile .'
                }
            }
        }
        
        stage('Deploy') {
            steps {
                sh 'docker stop frontend || true'
                sh 'docker rm frontend || true'
                sh 'docker run -d --name frontend -p 3000:3000 frontend:${BUILD_NUMBER}'
                
                sh 'docker stop backend || true'
                sh 'docker rm backend || true'
                sh 'docker run -d --name backend -p 8080:8080 backend:${BUILD_NUMBER}'
            }
        }
    }
}
