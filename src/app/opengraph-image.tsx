import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Haku – AI-Powered Resume & Job Application Assistant'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          padding: '72px 80px',
          background: 'linear-gradient(135deg, #f8f9ff 0%, #eef0ff 50%, #f3f0ff 100%)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          position: 'relative',
        }}
      >
        {/* Background decorative blobs */}
        <div
          style={{
            position: 'absolute',
            top: '-80px',
            right: '-80px',
            width: '480px',
            height: '480px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, rgba(139,92,246,0.08) 60%, transparent 100%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-60px',
            left: '-60px',
            width: '360px',
            height: '360px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)',
          }}
        />

        {/* Top: Logo + Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', zIndex: 1 }}>
          {/* Logo mark */}
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #6366f1, #7c3aed)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(99,102,241,0.35)',
            }}
          >
            <span style={{ color: 'white', fontSize: '26px', fontWeight: 900, letterSpacing: '-1px' }}>
              H
            </span>
          </div>
          <span
            style={{
              fontSize: '28px',
              fontWeight: 800,
              color: '#1e293b',
              letterSpacing: '-0.5px',
            }}
          >
            haku
          </span>
          {/* Live badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(99,102,241,0.08)',
              border: '1px solid rgba(99,102,241,0.2)',
              borderRadius: '999px',
              padding: '4px 14px',
              marginLeft: '8px',
            }}
          >
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#6366f1',
              }}
            />
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '1px' }}>
              v1.0 Live
            </span>
          </div>
        </div>

        {/* Middle: Main headline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', zIndex: 1, maxWidth: '820px' }}>
          <div
            style={{
              fontSize: '60px',
              fontWeight: 900,
              color: '#0f172a',
              lineHeight: 1.1,
              letterSpacing: '-2px',
            }}
          >
            Land your dream job with{' '}
            <span
              style={{
                background: 'linear-gradient(90deg, #6366f1, #7c3aed)',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
              }}
            >
              AI Intelligence
            </span>
          </div>
          <div
            style={{
              fontSize: '22px',
              fontWeight: 400,
              color: '#64748b',
              lineHeight: 1.5,
            }}
          >
            AI-powered resume analysis • ATS optimization • Cover letter generation
          </div>
        </div>

        {/* Bottom: Stats row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '40px', zIndex: 1 }}>
          {[
            { value: '30', label: 'Free Tokens' },
            { value: 'ATS', label: 'Shield Optimized' },
            { value: 'AI', label: 'Deep Analysis' },
          ].map((stat) => (
            <div key={stat.label} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span
                style={{
                  fontSize: '26px',
                  fontWeight: 900,
                  color: '#6366f1',
                  letterSpacing: '-0.5px',
                }}
              >
                {stat.value}
              </span>
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {stat.label}
              </span>
            </div>
          ))}
          <div
            style={{
              marginLeft: 'auto',
              padding: '14px 32px',
              background: 'linear-gradient(135deg, #6366f1, #7c3aed)',
              borderRadius: '14px',
              fontSize: '18px',
              fontWeight: 800,
              color: 'white',
              boxShadow: '0 8px 24px rgba(99,102,241,0.4)',
              letterSpacing: '-0.3px',
            }}
          >
            Start for Free →
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
