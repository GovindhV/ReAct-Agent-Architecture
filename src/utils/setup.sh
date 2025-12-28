#!/bin/bash

# ReAct Calendar Agent - Automated Setup Script
# For macOS (iMac)

set -e

echo "🚀 Starting ReAct Calendar Agent Setup..."
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Step 1: Check Prerequisites
echo "Step 1: Checking prerequisites..."
echo ""

if command_exists node; then
    NODE_VERSION=$(node --version)
    print_success "Node.js installed: $NODE_VERSION"
else
    print_error "Node.js not found. Installing via Homebrew..."
    if command_exists brew; then
        brew install node
        print_success "Node.js installed successfully"
    else
        print_error "Homebrew not found. Please install from https://brew.sh"
        exit 1
    fi
fi

if command_exists npm; then
    NPM_VERSION=$(npm --version)
    print_success "npm installed: $NPM_VERSION"
else
    print_error "npm not found"
    exit 1
fi

if command_exists docker; then
    DOCKER_VERSION=$(docker --version)
    print_success "Docker installed: $DOCKER_VERSION"
else
    print_error "Docker not found. Please install Docker Desktop from https://www.docker.com/products/docker-desktop/"
    exit 1
fi

if command_exists docker-compose; then
    DOCKER_COMPOSE_VERSION=$(docker-compose --version)
    print_success "Docker Compose installed: $DOCKER_COMPOSE_VERSION"
else
    print_error "Docker Compose not found"
    exit 1
fi

echo ""

# Step 2: Create Directory Structure
echo "Step 2: Creating directory structure..."
echo ""

mkdir -p logs
mkdir -p backups
mkdir -p src/utils
mkdir -p config
mkdir -p docs
mkdir -p tests
mkdir -p scripts

print_success "Directories created"
echo ""

# Step 3: Copy Environment File
echo "Step 3: Setting up environment configuration..."
echo ""

if [ ! -f .env ]; then
    if [ -f .env.example ]; then
        cp .env.example .env
        print_success ".env file created from .env.example"
        print_info "Please edit .env file with your actual configuration"
    else
        print_error ".env.example not found"
    fi
else
    print_info ".env file already exists, skipping..."
fi

echo ""

# Step 4: Install Node Dependencies
echo "Step 4: Installing Node.js dependencies..."
echo ""

npm install
print_success "Dependencies installed"
echo ""

# Step 5: Start Docker Services
echo "Step 5: Starting Docker services (Kafka & Zookeeper)..."
echo ""

if [ -f docker-compose.yml ]; then
    docker-compose up -d
    print_success "Docker services started"
    
    print_info "Waiting for Kafka to be ready (30 seconds)..."
    sleep 30
    
    # Check if Kafka is running
    if docker ps | grep -q kafka; then
        print_success "Kafka is running"
    else
        print_error "Kafka failed to start"
        docker-compose logs kafka
        exit 1
    fi
else
    print_error "docker-compose.yml not found"
    exit 1
fi

echo ""

# Step 6: Initialize Database
echo "Step 6: Initializing database..."
echo ""

# The database will be created automatically when server starts
print_success "Database will be initialized on first server start"
echo ""

# Step 7: Create Kafka Topics
echo "Step 7: Creating Kafka topics..."
echo ""

docker exec kafka kafka-topics --create --if-not-exists \
    --topic calendar-events \
    --bootstrap-server localhost:9092 \
    --partitions 3 \
    --replication-factor 1

docker exec kafka kafka-topics --create --if-not-exists \
    --topic react-logs \
    --bootstrap-server localhost:9092 \
    --partitions 2 \
    --replication-factor 1

docker exec kafka kafka-topics --create --if-not-exists \
    --topic notifications \
    --bootstrap-server localhost:9092 \
    --partitions 2 \
    --replication-factor 1

print_success "Kafka topics created"
echo ""

# Step 8: Generate Security Secrets
echo "Step 8: Generating security secrets..."
echo ""

if command_exists openssl; then
    JWT_SECRET=$(openssl rand -base64 32)
    echo "Generated JWT_SECRET: $JWT_SECRET"
    print_info "Add this to your .env file: JWT_SECRET=$JWT_SECRET"
else
    print_info "OpenSSL not found, using default JWT_SECRET"
fi

echo ""

# Step 9: Verify Installation
echo "Step 9: Verifying installation..."
echo ""

# Check if ports are available
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
        return 0
    else
        return 1
    fi
}

if check_port 9092; then
    print_success "Kafka is listening on port 9092"
else
    print_error "Kafka is not listening on port 9092"
fi

if check_port 8080; then
    print_success "Kafka UI is listening on port 8080"
else
    print_info "Kafka UI might take a moment to start"
fi

echo ""

# Final Instructions
echo "════════════════════════════════════════════════"
echo "✅ Setup Complete!"
echo "════════════════════════════════════════════════"
echo ""
echo "Next steps:"
echo ""
echo "1. Edit .env file with your configuration:"
echo "   nano .env"
echo ""
echo "2. Start the server:"
echo "   npm start"
echo ""
echo "3. Open the UI:"
echo "   open index.html"
echo "   or"
echo "   python3 -m http.server 8000"
echo "   then open http://localhost:8000"
echo ""
echo "4. Access Kafka UI:"
echo "   open http://localhost:8080"
echo ""
echo "5. Test the API:"
echo '   curl -X POST http://localhost:3001/api/process-query \'
echo '     -H "Content-Type: application/json" \'
echo '     -d '"'"'{"email":"test@test.com","query":"Schedule meeting tomorrow"}'"'"
echo ""
echo "For detailed documentation, see:"
echo "  - README.md"
echo "  - SETUP_GUIDE.md"
echo "  - QUICK_REFERENCE.md"
echo ""
echo "════════════════════════════════════════════════"