const fs = require('fs');
const file = fs.readFileSync('src/os/components/shell/Topbar.tsx', 'utf8');

const newReturn = `
  return (
    <>
    <header
      className="flex-shrink-0 h-[60px] flex items-center w-full px-5"
      style={{
        background: TOPBAR_BG,
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* 1. Logo */}
      <Link
        to="/kangqore-view/team"
        className="flex items-center gap-3 flex-shrink-0 hover:opacity-80 transition-opacity min-w-0"
      >
        <div
          className="w-[34px] h-[34px] rounded-[10px] flex items-center justify-center flex-shrink-0 shadow-sm"
          style={{ background: \`linear-gradient(135deg, \${config?.accentColor || '#2564ea'} 0%, \${config?.accentColor || '#2564ea'}99 100%)\` }}
        >
          <img src="/assets/kangqore-icon-white.png" alt="Kangqore" className="w-5 h-5 object-contain" />
        </div>
        <div className="overflow-hidden leading-tight mr-2">
          <p className="text-white font-bold text-[15px] truncate" style={{ fontFamily: 'var(--font-display)' }}>
            Kangqore
          </p>
          <p className="text-[10px] tracking-[0.15em] font-bold uppercase truncate" style={{ color: config?.accentColor || '#2564ea' }}>
            {portalLabel}
          </p>
        </div>
      </Link>

      {/* 2. Action Icons (Relay, Bell, Fullscreen) in dark pill */}
      <div
        className="flex items-center rounded-[14px] p-1 ml-4"
        style={{ border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' }}
      >
        <Tooltip content="RELAY — Messages" side="bottom">
          <button
            onClick={() => navigate(\`/kangqore-view/\${currentPortalId ?? 'admin'}/relay\`)}
            className="relative w-8 h-8 rounded-[10px] flex items-center justify-center text-slate-400 hover:text-slate-200 hover:bg-white/[0.06] transition-all duration-150"
          >
            <ChatCircleDotsIcon weight="duotone" className="w-[18px] h-[18px]" />
            {totalMentions > 0 && (
              <span
                className="absolute -top-1 -right-1 min-w-[15px] h-[15px] rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center leading-none tabular-nums"
                style={{ padding: '0 3px', boxShadow: \`0 0 0 2px \${TOPBAR_BG}\` }}
              >
                {totalMentions > 9 ? '9+' : totalMentions}
              </span>
            )}
          </button>
        </Tooltip>

        <Tooltip content="Notifications" side="bottom">
          <button
            onClick={openNotificationPanel}
            className="relative w-8 h-8 rounded-[10px] flex items-center justify-center text-slate-400 hover:text-slate-200 hover:bg-white/[0.06] transition-all duration-150"
          >
            <Bell className="w-[18px] h-[18px]" />
            {unreadCount > 0 && (
              <span
                className="absolute -top-1 -right-1 min-w-[15px] h-[15px] rounded-full bg-red-500 text-white text-[9px] font-black flex items-center justify-center leading-none tabular-nums"
                style={{ padding: '0 3px', boxShadow: \`0 0 0 2px \${TOPBAR_BG}\` }}
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
        </Tooltip>

        <Tooltip content={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'} side="bottom">
          <button
            onClick={toggleFullscreen}
            className="w-8 h-8 rounded-[10px] flex items-center justify-center text-slate-400 hover:text-slate-200 hover:bg-white/[0.06] transition-all duration-150"
          >
            {isFullscreen ? <Minimize2 className="w-[16px] h-[16px]" /> : <Maximize2 className="w-[16px] h-[16px]" />}
          </button>
        </Tooltip>
      </div>

      {/* 3. Divider */}
      <div className="w-px h-5 bg-white/[0.06] mx-4 flex-shrink-0" />

      {/* 4. User Profile */}
      <DropdownRoot>
        <DropdownTrigger asChild>
          <button className="flex items-center gap-2.5 h-10 px-1.5 rounded-xl hover:bg-white/5 transition-all duration-150 flex-shrink-0 group">
            <UserMonogram name={displayName} size={30} />
            <span className="text-[14px] font-medium text-slate-300 group-hover:text-white transition-colors truncate max-w-[140px]">
              {displayName}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300 transition-colors flex-shrink-0" />
          </button>
        </DropdownTrigger>
        {userDropdown('start')}
      </DropdownRoot>

      {/* 5. Divider */}
      <div className="w-px h-5 bg-white/[0.06] mx-4 flex-shrink-0" />

      {/* 6. Breadcrumb */}
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="relative" ref={switcherRef}>
          <Tooltip content="Switch portal" side="bottom">
            <button
              onClick={() => setSwitcherOpen(o => !o)}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-all duration-150 flex-shrink-0"
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
          </Tooltip>

          {switcherOpen && (
            <div className="absolute left-0 top-full mt-2 w-64 rounded-2xl py-2 z-50" style={PANEL_STYLE}>
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-600 px-3 pb-2">
                Switch Portal
              </p>
              {accessiblePortals.map(portal => {
                const Icon = portal.icon
                const isActive = currentPortalId === portal.id
                return (
                  <button
                    key={portal.id}
                    onClick={() => { navigate(portal.path); setSwitcherOpen(false) }}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl transition-all duration-150 hover:bg-white/[0.04] text-left"
                    style={isActive ? { background: \`\${portal.color}10\`, outline: \`1px solid \${portal.color}30\` } : {}}
                  >
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: \`\${portal.color}18\`, border: \`1px solid \${portal.color}28\` }}
                    >
                      <Icon weight="duotone" className="w-4 h-4" style={{ color: portal.color }} />
                    </div>
                    <span className={\`text-[13px] font-semibold flex-1 \${isActive ? 'text-white' : 'text-slate-400'}\`}>
                      {portal.label}
                    </span>
                    {isActive && (
                      <span
                        className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md flex-shrink-0"
                        style={{ background: \`\${portal.color}20\`, color: portal.color }}
                      >
                        Active
                      </span>
                    )}
                  </button>
                )
              })}
              <div className="mt-2 pt-2 mx-3 space-y-0.5" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <a href="/" className="flex items-center gap-2.5 py-2 text-[12px] text-slate-500 hover:text-slate-300 transition-colors group">
                  <Home className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="flex-1">Back to Kangqore.com</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
                <a href="/login" className="flex items-center gap-2.5 py-2 text-[12px] text-slate-500 hover:text-slate-300 transition-colors group">
                  <GlobeIcon weight="duotone" className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="flex-1">Login Page</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </div>
            </div>
          )}
        </div>

        <span
          className="inline-flex items-center text-[11px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-lg flex-shrink-0"
          style={{
            background: \`\${config?.accentColor || '#2564ea'}18\`,
            color: config?.accentColor || '#2564ea',
            border: \`1px solid \${config?.accentColor || '#2564ea'}30\`,
          }}
        >
          {portalLabel}
        </span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600 flex-shrink-0 mx-1" />
        <span className="text-[14px] text-white font-semibold truncate">{currentModule?.label ?? 'Overview'}</span>
      </div>

      <div className="flex-1" />

      {/* 7. Search */}
      <div className="flex justify-end pr-4">
        <button
          onClick={() => openSearch(true)}
          className="group relative h-10 w-[280px] lg:w-[340px] rounded-full flex items-center gap-2 pl-10 pr-3 text-[13px] text-slate-400 text-left transition-all duration-150 hover:text-slate-200 hover:border-white/20 hover:bg-white/[0.06]"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[16px] h-[16px] text-slate-500 pointer-events-none group-hover:text-slate-400 transition-colors" />
          <span className="flex-1 leading-none pt-0.5">Search anything…</span>
          <kbd
            className="hidden lg:flex items-center justify-center text-[11px] text-slate-500 font-sans rounded px-1.5 py-1 leading-none flex-shrink-0"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <span style={{ fontSize: 13, lineHeight: 1, marginRight: 2 }}>⌘</span>K
          </kbd>
        </button>
      </div>

      {/* 8. + New Button */}
      <div className="relative" ref={newRef}>
        <button
          onClick={() => setNewOpen(o => !o)}
          className="flex items-center gap-2 h-[38px] px-4 rounded-xl text-white text-[14px] font-semibold transition-opacity hover:opacity-85 flex-shrink-0 shadow-lg"
          style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)' }}
        >
          <Plus className="w-4 h-4" />
          New
        </button>
        {newOpen && (
          <div className="absolute right-0 top-full mt-2 w-52 rounded-xl py-1.5 z-50" style={PANEL_STYLE}>
            {NEW_ACTIONS.filter(a =>
              user?.role === 'ADMIN' || (a.mode === 'project' || a.mode === 'goal')
            ).map(a => {
              const Icon = a.icon
              return (
                <button
                  key={a.label}
                  onClick={() => {
                    setNewOpen(false)
                    if (a.mode) { setCreateMode(a.mode) }
                    else if (a.path) { navigate(a.path) }
                  }}
                  className="flex items-center gap-2.5 w-full px-3 py-2 text-[13px] text-slate-400 hover:text-white hover:bg-white/5 transition-colors text-left"
                >
                  <Icon weight="fill" className="w-4 h-4 text-slate-600 flex-shrink-0" />
                  {a.label}
                </button>
              )
            })}
          </div>
        )}
      </div>

    </header>

    <QuickCreateModal mode={createMode} onClose={() => setCreateMode(null)} />
  </>
  )
`;

const newFile = file.replace(/  return \(\s*<>\s*<header[\s\S]*?\n  \)\n}/m, newReturn + '\n}');
fs.writeFileSync('src/os/components/shell/Topbar.tsx', newFile);
