import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

const serif = await readFile(join(process.cwd(), 'src/fonts/og/InstrumentSerif-Regular.woff'));

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#14161a',
        color: '#f4f2ed',
        fontFamily: 'Instrument Serif',
        fontSize: 96,
        position: 'relative',
      }}
    >
      MA
      <div
        style={{
          position: 'absolute',
          right: 26,
          bottom: 26,
          width: 14,
          height: 14,
          borderRadius: 999,
          background: '#12a3b6',
        }}
      />
    </div>,
    { ...size, fonts: [{ name: 'Instrument Serif', data: serif, style: 'normal', weight: 400 }] },
  );
}
