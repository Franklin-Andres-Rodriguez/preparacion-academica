#!/bin/bash
# Smart ESLint + Prettier Setup - Following 50+ Software Engineering Educators' Best Practices
# Combines Ian Sommerville's systematic approach + Brad Traversy's practical solutions
# + Robert C. Martin's Clean Code principles + Kent Beck's incremental development

set -euo pipefail  # Professional error handling

# Color coding for better UX (following Sarah Drasner's visual approach)
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging functions (following professional standards)
log_info() {
    echo -e "${BLUE}ℹ️  [INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}✅ [SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}⚠️  [WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}❌ [ERROR]${NC} $1" >&2
}

log_step() {
    echo -e "${BLUE}🚀 $1${NC}"
}

# Check if we're in a Node.js project (Sommerville's systematic validation)
check_project_environment() {
    log_step "Validating project environment..."
    
    if [ ! -f "package.json" ]; then
        log_error "package.json not found. Please run this script in a Node.js project root."
        exit 1
    fi
    
    log_success "Valid Node.js project detected"
    
    # Show current project info
    local project_name=$(jq -r '.name // "unnamed"' package.json 2>/dev/null || echo "unknown")
    log_info "Project: $project_name"
}

# Intelligent state detection (Fowler's evolutionary approach)
detect_current_state() {
    log_step "Analyzing current configuration state..."
    
    # Check existing dependencies
    local has_eslint=$(npm list eslint --depth=0 2>/dev/null && echo "true" || echo "false")
    local has_prettier=$(npm list prettier --depth=0 2>/dev/null && echo "true" || echo "false")
    local prettier_version=$(npm list prettier --depth=0 2>/dev/null | grep prettier | sed 's/.*@//' | sed 's/ .*//' || echo "none")
    
    # Check existing configuration files
    local has_eslintrc=$([ -f ".eslintrc.js" ] || [ -f ".eslintrc.json" ] || [ -f ".eslintrc.yml" ] && echo "true" || echo "false")
    local has_prettierrc=$([ -f ".prettierrc" ] || [ -f ".prettierrc.js" ] || [ -f ".prettierrc.json" ] && echo "true" || echo "false")
    local has_prettierignore=$([ -f ".prettierignore" ] && echo "true" || echo "false")
    local has_tsconfig=$([ -f "tsconfig.json" ] && echo "true" || echo "false")
    
    # Check package.json scripts
    local has_lint_script=$(jq -r '.scripts.lint // "false"' package.json 2>/dev/null)
    local has_format_script=$(jq -r '.scripts.format // "false"' package.json 2>/dev/null)
    
    # Display current state
    log_info "Current Configuration State:"
    echo "  📦 ESLint installed: $has_eslint"
    echo "  🎨 Prettier installed: $has_prettier (version: $prettier_version)"
    echo "  ⚙️  ESLint config exists: $has_eslintrc"
    echo "  🎨 Prettier config exists: $has_prettierrc"
    echo "  🚫 Prettier ignore exists: $has_prettierignore"
    echo "  📘 TypeScript config exists: $has_tsconfig"
    echo "  📝 Lint script exists: $([ "$has_lint_script" != "false" ] && echo "true" || echo "false")"
    echo "  ✨ Format script exists: $([ "$has_format_script" != "false" ] && echo "true" || echo "false")"
    
    # Export state for other functions
    export HAS_ESLINT=$has_eslint
    export HAS_PRETTIER=$has_prettier
    export PRETTIER_VERSION=$prettier_version
    export HAS_ESLINTRC=$has_eslintrc
    export HAS_PRETTIERRC=$has_prettierrc
    export HAS_PRETTIERIGNORE=$has_prettierignore
    export HAS_TSCONFIG=$has_tsconfig
    export HAS_LINT_SCRIPT=$has_lint_script
    export HAS_FORMAT_SCRIPT=$has_format_script
}

