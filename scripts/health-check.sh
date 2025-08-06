#!/bin/bash
# scripts/health-check.sh
# Comprehensive system health monitoring para Preparación Académica
# Educational Note: Proactive health monitoring prevents issues before they impact users

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
    echo "════════════════════════════════════════════════════════════════════════"
    echo "  $1"
    echo "════════════════════════════════════════════════════════════════════════"
    echo -e "${NC}"
}

log_section() {
    echo
    echo -e "${PURPLE}🏥 $1${NC}"
    echo "────────────────────────────────────────────────────────────────────────"
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

# Health metrics tracking
HEALTHY_CHECKS=0
WARNING_CHECKS=0
CRITICAL_CHECKS=0
TOTAL_CHECKS=0

# Function to track health results
track_health() {
    local status=$1
    local component=$2
    
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    
    case $status in
        "healthy")
            HEALTHY_CHECKS=$((HEALTHY_CHECKS + 1))
            log_success "$component is healthy"
            ;;
        "warning")
            WARNING_CHECKS=$((WARNING_CHECKS + 1))
            log_warning "$component has warnings"
            ;;
        "critical")
            CRITICAL_CHECKS=$((CRITICAL_CHECKS + 1))
            log_error "$component is critical"
            ;;
    esac
}

# Header with educational context
log_header "🎓 Preparación Académica - System Health Check"
echo
log_info "Monitoring system health following DevOps best practices"
show_educational_tip "Proactive monitoring detects issues before they impact users or productivity"
echo

# Get current timestamp
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
log_info "Health check started at: $TIMESTAMP"

# =====================================
# 1. SYSTEM RESOURCES HEALTH
# =====================================
log_section "💾 System Resources Health Check"

check_system_resources() {
    echo "Checking system resource utilization..."
    
    # CPU Usage (if available)
    if command -v top &> /dev/null; then
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS
            CPU_USAGE=$(top -l 1 -s 0 | grep "CPU usage" | awk '{print $3}' | sed 's/%//')
        else
            # Linux
            CPU_USAGE=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | sed 's/%us,//')
        fi
        
        if [ -n "$CPU_USAGE" ]; then
            CPU_NUM=$(echo $CPU_USAGE | cut -d'.' -f1)
            if [ "$CPU_NUM" -lt 80 ]; then
                track_health "healthy" "CPU Usage ($CPU_USAGE%)"
            elif [ "$CPU_NUM" -lt 95 ]; then
                track_health "warning" "CPU Usage ($CPU_USAGE%)"
            else
                track_health "critical" "CPU Usage ($CPU_USAGE%)"
            fi
        else
            log_info "CPU usage monitoring not available"
        fi
    fi
    
    # Memory Usage
    echo
    if command -v free &> /dev/null; then
        # Linux
        MEMORY_INFO=$(free -m)
        MEMORY_USED=$(echo "$MEMORY_INFO" | awk 'NR==2{printf "%.0f", $3*100/$2}')
        MEMORY_AVAILABLE=$(echo "$MEMORY_INFO" | awk 'NR==2{printf "%.0f", ($2-$3)*100/$2}')
        
        echo "Memory usage: ${MEMORY_USED}% used, ${MEMORY_AVAILABLE}% available"
        
        if [ "$MEMORY_USED" -lt 80 ]; then
            track_health "healthy" "Memory Usage (${MEMORY_USED}%)"
        elif [ "$MEMORY_USED" -lt 95 ]; then
            track_health "warning" "Memory Usage (${MEMORY_USED}%)"
        else
            track_health "critical" "Memory Usage (${MEMORY_USED}%)"
        fi
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        MEMORY_PRESSURE=$(memory_pressure | grep "System-wide memory free percentage" | awk '{print $5}' | sed 's/%//')
        if [ -n "$MEMORY_PRESSURE" ]; then
            if [ "$MEMORY_PRESSURE" -gt 20 ]; then
                track_health "healthy" "Memory Pressure (${MEMORY_PRESSURE}% free)"
            elif [ "$MEMORY_PRESSURE" -gt 5 ]; then
                track_health "warning" "Memory Pressure (${MEMORY_PRESSURE}% free)"
            else
                track_health "critical" "Memory Pressure (${MEMORY_PRESSURE}% free)"
            fi
        else
            log_info "Memory pressure monitoring not available"
        fi
    fi
    
    # Disk Space
    echo
    echo "Checking disk space..."
    if command -v df &> /dev/null; then
        DISK_USAGE=$(df -h . | awk 'NR==2 {print $5}' | sed 's/%//')
        DISK_AVAILABLE=$(df -h . | awk 'NR==2 {print $4}')
        
        echo "Disk usage: ${DISK_USAGE}% used, ${DISK_AVAILABLE} available"
        
        if [ "$DISK_USAGE" -lt 80 ]; then
            track_health "healthy" "Disk Space (${DISK_USAGE}% used)"
        elif [ "$DISK_USAGE" -lt 95 ]; then
            track_health "warning" "Disk Space (${DISK_USAGE}% used)"
        else
            track_health "critical" "Disk Space (${DISK_USAGE}% used)"
        fi
    fi
}

