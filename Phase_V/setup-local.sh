#!/bin/bash

# Phase 5 Local Development Setup Script
# Sets up Kafka, Dapr, and all services for local development

set -e

echo "=========================================="
echo "Phase 5 Local Development Setup"
echo "=========================================="

# Colors
RED='/033[0;31m'
GREEN='/033[0;32m'
YELLOW='/033[1;33m'
NC='/033[0m'

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}➜ $1${NC}"
}

# Check prerequisites
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

print_info "Checking prerequisites..."

if ! command_exists docker; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command_exists dapr; then
    print_error "Dapr CLI is not installed. Install with: wget -q https://raw.githubusercontent.com/dapr/cli/master/install/install.sh -O - | /bin/bash"
    exit 1
fi

if ! command_exists python3; then
    print_error "Python 3 is not installed. Please install Python 3.11+."
    exit 1
fi

if ! command_exists node; then
    print_error "Node.js is not installed. Please install Node.js 18+."
    exit 1
fi

print_success "All prerequisites installed"

# Step 1: Initialize Dapr
print_info "Step 1: Initializing Dapr..."
if [ ! -d "$HOME/.dapr" ]; then
    dapr init
    print_success "Dapr initialized"
else
    print_success "Dapr already initialized"
fi

# Step 2: Start Kafka with Docker Compose
print_info "Step 2: Starting Kafka cluster..."
docker-compose -f docker-compose-kafka.yml up -d
print_info "Waiting for Kafka to be ready (30 seconds)..."
sleep 30
print_success "Kafka cluster started"

# Step 3: Install backend dependencies
print_info "Step 3: Installing backend dependencies..."
cd backend
if [ ! -d "venv" ]; then
    python3 -m venv venv
fi
source venv/bin/activate || source venv/Scripts/activate
pip install -r requirements.txt
print_success "Backend dependencies installed"
cd ..

# Step 4: Install frontend dependencies
print_info "Step 4: Installing frontend dependencies..."
cd frontend
if [ ! -d "node_modules" ]; then
    npm install
fi
print_success "Frontend dependencies installed"
cd ..

# Step 5: Install microservice dependencies
print_info "Step 5: Installing microservice dependencies..."

cd services/notification-service
if [ ! -d "venv" ]; then
    python3 -m venv venv
fi
source venv/bin/activate || source venv/Scripts/activate
pip install -r requirements.txt
deactivate
print_success "Notification service dependencies installed"
cd ../..

cd services/recurring-task-service
if [ ! -d "venv" ]; then
    python3 -m venv venv
fi
source venv/bin/activate || source venv/Scripts/activate
pip install -r requirements.txt
deactivate
print_success "Recurring task service dependencies installed"
cd ../..

# Step 6: Run database migration
print_info "Step 6: Running database migration..."
cd backend
source venv/bin/activate || source venv/Scripts/activate
alembic upgrade head
deactivate
print_success "Database migration completed"
cd ..

# Step 7: Create startup scripts
print_info "Step 7: Creating startup scripts..."

# Backend startup script
cat > start-backend.sh << 'EOF'
#!/bin/bash
cd backend
source venv/bin/activate || source venv/Scripts/activate
dapr run --app-id backend --app-port 8000 --dapr-http-port 3500 --components-path ../.dapr/components -- uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload
EOF
chmod +x start-backend.sh

# Frontend startup script
cat > start-frontend.sh << 'EOF'
#!/bin/bash
cd frontend
npm run dev
EOF
chmod +x start-frontend.sh

# Notification service startup script
cat > start-notification-service.sh << 'EOF'
#!/bin/bash
cd services/notification-service
source venv/bin/activate || source venv/Scripts/activate
dapr run --app-id notification-service --app-port 8001 --dapr-http-port 3501 --components-path ../../.dapr/components -- python main.py
EOF
chmod +x start-notification-service.sh

# Recurring task service startup script
cat > start-recurring-task-service.sh << 'EOF'
#!/bin/bash
cd services/recurring-task-service
source venv/bin/activate || source venv/Scripts/activate
dapr run --app-id recurring-task-service --app-port 8002 --dapr-http-port 3502 --components-path ../../.dapr/components -- python main.py
EOF
chmod +x start-recurring-task-service.sh

# Stop all script
cat > stop-all.sh << 'EOF'
#!/bin/bash
echo "Stopping all services..."
pkill -f "dapr run"
pkill -f "uvicorn"
pkill -f "npm run dev"
docker-compose -f docker-compose-kafka.yml down
echo "All services stopped"
EOF
chmod +x stop-all.sh

print_success "Startup scripts created"

echo ""
echo "=========================================="
echo "Setup Complete!"
echo "=========================================="
echo ""
print_success "Local development environment is ready!"
echo ""
print_info "To start all services, open 4 terminal windows and run:"
echo ""
echo "Terminal 1 (Backend):"
echo "  ./start-backend.sh"
echo ""
echo "Terminal 2 (Frontend):"
echo "  ./start-frontend.sh"
echo ""
echo "Terminal 3 (Notification Service):"
echo "  ./start-notification-service.sh"
echo ""
echo "Terminal 4 (Recurring Task Service):"
echo "  ./start-recurring-task-service.sh"
echo ""
print_info "Access the application:"
echo "  Frontend: http://localhost:3000"
echo "  Backend API: http://localhost:8000/api/docs"
echo "  Kafka UI: http://localhost:8080"
echo ""
print_info "To stop all services:"
echo "  ./stop-all.sh"
echo ""
print_info "To view Kafka topics:"
echo "  docker exec -it kafka kafka-topics --list --bootstrap-server localhost:9092"
echo ""
print_info "To consume Kafka messages:"
echo "  docker exec -it kafka kafka-console-consumer --bootstrap-server localhost:9092 --topic task-events --from-beginning"
echo ""
