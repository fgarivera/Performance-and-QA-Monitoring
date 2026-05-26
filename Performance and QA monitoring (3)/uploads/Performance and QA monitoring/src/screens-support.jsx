/* global window, React, Recharts */
const { useState: useStateSp, useMemo: useMemoSp } = React;
const { ResponsiveContainer: RCS, LineChart: LCS, Line: LnS, AreaChart: ACS, Area: ArS, BarChart: BCS, Bar: BrS, XAxis: XS, YAxis: YS, Tooltip: TpS, CartesianGrid: CGS, Legend: LgS } = Recharts;

// ===== SCREEN 6 — AGENTS LIST =====
const AgentsListScreen = ({ openAgent }) => {
  const [team, setTeam] = useStateSp("All");
  const [channel, setChannel] = useStateSp("All");
  const [scoreRange, setScoreRange] = useStateSp("All");
  const [sortKey, setSortKey] = useStateSp("score");
  const [sortDir, setSortDir] = useStateSp("desc");

  const teams = ["All", ...Array.from(new Set(window.ALL_AGENTS.map(a=>a.team)))];
  const filtered = useMemoSp(() => {
    let r = window.ALL_AGENTS.slice();
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
  }, [team, channel, scoreRange, sortKey, sortDir]);

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
          <select value={channel} onChange={e=>setChannel(e.target.value)} className="text-xs border border-slate-200 rounded-md px-2 py-1 bg-white">
            {["All","Chat","Voice","Email"].map(t=><option key={t}>{t}</option>)}
          </select>
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

    <window.Card title="QA score over time — by channel" action={<span className="text-xs text-slate-500">90 days</span>}>
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
          </LCS>
        </RCS>
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

  const total = cats.reduce((s,c)=>s+c.w, 0);

  return (
    <div className="space-y-4 pb-24">
      <window.Card title="Scorecard categories" action={<span className={`text-xs font-semibold tabular-nums ${total===100?"text-emerald-600":"text-rose-600"}`}>Total weight: {total}%</span>}>
        <div className="space-y-3">
          {cats.map((c,i) => (
            <div key={c.name} className="grid grid-cols-[1fr_2fr_140px_24px] gap-3 items-center">
              <div>
                <div className="text-sm font-semibold text-slate-900">{c.name}</div>
                <a className="text-[11px] text-[var(--accent-deep)] hover:underline cursor-pointer">+ Add criterion</a>
              </div>
              <div className="text-xs text-slate-600">{c.desc}</div>
              <div className="flex items-center gap-2">
                <input type="range" min="0" max="50" value={c.w}
                       onChange={e=>setCats(cs=>cs.map((x,j)=>j===i?{...x,w:parseInt(e.target.value)}:x))}
                       className="flex-1 accent-[var(--accent)]"/>
                <div className="text-sm font-semibold tabular-nums text-slate-900 w-10 text-right">{c.w}%</div>
              </div>
              <button className="text-slate-400 hover:text-slate-600"><window.I.more className="w-4 h-4"/></button>
            </div>
          ))}
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
              <div className="w-10 h-10 rounded-md bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-base">
                {it.name.slice(0,2).toUpperCase()}
              </div>
              <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${status(it.status)}`}>{it.status}</span>
            </div>
            <div className="text-sm font-semibold text-slate-900">{it.name}{it.primary && <span className="ml-1 text-[10px] text-[var(--accent-deep)] font-bold uppercase tracking-wider">Primary</span>}</div>
            <div className="text-[11px] text-slate-500">{it.category}</div>
            <window.Btn kind="secondary" size="sm" className="w-full mt-3" onClick={()=>setModal(it)}>Configure</window.Btn>
          </div>
        ))}
      </div>

      <window.Modal open={!!modal} onClose={()=>setModal(null)} title={modal ? `Configure ${modal.name}` : ""}
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

Object.assign(window, { AgentsListScreen, TrendsScreen, ReportsScreen, SamplingScreen, FrameworkScreen, AlertsScreen, IntegrationsScreen, AuditScreen, TeamScreen });
