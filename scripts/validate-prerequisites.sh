# Fix para semver check (línea ~65)
validate_node_version() {
    local NODE_VERSION REQUIRED_NODE
    NODE_VERSION=$(node --version 2>/dev/null | sed 's/v//')
    REQUIRED_NODE="18.0.0"
    
    if [ -z "$NODE_VERSION" ]; then
        log_error "Node.js is not installed"
        return 1
    fi
    if node -e "require.resolve('semver')" &>/dev/null; then
        if node -e "process.exit(require('semver').gte('$NODE_VERSION', '$REQUIRED_NODE') ? 0 : 1)" &>/dev/null; then
            log_success "Node.js $NODE_VERSION (meets requirement: ≥$REQUIRED_NODE)"
        else
            log_error "Node.js version $NODE_VERSION is below required $REQUIRED_NODE"
            echo "   📥 Upgrade: https://nodejs.org/ or use nvm: nvm install 18"
            increment_error
            return 1
        fi
    # Verificar semver está disponible antes de usar
    if command -v npm &> /dev/null && npm list semver &> /dev/null; then
        if node -e "process.exit(require('semver').gte('$NODE_VERSION', '$REQUIRED_NODE') ? 0 : 1)" 2>/dev/null; then
            log_success "Node.js $NODE_VERSION (meets requirement: ≥$REQUIRED_NODE)"
        else
            log_error "Node.js version $NODE_VERSION is below required $REQUIRED_NODE"
            echo "   📥 Upgrade: https://nodejs.org/ or use nvm: nvm install 18"
            return 1
        fi
    else
        # Fallback a comparación manual si semver no está disponible
        manual_version_check "$NODE_VERSION" "$REQUIRED_NODE"
    fi
}

manual_version_check() {
    local current="$1" required="$2"
    local current_major current_minor current_patch
    local required_major required_minor required_patch
    
    IFS='.' read -r current_major current_minor current_patch <<< "$current"
    IFS='.' read -r required_major required_minor required_patch <<< "$required"
    
    if [ "$current_major" -gt "$required_major" ] || \
       ([ "$current_major" -eq "$required_major" ] && [ "$current_minor" -ge "$required_minor" ]); then
        log_success "Node.js $current (meets requirement: ≥$required)"
    else
        log_error "Node.js version $current is below required $required"
        return 1
    fi
}