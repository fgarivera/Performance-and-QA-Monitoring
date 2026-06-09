/* global window, React */
const { useState: useStateS, useEffect: useEffectS, useMemo: useMemoS } = React;

// Each item declares the roles that can see it. "Admin" sees everything.
// "homeFor" marks the landing screen per role.
const ROLES = ["Admin", "Manager", "Supervisor", "QA Analyst"];
const ALL = ROLES;

const NAV = [
  { group: "Monitor", items: [
    { key: "overview", label: "Overview",          icon: window.I.layout,    homeFor: "Manager",    roleFor: ["Manager","Admin"] },
    { key: "live",     label: "Live Monitoring",   icon: window.I.activity, homeFor: "Supervisor", roleFor: ["Supervisor","Manager","Admin"] },
    { key: "queue",    label: "Review Queue",      icon: window.I.inbox,    homeFor: "QA Analyst", roleFor: ["QA Analyst","Supervisor","Admin"], badge: "queueCount" },
    { key: "gating",   label: "AI Response Gating",icon: window.I.zap,      roleFor: ["Supervisor","Manager","Admin"], badge: "gatingPending" },
  ]},
  { group: "Performance", items: [
    { key: "agents",   label: "Agents",             icon: window.I.users,   roleFor: ["Manager","Supervisor","QA Analyst","Admin"] },
    { key: "trends",   label: "Trends & Analytics", icon: window.I.trends,  roleFor: ["Manager","Admin"] },
    { key: "reports",  label: "Reports",            icon: window.I.reports, roleFor: ["Manager","Admin"] },
  ]},
  { group: "QA Operations", items: [
    { key: "sampling",  label: "QA Sampling",     icon: window.I.shuffle, roleFor: ["QA Analyst","Manager","Admin"] },
    { key: "framework", label: "QA Framework",    icon: window.I.scale,   roleFor: ["Manager","Admin"] },
    { key: "knowledge", label: "Intelligence Center", icon: window.I.reports, roleFor: ["Manager","Admin"] },
    { key: "audit",     label: "Audit Log",       icon: window.I.audit,   roleFor: ["Admin","QA Analyst"] },
  ]},
  { group: "Settings", items: [
    { key: "integrations", label: "Integrations",           icon: window.I.plug,   roleFor: ["Admin"], homeFor: "Admin" },
    { key: "alerts",       label: "Alerts & Notifications", icon: window.I.bell,   roleFor: ["Manager","Admin"] },
    { key: "team",         label: "Team & Permissions",     icon: window.I.shield, roleFor: ["Admin"] },
  ]},
];

const ROLE_DESCRIPTIONS = {
  "Admin":      { sub:"Platform configuration & governance", color:"violet" },
  "Manager":    { sub:"Team health, exports, coaching",      color:"sky"    },
  "Supervisor": { sub:"Live floor, intervention",            color:"emerald"},
  "QA Analyst": { sub:"Review queue, validate scores",       color:"amber"  },
};

// Which screens actually show the date range / channel filters in the top bar.
// Screens not listed here render the topbar without that control.
const SHOWS_DATE_RANGE = ["overview","queue","agents","scorecard","trends","audit"];
// Scorecard is a single-agent view, and Trends already plots each channel
// as a separate series, so the topbar channel chips don't make sense there.
const SHOWS_CHANNELS   = ["overview","live","queue","gating","agents"];

const BREADCRUMBS = {
  overview:    ["Monitor", "Overview"],
  live:        ["Monitor", "Live Monitoring"],
  queue:       ["Monitor", "Review Queue"],
  gating:      ["Monitor", "AI Response Gating"],
  agents:      ["Performance", "Agents"],
  scorecard:   ["Performance", "Agents", "Mark Villanueva"],
  trends:      ["Performance", "Trends & Analytics"],
  reports:     ["Performance", "Reports"],
  sampling:    ["QA Operations", "QA Sampling"],
  framework:   ["QA Operations", "QA Framework"],
  knowledge:   ["QA Operations", "Intelligence Center"],
  audit:       ["QA Operations", "Audit Log"],
  integrations:["Settings", "Integrations"],
  alerts:      ["Settings", "Alerts & Notifications"],
  team:        ["Settings", "Team & Permissions"],
};

