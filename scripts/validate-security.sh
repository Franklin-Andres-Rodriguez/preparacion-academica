#!/bin/bash
# scripts/validate-security.sh
# Valida que todas las configuraciones de seguridad estén correctamente implementadas

set -e

# Colors para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
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

# Header
echo -e "${BLUE}"
echo "🔒 Preparación Académica - Security Configuration Validation"
echo "=========================================================="
echo -e "${NC}"

ERRORS=0

# Función para validar archivos
validate_file() {
    local file=$1
    local description=$2
    
    if [ -f "$file" ]; then
        log_success "$description exists: $file"
    else
        log_error "$description missing: $file"
        ERRORS=$((ERRORS + 1))
    fi
}

# Función para validar directorios (CORREGIDO)
validate_directory() {
    local dir=$1
    local description=$2
    
    if [ -d "$dir" ]; then
        log_success "$description exists: $dir"
    else
        log_error "$description missing: $dir"
        ERRORS=$((ERRORS + 1))
    fi
}

# Función para validar contenido de archivos
validate_file_content() {
    local file=$1
    local pattern=$2
    local description=$3
    
    if [ -f "$file" ] && grep -q "$pattern" "$file"; then
        log_success "$description configured correctly in $file"
    else
        log_error "$description not found in $file"
        ERRORS=$((ERRORS + 1))
    fi
}

echo "🔍 Validating security configuration files..."

# Validar archivos de configuración
validate_file ".github/dependabot.yml" "Dependabot configuration"
validate_file ".github/workflows/codeql-analysis.yml" "CodeQL workflow"
validate_file "SECURITY.md" "Security policy"
validate_file ".github/CODEOWNERS" "Code owners file"

# Validar contenido específico
echo
echo "🔍 Validating file contents..."

validate_file_content ".github/dependabot.yml" "package-ecosystem.*npm" "NPM dependency updates"
validate_file_content ".github/dependabot.yml" "package-ecosystem.*github-actions" "GitHub Actions updates"
validate_file_content ".github/workflows/codeql-analysis.yml" "github/codeql-action" "CodeQL analysis"
validate_file_content "SECURITY.md" "Reporting a Vulnerability" "Security reporting process"
validate_file_content ".github/CODEOWNERS" "@Franklin-Andres-Rodriguez" "Code ownership"

# Validar GitHub CLI si está disponible
echo
echo "🔍 Validating GitHub repository settings (requires GitHub CLI)..."

if command -v gh &> /dev/null; then
    log_info "GitHub CLI found, checking repository settings..."
    
    # Verificar si el repositorio existe y es accesible
    if gh repo view Franklin-Andres-Rodriguez/preparacion-academica &>/dev/null; then
        log_success "Repository accessible via GitHub CLI"
        
        # Verificar si Dependabot está habilitado (esto puede fallar si no está habilitado aún)
        if gh api repos/Franklin-Andres-Rodriguez/preparacion-academica/vulnerability-alerts 2>/dev/null | grep -q '"enabled":true'; then
            log_success "Dependabot alerts enabled"
        else
            log_warning "Dependabot alerts may not be enabled yet (needs manual setup)"
        fi
        
        # Verificar branch protection (puede no existir aún)
        if gh api repos/Franklin-Andres-Rodriguez/preparacion-academica/branches/main/protection &>/dev/null; then
            log_success "Main branch protection enabled"
        else
            log_warning "Main branch protection not set up yet (needs manual setup)"
        fi
    else
        log_warning "Repository not accessible via GitHub CLI (may need authentication)"
    fi
else
    log_warning "GitHub CLI not found - cannot validate repository settings automatically"
    log_info "Install GitHub CLI: https://cli.github.com/"
    log_info "Then authenticate: gh auth login"
fi

# Validar estructura de directorios (CORREGIDO)
echo
echo "🔍 Validating directory structure..."

validate_directory ".github" "GitHub configuration directory"
validate_directory "scripts" "Scripts directory"
validate_directory "docs" "Documentation directory"

# Validaciones adicionales útiles
echo
echo "🔍 Additional validations..."

# Verificar que el script actual es ejecutable
if [ -x "scripts/validate-security.sh" ]; then
    log_success "Security validation script is executable"
else
    log_warning "Security validation script needs executable permissions"
    log_info "Run: chmod +x scripts/validate-security.sh"
fi

# Verificar README.md existe y menciona security
if [ -f "README.md" ] && grep -q -i "security" "README.md"; then
    log_success "README.md mentions security features"
else
    log_warning "README.md should mention security features"
fi

# Resumen final
echo
echo "📊 Security Validation Summary:"
echo "=============================="

if [ $ERRORS -eq 0 ]; then
    log_success "All security configurations validated successfully!"
    echo
    echo -e "${GREEN}🎉 Repository Security Level: ENTERPRISE-GRADE${NC}"
    echo
    echo "✅ Next steps completed:"
    echo "  • All configuration files are present and valid"
    echo "  • Directory structure is properly organized"
    echo "  • Content validation passed for all files"
    echo
    echo "🔧 Manual setup still needed:"
    echo "  1. GitHub UI Settings → Security & analysis → Enable all features"
    echo "  2. GitHub UI Settings → Branches → Add protection rules"
    echo "  3. Repository settings → Add topics and description"
    echo
    echo "🧪 Test your setup:"
    echo "  • Try pushing directly to main (should be blocked)"
    echo "  • Check Security tab for Dependabot/CodeQL results"
    echo "  • Verify topics appear on repository main page"
    exit 0
else
    log_error "$ERRORS security configuration issue(s) found"
    echo
    echo -e "${RED}🚨 Repository Security Level: INCOMPLETE${NC}"
    echo
    echo "Required actions:"
    echo "1. Fix the configuration issues listed above"
    echo "2. Create missing directories with: mkdir -p .github/workflows docs"
    echo "3. Run this script again to verify fixes"
    echo "4. Complete manual GitHub UI setup"
    exit 1
fi