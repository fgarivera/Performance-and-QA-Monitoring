/* global window, React, ReactDOM */
const { useState: uS, useEffect: uE, useMemo: uM } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#EC008C"
}/*EDITMODE-END*/;

const ACCENT_PRESETS = [
  { name: "Pink",   value: "#EC008C" },  // Globe brand pink
  { name: "Indigo", value: "#4F46E5" },
  { name: "Cobalt", value: "#1D4ED8" },
  { name: "Teal",   value: "#0D9488" },
  { name: "Emerald",value: "#059669" },
  { name: "Amber",  value: "#D97706" },
  { name: "Crimson",value: "#DC2626" },
  { name: "Violet", value: "#7C3AED" },
  { name: "Slate",  value: "#334155" },
];

function App() {
  // Read screen + role from URL hash (#screen=overview&role=Manager&chrome=off)
  const initialHash = (() => {
    const h = (typeof window !== "undefined" && window.location.hash || "").replace(/^#/, "");
    const params = new URLSearchParams(h);
    return {
      screen: params.get("screen"),
      role:   params.get("role"),
      chrome: params.get("chrome") !== "off",
    };
  })();
  const [role, setRole] = uS(initialHash.role || "Manager");
  const [active, setActive] = uS(initialHash.screen || "overview");
  const chromeOn = initialHash.chrome;
  const [hashLocked, setHashLocked] = uS(!!initialHash.screen);
  const [dateRange, setDateRange] = uS("Today");
  // Custom range (only used when dateRange === "Custom")
  const [customStart, setCustomStart] = uS("2026-04-22");
  const [customEnd,   setCustomEnd]   = uS("2026-04-29");
  const [channels, setChannels] = uS(["All"]);
  const [toasts, setToasts] = uS([]);
  const [drawerOpen, setDrawerOpen] = uS(false);
  const [drawerSource, setDrawerSource] = uS("queue");
  const [drawerInteraction, setDrawerInteraction] = uS(null);
  const [scorecardAgent, setScorecardAgent] = uS(window.NEEDS_ATTENTION[0]);
  const [exportModal, setExportModal] = uS(false);
  const [queueRows, setQueueRows] = uS(window.QUEUE_ROWS);
  const [notifOpen, setNotifOpen] = uS(false);
  const [exportOpen, setExportOpen] = uS(false);
  const [roleSwitcherOpen, setRoleSwitcherOpen] = uS(false);
  const [workspace, setWorkspace] = uS(window.WORKSPACES[0]);

  // Tweaks: live accent color (writes :root --accent so the whole UI re-tints)
  const [tweaks, setTweak] = window.useTweaks(TWEAK_DEFAULTS);
  uE(() => {
    document.documentElement.style.setProperty("--accent", tweaks.accent);
  }, [tweaks.accent]);

  const addToast = (text, kind="ok") => {
    const id = Math.random().toString(36).slice(2);
    setToasts(t => [...t, { id, text, kind }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4000);
  };
  const dismissToast = (id) => setToasts(t => t.filter(x => x.id !== id));

  // Role → home page (skip when hash is driving the view, e.g. canvas iframes)
  uE(() => {
    if (hashLocked) return;
    if (role === "Admin")      setActive("integrations");
    if (role === "Manager")    setActive("overview");
    if (role === "Supervisor") setActive("live");
    if (role === "QA Analyst") setActive("queue");
  }, [role]);

  // Close popovers on outside click
  uE(() => {
    const close = () => { setNotifOpen(false); setExportOpen(false); setRoleSwitcherOpen(false); };
    const onKey = (e) => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const toggleChannel = (c) => {
    setChannels(prev => {
      if (c === "All") return ["All"];
      const without = prev.filter(x => x !== "All");
      const next = without.includes(c) ? without.filter(x=>x!==c) : [...without, c];
      return next.length === 0 ? ["All"] : next;
    });
  };

  const openInteraction = (interaction, source) => {
    setDrawerSource(source);
    setDrawerInteraction(interaction);
    setDrawerOpen(true);
  };
  const openAgent = (agent) => {
    setScorecardAgent(agent);
    setActive("scorecard");
  };

  const navTo = (key) => {
    setActive(key);
    setNotifOpen(false); setExportOpen(false); setRoleSwitcherOpen(false);
  };

  let screen = null;
  switch (active) {
    case "overview":     screen = <window.OverviewScreen goTo={navTo} addToast={addToast} openAgent={openAgent} dateRange={dateRange} customStart={customStart} customEnd={customEnd} channels={channels}/>; break;
    case "live":         screen = <window.LiveScreen openInteraction={openInteraction} addToast={addToast} channels={channels}/>; break;
    case "queue":        screen = <window.QueueScreen openInteraction={openInteraction} queueRows={queueRows} addToast={addToast} channels={channels}/>; break;
    case "gating":       screen = <window.GatingScreen addToast={addToast} channels={channels}/>; break;
    case "agents":       screen = <window.AgentsListScreen openAgent={openAgent} channels={channels}/>; break;
    case "scorecard":    screen = <window.ScorecardScreen agent={scorecardAgent} openInteraction={openInteraction} addToast={addToast} setExportModal={setExportModal}/>; break;
    case "trends":       screen = <window.TrendsScreen/>; break;
    case "reports":      screen = <window.ReportsScreen addToast={addToast}/>; break;
    case "sampling":     screen = <window.SamplingScreen addToast={addToast}/>; break;
    case "framework":    screen = <window.FrameworkScreen addToast={addToast}/>; break;
    case "knowledge":    screen = <window.KnowledgeBaseScreen addToast={addToast}/>; break;
    case "alerts":       screen = <window.AlertsScreen addToast={addToast}/>; break;
    case "integrations": screen = <window.IntegrationsScreen addToast={addToast}/>; break;
    case "audit":        screen = <window.AuditScreen/>; break;
    case "team":         screen = <window.TeamScreen/>; break;
    default:             screen = <div>Coming soon</div>;
  }

  // Page title for content header
  const pageTitle = {
    overview:"QA Overview", live:"Live Monitoring", queue:"Review Queue",
    gating:"AI Response Gating",
    agents:"Agents", scorecard:scorecardAgent.name, trends:"Trends & Analytics", reports:"Reports",
    sampling:"QA Sampling", framework:"QA Framework",
    knowledge:"Knowledge Base",
    alerts:"Alerts & Notifications",
    integrations:"Integrations", audit:"Audit Log", team:"Team & Permissions"
  }[active];
  const rangeCaption = (() => {
    if (dateRange === "Today") return "today";
    if (dateRange === "7d")    return "last 7 days";
    if (dateRange === "30d")   return "last 30 days";
    if (dateRange === "Custom") return `${customStart} → ${customEnd}`;
    return dateRange.toLowerCase();
  })();
  const pageSub = {
    overview:`Team health · ${rangeCaption} · ${window.TODAY_LABEL}`,
    live:"Live conversations across Chat, Voice, Email · auto-refresh 5s",
    queue:`${queueRows.length} interactions awaiting human review`,
    gating:"AI drafts evaluated by CQC before send — supervisor decides on holds",
    agents:`${window.ALL_AGENTS.length} operators across 4 teams`,
    scorecard:`Senior CX Specialist · ${scorecardAgent.team || "Voice Team B"}`,
    trends:"QA score, flag rate, sentiment distribution",
    reports:"Daily and weekly report archive",
    sampling:"Configure the Random Message Selector",
    framework:"Edit categories, weights, and thresholds for the AI scorecard",
    knowledge:`${window.KB_DOCUMENTS.length} SOPs, policies, and scripts the AI evaluates against`,
    alerts:"Slack and email notifications configured by trigger",
    integrations:"CRM, telephony, chat, and messaging connectors",
    audit:"Immutable record of every evaluation, override, and alert",
    team:"Members, roles, and permissions",
  }[active];

  return (
    <div className={`h-full flex bg-slate-50 ${chromeOn ? "" : "[&_aside]:hidden [&_header]:hidden"}`} onClick={(e) => {
      // Light-dismiss popovers when clicking outside common popover areas
      if (!e.target.closest("[data-popover-anchor]")) {
        setNotifOpen(false); setExportOpen(false); setRoleSwitcherOpen(false);
      }
    }}>
      <window.Sidebar
        active={active}
        onNav={navTo}
        role={role}
        onRoleClick={() => setRoleSwitcherOpen(o=>!o)}
        queueCount={queueRows.length}
        gatingPending={window.GATING_STATS.pendingReview}
        workspace={workspace}
        setWorkspace={setWorkspace}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <div data-popover-anchor>
          <window.TopBar
            active={active}
            dateRange={dateRange} setDateRange={setDateRange}
            customStart={customStart} setCustomStart={setCustomStart}
            customEnd={customEnd} setCustomEnd={setCustomEnd}
            channels={channels} toggleChannel={toggleChannel}
            role={role} setRole={setRole}
            addToast={addToast}
            onCrumbClick={navTo}
            scorecardName={scorecardAgent.name}
            notifOpen={notifOpen} setNotifOpen={setNotifOpen}
            exportOpen={exportOpen} setExportOpen={setExportOpen}
            roleSwitcherOpen={roleSwitcherOpen} setRoleSwitcherOpen={setRoleSwitcherOpen}
          />
        </div>

        <main className="flex-1 overflow-y-auto scroll-thin">
          <div className="max-w-[1440px] mx-auto px-6 py-5">
            <div className="flex items-baseline justify-between mb-5">
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-2xl font-semibold text-slate-900">{pageTitle}</h1>
                  <window.ScreenHelp content={window.SCREEN_HELP[active]}/>
                </div>
                <p className="text-sm text-slate-500 mt-0.5">{pageSub}</p>
              </div>
              {active === "overview" && (
                <div className="hidden md:flex items-center gap-2 text-xs">
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-white border border-slate-200 text-slate-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"/> All systems operational
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-[var(--accent-tint)]/40 border border-[var(--accent-border)] text-[var(--accent-deep)] font-medium">
                    8 AI agents active
                  </span>
                </div>
              )}
            </div>
            {screen}
          </div>
        </main>
      </div>

      <window.InteractionDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        source={drawerSource}
        interaction={drawerInteraction}
        addToast={addToast}
      />

      <window.Modal
        open={exportModal}
        onClose={() => setExportModal(false)}
        title="Export coaching plan"
        footer={
          <>
            <window.Btn kind="ghost" size="md" onClick={() => setExportModal(false)}>Cancel</window.Btn>
            <window.Btn kind="primary" size="md" onClick={() => { setExportModal(false); addToast("Coaching plan exported as PDF and emailed to supervisor."); }}>Export & email</window.Btn>
          </>
        }
      >
        <div className="space-y-3">
          <div className="text-sm text-slate-700">Send a copy of the AI-recommended coaching plan to:</div>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked className="accent-[var(--accent)]"/> Joshua Reyes (Supervisor)</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked className="accent-[var(--accent)]"/> Mark Villanueva (Agent)</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="accent-[var(--accent)]"/> Trisha Aquino (Manager)</label>
          <div className="rounded-md border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-600">
            Format: PDF · 3 recommendations · Estimated impact +14 QA pts in 4 weeks
          </div>
        </div>
      </window.Modal>

      <window.Toast items={toasts} dismiss={dismissToast}/>

      <window.TweaksPanel title="Tweaks">
        <window.TweakSection label="Brand accent"/>
        <window.TweakColor label="Accent color" value={tweaks.accent} onChange={(v)=>setTweak("accent", v)}/>
        <div className="twk-row" style={{display:"block"}}>
          <div style={{fontSize:11, color:"#64748b", marginBottom:6}}>Presets</div>
          <div style={{display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:6}}>
            {ACCENT_PRESETS.map(p => (
              <button key={p.value}
                      type="button"
                      onClick={()=>setTweak("accent", p.value)}
                      title={p.name}
                      style={{
                        display:"flex", alignItems:"center", gap:6,
                        padding:"6px 8px", borderRadius:6,
                        border: tweaks.accent.toLowerCase()===p.value.toLowerCase() ? "1px solid #0f172a" : "1px solid #e2e8f0",
                        background:"#fff", cursor:"pointer", fontSize:11, color:"#334155",
                      }}>
                <span style={{width:14, height:14, borderRadius:3, background:p.value, border:"1px solid rgba(0,0,0,.08)"}}/>
                {p.name}
              </button>
            ))}
          </div>
        </div>
        <window.TweakButton label="Reset to Globe pink" secondary onClick={()=>setTweak("accent","#EC008C")}/>
      </window.TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
