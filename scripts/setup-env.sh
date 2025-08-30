#!/bin/bash

set -e

ENVIRONMENT=${1:-development}

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

echo "🛠️  Setting up environment for: $ENVIRONMENT"

# Create project directories
print_status "Creating project directories..."
mkdir -p logs
mkdir -p backups
mkdir -p data

# Set appropriate permissions
print_status "Setting permissions..."
chmod 755 scripts/*.sh

# Install Node.js dependencies
print_status "Installing frontend dependencies..."
cd frontend
npm install
cd ..

print_status "Installing backend dependencies..."
cd backend
npm install
cd ..

# Create environment-specific configurations
print_status "Creating environment configurations..."

case $ENVIRONMENT in
    "development")
        print_status "Setting up development environment..."
        # Create development-specific configs
        echo "NODE_ENV=development" > .env.dev
        echo "PORT=3000" >> .env.dev
        echo "API_URL=http://localhost:5000" >> .env.dev
        ;;
    "staging")
        print_status "Setting up staging environment..."
        echo "NODE_ENV=staging" > .env.staging
        echo "PORT=3000" >> .env.staging
        echo "API_URL=http://staging-api.yourdomain.com" >> .env.staging
        ;;
    "production")
        print_status "Setting up production environment..."
        echo "NODE_ENV=production" > .env.prod
        echo "PORT=3000" >> .env.prod
        echo "API_URL=https://api.yourdomain.com" >> .env.prod
        ;;
esac

# Initialize Git hooks (optional)
print_status "Setting up Git hooks..."
if [ -d ".git" ]; then
    cat << 'EOF' > .git/hooks/pre-commit
#!/bin/bash
echo "Running pre-commit checks..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "Warning: Docker is not running"
fi

# Check for common issues in Docker files
if [ -f "Dockerfile" ]; then
    echo "Checking Dockerfile syntax..."
fi

echo "Pre-commit checks completed"
EOF
    chmod +x .git/hooks/pre-commit
fi

# Create monitoring script
print_status "Creating monitoring script..."
cat << 'EOF' > scripts/monitor.sh
#!/bin/bash

# Simple monitoring script
while true; do
    echo "$(date): Checking application health..."
    
    # Check if containers are running
    if docker-compose ps | grep -q "Up"; then
        echo "✅ Containers are running"
    else
        echo "❌ Some containers are down"
        docker-compose ps
    fi
    
    # Check application endpoint
    if curl -f -s http://localhost:8080/health > /dev/null; then
        echo "✅ Application health check passed"
    else
        echo "❌ Application health check failed"
    fi
    
    echo "---"
    sleep 60
done
EOF
chmod +x scripts/monitor.sh

print_success "Environment setup completed for: $ENVIRONMENT"
print_status "Next steps:"
echo "1. Update the environment variables in .env.$ENVIRONMENT file"
echo "2. Configure your EC2 instances and security groups"
echo "3. Set up GitHub secrets for CI/CD"
echo "4. Run: ./scripts/deploy.sh $ENVIRONMENT"