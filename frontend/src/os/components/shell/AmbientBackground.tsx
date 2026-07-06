export function AmbientBackground() {
  // In light mode: render a very subtle surface wash (no blobs).
  // In dark mode: render soft gradient blobs for depth.
  return (
    <>
      {/* Base fill — always present */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{ background: 'var(--os-bg)' }}
      />

      {/* Dark-mode-only gradient blobs — hidden in light via CSS class targeting */}
      <div className="dark:block hidden fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Top-left blob */}
        <div
          style={{
            position: 'absolute',
            top: -120,
            left: -120,
            width: 480,
            height: 480,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(87,155,252,0.08) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        {/* Bottom-right blob */}
        <div
          style={{
            position: 'absolute',
            bottom: -80,
            right: -80,
            width: 360,
            height: 360,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
      </div>

      {/* Light-mode-only: barely-there corner wash */}
      <div className="dark:hidden block fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: 320,
            height: 320,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(87,155,252,0.03) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />
      </div>
    </>
  )
}
