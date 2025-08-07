# Fix robusto para memory_pressure en macOS
check_memory_pressure_macos() {
    if command -v memory_pressure &> /dev/null; then
        local memory_output
        memory_output=$(memory_pressure 2>/dev/null)
        
        if [ -n "$memory_output" ]; then
            local free_percentage
            free_percentage=$(echo "$memory_output" | grep -E "System-wide memory free percentage" | grep -oE '[0-9]+%' | sed 's/%//')
            
            if [[ "$free_percentage" =~ ^[0-9]+$ ]]; then
                if [ "$free_percentage" -gt 20 ]; then
                    track_health "healthy" "Memory Pressure (${free_percentage}% free)"
                elif [ "$free_percentage" -gt 5 ]; then
                    track_health "warning" "Memory Pressure (${free_percentage}% free)"
                else
                    track_health "critical" "Memory Pressure (${free_percentage}% free)"
                fi
            else
                log_info "Unable to parse memory pressure percentage from output"
            fi
        else
            log_info "memory_pressure command produced no output"
        fi
    else
        # Fallback para sistemas sin memory_pressure
        check_memory_alternative
    fi
}

check_memory_alternative() {
    if command -v vm_stat &> /dev/null; then
        # Alternativa usando vm_stat en macOS
        local vm_output page_size free_pages total_pages free_percentage
        vm_output=$(vm_stat 2>/dev/null)
        page_size=$(echo "$vm_output" | grep "page size of" | grep -oE '[0-9]+')
        free_pages=$(echo "$vm_output" | grep "Pages free:" | grep -oE '[0-9]+')
        
        if [ -n "$page_size" ] && [ -n "$free_pages" ]; then
            # Cálculo básico de memoria libre (simplificado)
            track_health "info" "Memory monitoring via vm_stat (${free_pages} free pages)"
        fi
    else
        log_info "Advanced memory monitoring not available on this system"
    fi
}