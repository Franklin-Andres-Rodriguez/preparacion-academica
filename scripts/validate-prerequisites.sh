#!/bin/bash
# scripts/validate-prerequisites.sh
# Validación comprehensiva de prerequisites para Preparación Académica
# Educational Note: Validación temprana previene hours de debugging por environment issues

set -e

# Colors para output profesional
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Logging functions educativas
log_header() {
    echo -e "${BLUE}"
    echo "════════════════════════════════════════════════════════════════"
    echo "  $1"
    echo "════════════════════════════════════════════════════════════════"
    echo -e "${NC}"
}

log_section() {
    echo -e "${PURPLE}📋 $1${NC}"
    echo "────────────────────────────────────────────────────────────────"
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

# Educational tip function
show_educational_tip() {
    echo -e "${BLUE}💡 Educational Tip: $1${NC}"
}

# Header educativo
log_header "🎓 Preparación Académica - Development Prerequisites Validation"
echo
log_info "This validation follows professional development standards to ensure consistent, error-free setup"
show_educational_tip "Professional teams validate environments before development to prevent 'works on my machine' issues"
echo

ERRORS=0
WARNINGS=0

# Function para incrementar contadores
increment_error() {
    ERRORS=$((ERRORS + 1))
}

increment_warning() {
    WARNINGS=$((WARNINGS + 1))
}

# =====================================
# 1. OPERATING SYSTEM DETECTION
# =====================================
log_section "🖥️  Operating System Analysis"

detect_os() {
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        OS="Linux"
        DISTRO=$(lsb_release -si 2>/dev/null || echo "Unknown")
        VERSION=$(lsb_release -sr 2>/dev/null || echo "Unknown")
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        OS="macOS"
        VERSION=$(sw_vers -productVersion)
        DISTRO="macOS"
    elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
        OS="Windows"
        VERSION="Unknown"
        DISTRO="Windows"
    else
        OS="Unknown"
        VERSION="Unknown"
        DISTRO="Unknown"
    fi

    log_success "Operating System: $OS $VERSION"
    
    if [[ "$OS" == "Unknown" ]]; then
        log_warning "Unknown operating system detected - some validations may not work correctly"
        increment_warning
    fi
}

detect_os

# =====================================
# 2. NODE.JS VALIDATION
# =====================================
log_section "📗 Node.js Environment Validation"

validate_nodejs() {
    if ! command -v node &> /dev/null; then
        log_error "Node.js is not installed"
        echo "   📥 Installation: https://nodejs.org/ (Download LTS version)"
        echo "   💡 Recommendation: Use nvm for version management"
        increment_error
        return 1
    fi

    NODE_VERSION=$(node -v | sed 's/v//')
    REQUIRED_NODE="18.0.0"
    
    # Función para comparar versions usando node
    if node -e "process.exit(require('semver').gte('$NODE_VERSION', '$REQUIRED_NODE') ? 0 : 1)" 2>/dev/null; then
        log_success "Node.js $NODE_VERSION (meets requirement: ≥$REQUIRED_NODE)"
    else
        # Fallback sin semver
        MAJOR_VERSION=$(echo $NODE_VERSION | cut -d. -f1)
        if [ "$MAJOR_VERSION" -ge 18 ]; then
            log_success "Node.js $NODE_VERSION (meets requirement: ≥$REQUIRED_NODE)"
        else
            log_error "Node.js version $NODE_VERSION is below required $REQUIRED_NODE"
            echo "   📥 Upgrade: https://nodejs.org/ or use nvm: nvm install 18"
            increment_error
            return 1
        fi
    fi

    # Validate npm
    if ! command -v npm &> /dev/null; then
        log_error "npm is not installed (should come with Node.js)"
        increment_error
        return 1
    fi

    NPM_VERSION=$(npm -v)
    log_success "npm $NPM_VERSION is available"

    # Check for common Node.js issues
    if [ -n "$NVM_DIR" ]; then
        log_info "nvm detected - good for version management"
    fi

    return 0
}

validate_nodejs
echo

show_educational_tip "Node.js ≥18 includes modern JavaScript features and security updates essential for professional development"

# =====================================
# 3. DOCKER VALIDATION
# =====================================
log_section "🐳 Docker Environment Validation"

validate_docker() {
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed"
        echo "   📥 Installation: https://docs.docker.com/get-docker/"
        if [[ "$OS" == "macOS" ]] || [[ "$OS" == "Windows" ]]; then
            echo "   💡 Recommendation: Install Docker Desktop"
        else
            echo "   💡 Recommendation: Install Docker Engine + Docker Compose"
        fi
        increment_error
        return 1
    fi

    DOCKER_VERSION=$(docker --version | cut -d' ' -f3 | sed 's/,//')
    log_success "Docker $DOCKER_VERSION is installed"

    # Check if Docker daemon is running
    if ! docker info &> /dev/null; then
        log_error "Docker daemon is not running"
        echo "   🔧 Solution: Start Docker Desktop or run 'sudo systemctl start docker'"
        echo "   💡 Tip: Docker Desktop must be running for containers to work"
        increment_error
        return 1
    fi

    log_success "Docker daemon is running"

    # Check Docker permissions (Linux)
    if [[ "$OS" == "Linux" ]]; then
        if docker run --rm hello-world &> /dev/null; then
            log_success "Docker permissions configured correctly"
        else
            log_warning "Docker may require sudo (consider adding user to docker group)"
            echo "   🔧 Solution: sudo usermod -aG docker \$USER && newgrp docker"
            increment_warning
        fi
    fi

    return 0
}

validate_docker
echo

show_educational_tip "Docker enables consistent development environments across different machines - critical for team collaboration"

# =====================================
# 4. DOCKER COMPOSE VALIDATION
# =====================================
log_section "📦 Docker Compose Validation"

validate_docker_compose() {
    # Check for docker-compose (standalone) or docker compose (plugin)
    if command -v docker-compose &> /dev/null; then
        COMPOSE_VERSION=$(docker-compose --version | cut -d' ' -f3 | sed 's/,//')
        COMPOSE_COMMAND="docker-compose"
        log_success "Docker Compose $COMPOSE_VERSION (standalone) is available"
    elif docker compose version &> /dev/null 2>&1; then
        COMPOSE_VERSION=$(docker compose version --short)
        COMPOSE_COMMAND="docker compose"
        log_success "Docker Compose $COMPOSE_VERSION (plugin) is available"
    else
        log_error "Docker Compose is not installed"
        echo "   📥 Installation: https://docs.docker.com/compose/install/"
        if [[ "$OS" == "macOS" ]] || [[ "$OS" == "Windows" ]]; then
            echo "   💡 Note: Docker Desktop includes Docker Compose"
        fi
        increment_error
        return 1
    fi

    # Test basic functionality
    if echo "version: '3.8'\nservices:\n  test:\n    image: hello-world" | $COMPOSE_COMMAND -f - config &> /dev/null; then
        log_success "Docker Compose configuration validation works"
    else
        log_warning "Docker Compose configuration validation failed"
        increment_warning
    fi

    return 0
}

validate_docker_compose
echo

show_educational_tip "Docker Compose manages multi-container applications - essential for microservices development"

# =====================================
# 5. GIT VALIDATION
# =====================================
log_section "📚 Git Configuration Validation"

validate_git() {
    if ! command -v git &> /dev/null; then
        log_error "Git is not installed"
        echo "   📥 Installation: https://git-scm.com/"
        increment_error
        return 1
    fi

    GIT_VERSION=$(git --version | cut -d' ' -f3)
    log_success "Git $GIT_VERSION is available"

    # Check Git configuration
    if git config user.name &> /dev/null && git config user.email &> /dev/null; then
        GIT_NAME=$(git config user.name)
        GIT_EMAIL=$(git config user.email)
        log_success "Git configuration: $GIT_NAME <$GIT_EMAIL>"
    else
        log_warning "Git user configuration incomplete"
        echo "   🔧 Setup: git config --global user.name 'Your Name'"
        echo "   🔧 Setup: git config --global user.email 'your.email@example.com'"
        increment_warning
    fi

    # Check for SSH key (optional but recommended)
    if [ -f ~/.ssh/id_rsa ] || [ -f ~/.ssh/id_ed25519 ]; then
        log_success "SSH key detected (good for secure Git operations)"
    else
        log_info "No SSH key detected (HTTPS Git operations will work)"
        echo "   💡 Optional: Generate SSH key for easier authentication"
    fi

    return 0
}

validate_git
echo

show_educational_tip "Proper Git configuration ensures accurate commit attribution and smooth collaboration"

# =====================================
# 6. PORT AVAILABILITY CHECK
# =====================================
log_section "🌐 Network Port Availability"

check_port() {
    local port=$1
    local service=$2
    
    if command -v lsof &> /dev/null; then
        if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
            local process=$(lsof -Pi :$port -sTCP:LISTEN -t | head -1)
            local process_name=$(ps -p $process -o comm= 2>/dev/null || echo "unknown")
            log_warning "Port $port is in use by $process_name (needed for $service)"
            echo "   🔧 Solution: Stop the service using port $port or change configuration"
            increment_warning
            return 1
        else
            log_success "Port $port is available for $service"
            return 0
        fi
    elif command -v netstat &> /dev/null; then
        if netstat -tuln | grep :$port &> /dev/null; then
            log_warning "Port $port appears to be in use (needed for $service)"
            increment_warning
            return 1
        else
            log_success "Port $port appears available for $service"
            return 0
        fi
    else
        log_info "Cannot check port $port availability (netstat/lsof not available)"
        return 0
    fi
}

# Check required ports
check_port 3000 "Frontend Development Server"
check_port 8080 "API Gateway" 
check_port 5432 "PostgreSQL Database"
check_port 6379 "Redis Cache"
echo

show_educational_tip "Port conflicts cause mysterious connection errors - checking availability prevents debugging sessions"

# =====================================
# 7. SYSTEM RESOURCES CHECK
# =====================================
log_section "💾 System Resources Analysis"

check_system_resources() {
    # Check disk space
    if command -v df &> /dev/null; then
        if [[ "$OS" == "macOS" ]]; then
            AVAILABLE_SPACE=$(df -g . | awk 'NR==2 {print $4}' | sed 's/G//')
        else
            AVAILABLE_SPACE=$(df -BG . | awk 'NR==2 {print $4}' | sed 's/G//')
        fi
        
        if [ "$AVAILABLE_SPACE" -lt 5 ]; then
            log_warning "Low disk space: ${AVAILABLE_SPACE}GB available"
            echo "   💡 Recommendation: Free up space or consider external drive"
            echo "   🎯 Required: At least 5GB for Docker images and dependencies"
            increment_warning
        else
            log_success "Disk space: ${AVAILABLE_SPACE}GB available"
        fi
    fi

    # Check memory (Linux/macOS)
    if command -v free &> /dev/null; then
        AVAILABLE_MEMORY=$(free -g | awk 'NR==2{printf "%.0f", $7}')
        TOTAL_MEMORY=$(free -g | awk 'NR==2{printf "%.0f", $2}')
        
        if [ "$AVAILABLE_MEMORY" -lt 2 ]; then
            log_warning "Low available memory: ${AVAILABLE_MEMORY}GB (${TOTAL_MEMORY}GB total)"
            echo "   💡 Recommendation: Close unnecessary applications"
            echo "   🎯 Recommended: At least 2GB available for development"
            increment_warning
        else
            log_success "Available memory: ${AVAILABLE_MEMORY}GB (${TOTAL_MEMORY}GB total)"
        fi
    elif [[ "$OS" == "macOS" ]]; then
        TOTAL_MEMORY=$(system_profiler SPHardwareDataType | grep "Memory:" | awk '{print $2}')
        log_info "Total memory: ${TOTAL_MEMORY} (specific availability check not implemented for macOS)"
    fi
}

check_system_resources
echo

show_educational_tip "Resource constraints cause performance issues and failed builds - monitoring prevents frustration"

# =====================================
# 8. ADDITIONAL TOOLS CHECK
# =====================================
log_section "🔧 Additional Development Tools"

check_additional_tools() {
    # Check for code editor
    local editors=("code" "vim" "nano" "emacs" "subl")
    local found_editor=false
    
    for editor in "${editors[@]}"; do
        if command -v $editor &> /dev/null; then
            log_success "Code editor available: $editor"
            found_editor=true
            break
        fi
    done
    
    if [ "$found_editor" = false ]; then
        log_info "No common code editor detected"
        echo "   💡 Recommendation: Install VS Code, Vim, or your preferred editor"
    fi

    # Check for curl/wget
    if command -v curl &> /dev/null; then
        log_success "curl is available (useful for API testing)"
    elif command -v wget &> /dev/null; then
        log_success "wget is available (useful for downloads)"
    else
        log_info "Neither curl nor wget detected (may need for some scripts)"
    fi

    # Check for GitHub CLI (optional but useful)
    if command -v gh &> /dev/null; then
        GH_VERSION=$(gh --version | head -1 | cut -d' ' -f3)
        log_success "GitHub CLI $GH_VERSION is available"
    else
        log_info "GitHub CLI not detected (optional but recommended for GitHub workflows)"
        echo "   📥 Installation: https://cli.github.com/"
    fi
}

check_additional_tools
echo

show_educational_tip "Additional tools enhance productivity - GitHub CLI especially useful for repository management"

# =====================================
# 9. ENVIRONMENT VARIABLES CHECK
# =====================================
log_section "🔐 Environment Variables & Security"

check_environment() {
    # Check for common environment variables
    if [ -n "$EDITOR" ]; then
        log_success "Default editor: $EDITOR"
    else
        log_info "EDITOR environment variable not set"
        echo "   💡 Tip: Set EDITOR variable for better Git commit experience"
    fi

    # Check PATH configuration
    if echo $PATH | grep -q "/usr/local/bin"; then
        log_success "PATH includes /usr/local/bin"
    else
        log_info "PATH may not include standard local binary locations"
    fi

    # Security check - warn about dangerous practices
    if [ -f ".env" ] && grep -q "PASSWORD\|SECRET\|KEY" .env 2>/dev/null; then
        log_warning "Found .env file with potential secrets"
        echo "   🔒 Security: Ensure .env is in .gitignore and never committed"
    fi
}

check_environment
echo

show_educational_tip "Proper environment configuration and security practices prevent accidental credential exposure"

# =====================================
# 10. FINAL SUMMARY & RECOMMENDATIONS
# =====================================
log_section "📊 Validation Summary & Next Steps"

# Generate final report
echo "🎯 Prerequisites Validation Results:"
echo "─────────────────────────────────────"

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    log_success "Perfect! All prerequisites validated successfully"
    echo -e "${GREEN}🌟 Development Environment Grade: A+ (Enterprise Ready)${NC}"
    echo
    echo "✅ Ready for development! Run './scripts/dev-setup.sh' to configure the project"
elif [ $ERRORS -eq 0 ]; then
    log_success "Prerequisites met with $WARNINGS minor issues"
    echo -e "${YELLOW}⭐ Development Environment Grade: B+ (Good with Minor Issues)${NC}"
    echo
    echo "✅ Ready for development! Address warnings when convenient"
    echo "🚀 Next: Run './scripts/dev-setup.sh' to configure the project"
else
    log_error "$ERRORS critical issue(s) and $WARNINGS warning(s) found"
    echo -e "${RED}❌ Development Environment Grade: Incomplete${NC}"
    echo
    echo "🔧 Required Actions:"
    echo "   1. Fix the critical issues listed above"
    echo "   2. Re-run this validation script"
    echo "   3. Proceed with setup once all issues are resolved"
fi

echo
echo "📚 Educational Summary:"
echo "─────────────────────────"
echo "• Systematic validation prevents hours of debugging"
echo "• Professional teams automate environment checks"
echo "• Consistent environments reduce 'works on my machine' issues"
echo "• Security awareness protects credentials and code"

echo
echo "🔗 Helpful Resources:"
echo "───────────────────────"
echo "• Node.js: https://nodejs.org/"
echo "• Docker: https://docs.docker.com/get-docker/"
echo "• Git: https://git-scm.com/"
echo "• GitHub CLI: https://cli.github.com/"
echo "• VS Code: https://code.visualstudio.com/"

echo
if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}🎉 Ready to build amazing educational software! 🚀${NC}"
    exit 0
else
    echo -e "${RED}⚠️  Please resolve issues before continuing 🔧${NC}"
    exit 1
fi