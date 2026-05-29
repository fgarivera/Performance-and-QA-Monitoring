/* global window, React, Recharts */
const { useState: useStateSp, useMemo: useMemoSp } = React;
const { ResponsiveContainer: RCS, LineChart: LCS, Line: LnS, AreaChart: ACS, Area: ArS, BarChart: BCS, Bar: BrS, XAxis: XS, YAxis: YS, Tooltip: TpS, CartesianGrid: CGS, Legend: LgS } = Recharts;

// ===== SCREEN 6 — AGENTS LIST =====
const AgentsListScreen = ({ openAgent, channels }) => {
  const [team, setTeam] = useStateSp("All");
  const [scoreRange, setScoreRange] = useStateSp("All");
  const [sortKey, setSortKey] = useStateSp("score");
  const [sortDir, setSortDir] = useStateSp("desc");

  const teams = ["All", ...Array.from(new Set(window.ALL_AGENTS.map(a=>a.team)))];
  const filtered = useMemoSp(() => {
    let r = window.ALL_AGENTS.slice();
    // Top-bar channel chips — agents are bucketed by their team's primary channel.
    r = r.filter(a => window.matchesChannel(channels, window.teamChannel(a.team)));
    if (team !== "All") r = r.filter(a => a.team === team);
    if (scoreRange !== "All") {
      if (scoreRange === "90+") r = r.filter(a => a.score >= 90);
      if (scoreRange === "80-89") r = r.filter(a => a.score >= 80 && a.score < 90);
      if (scoreRange === "<80") r = r.filter(a => a.score < 80);
    }
    r.sort((a,b) => {
      const va = a[sortKey], vb = b[sortKey];
      if (typeof va === "string") return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
      return sortDir === "asc" ? va - vb : vb - va;
    });
    return r;
  }, [team, channels, scoreRange, sortKey, sortDir]);

  const sortBy = (k) => { sortKey === k ? setSortDir(d => d==="asc"?"desc":"asc") : (setSortKey(k), setSortDir("desc")); };

  const channelMix = (a) => {
    if (a.team.includes("Chat"))  return { Chat:70, Voice:20, Email:10 };
    if (a.team.includes("Voice")) return { Voice:75, Chat:15, Email:10 };
    return { Email:65, Chat:25, Voice:10 };
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center gap-2 px-3 py-2.5 border-b border-slate-100">
          <span className="text-xs font-semibold text-slate-700 mr-1">Filters:</span>
          <select value={team} onChange={e=>setTeam(e.target.value)} className="text-xs border border-slate-200 rounded-md px-2 py-1 bg-white">
            {teams.map(t=><option key={t}>{t}</option>)}
          </select>
          {/* Channel filter is driven by the top-bar channel chips, not a local select. */}
          <select value={scoreRange} onChange={e=>setScoreRange(e.target.value)} className="text-xs border border-slate-200 rounded-md px-2 py-1 bg-white">
            {["All","90+","80-89","<80"].map(t=><option key={t}>{t}</option>)}
          </select>
          <div className="flex-1"/>
          <span className="text-xs text-slate-500">{filtered.length} of {window.ALL_AGENTS.length} agents</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                <th className="px-3 py-2 text-left cursor-pointer hover:text-slate-700" onClick={()=>sortBy("name")}>Agent</th>
                <th className="px-2 py-2 text-left cursor-pointer hover:text-slate-700" onClick={()=>sortBy("team")}>Team</th>
                <th className="px-2 py-2 text-left">Channel mix</th>
                <th className="px-2 py-2 text-left cursor-pointer hover:text-slate-700" onClick={()=>sortBy("score")}>QA Score</th>
                <th className="px-2 py-2 text-left">Flag rate</th>
                <th className="px-2 py-2 text-left">Last reviewed</th>
                <th className="px-2 py-2 text-left cursor-pointer hover:text-slate-700" onClick={()=>sortBy("delta")}>Δ 7d</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a, i) => {
                const mix = channelMix(a);
                const flag = (100 - a.score + 5).toFixed(1);
                const lastReviewed = ["12m ago","1h ago","3h ago","Today","Yesterday"][i % 5];
                return (
                  <tr key={a.id} className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer" onClick={()=>openAgent(a)}>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <window.AgentAvatar name={a.name}/>
                        <div>
                          <div className="text-sm font-medium text-slate-900">{a.name}</div>
                          {a.reason && <div className="text-[10px] text-rose-600">{a.reason}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="px-2 py-2.5 text-xs text-slate-600">{a.team}</td>
                    <td className="px-2 py-2.5">
                      <div className="flex items-center gap-1.5">
                        {Object.entries(mix).map(([ch, pct]) => (
                          <span key={ch} className="inline-flex items-center gap-0.5 text-[10px] text-slate-500" title={`${ch} ${pct}%`}>
                            <window.ChannelIcon value={ch} className="w-3 h-3 text-slate-400"/>{pct}%
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-2 py-2.5"><window.ScorePill value={a.score}/></td>
                    <td className="px-2 py-2.5 text-xs text-slate-700 tabular-nums">{flag}%</td>
                    <td className="px-2 py-2.5 text-xs text-slate-500">{lastReviewed}</td>
                    <td className="px-2 py-2.5"><window.TrendArrow value={a.delta || "+0.0"}/></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ===== SCREEN 7 — TRENDS =====
const TrendsScreen = () => (
  <div className="space-y-4">
    <div className="flex flex-wrap items-center gap-2 px-1">
      {["Last 90 days","All teams","All channels","All accounts"].map(c => (
        <span key={c} className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700">
          <window.I.filter className="w-3 h-3 text-slate-400"/>{c}
          <window.I.chevDown className="w-3 h-3 text-slate-400"/>
        </span>
      ))}
    </div>

    <window.Card title="QA score over time — by channel" action={<span className="text-xs text-slate-500"><window.InfoTip title="Anomaly markers"><strong>•</strong> dots on the lines mark auto-detected events (drops, recoveries, milestones) with hover narrative.</window.InfoTip> 90 days</span>}>
      <div className="h-[280px] -ml-2" style={{color:"var(--accent)"}}>
        <RCS>
          <LCS data={window.TRENDS_BY_CHANNEL} margin={{top:10,right:20,bottom:0,left:0}}>
            <CGS stroke="#f1f5f9" vertical={false}/>
            <XS dataKey="day" tick={{fontSize:10, fill:"#64748b"}} interval={9}/>
            <YS domain={[78,95]} tick={{fontSize:10, fill:"#64748b"}}/>
            <TpS contentStyle={{fontSize:12, borderRadius:8, border:"1px solid #e2e8f0"}}/>
            <LgS wrapperStyle={{fontSize:11}}/>
            <LnS type="monotone" dataKey="Chat"  stroke="currentColor" strokeWidth={2} dot={false}/>
            <LnS type="monotone" dataKey="Voice" stroke="#0ea5e9" strokeWidth={2} dot={false}/>
            <LnS type="monotone" dataKey="Email" stroke="#10b981" strokeWidth={2} dot={false}/>
            {/* Anomaly markers */}
            {window.TREND_ANOMALIES.map((a, i) => {
              const fill = a.severity === "drop" ? "#f43f5e" : a.severity === "recovery" ? "#10b981" : "#8b5cf6";
              return (
                <Recharts.ReferenceDot key={i} x={a.day} y={a.value} r={6}
                                       fill="#fff" stroke={fill} strokeWidth={2.5}
                                       label={{ value: "•", position:"top", fontSize:14, fill }}/>
              );
            })}
          </LCS>
        </RCS>
      </div>
      {/* Anomaly legend */}
      <div className="flex flex-wrap gap-3 mt-2 px-1">
        {window.TREND_ANOMALIES.map((a, i) => {
          const dotColor = a.severity === "drop" ? "border-rose-500" : a.severity === "recovery" ? "border-emerald-500" : "border-violet-500";
          return (
            <div key={i} className="flex items-start gap-1.5 text-[11px] flex-1 min-w-[200px]">
              <span className={`w-2 h-2 rounded-full bg-white border-2 ${dotColor} flex-shrink-0 mt-1`}/>
              <div>
                <div className="font-semibold text-slate-700">Day {a.day} · {a.title}</div>
                <div className="text-slate-500 leading-snug">{a.desc}</div>
              </div>
            </div>
          );
        })}
      </div>
    </window.Card>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <window.Card title="Flag rate over time — by reason" action={<span className="text-xs text-slate-500">stacked, 60 days</span>}>
        <div className="h-[260px] -ml-2">
          <RCS>
            <ACS data={window.FLAGS_STACKED} margin={{top:10,right:8,left:0,bottom:0}}>
              <CGS stroke="#f1f5f9" vertical={false}/>
              <XS dataKey="day" tick={{fontSize:10, fill:"#64748b"}} interval={5}/>
              <YS tick={{fontSize:10, fill:"#64748b"}}/>
              <TpS contentStyle={{fontSize:12, borderRadius:8, border:"1px solid #e2e8f0"}}/>
              <LgS wrapperStyle={{fontSize:11}}/>
              <ArS type="monotone" dataKey="Compliance" stackId="1" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.5}/>
              <ArS type="monotone" dataKey="Sentiment"  stackId="1" stroke="#fb923c" fill="#fb923c" fillOpacity={0.5}/>
              <ArS type="monotone" dataKey="Confidence" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.5}/>
              <ArS type="monotone" dataKey="SOP"        stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.5}/>
            </ACS>
          </RCS>
        </div>
      </window.Card>

      <window.Card title="Sentiment distribution" action={<span className="text-xs text-slate-500">100% stacked, 60 days</span>}>
        <div className="h-[260px] -ml-2">
          <RCS>
            <ACS data={window.SENTIMENT_STACKED} stackOffset="expand" margin={{top:10,right:8,left:0,bottom:0}}>
              <CGS stroke="#f1f5f9" vertical={false}/>
              <XS dataKey="day" tick={{fontSize:10, fill:"#64748b"}} interval={5}/>
              <YS tick={{fontSize:10, fill:"#64748b"}} tickFormatter={v=>`${Math.round(v*100)}%`}/>
              <TpS contentStyle={{fontSize:12, borderRadius:8, border:"1px solid #e2e8f0"}} formatter={(v)=>`${v}`}/>
              <LgS wrapperStyle={{fontSize:11}}/>
              <ArS type="monotone" dataKey="Positive" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6}/>
              <ArS type="monotone" dataKey="Neutral"  stackId="1" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.6}/>
              <ArS type="monotone" dataKey="Negative" stackId="1" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.6}/>
            </ACS>
          </RCS>
        </div>
      </window.Card>
    </div>

    <window.Card
      title={<div className="flex items-center gap-2"><h3 className="text-base font-semibold text-slate-900">AI–Human agreement over time</h3><span className="text-[9px] font-bold uppercase tracking-wider px-1 py-0.5 rounded bg-violet-100 text-violet-700">Calibration</span><window.InfoTip title="AI–Human agreement">% of AI scores accepted by QA analysts without override. A leading indicator that the model is well-calibrated to your team's QA standards. Climbing over time = AI is learning from human feedback. Dips usually mean a rubric change.</window.InfoTip></div>}
      action={<span className="text-xs text-slate-500">30 days · validates the AI is improving</span>}>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_220px] gap-5">
        <div className="h-[260px] -ml-2">
          <RCS>
            <LCS data={window.AGREEMENT_TREND} margin={{top:10,right:20,left:0,bottom:0}}>
              <CGS stroke="#f1f5f9" vertical={false}/>
              <XS dataKey="day" tick={{fontSize:10, fill:"#64748b"}} interval={4}/>
              <YS yAxisId="L" domain={[0,100]} tick={{fontSize:10, fill:"#64748b"}} tickFormatter={(v)=>`${v}%`}/>
              <YS yAxisId="R" orientation="right" domain={[0,20]} tick={{fontSize:10, fill:"#8b5cf6"}}/>
              <TpS contentStyle={{fontSize:12, borderRadius:8, border:"1px solid #e2e8f0"}}/>
              <LgS wrapperStyle={{fontSize:11}}/>
              <LnS yAxisId="L" type="monotone" dataKey="agreement"     stroke="#10b981" strokeWidth={2.5} dot={false} name="Agreement %"/>
              <LnS yAxisId="L" type="monotone" dataKey="override"      stroke="#f43f5e" strokeWidth={2}   dot={false} name="Override %"/>
              <LnS yAxisId="R" type="monotone" dataKey="confidenceGap" stroke="#8b5cf6" strokeWidth={1.5} strokeDasharray="4 3" dot={false} name="Confidence gap (pts)"/>
            </LCS>
          </RCS>
        </div>
        <div className="space-y-3">
          {[
            { l:"Agreement",      v:"89.2%",   d:"+11.0 pts", desc:"of AI scores accepted by QA" },
            { l:"Override rate",  v:"6.4%",    d:"−9.2 pts",  desc:"QA-overridden in last 7d" },
            { l:"Confidence gap", v:"4.8 pts", d:"−9.2 pts",  desc:"AI confidence vs. final score" },
          ].map((k,i)=>(
            <div key={i} className="rounded-lg border border-slate-200 p-2.5">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{k.l}</div>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <div className="text-xl font-semibold tabular-nums text-slate-900">{k.v}</div>
                <window.TrendArrow value={k.d}/>
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">{k.desc}</div>
            </div>
          ))}
          <div className="rounded-lg border border-emerald-200 bg-emerald-50/40 p-2.5">
            <div className="flex items-center gap-1.5 mb-0.5">
              <window.I.trends className="w-3.5 h-3.5 text-emerald-600"/>
              <div className="text-[11px] font-semibold text-emerald-900">Model is improving</div>
            </div>
            <div className="text-[11px] text-emerald-900/80 leading-snug">QA agrees with 89% of AI scores — up from 78% a month ago. Rubric update on Apr 15 caused a brief dip, recovered within 5 days.</div>
          </div>
        </div>
      </div>
    </window.Card>

    {/* CSAT vs AI QA correlation — closes the trust loop */}
    <window.Card
      title={<div className="flex items-center gap-2">
        <h3 className="text-base font-semibold text-slate-900">CSAT vs. AI QA score</h3>
        <span className="text-[9px] font-bold uppercase tracking-wider px-1 py-0.5 rounded bg-emerald-100 text-emerald-700">Trust loop</span>
        <window.InfoTip title="CSAT correlation">Tests whether the AI's quality judgment actually matches the customer's. High correlation = AI is measuring the right thing. Outliers (agents where AI and CSAT disagree) reveal rubric gaps.</window.InfoTip>
      </div>}
      action={<span className="text-xs text-slate-500">{window.CSAT_AGENT_SCATTER.length} agents · last 30 days</span>}>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-5">
        {/* Scatter plot (custom — bounded by AI 70-100 × CSAT 2-5) */}
        <div>
          <div className="relative h-[280px] border-l border-b border-slate-200 ml-8 mb-6">
            {/* Diagonal trust band — agree zone */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute inset-x-0 h-px bg-slate-200" style={{top:"25%"}}/>
              <div className="absolute inset-x-0 h-px bg-slate-200" style={{top:"50%"}}/>
              <div className="absolute inset-x-0 h-px bg-slate-200" style={{top:"75%"}}/>
              <div className="absolute inset-y-0 w-px bg-slate-200" style={{left:"25%"}}/>
              <div className="absolute inset-y-0 w-px bg-slate-200" style={{left:"50%"}}/>
              <div className="absolute inset-y-0 w-px bg-slate-200" style={{left:"75%"}}/>
              {/* Diagonal trust corridor (regression line ± band) */}
              <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                <polygon points="0,72 100,8 100,28 0,92" fill="#10b981" fillOpacity="0.08"/>
                <line x1="0" y1="82" x2="100" y2="18" stroke="#10b981" strokeWidth="0.4" strokeDasharray="2 2"/>
              </svg>
            </div>
            {/* Data points */}
            {window.CSAT_AGENT_SCATTER.map((p, i) => {
              const xPct = ((p.ai - 70) / 30) * 100;
              const yPct = ((5 - p.csat) / 3) * 100;
              const zoneColor = ({
                "agree-high":    "#10b981",
                "agree-mid":     "#0ea5e9",
                "agree-low":     "#f59e0b",
                "ai-overrated":  "#f43f5e",
                "ai-underrated": "#8b5cf6",
              })[p.zone];
              const size = Math.max(6, Math.min(14, p.interactions / 12));
              return (
                <div key={i}
                     className="absolute rounded-full border-2 border-white shadow group cursor-pointer hover:z-10"
                     style={{
                       left: `${xPct}%`, top: `${yPct}%`,
                       width: size, height: size,
                       marginLeft: -size/2, marginTop: -size/2,
                       background: zoneColor,
                     }}>
                  <div className="opacity-0 group-hover:opacity-100 transition absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-44 p-2 bg-slate-900 text-white text-[11px] rounded-md shadow-lg z-20 pointer-events-none">
                    <div className="font-semibold">{p.agent}</div>
                    <div className="text-slate-300">AI {p.ai} · CSAT {p.csat} · {p.interactions} interactions</div>
                  </div>
                </div>
              );
            })}
            {/* Y-axis label */}
            <div className="absolute -left-8 top-0 text-[10px] text-slate-500 tabular-nums">5.0</div>
            <div className="absolute -left-8 top-1/2 -translate-y-1/2 text-[10px] text-slate-500 tabular-nums">3.5</div>
            <div className="absolute -left-8 bottom-0 text-[10px] text-slate-500 tabular-nums">2.0</div>
            <div className="absolute -left-6 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] font-semibold text-slate-600 origin-center" style={{transformOrigin:"left center", left:"-30px"}}>CSAT</div>
            {/* X-axis labels */}
            <div className="absolute left-0 -bottom-5 text-[10px] text-slate-500 tabular-nums">70</div>
            <div className="absolute left-1/2 -translate-x-1/2 -bottom-5 text-[10px] text-slate-500 tabular-nums">85</div>
            <div className="absolute right-0 -bottom-5 text-[10px] text-slate-500 tabular-nums">100</div>
            <div className="absolute left-1/2 -translate-x-1/2 -bottom-10 text-[10px] font-semibold text-slate-600">AI QA Score</div>
          </div>
          {/* Legend */}
          <div className="flex flex-wrap gap-3 text-[11px] mt-8 px-1">
            {[
              { c:"#10b981", l:"Agree — high performers" },
              { c:"#0ea5e9", l:"Agree — mid" },
              { c:"#f59e0b", l:"Agree — low" },
              { c:"#f43f5e", l:"AI overrated · customer unhappy" },
              { c:"#8b5cf6", l:"AI underrated · customer happy" },
            ].map(g => (
              <div key={g.l} className="inline-flex items-center gap-1.5 text-slate-600">
                <span className="w-2 h-2 rounded-full" style={{background:g.c}}/>{g.l}
              </div>
            ))}
          </div>
        </div>

        {/* Side panel */}
        <div className="space-y-3">
          <div className="rounded-lg border border-emerald-200 bg-emerald-50/40 p-2.5">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-emerald-900">Correlation</div>
            <div className="text-2xl font-semibold tabular-nums text-emerald-700 mt-0.5">r = {window.CSAT_SUMMARY.correlation}</div>
            <div className="text-[11px] text-emerald-900/80">Strong positive — AI is measuring the right thing.</div>
          </div>
          {[
            { l:"Avg AI score",  v:window.CSAT_SUMMARY.aiAvg.toFixed(1),       sub:"across all agents",      color:"slate"  },
            { l:"Avg CSAT",      v:`${window.CSAT_SUMMARY.csatAvg.toFixed(1)}/${window.CSAT_SUMMARY.csatScale}`, sub:"customer-reported",  color:"sky"    },
            { l:"Outliers",      v:`${window.CSAT_SUMMARY.outliers.aiOverrated + window.CSAT_SUMMARY.outliers.aiUnderrated}`, sub:`${window.CSAT_SUMMARY.outliers.aiOverrated} overrated · ${window.CSAT_SUMMARY.outliers.aiUnderrated} underrated`, color:"amber" },
          ].map((k, i) => (
            <div key={i} className="rounded-lg border border-slate-200 p-2.5">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{k.l}</div>
              <div className={`text-xl font-semibold tabular-nums text-${k.color}-700 mt-0.5`}>{k.v}</div>
              <div className="text-[11px] text-slate-500">{k.sub}</div>
            </div>
          ))}
          <div className="rounded-lg border border-violet-200 bg-violet-50/40 p-2.5">
            <div className="text-[11px] font-semibold text-violet-900 mb-0.5">Coaching opportunity</div>
            <div className="text-[11px] text-violet-900/80 leading-snug">3 agents AI rates 86–90 but customers rate {"<"}3.5. Likely tone or empathy gap not captured by current rubric.</div>
          </div>
        </div>
      </div>
    </window.Card>

    {/* Day-of-week × Hour heatmap — staffing insight */}
    <window.Card
      title={<div className="flex items-center gap-2">
        <h3 className="text-base font-semibold text-slate-900">Flag intensity — by day & hour</h3>
        <window.InfoTip title="Weekly pattern">Structural pattern of flag density across the week. Helps spot peak hours that need extra supervisor coverage (e.g. Mon-Tue 9-11AM, Fri 5-7PM).</window.InfoTip>
      </div>}
      action={<span className="text-xs text-slate-500">last 30 days · all channels</span>}>
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          {/* Hour header */}
          <div className="flex pl-12 pb-1">
            {Array.from({length:24}).map((_, h) => (
              <div key={h} className="flex-1 text-center text-[9px] text-slate-400 tabular-nums min-w-[18px]">
                {h % 3 === 0 ? String(h).padStart(2,"0") : ""}
              </div>
            ))}
          </div>
          {/* Rows */}
          {window.DOW_HEATMAP.map((row, ri) => (
            <div key={row.day} className="flex items-center pb-0.5">
              <div className="w-12 text-[10px] font-semibold uppercase tracking-wider text-slate-500 pr-2">{row.day}</div>
              {row.hours.map((v, hi) => {
                const opacity = 0.1 + (v / 10) * 0.9;
                return (
                  <div key={hi} className="flex-1 group relative min-w-[18px]">
                    <div className="h-5 mx-0.5 rounded"
                         style={{ background: `rgba(236,0,140,${opacity})` }}
                         title={`${row.day} ${String(hi).padStart(2,"0")}:00 — intensity ${v}`}/>
                    <div className="opacity-0 group-hover:opacity-100 transition absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-slate-900 text-white text-[10px] rounded shadow-lg z-20 pointer-events-none whitespace-nowrap">
                      {row.day} · {String(hi).padStart(2,"0")}:00 — {v.toFixed(1)}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between mt-3 text-[10px] text-slate-400 pl-12">
        <span>00:00</span>
        <span className="inline-flex items-center gap-1.5">
          Low
          <span className="w-20 h-2 rounded" style={{background:"linear-gradient(to right, rgba(236,0,140,0.1), rgba(236,0,140,1))"}}/>
          High
        </span>
        <span>23:00 PHT</span>
      </div>
      <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2 text-[11px]">
        <div className="rounded-md border border-rose-200 bg-rose-50/40 p-2">
          <div className="font-semibold text-rose-900">Peak hours</div>
          <div className="text-rose-900/80">Mon–Tue 9–11 AM, Wed–Fri 2–5 PM</div>
        </div>
        <div className="rounded-md border border-amber-200 bg-amber-50/40 p-2">
          <div className="font-semibold text-amber-900">Weekly spike</div>
          <div className="text-amber-900/80">Friday 5–7 PM — staffing recommendation in Reports</div>
        </div>
        <div className="rounded-md border border-emerald-200 bg-emerald-50/40 p-2">
          <div className="font-semibold text-emerald-900">Low-load windows</div>
          <div className="text-emerald-900/80">Weekends + weekday late evenings</div>
        </div>
      </div>
    </window.Card>
  </div>
);

// ===== SCREEN 8 — REPORTS ARCHIVE =====
const ReportsScreen = ({ addToast }) => {
  const [selected, setSelected] = useStateSp(window.REPORTS_LIST[0]);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-4">
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="px-3 py-2.5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900">Reports</h3>
          <span className="text-[10px] text-slate-500">{window.REPORTS_LIST.length} archived</span>
        </div>
        <div className="divide-y divide-slate-100 max-h-[680px] overflow-y-auto scroll-thin">
          {window.REPORTS_LIST.map(r => (
            <button key={r.id} onClick={()=>setSelected(r)}
                    className={`w-full px-3 py-2.5 text-left hover:bg-slate-50 ${selected.id===r.id ? "bg-[var(--accent-tint)]/40" : ""}`}>
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className={`text-[9px] font-bold uppercase tracking-wider px-1 rounded ${r.kind==="daily"?"bg-sky-100 text-sky-700":"bg-violet-100 text-violet-700"}`}>{r.kind}</span>
                <span className="text-[10px] text-slate-500">{r.recipients} recipients</span>
              </div>
              <div className="text-xs font-semibold text-slate-900">{r.title}</div>
              <div className="text-[11px] text-slate-500">{r.date}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Email preview */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Email preview</div>
            <div className="text-sm font-semibold text-slate-900">{selected.title} — {selected.date}</div>
          </div>
          <div className="flex items-center gap-2">
            <window.Btn kind="secondary" size="sm" onClick={()=>addToast("Report resent to 12 recipients.")}>Resend</window.Btn>
            <window.Btn kind="secondary" size="sm" icon={<window.I.download className="w-3 h-3"/>} onClick={()=>addToast("PDF download started.")}>Download PDF</window.Btn>
            <window.Btn kind="ghost" size="sm">Edit recipients</window.Btn>
          </div>
        </div>
        <div className="p-6 max-h-[680px] overflow-y-auto scroll-thin">
          <div className="max-w-[640px] mx-auto">
            <div className="text-xs text-slate-500 mb-1">From: AI QA Monitoring System &lt;qa@popai.tech&gt;</div>
            <div className="text-xs text-slate-500 mb-1">To: cx-managers@acme.bpo (12 recipients)</div>
            <div className="text-xs text-slate-500 mb-3">Subject: <span className="text-slate-900 font-medium">[Daily QA Performance & Alert Summary] — {selected.date}</span></div>
            <hr className="border-slate-200 my-3"/>

            <p className="text-sm text-slate-800 mb-3">Hi team,</p>
            <p className="text-sm text-slate-800 mb-4">Here is your daily QA performance and alert summary for {selected.date}, generated by the AI QA Monitoring System across Chat, Voice, and Email interactions.</p>

            <h4 className="text-sm font-bold text-slate-900 mt-4 mb-2">A. QA Summary Overview</h4>
            <ul className="text-sm text-slate-700 space-y-1 ml-4 list-disc">
              <li>Total interactions evaluated: <span className="font-semibold">3,247</span></li>
              <li>Coverage: <span className="font-semibold">100%</span></li>
              <li>Average QA score: <span className="font-semibold">87.4%</span></li>
              <li>Total flagged: <span className="font-semibold">798 (24.6%)</span></li>
              <li>High-risk / compliance: <span className="font-semibold text-rose-700">146</span></li>
            </ul>

            <h4 className="text-sm font-bold text-slate-900 mt-4 mb-2">B. Channel Breakdown</h4>
            <table className="w-full text-xs border border-slate-200 rounded">
              <thead className="bg-slate-50">
                <tr><th className="text-left px-2 py-1.5">Channel</th><th className="text-right px-2 py-1.5">Volume</th><th className="text-right px-2 py-1.5">Avg score</th><th className="text-right px-2 py-1.5">Flag %</th></tr>
              </thead>
              <tbody>
                {window.CHANNEL_BREAKDOWN.map(c => (
                  <tr key={c.channel} className="border-t border-slate-100">
                    <td className="px-2 py-1.5">{c.channel}</td>
                    <td className="px-2 py-1.5 text-right tabular-nums">{c.volume.toLocaleString()}</td>
                    <td className="px-2 py-1.5 text-right tabular-nums">{c.score}%</td>
                    <td className="px-2 py-1.5 text-right tabular-nums">{c.flag}%</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h4 className="text-sm font-bold text-slate-900 mt-4 mb-2">C. Top Quality Issues</h4>
            <ul className="text-sm text-slate-700 space-y-1 ml-4 list-disc">
              {window.TOP_ISSUES.map(i => <li key={i.issue}>{i.issue} — <span className="font-semibold tabular-nums">{i.count}</span> ({i.pct}%)</li>)}
            </ul>

            <h4 className="text-sm font-bold text-slate-900 mt-4 mb-2">D. Risk & Escalation Insights — HITL Triggers</h4>
            <ul className="text-sm text-slate-700 space-y-1 ml-4 list-disc">
              <li>Negative sentiment: <span className="font-semibold">34%</span></li>
              <li>Low-confidence scoring: <span className="font-semibold">31%</span></li>
              <li>Compliance: <span className="font-semibold">20%</span></li>
              <li>Reviewed by QA: <span className="font-semibold">798</span></li>
            </ul>

            <h4 className="text-sm font-bold text-slate-900 mt-4 mb-2">E. Agent Performance Highlights</h4>
            <p className="text-sm text-slate-700 mb-1"><span className="font-semibold text-emerald-700">Top performers:</span> Maria Dela Cruz (96), Joshua Reyes (94), Camille Tan (93).</p>
            <p className="text-sm text-slate-700"><span className="font-semibold text-rose-700">Needs attention:</span> Mark Villanueva (72) — compliance disclosure missed 14×; Angela Bautista (75) — tone inconsistency.</p>

            <h4 className="text-sm font-bold text-slate-900 mt-4 mb-2">F. Key Insights</h4>
            <ul className="text-sm text-slate-700 space-y-1 ml-4 list-disc">
              <li>Voice negative sentiment up 18% — concentrated in NCR delivery delays.</li>
              <li>Chat avg QA score recovered to 90% after Tuesday's coaching cycle.</li>
              <li>Compliance miss pattern — Mark Villanueva, since Monday.</li>
            </ul>

            <h4 className="text-sm font-bold text-slate-900 mt-4 mb-2">G. Sample Flagged Interactions</h4>
            <ul className="text-sm text-slate-700 space-y-1 ml-4 list-disc font-mono text-xs">
              <li>VOICE-2026-04-29-04821 — score 64 — compliance disclosure missing</li>
              <li>CHAT-2026-04-29-08713 — score 62 — informal tone + emoji</li>
              <li>VOICE-2026-04-29-04830 — score 67 — escalation keyword detected</li>
            </ul>

            <p className="text-sm text-slate-800 mt-5">Best,<br/><span className="font-semibold">AI QA Monitoring System</span></p>
            <p className="text-[11px] text-slate-400 mt-3">Sent automatically · 7:00 AM PHT · {selected.recipients} recipients</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ===== SCREEN 9 — QA SAMPLING =====
const SamplingScreen = ({ addToast }) => {
  const [strategy, setStrategy] = useStateSp("Stratified by channel");
  const [pct, setPct] = useStateSp(8);
  const [coverage, setCoverage] = useStateSp({ minAgent:true, minChannel:true, vip:true, neg:false });
  const [cadence, setCadence] = useStateSp("Daily");
  const [last, setLast] = useStateSp("Apr 29, 2026 09:14 PHT — 162 interactions");

  const generate = () => {
    const n = Math.round(3247 * pct / 100);
    setLast(`Apr 29, 2026 ${new Date().toTimeString().slice(0,5)} PHT — ${n} interactions`);
    addToast(`Sample generated · ${n} interactions queued for review.`);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <window.Card title="Sampling strategy">
            <div className="grid grid-cols-2 gap-2">
              {["Pure random","Stratified by channel","Stratified by agent","Stratified by risk"].map(s => (
                <label key={s} className={`flex items-center gap-2 p-2.5 rounded-md border cursor-pointer ${strategy===s ? "border-[var(--accent)] bg-[var(--accent-tint)]/30" : "border-slate-200 hover:bg-slate-50"}`}>
                  <input type="radio" checked={strategy===s} onChange={()=>setStrategy(s)} className="accent-[var(--accent)]"/>
                  <div>
                    <div className="text-xs font-semibold text-slate-900">{s}</div>
                    <div className="text-[11px] text-slate-500">
                      {s==="Pure random" ? "True randomization across all evaluated interactions." :
                       s==="Stratified by channel" ? "Proportional samples from Chat, Voice, Email." :
                       s==="Stratified by agent" ? "Equal floor per agent — fair coverage." :
                       "Oversample high-risk + critical buckets."}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </window.Card>

          <window.Card title="Sample size">
            <div className="flex items-center gap-4">
              <input type="range" min="1" max="25" value={pct} onChange={e=>setPct(parseInt(e.target.value))} className="flex-1 accent-[var(--accent)]"/>
              <div className="text-2xl font-semibold tabular-nums text-slate-900 w-16 text-right">{pct}%</div>
            </div>
            <div className="text-xs text-slate-500 mt-1">≈ <span className="font-semibold tabular-nums text-slate-900">{Math.round(3247*pct/100)}</span> interactions / day at current volume</div>
          </window.Card>

          <window.Card title="Coverage rules">
            <div className="grid grid-cols-2 gap-2">
              {[
                { k:"minAgent",  l:"Min 3 per agent" },
                { k:"minChannel",l:"Min 5 per channel" },
                { k:"vip",       l:"Include all VIP / escalation" },
                { k:"neg",       l:"Include all sentiment-negative" },
              ].map(r => (
                <label key={r.k} className="flex items-center gap-2 p-2 rounded-md border border-slate-200 hover:bg-slate-50">
                  <input type="checkbox" checked={coverage[r.k]} onChange={e=>setCoverage(c=>({...c,[r.k]:e.target.checked}))} className="accent-[var(--accent)]"/>
                  <span className="text-xs text-slate-700">{r.l}</span>
                </label>
              ))}
            </div>
          </window.Card>
        </div>

        <div className="space-y-4">
          <window.Card title="Cadence">
            <select value={cadence} onChange={e=>setCadence(e.target.value)} className="w-full px-2 py-2 border border-slate-200 rounded-md text-sm bg-white">
              {["Daily","Weekly","On-demand"].map(o=><option key={o}>{o}</option>)}
            </select>
            <div className="text-[11px] text-slate-500 mt-2">Next auto-run: <span className="font-semibold text-slate-900">tomorrow 09:00 PHT</span></div>
          </window.Card>

          <window.Card title="Last sample generated">
            <div className="text-xs text-slate-700">{last}</div>
            <window.Btn kind="primary" size="md" className="w-full mt-3" icon={<window.I.shuffle className="w-3.5 h-3.5"/>} onClick={generate}>Generate sample now</window.Btn>
          </window.Card>
        </div>
      </div>

      <window.Card title="Recent samples">
        <table className="w-full text-sm">
          <thead className="bg-slate-50/50 border-b border-slate-100">
            <tr className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              <th className="px-3 py-2 text-left">Date</th>
              <th className="px-3 py-2 text-left">Strategy</th>
              <th className="px-3 py-2 text-left">Count</th>
              <th className="px-3 py-2 text-left">Status</th>
              <th className="px-3 py-2 text-right"/>
            </tr>
          </thead>
          <tbody>
            {window.SAMPLES_HISTORY.map((s,i)=>(
              <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-3 py-2 text-xs text-slate-700 tabular-nums">{s.date}</td>
                <td className="px-3 py-2 text-xs text-slate-600">{s.strategy}</td>
                <td className="px-3 py-2 text-xs font-semibold tabular-nums text-slate-900">{s.count}</td>
                <td className="px-3 py-2"><span className={`text-[11px] px-1.5 py-0.5 rounded border ${s.status==="Ready"?"bg-emerald-50 text-emerald-700 border-emerald-200":"bg-slate-50 text-slate-600 border-slate-200"}`}>{s.status}</span></td>
                <td className="px-3 py-2 text-right"><a className="text-xs text-[var(--accent-deep)] hover:underline">Open in queue →</a></td>
              </tr>
            ))}
          </tbody>
        </table>
      </window.Card>
    </div>
  );
};

// ===== SCREEN 10 — QA FRAMEWORK =====
const FrameworkScreen = ({ addToast }) => {
  const [cats, setCats] = useStateSp([
    { name:"Communication / Tone",     w:20, desc:"Greeting, empathy, language, professionalism." },
    { name:"SOP Adherence",            w:25, desc:"Process steps, scripts, escalation routing." },
    { name:"Resolution Effectiveness", w:25, desc:"Outcome reached, customer needs verified." },
    { name:"Compliance",               w:20, desc:"Required disclosures, regulated language, data handling." },
    { name:"Customer Experience",      w:10, desc:"CSAT signal, effort, sentiment outcome." },
  ]);
  const [thresh, setThresh] = useStateSp({ low:70, comp:true, neg:3, conf:65 });
  // AI autonomy per category — when ON, the AI can auto-send the suggested
  // rewrite WITHOUT human review IF severity is below the floor and confidence
  // is above the floor. Compliance is always OFF (regulatory risk).
  const [autonomy, setAutonomy] = useStateSp({
    tone: true, sop: false, resolution: false, compliance: false, cx: true,
    severityFloor: "Medium",   // auto-resolve only if severity <= this
    confidenceFloor: 85,       // auto-resolve only if model confidence >= this
  });

  // ===== Posture preset =====
  // One slider sets weights + thresholds + autonomy at once. Users start here,
  // then hand-tune below. The slider is continuous 0-100 with three named
  // anchors (Conservative=0, Balanced=50, Aggressive=100); all values
  // interpolate linearly between adjacent anchors so users can stop at
  // "mostly conservative" or "balanced-plus" rather than just three stops.
  const [postureValue, setPostureValue] = useStateSp(50);
  const [postureMeta, setPostureMeta] = useStateSp({
    appliedOn: "Apr 15, 2026 · Maria Dela Cruz",
    manualEdits: 3,
  });
  const isFirstPosture = React.useRef(true);

  const lerpInt = (a, b, t) => Math.round(a + (b - a) * t);
  const interpolate = React.useCallback((value) => {
    const ANCHORS = [
      { v: 0,   label:"Conservative",        tag:"Compliance-first",            desc:"Treat ambiguity as risk. Maximize HITL, escalate freely. Compliance weight is highest.",
        cats:{tone:15,sop:25,resolution:22,compliance:28,cx:10},
        thresh:{low:80,comp:true,neg:2,conf:75},
        autonomy:{ tone:false,sop:false,resolution:false,compliance:false,cx:false,severityFloor:"Low",confidenceFloor:92 },
        projection:{coverage:100,autoResolve:14,flagRate:34} },
      { v: 50,  label:"Balanced",            tag:"Default · recommended for most BPOs",
        desc:"Industry-standard weights. AI handles low-risk on its own; humans handle the rest.",
        cats:{tone:20,sop:25,resolution:25,compliance:20,cx:10},
        thresh:{low:70,comp:true,neg:3,conf:65},
        autonomy:{ tone:true,sop:false,resolution:false,compliance:false,cx:true,severityFloor:"Medium",confidenceFloor:85 },
        projection:{coverage:27,autoResolve:48,flagRate:25} },
      { v: 100, label:"Aggressive",          tag:"Speed-first",                 desc:"Trust the AI. Auto-resolve broadly, only escalate on severe issues. Best for stable, high-volume teams.",
        cats:{tone:25,sop:22,resolution:23,compliance:18,cx:12},
        thresh:{low:60,comp:true,neg:5,conf:50},
        autonomy:{ tone:true,sop:true,resolution:true,compliance:false,cx:"High",severityFloor:"High",confidenceFloor:75 },
        projection:{coverage:11,autoResolve:76,flagRate:16} },
    ];
    // Pick the two anchors to interpolate between
    let lo = ANCHORS[0], hi = ANCHORS[1];
    if (value >= 50) { lo = ANCHORS[1]; hi = ANCHORS[2]; }
    const t = (value - lo.v) / (hi.v - lo.v);
    // Category weights, then renormalize to 100 by absorbing rounding error into the largest
    const catsRaw = [
      { name:"Communication / Tone",     w: lerpInt(lo.cats.tone,       hi.cats.tone,       t), desc:"Greeting, empathy, language, professionalism." },
      { name:"SOP Adherence",            w: lerpInt(lo.cats.sop,        hi.cats.sop,        t), desc:"Process steps, scripts, escalation routing." },
      { name:"Resolution Effectiveness", w: lerpInt(lo.cats.resolution, hi.cats.resolution, t), desc:"Outcome reached, customer needs verified." },
      { name:"Compliance",               w: lerpInt(lo.cats.compliance, hi.cats.compliance, t), desc:"Required disclosures, regulated language, data handling." },
      { name:"Customer Experience",      w: lerpInt(lo.cats.cx,         hi.cats.cx,         t), desc:"CSAT signal, effort, sentiment outcome." },
    ];
    const sum = catsRaw.reduce((s,c)=>s+c.w, 0);
    if (sum !== 100) {
      const maxIdx = catsRaw.reduce((m,c,i,a) => c.w > a[m].w ? i : m, 0);
      catsRaw[maxIdx] = { ...catsRaw[maxIdx], w: catsRaw[maxIdx].w + (100 - sum) };
    }
    // Friendly label for in-between values
    let label, tag, desc;
    if (value < 8)         { label = "Conservative";        tag = "Compliance-first";       desc = ANCHORS[0].desc; }
    else if (value < 35)   { label = "Mostly conservative"; tag = "Caution-leaning";        desc = "Lean toward HITL — most flags escalate. Few drafts auto-resolve."; }
    else if (value < 42)   { label = "Slightly conservative";tag = "Balanced-minus";        desc = "Mostly balanced, but more cautious on compliance and resolution."; }
    else if (value <= 58)  { label = "Balanced";            tag = "Default";                desc = ANCHORS[1].desc; }
    else if (value < 65)   { label = "Slightly aggressive"; tag = "Balanced-plus";          desc = "Mostly balanced, but more AI confidence in low-risk categories."; }
    else if (value < 92)   { label = "Mostly aggressive";   tag = "Trust-leaning";          desc = "Trust the AI on most flag types. HITL reserved for severe issues."; }
    else                   { label = "Aggressive";          tag = "Speed-first";            desc = ANCHORS[2].desc; }
    return {
      cats: catsRaw,
      thresh: {
        low:  lerpInt(lo.thresh.low,  hi.thresh.low,  t),
        comp: true,
        neg:  lerpInt(lo.thresh.neg,  hi.thresh.neg,  t),
        conf: lerpInt(lo.thresh.conf, hi.thresh.conf, t),
      },
      autonomy: {
        tone:       value >= 25,
        cx:         value >= 30,
        resolution: value >= 65,
        sop:        value >= 70,
        compliance: false,
        severityFloor: value < 30 ? "Low" : value < 70 ? "Medium" : "High",
        confidenceFloor: lerpInt(lo.autonomy.confidenceFloor, hi.autonomy.confidenceFloor, t),
      },
      projection: {
        autoResolve: lerpInt(lo.projection.autoResolve, hi.projection.autoResolve, t),
        coverage:    lerpInt(lo.projection.coverage,    hi.projection.coverage,    t),
        flagRate:    lerpInt(lo.projection.flagRate,    hi.projection.flagRate,    t),
      },
      label, tag, desc, value,
    };
  }, []);

  // Posture is the source-of-truth for cats/thresh/autonomy — applying the
  // slider rewrites them. Manual edits below the slider count as drift; the
  // posture meta line records how many.
  React.useEffect(() => {
    if (isFirstPosture.current) { isFirstPosture.current = false; return; }
    const interp = interpolate(postureValue);
    setCats(interp.cats);
    setThresh(interp.thresh);
    setAutonomy(interp.autonomy);
    setPostureMeta({
      appliedOn: `${window.TODAY_LABEL} · Maria Dela Cruz`,
      manualEdits: 0,
    });
  }, [postureValue, interpolate]);

  const INDUSTRIES = [
    { id:"bpo",        label:"BPO / Call center",      base: 50, tilt:"balanced — equal weight, Slack alerts" },
    { id:"finance",    label:"Finance / Fintech",      base: 5,  tilt:"compliance-heavy, 5-min critical SLA" },
    { id:"healthcare", label:"Healthcare / Insurance", base: 12, tilt:"HIPAA-aware, audit-first" },
    { id:"ecom",       label:"E-commerce",             base: 42, tilt:"resolution-weighted, sentiment trigger 2" },
    { id:"saas",       label:"SaaS support",           base: 78, tilt:"tone-weighted, fast auto-resolve" },
  ];

  const applyIndustry = (val, label) => {
    setPostureValue(val);
    addToast(`Posture set for ${label}.`);
  };

  // Count manual edits to the category weights vs. what posture would produce
  const baselineCats = React.useMemo(() => interpolate(postureValue).cats, [postureValue, interpolate]);
  const driftedCats = cats.reduce((n, c, i) => baselineCats[i] && baselineCats[i].w !== c.w ? n+1 : n, 0);

  const setCatWeight = (i, w) => {
    setCats(cs => cs.map((x, j) => j === i ? { ...x, w } : x));
    setPostureMeta(m => ({ ...m, manualEdits: driftedCats + 1 }));
  };

  const postureNow = interpolate(postureValue);

  const total = cats.reduce((s,c)=>s+c.w, 0);

  return (
    <div className="space-y-4 pb-24">
      {/* Posture preset — merged with scorecard categories so they update in lockstep */}
      <window.Card
        title={<div className="flex items-center gap-2">
          <h3 className="text-base font-semibold text-slate-900">QA posture & scorecard</h3>
          <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-violet-100 text-violet-700">Start here</span>
          <window.InfoTip title="QA posture">A single dial that sets category weights, evaluation thresholds, AI autonomy, and SLA fallback all together. Conservative = more HITL, more humans in the loop. Aggressive = more AI autonomy, faster resolution. The slider is continuous — pick anywhere on the spectrum.</window.InfoTip>
        </div>}
        action={<span className="text-[11px] text-slate-500">{postureMeta.appliedOn} · {driftedCats} manual {driftedCats === 1 ? "edit" : "edits"} since</span>}>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-5">
          {/* LEFT: continuous slider + descriptor + industries */}
          <div>
            {/* Continuous 0–100 slider — gradient track with custom circular thumb */}
            <div className="px-1">
              <div className="relative h-7 select-none">
                {/* Colorful gradient track (Conservative → Balanced → Aggressive) */}
                <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1.5 rounded-full bg-gradient-to-r from-sky-200 via-emerald-200 to-amber-200"/>
                {/* Active accent fill on top */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1.5 rounded-full bg-[var(--accent)] transition-all duration-150"
                     style={{ width: `${postureValue}%` }}/>
                {/* Anchor dots at 0 / 50 / 100 */}
                {[0, 50, 100].map(v => (
                  <div key={v}
                       className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white border border-slate-300 pointer-events-none"
                       style={{ left: `${v}%`, marginLeft: -4 }}/>
                ))}
                {/* Circular thumb at the current value */}
                <div className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[var(--accent)] border-2 border-white shadow-md transition-all duration-150 pointer-events-none"
                     style={{ left: `${postureValue}%`, marginLeft: -10 }}/>
                {/* Native input on top — invisible, captures interaction */}
                <input type="range" min="0" max="100" step="1" value={postureValue}
                       onChange={(e)=>setPostureValue(parseInt(e.target.value))}
                       className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                       aria-label="QA posture"/>
              </div>
              <div className="grid grid-cols-3 mt-1 text-[10px]">
                <span className={`text-left ${postureValue < 30 ? "text-slate-900 font-semibold" : "text-slate-500"}`}>Conservative</span>
                <span className={`text-center ${postureValue >= 30 && postureValue <= 70 ? "text-slate-900 font-semibold" : "text-slate-500"}`}>Balanced</span>
                <span className={`text-right ${postureValue > 70 ? "text-slate-900 font-semibold" : "text-slate-500"}`}>Aggressive</span>
              </div>
            </div>

            {/* Active posture descriptor */}
            <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50/50 p-2.5">
              <div className="flex items-center gap-2 mb-0.5">
                <window.I.sliders className="w-3.5 h-3.5 text-[var(--accent)]"/>
                <div className="text-xs font-semibold text-slate-900">{postureNow.label}</div>
                <span className="text-[10px] text-slate-500">· {postureNow.tag}</span>
                <span className="text-[10px] text-slate-400 ml-auto tabular-nums">{postureValue}/100</span>
              </div>
              <div className="text-[11px] text-slate-600 leading-snug">{postureNow.desc}</div>
            </div>

            {/* Industry quick-sets */}
            <div className="mt-3">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Industry quick-sets</div>
              <div className="flex flex-wrap gap-1.5">
                {INDUSTRIES.map(ind => (
                  <button key={ind.id} onClick={()=>applyIndustry(ind.base, ind.label)}
                          title={ind.tilt}
                          className={`text-[11px] px-2 py-1 rounded-md border transition ${
                            Math.abs(postureValue - ind.base) < 3
                              ? "border-[var(--accent)] bg-[var(--accent-tint)]/40 text-[var(--accent-deep)] font-semibold"
                              : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                          }`}>
                    {ind.label} <span className="text-slate-400">· {ind.base}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: projection metrics */}
          <div className="space-y-2">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Projected impact (next 7d)</div>
            {[
              { l:"Auto-resolved by AI", v:`${postureNow.projection.autoResolve}%`, sub:"of flagged drafts",    color:"emerald", fill: postureNow.projection.autoResolve },
              { l:"Routed to HITL",      v:`${postureNow.projection.coverage}%`,    sub:"of all interactions",  color:"violet",  fill: postureNow.projection.coverage },
              { l:"Flag rate",           v:`${postureNow.projection.flagRate}%`,    sub:"flagged at all",       color:"amber",   fill: postureNow.projection.flagRate },
            ].map((k, i) => (
              <div key={i} className="rounded-lg border border-slate-200 bg-white p-2.5">
                <div className="flex items-baseline justify-between">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{k.l}</div>
                  <div className={`text-xl font-semibold tabular-nums text-${k.color}-700 transition-all duration-300`}>{k.v}</div>
                </div>
                <div className="text-[11px] text-slate-500 mb-1">{k.sub}</div>
                <div className="h-1 rounded-full bg-slate-100">
                  <div className={`h-full rounded-full bg-${k.color}-500 transition-all duration-300`} style={{width:`${k.fill}%`}}/>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-200 my-4"/>

        {/* Scorecard category weights — visible side-by-side with the posture slider */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-semibold text-slate-900">Category weights</h4>
              <span className="text-[10px] text-slate-500">posture drives these · hand-tune below to override</span>
            </div>
            <span className={`text-xs font-semibold tabular-nums ${total===100?"text-emerald-600":"text-rose-600"}`}>
              {total===100 && <window.I.check className="w-3 h-3 inline-block mr-0.5"/>}
              Total weight: {total}%
            </span>
          </div>
          <div className="space-y-2">
            {cats.map((c,i) => {
              const baseline = baselineCats[i] ? baselineCats[i].w : c.w;
              const isDrifted = baseline !== c.w;
              return (
                <div key={c.name} className="grid grid-cols-[200px_1fr_56px_24px] gap-3 items-center">
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-slate-900 truncate">{c.name}</div>
                    <div className="text-[10px] text-slate-500 truncate">{c.desc}</div>
                  </div>
                  {/* Animated bar with circular thumb */}
                  <div className="relative h-4 select-none">
                    {/* Track */}
                    <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-2 rounded-full bg-slate-100"/>
                    {/* Animated fill */}
                    <div className={`absolute left-0 top-1/2 -translate-y-1/2 h-2 rounded-full transition-all duration-300 ease-out ${isDrifted ? "bg-amber-500" : "bg-[var(--accent)]"}`}
                         style={{ width: `${(c.w / 50) * 100}%` }}/>
                    {/* Circular thumb */}
                    <div className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white shadow transition-all duration-300 ease-out pointer-events-none border-2 ${isDrifted ? "border-amber-500" : "border-[var(--accent)]"}`}
                         style={{ left: `${(c.w / 50) * 100}%`, marginLeft: -8 }}/>
                    {/* Native slider on top for manual editing (invisible) */}
                    <input type="range" min="0" max="50" value={c.w}
                           onChange={(e)=>setCatWeight(i, parseInt(e.target.value))}
                           className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                           aria-label={`${c.name} weight`}/>
                  </div>
                  <div className="flex items-center gap-1 justify-end">
                    <div className={`text-sm font-semibold tabular-nums w-9 text-right transition-all duration-300 ${isDrifted ? "text-amber-600" : "text-slate-900"}`}>{c.w}%</div>
                    {isDrifted && (
                      <span className="text-[9px] text-amber-600 font-semibold" title={`Posture would set this to ${baseline}%`}>·</span>
                    )}
                  </div>
                  <button className="text-slate-400 hover:text-slate-600"><window.I.more className="w-4 h-4"/></button>
                </div>
              );
            })}
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div className="text-[10px] text-slate-500">
              {driftedCats > 0
                ? <span className="inline-flex items-center gap-1 text-amber-700"><window.I.alert className="w-3 h-3"/>Drift from posture · drag posture slider to reset</span>
                : "Drag the posture slider to update all weights in lockstep, or fine-tune individual weights here."}
            </div>
            <a className="text-[11px] text-[var(--accent-deep)] hover:underline cursor-pointer">+ Add criterion</a>
          </div>
        </div>
      </window.Card>

      <window.Card title="Thresholds">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-700">Low-quality threshold</label>
            <div className="flex items-center gap-2 mt-1">
              <input type="number" value={thresh.low} onChange={e=>setThresh(t=>({...t,low:parseInt(e.target.value)||0}))}
                     className="w-20 px-2 py-1.5 border border-slate-200 rounded-md text-sm tabular-nums"/>
              <span className="text-xs text-slate-500">interactions below this are auto-flagged</span>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-700">Compliance violation auto-flag</label>
            <div className="flex items-center gap-2 mt-1">
              <button onClick={()=>setThresh(t=>({...t,comp:!t.comp}))}
                      className={`relative w-10 h-6 rounded-full transition ${thresh.comp ? "bg-[var(--accent)]" : "bg-slate-300"}`}>
                <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${thresh.comp ? "left-[18px]" : "left-0.5"}`}/>
              </button>
              <span className="text-xs text-slate-600">{thresh.comp ? "Enabled" : "Disabled"}</span>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-700">Negative sentiment escalation count</label>
            <div className="flex items-center gap-2 mt-1">
              <input type="number" value={thresh.neg} onChange={e=>setThresh(t=>({...t,neg:parseInt(e.target.value)||0}))}
                     className="w-20 px-2 py-1.5 border border-slate-200 rounded-md text-sm tabular-nums"/>
              <span className="text-xs text-slate-500">frustration signals in 90s → HITL</span>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-700">HITL routing confidence cutoff</label>
            <div className="flex items-center gap-2 mt-1">
              <input type="number" value={thresh.conf} onChange={e=>setThresh(t=>({...t,conf:parseInt(e.target.value)||0}))}
                     className="w-20 px-2 py-1.5 border border-slate-200 rounded-md text-sm tabular-nums"/>
              <span className="text-xs text-slate-500">% — below this routes to QA review</span>
            </div>
          </div>
        </div>
      </window.Card>

      <window.Card
        title={<div className="flex items-center gap-2"><h3 className="text-base font-semibold text-slate-900">AI autonomy — auto-resolve rules</h3><span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-violet-100 text-violet-700">New</span><window.InfoTip title="AI autonomy">Per-category permissions for the AI to auto-send rewrites without a human review. Combined with a Severity floor (max issue severity to auto-resolve) and Confidence floor (min model confidence required). Compliance is always locked off — regulatory rules require human review.</window.InfoTip></div>}
        action={<span className="text-xs text-slate-500">controls which Gating holds the AI may send without a human</span>}>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-5">
          {/* Per-category toggles */}
          <div className="space-y-2">
            {[
              { key:"tone",       label:"Communication / Tone",     desc:"Softener missing, casual phrasing, missing greeting — safe to auto-rewrite.", risk:"low" },
              { key:"sop",        label:"SOP Adherence",            desc:"Missed steps, wrong escalation path — process risk if auto-resolved.",       risk:"medium" },
              { key:"resolution", label:"Resolution Effectiveness", desc:"Verification missing, outcome unclear — context-dependent, human-preferred.", risk:"medium" },
              { key:"compliance", label:"Compliance",               desc:"Required disclosures, regulated language — regulatory risk, always escalate.", risk:"locked" },
              { key:"cx",         label:"Customer Experience",      desc:"Empathy markers, closing protocol — safe to auto-rewrite.",                    risk:"low" },
            ].map(c => {
              const on = autonomy[c.key];
              const locked = c.risk === "locked";
              const riskPill = {
                low:    "bg-emerald-50 text-emerald-700 border-emerald-200",
                medium: "bg-amber-50 text-amber-700 border-amber-200",
                locked: "bg-rose-50 text-rose-700 border-rose-200",
              }[c.risk];
              const riskLabel = { low:"Low risk", medium:"Medium risk", locked:"Locked" }[c.risk];
              return (
                <div key={c.key} className={`flex items-start gap-3 rounded-lg border p-3 ${on && !locked ? "border-emerald-200 bg-emerald-50/30" : "border-slate-200 bg-white"} ${locked ? "opacity-70" : ""}`}>
                  <button
                    disabled={locked}
                    onClick={() => setAutonomy(a => ({...a, [c.key]: !a[c.key]}))}
                    className={`mt-0.5 relative w-9 h-5 rounded-full flex-shrink-0 transition ${locked ? "bg-slate-200 cursor-not-allowed" : on ? "bg-emerald-500" : "bg-slate-300"}`}>
                    <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${on && !locked ? "left-[18px]" : "left-0.5"}`}/>
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <div className="text-xs font-semibold text-slate-900">{c.label}</div>
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${riskPill}`}>{riskLabel}</span>
                      {locked && <window.I.shield className="w-3 h-3 text-rose-500"/>}
                    </div>
                    <div className="text-[11px] text-slate-600 leading-snug">{c.desc}</div>
                    <div className={`text-[11px] mt-1 font-medium ${on && !locked ? "text-emerald-700" : locked ? "text-rose-600" : "text-slate-500"}`}>
                      {locked ? "Always escalates to supervisor — cannot be auto-resolved" :
                       on ? "✓ Auto-send suggested rewrite if confidence floor met" :
                            "Routes to supervisor for review"}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Floors + projection */}
          <div className="space-y-3">
            <div className="rounded-lg border border-slate-200 p-3">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-2">Severity floor</div>
              <div className="flex items-center bg-slate-50 rounded-md p-0.5 border border-slate-200">
                {["Low","Medium","High"].map(s => (
                  <button key={s} onClick={()=>setAutonomy(a=>({...a, severityFloor: s}))}
                          className={`flex-1 text-xs px-2 py-1 rounded ${autonomy.severityFloor === s ? "bg-white shadow-sm text-slate-900 font-semibold" : "text-slate-500"}`}>
                    {s}
                  </button>
                ))}
              </div>
              <div className="text-[11px] text-slate-500 mt-1.5">Auto-resolve only when severity ≤ <span className="font-semibold text-slate-900">{autonomy.severityFloor}</span>.</div>
            </div>
            <div className="rounded-lg border border-slate-200 p-3">
              <div className="flex items-center justify-between mb-1.5">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Confidence floor</div>
                <div className="text-sm font-semibold tabular-nums text-slate-900">{autonomy.confidenceFloor}%</div>
              </div>
              <input type="range" min="60" max="99" value={autonomy.confidenceFloor}
                     onChange={(e)=>setAutonomy(a=>({...a, confidenceFloor: parseInt(e.target.value)}))}
                     className="w-full accent-emerald-500"/>
              <div className="flex justify-between text-[10px] text-slate-400 tabular-nums">
                <span>60%</span><span>99%</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1">Auto-resolve only when model confidence in the rewrite ≥ <span className="font-semibold text-slate-900">{autonomy.confidenceFloor}%</span>.</div>
            </div>
            {/* Projection */}
            {(() => {
              const onCount = ["tone","sop","resolution","compliance","cx"].filter(k => autonomy[k] && k !== "compliance").length;
              // Quick mock math: each enabled low-risk category resolves ~24% of holds; medium ~12%.
              const lowOn = (autonomy.tone ? 1 : 0) + (autonomy.cx ? 1 : 0);
              const medOn = (autonomy.sop ? 1 : 0) + (autonomy.resolution ? 1 : 0);
              let pct = lowOn * 24 + medOn * 12;
              // Penalize for high confidence floor
              pct *= Math.max(0.3, 1 - (autonomy.confidenceFloor - 85) * 0.025);
              pct = Math.max(0, Math.min(95, Math.round(pct)));
              const ofTotal = window.GATING_STATS.totalToday;
              const wouldResolve = Math.round(ofTotal * pct / 100);
              return (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50/40 p-3">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <window.I.zap className="w-3.5 h-3.5 text-emerald-600"/>
                    <div className="text-[11px] font-semibold text-emerald-900">Projected auto-resolve</div>
                  </div>
                  <div className="text-2xl font-semibold tabular-nums text-emerald-900">{pct}%</div>
                  <div className="text-[11px] text-emerald-900/80">
                    ≈ <span className="font-semibold tabular-nums">{wouldResolve}</span> of {ofTotal} today's drafts would skip the supervisor queue under these rules.
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </window.Card>

      <window.Card
        title={<div className="flex items-center gap-2"><h3 className="text-base font-semibold text-slate-900">SLA fallback actions</h3><span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-100 text-amber-700">Safety</span></div>}
        action={<span className="text-xs text-slate-500">what happens when a hold's SLA expires without supervisor action</span>}>
        <div className="space-y-2">
          {[
            { sev:"Critical", desc:"Severe compliance / regulatory risk", sla:"5 min", lock:true,  defaultAction:"block" },
            { sev:"High",     desc:"Major SOP or tone violation",         sla:"60s",   lock:false, defaultAction:"block" },
            { sev:"Medium",   desc:"Moderate quality concern",            sla:"60s",   lock:false, defaultAction:"send-suggested" },
            { sev:"Low",      desc:"Minor coaching opportunity",          sla:"30s",   lock:false, defaultAction:"send-suggested" },
          ].map(row => (
            <div key={row.sev} className="grid grid-cols-[120px_1fr_80px_1fr] gap-3 items-center rounded-md border border-slate-200 p-2.5">
              <div className="flex items-center gap-2">
                <window.RiskBadge level={row.sev}/>
                {row.lock && <window.I.shield className="w-3 h-3 text-rose-500" title="Locked — regulatory"/>}
              </div>
              <div className="text-xs text-slate-600">{row.desc}</div>
              <div className="text-xs text-slate-700">
                <div className="text-[10px] uppercase tracking-wider text-slate-400">SLA</div>
                <div className="font-semibold tabular-nums">{row.sla}</div>
              </div>
              <div className="flex items-center bg-slate-50 rounded-md p-0.5 border border-slate-200">
                {[
                  { k:"block",          l:"Block",     cls:"text-rose-700" },
                  { k:"send-suggested", l:"Send suggested", cls:"text-amber-700" },
                  { k:"send-original",  l:"Send original",  cls:"text-slate-700" },
                ].map(opt => {
                  const on = row.defaultAction === opt.k;
                  const disabled = row.lock && opt.k !== "block";
                  return (
                    <button key={opt.k} disabled={disabled}
                            className={`flex-1 text-[11px] px-1.5 py-1 rounded transition ${
                              on ? "bg-white shadow-sm font-semibold " + opt.cls
                                 : "text-slate-500 hover:text-slate-700"
                            } ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}>
                      {opt.l}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 text-[11px] text-slate-500 inline-flex items-center gap-1.5">
          <window.I.info className="w-3 h-3"/>
          <span>Critical is locked to "Block" — regulatory rules prevent auto-sending compliance-flagged messages without human review.</span>
        </div>
      </window.Card>

      <window.Card title="Reference examples — good vs. poor" action={<span className="text-xs text-slate-500">trains the AI's understanding</span>}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600 mb-1">Good example</div>
            <textarea rows={4} className="w-full px-2 py-1.5 border border-slate-200 rounded-md text-xs font-mono"
                      defaultValue={`Agent: Thanks for waiting, Mr. Chen. Before I process the refund, please note our policy allows refunds within 7 business days for shipping fees. I'll go ahead and confirm the amount with you — does ₱149 sound right?\nCustomer: Yes, thank you.\nAgent: Refund processed. Confirmation #R-44821. Anything else?`}/>
          </div>
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-rose-600 mb-1">Poor example</div>
            <textarea rows={4} className="w-full px-2 py-1.5 border border-slate-200 rounded-md text-xs font-mono"
                      defaultValue={`Agent: I'll process the shipping fee refund right now ma'am.\nCustomer: I want a full refund and a supervisor.\nAgent: The refund will reflect in 5–7 business days, anything else?\n[Required disclosure missing. Supervisor request not honored.]`}/>
          </div>
        </div>
      </window.Card>

      <div className="fixed bottom-0 left-[240px] right-0 bg-white/95 backdrop-blur border-t border-slate-200 px-6 py-3 flex items-center gap-3 z-20">
        <span className="text-[11px] text-slate-500">Last saved 2h ago by Maria Dela Cruz</span>
        <div className="flex-1"/>
        <window.Btn kind="ghost" size="md">Discard</window.Btn>
        <window.Btn kind="primary" size="md" onClick={()=>addToast("Rubric saved. Re-scoring last 24h in background.")}>Save changes</window.Btn>
      </div>
    </div>
  );
};

// ===== SCREEN 11 — ALERTS =====
const AlertsScreen = ({ addToast }) => {
  const [selected, setSelected] = useStateSp(window.ALERT_RULES[0]);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-4">
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="px-3 py-2.5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900">Alert rules</h3>
          <window.Btn kind="ghost" size="sm" icon={<window.I.plus className="w-3 h-3"/>}>New rule</window.Btn>
        </div>
        <div className="divide-y divide-slate-100">
          {window.ALERT_RULES.map(r=>(
            <button key={r.id} onClick={()=>setSelected(r)}
                    className={`w-full px-3 py-2.5 text-left hover:bg-slate-50 ${selected.id===r.id ? "bg-[var(--accent-tint)]/40" : ""}`}>
              <div className="text-xs font-semibold text-slate-900">{r.trigger}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">{r.condition}</div>
              <div className="flex items-center gap-1 mt-1">
                {r.channel.map(c=>(
                  <span key={c} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">{c}</span>
                ))}
                <span className="text-[10px] text-slate-500 ml-auto">→ {r.dest}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="px-4 py-3 border-b border-slate-100">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Edit rule</div>
          <div className="text-base font-semibold text-slate-900">{selected.trigger}</div>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700">Trigger</label>
              <select className="w-full mt-1 px-2 py-1.5 border border-slate-200 rounded-md text-sm bg-white">
                <option>{selected.trigger}</option>
                <option>Custom event…</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700">Condition</label>
              <input defaultValue={selected.condition} className="w-full mt-1 px-2 py-1.5 border border-slate-200 rounded-md text-sm"/>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-700">Channels</label>
            <div className="flex items-center gap-1.5 mt-1">
              {["Slack","Email","Webhook","SMS"].map(c=>{
                const on = selected.channel.includes(c);
                return <button key={c} className={`text-xs px-2 py-1 rounded-md border ${on ? "bg-[var(--accent-tint)] border-[var(--accent-border)] text-[var(--accent-deep)] font-semibold" : "bg-white border-slate-200 text-slate-600"}`}>{c}</button>;
              })}
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-700">Recipients</label>
            <div className="mt-1 px-2 py-1.5 border border-slate-200 rounded-md text-sm bg-white flex flex-wrap gap-1 min-h-[36px]">
              {selected.recipients.map(r=>(
                <span key={r} className="inline-flex items-center gap-1 text-[11px] px-1.5 py-0.5 bg-slate-100 rounded">
                  {r}<window.I.x className="w-3 h-3 text-slate-400"/>
                </span>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-700">Throttle</label>
            <input defaultValue={selected.throttle} className="w-full mt-1 px-2 py-1.5 border border-slate-200 rounded-md text-sm"/>
          </div>
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <window.Btn kind="ghost" size="sm" onClick={()=>addToast("Test alert sent.")}>Send test</window.Btn>
            <window.Btn kind="primary" size="sm" onClick={()=>addToast("Alert rule saved.")}>Save rule</window.Btn>
          </div>
        </div>
      </div>
    </div>
  );
};

// ===== SCREEN 12 — INTEGRATIONS =====
// Brand logos with multi-tier fallback: Clearbit → Google favicon → DuckDuckGo
// → colored monogram. We progress through tiers on each onError so something
// brand-shaped always shows up.
const LOGO_SOURCES = [
  (d) => `https://www.google.com/s2/favicons?domain=${d}&sz=128`,
  (d) => `https://icons.duckduckgo.com/ip3/${d}.ico`,
];

const LogoBox = ({ name, domain, size = 40 }) => {
  const [tier, setTier] = useStateSp(0);
  const colorClass = window.colorForName(name);
  const monogram = name.replace(/[()]/g, "").split(/\s+/).slice(0,2).map(w => w[0]).join("").toUpperCase();

  if (!domain || tier >= LOGO_SOURCES.length) {
    return (
      <div className={`rounded-md flex items-center justify-center font-bold text-base flex-shrink-0 ${colorClass}`}
           style={{ width: size, height: size }}>
        {monogram}
      </div>
    );
  }
  const src = LOGO_SOURCES[tier](domain);
  return (
    <div className="rounded-md bg-white border border-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0"
         style={{ width: size, height: size }}>
      <img key={tier} src={src} alt={name}
           className="object-contain"
           style={{ width: size - 12, height: size - 12 }}
           onError={() => setTier(t => t + 1)}/>
    </div>
  );
};

const IntegrationsScreen = ({ addToast }) => {
  const [modal, setModal] = useStateSp(null);
  const status = (s) => {
    const map = {
      Connected:       "bg-emerald-50 text-emerald-700 border-emerald-200",
      "Not connected": "bg-slate-50 text-slate-600 border-slate-200",
      Error:           "bg-rose-50 text-rose-700 border-rose-200",
    };
    return map[s];
  };
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {window.INTEGRATIONS.map(it => (
          <div key={it.name} className={`rounded-xl border ${it.primary ? "border-[var(--accent-border)] bg-[var(--accent-tint)]/20" : "border-slate-200 bg-white"} shadow-sm p-4`}>
            <div className="flex items-start justify-between mb-3">
              <LogoBox name={it.name} domain={it.domain}/>
              <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${status(it.status)}`}>{it.status}</span>
            </div>
            <div className="text-sm font-semibold text-slate-900">{it.name}{it.primary && <span className="ml-1 text-[10px] text-[var(--accent-deep)] font-bold uppercase tracking-wider">Primary</span>}</div>
            <div className="text-[11px] text-slate-500">{it.category}</div>
            <window.Btn kind="secondary" size="sm" className="w-full mt-3" onClick={()=>setModal(it)}>Configure</window.Btn>
          </div>
        ))}
      </div>

      <window.Modal open={!!modal} onClose={()=>setModal(null)}
        title={modal ? (
          <span className="flex items-center gap-2">
            <LogoBox name={modal.name} domain={modal.domain} size={28}/>
            Configure {modal.name}
          </span>
        ) : ""}
        footer={
          <>
            <window.Btn kind="ghost" size="md" onClick={()=>setModal(null)}>Cancel</window.Btn>
            <window.Btn kind="secondary" size="md" onClick={()=>addToast("Connection test successful.")}>Test connection</window.Btn>
            <window.Btn kind="primary" size="md" onClick={()=>{addToast(`${modal.name} configuration saved.`); setModal(null);}}>Save</window.Btn>
          </>
        }>
        {modal && (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-700">API Key</label>
              <input type="password" defaultValue="••••••••••••••••" className="w-full mt-1 px-2 py-1.5 border border-slate-200 rounded-md text-sm"/>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700">Region</label>
                <select className="w-full mt-1 px-2 py-1.5 border border-slate-200 rounded-md text-sm bg-white">
                  <option>APAC (Singapore)</option><option>US (Virginia)</option><option>EU (Frankfurt)</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700">Sync mode</label>
                <select className="w-full mt-1 px-2 py-1.5 border border-slate-200 rounded-md text-sm bg-white">
                  <option>Webhook (recommended)</option><option>Polling</option><option>Streaming</option>
                </select>
              </div>
            </div>
            <div className="rounded-md border border-slate-200 bg-slate-50 p-2.5">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1">Sync history</div>
              <div className="text-xs text-slate-700 space-y-0.5">
                <div className="flex justify-between"><span>Last sync</span><span className="tabular-nums">2m ago — 47 records</span></div>
                <div className="flex justify-between"><span>Today</span><span className="tabular-nums">3,247 records</span></div>
                <div className="flex justify-between"><span>Failures (24h)</span><span className="tabular-nums">0</span></div>
              </div>
            </div>
          </div>
        )}
      </window.Modal>
    </div>
  );
};

// ===== SCREEN 13 — AUDIT LOG =====
const AuditScreen = () => {
  const [actorType, setActorType] = useStateSp("All");
  const [search, setSearch] = useStateSp("");
  const filtered = window.AUDIT_ROWS.filter(r => {
    if (actorType !== "All" && r.actorType !== actorType) return false;
    if (search && !(r.actor + r.action + r.target).toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center gap-2 px-3 py-2.5 border-b border-slate-100">
        <select value={actorType} onChange={e=>setActorType(e.target.value)} className="text-xs border border-slate-200 rounded-md px-2 py-1 bg-white">
          {["All","AI","Human"].map(o=><option key={o}>{o}</option>)}
        </select>
        <select className="text-xs border border-slate-200 rounded-md px-2 py-1 bg-white">
          <option>All actions</option><option>Override score</option><option>Flagged interaction</option><option>Acknowledged alert</option>
        </select>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search actor, action, target…"
               className="text-xs border border-slate-200 rounded-md px-2 py-1 w-72"/>
        <div className="flex-1"/>
        <span className="text-xs text-slate-500 tabular-nums">{filtered.length} events · immutable</span>
        <window.Btn kind="secondary" size="sm" icon={<window.I.download className="w-3 h-3"/>}>Export CSV</window.Btn>
      </div>
      <div className="overflow-x-auto max-h-[680px] overflow-y-auto scroll-thin">
        <table className="w-full text-sm">
          <thead className="bg-slate-50/50 border-b border-slate-100 sticky top-0">
            <tr className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              <th className="px-3 py-2 text-left">Timestamp</th>
              <th className="px-2 py-2 text-left">Actor</th>
              <th className="px-2 py-2 text-left">Action</th>
              <th className="px-2 py-2 text-left">Target</th>
              <th className="px-2 py-2 text-left">Before → After</th>
              <th className="px-2 py-2 text-left">Source IP</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r,i)=>(
              <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-3 py-2 text-[11px] font-mono text-slate-600 whitespace-nowrap">{r.ts}</td>
                <td className="px-2 py-2">
                  <div className="flex items-center gap-1.5">
                    {r.actorType==="AI"
                      ? <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 bg-violet-50 text-violet-700 border border-violet-200 rounded"><window.I.bot className="w-3 h-3"/>AI</span>
                      : <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 bg-sky-50 text-sky-700 border border-sky-200 rounded"><window.I.user className="w-3 h-3"/>Human</span>}
                    <span className="text-xs text-slate-700">{r.actor}</span>
                  </div>
                </td>
                <td className="px-2 py-2 text-xs text-slate-700">{r.action}</td>
                <td className="px-2 py-2 text-[11px] font-mono text-slate-600">{r.target}</td>
                <td className="px-2 py-2 text-[11px] text-slate-600">
                  <span className="text-slate-400">{r.before}</span>
                  <window.I.chevRight className="w-3 h-3 inline-block mx-0.5 text-slate-300"/>
                  <span>{r.after}</span>
                </td>
                <td className="px-2 py-2 text-[11px] font-mono text-slate-500">{r.ip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ===== SCREEN 14 — TEAM =====
const TeamScreen = () => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between px-3 py-2.5 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-900">Members</h3>
          <window.Btn kind="primary" size="sm" icon={<window.I.plus className="w-3 h-3"/>}>Invite member</window.Btn>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-slate-50/50 border-b border-slate-100">
            <tr className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              <th className="px-3 py-2 text-left">Member</th>
              <th className="px-2 py-2 text-left">Role</th>
              <th className="px-2 py-2 text-left">Team</th>
              <th className="px-2 py-2 text-left">Status</th>
              <th className="px-2 py-2"/>
            </tr>
          </thead>
          <tbody>
            {window.TEAM_MEMBERS.map(m=>(
              <tr key={m.email} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <window.AgentAvatar name={m.name}/>
                    <div>
                      <div className="text-xs font-semibold text-slate-900">{m.name}</div>
                      <div className="text-[11px] text-slate-500">{m.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-2 py-2.5"><span className="text-xs px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">{m.role}</span></td>
                <td className="px-2 py-2.5 text-xs text-slate-600">{m.team}</td>
                <td className="px-2 py-2.5"><span className="text-[11px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">{m.status}</span></td>
                <td className="px-2 py-2.5"><button className="text-xs text-[var(--accent-deep)] hover:underline">Edit</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <window.Card title="Role permissions">
        <div className="space-y-2.5 text-xs">
          {[
            { r:"QA Analyst",  p:["Review HITL queue","Validate / override scores","Leave feedback","Read-only on settings"] },
            { r:"Supervisor",  p:["Watch live monitoring","Intervene in conversations","Acknowledge alerts","Read agent scorecards"] },
            { r:"Manager",     p:["All Supervisor & Analyst","Export reports","Configure rubric","Edit alert rules"] },
            { r:"Admin",       p:["All Manager","Manage integrations","Manage members","Audit log access"] },
          ].map(g => (
            <div key={g.r} className="rounded-md border border-slate-200 p-2.5">
              <div className="text-xs font-semibold text-slate-900 mb-1">{g.r}</div>
              <ul className="space-y-0.5">
                {g.p.map(x => <li key={x} className="flex items-center gap-1.5 text-slate-600"><window.I.check className="w-3 h-3 text-emerald-500"/>{x}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </window.Card>
    </div>
  </div>
);

// ===== SCREEN 15 — AI RESPONSE GATING =====
// Pre-send evaluation: CQC scores AI/agent-assisted drafts BEFORE they leave
// the system. The screen has two tabs: a Tier-1 "Agent composer" view (the
// primary surface — agents fix their own drafts in real time) and a Tier-2
// "Supervisor escalations" view (the fallback for what's not auto-resolved).
const GatingScreen = ({ addToast, channels }) => {
  const [tab, setTab] = useStateSp("supervisor"); // "agent" | "supervisor"
  const [drafts, setDrafts] = useStateSp(window.GATING_DRAFTS);
  const [stats, setStats]   = useStateSp(window.GATING_STATS);
  // Apply the top-bar channel filter to held drafts.
  const visibleDrafts = drafts.filter(d => window.matchesChannel(channels, d.channel));

  // Tick SLA timers every second so the countdown feels live
  useStateSp; // placeholder
  React.useEffect(() => {
    const id = setInterval(() => {
      setDrafts(ds => ds.map(d => ({
        ...d,
        slaRemaining: Math.max(0, (d.slaRemaining || 0) - 1),
      })));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const removeDraft = (id, kind, msg) => {
    setDrafts(d => d.filter(x => x.id !== id));
    setStats(s => ({
      ...s,
      pendingReview: Math.max(0, s.pendingReview - 1),
      autoApproved: kind === "approve"  ? s.autoApproved + 1 : s.autoApproved,
      blocked:      kind === "block"    ? s.blocked + 1      : s.blocked,
      overridden:   kind === "override" ? s.overridden + 1   : s.overridden,
    }));
    addToast(msg);
  };

  const sevColor = (s) => ({
    Critical: "border-l-rose-500",
    High:     "border-l-orange-500",
    Medium:   "border-l-amber-400",
  })[s] || "border-l-slate-200";

  // Origin / fallback / sla helpers shared by both tabs
  const originPill = (o) => {
    const map = {
      "AI-drafted":  { cls:"bg-violet-50 text-violet-700 border-violet-200", icon: window.I.bot,  label:"AI-drafted reply" },
      "AI-assisted": { cls:"bg-sky-50 text-sky-700 border-sky-200",          icon: window.I.zap,  label:"Agent used AI suggestion" },
      "Human-typed": { cls:"bg-slate-50 text-slate-600 border-slate-200",    icon: window.I.user, label:"Human-typed" },
    };
    const c = map[o] || map["AI-drafted"];
    const Ico = c.icon;
    return (
      <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded border ${c.cls}`}>
        <Ico className="w-3 h-3"/>{c.label}
      </span>
    );
  };

  const fallbackLabel = (f) => ({
    "block":          { text:"if not acted on → BLOCK",          cls:"text-rose-700" },
    "send-suggested": { text:"if not acted on → send suggested", cls:"text-amber-700" },
    "send-original":  { text:"if not acted on → send original",  cls:"text-slate-600" },
  })[f] || { text:"—", cls:"text-slate-600" };

  const SLATimer = ({ remaining, total }) => {
    const pct = (remaining / total) * 100;
    const color = remaining < 15 ? "bg-rose-500" : remaining < 30 ? "bg-amber-500" : "bg-emerald-500";
    const m = Math.floor(remaining / 60), s = remaining % 60;
    return (
      <div className="inline-flex items-center gap-1.5">
        <div className="w-16 h-1.5 rounded-full bg-slate-100 overflow-hidden">
          <div className={`h-full ${color} transition-all`} style={{ width:`${pct}%` }}/>
        </div>
        <span className={`text-[11px] tabular-nums font-semibold ${remaining < 15 ? "text-rose-600" : "text-slate-700"}`}>
          {m}:{String(s).padStart(2,"0")}
        </span>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Flow diagram + tab switcher */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-3">
        <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-600">
          <div className="font-semibold text-slate-900 mr-1">Flow:</div>
          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-slate-50 border border-slate-200">
            <window.I.bot className="w-3 h-3 text-violet-600"/>AI/Agent draft
          </span>
          <window.I.chevRight className="w-3 h-3 text-slate-400"/>
          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-violet-50 border border-violet-200 text-violet-700 font-medium">
            CQC + AI Message Rating
          </span>
          <window.I.chevRight className="w-3 h-3 text-slate-400"/>
          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-emerald-50 border border-emerald-200 text-emerald-700">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"/>Auto-send <span className="opacity-60">(86%)</span>
          </span>
          <span className="text-slate-300">or</span>
          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-amber-50 border border-amber-200 text-amber-700">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"/>Hold for human <span className="opacity-60">(7%)</span>
          </span>
          <span className="text-slate-300">or</span>
          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-rose-50 border border-rose-200 text-rose-700">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"/>Block <span className="opacity-60">(7%)</span>
          </span>
          <div className="flex-1"/>
          <a className="text-[var(--accent-deep)] hover:underline cursor-pointer">Configure rules in QA Framework →</a>
        </div>
      </div>

      {/* Top metrics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { l:"AI drafts today",    v:stats.totalToday.toLocaleString(), sub:"all channels", color:"slate"  },
          { l:"Auto-approved",      v:stats.autoApproved.toLocaleString(), sub:`${stats.passRate}% pass rate`, color:"emerald" },
          { l:"Pending review",     v:stats.pendingReview, sub:"awaiting supervisor",         color:"amber"   },
          { l:"Blocked",            v:stats.blocked,       sub:"prevented from sending",      color:"rose"    },
          { l:"Sent after override",v:stats.overridden,    sub:"supervisor force-sent",       color:"violet"  },
        ].map((k,i) => (
          <div key={i} className="rounded-xl border border-slate-200 bg-white shadow-sm p-3">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{k.l}</div>
            <div className="text-2xl font-semibold tabular-nums text-slate-900 mt-0.5">{k.v}</div>
            <div className={`text-[11px] text-${k.color}-700 mt-0.5`}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-200">
        {[
          { key:"supervisor", label:"Supervisor escalations",sub:"Tier 2 · what agents didn't catch", count: visibleDrafts.length },
          { key:"agent",      label:"Agent view (preview)",  sub:"Tier 1 · what your agents see in their helpdesk" },
        ].map(t => {
          const on = tab === t.key;
          return (
            <button key={t.key} onClick={()=>setTab(t.key)}
                    className={`relative px-4 py-2.5 text-sm flex items-center gap-2 ${on ? "text-slate-900 font-semibold" : "text-slate-500 hover:text-slate-700"}`}>
              {t.label}
              {t.count != null && (
                <span className={`text-[10px] font-bold tabular-nums px-1.5 py-0.5 rounded ${on ? "bg-[var(--accent)] text-white" : "bg-slate-200 text-slate-700"}`}>{t.count}</span>
              )}
              {on && <span className="absolute -bottom-px left-0 right-0 h-0.5 bg-[var(--accent)]"/>}
            </button>
          );
        })}
        <div className="flex-1"/>
        <div className="text-[11px] text-slate-500 pb-2 pr-2">
          {tab === "agent"
            ? "Preview · this is rendered inside the agent's helpdesk, not in QA Monitor"
            : "Cases requiring supervisor decision — SLA timers active"}
        </div>
      </div>

      {tab === "agent" ? (
        <AgentComposerView
          draft={drafts.find(d => d.id === "DRAFT-2026-04-29-90211") || drafts[0]}
          onAccept={()=>{
            removeDraft("DRAFT-2026-04-29-90211", "approve", "Angela accepted the rewrite — sent to Michael.");
            setTab("supervisor");
          }}
          onSendOriginal={()=>{
            removeDraft("DRAFT-2026-04-29-90211", "override", "Angela force-sent original — escalated to supervisor for review.");
            setTab("supervisor");
          }}
          SLATimer={SLATimer}
        />
      ) : (
        <SupervisorEscalations
          drafts={visibleDrafts}
          sevColor={sevColor}
          originPill={originPill}
          fallbackLabel={fallbackLabel}
          SLATimer={SLATimer}
          removeDraft={removeDraft}
        />
      )}

      {/* Recent activity */}
      <window.Card title="Recent gating activity" action={<a className="text-xs text-[var(--accent-deep)] hover:underline cursor-pointer">View in audit log →</a>}>
        <table className="w-full text-sm">
          <thead className="bg-slate-50/50 border-b border-slate-100">
            <tr className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              <th className="px-3 py-2 text-left">Time</th>
              <th className="px-2 py-2 text-left">Action</th>
              <th className="px-2 py-2 text-left">Agent</th>
              <th className="px-2 py-2 text-left">Draft</th>
              <th className="px-2 py-2 text-left">Confidence</th>
              <th className="px-2 py-2 text-left">By</th>
            </tr>
          </thead>
          <tbody>
            {window.GATING_RECENT.map((r,i)=>{
              const actionPill = (a) => {
                const map = {
                  "auto-approved":      { cls: "bg-emerald-50 text-emerald-700 border-emerald-200", label: "Auto-approved" },
                  "blocked":            { cls: "bg-rose-50 text-rose-700 border-rose-200",          label: "Blocked"        },
                  "sent-after-override":{ cls: "bg-amber-50 text-amber-700 border-amber-200",       label: "Sent after override" },
                };
                const m = map[a] || map["auto-approved"];
                return <span className={`text-[10px] px-1.5 py-0.5 rounded border ${m.cls}`}>{m.label}</span>;
              };
              return (
                <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-3 py-2 text-[11px] font-mono text-slate-600">{r.ts}</td>
                  <td className="px-2 py-2">{actionPill(r.action)}</td>
                  <td className="px-2 py-2">
                    <div className="flex items-center gap-1.5">
                      <window.AgentAvatar name={r.agent}/>
                      <span className="text-xs text-slate-700">{r.agent}</span>
                    </div>
                  </td>
                  <td className="px-2 py-2 text-xs text-slate-700 italic max-w-md truncate">"{r.draft}"</td>
                  <td className="px-2 py-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] tabular-nums text-slate-700 w-7">{r.conf}%</span>
                      <div className="w-12 h-1.5 rounded-full bg-slate-100">
                        <div className={`h-full rounded-full ${r.conf >= 70 ? "bg-emerald-500" : r.conf >= 50 ? "bg-amber-500" : "bg-rose-500"}`} style={{width:`${r.conf}%`}}/>
                      </div>
                    </div>
                  </td>
                  <td className="px-2 py-2 text-xs text-slate-600">{r.by || <span className="text-violet-700 inline-flex items-center gap-1"><window.I.bot className="w-3 h-3"/>AI</span>}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </window.Card>
    </div>
  );
};

// ----- Agent Composer (Tier 1) — what the agent sees in their chat client -----
const AgentComposerView = ({ draft, onAccept, onSendOriginal, SLATimer }) => {
  if (!draft) {
    return (
      <window.EmptyState icon={window.I.check}
        title="No drafts being coached right now"
        sub="When an agent's message is held by CQC, their composer view appears here."/>
    );
  }
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="px-4 py-2 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
        <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-sky-100 text-sky-700">Agent view</span>
        <span className="text-xs text-slate-600">{draft.agent}'s chat composer — embedded in their helpdesk</span>
        <div className="flex-1"/>
        <span className="text-[11px] text-slate-500">Real-time coaching · agents self-resolve in &lt;5s</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px]">
        {/* LEFT: Chat thread with composer */}
        <div className="flex flex-col border-r border-slate-100">
          {/* Customer header */}
          <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-3">
            <window.AgentAvatar name={draft.customer} size="md"/>
            <div>
              <div className="text-sm font-semibold text-slate-900">{draft.customer}</div>
              <div className="text-[11px] text-slate-500">Active 14m · {draft.channel} · Order #AC-44821</div>
            </div>
            <div className="ml-auto text-[11px] text-slate-500">Acme Logistics</div>
          </div>

          {/* Conversation */}
          <div className="flex-1 px-4 py-4 space-y-3 bg-slate-50/30 min-h-[300px]">
            {(draft.conversation || []).map((m, i) => (
              <div key={i} className={`flex ${m.from === "agent" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[75%] rounded-xl px-3 py-2 text-sm ${
                  m.from === "agent"
                    ? "bg-sky-100 text-slate-900 rounded-br-sm"
                    : "bg-white text-slate-900 border border-slate-200 rounded-bl-sm"
                }`}>
                  {m.text}
                  <div className={`text-[10px] mt-0.5 ${m.from==="agent" ? "text-sky-700/70" : "text-slate-400"}`}>{m.at}</div>
                </div>
              </div>
            ))}

            {/* Held-draft "bubble" — shown to customer as typing indicator */}
            <div className="flex justify-end">
              <div className="max-w-[75%] rounded-xl rounded-br-sm px-3 py-2 text-sm bg-rose-50 border-2 border-dashed border-rose-300 relative">
                <div className="flex items-center gap-1.5 mb-1">
                  <window.I.alert className="w-3 h-3 text-rose-600"/>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700">Held — not sent</span>
                </div>
                <div className="text-slate-700 italic line-through opacity-70">"{draft.draft}"</div>
                <div className="text-[10px] text-slate-500 mt-1">Customer sees typing indicator only</div>
              </div>
            </div>

            {/* Customer's typing indicator (what Michael sees) */}
            <div className="flex justify-start">
              <div className="bg-white border border-slate-200 rounded-xl rounded-bl-sm px-3 py-2 inline-flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse"/>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse" style={{animationDelay:"0.2s"}}/>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse" style={{animationDelay:"0.4s"}}/>
                <span className="text-[10px] text-slate-400 ml-1">Angela is typing…</span>
              </div>
            </div>
          </div>

          {/* Composer — disabled while reviewing */}
          <div className="px-4 py-3 border-t border-slate-100 bg-white">
            <div className="rounded-lg border border-rose-300 bg-rose-50/40 px-3 py-2 flex items-center gap-2 text-sm">
              <window.I.clock className="w-3.5 h-3.5 text-rose-600 flex-shrink-0"/>
              <span className="text-rose-900 font-medium">Reviewing your message…</span>
              <span className="text-[11px] text-slate-600">Resolve in the panel →</span>
            </div>
          </div>
        </div>

        {/* RIGHT: Coach panel */}
        <div className="bg-gradient-to-b from-rose-50/40 to-white">
          <div className="px-4 py-3 border-b border-slate-100">
            <div className="flex items-center justify-between mb-1">
              <div className="inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500 pulse-dot"/>
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700">Message held by CQC</span>
              </div>
              <window.RiskBadge level={draft.severity}/>
            </div>
            <div className="text-sm font-semibold text-slate-900">Quick coach — fix or override</div>
          </div>

          <div className="px-4 py-3 space-y-3">
            {/* Original draft */}
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-rose-700 mb-1">Your draft</div>
              <div className="rounded-md border border-rose-200 bg-rose-50/60 p-2.5 text-sm text-slate-900 italic">
                "{draft.draft}"
              </div>
            </div>

            {/* Reasons */}
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1">Why it was held</div>
              <ul className="space-y-1">
                {draft.reasons.map(r => (
                  <li key={r} className="flex items-start gap-1.5 text-[12px] text-slate-700">
                    <window.I.x className="w-3 h-3 text-rose-500 flex-shrink-0 mt-0.5"/>
                    {r}
                  </li>
                ))}
              </ul>
            </div>

            {/* Suggested rewrite */}
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700 mb-1 inline-flex items-center gap-1">
                <window.I.zap className="w-3 h-3"/>Suggested rewrite
              </div>
              <div className="rounded-md border border-emerald-200 bg-emerald-50/40 p-2.5 text-sm text-slate-900">
                "{draft.suggestion}"
              </div>
            </div>

            {/* SLA + fallback */}
            <div className="rounded-md border border-slate-200 p-2.5">
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Time to decide</span>
                <SLATimer remaining={draft.slaRemaining} total={draft.slaSeconds}/>
              </div>
              <div className="text-[11px] text-rose-700 inline-flex items-center gap-1">
                <window.I.alert className="w-3 h-3"/>
                If you don't act → message is auto-blocked and escalated to supervisor
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-1">
              <window.Btn kind="primary" size="lg" className="w-full justify-center"
                          icon={<window.I.check className="w-4 h-4"/>}
                          onClick={onAccept}>
                Accept rewrite & send
              </window.Btn>
              <div className="grid grid-cols-2 gap-2">
                <window.Btn kind="secondary" size="md" className="justify-center">
                  Edit suggestion
                </window.Btn>
                <window.Btn kind="ghost" size="md" className="justify-center text-rose-700 hover:bg-rose-50"
                            onClick={onSendOriginal}>
                  Send original anyway
                </window.Btn>
              </div>
              <div className="text-[10px] text-slate-500 text-center pt-1">
                Override is logged and reviewed by supervisor
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ----- Supervisor escalations (Tier 2) -----
const SupervisorEscalations = ({ drafts, sevColor, originPill, fallbackLabel, SLATimer, removeDraft }) => {
  if (drafts.length === 0) {
    return <window.EmptyState icon={window.I.check} title="Inbox zero" sub="No drafts are currently escalated for supervisor review."/>;
  }
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-semibold text-slate-900">Held AI drafts</h3>
          <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-100 text-amber-700">Action required</span>
        </div>
        <div className="text-xs text-slate-500">Pre-send evaluation · {drafts.length} held · SLA timers active</div>
      </div>

      <div className="divide-y divide-slate-100">
        {drafts.map(d => {
          const fb = fallbackLabel(d.fallback);
          return (
            <div key={d.id} className={`px-4 py-3 border-l-4 ${sevColor(d.severity)}`}>
              <div className="flex items-start gap-3">
                <window.AgentAvatar name={d.agent}/>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <window.ChannelIcon value={d.channel}/>
                    <span className="text-xs font-semibold text-slate-900">{d.agent}</span>
                    <span className="text-[11px] text-slate-500">↔ {d.customer}</span>
                    <span className="text-[11px] font-mono text-slate-400 ml-1">{d.id}</span>
                    <window.RiskBadge level={d.severity}/>
                    {originPill(d.origin)}
                    <div className="ml-auto inline-flex items-center gap-2">
                      <SLATimer remaining={d.slaRemaining} total={d.slaSeconds}/>
                      <span className="text-[10px] text-slate-500 tabular-nums">held {d.held}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                    <div className="rounded-md border-2 border-dashed border-rose-300 bg-rose-50/30 p-2.5 relative">
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-[10px] font-semibold uppercase tracking-wider text-rose-700">Original draft</div>
                        <span className="text-[10px] text-slate-500 inline-flex items-center gap-1">
                          <window.I.alert className="w-3 h-3"/>not sent · customer hasn't seen
                        </span>
                      </div>
                      <div className="text-sm text-slate-900 italic line-through opacity-80">"{d.draft}"</div>
                    </div>
                    <div className="rounded-md border border-emerald-200 bg-emerald-50/40 p-2.5">
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700 mb-1">Suggested rewrite</div>
                      <div className="text-sm text-slate-900">"{d.suggestion}"</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <window.AIBadge name={d.flaggedBy}/>
                    {d.reasons.map(r => (
                      <span key={r} className="text-[11px] px-1.5 py-0.5 rounded border border-rose-200 bg-rose-50 text-rose-700">{r}</span>
                    ))}
                    <span className="text-[11px] text-slate-500 ml-1">confidence <span className="font-semibold tabular-nums text-slate-700">{d.confidence}%</span></span>
                    <span className={`text-[11px] ml-auto font-medium ${fb.cls}`}>{fb.text}</span>
                  </div>

                  <div className="flex items-center gap-2 mt-3">
                    <window.Btn kind="primary" size="sm" icon={<window.I.check className="w-3 h-3"/>}
                                onClick={() => removeDraft(d.id, "approve", `Suggested rewrite sent — ${d.agent}'s draft replaced.`)}>
                      Send suggested rewrite
                    </window.Btn>
                    <window.Btn kind="secondary" size="sm"
                                onClick={() => removeDraft(d.id, "block", `Blocked — ${d.agent} notified to rewrite.`)}>
                      Block & ask agent to rewrite
                    </window.Btn>
                    <window.Btn kind="ghost" size="sm"
                                onClick={() => removeDraft(d.id, "override", `Sent as-is — override logged in audit.`)}>
                      Send as-is (override)
                    </window.Btn>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ===== SCREEN 16 — KNOWLEDGE BASE =====
// The source-of-truth library for SOPs, policies, and scripts the AI evaluates
// against. Per PRD §5.2.C: documented SOPs, policies, and QA standards.
const KnowledgeBaseScreen = ({ addToast }) => {
  const [filter, setFilter] = useStateSp("all");
  const [selected, setSelected] = useStateSp(window.KB_DOCUMENTS[0]);
  const [search, setSearch] = useStateSp("");

  const filtered = window.KB_DOCUMENTS.filter(d => {
    if (filter !== "all" && d.category !== filter) return false;
    if (search && !(d.title + d.summary + d.category).toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const statusPill = (s) => {
    const map = {
      "Active":   "bg-emerald-50 text-emerald-700 border-emerald-200",
      "Draft":    "bg-amber-50 text-amber-700 border-amber-200",
      "Archived": "bg-slate-100 text-slate-600 border-slate-200",
    };
    return <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${map[s]}`}>{s}</span>;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4">
      {/* LEFT: doc list */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="px-3 py-2.5 border-b border-slate-100">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-sm font-semibold text-slate-900">Documents</h3>
            <window.Btn kind="ghost" size="sm" className="ml-auto" icon={<window.I.plus className="w-3 h-3"/>}>New</window.Btn>
          </div>
          <div className="relative">
            <window.I.search className="w-3 h-3 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2"/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search documents…"
                   className="w-full pl-7 pr-2 py-1.5 text-xs border border-slate-200 rounded-md focus:outline-none focus:border-[var(--accent)]"/>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 px-3 py-2 border-b border-slate-100">
          {window.KB_CATEGORIES.map(c => (
            <button key={c.key} onClick={()=>setFilter(c.key)}
                    className={`text-[11px] px-2 py-0.5 rounded-md border flex items-center gap-1
                      ${filter === c.key ? "bg-[var(--accent-tint)] border-[var(--accent-border)] text-[var(--accent-deep)] font-semibold" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
              {c.label}
              <span className={`text-[9px] tabular-nums px-1 rounded ${filter === c.key ? "bg-white text-[var(--accent-deep)]" : "bg-slate-100 text-slate-500"}`}>{c.count}</span>
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <window.EmptyState icon={window.I.reports} title="No documents match" sub="Try a different category or search term."/>
        ) : (
          <div className="divide-y divide-slate-100 max-h-[640px] overflow-y-auto scroll-thin">
            {filtered.map(d => (
              <button key={d.id} onClick={()=>setSelected(d)}
                      className={`w-full px-3 py-2.5 text-left hover:bg-slate-50 ${selected.id === d.id ? "bg-[var(--accent-tint)]/40" : ""}`}>
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-[10px] font-semibold text-slate-500">{d.category}</span>
                  <span className="text-[10px] text-slate-400">·</span>
                  <span className="text-[10px] font-mono text-slate-500">{d.version}</span>
                  <span className="ml-auto">{statusPill(d.status)}</span>
                </div>
                <div className="text-xs font-semibold text-slate-900 leading-snug">{d.title}</div>
                <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{d.summary}</div>
                <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-500">
                  <span>{d.pages}p</span>
                  <span>·</span>
                  <span>{d.lastUpdated}</span>
                  <span className="ml-auto inline-flex items-center gap-0.5 text-violet-700">
                    <window.I.bot className="w-2.5 h-2.5"/>{d.references}×
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* RIGHT: selected doc detail */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm flex flex-col">
        <div className="px-5 py-3 border-b border-slate-100 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--accent-deep)]">{selected.category}</span>
              <span className="text-[10px] font-mono text-slate-400">{selected.version}</span>
              {statusPill(selected.status)}
            </div>
            <h2 className="text-base font-semibold text-slate-900">{selected.title}</h2>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Last updated <span className="font-medium text-slate-700">{selected.lastUpdated}</span> by {selected.owner} · {selected.pages} pages
            </div>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <window.Btn kind="secondary" size="sm" icon={<window.I.edit className="w-3 h-3"/>} onClick={()=>addToast("Opened editor (mock).")}>Edit</window.Btn>
            <window.Btn kind="ghost" size="sm" icon={<window.I.download className="w-3 h-3"/>}>Download</window.Btn>
          </div>
        </div>

        <div className="px-5 py-3 border-b border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1 inline-flex items-center">
              Mapped to QA categories
              <window.InfoTip title="Mapped to">Which scorecard categories this doc feeds into. When you update this doc, the AI re-evaluates recent interactions in those categories.</window.InfoTip>
            </div>
            <div className="flex flex-wrap gap-1">
              {selected.mappedTo.map(c => (
                <span key={c} className="text-[11px] px-1.5 py-0.5 rounded border border-slate-200 bg-slate-50 text-slate-700">{c}</span>
              ))}
            </div>
          </div>
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1 inline-flex items-center">
              AI references (30d)
              <window.InfoTip title="AI references">How many times AI agents looked up this doc in the last 30 days when scoring interactions. High counts = critical reference material.</window.InfoTip>
            </div>
            <div className="flex items-baseline gap-1.5">
              <div className="text-xl font-semibold tabular-nums text-violet-700">{selected.references}</div>
              <div className="text-[10px] text-slate-500">lookups by AI agents</div>
            </div>
          </div>
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1">Owner</div>
            <div className="flex items-center gap-1.5">
              <window.AgentAvatar name={selected.owner}/>
              <div>
                <div className="text-xs font-semibold text-slate-900">{selected.owner}</div>
                <div className="text-[10px] text-slate-500">QA Lead</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scroll-thin px-5 py-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Summary</h3>
          <p className="text-sm text-slate-700 leading-relaxed">{selected.summary}</p>

          <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50/40 p-4">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-2">Document preview</div>
            <div className="space-y-3 text-sm text-slate-700">
              {selected.id === "doc-001" ? (
                <>
                  <h4 className="text-sm font-bold text-slate-900">1. Required Disclosure</h4>
                  <p>Before processing any refund, the agent <strong>must</strong> state aloud (Voice) or include verbatim (Chat/Email):</p>
                  <blockquote className="border-l-4 border-[var(--accent)] pl-3 italic text-slate-600 bg-white py-2 rounded-r">
                    "Refunds reflect in 5–7 business days. Processing this confirms acceptance of our refund policy under Section 4.2."
                  </blockquote>
                  <h4 className="text-sm font-bold text-slate-900 mt-4">2. Eligibility</h4>
                  <ul className="list-disc ml-5 space-y-1">
                    <li>Shipping fee — eligible if delay &gt; 3 business days</li>
                    <li>Full order — eligible if undelivered after 14 business days</li>
                    <li>Partial — manager approval required</li>
                  </ul>
                  <h4 className="text-sm font-bold text-slate-900 mt-4">3. Escalation</h4>
                  <p>If customer requests supervisor or threatens public review, route to Tier 2 immediately (see Escalation Routing Matrix v3.0).</p>
                </>
              ) : (
                <>
                  <p className="italic text-slate-500">{selected.summary}</p>
                  <p className="text-[11px] text-slate-400">[Full document content rendered here. Markdown / rich-text supported. Linked to QA scorecard categories: {selected.mappedTo.join(", ")}.]</p>
                </>
              )}
            </div>
          </div>

          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 mt-6">Version history</h3>
          <ol className="relative border-l border-slate-200 ml-2 space-y-3">
            {selected.changelog.map((c, i) => (
              <li key={c.v} className="ml-4">
                <span className={`absolute -left-1.5 w-3 h-3 rounded-full ${i === 0 ? "bg-[var(--accent)]" : "bg-white border-2 border-slate-300"}`}/>
                <div className="flex items-baseline gap-2">
                  <span className="text-xs font-mono font-semibold text-slate-900">{c.v}</span>
                  <span className="text-[10px] text-slate-500">{c.date} · {c.by}</span>
                  {i === 0 && <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-700">Current</span>}
                </div>
                <div className="text-xs text-slate-600 mt-0.5">{c.note}</div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { AgentsListScreen, TrendsScreen, ReportsScreen, SamplingScreen, FrameworkScreen, AlertsScreen, IntegrationsScreen, AuditScreen, TeamScreen, GatingScreen, AgentComposerView, SupervisorEscalations, KnowledgeBaseScreen });
