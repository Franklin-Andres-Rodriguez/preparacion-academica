# Fix para timeout command detection
detect_timeout_cmd() {
    if command -v timeout &> /dev/null; then
        echo "timeout"
    elif command -v gtimeout &> /dev/null; then  # macOS homebrew
        echo "gtimeout"
    else
        echo ""
    fi
}

# Aplicar el fix en el script principal
validate_script_execution() {
    local script_path="$1"
    local script_name="$2"
    local timeout_cmd
    
    timeout_cmd=$(detect_timeout_cmd)
    
    if [ -f "$script_path" ]; then
        if [ -n "$timeout_cmd" ]; then
            if $timeout_cmd 30s "$script_path" > /dev/null 2>&1; then
                log_success "$script_name executes successfully"
            else
                log_warning "$script_name may have issues (timeout or error)"
            fi
        else
            log_warning "No timeout command found; running $script_name without timeout"
            if "$script_path" > /dev/null 2>&1; then
                log_success "$script_name executes successfully (no timeout)"
            else
                log_warning "$script_name may have issues (error)"
            fi
        fi
    else
        log_error "$script_name not found at $script_path"
    fi
}