check_system_resources

show_educational_tip "Resource monitoring prevents performance issues and system crashes"

# =====================================
# 2. DEVELOPMENT TOOLS HEALTH
# =====================================
log_section "🔧 Development Tools Health Check"

check_development_tools() {
    echo "Verifying development tool availability and versions..."
    
    # Node.js Health
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        echo "Node.js version: $NODE_VERSION"
        
        # Check if version is supported
        NODE_MAJOR=$(echo $NODE_VERSION | cut -d'.' -f1 | sed 's/v//')
        if [ "$NODE_MAJOR" -ge 18 ]; then
            track_health "healthy" "Node.js ($NODE_VERSION)"
        elif [ "$NODE_MAJOR" -ge 16 ]; then
            track_health "warning" "Node.js ($NODE_VERSION - consider upgrading)"
        else
            track_health "critical" "Node.js ($NODE_VERSION - upgrade required)"
        fi
    else
        track_health "critical" "Node.js (not installed)"
    fi
    
    # npm Health
    echo
    if command -v npm &> /dev/null; then
        NPM_VERSION=$(npm --version)
        echo "npm version: $NPM_VERSION"
        track_health "healthy" "npm ($NPM_VERSION)"
        
        # Check npm configuration
        if npm config get registry > /dev/null 2>&1; then
            NPM_REGISTRY=$(npm config get registry)
            echo "npm registry: $NPM_REGISTRY"
            track_health "healthy" "npm Registry"
        else
            track_health "warning" "npm Registry (configuration issue)"
        fi
    else
        track_health "critical" "npm (not installed)"
    fi
    
    # Git Health
    echo
    if command -v git &> /dev/null; then
        GIT_VERSION=$(git --version)
        echo "Git version: $GIT_VERSION"
        track_health "healthy" "Git ($GIT_VERSION)"
        
        # Check Git configuration
        if git config user.name &> /dev/null && git config user.email &> /dev/null; then
            track_health "healthy" "Git Configuration"
        else
            track_health "warning" "Git Configuration (incomplete user setup)"
        fi
    else
        track_health "critical" "Git (not installed)"
    fi
    
    # Docker Health (optional)
    echo
    if command -v docker &> /dev/null; then
        DOCKER_VERSION=$(docker --version)
        echo "Docker version: $DOCKER_VERSION"
        
        if docker info > /dev/null 2>&1; then
            track_health "healthy" "Docker ($DOCKER_VERSION)"
        else
            track_health "warning" "Docker (daemon not running)"
        fi
    else
        log_info "Docker not installed (optional for Phase 1)"
    fi
}

check_development_tools

show_educational_tip "Tool health monitoring ensures development environment consistency"

# =====================================
# 3. PROJECT CONFIGURATION HEALTH
# =====================================
log_section "📋 Project Configuration Health Check"

