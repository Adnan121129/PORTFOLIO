import type { CSSProperties, JSX, ReactNode } from 'react';
import type { IllustrationName } from '@/content/types';
import { cn } from '@/lib/utils';

/*
 * Original, lightweight SVG illustrations built from each project's documented features.
 * They are representative visuals — not screenshots of deployed products — and carry no
 * invented figures: labels name features, never values.
 */

const W = 480;
const H = 300;

function Frame({ children, label, uid }: { children: ReactNode; label: string; uid: string }) {
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label={label}
      className="block h-auto w-full"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <pattern id={`${uid}-grid`} width="16" height="16" patternUnits="userSpaceOnUse">
          <path d="M16 0H0V16" fill="none" className="stroke-(--grid-line)" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width={W} height={H} className="fill-(--surface)" />
      <rect width={W} height={H} fill={`url(#${uid}-grid)`} />
      {children}
    </svg>
  );
}

const mono = 'font-mono';
const tiny = { fontSize: 9.5, letterSpacing: '0.06em' } as CSSProperties;
const small = { fontSize: 11 } as CSSProperties;

function Label({
  x,
  y,
  children,
  className,
  style,
  anchor,
}: {
  x: number;
  y: number;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  anchor?: 'start' | 'middle' | 'end';
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      className={cn(mono, 'fill-(--ink-subtle) uppercase', className)}
      style={{ ...tiny, ...style }}
    >
      {children}
    </text>
  );
}

function Panel({
  x,
  y,
  w,
  h,
  r = 8,
  className,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  r?: number;
  className?: string;
}) {
  return (
    <rect
      x={x}
      y={y}
      width={w}
      height={h}
      rx={r}
      className={cn('fill-(--bg-elevated) stroke-(--line)', className)}
      strokeWidth="1"
    />
  );
}

function PlantOps({ uid }: { uid: string }) {
  const kpis = ['Generation', 'Availability', 'Heat rate', 'Downtime'];
  return (
    <Frame
      uid={uid}
      label="Representative illustration of the PlantOps Intelligence executive dashboard: KPI tiles for generation, availability, heat rate and downtime, a trend chart, top downtime causes and open alerts."
    >
      <Panel x={20} y={18} w={440} h={264} r={12} />
      <Label x={36} y={40}>
        Executive dashboard
      </Label>
      <circle cx={438} cy={36} r={3.5} className="fill-(--project)" />
      {kpis.map((kpi, i) => (
        <g key={kpi} transform={`translate(${36 + i * 104} 52)`}>
          <rect width={94} height={50} rx={7} className="fill-(--surface) stroke-(--line)" />
          <Label x={10} y={18} style={{ fontSize: 8.5 }}>
            {kpi}
          </Label>
          <rect
            x={10}
            y={28}
            width={[52, 64, 40, 30][i]}
            height={6}
            rx={3}
            className="fill-(--project)"
            opacity={0.85}
          />
          <rect x={10} y={39} width={70} height={3} rx={1.5} className="fill-(--line)" />
        </g>
      ))}
      {/* Trend */}
      <rect
        x={36}
        y={116}
        width={238}
        height={118}
        rx={8}
        className="fill-(--surface) stroke-(--line)"
      />
      <Label x={48} y={134}>
        Trend
      </Label>
      <path
        d="M48 214 C 78 200, 92 176, 120 182 S 168 150, 196 160 S 238 132, 262 140 L262 222 L48 222 Z"
        className="fill-(--project-soft)"
      />
      <path
        d="M48 214 C 78 200, 92 176, 120 182 S 168 150, 196 160 S 238 132, 262 140"
        fill="none"
        className="stroke-(--project)"
        strokeWidth="2"
      />
      <line x1={48} y1={222} x2={262} y2={222} className="stroke-(--line-strong)" />
      {/* Downtime causes */}
      <rect
        x={286}
        y={116}
        width={158}
        height={118}
        rx={8}
        className="fill-(--surface) stroke-(--line)"
      />
      <Label x={298} y={134}>
        Top downtime causes
      </Label>
      {[96, 74, 52, 34].map((w, i) => (
        <g key={w}>
          <rect x={298} y={146 + i * 20} width={26} height={8} rx={2} className="fill-(--line)" />
          <rect
            x={330}
            y={146 + i * 20}
            width={w}
            height={8}
            rx={4}
            className="fill-(--ink)"
            opacity={0.75 - i * 0.12}
          />
        </g>
      ))}
      {/* Alerts */}
      <g transform="translate(36 246)">
        <rect width={120} height={22} rx={11} className="fill-(--warn-soft)" />
        <circle cx={12} cy={11} r={3.5} className="fill-(--warn)" />
        <Label x={22} y={14.5} className="fill-(--warn)" style={{ fontSize: 8.5 }}>
          Overdue PM
        </Label>
        <rect x={128} width={136} height={22} rx={11} className="fill-(--surface-2)" />
        <circle cx={140} cy={11} r={3.5} className="fill-(--ink-subtle)" />
        <Label x={150} y={14.5} style={{ fontSize: 8.5 }}>
          Low critical stock
        </Label>
        <rect x={272} width={136} height={22} rx={11} className="fill-(--surface-2)" />
        <Label x={284} y={14.5} style={{ fontSize: 8.5 }}>
          Table view ⇄ chart
        </Label>
      </g>
    </Frame>
  );
}

