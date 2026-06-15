import { useEffect, useState } from 'react';

export default function DevAdminLogin() {
  const [status, setStatus] = useState('Signing in…');

  useEffect(() => {
    fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@kangqore.com', password: 'Admin2026!' }),
    })
      .then(r => r.json())
      .then(data => {
        if (data.token) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          setStatus('✓ Done — redirecting…');
          window.location.href = '/kangqore-view/admin';
        } else {
          setStatus('Error: ' + JSON.stringify(data));
        }
      })
      .catch(e => setStatus('Fetch error: ' + e.message));
  }, []);

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center',
      background:'#000d1a', color:'#00d4ff', fontFamily:'monospace', fontSize:16 }}>
      {status}
    </div>
  );
}
