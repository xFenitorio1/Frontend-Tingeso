pipeline {
    agent any

    triggers {
        // Revisa GitHub cada 2 minutos
        pollSCM 'H/2 * * * *' 
    }

    stages {
        stage('Checkout Front') {
            steps {
                // Descarga el código del repo de Frontend
                checkout scm
            }
        }

        stage('Build Image') {
            steps {
                script {
                    echo "--> Construyendo imagen de Vite..."
                    // Construye la imagen usando el Dockerfile de la carpeta
                    sh "docker build -t frontend-app:latest ."
                }
            }
        }

        stage('Deploy Front') {
            steps {
                script {
                    echo "--> Desplegando contenedor de Frontend..."
                    // El comando 'up' refrescará solo el servicio frontend
                    sh "docker-compose up -d --build frontend"
                }
            }
        }

        stage('Clean Up') {
            steps {
                // Borra versiones anteriores para no llenar tu disco
                sh 'docker image prune -f'
            }
        }
    }
}