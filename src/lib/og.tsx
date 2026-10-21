import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';

/*
 * Shared Open Graph / social card renderer (1200×630). Fonts and the avatar are read once
 * at module scope; the default ImageResponse font (Geist) is used for body text.
 */

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = 'image/png';

const serif = await readFile(join(process.cwd(), 'src/fonts/og/InstrumentSerif-Regular.woff'));
const avatar = await readFile(join(process.cwd(), 'public/images/muhammad-adnan-avatar.jpg'));
const avatarSrc = `data:image/jpeg;base64,${avatar.toString('base64')}`;

const INK = '#14161a';
const MUTED = '#4c525c';
const PAPER = '#f4f2ed';
const LINE = '#dedad1';
const ACCENT = '#07707f';

export function renderOgImage({
  eyebrow,
  title,
  subtitle,
  footer = 'MIS · Business Intelligence · Full-stack engineering',
  showAvatar = false,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  footer?: string;
  showAvatar?: boolean;
}) {
  const titleSize = title.length > 70 ? 58 : title.length > 40 ? 70 : 84;
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        background: PAPER,
        color: INK,
        position: 'relative',
        padding: '64px 72px',
        backgroundImage: `linear-gradient(to right, rgba(20,22,26,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(20,22,26,0.05) 1px, transparent 1px)`,
        backgroundSize: '48px 48px',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          flex: 1,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            fontSize: 22,
            letterSpacing: 3,
            color: MUTED,
            textTransform: 'uppercase',
          }}
        >
          <div style={{ width: 44, height: 2, background: ACCENT }} />
          {eyebrow}
        </div>
        <div
          style={{ display: 'flex', flexDirection: 'column', maxWidth: showAvatar ? 760 : 1000 }}
        >
          <div
            style={{
              fontFamily: 'Instrument Serif',
              fontSize: titleSize,
              lineHeight: 1.02,
              letterSpacing: -1,
            }}
          >
            {title}
          </div>
          {subtitle ? (
            <div style={{ marginTop: 24, fontSize: 28, lineHeight: 1.35, color: MUTED }}>
              {subtitle}
            </div>
          ) : null}
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: `2px solid ${LINE}`,
            paddingTop: 24,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                background: INK,
                color: PAPER,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'Instrument Serif',
                fontSize: 24,
              }}
            >
              MA
            </div>
            <div style={{ fontSize: 26, fontWeight: 600 }}>Muhammad Adnan</div>
          </div>
          <div style={{ fontSize: 22, color: MUTED }}>{footer}</div>
        </div>
      </div>
      {showAvatar ? (
        <div style={{ position: 'absolute', right: 72, top: 150, display: 'flex' }}>
          {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
          <img
            src={avatarSrc}
            width={260}
            height={260}
            style={{
              borderRadius: 999,
              border: `6px solid ${PAPER}`,
              boxShadow: '0 20px 60px rgba(20,22,26,0.18)',
            }}
          />
        </div>
      ) : null}
    </div>,
    {
      ...OG_SIZE,
      fonts: [{ name: 'Instrument Serif', data: serif, style: 'normal', weight: 400 }],
    },
  );
}
