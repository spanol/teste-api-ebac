pipeline {
    agent any

    stages {
        stage('Setup') {
            steps {
                git branch: 'main', url: 'https://github.com/spanol/teste-api-ebac'
                sh '''npm install'''
                sh '''npm start &'''
            }
        }
     stage('Test') {
            steps {
                sh '''npm test'''
            }
        }    
    }
}
