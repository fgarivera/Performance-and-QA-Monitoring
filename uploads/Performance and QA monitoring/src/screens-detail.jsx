/* global window, React, Recharts */
const { useState: useStateD, useEffect: useEffectD, useMemo: useMemoD } = React;
const { ResponsiveContainer: RCD, LineChart: LCD, Line: LnD, XAxis: XD, YAxis: YD, Tooltip: TpD, CartesianGrid: CGD, BarChart: BCD, Bar: BrD, ReferenceLine: RLD, ReferenceDot: RDD } = Recharts;

// ===== SCREEN 4 — INTERACTION DETAIL DRAWER =====
const InteractionDrawer = ({ open, onClose, source, interaction, addToast }) => {
  const d = window.DETAIL_VOICE;
  const [overrideOpen, setOverrideOpen] = useStateD(false);
  const [newScore, setNewScore] = useStateD(58);
  const [reason, setReason] = useStateD("AI missed context");
  const [feedback, setFeedback] = useStateD("");
  const [scoringOpen, setScoringOpen] = useStateD(true);
  const [hoverFlag, setHoverFlag] = useStateD(null);

  const isLive = source === "live";

  const highlightCls = {
    compliance: "bg-rose-100 border-b-2 border-rose-500",
    sentiment:  "bg-orange-100 border-b-2 border-orange-500",
    resolution: "bg-sky-100 border-b-2 border-sky-500",
    tone:       "bg-amber-100 border-b-2 border-amber-500",
  };
  const flagDot = { Critical:"bg-rose-500", High:"bg-orange-500", Medium:"bg-amber-400" };

  const submitOverride = () => {
    setOverrideOpen(false);
    addToast(`Override saved. Score ${d.score} → ${newScore} on ${d.id}.`);
    onClose();
  };
  const agreeWithAI = () => {
    addToast(`Validated. Score ${d.score} recorded for ${d.id}.`);
    onClose();
  };

  return (
    <window.Drawer open={open} onClose={onClose} width={720}>
      {/* Header */}
      <div className="px-5 py-3 border-b border-slate-100 flex items-center gap-3">
        <window.ChannelIcon value={d.channel}/>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-slate-500">{d.id}</span>
            {isLive && <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 pulse-dot"/>Live
            </span>}
          </div>
          <div className="text-sm font-semibold text-slate-900 truncate">{d.customer} ↔ {d.agent}</div>
          <div className="text-[11px] text-slate-500">started {d.startedAt} · duration {d.duration}</div>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1.5 rounded hover:bg-slate-100">
          <window.I.x className="w-4 h-4"/>
        </button>
      </div>

      {/* At a glance */}
      <div className="px-5 py-3 border-b border-slate-100 grid grid-cols-4 gap-3">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">AI QA Score</div>
          <window.ScorePill value={d.score} size="lg"/>
        </div>
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">AI Confidence</div>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-base font-semibold tabular-nums text-slate-900">{d.confidence}%</span>
            <div className="flex-1 h-1.5 rounded-full bg-slate-100"><div className="h-full bg-violet-500 rounded-full" style={{width:`${d.confidence}%`}}/></div>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">below 65% cutoff</div>
        </div>
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Sentiment trajectory</div>
          <div className="flex items-end gap-0.5 h-7 mt-1">
            {d.sentimentTrajectory.map((v,i)=>(
              <span key={i} className={`w-1.5 rounded-sm ${v===2?"bg-emerald-500":v===1?"bg-amber-400":"bg-rose-500"}`} style={{height:`${10 + v*8}px`}}/>
            ))}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">neutral → negative</div>
        </div>
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Risk</div>
          <div className="mt-1"><window.RiskBadge level={d.risk}/></div>
        </div>
      </div>

      {/* Why flagged */}
      <div className="px-5 py-3 border-b border-slate-100">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-semibold text-slate-900">Why flagged</h4>
          <span className="text-[11px] text-slate-500">{d.flags.length} issues detected</span>
        </div>
        <div className="space-y-2">
          {d.flags.map(f => (
            <div key={f.id}
                 onMouseEnter={()=>setHoverFlag(f.id)}
                 onMouseLeave={()=>setHoverFlag(null)}
                 className="rounded-lg border border-slate-200 bg-slate-50/50 p-2.5 hover:bg-slate-50">
              <div className="flex items-center gap-2 mb-1">
                <span className={`w-1.5 h-1.5 rounded-full ${flagDot[f.severity]}`}/>
                <window.AIBadge name={f.agent}/>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{f.severity}</span>
                <button className="ml-auto text-[11px] text-[var(--accent-deep)] hover:underline">View in transcript →</button>
              </div>
              <div className="text-xs text-slate-700 leading-relaxed">{f.text}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Transcript */}
      <div className="flex-1 overflow-y-auto px-5 py-3 scroll-thin">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-semibold text-slate-900">Transcript</h4>
          <span className="text-[11px] text-slate-500">Voice · auto-transcribed · {d.duration}</span>
        </div>
        <div className="space-y-2">
          {d.transcript.map(t => {
            const isAgent = t.speaker.startsWith("Agent");
            const flag = d.flags.find(f => f.spanIds && f.spanIds.includes(t.id));
            const dim = hoverFlag && (!flag || flag.id !== hoverFlag);
            return (
              <div key={t.id} className={`grid grid-cols-[80px_1fr] gap-3 ${dim ? "opacity-30" : ""}`}>
                <div className="text-[10px] tabular-nums text-slate-400 pt-1">{t.at}</div>
                <div>
                  <div className={`text-[10px] font-semibold mb-0.5 ${isAgent ? "text-[var(--accent-deep)]" : "text-slate-700"}`}>{t.speaker}</div>
                  <div className="text-sm text-slate-800 leading-relaxed">
                    {t.highlight ? (
                      <span className={`px-0.5 ${highlightCls[t.highlight]}`} title={d.flags.find(f=>f.spanIds.includes(t.id))?.text}>
                        {t.text}
                      </span>
                    ) : t.text}
                  </div>
                </div>
              </div>
            );
          })}
          <div className="text-[10px] text-slate-400 italic mt-3 pl-[92px]">[End of call. Duration: 4m 38s.]</div>
        </div>

        {/* Scoring panel */}
        <div className="mt-5 rounded-lg border border-slate-200">
          <button onClick={()=>setScoringOpen(o=>!o)} className="w-full flex items-center justify-between px-3 py-2 border-b border-slate-100 hover:bg-slate-50">
            <h4 className="text-sm font-semibold text-slate-900">Per-category scoring</h4>
            <window.I.chevDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${scoringOpen ? "" : "-rotate-90"}`}/>
          </button>
          {scoringOpen && (
            <div className="divide-y divide-slate-100">
              {d.rubric.map(r => {
                const pct = (r.score / r.max) * 100;
                const c = pct >= 80 ? "bg-emerald-500" : pct >= 70 ? "bg-amber-500" : "bg-rose-500";
                return (
                  <div key={r.name} className="px-3 py-2.5 hover:bg-slate-50" title={r.note}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-xs font-medium text-slate-700">{r.name}</div>
                      <div className="text-xs font-semibold tabular-nums text-slate-900">{r.score}<span className="text-slate-400">/{r.max}</span></div>
                    </div>
                    <div className="h-1 rounded-full bg-slate-100"><div className={`h-full rounded-full ${c}`} style={{width:`${pct}%`}}/></div>
                    <div className="text-[10px] text-slate-500 mt-1 italic">{r.note}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Footer actions */}
      <div className="border-t border-slate-100 px-5 py-3 bg-slate-50">
        {!overrideOpen ? (
          <>
            <div className="flex items-center gap-2">
              {isLive ? (
                <window.Btn kind="primary" size="md" icon={<window.I.intervene className="w-3.5 h-3.5"/>}
                            onClick={() => { addToast(`Joined conversation as Supervisor — ${d.agent} has been notified.`); onClose(); }}>
                  Intervene
                </window.Btn>
              ) : (
                <>
                  <window.Btn kind="secondary" size="md" onClick={agreeWithAI}>Agree with AI</window.Btn>
                  <window.Btn kind="primary" size="md" onClick={()=>setOverrideOpen(true)}>Override score…</window.Btn>
                </>
              )}
              <window.Btn kind="ghost" size="md">
                Escalate to manager <window.I.chevRight className="w-3 h-3"/>
              </window.Btn>
            </div>
            <div className="text-[11px] text-slate-500 mt-2">Your feedback trains the system. Override agreement rate will improve scoring.</div>
          </>
        ) : (
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-slate-900">Override AI score</div>
              <button onClick={()=>setOverrideOpen(false)} className="text-slate-400 hover:text-slate-600"><window.I.x className="w-4 h-4"/></button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">New score (0–100)</label>
                <input type="number" min="0" max="100" value={newScore} onChange={e=>setNewScore(parseInt(e.target.value)||0)}
                       className="w-full mt-1 px-2 py-1.5 border border-slate-200 rounded-md text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-pink-500/30 focus:border-pink-500"/>
              </div>
              <div>
                <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Reason</label>
                <select value={reason} onChange={e=>setReason(e.target.value)}
                        className="w-full mt-1 px-2 py-1.5 border border-slate-200 rounded-md text-sm bg-white">
                  {["AI was too lenient","AI missed context","AI was too strict","Edge case","Other"].map(o=><option key={o}>{o}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Feedback</label>
              <textarea value={feedback} onChange={e=>setFeedback(e.target.value)} rows={2}
                        placeholder="Why did the AI miss this? (helps the model learn)"
                        className="w-full mt-1 px-2 py-1.5 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/30 focus:border-pink-500"/>
            </div>
            <div className="flex items-center justify-end gap-2">
              <window.Btn kind="ghost" size="sm" onClick={()=>setOverrideOpen(false)}>Cancel</window.Btn>
              <window.Btn kind="primary" size="sm" onClick={submitOverride}>Save override</window.Btn>
            </div>
          </div>
        )}
      </div>
    </window.Drawer>
  );
};

// ===== SCREEN 5 — AGENT SCORECARD =====
const ScorecardScreen = ({ agent, openInteraction, addToast, setExportModal }) => {
  const a = agent || window.NEEDS_ATTENTION[0];
  const isAttention = a.score < 80;

  return (
    <div className="space-y-5">
      {/* Profile header */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-5">
        <div className="flex flex-wrap items-start gap-5">
          <window.AgentAvatar name={a.name} size="lg"/>
          <div className="min-w-0">
            <div className="text-xl font-semibold text-slate-900">{a.name}</div>
            <div className="text-sm text-slate-600">Senior CX Specialist · Account: Acme Logistics</div>
            <div className="text-xs text-slate-500 mt-1">Tenure 1y 4mo · Team {a.team || "Voice Team B"} · Supervisor Joshua Reyes</div>
          </div>
          <div className="ml-auto grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { l:"Avg QA Score (30d)", v:String(a.score), d:a.delta || "−6.8" },
              { l:"Interactions",       v:String(a.interactions || 121), d:"+8.2%" },
              { l:"Flag Rate",          v:"31.4%", d:"+4.6 pts" },
              { l:"Customer Sentiment", v:"68",    d:"−5.0 pts" },
            ].map((k,i)=>(
              <div key={i} className="rounded-lg border border-slate-200 px-3 py-2 min-w-[110px]">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{k.l}</div>
                <div className="text-xl font-semibold tabular-nums text-slate-900 leading-tight mt-0.5">{k.v}</div>
                <window.TrendArrow value={k.d}/>
              </div>
            ))}
          </div>
        </div>
        {isAttention && (
          <div className="mt-4 flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50/40 px-3 py-2">
            <window.I.alert className="w-4 h-4 text-rose-600 mt-0.5"/>
            <div className="text-xs text-rose-900"><span className="font-semibold">Below threshold (80).</span> {a.reason || "Compliance disclosure missed 14× in the last 14 days. Coaching plan recommended."}</div>
          </div>
        )}
      </div>

      {/* Trend chart */}
      <window.Card title="Daily QA score — 30 days" action={<span className="text-xs text-slate-500"><span className="inline-block w-3 h-0.5 bg-[var(--accent)] align-middle"/> Agent · <span className="inline-block w-3 border-t border-dashed border-slate-400 align-middle"/> Team avg</span>}>
        <div className="h-[280px] -ml-2" style={{color:"var(--accent)"}}>
          <RCD>
            <LCD data={window.AGENT_TREND} margin={{top:10,right:20,left:0,bottom:0}}>
              <CGD stroke="#f1f5f9" vertical={false}/>
              <XD dataKey="day" tick={{fontSize:10, fill:"#64748b"}} interval={4}/>
              <YD domain={[60,100]} tick={{fontSize:10, fill:"#64748b"}}/>
              <TpD contentStyle={{fontSize:12, borderRadius:8, border:"1px solid #e2e8f0"}}/>
              <RLD y={80} stroke="#f43f5e" strokeDasharray="2 2" label={{value:"threshold 80", fontSize:10, fill:"#f43f5e", position:"insideTopRight"}}/>
              <LnD type="monotone" dataKey="team" stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="4 3" dot={false}/>
              <LnD type="monotone" dataKey="agent" stroke="currentColor" strokeWidth={2.5} dot={{r:2}}/>
              <RDD x="Apr 18" y={window.AGENT_TREND[17].agent} r={5} fill="#fff" stroke="currentColor" strokeWidth={2}/>
              <RDD x="Apr 22" y={window.AGENT_TREND[21].agent} r={5} fill="#fff" stroke="currentColor" strokeWidth={2}/>
            </LCD>
          </RCD>
        </div>
        <div className="flex items-center gap-4 text-[11px] text-slate-500 mt-1 pl-4">
          <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full border border-[var(--accent)]"/>Apr 18 — New SOP rollout</span>
          <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full border border-[var(--accent)]"/>Apr 22 — Coaching session</span>
        </div>
      </window.Card>

      {/* Two col */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <window.Card title="Recurring issues">
          <div className="h-[200px] -ml-2" style={{color:"var(--accent)"}}>
            <RCD>
              <BCD data={window.AGENT_RECURRING} layout="vertical" margin={{top:8,right:24,left:8,bottom:8}}>
                <CGD stroke="#f1f5f9" horizontal={false}/>
                <XD type="number" tick={{fontSize:10, fill:"#64748b"}}/>
                <YD type="category" dataKey="issue" tick={{fontSize:11, fill:"#475569"}} width={170}/>
                <TpD contentStyle={{fontSize:12, borderRadius:8, border:"1px solid #e2e8f0"}}/>
                <BrD dataKey="count" fill="currentColor" radius={[0,4,4,0]} barSize={18}/>
              </BCD>
            </RCD>
          </div>
        </window.Card>

        <window.Card title="Sample low-score interactions" action={<span className="text-xs text-slate-500">last 7 days</span>}>
          <div className="divide-y divide-slate-100 -my-2">
            {window.AGENT_LOWSCORE_SAMPLES.map(s => (
              <button key={s.id} onClick={()=>openInteraction({id:s.id}, "queue")}
                      className="w-full flex items-center gap-2 py-2 px-2 -mx-2 rounded hover:bg-slate-50 text-left">
                <window.ChannelIcon value={s.id.startsWith("VOICE") ? "Voice" : s.id.startsWith("CHAT") ? "Chat" : "Email"}/>
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] font-mono text-slate-500 truncate">{s.id}</div>
                  <div className="text-xs text-slate-700 truncate">{s.reason}</div>
                </div>
                <window.ScorePill value={s.score}/>
                <window.I.chevRight className="w-3.5 h-3.5 text-slate-400"/>
              </button>
            ))}
          </div>
        </window.Card>
      </div>

      {/* Coaching */}
      <window.Card title="AI-recommended coaching plan" action={<window.Btn kind="primary" size="sm" icon={<window.I.download className="w-3 h-3"/>} onClick={()=>setExportModal(true)}>Export coaching plan (PDF)</window.Btn>}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { t:"Mandatory refresher", b:"Compliance disclosure script (Module 4.2). Estimated impact: +6 QA pts.", icon:window.I.shield, color:"rose" },
            { t:"Pair with top performer", b:"Pair with Maria Dela Cruz for 5 voice calls. Estimated impact: +3 QA pts.", icon:window.I.users, color:"violet" },
            { t:"Weekly 1:1 check-in", b:"4 weeks until compliance score >85. Estimated impact: +5 QA pts.", icon:window.I.clock, color:"emerald" },
          ].map((r,i)=>(
            <div key={i} className="rounded-lg border border-slate-200 p-3">
              <div className="flex items-center gap-2 mb-1.5">
                <span className={`w-7 h-7 rounded-md bg-${r.color}-50 text-${r.color}-700 flex items-center justify-center`}>
                  <r.icon className="w-3.5 h-3.5"/>
                </span>
                <div className="text-xs font-semibold text-slate-900">{r.t}</div>
              </div>
              <div className="text-xs text-slate-600 leading-relaxed">{r.b}</div>
            </div>
          ))}
        </div>
      </window.Card>

      {/* Activity feed */}
      <window.Card title="Activity">
        <ol className="relative border-l border-slate-200 ml-2 space-y-3">
          {window.AGENT_ACTIVITY.map((a,i)=>(
            <li key={i} className="ml-4">
              <span className="absolute -left-1.5 w-3 h-3 rounded-full bg-white border-2 border-[var(--accent)]"/>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{a.date}</div>
              <div className="text-xs text-slate-700">{a.text}</div>
            </li>
          ))}
        </ol>
      </window.Card>
    </div>
  );
};

Object.assign(window, { InteractionDrawer, ScorecardScreen });
