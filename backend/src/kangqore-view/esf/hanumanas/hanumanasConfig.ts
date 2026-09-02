// In-memory HANUMANAS on/off switch.
// Default: on (unless HANUMANAS_ENABLED=false in env).
// Resets on process restart — intentional for build-phase use.

const _state = {
  enabled: (process.env.HANUMANAS_ENABLED ?? process.env.AEGIS_ENABLED) !== 'false',
  toggledAt: null as string | null,
  toggledBy: null as string | null,
}

export const hanumanasConfig = {
  get enabled()   { return _state.enabled },
  get toggledAt() { return _state.toggledAt },
  get toggledBy() { return _state.toggledBy },

  toggle(actorId?: string): boolean {
    _state.enabled   = !_state.enabled
    _state.toggledAt = new Date().toISOString()
    _state.toggledBy = actorId ?? 'system'
    return _state.enabled
  },

  snapshot() {
    return {
      enabled:   _state.enabled,
      toggledAt: _state.toggledAt,
      toggledBy: _state.toggledBy,
    }
  },
}
