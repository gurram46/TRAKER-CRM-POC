import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Instrument+Serif:ital@0;1&display=swap');

  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

  .crm-root {
    min-height: 100vh;
    width: 100%;
    display: flex;
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: #f0f2f7;
    position: relative;
    overflow: hidden;
  }

  /* subtle dot grid */
  .crm-root::before {
    content: '';
    position: fixed; inset: 0; z-index: 0;
    background-image: radial-gradient(circle, #c5c9d6 1px, transparent 1px);
    background-size: 28px 28px;
    opacity: 0.55;
    pointer-events: none;
  }

  /* floating blobs */
  .blob {
    position: fixed; border-radius: 50%;
    filter: blur(80px); pointer-events: none; z-index: 0;
  }
  .blob-1 {
    width: 520px; height: 520px;
    background: rgba(99,102,241,0.13);
    top: -180px; left: -120px;
    animation: blob-move 14s ease-in-out infinite;
  }
  .blob-2 {
    width: 420px; height: 420px;
    background: rgba(14,165,233,0.10);
    bottom: -140px; right: -80px;
    animation: blob-move 18s ease-in-out infinite reverse;
  }
  .blob-3 {
    width: 260px; height: 260px;
    background: rgba(245,158,11,0.08);
    top: 50%; left: 55%;
    animation: blob-move 10s ease-in-out infinite 2s;
  }
  @keyframes blob-move {
    0%,100% { transform: translate(0,0) scale(1); }
    33%      { transform: translate(24px,-18px) scale(1.04); }
    66%      { transform: translate(-16px,20px) scale(0.97); }
  }

  /* ── LAYOUT ── */
  .page-grid {
    position: relative; z-index: 1;
    width: 100%; min-height: 100vh;
    display: grid;
    grid-template-columns: 1.1fr 1fr;
  }

  /* ── LEFT ── */
  .left-col {
    display: flex; flex-direction: column;
    justify-content: space-between;
    padding: 52px 56px;
    position: relative;
  }

  .brand-row {
    display: flex; align-items: center; gap: 11px;
  }
  .brand-icon {
    width: 38px; height: 38px; border-radius: 10px;
    background: linear-gradient(135deg, #6366f1, #4f46e5);
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 4px 14px rgba(99,102,241,0.35);
  }
  .brand-name {
    font-size: 15px; font-weight: 800; letter-spacing: 0.08em;
    color: #1e1f2e;
  }
  .brand-name span { color: #6366f1; }

  /* hero copy */
  .hero-area {
    flex: 1; display: flex; flex-direction: column;
    justify-content: center; padding: 28px 0 20px;
    max-width: 460px;
  }

  .hero-tag {
    display: inline-flex; align-items: center; gap: 7px;
    background: #eef0fd; border: 1px solid #c7caf9;
    border-radius: 100px; padding: 5px 14px;
    font-size: 11px; font-weight: 700; letter-spacing: 0.08em;
    color: #5557c7; text-transform: uppercase;
    margin-bottom: 26px; width: fit-content;
  }
  .tag-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: #6366f1;
    animation: pulse 2s ease-in-out infinite;
  }
  @keyframes pulse {
    0%,100% { transform: scale(1); opacity: 1; }
    50%      { transform: scale(0.7); opacity: 0.5; }
  }

  .hero-title {
    font-size: clamp(34px, 3.6vw, 52px);
    font-weight: 800;
    line-height: 1.08;
    letter-spacing: -2px;
    color: #0f1117;
    margin-bottom: 20px;
  }
  .hero-title em {
    font-family: 'Instrument Serif', serif;
    font-style: italic;
    font-weight: 400;
    color: #6366f1;
    letter-spacing: -1px;
  }

  .hero-desc {
    font-size: 15px; color: #6b7280; line-height: 1.75;
    margin-bottom: 40px; max-width: 380px;
    font-weight: 400;
  }

  /* feature pills */
  .feature-list {
    display: flex; flex-wrap: wrap; gap: 8px;
  }
  .feat-pill {
    display: flex; align-items: center; gap: 6px;
    background: #fff; border: 1px solid #e5e7eb;
    border-radius: 100px; padding: 6px 13px;
    font-size: 12px; font-weight: 600; color: #374151;
    box-shadow: 0 1px 4px rgba(0,0,0,0.05);
    transition: all 0.2s;
  }
  .feat-pill:hover {
    border-color: #c7caf9; background: #f5f5ff; color: #4f46e5;
  }
  .feat-dot {
    width: 6px; height: 6px; border-radius: 50%;
  }

  .left-footer {
    font-size: 12px; color: #9ca3af; font-weight: 500;
  }

  /* ── RIGHT ── */
  .right-col {
    display: flex; align-items: center; justify-content: center;
    padding: 32px 40px;
    position: relative;
    overflow-y: auto;
    min-height: 100vh;
  }

  .login-card {
    width: 100%; max-width: 400px;
    background: #ffffff;
    border-radius: 24px;
    border: 1px solid #e5e7eb;
    padding: 32px 36px;
    margin: auto;
    box-shadow:
      0 0 0 1px rgba(255,255,255,0.9) inset,
      0 8px 24px rgba(0,0,0,0.07),
      0 32px 64px rgba(99,102,241,0.08);
    animation: card-up 0.6s cubic-bezier(0.16,1,0.3,1) both;
  }
  @keyframes card-up {
    from { opacity: 0; transform: translateY(28px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  .card-eyebrow {
    display: flex; align-items: center; gap: 10px; margin-bottom: 28px;
  }
  .card-avatar {
    width: 44px; height: 44px; border-radius: 12px;
    background: linear-gradient(135deg, #eef0fd, #ddd9fb);
    display: flex; align-items: center; justify-content: center;
    border: 1px solid #c7caf9;
  }
  .card-hi {
    font-size: 20px; font-weight: 800; color: #0f1117;
    letter-spacing: -0.5px; line-height: 1.1; margin-bottom: 2px;
  }
  .card-sub { font-size: 13px; color: #9ca3af; font-weight: 400; }

  /* fields */
  .field { margin-bottom: 16px; }
  .field-lbl {
    display: block; font-size: 12px; font-weight: 700;
    color: #374151; letter-spacing: 0.05em;
    text-transform: uppercase; margin-bottom: 7px;
  }
  .field-wrap { position: relative; }
  .field-ico {
    position: absolute; left: 13px; top: 50%;
    transform: translateY(-50%); pointer-events: none;
    transition: color 0.2s; color: #9ca3af;
  }
  .field-input {
    width: 100%;
    background: #f8f9fc;
    border: 1.5px solid #e5e7eb;
    border-radius: 11px;
    padding: 12px 13px 12px 40px;
    font-size: 14px; font-family: 'Plus Jakarta Sans', sans-serif;
    color: #0f1117; outline: none;
    transition: all 0.2s;
    font-weight: 500;
  }
  .field-input::placeholder { color: #c4c9d4; font-weight: 400; }
  .field-input:focus {
    background: #fff;
    border-color: #6366f1;
    box-shadow: 0 0 0 4px rgba(99,102,241,0.10);
  }
  .field-input:focus + .field-ico,
  .field-wrap:focus-within .field-ico {
    color: #6366f1;
  }
  .eye-toggle {
    position: absolute; right: 12px; top: 50%;
    transform: translateY(-50%);
    background: none; border: none; cursor: pointer;
    color: #9ca3af; padding: 2px; transition: color 0.2s;
    display: flex; align-items: center;
  }
  .eye-toggle:hover { color: #6366f1; }

  /* pw meta row */
  .pw-row {
    display: flex; align-items: center; justify-content: space-between;
    margin: 10px 0 24px;
  }
  .remember { display: flex; align-items: center; gap: 7px; cursor: pointer; }
  .remember input {
    width: 15px; height: 15px; accent-color: #6366f1;
    border-radius: 4px; cursor: pointer; flex-shrink: 0;
  }
  .remember span { font-size: 13px; color: #6b7280; font-weight: 500; cursor: pointer; user-select: none; }
  .forgot {
    font-size: 13px; font-weight: 600; color: #6366f1;
    background: none; border: none; cursor: pointer;
    font-family: 'Plus Jakarta Sans', sans-serif;
    transition: color 0.15s;
  }
  .forgot:hover { color: #4f46e5; }

  /* CTA */
  .btn-signin {
    width: 100%;
    background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
    border: none; border-radius: 12px; padding: 14px 20px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 14px; font-weight: 700; color: #fff;
    cursor: pointer; letter-spacing: 0.01em;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    transition: transform 0.15s, box-shadow 0.15s;
    box-shadow: 0 4px 14px rgba(99,102,241,0.35);
    margin-bottom: 20px; position: relative; overflow: hidden;
  }
  .btn-signin::before {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent);
    opacity: 0; transition: opacity 0.2s;
  }
  .btn-signin:hover::before { opacity: 1; }
  .btn-signin:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 28px rgba(99,102,241,0.42);
  }
  .btn-signin:active:not(:disabled) { transform: translateY(0); }
  .btn-signin:disabled { opacity: 0.75; cursor: not-allowed; }
  .btn-signin.ok { background: linear-gradient(135deg, #059669, #047857); box-shadow: 0 4px 14px rgba(5,150,105,0.35); }
  .btn-arrow { transition: transform 0.2s; }
  .btn-signin:hover:not(:disabled) .btn-arrow { transform: translateX(3px); }

  @keyframes spin { to { transform: rotate(360deg); } }
  .spinner {
    width: 18px; height: 18px;
    border: 2.5px solid rgba(255,255,255,0.35);
    border-top-color: #fff; border-radius: 50%;
    animation: spin 0.65s linear infinite;
    display: inline-block;
  }

  /* divider */
  .divider { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
  .div-line { flex: 1; height: 1px; background: #f0f2f5; }
  .div-txt { font-size: 11px; font-weight: 600; color: #d1d5db; letter-spacing: 0.06em; }

  /* social btns */
  .social-row { display: flex; gap: 10px; margin-bottom: 28px; }
  .btn-soc {
    flex: 1;
    background: #f8f9fc; border: 1.5px solid #e5e7eb;
    border-radius: 11px; padding: 11px 12px;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 13px; font-weight: 600; color: #374151;
    cursor: pointer; transition: all 0.2s;
  }
  .btn-soc:hover {
    background: #fff; border-color: #c7caf9; color: #4f46e5;
    box-shadow: 0 2px 10px rgba(99,102,241,0.10);
  }

  /* secure footer */
  .secure-row {
    display: flex; align-items: center; justify-content: center; gap: 6px;
    padding-top: 18px; border-top: 1px solid #f3f4f6;
  }
  .secure-txt { font-size: 11px; color: #d1d5db; font-weight: 500; }

  /* shake */
  @keyframes shake {
    0%,100% { transform: translateX(0); }
    20%,60%  { transform: translateX(-5px); }
    40%,80%  { transform: translateX(5px); }
  }
  .shake { animation: shake 0.35s ease; }

  /* stagger right panel children */
  .login-card > * {
    animation: fade-up 0.5s cubic-bezier(0.16,1,0.3,1) both;
  }
  .login-card > *:nth-child(1) { animation-delay: 0.15s; }
  .login-card > *:nth-child(2) { animation-delay: 0.2s; }
  .login-card > *:nth-child(3) { animation-delay: 0.25s; }
  .login-card > *:nth-child(4) { animation-delay: 0.28s; }
  .login-card > *:nth-child(5) { animation-delay: 0.31s; }
  .login-card > *:nth-child(6) { animation-delay: 0.34s; }
  .login-card > *:nth-child(7) { animation-delay: 0.37s; }
  .login-card > *:nth-child(8) { animation-delay: 0.40s; }
  @keyframes fade-up {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 760px) {
    .page-grid { grid-template-columns: 1fr; }
    .left-col  { display: none; }
  }
`;

const features = [
  { label: "RFQ Tracking", color: "#6366f1" },
  { label: "Quotations", color: "#0ea5e9" },
  { label: "Payment Tracking", color: "#f59e0b" },
  { label: "Logistics", color: "#10b981" },
  { label: "Follow-up Reminders", color: "#ec4899" },
  { label: "Zoho CRM Sync", color: "#8b5cf6" },
];



export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [shakeEmail, setShakeEmail] = useState(false);
  const [shakePass, setShakePass] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (toastMsg) {
      const t = setTimeout(() => setToastMsg(""), 3000);
      return () => clearTimeout(t);
    }
  }, [toastMsg]);

  const submit = () => {
    let err = false;
    if (!email) { setShakeEmail(true); setTimeout(() => setShakeEmail(false), 400); err = true; }
    if (!password) { setShakePass(true); setTimeout(() => setShakePass(false), 400); err = true; }
    if (err) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      localStorage.setItem("crm_authenticated", "true");
      setTimeout(() => {
        setSuccess(false);
        navigate("/dashboard");
      }, 1000);
    }, 1400);
  };

  return (
    <>
      <style>{S}</style>
      <div className="crm-root">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />

        <div className="page-grid">

          {/* ────── LEFT ────── */}
          <div className="left-col">
            {/* brand */}
            <div className="brand-row">
              <div className="brand-icon">
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round">
                  <path d="M3 13l4-7 5 3 5-6" />
                  <path d="M3 17h14" />
                </svg>
              </div>
              <span className="brand-name">OMNIA <span>STEELS</span></span>
            </div>

            {/* hero */}
            <div className="hero-area">


              <h1 className="hero-title">
                Steel trading,<br />
                managed with<br />
                <em>precision.</em>
              </h1>

              <p className="hero-desc">
                Omnia Steels — Hyderabad's trusted name in HR coils, TMT bars,
                and structural steel.
              </p>

              {/* feature pills */}
              <div className="feature-list">
                {features.map((f, i) => (
                  <div className="feat-pill" key={i}>
                    <div className="feat-dot" style={{ background: f.color }} />
                    {f.label}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ────── RIGHT ────── */}
          <div className="right-col">
            <div className="login-card">

              {/* card header */}
              <div className="card-eyebrow">
                <div className="card-avatar">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#6366f1" strokeWidth="1.8" strokeLinecap="round">
                    <path d="M3 13l4-7 5 3 5-6" />
                    <path d="M3 17h14" />
                  </svg>
                </div>
                <div>
                  <div className="card-hi">Welcome back </div>
                  <div className="card-sub">Sign in to your workspace</div>
                </div>
              </div>

              {/* email */}
              <div className={`field ${shakeEmail ? "shake" : ""}`}>
                <label className="field-lbl">Email Address</label>
                <div className="field-wrap">
                  <svg className="field-ico" width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path d="M2.5 5.8A1.7 1.7 0 014.2 4.2h11.6A1.7 1.7 0 0117.5 5.8v8.3a1.7 1.7 0 01-1.7 1.7H4.2a1.7 1.7 0 01-1.7-1.7V5.8z" />
                    <path d="M2.5 6.7l7.5 4.9 7.5-4.9" />
                  </svg>
                  <input
                    type="email"
                    className="field-input"
                    placeholder="admin@yourcompany.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && submit()}
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* password */}
              <div className={`field ${shakePass ? "shake" : ""}`}>
                <label className="field-lbl">Password</label>
                <div className="field-wrap">
                  <svg className="field-ico" width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <rect x="3.5" y="9" width="13" height="9" rx="1.5" />
                    <path d="M6.5 9V6a3.5 3.5 0 017 0v3" />
                  </svg>
                  <input
                    type={showPw ? "text" : "password"}
                    className="field-input"
                    placeholder="Enter your password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && submit()}
                    autoComplete="current-password"
                    style={{ paddingRight: "42px" }}
                  />
                  <button className="eye-toggle" onClick={() => setShowPw(!showPw)} type="button">
                    {showPw
                      ? <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 3l14 14M11 8.9A2.5 2.5 0 007.1 12.7M6.1 5.5A8 8 0 0110 4.2c5 0 8.3 5.8 8.3 5.8a14 14 0 01-3 3.7" /></svg>
                      : <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M1.7 10S5 3.3 10 3.3 18.3 10 18.3 10 15 16.7 10 16.7 1.7 10 1.7 10z" /><circle cx="10" cy="10" r="2.5" /></svg>
                    }
                  </button>
                </div>
              </div>

              {/* remember + forgot */}
              <div className="pw-row">
                <label className="remember">
                  <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} />
                  <span>Keep me signed in</span>
                </label>
                <button className="forgot" onClick={() => setToastMsg("Reset link sent!")}>Forgot password?</button>
              </div>

              {/* submit */}
              <button
                className={`btn-signin${success ? " ok" : ""}`}
                onClick={submit}
                disabled={loading}
              >
                {loading
                  ? <span className="spinner" />
                  : success
                    ? "✓ Access Granted — Redirecting..."
                    : <>
                      Sign In to Dashboard
                      <svg className="btn-arrow" width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                        <path d="M4 10h12M11 5l5 5-5 5" />
                      </svg>
                    </>
                }
              </button>

              {/* divider */}
              <div className="divider">
                <div className="div-line" />
                <span className="div-txt">or continue with</span>
                <div className="div-line" />
              </div>

              {/* social */}
              <div className="social-row">
                <button className="btn-soc" onClick={() => setToastMsg("Google SSO coming soon")} style={{ width: '100%' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Google
                </button>
              </div>

              {/* secure */}
              <div className="secure-row">
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="#10b981" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M7 1L2 3.5V7c0 3.5 2 5.5 5 6 3-.5 5-2.5 5-6V3.5L7 1z" />
                  <path d="M4.5 7l1.7 1.7L9.5 5" />
                </svg>

              </div>

              {toastMsg && (
                <div style={{
                  position: 'fixed', bottom: 24, right: 24, zIndex: 999,
                  background: '#1e1f2e', color: '#fff', borderRadius: 10,
                  padding: '12px 18px', fontSize: 13, fontWeight: 600,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
                  display: 'flex', alignItems: 'center', gap: 10,
                  animation: 'fade-up 0.3s ease'
                }}>
                  <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="#6366f1" strokeWidth="2.2" strokeLinecap="round"><circle cx="10" cy="10" r="8" /><path d="M10 6v4M10 13.5v.5" /></svg>
                  {toastMsg}
                  <button onClick={() => setToastMsg("")} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', marginLeft: 4, fontSize: 16, lineHeight: 1 }}>×</button>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
