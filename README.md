# Task Manager - DevOps CI/CD Pipeline Demo

A complete full-stack application demonstrating modern DevOps practices with automated CI/CD pipeline using GitHub Actions, Docker, and AWS EC2.

## Architecture

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Development   │    │     Staging     │    │   Production    │
│   Environment   │    │   Environment   │    │   Environment   │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│  dev branch     │    │ staging branch  │    │  main branch    │
│  Port: 8080     │    │  Port: 80       │    │  Port: 80       │
│  Auto-deploy    │    │  Auto-deploy    │    │  Manual approve │
└─────────────────┘    └─────────────────┘    └─────────────────┘
│                       │                       │
└───────────────────────┼───────────────────────┘
│
┌─────────────────────────┐
│     GitHub Actions      │
│    CI/CD Pipeline       │
└─────────────────────────┘

## Features

### Application Features
- **Frontend**: Responsive vanilla JavaScript application
- **Backend**: RESTful API built with Node.js/Express
- **Database**: In-memory storage (easily replaceable)
- **Reverse Proxy**: NGINX configuration with load balancing

### DevOps Features
- **Multi-environment deployment** (Dev/Staging/Production)
- **Automated CI/CD pipeline** with GitHub Actions
- **Docker containerization** with multi-stage builds
- **Infrastructure as Code** with Docker Compose
- **Automated testing** and health checks
- **Security scanning** and best practices
- **Monitoring and logging** capabilities

## Tech Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| Frontend | Vanilla JS, HTML5, CSS3 | User interface |
| Backend | Node.js, Express | API server |
| Reverse Proxy | NGINX | Load balancing, static files |
| Containerization | Docker, Docker Compose | Application packaging |
| CI/CD | GitHub Actions | Automated deployment |
| Cloud | AWS EC2 | Infrastructure hosting |
| Monitoring | Custom scripts | Health monitoring |

##  Quick Start

### Prerequisites
- Docker and Docker Compose installed
- Node.js 18+ installed
- Git installed
- AWS account with EC2 access
- GitHub account

### Local Development

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/task-manager-devops.git
cd task-manager-devops

2. **Set up the environment**
chmod +x scripts/*.sh
./scripts/setup-env.sh development

3. **Run the application**
./scripts/deploy.sh development

4. **Access the application**
Frontend: http://localhost:8080
API: http://localhost:8080/api
Health Check: http://localhost:8080/health

## Production Deployment

1. **Configure GitHub Secrets**
# Required secrets for each environment:
DEV_HOST=your-dev-server-ip
DEV_USERNAME=ubuntu
DEV_SSH_KEY=your-private-key
DEV_PORT=22

STAGING_HOST=your-staging-server-ip
STAGING_USERNAME=ubuntu
STAGING_SSH_KEY=your-private-key
STAGING_PORT=22

PROD_HOST=your-prod-server-ip
PROD_USERNAME=ubuntu
PROD_SSH_KEY=your-private-key
PROD_PORT=22

2. **Set up EC2 instances**
# Install Docker on each EC2 instance
sudo apt update
sudo apt install docker.io docker-compose -y
sudo usermod -aG docker ubuntu
sudo systemctl start docker
sudo systemctl enable docker

3. **Deploy using Git workflow**
# Development deployment
git checkout dev
git push origin dev

# Staging deployment
git checkout staging
git push origin staging

# Production deployment (requires approval)
git checkout main
git push origin main

## Task Object Structure
{
  "id": 1,
  "text": "Sample task",
  "completed": false,
  "createdAt": "2024-01-20T10:00:00.000Z",
  "updatedAt": "2024-01-20T10:30:00.000Z"
}

### Configuration

## Environment Variables

# Frontend
NODE_ENV=development|staging|production

# Backend
NODE_ENV=development|staging|production
PORT=5000


## NGINX

Automatically configured based on environment
Development: Port 8080
Staging/Production: Port 80

## CI/CD Pipeline
## Workflow Triggers
Branch                 |dev         |staging       |prod
Environment            |Development |staging       |production
Trigger                |Auto on push|Auto on push  |Auto on push
Approval Required      |no          |no            |yes

### Pipeline Stages
1. **Code Quality Checks**
Syntax validation
Dependency installation
Security scanning

2. **Testing**

Unit tests
Integration tests
Docker image testing


3. **Build**

Docker image creation
Multi-stage optimization
Image tagging


4. **Deploy**

Container orchestration
Health checks
Rollback on failure


5. **Post-Deploy**

Smoke testing
Performance monitoring
Notification

### Monitoring
## Health Checks

Application health: /health
API health: /api/health
Container health: Docker health checks

## Monitoring Script
# Run monitoring in background
./scripts/monitor.sh &

## Log Management
# View application logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f nginx

### Security
## Implemented Security Measures

Container Security: Non-root user, minimal base images
Network Security: Isolated Docker networks
HTTP Security: Security headers via NGINX
Secrets Management: GitHub Secrets for sensitive data
Access Control: SSH key-based authentication

## Security Headers
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block

### Troubleshooting
## Common Issues

1. **Docker containers not starting**
# Check Docker status
sudo systemctl status docker

# Check logs
docker-compose logs

# Restart services
docker-compose restart

2. **Port conflicts**
# Check what's using the port
sudo netstat -tulpn | grep :8080

# Kill process using port
sudo kill -9 $(sudo lsof -t -i:8080)

3. **GitHub Actions failing**
# Check secrets are set correctly
# Verify SSH key has proper permissions
# Check EC2 security groups allow SSH

4. **Application not accessible**
# Check EC2 security group rules
# Verify NGINX configuration
# Check container networking

## Debug Commands
# Check container status
docker-compose ps

# Enter container for debugging
docker-compose exec backend bash
docker-compose exec frontend sh

# Check network connectivity
docker network ls
docker network inspect task-manager-devops_task-network

# Learning Objectives
This project demonstrates:

Containerization: Docker multi-stage builds and optimization
Orchestration: Docker Compose for multi-container applications
CI/CD: GitHub Actions workflow automation
Infrastructure: AWS EC2 deployment and management
Monitoring: Health checks and log management
Security: Container and application security practices
Documentation: Comprehensive project documentation

# Contributing

Fork the repository
Create a feature branch (git checkout -b feature/amazing-feature)
Commit your changes (git commit -m 'Add amazing feature')
Push to the branch (git push origin feature/amazing-feature)
Open a Pull Request

# License
This project is licensed under the MIT License - see the LICENSE file for details.
# Acknowledgments

Docker for containerization platform
GitHub Actions for CI/CD automation
NGINX for reverse proxy capabilities
AWS for cloud infrastructure
Node.js community for excellent tools

# Support
If you encounter any issues:

Check the troubleshooting section
Review container logs: docker-compose logs
Open an issue on GitHub
Check AWS EC2 console for instance status


Made with ❤️ for learning modern DevOps practices.