/* global window, React */
const { useState, useEffect, useMemo, useRef } = React;

// ===== ICONS (inline SVGs — lucide-react not loaded as react components, so we inline) =====
const Icon = ({ d, className = "w-4 h-4", strokeWidth = 1.75, fill = "none" }) => (
  <svg viewBox="0 0 24 24" className={className} fill={fill} stroke="currentColor"
       strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">{d}</svg>
);

const I = {
  // navigation
  layout:    (p)=><Icon {...p} d={<><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></>}/>,
  activity:  (p)=><Icon {...p} d={<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>}/>,
  inbox:     (p)=><Icon {...p} d={<><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11Z"/></>}/>,
  users:     (p)=><Icon {...p} d={<><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>}/>,
  trends:    (p)=><Icon {...p} d={<><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></>}/>,
  reports:   (p)=><Icon {...p} d={<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="14" y2="17"/></>}/>,
  shuffle:   (p)=><Icon {...p} d={<><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/><line x1="4" y1="4" x2="9" y2="9"/></>}/>,
  scale:     (p)=><Icon {...p} d={<><path d="M16 16.5V21M8 16.5V21M16 3v3M8 3v3M3 9h18M5 9l-2 7h6l-2-7M19 9l-2 7h6l-2-7"/></>}/>,
  audit:     (p)=><Icon {...p} d={<><path d="M9 11l3 3 8-8"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></>}/>,
  plug:      (p)=><Icon {...p} d={<><path d="M9 2v6"/><path d="M15 2v6"/><path d="M6 8h12v4a6 6 0 0 1-12 0Z"/><path d="M12 18v4"/></>}/>,
  bell:      (p)=><Icon {...p} d={<><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10 21a2 2 0 0 0 4 0"/></>}/>,
  shield:    (p)=><Icon {...p} d={<path d="M12 2 4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5z"/>}/>,
  settings:  (p)=><Icon {...p} d={<><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09A1.65 1.65 0 0 0 15 4.6a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"/></>}/>,
  search:    (p)=><Icon {...p} d={<><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>}/>,
  chevDown:  (p)=><Icon {...p} d={<polyline points="6 9 12 15 18 9"/>}/>,
  chevRight: (p)=><Icon {...p} d={<polyline points="9 6 15 12 9 18"/>}/>,
  chevLeft:  (p)=><Icon {...p} d={<polyline points="15 6 9 12 15 18"/>}/>,
  chat:      (p)=><Icon {...p} d={<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>}/>,
  mail:      (p)=><Icon {...p} d={<><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="22 6 12 13 2 6"/></>}/>,
  phone:     (p)=><Icon {...p} d={<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92Z"/>}/>,
  smile:     (p)=><Icon {...p} d={<><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></>}/>,
  meh:       (p)=><Icon {...p} d={<><circle cx="12" cy="12" r="10"/><line x1="8" y1="15" x2="16" y2="15"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></>}/>,
  frown:     (p)=><Icon {...p} d={<><circle cx="12" cy="12" r="10"/><path d="M16 16s-1.5-2-4-2-4 2-4 2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></>}/>,
  arrowUp:   (p)=><Icon {...p} d={<><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></>}/>,
  arrowDown: (p)=><Icon {...p} d={<><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></>}/>,
  triUp:     (p)=><Icon {...p} d={<polygon points="12 4 22 20 2 20"/>} fill="currentColor"/>,
  triDown:   (p)=><Icon {...p} d={<polygon points="12 20 2 4 22 4"/>} fill="currentColor"/>,
  minus:     (p)=><Icon {...p} d={<line x1="5" y1="12" x2="19" y2="12"/>}/>,
  x:         (p)=><Icon {...p} d={<><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>}/>,
  check:     (p)=><Icon {...p} d={<polyline points="20 6 9 17 4 12"/>}/>,
  alert:     (p)=><Icon {...p} d={<><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>}/>,
  info:      (p)=><Icon {...p} d={<><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></>}/>,
  download:  (p)=><Icon {...p} d={<><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></>}/>,
  filter:    (p)=><Icon {...p} d={<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>}/>,
  send:      (p)=><Icon {...p} d={<><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></>}/>,
  edit:      (p)=><Icon {...p} d={<><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z"/></>}/>,
  plus:      (p)=><Icon {...p} d={<><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>}/>,
  zap:       (p)=><Icon {...p} d={<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>}/>,
  bot:       (p)=><Icon {...p} d={<><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="16" x2="8" y2="16"/><line x1="16" y1="16" x2="16" y2="16"/></>}/>,
  user:      (p)=><Icon {...p} d={<><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>}/>,
  dot:       (p)=><Icon {...p} d={<circle cx="12" cy="12" r="3"/>} fill="currentColor"/>,
  link:      (p)=><Icon {...p} d={<><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></>}/>,
  ext:       (p)=><Icon {...p} d={<><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></>}/>,
  command:   (p)=><Icon {...p} d={<path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"/>}/>,
  flag:      (p)=><Icon {...p} d={<><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></>}/>,
  clock:     (p)=><Icon {...p} d={<><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>}/>,
  more:      (p)=><Icon {...p} d={<><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></>}/>,
  refresh:   (p)=><Icon {...p} d={<><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></>}/>,
  sliders:   (p)=><Icon {...p} d={<><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></>}/>,
  copy:      (p)=><Icon {...p} d={<><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></>}/>,
  intervene: (p)=><Icon {...p} d={<><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></>}/>,
};

// ===== UTILITIES =====
const scoreColor = (s) => s >= 90 ? "emerald" : s >= 80 ? "lime" : s >= 70 ? "amber" : "rose";
const scoreClasses = (s) => {
  const c = scoreColor(s);
  return ({
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
    lime:    "bg-lime-50 text-lime-700 border-lime-200",
    amber:   "bg-amber-50 text-amber-700 border-amber-200",
    rose:    "bg-rose-50 text-rose-700 border-rose-200",
  })[c];
};

const monoColors = ["bg-violet-100 text-violet-700","bg-sky-100 text-sky-700","bg-emerald-100 text-emerald-700","bg-amber-100 text-amber-700","bg-rose-100 text-rose-700","bg-indigo-100 text-indigo-700","bg-teal-100 text-teal-700","bg-fuchsia-100 text-fuchsia-700"];
const colorForName = (name) => {
  let h = 0; for (let i=0;i<name.length;i++) h = (h*31 + name.charCodeAt(i)) >>> 0;
  return monoColors[h % monoColors.length];
};
const initials = (name) => name.split(" ").map(n => n[0]).slice(0,2).join("").toUpperCase();

// ===== PRIMITIVES =====
const ScorePill = ({ value, size = "sm" }) => {
  const cls = scoreClasses(value);
  const sz = size === "lg" ? "text-2xl px-3 py-1" : size === "md" ? "text-base px-2.5 py-0.5" : "text-xs px-2 py-0.5";
  return <span className={`inline-flex items-center font-semibold tabular-nums rounded-md border ${cls} ${sz}`}>{value}</span>;
};

const RiskBadge = ({ level }) => {
  const map = {
    Low:      "bg-slate-50 text-slate-600 border-slate-200",
    Medium:   "bg-amber-50 text-amber-700 border-amber-200",
    High:     "bg-orange-50 text-orange-700 border-orange-200",
    Critical: "bg-rose-50 text-rose-700 border-rose-200",
  };
  return <span className={`inline-flex items-center text-[11px] font-semibold uppercase tracking-wide rounded px-1.5 py-0.5 border ${map[level]}`}>{level}</span>;
};

const SentimentTag = ({ value, compact }) => {
  const map = {
    Positive: { Icon:I.smile, cls:"text-emerald-600 bg-emerald-50 border-emerald-200" },
    Neutral:  { Icon:I.meh,   cls:"text-sky-700 bg-sky-50 border-sky-200" },
    Negative: { Icon:I.frown, cls:"text-rose-700 bg-rose-50 border-rose-200" },
  };
  const cfg = map[value];
  const Ico = cfg.Icon;
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-medium rounded-md px-1.5 py-0.5 border ${cfg.cls}`}>
      <Ico className="w-3 h-3"/>{!compact && value}
    </span>
  );
};

const ChannelIcon = ({ value, className="w-4 h-4 text-slate-500" }) => {
  const Ico = value === "Chat" ? I.chat : value === "Voice" ? I.phone : I.mail;
  return <Ico className={className}/>;
};

const AgentAvatar = ({ name, size = "sm" }) => {
  const sz = size === "lg" ? "w-12 h-12 text-base" : size === "md" ? "w-9 h-9 text-sm" : "w-7 h-7 text-[11px]";
  return (
    <div title={name} className={`${sz} ${colorForName(name)} rounded-full flex items-center justify-center font-semibold flex-shrink-0`}>
      {initials(name)}
    </div>
  );
};

const TrendArrow = ({ value }) => {
  const v = String(value).trim();
  const negative = v.startsWith("−") || v.startsWith("-") || v.includes("−");
  const flat = v.startsWith("+0.0") || v === "0" || v === "0.0";
  const cls = flat ? "text-slate-400" : negative ? "text-rose-600" : "text-emerald-600";
  const Ico = flat ? I.minus : negative ? I.triDown : I.triUp;
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-semibold tabular-nums ${cls}`}>
      <Ico className="w-2.5 h-2.5"/> {v.replace(/^[-−+]/,"")}
    </span>
  );
};

const Sparkline = ({ data, color = "var(--accent)", height = 32, width = 88 }) => {
  if (!data || !data.length) return null;
  const vs = data.map(d => d.v);
  const min = Math.min(...vs), max = Math.max(...vs);
  const span = max - min || 1;
  const pts = data.map((d, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((d.v - min) / span) * height;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg width={width} height={height} className="overflow-visible" style={{color}}>
      <polyline fill="none" stroke="currentColor" strokeWidth="1.5" points={pts}/>
    </svg>
  );
};

const Stat = ({ label, value, delta, up, caption, spark, color = "var(--accent)", labelExtra }) => {
  const isPositive = up;
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-4">
      <div className="text-xs font-medium uppercase tracking-wide text-slate-500 flex items-center">{label}{labelExtra}</div>
      <div className="mt-2 flex items-end justify-between gap-3">
        <div>
          <div className="text-3xl font-semibold tabular-nums text-slate-900">{value}</div>
          {caption && <div className="text-xs text-slate-500 mt-1">{caption}</div>}
        </div>
        <Sparkline data={spark} color={color}/>
      </div>
      {delta && (
        <div className="mt-3 flex items-center gap-1.5 text-xs">
          {delta.includes("vs") ? (
            <span className="text-slate-500">{delta}</span>
          ) : (
            <span className={`inline-flex items-center gap-1 font-semibold ${isPositive ? "text-emerald-600" : "text-rose-600"}`}>
              {isPositive ? <I.triUp className="w-2.5 h-2.5"/> : <I.triDown className="w-2.5 h-2.5"/>}
              {delta}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

const Card = ({ title, action, children, className = "" }) => (
  <div className={`rounded-xl border border-slate-200 bg-white shadow-sm ${className}`}>
    {(title || action) && (
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        {typeof title === "string" ? <h3 className="text-base font-semibold text-slate-900">{title}</h3> : title}
        {action}
      </div>
    )}
    <div className="p-4">{children}</div>
  </div>
);

const Btn = ({ kind = "primary", size = "md", children, onClick, className = "", icon, disabled }) => {
  const base = "inline-flex items-center gap-1.5 rounded-md font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed";
  const sz = size === "sm" ? "text-xs px-2.5 py-1.5" : size === "lg" ? "text-sm px-4 py-2.5" : "text-sm px-3 py-2";
  const styles = {
    primary:   "bg-[var(--accent)] text-white hover:bg-[var(--accent-deep)] active:bg-[var(--accent-deeper)]",
    secondary: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 active:bg-slate-100",
    ghost:     "bg-transparent text-slate-700 hover:bg-slate-100 active:bg-slate-200",
    danger:    "bg-rose-600 text-white hover:bg-rose-700",
  };
  return (
    <button disabled={disabled} onClick={onClick} className={`${base} ${sz} ${styles[kind]} ${className}`}>
      {icon}{children}
    </button>
  );
};

const Drawer = ({ open, onClose, children, width = 680 }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40">
      <div className="absolute inset-0 bg-slate-900/30" onClick={onClose}/>
      <div className="absolute right-0 top-0 bottom-0 bg-white shadow-2xl drawer-in flex flex-col"
           style={{ width }}>
        {children}
      </div>
    </div>
  );
};

const Modal = ({ open, onClose, title, children, footer, width = 520 }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-slate-900/40" onClick={onClose}/>
      <div className="relative bg-white rounded-xl shadow-2xl border border-slate-200" style={{ width }}>
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-base font-semibold text-slate-900">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded hover:bg-slate-100">
            <I.x className="w-4 h-4"/>
          </button>
        </div>
        <div className="px-5 py-4">{children}</div>
        {footer && <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 rounded-b-xl flex items-center justify-end gap-2">{footer}</div>}
      </div>
    </div>
  );
};

const Toast = ({ items, dismiss }) => (
  <div className="fixed top-4 right-4 z-[60] flex flex-col gap-2">
    {items.map(t => (
      <div key={t.id} className="toast-in min-w-[260px] max-w-[400px] bg-slate-900 text-white text-sm rounded-lg shadow-lg px-4 py-3 flex items-start gap-2">
        {t.kind === "error" ? <I.alert className="w-4 h-4 text-rose-400 mt-0.5"/> : <I.check className="w-4 h-4 text-emerald-400 mt-0.5"/>}
        <div className="flex-1">{t.text}</div>
        <button className="text-slate-400 hover:text-white" onClick={() => dismiss(t.id)}><I.x className="w-3.5 h-3.5"/></button>
      </div>
    ))}
  </div>
);

const EmptyState = ({ icon, title, sub, cta }) => {
  const Ico = icon || I.inbox;
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
        <Ico className="w-6 h-6"/>
      </div>
      <div className="text-base font-semibold text-slate-900">{title}</div>
      {sub && <div className="text-sm text-slate-500 mt-1 max-w-sm">{sub}</div>}
      {cta && <div className="mt-4">{cta}</div>}
    </div>
  );
};

const LoadingSkeleton = ({ rows = 3, className = "" }) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({length:rows}).map((_,i)=>(
      <div key={i} className="h-4 rounded shimmer"/>
    ))}
  </div>
);

const AIBadge = ({ name }) => (
  <span className="inline-flex items-center gap-1 text-[11px] font-medium px-1.5 py-0.5 rounded bg-violet-50 text-violet-700 border border-violet-200">
    <I.bot className="w-3 h-3"/>{name}
  </span>
);

// ===== InfoTip — small "i" icon with hover/click definition popover =====
// Use sparingly — only on jargon terms (HITL, CQC, Posture, Confidence gap, etc.).
// Hover shows the popover; click locks it open so users can read carefully.
const InfoTip = ({ title, children, side = "top", size = "xs" }) => {
  const [open, setOpen] = useState(false);
  const [locked, setLocked] = useState(false);
  const sizeCls = size === "sm" ? "w-4 h-4 text-[11px]" : "w-3.5 h-3.5 text-[10px]";
  const pos = side === "bottom" ? "top-full mt-1.5" : "bottom-full mb-1.5";
  return (
    <span className="relative inline-flex align-middle">
      <button
        type="button"
        onMouseEnter={() => !locked && setOpen(true)}
        onMouseLeave={() => !locked && setOpen(false)}
        onClick={(e) => {
          e.stopPropagation();
          // Second click while locked → fully close. First click → lock open.
          if (locked) { setLocked(false); setOpen(false); }
          else        { setLocked(true);  setOpen(true);  }
        }}
        className={`${sizeCls} ml-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 inline-flex items-center justify-center font-serif italic font-semibold flex-shrink-0 cursor-help leading-none border border-slate-200`}
        aria-label="More info">
        i
      </button>
      {(open || locked) && (
        <span
          onClick={(e) => e.stopPropagation()}
          className={`absolute left-1/2 -translate-x-1/2 ${pos} w-64 p-2.5 bg-slate-900 text-white text-xs rounded-md shadow-xl z-50 normal-case`}>
          {title && <span className="block font-semibold text-white mb-1">{title}</span>}
          <span className="block text-slate-200 leading-snug font-normal">{children}</span>
        </span>
      )}
    </span>
  );
};

// ===== ScreenHelp — "?" button + side panel with screen orientation =====
const ScreenHelp = ({ content }) => {
  const [open, setOpen] = useState(false);
  if (!content) return null;
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-md bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition"
        aria-label="About this screen">
        <span className="w-4 h-4 rounded-full bg-[var(--accent-tint)] inline-flex items-center justify-center text-[var(--accent-deep)] font-bold text-[10px]">?</span>
        About this screen
      </button>
      <Drawer open={open} onClose={() => setOpen(false)} width={420}>
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--accent-deep)]">Orientation</div>
            <h3 className="text-base font-semibold text-slate-900">{content.title || "About this screen"}</h3>
          </div>
          <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-600 p-1.5 rounded hover:bg-slate-100">
            <I.x className="w-4 h-4"/>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5 scroll-thin">
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Purpose</h4>
            <p className="text-sm text-slate-700 leading-relaxed">{content.purpose}</p>
          </div>
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Who uses this</h4>
            <p className="text-sm text-slate-700 leading-relaxed">{content.who}</p>
          </div>
          {content.actions && content.actions.length > 0 && (
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Common actions</h4>
              <ul className="text-sm text-slate-700 space-y-1.5">
                {content.actions.map((a, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-[var(--accent)] font-bold mt-0.5">→</span>
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {content.terms && content.terms.length > 0 && (
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Key terms</h4>
              <dl className="space-y-2.5">
                {content.terms.map((t) => (
                  <div key={t.term} className="rounded-md border border-slate-200 p-2.5">
                    <dt className="text-xs font-semibold text-slate-900 mb-0.5">{t.term}</dt>
                    <dd className="text-[11px] text-slate-600 leading-snug">{t.def}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
          {content.related && content.related.length > 0 && (
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Related screens</h4>
              <ul className="text-sm space-y-1">
                {content.related.map((r) => (
                  <li key={r}>→ <span className="text-[var(--accent-deep)]">{r}</span></li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="border-t border-slate-100 px-5 py-3 bg-slate-50 text-[11px] text-slate-500">
          New to QA Monitor? <a className="text-[var(--accent-deep)] font-medium hover:underline cursor-pointer">View product tour</a>
        </div>
      </Drawer>
    </>
  );
};

Object.assign(window, {
  I, scoreColor, scoreClasses, colorForName, initials,
  ScorePill, RiskBadge, SentimentTag, ChannelIcon, AgentAvatar, TrendArrow,
  Sparkline, Stat, Card, Btn, Drawer, Modal, Toast, EmptyState, LoadingSkeleton, AIBadge,
  InfoTip, ScreenHelp,
});
