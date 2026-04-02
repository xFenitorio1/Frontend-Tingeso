pipeline {
    agent any

    triggers {
        pollSCM 'H/2 * * * *' // Revisa cambios cada 2 min
    }

    stages {
        stage('Checkout Front') {
            steps {
                checkout scm
            }
        }

        stage('Construir Imagen Docker') {
            steps {
                script {
                    echo "--> Construyendo imagen del Frontend..."
                    // Construye la imagen usando el Dockerfile de la carpeta
                    sh "docker build -t frontend-image:latest ."
                }
            }
        }

        stage('Desplegar Front') {
            steps {
                script {
                    echo "--> Actualizando solo el contenedor de Frontend..."
                    // Usamos el comando específico para que no toque al Back ni a la DB
                    // Si el docker-compose.yml está en esta carpeta:
                    sh "docker-compose up -d --no-deps frontend"
                }
            }
        }

        stage('Limpieza') {
            steps {
                sh 'docker image prune -f'
            }
        }
    }
}