check_project_config() {
    echo "Validating project configuration files..."
    
    # package.json Health
    if [ -f "package.json" ]; then
        if node -e "JSON.parse(require('fs').readFileSync('package.json', 'utf8'))" 2>/dev/null; then
            track_health "healthy" "package.json (valid JSON)"
        else
            track_health "critical" "package.json (invalid JSON)"
        fi
        
        # Check for essential scripts
        if grep -q '"scripts"' package.json; then
            track_health "healthy" "package.json scripts section"
        else
            track_health "warning" "package.json (missing scripts section)"
        fi
    else
        track_health "critical" "package.json (missing)"
    fi
    
    # .gitignore Health
    echo
    if [ -f ".gitignore" ]; then
        # Check for essential entries
        local essential_ignores=("node_modules" ".env" "*.log")
        local missing_ignores=()
        
        for ignore in "${essential_ignores[@]}"; do
            if ! grep -q "$ignore" .gitignore; then
                missing_ignores+=("$ignore")
            fi
        done
        
        if [ ${#missing_ignores[@]} -eq 0 ]; then
            track_health "healthy" ".gitignore (comprehensive)"
        else
            track_health "warning" ".gitignore (missing: ${missing_ignores[*]})"
        fi
    else
        track_health "critical" ".gitignore (missing)"
    fi
    
    # Environment Configuration Health
    echo
    if [ -f ".env.example" ]; then
        track_health "healthy" ".env.example (template available)"
    else
        track_health "warning" ".env.example (missing template)"
    fi
    
    if [ -f ".env" ]; then
        # Check .env permissions
        if [[ "$OSTYPE" != "msys" ]]; then
            ENV_PERMS=$(stat -c "%a" .env 2>/dev/null || stat -f "%A" .env 2>/dev/null || echo "unknown")
            if [ "$ENV_PERMS" = "600" ] || [ "$ENV_PERMS" = "-rw-------" ]; then
                track_health "healthy" ".env permissions (secure)"
            else
                track_health "warning" ".env permissions (should be 600)"
            fi
        fi
        
        # Check if .env is properly ignored
        if git check-ignore .env &> /dev/null; then
            track_health "healthy" ".env (properly ignored by Git)"
        else
            track_health "critical" ".env (NOT ignored by Git - SECURITY RISK!)"
        fi
    else
        log_info ".env file not present (create from .env.example if needed)"
    fi
}

check_project_config

show_educational_tip "Proper configuration prevents deployment issues and security vulnerabilities"

# =====================================
# 4. REPOSITORY HEALTH
# =====================================
log_section "📚 Repository Health Check"

check_repository_health() {
    echo "Checking Git repository status..."
    
    # Git Repository Status
    if [ -d ".git" ]; then
        track_health "healthy" "Git Repository (initialized)"
        
        # Check for uncommitted changes
        if git diff --quiet && git diff --staged --quiet; then
            track_health "healthy" "Working Directory (clean)"
        else
            track_health "warning" "Working Directory (has uncommitted changes)"
        fi
        
        # Check for untracked files
        if [ -z "$(git ls-files --others --exclude-standard)" ]; then
            track_health "healthy" "Untracked Files (none)"
        else
            UNTRACKED_COUNT=$(git ls-files --others --exclude-standard | wc -l)
            track_health "warning" "Untracked Files ($UNTRACKED_COUNT files)"
        fi
        
        # Check remote configuration
        if git remote -v | grep -q "origin"; then
            REMOTE_URL=$(git remote get-url origin)
            track_health "healthy" "Git Remote (configured: $REMOTE_URL)"
        else
            track_health "warning" "Git Remote (not configured)"
        fi
    else
        track_health "critical" "Git Repository (not initialized)"
    fi
    
    # GitHub Configuration Health
    echo
    if [ -d ".github" ]; then
        track_health "healthy" "GitHub Configuration Directory"
        
        # Check for essential GitHub files
        local github_files=(
            ".github/dependabot.yml"
            ".github/workflows"
            ".github/ISSUE_TEMPLATE"
        )
        
        for file in "${github_files[@]}"; do
            if [ -e "$file" ]; then
                track_health "healthy" "GitHub Config: $(basename $file)"
            else
                track_health "warning" "GitHub Config: $(basename $file) missing"
            fi
        done
    else
        track_health "warning" "GitHub Configuration (directory missing)"
    fi
}

check_repository_health

show_educational_tip "Repository health ensures proper version control and collaboration workflows"

# =====================================
# 5. SECURITY HEALTH CHECK
# =====================================
log_section "🔒 Security Health Check"

check_security_health() {
    echo "Performing security health assessment..."
    
    # File Permission Security
    local sensitive_files=(".env" "package.json" "scripts/*.sh")
    
    for pattern in "${sensitive_files[@]}"; do
        for file in $pattern; do
            if [ -f "$file" ]; then
                if [[ "$file" == ".env" ]]; then
                    # .env should be restrictive
                    if [[ "$OSTYPE" != "msys" ]]; then
                        PERMS=$(stat -c "%a" "$file" 2>/dev/null || stat -f "%A" "$file" 2>/dev/null || echo "unknown")
                        if [ "$PERMS" = "600" ] || [ "$PERMS" = "-rw-------" ]; then
                            track_health "healthy" "File Permissions: $file"
                        else
                            track_health "warning" "File Permissions: $file (should be 600)"
                        fi
                    fi
                elif [[ "$file" == scripts/*.sh ]]; then
                    # Scripts should be executable
                    if [ -x "$file" ]; then
                        track_health "healthy" "Script Executable: $(basename $file)"
                    else
                        track_health "warning" "Script Not Executable: $(basename $file)"
                    fi
                fi
            fi
        done
    done
    
    # Check for potential security issues
    echo
    echo "Scanning for security vulnerabilities..."
    
    # Check for hardcoded credentials patterns
    local found_issues=false
    local security_patterns=(
        "password\s*=\s*['\"][^'\"]+['\"]"
        "secret\s*=\s*['\"][^'\"]+['\"]"
        "api[_-]?key\s*=\s*['\"][^'\"]+['\"]"
    )
    
    for pattern in "${security_patterns[@]}"; do
        if git ls-files | xargs grep -l -i -E "$pattern" 2>/dev/null | head -1 | grep -q "."; then
            track_health "critical" "Security: Potential hardcoded credentials found"
            found_issues=true
            break
        fi
    done
    
    if [ "$found_issues" = false ]; then
        track_health "healthy" "Security: No obvious credential leaks detected"
    fi
    
    # npm audit (if available)
    echo
    if [ -f "package.json" ] && command -v npm &> /dev/null; then
        echo "Running npm security audit..."
        if npm audit --audit-level=critical > /dev/null 2>&1; then
            track_health "healthy" "npm Security Audit (no critical vulnerabilities)"
        else
            track_health "warning" "npm Security Audit (vulnerabilities found)"
        fi
    fi
}

check_security_health

show_educational_tip "Regular security health checks prevent vulnerabilities from reaching production"

# =====================================
# 6. PERFORMANCE HEALTH CHECK
# =====================================
log_section "⚡ Performance Health Check"

check_performance_health() {
    echo "Assessing system performance characteristics..."
    
    # Node.js Performance
    if command -v node &> /dev/null; then
        echo "Testing Node.js startup time..."
        START_TIME=$(date +%s%N)
        node -e "console.log('Node.js ready')" > /dev/null
        END_TIME=$(date +%s%N)
        STARTUP_TIME=$(( (END_TIME - START_TIME) / 1000000 ))
        
        if [ "$STARTUP_TIME" -lt 100 ]; then
            track_health "healthy" "Node.js Startup Time (${STARTUP_TIME}ms)"
        elif [ "$STARTUP_TIME" -lt 500 ]; then
            track_health "warning" "Node.js Startup Time (${STARTUP_TIME}ms)"
        else
            track_health "critical" "Node.js Startup Time (${STARTUP_TIME}ms - very slow)"
        fi
    fi
    
    # File System Performance
    echo
    echo "Testing file system responsiveness..."
    START_TIME=$(date +%s%N)
    ls -la > /dev/null 2>&1
    END_TIME=$(date +%s%N)
    FS_TIME=$(( (END_TIME - START_TIME) / 1000000 ))
    
    if [ "$FS_TIME" -lt 50 ]; then
        track_health "healthy" "File System Response (${FS_TIME}ms)"
    elif [ "$FS_TIME" -lt 200 ]; then
        track_health "warning" "File System Response (${FS_TIME}ms)"
    else
        track_health "critical" "File System Response (${FS_TIME}ms - very slow)"
    fi
    
    # Network Connectivity (basic)
    echo
    echo "Testing network connectivity..."
    if ping -c 1 8.8.8.8 > /dev/null 2>&1; then
        track_health "healthy" "Network Connectivity (internet accessible)"
    else
        track_health "warning" "Network Connectivity (limited or no internet)"
    fi
}

check_performance_health

show_educational_tip "Performance monitoring identifies bottlenecks before they impact productivity"

# =====================================
# 7. FINAL HEALTH SUMMARY
# =====================================
log_section "📊 Health Check Summary & Recommendations"

# Calculate health percentages
if [ $TOTAL_CHECKS -gt 0 ]; then
    HEALTHY_PERCENT=$((HEALTHY_CHECKS * 100 / TOTAL_CHECKS))
    WARNING_PERCENT=$((WARNING_CHECKS * 100 / TOTAL_CHECKS))
    CRITICAL_PERCENT=$((CRITICAL_CHECKS * 100 / TOTAL_CHECKS))
else
    HEALTHY_PERCENT=0
    WARNING_PERCENT=0
    CRITICAL_PERCENT=0
fi

echo "🎯 Health Check Results Summary:"
echo "═══════════════════════════════════"
echo "Total Checks: $TOTAL_CHECKS"
echo "Healthy: $HEALTHY_CHECKS ($HEALTHY_PERCENT%)"
echo "Warnings: $WARNING_CHECKS ($WARNING_PERCENT%)"
echo "Critical: $CRITICAL_CHECKS ($CRITICAL_PERCENT%)"
echo

# Overall Health Assessment
echo "🏥 Overall System Health:"
echo "═══════════════════════════"

if [ $CRITICAL_CHECKS -eq 0 ] && [ $WARNING_CHECKS -eq 0 ]; then
    echo -e "${GREEN}🌟 Excellent Health! System is operating optimally${NC}"
    echo -e "${GREEN}🏆 Health Grade: A+ (All systems green)${NC}"
    OVERALL_STATUS="excellent"
elif [ $CRITICAL_CHECKS -eq 0 ]; then
    echo -e "${YELLOW}⭐ Good Health! Minor issues detected${NC}"
    echo -e "${YELLOW}🥈 Health Grade: B+ (Minor attention needed)${NC}"
    OVERALL_STATUS="good"
elif [ $CRITICAL_CHECKS -le 2 ]; then
    echo -e "${YELLOW}📊 Fair Health! Some issues need attention${NC}"
    echo -e "${YELLOW}🥉 Health Grade: C+ (Action recommended)${NC}"
    OVERALL_STATUS="fair"
else
    echo -e "${RED}⚠️  Poor Health! Critical issues detected${NC}"
    echo -e "${RED}❌ Health Grade: D (Immediate action required)${NC}"
    OVERALL_STATUS="poor"
fi

echo
echo "🔧 Health Recommendations:"
echo "════════════════════════════"

if [ $CRITICAL_CHECKS -gt 0 ]; then
    echo "🔴 Critical Actions Required:"
    echo "   • Address all critical issues immediately"
    echo "   • Review error messages and fix root causes"
    echo "   • Re-run health check after fixes"
    echo
fi

if [ $WARNING_CHECKS -gt 0 ]; then
    echo "🟡 Recommended Improvements:"
    echo "   • Address warning issues when convenient"
    echo "   • Consider upgrading tools and configurations"
    echo "   • Review best practices documentation"
    echo
fi

echo "📈 Proactive Maintenance:"
echo "   • Run health checks regularly (daily/weekly)"
echo "   • Monitor system resources during development"
echo "   • Keep tools and dependencies updated"
echo "   • Review security configurations periodically"

echo
echo "🎓 Educational Value Achieved:"
echo "════════════════════════════════"
echo "✅ Systematic health monitoring methodology"
echo "✅ Proactive issue detection and prevention"
echo "✅ Professional DevOps monitoring practices"
echo "✅ Security-first operational mindset"
echo "✅ Performance-aware development habits"

echo
echo "📅 Health Check Report:"
echo "═════════════════════════"
echo "Timestamp: $TIMESTAMP"
echo "Duration: $(date '+%Y-%m-%d %H:%M:%S') (completed)"
echo "Status: $OVERALL_STATUS"
echo "Next Check: $(date -d '+1 day' '+%Y-%m-%d %H:%M:%S' 2>/dev/null || date -v '+1d' '+%Y-%m-%d %H:%M:%S' 2>/dev/null || echo 'Schedule manually')"

echo
if [ $CRITICAL_CHECKS -eq 0 ]; then
    echo -e "${GREEN}🎉 Health Check Complete - System Ready for Development! 🚀${NC}"
    exit 0
else
    echo -e "${RED}⚠️  Health Check Complete - Critical Issues Need Attention 🔧${NC}"
    exit 1
fi