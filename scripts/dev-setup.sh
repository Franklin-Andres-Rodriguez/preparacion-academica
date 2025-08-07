# Instalar packages con versiones específicas para reproducibilidad
install_dev_dependencies() {
    log_step "Installing development dependencies with pinned versions..."
    
    # Definir versiones estables y compatibles
    local packages=(
        "eslint@8.57.0"
        "prettier@3.2.5"
        "@types/node@20.11.30"
        "typescript@5.4.5"
        "jest@29.7.0"
        "@jest/types@29.7.0"
        "husky@9.0.11"
        "lint-staged@15.2.2"
        "@typescript-eslint/parser@7.7.0"
        "@typescript-eslint/eslint-plugin@7.7.0"
    )
    
    if npm install --save-dev "${packages[@]}"; then
        log_success "Development dependencies installed successfully"
        
        # Crear .nvmrc para Node.js version pinning
        echo "18.20.0" > .nvmrc
        log_info "Created .nvmrc with Node.js 18.20.0"
        
        # Actualizar package.json engines
        update_package_engines
    else
        log_error "Failed to install development dependencies"
        return 1
    fi
}

update_package_engines() {
    if [ -f "package.json" ]; then
        # Usar jq si está disponible, sino usar sed
        if command -v jq &> /dev/null; then
            jq '.engines = {"node": ">=18.20.0", "npm": ">=9.0.0"}' package.json > package.json.tmp && mv package.json.tmp package.json
        else
            log_info "Consider installing jq for better package.json manipulation"
        fi
    fi
}