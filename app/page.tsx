import Link from 'next/link'
import { IconQrcode, IconShieldCheck, IconClock, IconDeviceMobile, IconDatabase, IconBolt, IconLock, IconChartBar, IconArrowRight, IconCheck } from '@tabler/icons-react'

export const metadata = {
  title: 'Project QR — Industrial Asset Management. Zero Paper.',
  description: 'Replace paper inspection reports with QR-linked digital reports. Secure, instant, and always accessible from any device.',
}

export default function LandingPage() {
  return (
    <div style={{ background: 'var(--bg-base)', color: 'var(--text-primary)' }}>
      {/* NAVBAR */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(7,8,15,0.85)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border)',
        padding: '0 24px',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', height: 64, gap: 24 }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginRight: 'auto' }}>
            <div style={{ width: 32, height: 32, background: 'var(--accent)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <IconQrcode size={18} color="white" />
            </div>
            <span className="font-syne" style={{ fontSize: '1.0625rem', fontWeight: 700 }}>Project QR</span>
          </Link>
          <div style={{ display: 'flex', gap: 8 }}>
            {['Features', 'How it works', 'Pricing'].map(item => (
              <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`} style={{ padding: '8px 14px', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem', borderRadius: 6, transition: 'color 150ms ease' }}>
                {item}
              </a>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <Link href="/login" style={{ padding: '8px 16px', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem', borderRadius: 6 }}>
              Sign In
            </Link>
            <Link href="/register" className="btn btn-primary btn-sm">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '120px 24px 100px' }}>
        {/* Grid background */}
        <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: 0.6, pointerEvents: 'none' }} />
        
        {/* Purple glow */}
        <div style={{
          position: 'absolute', top: '40%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '800px', height: '500px',
          background: 'radial-gradient(ellipse at center, rgba(108,99,255,0.12) 0%, transparent 65%)',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }} className="animate-fade-up">
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 14px',
            background: 'rgba(108,99,255,0.1)',
            border: '1px solid rgba(108,99,255,0.2)',
            borderRadius: 999, marginBottom: 32,
            fontFamily: 'DM Mono, monospace', fontSize: '0.75rem', color: 'var(--accent-light)',
            textTransform: 'uppercase', letterSpacing: '0.08em'
          }}>
            <span style={{ width: 6, height: 6, background: 'var(--accent)', borderRadius: '50%' }} />
            Industrial Asset Management
          </div>

          <h1 className="font-syne" style={{ 
            fontSize: 'clamp(2.5rem, 7vw, 4.5rem)', 
            fontWeight: 800, lineHeight: 1.1, marginBottom: 24,
            background: 'linear-gradient(135deg, #f0eeff 0%, #a89cff 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            Industrial reports.<br />Zero paper.<br />Instant access.
          </h1>
          
          <p style={{ 
            fontSize: 'clamp(1rem, 2vw, 1.25rem)', 
            color: 'var(--text-secondary)', 
            maxWidth: 560, margin: '0 auto 40px',
            lineHeight: 1.7 
          }}>
            Replace paper inspection reports with QR-linked digital records. Stick a code on any machine — anyone can scan it to access the exact report, forever.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/register" className="btn btn-primary btn-lg" style={{ display: 'inline-flex' }}>
              Get Started Free
              <IconArrowRight size={18} />
            </Link>
            <a href="#how-it-works" className="btn btn-secondary btn-lg" style={{ display: 'inline-flex' }}>
              Watch How it Works
            </a>
          </div>

          {/* Stats */}
          <div style={{ 
            display: 'flex', gap: 0, justifyContent: 'center', 
            marginTop: 64, flexWrap: 'wrap',
            borderTop: '1px solid var(--border)', paddingTop: 40
          }}>
            {[
              { value: '∞', label: 'QR Generated' },
              { value: '100%', label: 'Encrypted' },
              { value: '<200ms', label: 'Decode Time' },
              { value: '0', label: 'Breaches' },
            ].map((stat, i) => (
              <div key={i} style={{ 
                flex: '1 1 140px',
                padding: '0 24px',
                textAlign: 'center',
                borderRight: i < 3 ? '1px solid var(--border)' : 'none'
              }}>
                <div className="font-syne" style={{ 
                  fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', 
                  fontWeight: 800, 
                  color: 'var(--accent-light)',
                  marginBottom: 4
                }}>
                  {stat.value}
                </div>
                <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <div style={{ 
        borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)',
        padding: '16px 24px', background: 'var(--bg-card)',
        overflow: 'hidden'
      }}>
        <div style={{ 
          display: 'flex', gap: 40, justifyContent: 'center', 
          flexWrap: 'wrap', alignItems: 'center'
        }}>
          {['AES-256 Encrypted', 'SOC 2 Type II', 'Auto-invalidation', 'PIN Protection', 'ISO 27001'].map(trust => (
            <div key={trust} style={{ 
              display: 'flex', alignItems: 'center', gap: 8,
              fontFamily: 'DM Mono, monospace', fontSize: '0.75rem', 
              color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em',
              whiteSpace: 'nowrap'
            }}>
              <IconShieldCheck size={14} color="var(--accent-light)" />
              {trust}
            </div>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <section id="how-it-works" style={{ padding: '96px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <h2 className="font-syne" style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 700, marginBottom: 16 }}>
              How it works
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.0625rem', maxWidth: 480, margin: '0 auto' }}>
              From paper chaos to digital clarity in 4 steps
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
            {[
              { step: '01', title: 'Create Project', desc: 'Register each machine or asset in your facility with a name, location, and type.' },
              { step: '02', title: 'Upload Files', desc: 'Upload inspection reports in PDF, DOCX, or ZIP format. We expand archives automatically.' },
              { step: '03', title: 'Generate QR', desc: 'Set expiry, PIN protection, and label preferences. Generate a unique QR code instantly.' },
              { step: '04', title: 'Stick on Machine', desc: 'Print and stick the QR label on the physical machine. Anyone can scan to view the report.' },
            ].map((item, i) => (
              <div key={i} className="card" style={{ padding: 28 }}>
                <div style={{ 
                  fontFamily: 'DM Mono, monospace', fontSize: '2rem', fontWeight: 700,
                  color: 'rgba(108,99,255,0.2)', marginBottom: 16, lineHeight: 1
                }}>
                  {item.step}
                </div>
                <h3 className="font-syne" style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: 10 }}>
                  {item.title}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ padding: '0 24px 96px', background: 'var(--bg-card)', paddingTop: 96 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <h2 className="font-syne" style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 700, marginBottom: 16 }}>
              Built for industrial environments
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
            {[
              { icon: IconClock, title: 'Time-locked QR', desc: 'QR codes automatically expire on your schedule — 30 days, 90 days, 1 year, or never. Expired codes are immediately blocked.' },
              { icon: IconLock, title: 'PIN-Gated Access', desc: 'Protect sensitive reports with a 4-digit PIN. After 3 wrong attempts, the QR locks automatically.' },
              { icon: IconChartBar, title: 'Scan Analytics', desc: 'See exactly who scanned what, when, and from where. Identify suspicious access patterns instantly.' },
              { icon: IconDatabase, title: 'Multi-format Support', desc: 'PDF, DOCX, ZIP, RAR, EAR, WAR — all supported. ZIP files are expanded so you can select individual files.' },
              { icon: IconDeviceMobile, title: 'Offline Support', desc: 'Service workers cache scan pages and files. Technicians can view reports in factories with no WiFi.' },
              { icon: IconBolt, title: 'Instant Revocation', desc: 'Revoke any QR code instantly. All future scans are blocked immediately — no propagation delay.' },
            ].map((feature, i) => {
              const Icon = feature.icon
              return (
                <div key={i} className="card" style={{ padding: 24 }}>
                  <div style={{ 
                    width: 44, height: 44,
                    background: 'rgba(108,99,255,0.1)',
                    border: '1px solid rgba(108,99,255,0.15)',
                    borderRadius: 10,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: 16
                  }}>
                    <Icon size={20} color="var(--accent-light)" />
                  </div>
                  <h3 className="font-syne" style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 8 }}>
                    {feature.title}
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.7 }}>
                    {feature.desc}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{ padding: '96px 24px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <h2 className="font-syne" style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 700, marginBottom: 16 }}>
              Simple, transparent pricing
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.0625rem' }}>
              Start free, scale as you grow
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            {/* Starter */}
            <div className="card" style={{ padding: 32 }}>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>Starter</div>
              <div style={{ marginBottom: 8 }}>
                <span className="font-syne" style={{ fontSize: '2.5rem', fontWeight: 800 }}>$0</span>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}> / month</span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: 24, lineHeight: 1.6 }}>
                Perfect for small teams getting started
              </p>
              {['5 projects', '20 QR codes', '500 scans/mo', 'Basic analytics', '30-day expiry'].map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <IconCheck size={14} color="var(--success)" />
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{f}</span>
                </div>
              ))}
              <Link href="/register" className="btn btn-secondary" style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
                Get Started Free
              </Link>
            </div>

            {/* Pro */}
            <div className="card" style={{ 
              padding: 32,
              border: '1px solid rgba(108,99,255,0.3)',
              background: 'linear-gradient(135deg, rgba(108,99,255,0.05) 0%, var(--bg-card) 100%)',
              position: 'relative', overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute', top: 16, right: 16,
                fontFamily: 'DM Mono, monospace', fontSize: '0.65rem',
                padding: '4px 10px', borderRadius: 999,
                background: 'var(--accent)', color: 'white',
                textTransform: 'uppercase', letterSpacing: '0.08em'
              }}>Most Popular</div>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.75rem', color: 'var(--accent-light)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>Pro</div>
              <div style={{ marginBottom: 8 }}>
                <span className="font-syne" style={{ fontSize: '2.5rem', fontWeight: 800 }}>$49</span>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}> / month</span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: 24, lineHeight: 1.6 }}>
                For growing industrial operations
              </p>
              {['Unlimited projects', 'Unlimited QR codes', '50,000 scans/mo', 'Full analytics + export', 'Custom expiry', 'PIN protection', 'Priority support'].map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <IconCheck size={14} color="var(--success)" />
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{f}</span>
                </div>
              ))}
              <Link href="/register" className="btn btn-primary" style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
                Start Pro Trial
              </Link>
            </div>

            {/* Enterprise */}
            <div className="card" style={{ padding: 32 }}>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>Enterprise</div>
              <div style={{ marginBottom: 8 }}>
                <span className="font-syne" style={{ fontSize: '2.5rem', fontWeight: 800 }}>Custom</span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: 24, lineHeight: 1.6 }}>
                For large facilities with complex needs
              </p>
              {['Everything in Pro', 'SSO / SAML integration', 'Dedicated infrastructure', 'SLA guarantee', 'Custom retention policies', 'On-premise option', 'Dedicated account manager'].map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <IconCheck size={14} color="var(--success)" />
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{f}</span>
                </div>
              ))}
              <a href="mailto:enterprise@projectqr.io" className="btn btn-secondary" style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
                Contact Sales
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ 
        borderTop: '1px solid var(--border)', 
        padding: '40px 24px',
        background: 'var(--bg-card)'
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 28, height: 28, background: 'var(--accent)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IconQrcode size={16} color="white" />
            </div>
            <span className="font-syne" style={{ fontWeight: 700, fontSize: '0.9375rem' }}>Project QR</span>
            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.75rem', color: 'var(--text-muted)' }}>© 2026</span>
          </div>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            {['Privacy Policy', 'Terms of Service', 'Security', 'Status'].map(link => (
              <a key={link} href="#" style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.75rem', color: 'var(--text-muted)', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {link}
              </a>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
            {['AES-256', 'SOC 2', 'ISO 27001'].map(badge => (
              <div key={badge} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <IconShieldCheck size={13} color="var(--text-muted)" />
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {badge}
                </span>
              </div>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