function InfraVision({ uid }: { uid: string }) {
  const stages = ['Upload', 'Store', 'Queue', 'Prep', 'Infer', 'Analyze', 'Done'];
  return (
    <Frame
      uid={uid}
      label="Representative illustration of InfraVision AI: an inspection photo with bounding boxes around a crack and spalling, a 0 to 100 health gauge and the seven-stage processing timeline."
    >
      {/* Inspection image */}
      <rect
        x={20}
        y={18}
        width={286}
        height={206}
        rx={12}
        className="fill-(--surface-2) stroke-(--line)"
      />
      {Array.from({ length: 9 }).map((_, i) => (
        <line
          key={i}
          x1={20}
          y1={40 + i * 22}
          x2={306}
          y2={34 + i * 22}
          className="stroke-(--line)"
          strokeWidth="1"
          opacity={0.6}
        />
      ))}
      <path
        d="M70 60 L92 92 L86 118 L108 142 L104 170 L128 196"
        fill="none"
        className="stroke-(--ink)"
        strokeWidth="2.2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path
        d="M92 92 L118 98 L130 90"
        fill="none"
        className="stroke-(--ink)"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <rect
        x={58}
        y={50}
        width={84}
        height={156}
        rx={4}
        fill="none"
        className="stroke-(--project)"
        strokeWidth="2"
        strokeDasharray="6 4"
      />
      <rect x={58} y={34} width={98} height={16} rx={3} className="fill-(--project)" />
      <text
        x={64}
        y={45.5}
        className={cn(mono, 'fill-(--surface) uppercase')}
        style={{ ...tiny, fontSize: 8.5 }}
      >
        Crack · High
      </text>
      <ellipse cx={226} cy={150} rx={34} ry={22} className="fill-(--ink)" opacity={0.18} />
      <ellipse cx={220} cy={146} rx={16} ry={10} className="fill-(--ink)" opacity={0.22} />
      <rect
        x={182}
        y={118}
        width={92}
        height={64}
        rx={4}
        fill="none"
        className="stroke-(--accent)"
        strokeWidth="2"
        strokeDasharray="6 4"
      />
      <rect x={182} y={102} width={112} height={16} rx={3} className="fill-(--accent)" />
      <text
        x={188}
        y={113.5}
        className={cn(mono, 'fill-(--on-accent) uppercase')}
        style={{ ...tiny, fontSize: 8.5 }}
      >
        Spalling · Medium
      </text>
      {/* Health gauge */}
      <rect
        x={322}
        y={18}
        width={138}
        height={206}
        rx={12}
        className="fill-(--bg-elevated) stroke-(--line)"
      />
      <Label x={336} y={40}>
        Asset health
      </Label>
      <path
        d="M346 132 A 45 45 0 0 1 436 132"
        fill="none"
        className="stroke-(--line)"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <path
        d="M346 132 A 45 45 0 0 1 418 98"
        fill="none"
        className="stroke-(--project)"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <Label x={391} y={128} anchor="middle" style={{ fontSize: 9 }}>
        0–100
      </Label>
      {['Low', 'Medium', 'High', 'Critical'].map((level, i) => (
        <g key={level} transform={`translate(338 ${152 + i * 16})`}>
          <rect width={8} height={8} rx={2} className="fill-(--project)" opacity={0.3 + i * 0.22} />
          <Label x={14} y={7.5} style={{ fontSize: 8.5 }}>
            {level}
          </Label>
        </g>
      ))}
      {/* Timeline */}
      <line x1={36} y1={258} x2={444} y2={258} className="stroke-(--line-strong)" />
      {stages.map((stage, i) => {
        const x = 36 + i * 68;
        const done = i < 5;
        return (
          <g key={stage}>
            <circle
              cx={x}
              cy={258}
              r={6}
              className={done ? 'fill-(--project)' : 'fill-(--surface) stroke-(--line-strong)'}
            />
            <Label x={x} y={280} anchor="middle" style={{ fontSize: 8.5 }}>
              {stage}
            </Label>
          </g>
        );
      })}
    </Frame>
  );
}