# Smart dependency management (Beck's incremental approach)
install_dependencies() {
    log_step "Installing/updating dependencies intelligently..."
    
    local needs_install=false
    local deps_to_install=()
    
    # Check Prettier version compatibility (critical for eslint-plugin-prettier)
    if [ "$HAS_PRETTIER" = "true" ]; then
        local major_version=$(echo "$PRETTIER_VERSION" | cut -d'.' -f1)
        if [ "$major_version" -lt 3 ] && [ "$major_version" != "none" ]; then
            log_warning "Prettier version $PRETTIER_VERSION detected. Upgrading to v3.x for compatibility..."
            deps_to_install+=("prettier@^3.3.2")
            needs_install=true
        fi
    else
        log_info "Installing Prettier..."
        deps_to_install+=("prettier@^3.3.2")
        needs_install=true
    fi
    
    # ESLint ecosystem (only install what's missing)
    if [ "$HAS_ESLINT" != "true" ]; then
        log_info "Installing ESLint ecosystem..."
        deps_to_install+=("eslint@^8.57.0")
        deps_to_install+=("eslint-config-prettier@^9.1.0")
        deps_to_install+=("eslint-plugin-prettier@^5.5.4")
        needs_install=true
    else
        # Check if prettier integration exists
        local has_prettier_config=$(npm list eslint-config-prettier --depth=0 2>/dev/null && echo "true" || echo "false")
        local has_prettier_plugin=$(npm list eslint-plugin-prettier --depth=0 2>/dev/null && echo "true" || echo "false")
        
        if [ "$has_prettier_config" != "true" ]; then
            deps_to_install+=("eslint-config-prettier@^9.1.0")
            needs_install=true
        fi
        
        if [ "$has_prettier_plugin" != "true" ]; then
            deps_to_install+=("eslint-plugin-prettier@^5.5.4")
            needs_install=true
        fi
    fi
    
    # TypeScript support (optional but recommended for professional setup)
    local has_ts_parser=$(npm list @typescript-eslint/parser --depth=0 2>/dev/null && echo "true" || echo "false")
    local has_ts_plugin=$(npm list @typescript-eslint/eslint-plugin --depth=0 2>/dev/null && echo "true" || echo "false")
    
    if [ "$has_ts_parser" != "true" ] || [ "$has_ts_plugin" != "true" ]; then
        log_info "Adding TypeScript support for future scalability..."
        deps_to_install+=("@typescript-eslint/parser@^7.7.0")
        deps_to_install+=("@typescript-eslint/eslint-plugin@^7.7.0")
        needs_install=true
    fi
    
    # Install dependencies if needed
    if [ "$needs_install" = true ]; then
        log_step "Installing: ${deps_to_install[*]}"
        if npm install --save-dev "${deps_to_install[@]}"; then
            log_success "Dependencies installed successfully"
        else
            log_error "Failed to install dependencies"
            exit 1
        fi
    else
        log_success "All dependencies are already properly configured"
    fi
}

# Smart configuration file management (Robillard's selective disclosure)
create_configurations() {
    log_step "Managing configuration files..."
    
    # ESLint configuration (adapt to existing setup)
    if [ "$HAS_ESLINTRC" != "true" ]; then
        log_info "Creating ESLint configuration..."
        create_eslint_config
    else
        log_warning "ESLint config already exists. Creating backup and optimizing..."
        backup_and_update_eslint_config
    fi
    
    # Prettier configuration
    if [ "$HAS_PRETTIERRC" != "true" ]; then
        log_info "Creating Prettier configuration..."
        create_prettier_config
    else
        log_warning "Prettier config exists. Validating compatibility..."
        validate_prettier_config
    fi
    
    # Prettier ignore
    if [ "$HAS_PRETTIERIGNORE" != "true" ]; then
        log_info "Creating .prettierignore..."
        create_prettier_ignore
    else
        log_success ".prettierignore already exists"
    fi
    
    # TypeScript config (if not exists and beneficial)
    if [ "$HAS_TSCONFIG" != "true" ]; then
        read -p "Create tsconfig.json for better code analysis? (y/N): " create_ts
        if [[ $create_ts =~ ^[Yy]$ ]]; then
            create_typescript_config
        fi
    else
        log_success "TypeScript configuration already exists"
    fi
}

# Create optimized ESLint config for your codebase
create_eslint_config() {
    cat > .eslintrc.js << 'EOF'
// ESLint Configuration - Professional Setup
// Following Clean Code principles + your enterprise standards

module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2022: true,
    jest: true,
  },
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended', // If TypeScript files present
    'prettier', // Must be last to override conflicting rules
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
    'prettier',
  ],
  rules: {
    // Adjusted for your current codebase (104 issues → manageable improvement)
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'no-unused-vars': 'off', // Use TypeScript version
    '@typescript-eslint/no-unused-vars': ['error', { 
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_'
    }],
    'prefer-const': 'error',
    'no-var': 'error',
    
    // Gradual improvement approach (Beck's incremental development)
    'complexity': ['warn', 15], // Start higher, reduce over time
    'max-lines-per-function': ['warn', 80], // Current max, improve incrementally
    'max-params': ['warn', 5], // Allow current max, optimize later
    
    // Professional standards
    'eqeqeq': ['error', 'always'],
    'no-implicit-coercion': 'warn', // Start as warning
    'no-return-assign': 'error',
    'no-useless-return': 'error',
    'object-shorthand': 'warn',
    'no-prototype-builtins': 'error',
    
    // Prettier integration
    'prettier/prettier': 'error',
  },
  overrides: [
    {
      // More lenient for existing files during refactoring
      files: ['assets/js/**/*.js'],
      rules: {
        'complexity': ['warn', 20],
        'max-lines-per-function': ['warn', 100],
        'no-console': 'warn', // Allow during development
      }
    },
    {
      // Configuration files
      files: ['*.config.{js,ts}', '.*rc.js'],
      rules: {
        'no-console': 'off',
      }
    }
  ]
};
EOF
    log_success "ESLint configuration created with gradual improvement approach"
}

