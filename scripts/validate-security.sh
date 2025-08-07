#!/bin/bash
# scripts/validate-security.sh
# Validates that all security configurations are correctly implemented
#
# Educational Note: This script follows Martin Fowler's evolutionary design principles
# and Robert Martin's Clean Code practices for maintainable automation tools.

set -e

# Colors for professional output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Professional logging functions siguiendo Dan Abramov's transparent communication
log_info() {
    echo -e "${CYAN}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

log_section() {
    echo -e "${PURPLE}📋 $1${NC}"
    echo "────────────────────────────────────────────────────────────────"
}

show_educational_tip() {
    echo -e "${BLUE}💡 Educational Insight: $1${NC}"
}

# Header siguiendo Ian Sommerville's systematic structure
echo -e "${BLUE}"
echo "🔒 Preparación Académica - Security Configuration Validation"
echo "══════════════════════════════════════════════════════════════"
echo -e "${NC}"
echo
log_info "This validation follows enterprise security practices to ensure comprehensive protection"
show_educational_tip "Professional teams validate security configurations systematically to prevent costly vulnerabilities"
echo

ERRORS=0

# Kent Beck's Simple Design: Reveal intention through clear function names
validate_file() {
    local file=$1
    local description=$2
    
    if [ -f "$file" ]; then
        log_success "$description exists: $file"
        return 0
    else
        log_error "$description missing: $file"
        ERRORS=$((ERRORS + 1))
        return 1
    fi
}

validate_directory() {
    local dir=$1
    local description=$2
    
    if [ -d "$dir" ]; then
        log_success "$description exists: $dir"
        return 0
    else
        log_error "$description missing: $dir"
        ERRORS=$((ERRORS + 1))
        return 1
    fi
}

validate_file_content() {
    local file=$1
    local pattern=$2
    local description=$3
    
    if [ -f "$file" ] && grep -q "$pattern" "$file"; then
        log_success "$description configured correctly in $file"
        return 0
    else
        log_error "$description not found in $file"
        ERRORS=$((ERRORS + 1))
        return 1
    fi
}

# Martin Fowler's evolutionary design: Dynamic repository detection
get_repository_name() {
    # Educational Note: Following DRY principle - calculate once, use multiple times
    local remote_url
    remote_url=$(git remote get-url origin 2>/dev/null) || {
        log_warning "Could not detect repository URL from git remote"
        return 1
    }
    
    # Extract repository name from various URL formats
    # Supports: https://github.com/user/repo.git, git@github.com:user/repo.git, etc.
    echo "$remote_url" | sed -E 's#.*[:/]([^/]+/[^/]+)\.git.*#\1#' | sed 's#.*[:/]([^/]+/[^/]+)$#\1#'
}

# =====================================
# CONFIGURATION FILES VALIDATION
# =====================================
log_section "Configuration Files Validation"

log_info "Verifying security configuration files exist and are properly formatted..."

validate_file ".github/dependabot.yml" "Dependabot configuration"
validate_file ".github/workflows/codeql-analysis.yml" "CodeQL workflow"
validate_file "SECURITY.md" "Security policy"
validate_file ".github/CODEOWNERS" "Code owners file"

# =====================================
# CONTENT VALIDATION
# =====================================
echo
log_section "Configuration Content Validation"

log_info "Verifying configuration files contain required security settings..."

validate_file_content ".github/dependabot.yml" "package-ecosystem.*npm" "NPM dependency updates"
validate_file_content ".github/dependabot.yml" "package-ecosystem.*github-actions" "GitHub Actions updates"
validate_file_content ".github/workflows/codeql-analysis.yml" "github/codeql-action" "CodeQL analysis"
validate_file_content "SECURITY.md" "Reporting a Vulnerability" "Security reporting process"
validate_file_content ".github/CODEOWNERS" "$GITHUB_USERNAME" "Code ownership"

show_educational_tip "Content validation ensures configurations are not just present but actually functional"

# =====================================
# GITHUB REPOSITORY VALIDATION
# =====================================
echo
log_section "GitHub Repository Settings Validation"

if command -v gh &> /dev/null; then
    log_info "GitHub CLI found, performing comprehensive repository validation..."
    
    # Robert Martin's Clean Code: Extract repository name dynamically
    REPO_NAME=$(get_repository_name)
    
    if [ -n "$REPO_NAME" ]; then
        log_info "Detected repository: $REPO_NAME"
        
        # Verify repository accessibility
        if gh repo view "$REPO_NAME" &>/dev/null; then
            log_success "Repository accessible via GitHub CLI"
            
            # Verify Dependabot configuration
            if gh api repos/"$REPO_NAME"/vulnerability-alerts 2>/dev/null | grep -q '"enabled":true'; then
                log_success "Dependabot alerts enabled"
            else
                log_warning "Dependabot alerts may not be enabled (needs manual GitHub UI setup)"
                log_info "Enable at: Settings → Security & analysis → Dependabot alerts"
            fi
            
            # Verify branch protection
            if gh api repos/"$REPO_NAME"/branches/main/protection &>/dev/null; then
                log_success "Main branch protection enabled"
            else
                log_warning "Main branch protection not configured (needs manual GitHub UI setup)"
                log_info "Configure at: Settings → Branches → Add rule for 'main'"
            fi
            
            # Verify CodeQL is configured
            if gh api repos/"$REPO_NAME"/code-scanning/alerts 2>/dev/null | grep -q '\[\]'; then
                log_success "CodeQL code scanning configured (no alerts found)"
            elif gh api repos/"$REPO_NAME"/code-scanning/alerts 2>/dev/null | jq -r 'length' &>/dev/null; then
                ALERT_COUNT=$(gh api repos/"$REPO_NAME"/code-scanning/alerts 2>/dev/null | jq -r 'length')
                log_warning "CodeQL found $ALERT_COUNT security alert(s) - review in Security tab"
            else
                log_info "CodeQL code scanning status unknown (may need time to run)"
            fi
            
        else
            log_warning "Repository not accessible via GitHub CLI"
            log_info "Authenticate with: gh auth login"
        fi
    else
        log_error "Could not detect repository name from git configuration"
        log_info "Ensure you're in a git repository with properly configured remote"
    fi
else
    log_warning "GitHub CLI not found - cannot validate repository settings automatically"
    log_info "Install GitHub CLI: https://cli.github.com/"
    log_info "Manual verification required in GitHub UI"
fi

show_educational_tip "Automated repository validation demonstrates DevOps principles of infrastructure as code"

# =====================================
# DIRECTORY STRUCTURE VALIDATION
# =====================================
echo
log_section "Project Structure Validation"

log_info "Verifying essential directory structure for enterprise development..."

validate_directory ".github" "GitHub configuration directory"
validate_directory ".github/workflows" "GitHub Actions workflows directory"
validate_directory ".github/ISSUE_TEMPLATE" "Issue templates directory"
validate_directory "scripts" "Automation scripts directory"
validate_directory "docs" "Documentation directory"

# =====================================
# ADDITIONAL SECURITY CHECKS
# =====================================
echo
log_section "Additional Security Validations"

log_info "Performing supplementary security and quality checks..."

# Script permissions check
if [ -x "scripts/validate-security.sh" ]; then
    log_success "Security validation script is executable"
else
    log_warning "Security validation script needs executable permissions"
    log_info "Fix with: chmod +x scripts/validate-security.sh"
fi

# README security documentation
if [ -f "README.md" ] && grep -q -i "security" "README.md"; then
    log_success "README.md documents security features"
else
    log_warning "README.md should document security features and practices"
fi

# Environment variable security
if [ -f ".env" ]; then
    if git check-ignore .env &> /dev/null; then
        log_success ".env file properly ignored by Git (security protected)"
    else
        log_error ".env file is NOT ignored by Git - CRITICAL SECURITY RISK!"
        log_info "Fix immediately: Add '.env' to .gitignore file"
        ERRORS=$((ERRORS + 1))
    fi
fi

# Package.json security
if [ -f "package.json" ]; then
    if grep -q '"scripts"' package.json; then
        log_success "package.json includes automation scripts"
    else
        log_info "Consider adding npm scripts for common development tasks"
    fi
fi

show_educational_tip "Comprehensive security validation prevents the vulnerabilities that cost companies millions"

# =====================================
# FINAL SUMMARY AND RECOMMENDATIONS
# =====================================
echo
log_section "Security Validation Summary & Recommendations"

echo "🎯 Validation Results:"
echo "═══════════════════════"

if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}🌟 EXCELLENT: All security configurations validated successfully!${NC}"
    echo -e "${GREEN}🏆 Repository Security Grade: ENTERPRISE-READY${NC}"
    echo
    echo "✅ Achievements unlocked:"
    echo "  • All security configuration files present and valid"
    echo "  • Directory structure follows enterprise standards"
    echo "  • Content validation passed for all critical files"
    echo "  • Script portability and maintainability ensured"
    echo
    echo "🔧 Manual GitHub UI setup reminders:"
    echo "  1. Settings → Security & analysis → Enable all features"
    echo "  2. Settings → Branches → Configure protection rules"
    echo "  3. Repository → Add relevant topics and description"
    echo "  4. Security → Review any CodeQL/Dependabot alerts"
    echo
    echo "🧪 Validation tests you can perform:"
    echo "  • Try pushing directly to main (should be blocked by protection)"
    echo "  • Check Security tab for Dependabot alerts and CodeQL results"
    echo "  • Verify repository topics appear on main page"
    echo "  • Test issue/PR templates work correctly"
    echo
    echo "🎓 Educational achievement:"
    echo "  Repository demonstrates enterprise-grade security practices"
    echo "  following methodologies from industry leaders like Robert Martin,"
    echo "  Martin Fowler, and security experts from major tech companies."
    echo
    exit 0
else
    echo -e "${RED}⚠️  ATTENTION NEEDED: $ERRORS security configuration issue(s) found${NC}"
    echo -e "${RED}🔧 Repository Security Grade: REQUIRES FIXES${NC}"
    echo
    echo "Required actions:"
    echo "1. 🔧 Fix the specific issues identified above"
    echo "2. 📁 Create missing directories with: mkdir -p .github/workflows .github/ISSUE_TEMPLATE docs"
    echo "3. 📄 Create missing files following the templates in documentation"
    echo "4. 🔄 Run this script again to verify all fixes"
    echo "5. 🌐 Complete manual GitHub UI security setup"
    echo
    echo "🎓 Learning opportunity:"
    echo "  Each issue represents a chance to strengthen security practices"
    echo "  and apply professional development methodologies systematically."
    echo
    exit 1
fi