function LinguaSI({ uid }: { uid: string }) {
  const skills = ['Writing', 'Speaking', 'Reading', 'Listening', 'Vocabulary', 'Grammar'];
  return (
    <Frame
      uid={uid}
      label="Representative illustration of LinguaSI: an essay with an inline highlighted error and explanation, beside a phone showing a daily mission and six skill bars marked AI estimated."
    >
      <Panel x={20} y={18} w={262} h={264} r={12} />
      <Label x={36} y={40}>
        Writing · Task 2
      </Label>
      {[200, 226, 180, 214, 160, 222, 196, 120].map((w, i) => (
        <rect
          key={i}
          x={36}
          y={56 + i * 18}
          width={w}
          height={6}
          rx={3}
          className="fill-(--line)"
        />
      ))}
      <rect x={96} y={90} width={70} height={10} rx={3} className="fill-(--project-soft)" />
      <path
        d="M96 103 q4 3 8 0 t8 0 t8 0 t8 0 t8 0 t8 0 t8 0 t8 0 t8 0"
        fill="none"
        className="stroke-(--project)"
        strokeWidth="1.4"
      />
      <g transform="translate(118 206)">
        <rect width={150} height={58} rx={9} className="fill-(--surface) stroke-(--project)" />
        <Label x={12} y={20} className="fill-(--project)">
          Why this?
        </Label>
        <rect x={12} y={30} width={120} height={5} rx={2.5} className="fill-(--line)" />
        <rect x={12} y={42} width={88} height={5} rx={2.5} className="fill-(--line)" />
      </g>
      <path
        d="M131 103 L150 206"
        className="stroke-(--project)"
        strokeWidth="1"
        strokeDasharray="3 3"
      />
      {/* Phone */}
      <rect
        x={302}
        y={14}
        width={158}
        height={274}
        rx={22}
        className="fill-(--bg-elevated) stroke-(--line-strong)"
        strokeWidth="1.5"
      />
      <rect x={358} y={22} width={46} height={6} rx={3} className="fill-(--line)" />
      <Label x={318} y={52}>
        Daily mission
      </Label>
      <rect x={318} y={60} width={126} height={40} rx={8} className="fill-(--project-soft)" />
      <rect x={328} y={72} width={80} height={5} rx={2.5} className="fill-(--project)" />
      <rect
        x={328}
        y={84}
        width={56}
        height={5}
        rx={2.5}
        className="fill-(--project)"
        opacity={0.5}
      />
      {skills.map((skill, i) => (
        <g key={skill} transform={`translate(318 ${118 + i * 23})`}>
          <Label x={0} y={8} style={{ fontSize: 8 }}>
            {skill}
          </Label>
          <rect x={0} y={12} width={126} height={5} rx={2.5} className="fill-(--line)" />
          <rect
            x={0}
            y={12}
            width={[92, 64, 104, 78, 58, 86][i]}
            height={5}
            rx={2.5}
            className="fill-(--ink)"
            opacity={0.7}
          />
        </g>
      ))}
      <rect x={318} y={258} width={84} height={18} rx={9} className="fill-(--surface-2)" />
      <Label x={326} y={270} style={{ fontSize: 8 }}>
        AI estimated
      </Label>
    </Frame>
  );
}

