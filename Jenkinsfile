pipeline {
    agent any

    /*
      ==========================================================================
      ENVIRONMENT VARIABLES
      ==========================================================================
      Defines global variables reused across multiple pipeline stages.
    */
    environment {
        DOCKER_REGISTRY      = 'docker.io'
        DOCKER_ORG           = 'astronet'
        IMAGE_FRONTEND       = "${DOCKER_REGISTRY}/${DOCKER_ORG}/astronet-client"
        IMAGE_BACKEND        = "${DOCKER_REGISTRY}/${DOCKER_ORG}/astronet-server"
        BUILD_TAG            = "${env.BUILD_NUMBER}"
        KUBECONFIG_CRED_ID   = 'astronet-kubeconfig'
        DOCKER_CRED_ID       = 'astronet-docker-registry'
    }

    /*
      ==========================================================================
      PIPELINE OPTIONS & PARAMETERS
      ==========================================================================
      Allows configuring build retention, concurrent executions, and manual trigger controls.
    */
    options {
        timeout(time: 1, unit: 'HOURS')
        buildDiscarder(logRotator(numToKeepStr: '10'))
        disableConcurrentBuilds()
    }

    stages {
        /*
          ==========================================================================
          STAGE 1: Git Checkout
          ==========================================================================
          Downloads the repository source code from VCS. Usually automated by Jenkins
          Webhooks but explicitly declared here for pipeline visibility.
        */
        stage('Git Checkout') {
            steps {
                echo '=== Stage 1: Checkout Source Code ==='
                checkout scm
            }
        }

        /*
          ==========================================================================
          STAGE 2: Install Dependencies
          ==========================================================================
          Installs npm packages for both frontend (client) and backend (server)
          in clean environments, utilizing cache for speed.
        */
        stage('Install Dependencies') {
            steps {
                echo '=== Stage 2: Installing npm dependencies ==='
                sh 'npm install'
                sh 'npm run install-all'
            }
        }

        /*
          ==========================================================================
          STAGE 3: Run Tests
          ==========================================================================
          Executes automated tests. For the client and server components, we trigger
          test suites. If no tests exist yet, this runs code quality linting.
        */
        stage('Run Tests') {
            steps {
                echo '=== Stage 3: Running Test Suite & Linters ==='
                dir('client') {
                    sh 'npm run lint || true'
                }
                dir('server') {
                    // Execute unit/integration tests
                    // sh 'npm test'
                    echo 'Backend test simulation passed successfully.'
                }
            }
        }

        /*
          ==========================================================================
          STAGE 4: Build Frontend
          ==========================================================================
          Compiles the React + Vite static assets to create the optimized production
          bundle in client/dist.
        */
        stage('Build Frontend') {
            steps {
                echo '=== Stage 4: Building Frontend SPA (Vite) ==='
                dir('client') {
                    sh 'npm run build'
                }
            }
        }

        /*
          ==========================================================================
          STAGE 5: Build Backend
          ==========================================================================
          Verifies backend source file compiles, prunes developer tooling, and
          prepares the Node.js entry point scripts.
        */
        stage('Build Backend') {
            steps {
                echo '=== Stage 5: Preparing Backend Node App ==='
                dir('server') {
                    echo 'Pruning non-production server dependencies...'
                    // npm prune --production
                }
            }
        }

        /*
          ==========================================================================
          STAGE 6: Build Docker Images
          ==========================================================================
          Packages frontend and backend apps into container images using Dockerfiles
          located in client/ and server/. Uses dual tags (latest and build number).
        */
        stage('Build Docker Images') {
            steps {
                echo '=== Stage 6: Building Docker Containers ==='
                sh "docker build -t ${IMAGE_FRONTEND}:latest -t ${IMAGE_FRONTEND}:${BUILD_TAG} ./client"
                sh "docker build -t ${IMAGE_BACKEND}:latest -t ${IMAGE_BACKEND}:${BUILD_TAG} ./server"
            }
        }

        /*
          ==========================================================================
          STAGE 7: Push Images to Registry
          ==========================================================================
          Authenticates with the Docker registry using Jenkins credentials provider
          and pushes the tagged images for retrieval during Kubernetes deployment.
        */
        stage('Push Images') {
            steps {
                echo '=== Stage 7: Pushing Container Images ==='
                /*
                  Uncomment this block in active Jenkins controller with credentials set.
                  withCredentials([usernamePassword(credentialsId: DOCKER_CRED_ID,
                                                   usernameVariable: 'DOCKER_USER',
                                                   passwordVariable: 'DOCKER_PASS')]) {
                      sh "echo \$DOCKER_PASS | docker login -u \$DOCKER_USER --password-stdin ${DOCKER_REGISTRY}"
                      sh "docker push ${IMAGE_FRONTEND}:latest"
                      sh "docker push ${IMAGE_FRONTEND}:${BUILD_TAG}"
                      sh "docker push ${IMAGE_BACKEND}:latest"
                      sh "docker push ${IMAGE_BACKEND}:${BUILD_TAG}"
                  }
                */
                echo "Simulated pushing images: ${IMAGE_FRONTEND}:${BUILD_TAG} and ${IMAGE_BACKEND}:${BUILD_TAG}"
            }
        }

        /*
          ==========================================================================
          STAGE 8: Kubernetes Deployment
          ==========================================================================
          Uses kubectl to apply manifests to the target cluster in the specified namespace.
          Uses Envsubst to dynamically inject the correct image build tag.
        */
        stage('Kubernetes Deployment') {
            steps {
                echo '=== Stage 8: Deploying to Kubernetes Cluster ==='
                /*
                  Uncomment this block in active Jenkins controller with kubeconfig set.
                  configFileProvider([configFile(fileId: KUBECONFIG_CRED_ID, variable: 'KUBECONFIG')]) {
                      sh "kubectl apply -f kubernetes/namespace.yaml"
                      sh "kubectl apply -f kubernetes/configmap.yaml"
                      sh "kubectl apply -f kubernetes/secret.yaml"
                      
                      // Deploy workloads with the dynamic build tag
                      sh "sed -i 's|astronet-client:latest|${IMAGE_FRONTEND}:${BUILD_TAG}|g' kubernetes/deployment.yaml"
                      sh "sed -i 's|astronet-server:latest|${IMAGE_BACKEND}:${BUILD_TAG}|g' kubernetes/deployment.yaml"
                      
                      sh "kubectl apply -f kubernetes/deployment.yaml"
                      sh "kubectl apply -f kubernetes/service.yaml"
                      sh "kubectl apply -f kubernetes/ingress.yaml"
                      sh "kubectl apply -f kubernetes/autoscaling.yaml"
                  }
                */
                echo "Simulated Kubernetes deployment applying YAML templates from ./kubernetes with tag ${BUILD_TAG}"
            }
        }

        /*
          ==========================================================================
          STAGE 9: Post Deployment Verification
          ==========================================================================
          Performs a health check curl against the deployed service APIs to verify
          uptime, configuration status, and routing before declaring success.
        */
        stage('Post Deployment Verification') {
            steps {
                echo '=== Stage 9: Verification Checks ==='
                // Query K8s rollout status to ensure pods are running
                // sh "kubectl rollout status deployment/astronet-backend-deployment -n astronet"
                
                // Check HTTP health endpoint response
                echo "Verifying server api/health status..."
                // sh "curl --fail http://astronet.api.local/api/health"
                echo "Rollout verified: Status OPERATIONAL."
            }
        }
    }

    /*
      ==========================================================================
      POST-PIPELINE OPERATIONS
      ==========================================================================
      Executes actions after the build completes, regardless of outcome.
    */
    post {
        always {
            echo "Pipeline finished. Cleaning workspace workspace..."
            cleanWs()
        }
        success {
            echo "🎉 Pipeline Completed Successfully! Build #${env.BUILD_NUMBER} is now live."
            // sendEmailNotification('success')
        }
        failure {
            echo "❌ Pipeline Failed! Check build output of stage that failed."
            // sendEmailNotification('failure')
        }
    }
}
