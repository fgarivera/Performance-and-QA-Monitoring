/* global window, React, Recharts */
const { useState: useStateH, useEffect: useEffectH, useMemo: useMemoH, useRef: useRefH } = React;
const { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, AreaChart, Area, ReferenceLine, ReferenceDot, Legend } = Recharts;

// ===== SCREEN 1 — QA OVERVIEW (Manager) =====

// Scale factor and label derived from the global date range.
// Volumes scale by (factor); rates and avg scores stay roughly stable but get
// gentle, deterministic shifts so the numbers feel different per range.
function rangeScale(dateRange, customStart, customEnd) {
  const days = (() => {
    if (dateRange === "Today") return 1;
    if (dateRange === "7d")    return 7;
    if (dateRange === "30d")   return 30;
    if (dateRange === "Custom") {
      const a = new Date(customStart), b = new Date(customEnd);
      if (isNaN(a) || isNaN(b)) return 1;
      return Math.max(1, Math.min(365, Math.round((b - a) / 86400000) + 1));
    }
    return 1;
  })();
  // Sub-linear volume scaling so 30d ≠ 30× exactly (today is a partial day).
  // Effective multiplier ≈ days * 0.92, with first day weighted lighter.
  const factor = days === 1 ? 1 : (days * 0.92);
  return { days, factor };
}
const fmtInt = (n) => Math.round(n).toLocaleString();