function OmniManager({ uid }: { uid: string }) {
  const columns = [
    { title: 'To do', cards: 3 },
    { title: 'In progress', cards: 2 },
    { title: 'Done', cards: 2 },
  ];
  return (
    <Frame
      uid={uid}
      label="Representative illustration of OmniManager: a three-column Kanban board, a running timer, and an invoice built from approved time and marked paid."
    >
      {columns.map((column, c) => (
        <g key={column.title} transform={`translate(${20 + c * 92} 18)`}>
          <rect width={84} height={232} rx={10} className="fill-(--bg-elevated) stroke-(--line)" />
          <Label x={10} y={20} style={{ fontSize: 8.5 }}>
            {column.title}
          </Label>
          {Array.from({ length: column.cards }).map((_, i) => (
            <g key={i} transform={`translate(8 ${32 + i * 52})`}>
              <rect width={68} height={44} rx={6} className="fill-(--surface) stroke-(--line)" />
              <rect
                x={8}
                y={10}
                width={44}
                height={5}
                rx={2.5}
                className="fill-(--ink)"
                opacity={0.6}
              />
              <rect x={8} y={21} width={32} height={4} rx={2} className="fill-(--line-strong)" />
              <circle
                cx={56}
                cy={34}
                r={4}
                className={c === 2 ? 'fill-(--success)' : 'fill-(--project)'}
                opacity={0.8}
              />
            </g>
          ))}
        </g>
      ))}
      <g transform="translate(20 262)">
        <rect width={140} height={24} rx={12} className="fill-(--project-soft)" />
        <circle cx={14} cy={12} r={5} className="fill-(--project)" />
        <text x={28} y={16} className={cn(mono, 'fill-(--project)')} style={small}>
          1:30 · 1.5h · 90m
        </text>
      </g>
      <path
        d="M298 134 h24 m-7 -6 l7 6 l-7 6"
        fill="none"
        className="stroke-(--ink-subtle)"
        strokeWidth="1.5"
      />
      {/* Invoice */}
      <g transform="translate(332 22)">
        <rect width={128} height={256} rx={6} className="fill-(--surface) stroke-(--line-strong)" />
        <Label x={12} y={24}>
          Invoice
        </Label>
        {[0, 1, 2, 3].map((i) => (
          <g key={i} transform={`translate(12 ${44 + i * 24})`}>
            <rect width={62} height={5} rx={2.5} className="fill-(--line-strong)" />
            <rect x={78} width={26} height={5} rx={2.5} className="fill-(--line)" />
            <rect y={10} width={40} height={4} rx={2} className="fill-(--line)" />
          </g>
        ))}
        <line x1={12} y1={150} x2={116} y2={150} className="stroke-(--line-strong)" />
        <rect x={12} y={162} width={44} height={6} rx={3} className="fill-(--ink)" opacity={0.7} />
        <rect x={78} y={162} width={38} height={6} rx={3} className="fill-(--ink)" opacity={0.7} />
        <g transform="translate(26 196) rotate(-10)">
          <rect
            width={80}
            height={30}
            rx={6}
            fill="none"
            className="stroke-(--success)"
            strokeWidth="2"
          />
          <text
            x={40}
            y={20}
            textAnchor="middle"
            className={cn(mono, 'fill-(--success) uppercase')}
            style={{ fontSize: 12, letterSpacing: '0.2em' }}
          >
            Paid
          </text>
        </g>
      </g>
    </Frame>
  );
}

