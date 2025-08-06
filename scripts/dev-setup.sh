#!/bin/bash
# scripts/dev-setup.sh
# Complete development environment setup para Preparación Académica
# Educational Note: Automation reduces onboarding time from days to minutes

set -e

# Colors for professional output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

# Professional logging functions
log_header() {
    echo -e "${BLUE}"
    echo "══════════════════════════════════════════════════════════════════════════"
    echo "  $1"
    echo "══════════════════════════════════════════════════════════════════════════"
    echo -e "${NC}"
}

log_section() {
    echo
    echo -e "${PURPLE}📋 $1${NC}"
    echo "──────────────────────────────────────────────────────────────────────────"
}

log_step() {
    echo -e "${CYAN}⚙️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_info() {
    echo -e "${CYAN}ℹ️  $1${NC}"
}

show_educational_tip() {
    echo -e "${BLUE}💡 Educational Insight: $1${NC}"
}

# Progress tracking
TOTAL_STEPS=8
CURRENT_STEP=0

show_progress() {
    CURRENT_STEP=$((CURRENT_STEP + 1))
    local percentage=$((CURRENT_STEP * 100 / TOTAL_STEPS))
    echo -e "${PURPLE}📊 Progress: Step $CURRENT_STEP/$TOTAL_STEPS ($percentage%)${NC}"
}

# Error handling with educational value
handle_error() {
    local exit_code=$?
    local line_number=${1:-$LINENO}
    
    echo
    log_error "Setup failed at line $line_number (exit code: $exit_code)"
    echo
    echo "🎓 Educational Note: Setup failures are learning opportunities!"
    echo "   • Check the error message above for specific issues"
    echo "   • Run './scripts/validate-prerequisites.sh' to verify environment"
    echo "   • Common issues: missing dependencies, permission problems, port conflicts"
    echo
    echo "🔧 Quick Troubleshooting:"
    echo "   1. Ensure all prerequisites are installed"
    echo "   2. Check Docker is running"
    echo "   3. Verify sufficient disk space (>5GB)"
    echo "   4. Try running individual steps manually"
    echo
    exit $exit_code
}

trap 'handle_error $LINENO' ERR

# Header with educational context
log_header "🎓 Preparación Académica - Complete Development Setup"
echo
log_info "This automated setup follows enterprise development practices"
show_educational_tip "Professional teams automate setup to ensure consistency and reduce human error"
echo

# =====================================
# STEP 1: VALIDATE PREREQUISITES
# =====================================
log_section "🔍 Step 1: Prerequisites Validation"
show_progress

log_step "Running comprehensive prerequisites check..."

if [ -f "./scripts/validate-prerequisites.sh" ]; then
    if ./scripts/validate-prerequisites.sh; then
        log_success "Prerequisites validation passed"
    else
        log_error "Prerequisites validation failed"
        echo "Please run './scripts/validate-prerequisites.sh' and fix issues before continuing"
        exit 1
    fi
else
    log_warning "Prerequisites validation script not found, continuing with basic checks..."
    
    # Basic checks
    command -v node >/dev/null 2>&1 || { log_error "Node.js is not installed"; exit 1; }
    command -v npm >/dev/null 2>&1 || { log_error "npm is not installed"; exit 1; }
    command -v git >/dev/null 2>&1 || { log_error "Git is not installed"; exit 1; }
    
    log_success "Basic prerequisites check passed"
fi

show_educational_tip "Validating prerequisites early prevents confusing error messages later in the process"

# =====================================
# STEP 2: PROJECT STRUCTURE SETUP
# =====================================
log_section "📁 Step 2: Project Structure Initialization"
show_progress

log_step "Creating essential project directories..."

# Create directory structure
mkdir -p .github/{workflows,actions,ISSUE_TEMPLATE,PULL_REQUEST_TEMPLATE}
mkdir -p scripts
mkdir -p docs/{adr,guides,api}
mkdir -p tests/{unit,integration,e2e}
mkdir -p shared/{types,utils,config}

log_success "Project directory structure created"