const OverviewScreen = ({ goTo, addToast, openAgent, dateRange = "Today", customStart, customEnd }) => {
  const { days, factor } = rangeScale(dateRange, customStart, customEnd);
  const isToday = dateRange === "Today";
  const rangeLabel = (() => {
    if (dateRange === "Today") return "today";
    if (dateRange === "7d")    return "last 7d";
    if (dateRange === "30d")   return "last 30d";
    if (dateRange === "Custom") return `${days}d`;
    return "today";
  })();

  // Hero stats — scale volumes; avg score and coverage stay flat but with a
  // small range-dependent drift so each range feels distinct.
  const interactions = Math.round(3247 * factor);
  const flagged      = Math.round(798 * factor);
  const flagRate     = +(24.6 + (days >= 7 ? -1.4 : 0) + (days >= 30 ? -0.8 : 0)).toFixed(1);
  const avgScore     = +(87.4 + (days >= 7 ? +0.4 : 0) + (days >= 30 ? +0.7 : 0)).toFixed(1);
  const heroStats = [
    { ...window.KPI_HERO[0], value: fmtInt(interactions), caption: rangeLabel,
      delta: isToday ? "+12.0%" : (days >= 30 ? "+8.4% vs prior period" : "+9.7% vs prior period") },
    { ...window.KPI_HERO[1] }, // Coverage stays 100%
    { ...window.KPI_HERO[2], value: avgScore.toFixed(1),
      caption: `across ${fmtInt(interactions)}`,
      delta: isToday ? "−1.2 pts" : (days >= 30 ? "+0.7 pts vs prior" : "+0.4 pts vs prior"),
      up: !isToday },
    { ...window.KPI_HERO[3], value: `${flagRate}%`,
      caption: `${fmtInt(flagged)} flagged`,
      delta: isToday ? "+3.1 pts" : (days >= 30 ? "−0.8 pts vs prior" : "−1.4 pts vs prior"),
      up: !isToday },
  ];

  // Donut + channel breakdown + top issues all scale by factor.
  const donut    = window.HIGH_RISK_DONUT.map(d => ({ ...d, value: Math.round(d.value * factor) }));
  const donutTotal = donut.reduce((s, d) => s + d.value, 0);
  const channels = window.CHANNEL_BREAKDOWN.map(c => ({ ...c, volume: Math.round(c.volume * factor) }));
  const channelMax = Math.max(...channels.map(c => c.volume));
  const topIssues = window.TOP_ISSUES.map(i => ({ ...i, count: Math.round(i.count * factor) }));

  return (
    <div className="space-y-6">
      {/* Hero stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {heroStats.map((k, i) => <window.Stat key={i} {...k}/>)}
      </div>

      {/* Secondary row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Donut */}
        <window.Card title={`High-risk interactions · ${rangeLabel}`} action={<span className="text-xs text-slate-500">{fmtInt(donutTotal)} total</span>}>
          <div className="h-[200px] relative">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={donut} dataKey="value" innerRadius={50} outerRadius={78} paddingAngle={2} stroke="#fff" strokeWidth={2}>
                  {donut.map((d,i)=><Cell key={i} fill={d.color}/>)}
                </Pie>
                <Tooltip contentStyle={{fontSize:12, borderRadius:8, border:"1px solid #e2e8f0"}}/>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <div className="text-2xl font-semibold tabular-nums text-slate-900">{fmtInt(donutTotal)}</div>
              <div className="text-[10px] uppercase tracking-wider text-slate-500">flagged</div>
            </div>
          </div>
          <div className="mt-3 space-y-1.5">
            {donut.map(d => (
              <div key={d.name} className="flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-sm" style={{background:d.color}}/>
                <span className="flex-1 text-slate-700">{d.name}</span>
                <span className="font-semibold tabular-nums text-slate-900">{fmtInt(d.value)}</span>
              </div>
            ))}
          </div>
        </window.Card>

        {/* Channel breakdown */}
        <window.Card title="Channel breakdown" action={<span className="text-xs text-slate-500">volume · avg score</span>}>
          <div className="space-y-4 pt-1">
            {channels.map(c => (
              <div key={c.channel}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-slate-700">
                    <window.ChannelIcon value={c.channel} className="w-3.5 h-3.5 text-slate-400"/>
                    {c.channel}
                    <span className="text-slate-400">·</span>
                    <span className="tabular-nums">{fmtInt(c.volume)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-500">flag {c.flag}%</span>
                    <window.ScorePill value={c.score}/>
                  </div>
                </div>
                {/* Volume bar with score dot */}
                <div className="relative h-2 rounded-full bg-slate-100 overflow-visible">
                  <div className="absolute left-0 top-0 h-full rounded-full bg-[var(--accent)]/70" style={{width: `${(c.volume / channelMax) * 100}%`}}/>
                  <div className="absolute -top-0.5 w-3 h-3 rounded-full border-2 border-white shadow"
                       style={{left: `calc(${c.score}% - 6px)`, background: c.score>=90?"#10b981":c.score>=80?"#84cc16":"#f59e0b"}}
                       title={`avg score ${c.score}`}/>
                </div>
              </div>
            ))}
            <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-100">
              <span>volume bar (% of leader)</span>
              <span>● avg score (0–100)</span>
            </div>
          </div>
        </window.Card>

        {/* Top issues */}
        <window.Card title="Top quality issues" action={<span className="text-xs text-slate-500">{rangeLabel}</span>}>
          <div className="h-[230px] -ml-2" style={{color:"var(--accent)"}}>
            <ResponsiveContainer>
              <BarChart data={topIssues} margin={{top:8,right:8,bottom:24,left:0}}>
                <CartesianGrid stroke="#f1f5f9" vertical={false}/>
                <XAxis dataKey="issue" tick={{fontSize:10, fill:"#64748b"}} interval={0} angle={-12} textAnchor="end" height={50}/>
                <YAxis tick={{fontSize:10, fill:"#64748b"}}/>
                <Tooltip contentStyle={{fontSize:12, borderRadius:8, border:"1px solid #e2e8f0"}}/>
                <Bar dataKey="count" fill="currentColor" radius={[4,4,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </window.Card>
      </div>

      {/* Spotlight */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <window.Card title="Top performers" action={<button onClick={()=>goTo("agents")} className="text-xs text-[var(--accent-deep)] hover:underline">View all agents</button>}>
          <div className="divide-y divide-slate-100 -my-2">
            {window.TOP_PERFORMERS.map(a => (
              <button key={a.id} onClick={()=>openAgent(a)} className="w-full flex items-center gap-3 py-2.5 hover:bg-slate-50 px-2 -mx-2 rounded">
                <window.AgentAvatar name={a.name}/>
                <div className="flex-1 min-w-0 text-left">
                  <div className="text-sm font-medium text-slate-900 truncate">{a.name}</div>
                  <div className="text-[11px] text-slate-500">{a.team} · {a.interactions} interactions</div>
                </div>
                <window.TrendArrow value={a.delta}/>
                <window.ScorePill value={a.score} size="md"/>
              </button>
            ))}
          </div>
        </window.Card>

        <window.Card title="Agents requiring attention" action={<span className="text-xs text-rose-600 font-medium">4 below threshold</span>}>
          <div className="divide-y divide-slate-100 -my-2">
            {window.NEEDS_ATTENTION.map(a => (
              <button key={a.id} onClick={()=>openAgent(a)} className="w-full flex items-center gap-3 py-2.5 hover:bg-rose-50/50 px-2 -mx-2 rounded">
                <window.AgentAvatar name={a.name}/>
                <div className="flex-1 min-w-0 text-left">
                  <div className="text-sm font-medium text-slate-900 truncate">{a.name}</div>
                  <div className="text-[11px] text-rose-600 truncate">{a.reason}</div>
                </div>
                <window.TrendArrow value={a.delta}/>
                <window.ScorePill value={a.score} size="md"/>
              </button>
            ))}
          </div>
        </window.Card>
      </div>

      {/* Insights */}
      <window.Card title="What changed today" action={<span className="text-xs text-slate-500">3 insights · auto-detected</span>}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { kind:"amber",   icon:window.I.alert,  title:"Voice sentiment regression", text:"Negative sentiment up 18% on Voice — concentrated in 'delivery delay' inquiries (NCR region)." },
            { kind:"rose",    icon:window.I.shield, title:"Pattern: compliance miss",    text:"Compliance disclosure missed in 14 voice calls — all from Mark Villanueva. Pattern detected since Mon." },
            { kind:"emerald", icon:window.I.trends, title:"Coaching impact",             text:"Chat avg QA score recovered to 90% after Tuesday's coaching cycle on tone consistency." },
          ].map((i, idx) => {
            const map = {
              amber:   "bg-amber-50/60 border-amber-200 text-amber-900",
              rose:    "bg-rose-50/60 border-rose-200 text-rose-900",
              emerald: "bg-emerald-50/60 border-emerald-200 text-emerald-900",
            };
            const dot = { amber:"text-amber-600", rose:"text-rose-600", emerald:"text-emerald-600" };
            const Ico = i.icon;
            return (
              <div key={idx} className={`rounded-lg border p-3 ${map[i.kind]}`}>
                <div className="flex items-center gap-2 mb-1">
                  <Ico className={`w-4 h-4 ${dot[i.kind]}`}/>
                  <div className="text-xs font-semibold">{i.title}</div>
                </div>
                <div className="text-xs leading-relaxed">{i.text}</div>
              </div>
            );
          })}
        </div>
      </window.Card>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <div className="flex items-center gap-2">
          <window.I.send className="w-3 h-3"/>
          Daily QA Alert sent at 7:00 AM PHT to 12 recipients via Slack #cx-qa-daily and email.
        </div>
        <button onClick={()=>goTo("reports")} className="text-[var(--accent-deep)] hover:underline font-medium">View report →</button>
      </div>
    </div>
  );
};

// ===== SCREEN 2 — LIVE MONITORING (Supervisor) =====
const LiveScreen = ({ openInteraction, addToast }) => {
  const [convos, setConvos] = useStateH(window.LIVE_CONVOS);
  const [alerts, setAlerts] = useStateH(window.ACTIVE_ALERTS);

  // Re-shuffle every 5s for "live" feel
  useEffectH(() => {
    const id = setInterval(() => {
      setConvos(prev => {
        const next = [...prev];
        // bump duration on a couple
        for (let i = 0; i < next.length; i++) {
          const [m, s] = next[i].duration === "—" ? ["—","—"] : next[i].duration.split(":").map(Number);
          if (m === "—") continue;
          const totalSec = m*60 + s + Math.floor(Math.random()*7) + 3;
          const nm = String(Math.floor(totalSec/60)).padStart(2,"0");
          const ns = String(totalSec%60).padStart(2,"0");
          next[i] = { ...next[i], duration: `${nm}:${ns}` };
        }
        // swap two random Medium/Low for variety
        const lowIdx = next.findIndex((c, idx) => idx > 4 && (c.risk === "Medium" || c.risk === "Low"));
        if (lowIdx > -1) {
          const flip = Math.random() < 0.5;
          next[lowIdx] = { ...next[lowIdx], sentiment: flip ? "Positive" : "Neutral" };
        }
        return next;
      });
    }, 5000);
    return () => clearInterval(id);
  }, []);

  const ackAlert = (id) => {
    setAlerts(prev => prev.map(a => a.id===id ? {...a, ack:true} : a));
  };
  const intervene = (a) => {
    setAlerts(prev => prev.filter(x => x.id !== a.id));
    addToast(`Joined conversation as Supervisor — ${a.agent} has been notified.`);
  };

  const riskBorder = {
    Critical: "border-l-rose-500",
    High:     "border-l-orange-500",
    Medium:   "border-l-amber-400",
    Low:      "border-l-slate-200",
  };

  const trendDot = (v) => v === 2 ? "bg-emerald-500" : v === 1 ? "bg-amber-400" : "bg-rose-500";

  return (
    <div className="space-y-4">
      {/* Top ribbon */}
      <div className="flex flex-wrap items-center gap-x-8 gap-y-3 px-1">
        {[
          { l:"Active conversations", v:"87",   sub:"+4 vs 5m ago" },
          { l:"Avg latency",          v:"1.4s", sub:"target <3s" },
          { l:"Critical alerts (15m)",v:"3",    sub:"2 unacked" },
        ].map((s,i)=>(
          <div key={i}>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{s.l}</div>
            <div className="text-2xl font-semibold tabular-nums text-slate-900 leading-tight">{s.v}</div>
            <div className="text-[11px] text-slate-500">{s.sub}</div>
          </div>
        ))}
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Supervisors online</div>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex -space-x-2">
              {["Joshua Reyes","Andrea Castillo","Daniel Soriano","Trisha Aquino"].map(n=>(
                <div key={n} className="ring-2 ring-white rounded-full">
                  <window.AgentAvatar name={n}/>
                </div>
              ))}
            </div>
            <div className="text-2xl font-semibold tabular-nums text-slate-900">4</div>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2 text-xs text-slate-500">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"/>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"/>
          </span>
          Live · updated 2s ago
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Stream */}
        <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
            <h3 className="text-base font-semibold text-slate-900">Live conversation stream</h3>
            <div className="text-xs text-slate-500">{convos.length} active · auto-refresh 5s</div>
          </div>
          <div className="divide-y divide-slate-100 max-h-[640px] overflow-y-auto scroll-thin">
            {convos.map(c => (
              <button key={c.id} onClick={()=>openInteraction(c, "live")}
                      className={`w-full px-4 py-3 grid grid-cols-12 gap-3 items-center hover:bg-slate-50 text-left border-l-4 ${riskBorder[c.risk]}`}>
                <div className="col-span-3 flex items-center gap-2 min-w-0">
                  {c.risk === "Critical" && <span className="w-2 h-2 rounded-full bg-rose-500 pulse-dot flex-shrink-0"/>}
                  <window.ChannelIcon value={c.channel}/>
                  <window.AgentAvatar name={c.agent}/>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-slate-900 truncate">{c.agent}</div>
                    <div className="text-[10px] text-slate-500 truncate">↔ {c.customer}</div>
                  </div>
                </div>
                <div className="col-span-2">
                  <div className="text-[10px] text-slate-500">started</div>
                  <div className="text-xs font-medium text-slate-900 tabular-nums">{c.started}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-[10px] text-slate-500">duration</div>
                  <div className="text-xs font-medium text-slate-900 tabular-nums">{c.duration}</div>
                </div>
                <div className="col-span-2 flex items-center gap-1">
                  {c.trend.map((v,i) => <span key={i} className={`w-1 h-3 rounded-sm ${trendDot(v)}`}/>)}
                </div>
                <div className="col-span-3 flex items-center gap-2 justify-end">
                  <window.SentimentTag value={c.sentiment} compact/>
                  <window.RiskBadge level={c.risk}/>
                </div>
                <div className="col-span-12 -mt-1">
                  <div className="text-[11px] text-slate-600 truncate italic">{c.snippet}</div>
                  <div className="text-[10px] text-slate-400 truncate">AI: {c.note}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Active alerts */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
            <h3 className="text-base font-semibold text-slate-900">Active alerts</h3>
            <span className="text-xs font-semibold tabular-nums px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">{alerts.filter(a=>!a.ack).length} open</span>
          </div>
          {alerts.length === 0 ? (
            <window.EmptyState icon={window.I.check} title="No active alerts" sub="All risks within thresholds. Great work."/>
          ) : (
            <div className="divide-y divide-slate-100 max-h-[640px] overflow-y-auto scroll-thin">
              {alerts.map(a => {
                const sevColor = {
                  Critical: "border-l-rose-500 bg-rose-50/40",
                  High:     "border-l-orange-500 bg-orange-50/30",
                  Medium:   "border-l-amber-400 bg-amber-50/30",
                }[a.severity];
                return (
                  <div key={a.id} className={`px-4 py-3 border-l-4 ${sevColor} ${a.ack ? "opacity-50" : ""}`}>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <window.RiskBadge level={a.severity}/>
                      <span className="text-[10px] text-slate-500 tabular-nums">{a.since}</span>
                    </div>
                    <div className="text-xs font-semibold text-slate-900 leading-snug">{a.reason}</div>
                    <div className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-600">
                      <window.AgentAvatar name={a.agent}/>
                      <span className="truncate">{a.agent} ↔ {a.customer}</span>
                      <window.ChannelIcon value={a.channel} className="w-3 h-3 text-slate-400"/>
                    </div>
                    {!a.ack && (
                      <div className="mt-2 flex items-center gap-1.5">
                        <window.Btn kind="ghost" size="sm" onClick={() => ackAlert(a.id)}>Acknowledge</window.Btn>
                        <window.Btn kind="primary" size="sm" icon={<window.I.intervene className="w-3 h-3"/>} onClick={() => intervene(a)}>Intervene</window.Btn>
                      </div>
                    )}
                    {a.ack && <div className="mt-2 text-[11px] text-slate-500 inline-flex items-center gap-1"><window.I.check className="w-3 h-3 text-emerald-600"/>Acknowledged</div>}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Heatmap */}
      <window.Card title="Flag intensity — last 24 hours" action={<span className="text-xs text-slate-500">hour-by-hour, all channels</span>}>
        <div className="flex items-end gap-1 pt-2">
          {window.HEATMAP_24H.map(h => {
            const opacity = 0.15 + (h.value / 10) * 0.85;
            return (
              <div key={h.hour} className="flex-1 flex flex-col items-center gap-1" title={`${h.hour}:00 — intensity ${h.value.toFixed(1)}`}>
                <div className="w-full rounded" style={{ height: `${20 + h.value * 6}px`, background:`rgba(236,0,140,${opacity})` }}/>
                <span className="text-[9px] text-slate-400 tabular-nums">{String(h.hour).padStart(2,"0")}</span>
              </div>
            );
          })}
        </div>
        <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
          <span>00:00 PHT</span>
          <span className="flex items-center gap-1">low <span className="w-12 h-1.5 rounded" style={{background:"linear-gradient(to right, rgba(236,0,140,0.15), rgba(236,0,140,1))"}}/> high</span>
          <span>23:00 PHT</span>
        </div>
      </window.Card>
    </div>
  );
};

// ===== SCREEN 3 — REVIEW QUEUE =====
const QueueScreen = ({ openInteraction, queueRows, addToast }) => {
  const [filter, setFilter] = useStateH("all");
  const [sort, setSort]     = useStateH("Priority");
  const [selected, setSelected] = useStateH(new Set());

  const filtered = useMemoH(() => {
    let r = queueRows.slice();
    if (filter !== "all") r = r.filter(x => x.reasonKey === filter);
    if (sort === "Newest") r.sort((a,b) => a.id < b.id ? 1 : -1);
    if (sort === "Oldest") r.sort((a,b) => a.id > b.id ? 1 : -1);
    if (sort === "Priority") {
      const order = { Critical:0, High:1, Medium:2, Low:3 };
      r.sort((a,b) => order[a.priority] - order[b.priority]);
    }
    if (sort === "By agent") r.sort((a,b) => a.agent.localeCompare(b.agent));
    if (sort === "By channel") r.sort((a,b) => a.channel.localeCompare(b.channel));
    return r;
  }, [queueRows, filter, sort]);

  const toggleSel = (id) => setSelected(prev => {
    const n = new Set(prev);
    n.has(id) ? n.delete(id) : n.add(id);
    return n;
  });
  const allChecked = filtered.length > 0 && filtered.every(r => selected.has(r.id));
  const toggleAll = () => setSelected(allChecked ? new Set() : new Set(filtered.map(r=>r.id)));

  const reasonChip = (key) => {
    const map = {
      compliance: "bg-rose-50 text-rose-700 border-rose-200",
      sentiment:  "bg-orange-50 text-orange-700 border-orange-200",
      confidence: "bg-violet-50 text-violet-700 border-violet-200",
      sop:        "bg-amber-50 text-amber-700 border-amber-200",
      vip:        "bg-sky-50 text-sky-700 border-sky-200",
    };
    return map[key] || "bg-slate-50 text-slate-700 border-slate-200";
  };

  const priorityIcon = (p) => {
    if (p === "Critical") return <span className="inline-flex w-1.5 h-1.5 rounded-full bg-rose-500"/>;
    if (p === "High")     return <span className="inline-flex w-1.5 h-1.5 rounded-full bg-orange-500"/>;
    if (p === "Medium")   return <span className="inline-flex w-1.5 h-1.5 rounded-full bg-amber-400"/>;
    return <span className="inline-flex w-1.5 h-1.5 rounded-full bg-slate-300"/>;
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center gap-2 px-3 py-2.5 border-b border-slate-100">
          {window.TRIGGER_REASONS.map(r => {
            const on = filter === r.key;
            return (
              <button key={r.key} onClick={()=>setFilter(r.key)}
                      className={`text-xs px-2.5 py-1 rounded-md border flex items-center gap-1.5
                        ${on ? "bg-[var(--accent-tint)] border-[var(--accent-border)] text-[var(--accent-deep)] font-semibold" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
                {r.label}
                <span className={`text-[10px] tabular-nums px-1 rounded ${on ? "bg-white text-[var(--accent-deep)]" : "bg-slate-100 text-slate-500"}`}>{r.count}</span>
              </button>
            );
          })}
          <div className="flex-1"/>
          {selected.size > 0 ? (
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-500">{selected.size} selected</span>
              <window.Btn kind="secondary" size="sm" onClick={()=>{addToast(`${selected.size} interactions marked validated.`); setSelected(new Set());}}>Mark validated</window.Btn>
              <window.Btn kind="secondary" size="sm">Reassign</window.Btn>
              <window.Btn kind="secondary" size="sm">Override score…</window.Btn>
            </div>
          ) : (
            <>
              <span className="text-xs text-slate-500 mr-2"><span className="font-semibold text-slate-900 tabular-nums">23</span> reviewed · <span className="font-semibold text-slate-900 tabular-nums">4</span> overrides · <span className="font-semibold text-slate-900 tabular-nums">87%</span> agreement <span className="text-slate-400">(today)</span></span>
              <select value={sort} onChange={e=>setSort(e.target.value)} className="text-xs border border-slate-200 rounded-md px-2 py-1 bg-white text-slate-700">
                {["Priority","Newest","Oldest","By agent","By channel"].map(o=><option key={o}>{o}</option>)}
              </select>
            </>
          )}
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <window.EmptyState icon={window.I.inbox} title="Inbox zero" sub="No interactions match these filters."
                            cta={<window.Btn kind="secondary" size="sm" onClick={()=>setFilter("all")}>Clear filters</window.Btn>}/>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50/50 border-b border-slate-100">
                <tr className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  <th className="px-3 py-2 w-8"><input type="checkbox" checked={allChecked} onChange={toggleAll} className="accent-[var(--accent)]"/></th>
                  <th className="px-2 py-2 text-left">Priority</th>
                  <th className="px-2 py-2 text-left">Trigger</th>
                  <th className="px-2 py-2 text-left">Interaction</th>
                  <th className="px-2 py-2 text-left">Agent</th>
                  <th className="px-2 py-2 text-left">Customer</th>
                  <th className="px-2 py-2 text-left">AI score</th>
                  <th className="px-2 py-2 text-left">Confidence</th>
                  <th className="px-2 py-2 text-left">Sentiment</th>
                  <th className="px-2 py-2 text-left">SLA</th>
                  <th className="px-2 py-2"/>
                </tr>
              </thead>
              <tbody>
                {filtered.map(r => (
                  <tr key={r.id} className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer group" onClick={()=>openInteraction({...r}, "queue")}>
                    <td className="px-3 py-2" onClick={e=>e.stopPropagation()}>
                      <input type="checkbox" checked={selected.has(r.id)} onChange={()=>toggleSel(r.id)} className="accent-[var(--accent)]"/>
                    </td>
                    <td className="px-2 py-2">
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700">
                        {priorityIcon(r.priority)}{r.priority}
                      </span>
                    </td>
                    <td className="px-2 py-2">
                      <span className={`inline-block text-[11px] px-1.5 py-0.5 rounded border ${reasonChip(r.reasonKey)}`}>{r.reasonLabel}</span>
                    </td>
                    <td className="px-2 py-2">
                      <div className="flex items-center gap-1.5">
                        <window.ChannelIcon value={r.channel}/>
                        <span className="text-[11px] font-mono text-slate-700">{r.id}</span>
                      </div>
                    </td>
                    <td className="px-2 py-2">
                      <div className="flex items-center gap-1.5">
                        <window.AgentAvatar name={r.agent}/>
                        <span className="text-xs text-slate-700">{r.agent}</span>
                      </div>
                    </td>
                    <td className="px-2 py-2 text-xs text-slate-600">{r.customer}</td>
                    <td className="px-2 py-2"><window.ScorePill value={r.score}/></td>
                    <td className="px-2 py-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] tabular-nums text-slate-700 w-7">{r.confidence}%</span>
                        <div className="w-12 h-1.5 rounded-full bg-slate-100">
                          <div className="h-full rounded-full bg-violet-500" style={{width:`${r.confidence}%`}}/>
                        </div>
                      </div>
                    </td>
                    <td className="px-2 py-2"><window.SentimentTag value={r.sentiment} compact/></td>
                    <td className={`px-2 py-2 text-xs tabular-nums ${r.slaBreach ? "text-rose-600 font-semibold" : "text-slate-600"}`}>
                      {r.slaBreach && <window.I.alert className="w-3 h-3 inline-block mr-0.5"/>}
                      {r.sla}
                    </td>
                    <td className="px-2 py-2 text-right">
                      <span className="text-[11px] text-[var(--accent-deep)] opacity-0 group-hover:opacity-100 inline-flex items-center gap-0.5">Quick review <window.I.chevRight className="w-3 h-3"/></span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

Object.assign(window, { OverviewScreen, LiveScreen, QueueScreen });