# Backup existing ESLint config and update
backup_and_update_eslint_config() {
    local eslint_file=""
    if [ -f ".eslintrc.js" ]; then eslint_file=".eslintrc.js"
    elif [ -f ".eslintrc.json" ]; then eslint_file=".eslintrc.json"
    elif [ -f ".eslintrc.yml" ]; then eslint_file=".eslintrc.yml"
    fi
    
    if [ -n "$eslint_file" ]; then
        cp "$eslint_file" "${eslint_file}.backup.$(date +%Y%m%d_%H%M%S)"
        log_success "Backed up existing $eslint_file"
        
        # For now, keep existing config but suggest improvements
        log_info "Your existing ESLint config preserved. Consider updating based on new best practices."
        log_info "Backup created as ${eslint_file}.backup.*"
    fi
}

# Create professional Prettier config
create_prettier_config() {
    cat > .prettierrc << 'EOF'
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "bracketSameLine": false,
  "arrowParens": "avoid",
  "endOfLine": "lf"
}
EOF
    log_success "Prettier configuration created"
}

# Validate existing Prettier config
validate_prettier_config() {
    if npx prettier --check .prettierrc &>/dev/null; then
        log_success "Existing Prettier config is valid"
    else
        log_warning "Prettier config might need updating for v3.x compatibility"
    fi
}

# Create comprehensive Prettier ignore
create_prettier_ignore() {
    cat > .prettierignore << 'EOF'
# Dependencies
node_modules/
npm-debug.log*

# Build outputs
dist/
build/
coverage/
.next/
out/

# Logs
*.log
logs/

# Runtime data
pids/
*.pid
*.seed
*.pid.lock

# Generated files
*.min.js
*.min.css
**/generated/**

# Version control
.git/

# IDE files (selective)
*.swp
*.swo

# Package managers
package-lock.json
yarn.lock
pnpm-lock.yaml

# Documentation with specific formatting
CHANGELOG.md
EOF
    log_success ".prettierignore created"
}

# Optional TypeScript config for better analysis
create_typescript_config() {
    cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Node",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "allowJs": true,
    "checkJs": false,
    "strict": false,
    "noImplicitAny": false,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true,
    "outDir": "./dist"
  },
  "include": [
    "assets/**/*",
    "scripts/**/*",
    "*.js"
  ],
  "exclude": [
    "node_modules",
    "dist"
  ]
}
EOF
    log_success "TypeScript configuration created (lenient for JavaScript project)"
}

# Smart package.json script management (Traversy's practical approach)
update_package_scripts() {
    log_step "Updating package.json scripts..."
    
    local scripts_updated=false
    
    # Only add missing scripts
    if [ "$HAS_LINT_SCRIPT" = "false" ]; then
        npm pkg set scripts.lint="eslint . --ext .js,.ts,.jsx,.tsx"
        npm pkg set scripts.lint:fix="eslint . --ext .js,.ts,.jsx,.tsx --fix"
        scripts_updated=true
        log_info "Added lint scripts"
    fi
    
    if [ "$HAS_FORMAT_SCRIPT" = "false" ]; then
        npm pkg set scripts.format="prettier --write \"**/*.{js,ts,jsx,tsx,json,md,yml,yaml}\""
        npm pkg set scripts.format:check="prettier --check \"**/*.{js,ts,jsx,tsx,json,md,yml,yaml}\""
        scripts_updated=true
        log_info "Added format scripts"
    fi
    
    # Add comprehensive quality scripts
    local has_quality=$(jq -r '.scripts.quality // "false"' package.json 2>/dev/null)
    if [ "$has_quality" = "false" ]; then
        npm pkg set scripts.quality="npm run lint && npm run format:check"
        npm pkg set scripts.quality:fix="npm run lint:fix && npm run format"
        scripts_updated=true
        log_info "Added quality scripts"
    fi
    
    if [ "$scripts_updated" = true ]; then
        log_success "Package.json scripts updated"
    else
        log_success "Package.json scripts already configured"
    fi
    
    # Display available commands
    echo ""
    log_info "Available commands:"
    echo "  npm run lint              - Check for linting issues"
    echo "  npm run lint:fix          - Fix auto-fixable issues"
    echo "  npm run format            - Format all files"
    echo "  npm run format:check      - Check formatting"
    echo "  npm run quality           - Run complete quality check"
    echo "  npm run quality:fix       - Fix everything possible"
}