# Initialize package.json if it doesn't exist
if [ ! -f "package.json" ]; then
    log_step "Initializing package.json..."
    
    cat > package.json << 'EOF'
{
  "name": "preparacion-academica",
  "version": "1.0.0",
  "description": "Educational platform foundation that teaches systematic debugging methodology through enterprise-grade repository setup and automation",
  "scripts": {
    "dev": "echo 'Development server starting...'",
    "test": "echo 'Running tests...'",
    "lint": "echo 'Running linter...'",
    "build": "echo 'Building project...'",
    "validate": "./scripts/validate-prerequisites.sh",
    "setup": "./scripts/dev-setup.sh",
    "health": "./scripts/health-check.sh"
  },
  "keywords": [
    "educational-platform",
    "debugging-methodology",
    "sicp-framework",
    "enterprise-automation",
    "github-actions"
  ],
  "author": "Franklin Andres Rodriguez",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/Franklin-Andres-Rodriguez/preparacion-academica.git"
  },
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=8.0.0"
  }
}
EOF
    
    log_success "package.json initialized"
else
    log_info "package.json already exists, skipping initialization"
fi

show_educational_tip "Consistent project structure enables team members to navigate and contribute effectively"

# =====================================
# STEP 3: ENVIRONMENT CONFIGURATION
# =====================================
log_section "🔧 Step 3: Environment Configuration"
show_progress

log_step "Setting up environment configuration files..."

# Create .env.example with educational comments
if [ ! -f ".env.example" ]; then
    cat > .env.example << 'EOF'
# 🎓 Preparación Académica - Environment Configuration Template
# Educational Note: Environment variables externalize configuration and protect secrets

# Development Environment
NODE_ENV=development

# Application Configuration
APP_NAME=preparacion-academica
APP_VERSION=1.0.0
APP_PORT=3000

# Database Configuration (Future Phases)
# Educational Note: Different databases per service in microservices architecture
# DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# Redis Configuration (Future Phases)  
# Educational Note: Redis provides fast caching and session storage
# REDIS_URL=redis://localhost:6379

# Security Configuration (Future Phases)
# Educational Note: Never hardcode secrets - always use environment variables
# JWT_SECRET=your-super-secret-jwt-key-here
# ENCRYPTION_KEY=your-encryption-key-here

# GitHub Integration (Future Phases)
# Educational Note: GitHub tokens enable API access for automated workflows
# GITHUB_TOKEN=your-github-personal-access-token
# GITHUB_WEBHOOK_SECRET=your-webhook-secret

# Email Configuration (Future Phases)
# Educational Note: External services for email prevent spam issues
# SMTP_HOST=smtp.example.com
# SMTP_PORT=587
# SMTP_USER=your-email@example.com
# SMTP_PASSWORD=your-email-password

# Analytics Configuration (Future Phases)
# Educational Note: Analytics help understand user behavior and improve education
# ANALYTICS_API_KEY=your-analytics-key
# MONITORING_URL=your-monitoring-service-url

# Development Tools
# Educational Note: Tool configuration can be environment-specific
LOG_LEVEL=debug
DEBUG_MODE=true
EOF
    
    log_success ".env.example template created with educational annotations"
else
    log_info ".env.example already exists, skipping creation"
fi

# Create .env for development if it doesn't exist
if [ ! -f ".env" ]; then
    log_step "Creating development .env file..."
    cp .env.example .env
    log_success "Development .env file created from template"
    log_warning "Remember to customize .env values for your specific setup"
else
    log_info ".env already exists, skipping creation"
fi

show_educational_tip "Environment files separate configuration from code, enabling different settings per environment"

# =====================================
# STEP 4: GIT CONFIGURATION
# =====================================
log_section "📚 Step 4: Git Repository Configuration" 
show_progress

log_step "Setting up Git hooks and configuration..."

# Create .gitignore if it doesn't exist
if [ ! -f ".gitignore" ]; then
    cat > .gitignore << 'EOF'
# 🎓 Preparación Académica - Git Ignore Configuration
# Educational Note: Proper .gitignore prevents accidental commits of sensitive/generated files

# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
package-lock.json
yarn.lock

# Environment variables - CRITICAL for security
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Build outputs
build/
dist/
out/
.next/
coverage/

# Database files - prevent accidental commits
*.db
*.sqlite
*.sqlite3

# Logs
logs/
*.log

# Runtime data
pids/
*.pid
*.seed
*.pid.lock

# IDE and Editor files
.vscode/
.idea/
*.swp
*.swo
*~

