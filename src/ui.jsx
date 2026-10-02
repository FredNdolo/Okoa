import { useCallback, useEffect, useRef, useState } from 'react';

export function useToast() {
  const [msg, setMsg] = useState('');
  const timer = useRef(null);
  const show = useCallback((m) => {
    setMsg(m);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setMsg(''), 2600);
  }, []);
  useEffect(() => () => clearTimeout(timer.current), []);
  return [msg, show];
}

export function Toast({ msg }) {
  return (
    <div className="toast-slot" role="status" aria-live="polite">
      {msg ? <div className="toast">{msg}</div> : null}
    </div>
  );
}

const paths = {
  back: <path d="M15 18l-6-6 6-6" />,
  wrench: <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-.6-.6-2.4z" />,
  phone: <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8.1 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.8 2z" />,
  message: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />,
  share: (<><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" /></>),
  check: <path d="M20 6L9 17l-5-5" />,
  nav: <path d="M3 11l19-9-9 19-2-8-8-2z" />,
  triangle: (<><path d="M12 3L22 20H2L12 3Z" /><path d="M12 10v4" /><path d="M12 17h.01" /></>),
};

export function Icon({ name, size = 22, stroke = 2.2 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

export function Logo({ suffix }) {
  return (
    <span className="logo">
      <span className="logo-mark"><Icon name="triangle" size={24} /></span>
      <span className="logo-word">OKOA</span>
      {suffix ? <span className="logo-suffix">{suffix}</span> : null}
    </span>
  );
}

export function MapArt({ variant = 'home', height = 110 }) {
  if (variant === 'route') {
    return (
      <svg className="map" viewBox="0 0 390 280" preserveAspectRatio="xMidYMid slice" style={{ height }} aria-hidden="true">
        <rect width="390" height="280" fill="#161C23" />
        <path d="M60 -10 L 110 290" stroke="#232B35" strokeWidth="10" fill="none" />
        <path d="M300 -10 L 260 290" stroke="#232B35" strokeWidth="8" fill="none" />
        <path d="M-10 220 C 100 190, 200 230, 400 110" stroke="#2E3843" strokeWidth="16" fill="none" />
        <path className="route-dash" d="M70 50 C 90 130, 120 190, 230 190" stroke="#F5A524" strokeWidth="4" strokeDasharray="2 9" strokeLinecap="round" fill="none" />
        <circle cx="70" cy="50" r="13" fill="#F2F4F6" />
        <path d="M64 50h12M70 44v12" stroke="#0F1318" strokeWidth="2.4" />
        <circle cx="230" cy="190" r="24" fill="#F5A524" opacity="0.18" />
        <circle cx="230" cy="190" r="8" fill="#F5A524" stroke="#0F1318" strokeWidth="3" />
      </svg>
    );
  }
  return (
    <svg className="map" viewBox="0 0 350 110" preserveAspectRatio="xMidYMid slice" style={{ height }} aria-hidden="true">
      <rect width="350" height="110" fill="#161C23" />
      <path d="M120 -10 L 165 130" stroke="#232B35" strokeWidth="9" fill="none" />
      <path d="M-10 85 C 80 65, 150 95, 360 25" stroke="#2E3843" strokeWidth="14" fill="none" />
      <path d="M-10 85 C 80 65, 150 95, 360 25" stroke="#5B6672" strokeWidth="1.5" strokeDasharray="8 8" fill="none" />
      {variant === 'job' ? <path d="M60 25 C 80 60, 130 80, 178 68" stroke="#F5A524" strokeWidth="3.5" strokeDasharray="2 8" strokeLinecap="round" fill="none" /> : null}
      {variant === 'job' ? <circle cx="60" cy="25" r="8" fill="#F2F4F6" /> : null}
      <circle cx="178" cy="68" r="20" fill="#F5A524" opacity="0.18" />
      <circle cx="178" cy="68" r="7" fill="#F5A524" stroke="#0F1318" strokeWidth="3" />
    </svg>
  );
}

export function Phone({ children, label }) {
  return (
    <div className="phone" aria-label={label} role="region">
      <div className="phone-screen">{children}</div>
    </div>
  );
}
