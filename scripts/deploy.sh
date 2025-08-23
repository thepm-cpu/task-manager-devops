#!/bin/bash

set -e

ENVIRONMENT=${1:-development}
BRANCH=${2:-main}

echo "🚀 Starting deployment to $ENVIRONMENT environment..."

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker and try again."
    exit 1
fi

# Determine compose file based on environment
if [ "$ENVIRONMENT" == "production" ] || [ "$ENVIRONMENT" == "staging" ]; then
    COMPOSE_FILE="docker-compose.prod.yml"
    PORT="80"
else
    COMPOSE_FILE="docker-compose.yml"
    PORT="8080"
fi

print_status "Using compose file: $COMPOSE_FILE"
print_status "Target port: $PORT"

# Pull latest code
print_status "Pulling latest code from branch: $BRANCH"
git fetch origin
git checkout $BRANCH
git pull origin $BRANCH

# Stop existing containers
print_status "Stopping existing containers..."
docker-compose -f $COMPOSE_FILE down || print_warning "No existing containers to stop"

# Remove unused images and containers
print_status "Cleaning up unused Docker resources..."
docker system prune -f

# Build new images
print_status "Building Docker images..."
docker-compose -f $COMPOSE_FILE build --no-cache

# Start services
print_status "Starting services..."
docker-compose -f $COMPOSE_FILE up -d

# Wait for services to be ready
print_status "Waiting for services to be ready..."
sleep 15

# Health check
print_status "Performing health check..."
for i in {1..10}; do
    if curl -f -s http://localhost:$PORT/health > /dev/null; then
        print_success "Health check passed!"
        break
    elif [ $i -eq 10 ]; then
        print_error "Health check failed after 10 attempts"
        docker-compose -f $COMPOSE_FILE logs
        exit 1
    else
        print_status "Health check attempt $i/10 failed, retrying..."
        sleep 3
    fi
done

# Show running containers
print_status "Current running containers:"
docker-compose -f $COMPOSE_FILE ps

print_success "Deployment to $ENVIRONMENT completed successfully!"
print_success "Application is running at http://localhost:$PORT"

# Show logs for the last few minutes
print_status "Recent logs:"
docker-compose -f $COMPOSE_FILE logs --tail=20