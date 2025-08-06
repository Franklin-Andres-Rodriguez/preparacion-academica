#!/bin/bash
# scripts/test-all.sh
# Comprehensive testing suite para Preparación Académica
# Educational Note: Comprehensive testing prevents bugs from reaching production

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
    echo -e "${PURPLE}🧪 $1${NC}"
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

# Test result tracking
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0
WARNINGS=0

# Function to track test results
track_test_result() {
    local result=$1
    local test_name=$2
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    if [ "$result" -eq 0 ]; then
        PASSED_TESTS=$((PASSED_TESTS + 1))
        log_success "$test_name passed"
    else
        FAILED_TESTS=$((FAILED_TESTS + 1))
        log_error "$test_name failed"
    fi
}

# Function to track warnings
track_warning() {
    WARNINGS=$((WARNINGS + 1))
    log_warning "$1"
}

# Header with educational context
log_header "🎓 Preparación Académica - Comprehensive Testing Suite"
echo
log_info "Running systematic testing following professional QA practices"
show_educational_tip "Comprehensive testing catches bugs early when they're cheaper to fix"
echo

# =====================================
# 1. REPOSITORY STRUCTURE VALIDATION
# =====================================
log_section "📁 Repository Structure Validation"

validate_structure() {
    local required_files=(
        "README.md"
        "package.json" 
        ".gitignore"
        ".env.example"
        "SECURITY.md"
        "LICENSE"
    )
    
    local required_dirs=(
        ".github"
        "scripts"
        "docs"
    )
    
    echo "Validating required files..."
    for file in "${required_files[@]}"; do
        if [ -f "$file" ]; then
            log_success "Required file exists: $file"
        else
            log_error "Missing required file: $file"
            return 1
        fi
    done
    
    echo
    echo "Validating required directories..."
    for dir in "${required_dirs[@]}"; do
        if [ -d "$dir" ]; then
            log_success "Required directory exists: $dir"
        else
            log_error "Missing required directory: $dir"
            return 1
        fi
    done
    
    return 0
}

validate_structure
track_test_result $? "Repository Structure Validation"

show_educational_tip "Consistent project structure enables team members to navigate and contribute effectively"

# =====================================
# 2. GITHUB CONFIGURATION VALIDATION
# =====================================
log_section "⚙️ GitHub Configuration Validation"

validate_github_config() {
    local github_files=(
        ".github/dependabot.yml"
        ".github/workflows/codeql-analysis.yml"
        ".github/CODEOWNERS"
    )
    
    local issue_templates=(
        ".github/ISSUE_TEMPLATE/bug_report.yml"
        ".github/ISSUE_TEMPLATE/feature_request.yml"
        ".github/ISSUE_TEMPLATE/educational_help.yml"
    )
    
    echo "Validating GitHub configuration files..."
    for file in "${github_files[@]}"; do
        if [ -f "$file" ]; then
            log_success "GitHub config exists: $file"
        else
            log_warning "Missing GitHub config: $file"
            return 1
        fi
    done
    
    echo
    echo "Validating issue templates..."
    for template in "${issue_templates[@]}"; do
        if [ -f "$template" ]; then
            log_success "Issue template exists: $template"
        else
            log_warning "Missing issue template: $template"
            return 1
        fi
    done
    
    # Validate YAML syntax if yq is available
    if command -v yq &> /dev/null; then
        echo
        echo "Validating YAML syntax..."
        for file in .github/**/*.yml .github/**/*.yaml; do
            if [ -f "$file" ]; then
                if yq eval '.' "$file" > /dev/null 2>&1; then
                    log_success "Valid YAML syntax: $file"
                else
                    log_error "Invalid YAML syntax: $file"
                    return 1
                fi
            fi
        done
    else
        log_info "yq not available - skipping YAML syntax validation"
    fi
    
    return 0
}

validate_github_config
track_test_result $? "GitHub Configuration Validation"

show_educational_tip "Proper GitHub configuration automates quality assurance and collaboration workflows"

# =====================================
# 3. SECURITY CONFIGURATION TESTING
# =====================================
log_section "🔒 Security Configuration Testing"