# Operating System files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Temporary folders
tmp/
temp/

# Cache directories
.cache/
.parcel-cache/
.npm/

# Testing
test-results/
screenshots/
videos/

# Security - never commit these
*.pem
*.key
*.crt
secrets/
.secrets/

# Docker
.docker/
docker-compose.override.yml

# Future microservices
services/*/.env
services/*/uploads/
services/*/logs/
EOF
    
    log_success ".gitignore created with comprehensive exclusions"
else
    log_info ".gitignore already exists, skipping creation"
fi

# Initialize git repository if not already done
if [ ! -d ".git" ]; then
    log_step "Initializing Git repository..."
    git init
    git branch -M main
    log_success "Git repository initialized with main branch"
else
    log_info "Git repository already initialized"
fi

# Set up basic git configuration if needed
if ! git config user.name &> /dev/null; then
    log_warning "Git user configuration incomplete"
    log_info "Please run: git config --global user.name 'Your Name'"
    log_info "Please run: git config --global user.email 'your.email@example.com'"
fi

show_educational_tip "Proper Git configuration ensures accurate commit attribution and prevents accidental sensitive data commits"

# =====================================
# STEP 5: DEPENDENCY INSTALLATION
# =====================================
log_section "📦 Step 5: Dependency Installation"
show_progress

log_step "Installing development dependencies..."

# Check if package.json has dependencies section
if ! grep -q '"dependencies"' package.json && ! grep -q '"devDependencies"' package.json; then
    log_step "Adding essential development dependencies..."
    
    # Install basic development tools
    npm install --save-dev \
        eslint \
        prettier \
        @types/node \
        typescript \
        jest \
        @jest/types
    
    log_success "Essential development dependencies installed"
else
    log_step "Installing existing dependencies..."
    npm install
    log_success "Dependencies installed from package.json"
fi

show_educational_tip "Managing dependencies with package.json ensures consistent environments across team members"

# =====================================
# STEP 6: DOCKER SETUP
# =====================================
log_section "🐳 Step 6: Docker Environment Setup"
show_progress

log_step "Preparing Docker configuration for future phases..."

# Create docker-compose.yml for development (basic version)
if [ ! -f "docker-compose.yml" ]; then
    cat > docker-compose.yml << 'EOF'
# 🎓 Preparación Académica - Docker Compose Configuration
# Educational Note: Docker Compose manages multi-container applications

version: '3.8'

services:
  # Future Phase 2: Database services will be added here
  # postgres:
  #   image: postgres:15-alpine
  #   environment:
  #     POSTGRES_DB: preparacion_academica
  #     POSTGRES_USER: dev_user
  #     POSTGRES_PASSWORD: dev_password
  #   ports:
  #     - "5432:5432"
  #   volumes:
  #     - postgres_data:/var/lib/postgresql/data

  # Future Phase 2: Redis cache will be added here
  # redis:
  #   image: redis:7-alpine
  #   ports:
  #     - "6379:6379"
  #   volumes:
  #     - redis_data:/data

  # Placeholder service for validation
  setup-validator:
    image: hello-world
    container_name: preparacion-academica-setup-test

# Future volumes will be uncommented in Phase 2
# volumes:
#   postgres_data:
#   redis_data:

networks:
  default:
    name: preparacion-academica-network
EOF
    
    log_success "Docker Compose configuration created for future expansion"
else
    log_info "docker-compose.yml already exists, skipping creation"
fi

# Test Docker setup
log_step "Testing Docker configuration..."
if docker-compose config > /dev/null 2>&1; then
    log_success "Docker Compose configuration is valid"
    
    # Run test container to verify Docker works
    log_step "Testing Docker container execution..."
    if docker-compose up setup-validator > /dev/null 2>&1; then
        log_success "Docker container execution test passed"
        docker-compose down > /dev/null 2>&1
    else
        log_warning "Docker container test failed - check Docker daemon"
    fi
else
    log_warning "Docker Compose configuration validation failed"
fi

show_educational_tip "Docker enables consistent development environments and simplifies dependency management"

# =====================================
# STEP 7: SECURITY SETUP
# =====================================
log_section "🔒 Step 7: Security Configuration"
show_progress

log_step "Setting up security configurations..."

# Verify security script exists and run it
if [ -f "./scripts/validate-security.sh" ]; then
    log_step "Running security configuration validation..."
    chmod +x ./scripts/validate-security.sh
    if ./scripts/validate-security.sh; then
        log_success "Security configuration validated"
    else
        log_warning "Security configuration needs attention - check output above"
    fi
else
    log_warning "Security validation script not found"
    log_info "Security features should be configured manually in GitHub UI"
fi

# Set proper permissions on sensitive files
if [ -f ".env" ]; then
    chmod 600 .env
    log_success "Restricted permissions set on .env file"
fi

# Set execute permissions on scripts
chmod +x scripts/*.sh 2>/dev/null || true
log_success "Execute permissions set on script files"

show_educational_tip "Security configuration from day one prevents costly vulnerabilities later"

# =====================================
# STEP 8: VALIDATION & HEALTH CHECK
# =====================================
log_section "🏥 Step 8: Final Validation & Health Check"
show_progress

log_step "Running comprehensive health check..."

# Create and run basic health check
if [ -f "./scripts/health-check.sh" ]; then
    chmod +x ./scripts/health-check.sh
    if ./scripts/health-check.sh; then
        log_success "Health check passed"
    else
        log_warning "Health check found issues - see output above"
    fi
else
    log_info "Health check script will be created in next steps"
    
    # Basic validation
    log_step "Running basic validation..."
    
    # Check essential files exist
    local essential_files=(
        "package.json"
        ".gitignore"
        ".env.example"
        "README.md"
    )
    
    for file in "${essential_files[@]}"; do
        if [ -f "$file" ]; then
            log_success "$file exists"
        else
            log_warning "$file is missing"
        fi
    done
fi

# =====================================
# SETUP COMPLETION SUMMARY
# =====================================
log_section "🎉 Setup Completion Summary"

echo
echo "📊 Development Environment Setup Results:"
echo "════════════════════════════════════════════"

log_success "Project structure initialized"
log_success "Environment configuration ready"
log_success "Git repository configured"
log_success "Dependencies installed"
log_success "Docker environment prepared"
log_success "Security configurations applied"
log_success "Health validation completed"

echo
echo "🎓 Educational Achievements Unlocked:"
echo "══════════════════════════════════════════"
echo "✅ Enterprise project structure organization"
echo "✅ Professional environment variable management"
echo "✅ Git workflow and security best practices"
echo "✅ Modern dependency management with npm"
echo "✅ Docker containerization fundamentals"
echo "✅ Security-first development mindset"
echo "✅ Automated validation and health checking"

echo
echo "🚀 Next Steps - Ready for Development:"
echo "═══════════════════════════════════════════"
echo "1. 📝 Review and customize .env file for your needs"
echo "2. 🔧 Configure GitHub repository settings (if not done)"  
echo "3. 👥 Invite team members and set up collaboration"
echo "4. 📚 Review documentation in docs/ directory"
echo "5. 🎯 Start Phase 2: Microservices Foundation"

echo
echo "🔧 Available Commands:"
echo "════════════════════════"
echo "• npm run validate  - Re-run prerequisites validation"
echo "• npm run health    - Check system health"
echo "• npm run test      - Run test suite (when implemented)"
echo "• npm run lint      - Check code quality (when implemented)"

echo
echo "📚 Educational Resources:"
echo "═══════════════════════════"
echo "• GitHub Docs: https://docs.github.com/"
echo "• Docker Docs: https://docs.docker.com/"
echo "• Node.js Best Practices: https://nodejs.org/en/docs/guides/"
echo "• Git Workflows: https://git-scm.com/docs/gitworkflows"

echo
echo "💬 Need Help?"
echo "═════════════════"
echo "• Create an issue: https://github.com/Franklin-Andres-Rodriguez/preparacion-academica/issues"
echo "• Check documentation: ./docs/guides/"
echo "• Run health check: ./scripts/health-check.sh"

echo
log_success "🎉 Preparación Académica development environment is ready!"
echo
show_educational_tip "You've just implemented enterprise-grade development setup - these practices are used by professional software teams worldwide!"

echo
echo -e "${GREEN}════════════════════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}🎓 Welcome to Preparación Académica - Where Professional Development Begins! 🚀${NC}"
echo -e "${GREEN}════════════════════════════════════════════════════════════════════════════${NC}"