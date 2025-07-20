# DevOps Microservices Application

A modern full-stack application demonstrating DevOps best practices with microservices architecture, featuring automated CI/CD pipelines, containerization, and Kubernetes orchestration.

## Architecture Overview

This project consists of:
- **DevOps Pipeline**: Jenkins CI/CD with Docker and Kubernetes deployment
- **Orchestration**: Kubernetes with blue-green deployment strategy
- **Frontend**: React.js application with user authentication and product management
- **Backend**: Node.js/Express API with MongoDB integration
- **Database**: MongoDB for data persistence

## Technology Stack

### Frontend
- **React.js** 

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **CORS** - Cross-origin resource sharing

### DevOps & Infrastructure
- **Docker** - Containerization platform
- **Kubernetes** - Container orchestration
- **Jenkins** - CI/CD automation
- **Docker Hub** - Container registry
- **Blue-Green Deployment** - Zero-downtime deployment strategy

## 🛠️ Prerequisites

Before running this application, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** 
- **Docker** 
- **Kubernetes**  (I use the one built into Docker Desktop)
- **kubectl** CLI tool
- **Jenkins** (I run it as a docker container )
- **MongoDB** (local or cloud instance)

## 🏃‍♂️ Quick Start

### 1. Jenkins CI/CD Setup

This section will help you set up Jenkins with Docker integration to automate the build, test, and deployment pipeline.

#### Step 1: Install Jenkins using Docker

First, create a Docker network for Jenkins:
```bash
docker network create jenkins
```

Run Jenkins as a Docker container:
```bash
docker run -d --name jenkins-blueocean \
  --restart=on-failure \
  --network jenkins \
  -p 8080:8080 \
  -p 50000:50000 \
  -v jenkins-data:/var/jenkins_home \
  -v /var/run/docker.sock:/var/run/docker.sock \
  jenkinsci/blueocean
```

#### Step 2: Initial Jenkins Setup

 **Access Jenkins Dashboard:**
   - Open your browser and go to `http://localhost:8080`
   - Install Docker plugins

#### Step 3: Create Docker Agent for Jenkins

Since Jenkins runs inside a Docker container, a Docker-in-Docker (DinD) setup is required to expose the host’s Docker socket. This allows Jenkins to access the local Docker engine and build Docker images during the CI/CD pipeline:

```bash
docker run -d --restart=always \
  --name docker-socat \
  -p 127.0.0.1:2376:2375 \
  --network jenkins \
  -v /var/run/docker.sock:/var/run/docker.sock \
  alpine/socat tcp-listen:2375,fork,reuseaddr unix-connect:/var/run/docker.sock
```

Get the container's IP address:
```bash
docker inspect docker-socat | grep IPAddress
```

#### Step 4: Configure Jenkins Docker Agent

1. **In Jenkins Dashboard (`http://localhost:8080`):**
   - Go to **Manage Jenkins** → **Clouds**
   - Click **Configure Clouds** → **Add a new cloud** → **Docker**

2. **Docker Cloud Configuration:**
   - **Docker Host URI:** `tcp://<IP_FROM_STEP_3>:2375`
   - **Test Connection** to verify it works
   - **Enabled:** ✓ (checked)

3. **Add Docker Agent Template:**
   - Click **Docker Agent templates** → **Add Docker Template**
   - **Labels:** `jenkins-docker-agent` (must match Jenkinsfile)
   - **Docker Image:** `jenkins/agent:latest` (Create the desired image)
   - **Instance Capacity:** `2`
   - **Remote File System Root:** `/home/jenkins`

#### Step 5: Configure Docker Hub Credentials

1. **In Jenkins Dashboard:**
   - Go to **Manage Jenkins** → **Manage Credentials**
   - Click **System** → **Global credentials** → **Add Credentials**

2. **Add Docker Hub Credentials:**
   - **Kind:** Username with password
   - **Username:** Your Docker Hub username
   - **Password:** Your Docker Hub password/access token
   - **ID:** `dockerhub-creds` (must match Jenkinsfile)
   - **Description:** Docker Hub Credentials