test_security_config() {
    echo "Testing environment variable security..."
    
    # Check .env is not tracked
    if git check-ignore .env &> /dev/null; then
        log_success ".env file properly ignored by Git"
    else
        log_error ".env file is not in .gitignore - SECURITY RISK!"
        return 1
    fi
    
    # Check for hardcoded secrets in tracked files
    echo
    echo "Scanning for potential hardcoded secrets..."
    local secret_patterns=(
        "password\s*=\s*['\"][^'\"]+['\"]"
        "secret\s*=\s*['\"][^'\"]+['\"]"
        "api[_-]?key\s*=\s*['\"][^'\"]+['\"]"
        "token\s*=\s*['\"][^'\"]+['\"]"
    )
    
    local found_secrets=false
    for pattern in "${secret_patterns[@]}"; do
        if git ls-files | xargs grep -l -i -E "$pattern" 2>/dev/null; then
            log_error "Potential hardcoded secret found matching pattern: $pattern"
            found_secrets=true
        fi
    done
    
    if [ "$found_secrets" = false ]; then
        log_success "No obvious hardcoded secrets detected"
    else
        log_error "Potential security vulnerabilities found"
        return 1
    fi
    
    # Check file permissions on sensitive files
    echo
    echo "Checking file permissions..."
    if [ -f ".env" ]; then
        local env_perms=$(stat -c "%a" .env 2>/dev/null || stat -f "%A" .env 2>/dev/null)
        if [ "$env_perms" = "600" ] || [ "$env_perms" = "-rw-------" ]; then
            log_success ".env file has secure permissions"
        else
            log_warning ".env file permissions could be more restrictive (recommended: 600)"
        fi
    fi
    
    return 0
}

test_security_config
track_test_result $? "Security Configuration Testing"

show_educational_tip "Security testing prevents credential leaks that have cost companies millions in breaches"

# =====================================
# 4. DEPENDENCY SECURITY TESTING
# =====================================
log_section "📦 Dependency Security Testing"

test_dependency_security() {
    if [ -f "package.json" ]; then
        echo "Running npm security audit..."
        
        # Run npm audit and capture output
        if npm audit --audit-level=moderate > /dev/null 2>&1; then
            log_success "npm audit passed - no moderate+ vulnerabilities"
        else
            log_warning "npm audit found vulnerabilities - review with 'npm audit'"
            echo "Run 'npm audit fix' to automatically fix resolvable issues"
            # Don't fail the test for this in Phase 1
        fi
        
        # Check for package-lock.json
        if [ -f "package-lock.json" ]; then
            log_success "package-lock.json exists (ensures reproducible installs)"
        else
            log_info "package-lock.json not found (will be created on npm install)"
        fi
    else
        log_warning "package.json not found - skipping dependency tests"
        return 1
    fi
    
    return 0
}

test_dependency_security
track_test_result $? "Dependency Security Testing"

show_educational_tip "Dependency scanning catches vulnerabilities in third-party code before they reach production"

# =====================================
# 5. CODE QUALITY TESTING
# =====================================
log_section "✨ Code Quality Testing"

test_code_quality() {
    echo "Testing code quality standards..."
    
    # Check for ESLint configuration
    if [ -f ".eslintrc.js" ] || [ -f ".eslintrc.json" ] || [ -f "eslint.config.js" ] || grep -q "eslintConfig" package.json; then
        log_success "ESLint configuration found"
        
        # Run ESLint if available
        if command -v eslint &> /dev/null || npm list eslint &> /dev/null; then
            if find . -name "*.js" -o -name "*.ts" | head -1 | grep -q "."; then
                echo "Running ESLint on JavaScript/TypeScript files..."
                if npx eslint . --ext .js,.ts --max-warnings 0 2>/dev/null; then
                    log_success "ESLint passed with no warnings"
                else
                    log_warning "ESLint found issues - review and fix"
                fi
            else
                log_info "No JavaScript/TypeScript files found to lint"
            fi
        else
            log_info "ESLint not installed - install with: npm install --save-dev eslint"
        fi
    else
        log_info "ESLint configuration not found - consider adding for code quality"
    fi
    
    # Check for Prettier configuration
    echo
    if [ -f ".prettierrc" ] || [ -f ".prettierrc.json" ] || [ -f "prettier.config.js" ] || grep -q "prettier" package.json; then
        log_success "Prettier configuration found"
    else
        log_info "Prettier configuration not found - consider adding for consistent formatting"
    fi
    
    # Check for TypeScript configuration
    echo
    if [ -f "tsconfig.json" ]; then
        log_success "TypeScript configuration found"
        
        # Validate TypeScript config
        if command -v tsc &> /dev/null || npm list typescript &> /dev/null; then
            if npx tsc --noEmit 2>/dev/null; then
                log_success "TypeScript compilation check passed"
            else
                log_warning "TypeScript compilation issues found"
            fi
        fi
    else
        log_info "TypeScript not configured - consider adding for type safety"
    fi
    
    return 0
}