function GreenFactory({ uid }: { uid: string }) {
  const months = [62, 70, 58, 76, 66, 54, 72, 60];
  const production = [58, 74, 52, 80, 70, 50, 76, 64];
  return (
    <Frame
      uid={uid}
      label="Representative illustration of GreenFactory BI: monthly energy consumption bars normalised against production, with a decomposition into production effect and efficiency effect, and energy, water and waste streams."
    >
      <Panel x={20} y={18} w={300} h={264} r={12} />
      <Label x={36} y={40}>
        Energy per 1,000 pcs
      </Label>
      <line x1={36} y1={232} x2={304} y2={232} className="stroke-(--line-strong)" />
      {months.map((value, i) => (
        <rect
          key={i}
          x={44 + i * 32}
          y={232 - value * 2}
          width={18}
          height={value * 2}
          rx={3}
          className="fill-(--project)"
          opacity={0.28 + (i % 2) * 0.1}
        />
      ))}
      <polyline
        points={production.map((value, i) => `${53 + i * 32},${232 - value * 2}`).join(' ')}
        fill="none"
        className="stroke-(--ink)"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      {production.map((value, i) => (
        <circle key={i} cx={53 + i * 32} cy={232 - value * 2} r={2.6} className="fill-(--ink)" />
      ))}
      <g transform="translate(36 250)">
        <rect width={10} height={10} rx={2} className="fill-(--project)" opacity={0.4} />
        <Label x={16} y={9} style={{ fontSize: 8.5 }}>
          Consumption
        </Label>
        <line x1={112} y1={5} x2={128} y2={5} className="stroke-(--ink)" strokeWidth="1.8" />
        <Label x={134} y={9} style={{ fontSize: 8.5 }}>
          Production
        </Label>
      </g>
      {/* Decomposition */}
      <Panel x={336} y={18} w={124} h={150} r={12} />
      <Label x={350} y={40} style={{ fontSize: 8.5 }}>
        Monthly change
      </Label>
      <rect x={356} y={58} width={34} height={96} rx={4} className="fill-(--line)" />
      <rect
        x={356}
        y={58}
        width={34}
        height={58}
        rx={4}
        className="fill-(--project)"
        opacity={0.75}
      />
      <rect
        x={356}
        y={116}
        width={34}
        height={38}
        rx={0}
        className="fill-(--warn)"
        opacity={0.55}
      />
      <Label x={398} y={92} style={{ fontSize: 7.5 }}>
        Prod.
      </Label>
      <Label x={398} y={104} style={{ fontSize: 7.5 }}>
        effect
      </Label>
      <Label x={398} y={134} style={{ fontSize: 7.5 }}>
        Eff.
      </Label>
      <Label x={398} y={146} style={{ fontSize: 7.5 }}>
        effect
      </Label>
      {/* Streams */}
      {[
        { label: 'Energy', d: 'M0 -9 L-5 1 H0 L-3 10 L6 -2 H1 L4 -9 Z' },
        { label: 'Water', d: 'M0 -10 C 6 -2, 7 3, 0 9 C -7 3, -6 -2, 0 -10 Z' },
        { label: 'Waste', d: 'M-7 -3 A7 7 0 1 1 -3 6 M-3 6 l-4 0 m4 0 l0 -4' },
      ].map((stream, i) => (
        <g key={stream.label} transform={`translate(${352 + i * 38} 194)`}>
          <rect
            x={-2}
            y={-14}
            width={34}
            height={56}
            rx={8}
            className="fill-(--bg-elevated) stroke-(--line)"
          />
          <path
            d={stream.d}
            transform="translate(15 4)"
            className={i === 2 ? 'fill-none stroke-(--project)' : 'fill-(--project)'}
            strokeWidth="1.6"
          />
          <Label x={15} y={34} anchor="middle" style={{ fontSize: 7 }}>
            {stream.label}
          </Label>
        </g>
      ))}
      <Label x={336} y={272} style={{ fontSize: 8 }}>
        Verified · second person
      </Label>
    </Frame>
  );
}