const Sidebar = ({ active, onNav, role, onRoleClick, queueCount, gatingPending, workspace, setWorkspace }) => {
  const [wsOpen, setWsOpen] = useStateS(false);
  const [searchOpen, setSearchOpen] = useStateS(false);
  return (
    <aside className="w-[240px] bg-white border-r border-slate-200 flex flex-col flex-shrink-0">
      {/* Brand */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-[var(--accent)] text-white flex items-center justify-center font-bold text-sm">P</div>
          <div className="flex items-baseline gap-1.5">
            <div className="text-[15px] font-semibold text-slate-900 tracking-tight">QA Monitor</div>
            <span className="text-[9px] font-bold uppercase tracking-wider text-[var(--accent-deep)] bg-[var(--accent-tint)] px-1.5 py-0.5 rounded">MVP</span>
          </div>
        </div>
        <div className="text-[11px] text-slate-500 mt-0.5 ml-9">by PopAI</div>
      </div>

      {/* Workspace */}
      <div className="px-3 pb-2 relative">
        <button onClick={() => setWsOpen(o=>!o)} className="w-full flex items-center justify-between px-2.5 py-2 rounded-md border border-slate-200 hover:bg-slate-50">
          <div className="text-left min-w-0">
            <div className="text-[11px] text-slate-500 truncate">Workspace</div>
            <div className="text-xs font-semibold text-slate-900 truncate">{workspace.name}</div>
          </div>
          <window.I.chevDown className="w-3.5 h-3.5 text-slate-400 flex-shrink-0"/>
        </button>
        {wsOpen && (
          <div className="absolute left-3 right-3 top-full mt-1 bg-white border border-slate-200 rounded-md shadow-lg z-20 overflow-hidden">
            {window.WORKSPACES.map(w => (
              <button key={w.id} onClick={() => { setWorkspace(w); setWsOpen(false); }}
                      className={`w-full text-left px-3 py-2 hover:bg-slate-50 ${w.id===workspace.id ? "bg-[var(--accent-tint)]/40" : ""}`}>
                <div className="text-xs font-semibold text-slate-900">{w.name}</div>
                <div className="text-[11px] text-slate-500">{w.members} members</div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Search */}
      <div className="px-3 pb-3 relative">
        <button onClick={()=>setSearchOpen(o=>!o)}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-slate-50 hover:bg-slate-100 text-left">
          <window.I.search className="w-3.5 h-3.5 text-slate-400"/>
          <span className="text-xs text-slate-500 flex-1">Search</span>
          <span className="text-[10px] text-slate-400 font-mono bg-white border border-slate-200 px-1 rounded">⌘K</span>
        </button>
        {searchOpen && (
          <div className="absolute left-3 right-3 top-full mt-1 bg-white border border-slate-200 rounded-md shadow-lg z-20 overflow-hidden">
            <div className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wide text-slate-400 border-b border-slate-100">Recent</div>
            {[
              "Maria Dela Cruz — agent",
              "VOICE-2026-04-29-04821",
              "Daily QA Performance — Apr 28",
              "Compliance disclosure (rule)",
            ].map(t=>(
              <button key={t} className="w-full text-left px-3 py-2 hover:bg-slate-50 text-xs text-slate-700">{t}</button>
            ))}
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 pb-4 scroll-thin">
        {/* Role eyebrow — tells the user which mode they're viewing in */}
        <div className="px-2 pt-1 pb-2">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--accent-deep)]">{role}</div>
          <div className="text-[10px] text-slate-500">{ROLE_DESCRIPTIONS[role]?.sub}</div>
        </div>
        {NAV.map(group => {
          const visible = group.items.filter(it => !it.roleFor || it.roleFor.includes(role));
          if (visible.length === 0) return null;
          return (
            <div key={group.group} className="mb-4">
              <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">{group.group}</div>
              {visible.map(it => {
                const isActive = active === it.key;
                const isHome = it.homeFor === role;
                const badge = it.badge === "queueCount" ? queueCount
                            : it.badge === "gatingPending" ? gatingPending
                            : null;
                const Ico = it.icon;
                return (
                  <button key={it.key} onClick={() => onNav(it.key)}
                          className={`relative w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md mb-0.5 text-left
                            ${isActive ? "bg-[var(--accent-tint)] text-[var(--accent-deep)]" : "text-slate-700 hover:bg-slate-50"}`}>
                    {isActive && <span className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-r bg-[var(--accent)]"/>}
                    <Ico className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-[var(--accent)]" : "text-slate-400"}`}/>
                    <span className={`text-[13px] flex-1 ${isHome && !isActive ? "font-semibold text-slate-900" : ""}`}>{it.label}</span>
                    {isHome && <span className="text-[9px] font-semibold uppercase tracking-wider text-[var(--accent-deep)]">Home</span>}
                    {badge != null && (
                      <span className={`text-[10px] font-bold tabular-nums px-1.5 py-0.5 rounded ${isActive ? "bg-[var(--accent)] text-white" : "bg-slate-200 text-slate-700"}`}>{badge}</span>
                    )}
                  </button>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="px-3 py-3 border-t border-slate-100">
        <button onClick={onRoleClick} className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-slate-50">
          <window.AgentAvatar name="Maria Dela Cruz" size="sm"/>
          <div className="flex-1 text-left min-w-0">
            <div className="text-xs font-semibold text-slate-900 truncate">Maria Dela Cruz</div>
            <div className="text-[10px] text-slate-500 flex items-center gap-1">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--accent)]"/>
              {role}
            </div>
          </div>
          <window.I.chevDown className="w-3.5 h-3.5 text-slate-400"/>
        </button>
      </div>
    </aside>
  );
};

const TopBar = ({ active, dateRange, setDateRange,
                  customStart, setCustomStart, customEnd, setCustomEnd,
                  channels, toggleChannel,
                  role, setRole, addToast, onCrumbClick, scorecardName,
                  notifOpen, setNotifOpen, exportOpen, setExportOpen, roleSwitcherOpen, setRoleSwitcherOpen }) => {
  const crumbs = active === "scorecard"
    ? ["Performance", "Agents", scorecardName || "Mark Villanueva"]
    : (BREADCRUMBS[active] || ["—"]);
  const ranges = ["Today","7d","30d","Custom"];
  const channelChips = ["All","Chat","Email","Voice"];
  const [customOpen, setCustomOpen] = React.useState(false);
  // Local edit copies so users can revise both fields before applying
  const [csLocal, setCsLocal] = React.useState(customStart || "2026-04-22");
  const [ceLocal, setCeLocal] = React.useState(customEnd   || "2026-04-29");
  React.useEffect(() => { setCsLocal(customStart); }, [customStart]);
  React.useEffect(() => { setCeLocal(customEnd);   }, [customEnd]);
  const customLabel = (() => {
    if (dateRange !== "Custom") return "Custom";
    const fmt = (s) => {
      const d = new Date(s);
      if (isNaN(d)) return s;
      return d.toLocaleDateString("en-US", { month:"short", day:"numeric" });
    };
    return `${fmt(customStart)} – ${fmt(customEnd)}`;
  })();
  const customDays = (() => {
    const a = new Date(customStart), b = new Date(customEnd);
    if (isNaN(a) || isNaN(b)) return null;
    return Math.max(1, Math.round((b - a) / 86400000) + 1);
  })();
  const validRange = customDays != null && new Date(customStart) <= new Date(customEnd);
  // Close the custom popover on outside click + Escape
  React.useEffect(() => {
    if (!customOpen) return;
    const onDoc = (e) => {
      if (!e.target.closest("[data-custom-range]")) setCustomOpen(false);
    };
    const onKey = (e) => { if (e.key === "Escape") setCustomOpen(false); };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDoc); document.removeEventListener("keydown", onKey); };
  }, [customOpen]);

  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center px-5 gap-4 flex-shrink-0 relative z-30">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1.5 min-w-0">
        {crumbs.map((c, i) => (
          <React.Fragment key={i}>
            {i > 0 && <window.I.chevRight className="w-3 h-3 text-slate-300 flex-shrink-0"/>}
            <button onClick={() => i === 1 && active === "scorecard" && onCrumbClick("agents")}
                    className={`text-sm truncate ${i === crumbs.length-1 ? "text-slate-900 font-medium" : "text-slate-500 hover:text-slate-700"}`}>
              {c}
            </button>
          </React.Fragment>
        ))}
      </div>

      {/* Role switcher — moved left so toasts don't cover it */}
      <div className="hidden lg:flex items-center bg-slate-50 rounded-md p-0.5 border border-slate-200">
        {[
          { r: "Admin",      home: "Integrations", desc: "Platform configuration & governance." },
          { r: "Manager",    home: "Overview",     desc: "Team health, exports, coaching plans." },
          { r: "Supervisor", home: "Live Monitoring", desc: "Watches live streams, intervenes on risk." },
          { r: "QA Analyst", home: "Review Queue", desc: "Validates / overrides AI scores." },
        ].map(o => {
          const on = role === o.r;
          return (
            <button key={o.r}
                    onClick={() => { setRole(o.r); addToast(`Now viewing as ${o.r}. Home: ${o.home}.`); }}
                    title={o.desc}
                    className={`text-xs px-2.5 py-1 rounded inline-flex items-center gap-1.5 transition ${
                      on ? "bg-white shadow-sm text-slate-900 font-semibold" : "text-slate-500 hover:text-slate-700"
                    }`}>
              {on && <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]"/>}
              {o.r}
            </button>
          );
        })}
      </div>

      <div className="flex-1"/>

      {/* Date range — only on screens that show time-windowed data */}
      {SHOWS_DATE_RANGE.includes(active) && (
      <div className="hidden md:flex items-center bg-slate-50 rounded-md p-0.5 border border-slate-200 relative" data-popover-anchor data-custom-range>
        {ranges.map(r => {
          const isCustom = r === "Custom";
          const active = dateRange === r;
          const label = isCustom ? customLabel : r;
          return (
            <button key={r} onClick={(e) => {
              e.stopPropagation();
              if (isCustom) {
                setCustomOpen(o => !o);
              } else {
                setDateRange(r);
                setCustomOpen(false);
              }
            }}
                    className={`text-xs px-2.5 py-1 rounded inline-flex items-center gap-1 ${active ? "bg-white shadow-sm text-slate-900 font-semibold" : "text-slate-500 hover:text-slate-700"}`}>
              {label}
              {isCustom && (
                <window.I.chevDown className={`w-3 h-3 transition-transform ${customOpen ? "rotate-180" : ""}`}/>
              )}
            </button>
          );
        })}
        {customOpen && (
          <div className="absolute right-0 top-full mt-1 w-72 bg-white border border-slate-200 rounded-lg shadow-lg z-40 p-3">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-2">Custom range</div>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <label className="block">
                <div className="text-[10px] text-slate-500 mb-1">Start</div>
                <input type="date" value={csLocal} max={ceLocal}
                       onChange={(e)=>setCsLocal(e.target.value)}
                       className="w-full text-xs border border-slate-200 rounded px-2 py-1.5 focus:outline-none focus:border-[var(--accent)]"/>
              </label>
              <label className="block">
                <div className="text-[10px] text-slate-500 mb-1">End</div>
                <input type="date" value={ceLocal} min={csLocal}
                       onChange={(e)=>setCeLocal(e.target.value)}
                       className="w-full text-xs border border-slate-200 rounded px-2 py-1.5 focus:outline-none focus:border-[var(--accent)]"/>
              </label>
            </div>
            {/* Quick presets */}
            <div className="flex flex-wrap gap-1 mb-3">
              {[
                { label:"Last 14d",  s:"2026-04-15", e:"2026-04-28" },
                { label:"Last 30d",  s:"2026-03-30", e:"2026-04-28" },
                { label:"Last 90d",  s:"2026-01-29", e:"2026-04-28" },
                { label:"This month",s:"2026-04-01", e:"2026-04-29" },
                { label:"Last month",s:"2026-03-01", e:"2026-03-31" },
                { label:"YTD",       s:"2026-01-01", e:"2026-04-29" },
              ].map(p => (
                <button key={p.label} onClick={()=>{ setCsLocal(p.s); setCeLocal(p.e); }}
                        className="text-[10px] px-1.5 py-0.5 rounded border border-slate-200 text-slate-600 hover:bg-slate-50">
                  {p.label}
                </button>
              ))}
            </div>
            <div className="flex items-center justify-between gap-2">
              <div className="text-[11px] text-slate-500 tabular-nums">
                {(() => {
                  const a=new Date(csLocal), b=new Date(ceLocal);
                  if (isNaN(a)||isNaN(b)) return "Pick both dates";
                  if (a > b) return <span className="text-rose-600">End must be after start</span>;
                  return `${Math.round((b-a)/86400000)+1} days selected`;
                })()}
              </div>
              <div className="flex items-center gap-1">
                <button onClick={()=>{ setCustomOpen(false); }}
                        className="text-[11px] px-2 py-1 rounded text-slate-600 hover:bg-slate-50">Cancel</button>
                <button
                  onClick={()=>{
                    const a=new Date(csLocal), b=new Date(ceLocal);
                    if (isNaN(a)||isNaN(b)||a>b) return;
                    setCustomStart(csLocal); setCustomEnd(ceLocal);
                    setDateRange("Custom"); setCustomOpen(false);
                    addToast && addToast(`Range applied: ${csLocal} → ${ceLocal}`, "ok");
                  }}
                  disabled={(() => { const a=new Date(csLocal), b=new Date(ceLocal); return isNaN(a)||isNaN(b)||a>b; })()}
                  className="text-[11px] px-2.5 py-1 rounded bg-[var(--accent)] text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed">
                  Apply
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      )}

      {/* Channel chips — only on screens that show interaction data */}
      {SHOWS_CHANNELS.includes(active) && (
      <div className="hidden lg:flex items-center gap-1">
        {channelChips.map(c => {
          const on = channels.includes(c);
          return (
            <button key={c} onClick={() => toggleChannel(c)}
                    className={`text-xs px-2 py-1 rounded-md border flex items-center gap-1
                      ${on ? "bg-[var(--accent-tint)] border-[var(--accent-border)] text-[var(--accent-deep)]" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
              {c !== "All" && <window.ChannelIcon value={c} className={`w-3 h-3 ${on ? "text-[var(--accent)]" : "text-slate-400"}`}/>}
              {c}
            </button>
          );
        })}
      </div>
      )}

      {/* Notification */}
      <div className="relative">
        <button onClick={() => setNotifOpen(o=>!o)}
                className="relative w-8 h-8 rounded-md hover:bg-slate-100 flex items-center justify-center text-slate-600">
          <window.I.bell className="w-4 h-4"/>
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500"/>
        </button>
        {notifOpen && (
          <div className="absolute right-0 top-full mt-1 w-80 bg-white border border-slate-200 rounded-md shadow-lg z-30">
            <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between">
              <div className="text-xs font-semibold text-slate-900">Notifications</div>
              <button className="text-[11px] text-[var(--accent-deep)] hover:underline">Mark all read</button>
            </div>
            {[
              { color:"rose",   text:"Compliance flag — Mark Villanueva, Voice call #04821", time:"2m" },
              { color:"orange", text:"Sentiment cluster — 4 frustration signals (Angela B.)",   time:"5m" },
              { color:"violet", text:"AI confidence < 50% on CHAT-…08719",                        time:"7m" },
              { color:"sky",    text:"Daily QA summary delivered to 12 recipients",               time:"3h" },
              { color:"emerald",text:"Coaching plan generated for Mark Villanueva",               time:"4h" },
            ].map((n,i)=>(
              <div key={i} className="px-3 py-2 hover:bg-slate-50 border-b border-slate-50 last:border-0 flex gap-2">
                <span className={`w-1.5 h-1.5 rounded-full bg-${n.color}-500 flex-shrink-0 mt-1.5`}/>
                <div className="flex-1 text-xs text-slate-700">{n.text}</div>
                <div className="text-[10px] text-slate-400">{n.time}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Export */}
      <div className="relative">
        <window.Btn kind="primary" size="sm" icon={<window.I.download className="w-3.5 h-3.5"/>} onClick={() => setExportOpen(o=>!o)}>Export</window.Btn>
        {exportOpen && (
          <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-slate-200 rounded-md shadow-lg z-30 overflow-hidden">
            {[
              { l:"Export as PDF",   i:window.I.download, t:"Generating PDF…" },
              { l:"Export as CSV",   i:window.I.download, t:"CSV download started." },
              { l:"Send to Slack",   i:window.I.send,     t:"Posted to #cx-qa-daily." },
            ].map(o=>(
              <button key={o.l} onClick={() => { setExportOpen(false); addToast(o.t); }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-slate-50 text-slate-700">
                <o.i className="w-3.5 h-3.5 text-slate-400"/> {o.l}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};

Object.assign(window, { Sidebar, TopBar, BREADCRUMBS });