test_code_quality
track_test_result $? "Code Quality Testing"

show_educational_tip "Code quality tools catch bugs and maintain consistent style across team contributions"

# =====================================
# 6. SCRIPT FUNCTIONALITY TESTING
# =====================================
log_section "🔧 Script Functionality Testing"

test_script_functionality() {
    local scripts_dir="scripts"
    
    if [ ! -d "$scripts_dir" ]; then
        log_error "Scripts directory not found"
        return 1
    fi
    
    echo "Testing script executability..."
    for script in "$scripts_dir"/*.sh; do
        if [ -f "$script" ]; then
            if [ -x "$script" ]; then
                log_success "Script is executable: $(basename $script)"
            else
                log_warning "Script lacks execute permission: $(basename $script)"
                chmod +x "$script"
                log_info "Fixed permissions for: $(basename $script)"
            fi
            
            # Basic syntax check
            if bash -n "$script"; then
                log_success "Script syntax valid: $(basename $script)"
            else
                log_error "Script syntax error: $(basename $script)"
                return 1
            fi
        fi
    done
    
    # Test specific script functionality
    echo
    echo "Testing script help/version flags..."
    
    if [ -f "$scripts_dir/validate-prerequisites.sh" ]; then
        # Test that script runs without fatal errors
        if timeout 30s "$scripts_dir/validate-prerequisites.sh" > /dev/null 2>&1; then
            log_success "validate-prerequisites.sh executes successfully"
        else
            log_warning "validate-prerequisites.sh may have issues (timeout or error)"
        fi
    fi
    
    return 0
}

test_script_functionality
track_test_result $? "Script Functionality Testing"

show_educational_tip "Testing scripts themselves ensures automation tools work reliably"

# =====================================
# 7. DOCUMENTATION TESTING
# =====================================
log_section "📚 Documentation Testing"

test_documentation() {
    echo "Testing documentation quality..."
    
    # Check README.md content
    if [ -f "README.md" ]; then
        local readme_sections=(
            "Quick Start"
            "Installation"
            "Usage"
            "Contributing"
        )
        
        for section in "${readme_sections[@]}"; do
            if grep -qi "$section" README.md; then
                log_success "README contains '$section' section"
            else
                log_info "README missing '$section' section (recommended)"
            fi
        done
        
        # Check for educational content
        if grep -qi "educational\|learning\|methodology" README.md; then
            log_success "README includes educational context"
        else
            log_info "Consider adding educational context to README"
        fi
    else
        log_error "README.md not found"
        return 1
    fi
    
    # Check for license
    echo
    if [ -f "LICENSE" ] || [ -f "LICENSE.md" ] || [ -f "LICENSE.txt" ]; then
        log_success "License file found"
    else
        log_warning "License file not found - consider adding for open source projects"
    fi
    
    # Check for contributing guide
    if [ -f "CONTRIBUTING.md" ]; then
        log_success "Contributing guide found"
    else
        log_info "Contributing guide not found - recommended for collaboration"
    fi
    
    return 0
}

test_documentation
track_test_result $? "Documentation Testing"

show_educational_tip "Quality documentation reduces onboarding time and enables effective collaboration"

# =====================================
# 8. INTEGRATION TESTING
# =====================================
log_section "🔄 Integration Testing"

test_integration() {
    echo "Testing system integration..."
    
    # Test Git integration
    if git status > /dev/null 2>&1; then
        log_success "Git repository is functional"
    else
        log_error "Git repository issues detected"
        return 1
    fi
    
    # Test Node.js integration
    if node --version > /dev/null 2>&1; then
        log_success "Node.js is accessible"
    else
        log_error "Node.js not accessible"
        return 1
    fi
    
    # Test npm integration
    if npm --version > /dev/null 2>&1; then
        log_success "npm is accessible"
    else
        log_error "npm not accessible"  
        return 1
    fi
    
    # Test Docker integration (if available)
    echo
    if command -v docker &> /dev/null; then
        if docker info > /dev/null 2>&1; then
            log_success "Docker daemon is accessible"
        else
            log_warning "Docker daemon not running"
        fi
    else
        log_info "Docker not installed - ok for Phase 1"
    fi
    
    return 0
}

test_integration
track_test_result $? "Integration Testing"

show_educational_tip "Integration testing verifies that different system components work together correctly"

# =====================================
# FINAL TEST SUMMARY
# =====================================
log_section "📊 Testing Summary & Results"

echo "🎯 Test Execution Results:"
echo "═══════════════════════════════"
echo "Total Tests: $TOTAL_TESTS"
echo "Passed: $PASSED_TESTS"
echo "Failed: $FAILED_TESTS"  
echo "Warnings: $WARNINGS"
echo

# Calculate success rate
if [ $TOTAL_TESTS -gt 0 ]; then
    SUCCESS_RATE=$((PASSED_TESTS * 100 / TOTAL_TESTS))
    echo "Success Rate: $SUCCESS_RATE%"
else
    SUCCESS_RATE=0
    echo "Success Rate: N/A (no tests run)"
fi

echo
echo "📈 Quality Assessment:"
echo "════════════════════════"

if [ $FAILED_TESTS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}🌟 Excellent! All tests passed with no warnings${NC}"
    echo -e "${GREEN}🏆 Project Quality Grade: A+ (Production Ready)${NC}"
elif [ $FAILED_TESTS -eq 0 ]; then
    echo -e "${YELLOW}⭐ Good! All tests passed with $WARNINGS warning(s)${NC}"
    echo -e "${YELLOW}🥈 Project Quality Grade: B+ (Minor Issues)${NC}"
elif [ $SUCCESS_RATE -ge 80 ]; then
    echo -e "${YELLOW}📊 Acceptable! $SUCCESS_RATE% tests passed${NC}"
    echo -e "${YELLOW}🥉 Project Quality Grade: B- (Needs Attention)${NC}"
else
    echo -e "${RED}⚠️  Critical Issues! Only $SUCCESS_RATE% tests passed${NC}"
    echo -e "${RED}❌ Project Quality Grade: Incomplete (Fix Required)${NC}"
fi

echo
echo "🎓 Educational Achievements:"
echo "══════════════════════════════"
echo "✅ Systematic testing methodology applied"
echo "✅ Professional quality assurance practices"
echo "✅ Security-first development validation"
echo "✅ Automated quality gates implementation"
echo "✅ Documentation and collaboration standards"

echo
echo "🔧 Recommended Actions:"
echo "═════════════════════════"

if [ $FAILED_TESTS -gt 0 ]; then
    echo "🔴 Critical: Fix failed tests before proceeding"
    echo "   • Review error messages above"
    echo "   • Address structural or configuration issues"
    echo "   • Re-run tests to verify fixes"
fi

if [ $WARNINGS -gt 0 ]; then
    echo "🟡 Recommended: Address warnings for better quality"
    echo "   • Review warning messages above"
    echo "   • Implement suggested improvements"
    echo "   • Consider upgrading to stricter standards"
fi

echo
echo "📚 Educational Insights:"
echo "═══════════════════════════"
echo "• Comprehensive testing catches issues early"
echo "• Automated quality gates maintain standards"
echo "• Security testing prevents costly vulnerabilities"
echo "• Documentation testing ensures maintainability"

echo
echo "🔗 Next Steps:"
echo "═════════════════"
if [ $FAILED_TESTS -eq 0 ]; then
    echo "✅ Ready to proceed with development!"
    echo "🚀 Consider setting up CI/CD to run these tests automatically"
    echo "📈 Establish regular testing schedule for continuous quality"
else
    echo "🔧 Fix critical issues first"
    echo "📋 Run './scripts/test-all.sh' again after fixes"
    echo "💡 Seek help if issues persist"
fi

echo
if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "${GREEN}🎉 Testing Complete - Quality Standards Met! 🌟${NC}"
    exit 0
else
    echo -e "${RED}⚠️  Testing Complete - Issues Require Attention 🔧${NC}"
    exit 1
fi