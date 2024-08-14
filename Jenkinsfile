pipeline {
    agent any
        
    tools {
        nodejs "20.9.0"  // Global Tool Configuration에서 설정한 이름
    }
    stages {
        // stage('Clean Workspace') {
        //     steps {
        //         cleanWs()
        //     }
        // }

        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Build Frontend') {
            steps {
                dir('front') {
                    sh 'npm install'
                    sh 'docker build -t frontend:${BUILD_NUMBER} -f Dockerfile .'
                }
            }
        }
        
        stage('Build Backend') {
            steps {
                dir('back') {
                    sh 'docker build -t backend:${BUILD_NUMBER} -f Dockerfile .'
                }
            }
        }
        
        stage('Deploy') {
            steps {
                sh 'docker stop frontend || true'
                sh 'docker rm frontend || true'
                sh 'docker run -d --name frontend -p 8801:8801 frontend:${BUILD_NUMBER}'
                
                sh 'docker stop backend || true'
                sh 'docker rm backend || true'
                sh 'docker run -d --name backend -p 8800:8800 backend:${BUILD_NUMBER}'
            }
        }
    }
}
