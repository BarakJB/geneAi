#!/bin/bash

# AgentsCalculator Database Startup Script
echo "🚀 Starting AgentsCalculator MySQL Database..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Error: Docker is not running. Please start Docker first.${NC}"
    exit 1
fi

# Check if docker-compose exists
if ! command -v docker-compose &> /dev/null; then
    echo -e "${YELLOW}⚠️  docker-compose not found. Trying with 'docker compose'...${NC}"
    DOCKER_COMPOSE="docker compose"
else
    DOCKER_COMPOSE="docker-compose"
fi

echo -e "${BLUE}📦 Building and starting containers...${NC}"

# Start the database
$DOCKER_COMPOSE up -d

# Wait for MySQL to be ready
echo -e "${YELLOW}⏳ Waiting for MySQL to be ready...${NC}"
sleep 10

# Check if MySQL is ready
max_attempts=30
attempt=1

while [ $attempt -le $max_attempts ]; do
    if docker exec agents_calculator_mysql mysqladmin ping -h localhost -u barak -pjronaldo1991 &> /dev/null; then
        echo -e "${GREEN}✅ MySQL is ready!${NC}"
        break
    fi
    
    echo -e "${YELLOW}⏳ Attempt $attempt/$max_attempts - MySQL not ready yet...${NC}"
    sleep 2
    ((attempt++))
done

if [ $attempt -gt $max_attempts ]; then
    echo -e "${RED}❌ MySQL failed to start within expected time.${NC}"
    echo -e "${YELLOW}💡 Try running: docker logs agents_calculator_mysql${NC}"
    exit 1
fi

# Display connection information
echo -e "${GREEN}🎉 Database is ready!${NC}"
echo -e "${BLUE}📋 Connection Details:${NC}"
echo -e "   Host: localhost"
echo -e "   Port: 3308"
echo -e "   Database: agents_calculator"
echo -e "   Username: barak"
echo -e "   Password: jronaldo1991"
echo ""
echo -e "${BLUE}🌐 PhpMyAdmin Web Interface:${NC}"
echo -e "   URL: http://localhost:8081"
echo -e "   Username: barak"
echo -e "   Password: jronaldo1991"
echo ""
echo -e "${BLUE}🔧 Useful Commands:${NC}"
echo -e "   View logs: docker logs agents_calculator_mysql"
echo -e "   Stop database: $DOCKER_COMPOSE down"
echo -e "   Connect via CLI: docker exec -it agents_calculator_mysql mysql -u barak -p agents_calculator"
echo ""

# Test the database connection
echo -e "${BLUE}🧪 Testing database connection...${NC}"
if docker exec agents_calculator_mysql mysql -u barak -pjronaldo1991 agents_calculator -e "SELECT COUNT(*) as total_customers FROM customers;" 2>/dev/null; then
    echo -e "${GREEN}✅ Database connection successful!${NC}"
    echo -e "${GREEN}✅ Sample data loaded successfully!${NC}"
else
    echo -e "${YELLOW}⚠️  Database is running but sample data might not be loaded yet.${NC}"
    echo -e "${YELLOW}   This is normal if this is the first run.${NC}"
fi

echo -e "${GREEN}🎯 Database startup complete!${NC}"