#### Step 6: Configure Kubernetes Access 

If you want Jenkins to deploy to Kubernetes:

1. **Add Kubernetes Config:**
   - **Kind:** Secret file
   - **File:** Upload your `~/.kube/config` file
   - **ID:** `kube-config-jenkins` (must match Jenkinsfile)
   - **Description:** Kubernetes Config

#### Step 7: Create Jenkins Pipelines

1. **Create Backend Pipeline:**
   - Go to **New Item** → **Pipeline**
   - **Name:** `backend-pipeline`
   - **Pipeline Definition:** Pipeline script from SCM
   - **SCM:** Git
   - **Repository URL:** Your repository URL
   - **Script Path:** `backend/Jenkinsfile`

2. **Create Frontend Pipeline:**
   - **Name:** `frontend-pipeline`
   - **Script Path:** `frontend/Jenkinsfile`

#### Step 8: Run the Pipelines

**Option 1: Automatic (SCM Polling):**
- Pipelines will automatically run every 5 minutes if changes are detected

**Option 2: Manual Trigger:**
- Go to your pipeline → Click **Build Now**

### 2. Kubernetes Deployment

#### Prerequisites
- Ensure your Kubernetes cluster is running
- Configure `kubectl` to connect to your cluster
- Edit the Kubernetes YAML files to reference the Docker images for the frontend and backend images that were pushed to Docker Hub
#### Deploy Backend (Blue-Green)
```bash
# Deploy blue version
kubectl apply -f k8s/backend-blue-deployment.yaml
kubectl apply -f k8s/backend-service.yaml

# Deploy green version (for blue-green deployment)
kubectl apply -f k8s/backend-green-deployment.yaml
```

#### Deploy Frontend
```bash
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/frontend-clusterIP.yaml
```

#### Check Deployment Status
```bash
kubectl get pods
kubectl get services
kubectl get deployments
```

#### 🔒 Creating TLS Certificate for HTTPS Ingress

To enable HTTPS for your application, you'll need to create a TLS certificate and Kubernetes secret for the ingress controller.

#### Step 1: Create a working directory
```bash
mkdir my-cert && cd my-cert
```

#### Step 2: Generate a TLS certificate and private key
```bash
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
-out tls.crt -keyout tls.key \
-subj "/CN=myapp.local/O=myapp.local"
```

This creates two files:
- `tls.crt` → Public TLS certificate
- `tls.key` → Private key for the certificate

To verify the files exist:
```bash
ls
```

#### Step 3: Create a Kubernetes TLS secret
```bash
kubectl create secret tls myapp-tls --key tls.key --cert tls.crt
```

#### Step 4: Update your ingress configuration
Make sure your ingress YAML file references the TLS secret


#### Step 5: Add domain to hosts file (for local testing)
```bash
echo "127.0.0.1 myapp.local" | sudo tee -a /etc/hosts
```
#### Configure Ingress
```bash
kubectl apply -f k8s/ingress.yaml
```

Now you can access your application securely at `https://myapp.local`

## 🔄 CI/CD Pipeline

This project includes automated Jenkins pipelines for both frontend and backend:

### Backend Pipeline Features:
- **Build**: Creates Docker image with version tagging
- **Test**: Validates container functionality
- **Push**: Publishes image to Docker Hub
- **Deploy**: Implements blue-green deployment strategy

### Frontend Pipeline Features:
- **Build**: Creates optimized production build
- **Test**: Validates container startup
- **Push**: Publishes to container registry
- **Deploy**: Updates Kubernetes deployment

### Pipeline Triggers:
- **Automatic**: SCM polling every 5 minutes
- **Manual**: Jenkins job execution
- **Webhook**: Git repository changes (if configured)

## 📊 API Endpoints

### User Endpoints
- `GET /users` - Get all users
- `POST /users` - Create new user

### Product Endpoints
- `GET /products` - Get all products
- `POST /products` - Create new product

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a Pull Request
