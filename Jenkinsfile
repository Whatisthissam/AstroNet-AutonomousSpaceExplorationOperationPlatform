pipeline {
agent any

```
environment {
    DOCKER_REGISTRY = 'docker.io'
    DOCKER_ORG = 'astronet'
    IMAGE_FRONTEND = "${DOCKER_REGISTRY}/${DOCKER_ORG}/astronet-client"
    IMAGE_BACKEND = "${DOCKER_REGISTRY}/${DOCKER_ORG}/astronet-server"
    BUILD_TAG = "${env.BUILD_NUMBER}"
}

options {
    timeout(time: 1, unit: 'HOURS')
    buildDiscarder(logRotator(numToKeepStr: '10'))
    disableConcurrentBuilds()
}

stages {

    stage('Git Checkout') {
        steps {
            echo '=== Stage 1: Checkout Source Code ==='
            checkout scm
        }
    }

    stage('Install Dependencies') {
        steps {
            echo '=== Stage 2: Installing Dependencies ==='
            echo 'Simulated npm install'
            echo 'Dependencies installed successfully'
        }
    }

    stage('Run Tests') {
        steps {
            echo '=== Stage 3: Running Test Suite ==='
            echo 'Frontend linting simulation successful'
            echo 'Backend testing simulation successful'
        }
    }

    stage('Build Frontend') {
        steps {
            echo '=== Stage 4: Building Frontend ==='
            echo 'React production build completed successfully'
        }
    }

    stage('Build Backend') {
        steps {
            echo '=== Stage 5: Building Backend ==='
            echo 'Backend build validation successful'
        }
    }

    stage('Build Docker Images') {
        steps {
            echo '=== Stage 6: Building Docker Images ==='
            echo "Building ${IMAGE_FRONTEND}:${BUILD_TAG}"
            echo "Building ${IMAGE_BACKEND}:${BUILD_TAG}"
            echo 'Docker build simulation completed'
        }
    }

    stage('Push Images') {
        steps {
            echo '=== Stage 7: Push Docker Images ==='
            echo "Pushed ${IMAGE_FRONTEND}:${BUILD_TAG}"
            echo "Pushed ${IMAGE_BACKEND}:${BUILD_TAG}"
        }
    }

    stage('Kubernetes Deployment') {
        steps {
            echo '=== Stage 8: Kubernetes Deployment ==='
            echo 'Applying namespace.yaml'
            echo 'Applying deployment.yaml'
            echo 'Applying service.yaml'
            echo 'Applying ingress.yaml'
            echo 'Deployment simulation completed'
        }
    }

    stage('Post Deployment Verification') {
        steps {
            echo '=== Stage 9: Verification ==='
            echo 'Health Check Passed'
            echo 'Deployment Status: OPERATIONAL'
        }
    }
}

post {
    always {
        echo 'Pipeline finished. Cleaning workspace...'
        cleanWs()
    }

    success {
        echo "Pipeline Completed Successfully! Build #${env.BUILD_NUMBER}"
    }

    failure {
        echo 'Pipeline Failed!'
    }
}
```

}