function Muhibbi({ uid }: { uid: string }) {
  const layers = [
    { h: 52, opacity: 0.95 },
    { h: 40, opacity: 0.6 },
    { h: 30, opacity: 0.3 },
  ];
  let y = 236;
  return (
    <Frame
      uid={uid}
      label="Representative illustration of Muhibbi Tea House: a glass built from ordered ingredient layers with steam above it, next to an order status rail moving from Confirmed to Preparing to Ready."
    >
      <ellipse cx={170} cy={250} rx={110} ry={10} className="fill-(--ink)" opacity={0.08} />
      {/* steam */}
      {[0, 1, 2].map((i) => (
        <path
          key={i}
          d={`M${142 + i * 26} 70 c -10 -12, 10 -20, 0 -32 c -8 -10, 6 -16, 2 -24`}
          fill="none"
          className="stroke-(--ink-subtle)"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity={0.6}
        />
      ))}
      <defs>
        <clipPath id={`${uid}-glass`}>
          <path d="M104 86 H236 L220 238 Q218 246 210 246 H130 Q122 246 120 238 Z" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${uid}-glass)`}>
        <rect x={100} y={86} width={140} height={160} className="fill-(--surface-2)" />
        {layers.map((layer, i) => {
          y -= layer.h;
          return (
            <rect
              key={i}
              x={100}
              y={y}
              width={140}
              height={layer.h}
              className="fill-(--project)"
              opacity={layer.opacity}
            />
          );
        })}
        <rect x={100} y={y - 16} width={140} height={16} className="fill-(--bg-elevated)" />
      </g>
      <path
        d="M104 86 H236 L220 238 Q218 246 210 246 H130 Q122 246 120 238 Z"
        fill="none"
        className="stroke-(--ink)"
        strokeWidth="1.6"
        opacity={0.7}
      />
      <path
        d="M116 96 L128 230"
        className="stroke-(--surface)"
        strokeWidth="5"
        strokeLinecap="round"
        opacity={0.55}
      />
      {/* layer labels */}
      {['Tea', 'Milk', 'Foam'].map((label, i) => (
        <g key={label}>
          <line
            x1={238}
            y1={[210, 164, 129][i]}
            x2={262}
            y2={[210, 164, 129][i]}
            className="stroke-(--line-strong)"
          />
          <Label x={268} y={[213, 167, 132][i]}>{`0${i + 1} ${label}`}</Label>
        </g>
      ))}
      {/* order rail */}
      <Panel x={336} y={40} w={124} h={220} r={12} />
      <Label x={350} y={64}>
        Order status
      </Label>
      <line x1={358} y1={88} x2={358} y2={222} className="stroke-(--line-strong)" />
      {['Confirmed', 'Preparing', 'Ready'].map((status, i) => (
        <g key={status} transform={`translate(358 ${92 + i * 62})`}>
          <circle
            r={7}
            className={i < 2 ? 'fill-(--project)' : 'fill-(--surface) stroke-(--line-strong)'}
          />
          <Label x={16} y={4}>
            {status}
          </Label>
        </g>
      ))}
      <rect x={350} y={232} width={96} height={16} rx={8} className="fill-(--surface-2)" />
      <Label x={358} y={243} style={{ fontSize: 8 }}>
        Live · no refresh
      </Label>
    </Frame>
  );
}

function Ottoman({ uid }: { uid: string }) {
  const eras = ['Rise', 'Expansion', 'Glory', 'Transformation', 'Decline', 'Legacy'];
  return (
    <Frame
      uid={uid}
      label="Representative illustration of The Ottoman Empire 1299–1922: a stylised skyline silhouette at dusk above a six-century timeline divided into Rise, Expansion, Glory, Transformation, Decline and Legacy."
    >
      <circle cx={360} cy={74} r={30} className="fill-(--project-soft)" />
      <circle cx={360} cy={74} r={18} className="fill-(--project)" opacity={0.55} />
      <g className="fill-(--ink)" opacity={0.82}>
        {/* domes and minarets */}
        <rect x={40} y={160} width={400} height={40} />
        <path d="M150 160 a 52 52 0 0 1 104 0 Z" />
        <path d="M110 160 a 26 26 0 0 1 52 0 Z" />
        <path d="M244 160 a 26 26 0 0 1 52 0 Z" />
        <path d="M296 166 a 20 20 0 0 1 40 0 Z" />
        <path d="M70 168 a 18 18 0 0 1 36 0 Z" />
        {[96, 186, 216, 308, 352].map((x, i) => (
          <g key={x}>
            <rect
              x={x}
              y={[96, 70, 70, 100, 112][i]}
              width={6}
              height={200 - [96, 70, 70, 100, 112][i]}
            />
            <path
              d={`M${x - 1} ${[96, 70, 70, 100, 112][i]} L${x + 3} ${[80, 52, 52, 84, 96][i]} L${x + 7} ${[96, 70, 70, 100, 112][i]} Z`}
            />
          </g>
        ))}
      </g>
      <rect x={20} y={200} width={440} height={4} className="fill-(--project)" opacity={0.5} />
      {[0, 1, 2].map((i) => (
        <path
          key={i}
          d={`M${60 + i * 140} ${214 + i * 3} q 20 -6 40 0 t 40 0`}
          fill="none"
          className="stroke-(--line-strong)"
          strokeWidth="1.2"
        />
      ))}
      {/* timeline */}
      <line x1={36} y1={250} x2={444} y2={250} className="stroke-(--line-strong)" />
      {eras.map((era, i) => {
        const x = 36 + i * (408 / 5);
        return (
          <g key={era}>
            <line
              x1={x}
              y1={244}
              x2={x}
              y2={256}
              className="stroke-(--project)"
              strokeWidth="1.6"
            />
            <Label
              x={x}
              y={272}
              anchor={i === 0 ? 'start' : i === eras.length - 1 ? 'end' : 'middle'}
              style={{ fontSize: 8 }}
            >
              {era}
            </Label>
          </g>
        );
      })}
      <Label x={36} y={238} style={{ fontSize: 9 }}>
        1299
      </Label>
      <Label x={444} y={238} anchor="end" style={{ fontSize: 9 }}>
        1922
      </Label>
      <Label x={36} y={36}>
        Cited sources · fact / legend labels
      </Label>
    </Frame>
  );
}

function ChatMate({ uid }: { uid: string }) {
  return (
    <Frame
      uid={uid}
      label="Representative illustration of ChatMate: a desktop chat window with a contact list and a conversation of message bubbles."
    >
      <rect
        x={24}
        y={20}
        width={432}
        height={260}
        rx={12}
        className="fill-(--bg-elevated) stroke-(--line-strong)"
      />
      <rect x={24} y={20} width={432} height={28} rx={12} className="fill-(--surface-2)" />
      <rect x={24} y={36} width={432} height={12} className="fill-(--surface-2)" />
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={42 + i * 14} cy={34} r={4} className="fill-(--line-strong)" />
      ))}
      <Label x={240} y={37} anchor="middle">
        ChatMate
      </Label>
      <line x1={150} y1={48} x2={150} y2={280} className="stroke-(--line)" />
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i} transform={`translate(36 ${62 + i * 42})`}>
          {i === 1 ? (
            <rect x={-6} y={-8} width={112} height={36} rx={8} className="fill-(--project-soft)" />
          ) : null}
          <circle
            cx={12}
            cy={10}
            r={11}
            className={i === 1 ? 'fill-(--project)' : 'fill-(--line-strong)'}
            opacity={i === 1 ? 0.8 : 0.6}
          />
          <rect
            x={30}
            y={4}
            width={56}
            height={5}
            rx={2.5}
            className="fill-(--ink)"
            opacity={0.55}
          />
          <rect x={30} y={14} width={40} height={4} rx={2} className="fill-(--line-strong)" />
        </g>
      ))}
      {[
        { x: 170, y: 66, w: 150, mine: false },
        { x: 296, y: 104, w: 140, mine: true },
        { x: 170, y: 142, w: 118, mine: false },
        { x: 262, y: 180, w: 174, mine: true },
      ].map((bubble, i) => (
        <g key={i}>
          <rect
            x={bubble.x}
            y={bubble.y}
            width={bubble.w}
            height={28}
            rx={12}
            className={bubble.mine ? 'fill-(--project)' : 'fill-(--surface) stroke-(--line)'}
            opacity={bubble.mine ? 0.85 : 1}
          />
          <rect
            x={bubble.x + 12}
            y={bubble.y + 12}
            width={bubble.w - 40}
            height={4}
            rx={2}
            className={bubble.mine ? 'fill-(--surface)' : 'fill-(--line-strong)'}
            opacity={0.9}
          />
        </g>
      ))}
      <rect
        x={166}
        y={236}
        width={276}
        height={30}
        rx={15}
        className="fill-(--surface) stroke-(--line)"
      />
      <rect x={182} y={249} width={120} height={4} rx={2} className="fill-(--line)" />
      <circle cx={424} cy={251} r={10} className="fill-(--project)" />
      <path
        d="M420 251 h8 m-3 -3 l3 3 l-3 3"
        fill="none"
        className="stroke-(--surface)"
        strokeWidth="1.5"
      />
    </Frame>
  );
}

const illustrations: Record<IllustrationName, (props: { uid: string }) => JSX.Element> = {
  plantops: PlantOps,
  infravision: InfraVision,
  linguasi: LinguaSI,
  omnimanager: OmniManager,
  greenfactory: GreenFactory,
  muhibbi: Muhibbi,
  ottoman: Ottoman,
  chatmate: ChatMate,
};

/**
 * Renders a project illustration tinted with the project's hue. `caption` adds the
 * visible “representative illustration” note used on case-study pages.
 */
export function ProjectIllustration({
  name,
  hue,
  className,
  caption,
  idSuffix = '',
}: {
  name: IllustrationName;
  hue: number;
  className?: string;
  caption?: boolean;
  /** Needed only when the same illustration appears twice on one page. */
  idSuffix?: string;
}) {
  const Illustration = illustrations[name];
  const uid = `il-${name}${idSuffix ? `-${idSuffix}` : ''}`;
  const style = { '--hue': hue } as CSSProperties;
  if (!caption) {
    return (
      <div className={cn('project-tint', className)} style={style}>
        <Illustration uid={uid} />
      </div>
    );
  }
  return (
    <figure className={cn('project-tint', className)} style={style}>
      <div className="overflow-hidden rounded-[var(--radius-card)] border border-line">
        <Illustration uid={uid} />
      </div>
      <figcaption className="mt-3 font-mono text-xs tracking-wide text-ink-subtle">
        Fig. — Representative illustration drawn from the project’s documented features; not a
        screenshot of a deployed product.
      </figcaption>
    </figure>
  );
}