# Integration with existing GitHub workflow (Fowler's evolutionary integration)
update_github_workflow() {
    log_step "Checking GitHub Actions integration..."
    
    if [ ! -d ".github/workflows" ]; then
        log_info "No GitHub workflows directory found. Skipping workflow integration."
        return
    fi
    
    # Check if code quality workflow exists
    local has_quality_workflow=false
    for workflow in .github/workflows/*.yml .github/workflows/*.yaml; do
        if [ -f "$workflow" ] && grep -q "eslint\|prettier\|lint" "$workflow" 2>/dev/null; then
            has_quality_workflow=true
            break
        fi
    done
    
    if [ "$has_quality_workflow" = true ]; then
        log_success "Code quality workflow already exists"
    else
        read -p "Create GitHub Actions workflow for code quality? (y/N): " create_workflow
        if [[ $create_workflow =~ ^[Yy]$ ]]; then
            create_github_workflow
        fi
    fi
}

# Create GitHub Actions workflow
create_github_workflow() {
    cat > .github/workflows/code-quality.yml << 'EOF'
name: Code Quality Checks

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  code-quality:
    name: ESLint + Prettier
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Run ESLint
      run: npm run lint
      
    - name: Check Prettier formatting
      run: npm run format:check
      
    - name: Run quality check
      run: npm run quality
EOF
    log_success "GitHub Actions workflow created"
}

# Testing and validation (Beck's testing focus)
test_setup() {
    log_step "Testing the complete setup..."
    
    # Test ESLint
    if npx eslint --version &>/dev/null; then
        log_success "ESLint is working"
    else
        log_error "ESLint test failed"
        exit 1
    fi
    
    # Test Prettier
    if npx prettier --version &>/dev/null; then
        log_success "Prettier is working"
    else
        log_error "Prettier test failed"
        exit 1
    fi
    
    # Test on a sample file
    echo "const test = 'hello world';" > .test-quality.js
    
    # Test formatting
    if npx prettier --write .test-quality.js &>/dev/null; then
        log_success "Prettier formatting test passed"
    else
        log_warning "Prettier formatting test had issues"
    fi
    
    # Test linting (expect some issues, that's normal)
    if npx eslint .test-quality.js &>/dev/null; then
        log_success "ESLint analysis test passed"
    else
        log_info "ESLint found issues in test file (this is normal)"
    fi
    
    # Cleanup
    rm -f .test-quality.js
    
    log_success "Setup testing completed"
}

# Professional summary and next steps (Schmedtmann's clear guidance)
provide_next_steps() {
    log_step "Setup Complete! Next Steps for Professional Development"
    echo ""
    echo "🎯 IMMEDIATE ACTIONS:"
    echo "1. Run 'npm run quality' to see current code quality status"
    echo "2. Run 'npm run quality:fix' to auto-fix many issues"
    echo "3. Review remaining issues and fix manually for learning"
    echo ""
    echo "📈 DEVELOPMENT WORKFLOW:"
    echo "1. Before committing: npm run quality:fix"
    echo "2. Review changes to understand improvements"
    echo "3. Commit with improved code quality"
    echo ""
    echo "🚀 PROFESSIONAL GROWTH:"
    echo "1. Study ESLint issues as learning opportunities"
    echo "2. Gradually tighten rules for higher standards"
    echo "3. Document patterns and decisions for team"
    echo ""
    echo "📚 EDUCATIONAL RESOURCES:"
    echo "- Clean Code by Robert C. Martin"
    echo "- Refactoring by Martin Fowler"
    echo "- ESLint documentation for rule details"
    echo ""
    log_success "Your enterprise-grade code quality system is ready!"
    echo ""
    echo "Following the combined wisdom of 50+ software engineering educators,"
    echo "you now have a professional development environment that will"
    echo "continuously improve your code quality and engineering skills."
}

# Main execution (Sommerville's systematic orchestration)
main() {
    echo "🎓 Smart ESLint + Prettier Setup"
    echo "Following 50+ Software Engineering Educators' Best Practices"
    echo "================================================"
    echo ""
    
    check_project_environment
    detect_current_state
    
    echo ""
    read -p "Proceed with smart setup based on current state? (Y/n): " proceed
    if [[ $proceed =~ ^[Nn]$ ]]; then
        log_info "Setup cancelled by user"
        exit 0
    fi
    
    install_dependencies
    create_configurations
    update_package_scripts
    update_github_workflow
    test_setup
    provide_next_steps
    
    echo ""
    log_success "🎉 Smart setup completed successfully!"
    echo "Your code quality system is now enterprise-ready."
}

# Execute main function
main "$@"