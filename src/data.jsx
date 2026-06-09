/* global window */
// ===== MOCK DATA FIXTURES =====
// All data lives in memory. Realistic BPO context.

const TODAY_LABEL = "Apr 29, 2026";

const WORKSPACES = [
  { id: "acme",    name: "Acme BPO — Customer Care",   members: 142 },
  { id: "popmart", name: "PopMart E-commerce",          members: 58  },
  { id: "globe",   name: "Globe Telecom Tier 1",        members: 211 },
];

// 14-day sparkline data
const spark = (base, jitter, dir = 0) =>
  Array.from({ length: 14 }, (_, i) => ({
    d: i,
    v: Math.round(base + Math.sin(i / 2) * jitter + i * dir + (i % 3 === 0 ? jitter * 0.3 : 0)),
  }));

const KPI_HERO = [
  { label: "Interactions evaluated",  value: "3,247", delta: "+12.0%", up: true,  caption: "today",                  spark: spark(2900, 90, 18) },
  { label: "QA coverage",             value: "100%",  delta: "vs 1–5% manual", up: true, caption: "auto-evaluated",  spark: spark(99, 0.4, 0)   },
  { label: "Avg QA score",            value: "87.4",  delta: "−1.2 pts", up: false, caption: "across 3,247",         spark: spark(88, 1.2, -0.05) },
  { label: "Flag rate",               value: "24.6%", delta: "+3.1 pts", up: false, caption: "798 flagged",          spark: spark(22, 1.6, 0.18)  },
];

const HIGH_RISK_DONUT = [
  { name: "Compliance",         value: 146, color: "#f43f5e" },
  { name: "Negative sentiment", value: 412, color: "#fb923c" },
  { name: "Low-quality",        value: 240, color: "#8b5cf6" },
];

const CHANNEL_BREAKDOWN = [
  { channel: "Chat",  volume: 1820, score: 90, flag: 22 },
  { channel: "Voice", volume: 1030, score: 84, flag: 31 },
  { channel: "Email", volume: 397,  score: 89, flag: 18 },
];

const TOP_ISSUES = [
  { issue: "Tone / Communication",   count: 410, pct: 12.6 },
  { issue: "SOP / Process gaps",     count: 265, pct: 8.2  },
  { issue: "Compliance risks",       count: 146, pct: 4.5  },
  { issue: "Incomplete resolution",  count: 98,  pct: 3.0  },
];

const TOP_PERFORMERS = [
  { id:"a01", name: "Maria Dela Cruz", score: 96, delta: "+2.1", interactions: 148, team: "Voice Team A" },
  { id:"a02", name: "Joshua Reyes",    score: 94, delta: "+1.4", interactions: 132, team: "Chat Team A"  },
  { id:"a03", name: "Camille Tan",     score: 93, delta: "+0.0", interactions: 115, team: "Email Team"    },
  { id:"a04", name: "Daniel Soriano",  score: 92, delta: "−0.4", interactions: 140, team: "Voice Team A" },
  { id:"a05", name: "Patricia Lim",    score: 91, delta: "+0.3", interactions: 108, team: "Chat Team B"  },
];

const NEEDS_ATTENTION = [
  { id:"a10", name: "Mark Villanueva",  score: 72, delta: "−6.8", interactions: 121, team: "Voice Team B", reason: "Compliance disclosure missed 14×" },
  { id:"a11", name: "Angela Bautista",  score: 75, delta: "−3.2", interactions: 96,  team: "Chat Team B",  reason: "Tone inconsistency"               },
  { id:"a12", name: "Enrique Yap",      score: 78, delta: "−2.1", interactions: 102, team: "Voice Team B", reason: "Incomplete resolution"            },
  { id:"a13", name: "Sofia Mendoza",    score: 79, delta: "−0.9", interactions: 88,  team: "Email Team",   reason: "SOP deviation"                    },
];

const ALL_AGENTS = [
  ...TOP_PERFORMERS.map(a => ({ ...a, status:"top" })),
  ...NEEDS_ATTENTION.map(a => ({ ...a, status:"attention" })),
  { id:"a20", name:"Andrea Castillo",  score:90, delta:"+0.5", interactions:122, team:"Chat Team A",  reason:"" },
  { id:"a21", name:"Luis Mercado",     score:88, delta:"+0.1", interactions:118, team:"Voice Team A", reason:"" },
  { id:"a22", name:"Kenneth Ong",      score:86, delta:"−0.4", interactions:104, team:"Voice Team B", reason:"" },
  { id:"a23", name:"Therese Bautista", score:87, delta:"+0.8", interactions:97,  team:"Chat Team B",  reason:"" },
  { id:"a24", name:"Rico Salazar",     score:85, delta:"+0.2", interactions:130, team:"Voice Team A", reason:"" },
  { id:"a25", name:"Hannah Cruz",      score:89, delta:"+1.1", interactions:101, team:"Email Team",   reason:"" },
  { id:"a26", name:"Jonathan Park",    score:84, delta:"−0.7", interactions:113, team:"Chat Team A",  reason:"" },
  { id:"a27", name:"Bea Villanueva",   score:88, delta:"+0.3", interactions:94,  team:"Email Team",   reason:"" },
  { id:"a28", name:"Kevin Estrada",    score:74, delta:"−1.8", interactions:81,  team:"Voice Team B", reason:"Tone — escalation handling" },
  { id:"a29", name:"Crystal Domingo",  score:77, delta:"−1.3", interactions:90,  team:"Chat Team B",  reason:"Resolution verification"    },
  { id:"a30", name:"Reggie Co",        score:79, delta:"−0.6", interactions:99,  team:"Voice Team B", reason:"SOP adherence"              },
  { id:"a31", name:"Gabriel Lim",      score:88, delta:"+0.4", interactions:107, team:"Chat Team A",  reason:"" },
  { id:"a32", name:"Trisha Aquino",    score:90, delta:"+0.9", interactions:120, team:"Email Team",   reason:"" },
  { id:"a33", name:"Owen Sandoval",    score:83, delta:"+0.0", interactions:100, team:"Voice Team A", reason:"" },
  { id:"a34", name:"Faye Pascual",     score:86, delta:"+0.6", interactions:111, team:"Chat Team B",  reason:"" },
];

// Live conversations stream
const LIVE_CONVOS = [
  { id:"VOICE-2026-04-29-04821", channel:"Voice", agent:"Mark Villanueva",   customer:"Anna Reyes",     started:"4m ago",  duration:"04:12", risk:"Critical", sentiment:"Negative", trend:[2,1,1,2,1,0,0,1,0,0], snippet:"\"I'll process the shipping fee refund right now ma'am.\"", note:"Customer requested supervisor — not escalated." },
  { id:"CHAT-2026-04-29-08713",  channel:"Chat",  agent:"Angela Bautista",   customer:"Michael Tan",    started:"2m ago",  duration:"02:08", risk:"Critical", sentiment:"Negative", trend:[1,1,2,1,0,0,1,0,0,0], snippet:"\"lol that's just how it is, sorry 🤷\"",                                       note:"CQC — informal tone + emoji on regulated query." },
  { id:"CHAT-2026-04-29-08719",  channel:"Chat",  agent:"Enrique Yap",       customer:"Jasmine Garcia", started:"6m ago",  duration:"06:41", risk:"High",     sentiment:"Negative", trend:[2,2,1,1,1,0,0,1,0,0], snippet:"\"Your order is being processed.\"",                                          note:"Resolution not verified with customer." },
  { id:"VOICE-2026-04-29-04830", channel:"Voice", agent:"Kevin Estrada",     customer:"Robert Chen",    started:"3m ago",  duration:"03:22", risk:"High",     sentiment:"Negative", trend:[2,1,2,1,1,0,0,1,1,0], snippet:"\"Sir, we cannot do anything about that policy.\"",                          note:"Frustration signal × 2 in last 60s." },
  { id:"EMAIL-2026-04-29-13201", channel:"Email", agent:"Sofia Mendoza",     customer:"Carla Mendoza",  started:"12m ago", duration:"—",     risk:"High",     sentiment:"Neutral",  trend:[1,1,2,2,1,1,2,1,1,1], snippet:"\"Per policy section 4.2, we are unable to refund...\"",                     note:"SOP deviation — required tone softener missing." },
  { id:"CHAT-2026-04-29-08725",  channel:"Chat",  agent:"Crystal Domingo",   customer:"Anonymous",      started:"1m ago",  duration:"01:18", risk:"Medium",   sentiment:"Neutral",  trend:[1,2,2,1,1,1,2,1,2,1], snippet:"\"Got it, please give me a sec to check.\"",                                  note:"Standard handling — confidence 84%." },
  { id:"VOICE-2026-04-29-04835", channel:"Voice", agent:"Maria Dela Cruz",   customer:"Anna Reyes",     started:"5m ago",  duration:"05:04", risk:"Medium",   sentiment:"Positive", trend:[2,2,2,2,1,2,2,2,2,2], snippet:"\"Thank you for clarifying — let me confirm those details with you now.\"",   note:"Strong empathy markers." },
  { id:"CHAT-2026-04-29-08732",  channel:"Chat",  agent:"Camille Tan",       customer:"Michael Tan",    started:"7m ago",  duration:"07:13", risk:"Low",      sentiment:"Positive", trend:[2,2,2,2,2,2,2,2,2,2], snippet:"\"All set — I've sent the confirmation to your email.\"",                     note:"Resolution verified." },
  { id:"EMAIL-2026-04-29-13207", channel:"Email", agent:"Joshua Reyes",      customer:"Customer #4821", started:"14m ago", duration:"—",     risk:"Low",      sentiment:"Neutral",  trend:[1,1,2,2,2,1,2,2,2,2], snippet:"\"I've attached the updated invoice for your reference.\"",                  note:"SOP-compliant." },
  { id:"VOICE-2026-04-29-04840", channel:"Voice", agent:"Daniel Soriano",    customer:"Jasmine Garcia", started:"8m ago",  duration:"08:21", risk:"Low",      sentiment:"Positive", trend:[2,2,2,2,2,2,2,2,2,2], snippet:"\"Glad I could help today, ma'am. Have a great evening.\"",                  note:"Closing protocol followed." },
];

const ACTIVE_ALERTS = [
  { id:"al1", severity:"Critical", reason:"Compliance — Required disclosure missing",            agent:"Mark Villanueva",  customer:"Anna Reyes",     channel:"Voice", since:"12s ago", interactionId:"VOICE-2026-04-29-04821", ack:false, intervened:false },
  { id:"al2", severity:"Critical", reason:"Sentiment — 4 frustration signals in 90s",            agent:"Angela Bautista",  customer:"Michael Tan",    channel:"Chat",  since:"38s ago", interactionId:"CHAT-2026-04-29-08713",  ack:false, intervened:false },
  { id:"al3", severity:"High",     reason:"AI confidence < 50% on QA scoring",                   agent:"Enrique Yap",      customer:"Jasmine Garcia", channel:"Chat",  since:"1m ago",  interactionId:"CHAT-2026-04-29-08719",  ack:false, intervened:false },
  { id:"al4", severity:"High",     reason:"Escalation keyword — \"supervisor\" detected",        agent:"Kevin Estrada",    customer:"Robert Chen",    channel:"Voice", since:"2m ago",  interactionId:"VOICE-2026-04-29-04830", ack:false, intervened:false },
  { id:"al5", severity:"Medium",   reason:"SOP deviation — refund flow",                          agent:"Sofia Mendoza",    customer:"Carla Mendoza",  channel:"Email", since:"4m ago",  interactionId:"EMAIL-2026-04-29-13201", ack:false, intervened:false },
];

const TRIGGER_REASONS = [
  { key:"all",         label:"All",                 color:"slate",   count:62 },
  { key:"compliance",  label:"Compliance",          color:"rose",    count:12 },
  { key:"sentiment",   label:"Negative sentiment",  color:"orange",  count:18 },
  { key:"confidence",  label:"Low confidence",      color:"violet",  count:9  },
  { key:"sop",         label:"SOP deviation",       color:"amber",   count:5  },
  { key:"vip",         label:"VIP / escalation",    color:"sky",     count:3  },
  { key:"dataquality", label:"Data quality",        color:"teal",    count:8  },
  { key:"failure",     label:"Workflow failure",    color:"fuchsia", count:7  },
];

// ~25 review-queue rows
const QUEUE_ROWS = (() => {
  const rows = [];
  const reasons = ["compliance","sentiment","confidence","sop","vip","compliance","sentiment","confidence","sentiment","compliance"];
  const channels = ["Voice","Chat","Email"];
  const agents   = ["Mark Villanueva","Angela Bautista","Enrique Yap","Kevin Estrada","Crystal Domingo","Reggie Co","Sofia Mendoza","Luis Mercado","Therese Bautista","Hannah Cruz"];
  const customers= ["Anna Reyes","Michael Tan","Jasmine Garcia","Robert Chen","Carla Mendoza","Anonymous","Customer #4821","Anna Reyes","—","Michael Tan"];
  const sentiments=["Negative","Negative","Neutral","Negative","Negative","Neutral","Negative","Negative","Negative","Negative"];
  for (let i = 0; i < 25; i++) {
    const r = reasons[i % reasons.length];
    const ch = channels[i % channels.length];
    const score = [58,62,64,67,71,72,75,77,68,55,79,73,66,69,82,74,70,72,65,76,63,71,68,77,80][i];
    const conf  = [44,52,47,61,73,68,79,82,55,38,86,77,60,64,90,75,72,76,62,84,49,71,66,82,88][i];
    const sla   = i < 4 ? `${130+i*10}m` : i < 12 ? `${20+i*5}m` : `${i*2}m`;
    const slaBreach = i < 2;
    const priority = i < 4 ? "Critical" : i < 12 ? "High" : i < 19 ? "Medium" : "Medium";
    rows.push({
      id: `${ch.toUpperCase()}-2026-04-29-${(4800+i).toString().padStart(5,"0")}`,
      priority,
      reasonKey: r,
      reasonLabel: TRIGGER_REASONS.find(t=>t.key===r).label,
      channel: ch,
      agent: agents[i % agents.length],
      customer: customers[i % customers.length],
      score,
      confidence: conf,
      sentiment: sentiments[i % sentiments.length],
      sla,
      slaBreach,
    });
  }
  // Inject rows for the two new HITL trigger categories — Data Quality &
  // Workflow Failure. These are different in kind: the AI couldn't reliably
  // score (or score at all) and is asking a human to step in.
  const extras = [
    { reasonKey:"dataquality", reasonLabel:"Data quality", priority:"High",   channel:"Voice", agent:"Therese Bautista", customer:"Anna Reyes",       score:null, confidence:22, sentiment:"Neutral",  sla:"24m", slaBreach:false, note:"Partial transcript — last 2m missing" },
    { reasonKey:"dataquality", reasonLabel:"Data quality", priority:"Medium", channel:"Chat",  agent:"Luis Mercado",     customer:"Michael Tan",      score:null, confidence:34, sentiment:"Neutral",  sla:"38m", slaBreach:false, note:"Mixed Tagalog/English — STT confidence low" },
    { reasonKey:"dataquality", reasonLabel:"Data quality", priority:"Medium", channel:"Voice", agent:"Owen Sandoval",    customer:"Customer #4821",   score:null, confidence:18, sentiment:"Neutral",  sla:"42m", slaBreach:false, note:"Audio quality < 60% — call dropped 3× during session" },
    { reasonKey:"dataquality", reasonLabel:"Data quality", priority:"Low",    channel:"Email", agent:"Hannah Cruz",      customer:"—",                score:null, confidence:41, sentiment:"Neutral",  sla:"1h",  slaBreach:false, note:"Customer identifier missing — thread orphaned" },
    { reasonKey:"failure",     reasonLabel:"Workflow failure", priority:"Critical", channel:"Voice", agent:"Mark Villanueva", customer:"Carla Mendoza",  score:null, confidence:null, sentiment:"Neutral", sla:"180m", slaBreach:true,  note:"CQC evaluation timed out (twice) — agent unavailable" },
    { reasonKey:"failure",     reasonLabel:"Workflow failure", priority:"High",     channel:"Chat",  agent:"Daniel Soriano", customer:"Jasmine Garcia", score:null, confidence:null, sentiment:"Neutral", sla:"55m",  slaBreach:false, note:"Unsupported interaction type — multi-party group chat" },
    { reasonKey:"failure",     reasonLabel:"Workflow failure", priority:"Medium",   channel:"Email", agent:"Patricia Lim",   customer:"Robert Chen",    score:null, confidence:null, sentiment:"Neutral", sla:"1h12m",slaBreach:false, note:"Sentiment Analysis Agent rate-limited — retry queued" },
  ];
  extras.forEach((x, j) => {
    rows.push({
      id: `${x.channel.toUpperCase()}-2026-04-29-${(4900+j).toString().padStart(5,"0")}`,
      priority: x.priority,
      reasonKey: x.reasonKey,
      reasonLabel: x.reasonLabel,
      channel: x.channel,
      agent: x.agent,
      customer: x.customer,
      score: x.score,             // null = AI couldn't score; UI shows "—"
      confidence: x.confidence,   // null = no eval run
      sentiment: x.sentiment,
      sla: x.sla,
      slaBreach: x.slaBreach,
      note: x.note,
    });
  });
  return rows;
})();

// Detail fixture (for the drawer)
const DETAIL_VOICE = {
  id: "VOICE-2026-04-29-04821",
  channel: "Voice",
  agent: "Mark Villanueva",
  customer: "Anna Reyes",
  startedAt: "14:32 PHT",
  duration: "7m 12s",
  score: 64,
  confidence: 47,
  risk: "High",
  sentimentTrajectory: [2,2,1,1,1,0,0,0,1,0],
  flags: [
    { id:"f1", agent:"Content Quality Checker",  severity:"Critical", text:"Required compliance disclosure missing (refund policy)", spanIds:["t6"] },
    { id:"f2", agent:"Sentiment Analysis Agent", severity:"High",     text:"Customer expressed frustration 3× in 90s (\"this is ridiculous\", \"I want supervisor\", \"unacceptable\")", spanIds:["t4","t6b"] },
    { id:"f3", agent:"AI Message Rating",        severity:"Medium",   text:"Resolution incomplete: agent confirmed action but didn't verify outcome with customer", spanIds:["t8"] },
  ],
  rubric: [
    { name:"Communication / Tone",    score:8, max:10, note:"Professional opener, but apology missing after frustration." },
    { name:"SOP Adherence",           score:5, max:10, note:"Did not follow refund disclosure script section 4.2." },
    { name:"Resolution Effectiveness",score:6, max:10, note:"Action taken; outcome not verified with customer." },
    { name:"Compliance",              score:2, max:10, note:"Refund disclosure not provided before processing." },
    { name:"Customer Experience",     score:7, max:10, note:"Empathy shown once; escalation request ignored." },
  ],
  transcript: [
    { id:"t1", speaker:"Agent — Mark", at:"00:04", text:"Hi, this is Mark from Acme Customer Care, how can I help?" },
    { id:"t2", speaker:"Customer",     at:"00:09", text:"Hi, my package was supposed to be delivered yesterday and it's still not here. This is the third time." },
    { id:"t3", speaker:"Agent — Mark", at:"00:18", text:"Okay let me check that for you, just a moment ma'am." },
    { id:"t4", speaker:"Customer",     at:"01:02", text:"I've waited 5 days already. This is ridiculous.",                                            highlight:"sentiment" },
    { id:"t5", speaker:"Agent — Mark", at:"01:18", text:"I understand. I see the package is delayed at the NCR sorting facility. We can refund the shipping fee or reship via courier." },
    { id:"t6b",speaker:"Customer",     at:"02:04", text:"I want a full refund and I want to speak to a supervisor.",                                  highlight:"sentiment" },
    { id:"t6", speaker:"Agent — Mark", at:"02:14", text:"I'll process the shipping fee refund right now ma'am.",                                      highlight:"compliance" },
    { id:"t7", speaker:"Customer",     at:"02:32", text:"You haven't even told me about the refund timeline or the policy." },
    { id:"t8", speaker:"Agent — Mark", at:"02:48", text:"The refund will reflect in 5–7 business days, is there anything else?",                      highlight:"resolution" },
    { id:"t9", speaker:"Customer",     at:"03:01", text:"No. Just process it." },
    { id:"t10",speaker:"Agent — Mark", at:"03:12", text:"Thank you, have a good day ma'am." },
  ],
};

// Agent scorecard 30-day trend
const AGENT_TREND = (() => {
  const arr = [];
  const teamAvg = 87;
  for (let i = 0; i < 30; i++) {
    const day = i + 1;
    const wobble = Math.sin(i / 3) * 3;
    let score = 78 + wobble - (i < 10 ? 4 : 0) + (i > 22 ? 3 : 0);
    score = Math.round(score * 10) / 10;
    arr.push({ day:`Apr ${day}`, agent: score, team: teamAvg + Math.sin(i/4)*0.6 });
  }
  return arr;
})();

const AGENT_RECURRING = [
  { issue: "Compliance disclosure missed", count: 14 },
  { issue: "Tone — overly casual on voice", count: 9  },
  { issue: "Resolution not verified",       count: 6  },
  { issue: "SOP deviation — refund flow",   count: 4  },
];

const AGENT_LOWSCORE_SAMPLES = [
  { id:"VOICE-2026-04-29-04821", score:64, reason:"Compliance — disclosure missing" },
  { id:"VOICE-2026-04-28-04602", score:68, reason:"Sentiment — frustration not deescalated" },
  { id:"VOICE-2026-04-28-04591", score:71, reason:"Resolution not verified" },
  { id:"VOICE-2026-04-27-04488", score:66, reason:"Compliance — disclosure missing" },
  { id:"VOICE-2026-04-26-04412", score:73, reason:"Tone — overly casual" },
];

// Trends & analytics
const TRENDS_BY_CHANNEL = (() => {
  const arr = [];
  for (let i = 0; i < 90; i++) {
    arr.push({
      day: i + 1,
      Chat:  Math.round((88 + Math.sin(i/5)*2 + (i>60?1.5:0)) * 10)/10,
      Voice: Math.round((83 + Math.sin(i/6)*3 + (i>70?1:0))   * 10)/10,
      Email: Math.round((89 + Math.sin(i/4)*1.5)              * 10)/10,
    });
  }
  return arr;
})();

const FLAGS_STACKED = (() => {
  const arr = [];
  for (let i = 0; i < 60; i++) {
    arr.push({
      day: i + 1,
      Compliance:  Math.round(20 + Math.sin(i/4)*8 + (i>40?6:0)),
      Sentiment:   Math.round(40 + Math.sin(i/3)*10),
      Confidence:  Math.round(15 + Math.cos(i/5)*5),
      SOP:         Math.round(10 + Math.sin(i/6)*4),
    });
  }
  return arr;
})();

const SENTIMENT_STACKED = (() => {
  const arr = [];
  for (let i = 0; i < 60; i++) {
    const neg = 10 + Math.sin(i/5)*4 + (i>40?3:0);
    const neu = 30 + Math.cos(i/4)*5;
    const pos = 100 - neg - neu;
    arr.push({ day:i+1, Positive:Math.round(pos), Neutral:Math.round(neu), Negative:Math.round(neg) });
  }
  return arr;
})();

const REPORTS_LIST = [
  { id:"r1", date:"April 28, 2026", title:"Daily QA Performance & Alert Summary",  recipients:12, kind:"daily" },
  { id:"r2", date:"April 27, 2026", title:"Daily QA Performance & Alert Summary",  recipients:12, kind:"daily" },
  { id:"r3", date:"April 26, 2026", title:"Daily QA Performance & Alert Summary",  recipients:12, kind:"daily" },
  { id:"r4", date:"Week of Apr 21",  title:"Weekly QA Cutoff Report",                recipients:6,  kind:"weekly" },
  { id:"r5", date:"April 25, 2026", title:"Daily QA Performance & Alert Summary",  recipients:12, kind:"daily" },
  { id:"r6", date:"April 24, 2026", title:"Daily QA Performance & Alert Summary",  recipients:12, kind:"daily" },
  { id:"r7", date:"Week of Apr 14",  title:"Weekly QA Cutoff Report",                recipients:6,  kind:"weekly" },
];

const SAMPLES_HISTORY = [
  { date:"Apr 29, 2026 09:14", count:162, status:"Ready",     strategy:"Stratified by channel" },
  { date:"Apr 28, 2026 09:00", count:158, status:"Reviewed",  strategy:"Stratified by channel" },
  { date:"Apr 27, 2026 09:00", count:151, status:"Reviewed",  strategy:"Pure random"           },
  { date:"Apr 26, 2026 09:00", count:148, status:"Reviewed",  strategy:"Stratified by agent"   },
  { date:"Apr 25, 2026 09:00", count:163, status:"Reviewed",  strategy:"Stratified by risk"    },
];

const ALERT_RULES = [
  { id:"ar1", trigger:"Critical compliance flag",            condition:"any compliance violation",         channel:["Slack"],         dest:"#cx-qa-critical", recipients:["@joshua_reyes","@maria_d","@on-call"], throttle:"Max 1 / agent / 15min" },
  { id:"ar2", trigger:"Negative sentiment cluster",          condition:">3 frustration signals in 90s",    channel:["Slack"],         dest:"#cx-supervisors", recipients:["all team leads"],                       throttle:"Max 2 / hour"          },
  { id:"ar3", trigger:"Daily QA Summary",                    condition:"every day at 7:00 AM PHT",         channel:["Email"],         dest:"12 recipients",  recipients:["managers","supervisors"],                throttle:"—"                      },
  { id:"ar4", trigger:"Weekly cutoff report",                condition:"every Monday at 8:00 AM PHT",      channel:["Email"],         dest:"6 recipients",   recipients:["managers"],                              throttle:"—"                      },
];

const INTEGRATIONS = [
  { name:"Zoho CRM",         domain:"zoho.com",       status:"Connected",     primary:true,  category:"CRM"       },
  { name:"Slack",            domain:"slack.com",      status:"Connected",     primary:false, category:"Messaging" },
  { name:"Twilio (Voice)",   domain:"twilio.com",     status:"Connected",     primary:false, category:"Telephony" },
  { name:"Zendesk",          domain:"zendesk.com",    status:"Not connected", primary:false, category:"CRM"       },
  { name:"Salesforce",       domain:"salesforce.com", status:"Not connected", primary:false, category:"CRM"       },
  { name:"Freshdesk",        domain:"freshworks.com", status:"Error",         primary:false, category:"CRM"       },
  { name:"Microsoft Teams",  domain:"teams.microsoft.com",  status:"Not connected", primary:false, category:"Messaging" },
  { name:"Genesys",          domain:"genesys.com",    status:"Not connected", primary:false, category:"Telephony" },
  { name:"Intercom",         domain:"intercom.com",   status:"Not connected", primary:false, category:"Chat"      },
  { name:"Front",            domain:"frontapp.com",   status:"Not connected", primary:false, category:"Email"     },
  { name:"Email (IMAP)",     domain:null,             status:"Connected",     primary:false, category:"Email"     },
  { name:"Webhook (custom)", domain:null,             status:"Connected",     primary:false, category:"Custom"    },
];

const AUDIT_ROWS = (() => {
  const seed = [
    { ts:"2026-04-29 14:23:11", actorType:"AI",    actor:"HITL Control Agent",            action:"Flagged interaction",     target:"VOICE-2026-04-29-04821", before:"—",                         after:"reason: compliance risk",         ip:"—" },
    { ts:"2026-04-29 14:25:02", actorType:"Human", actor:"Maria Dela Cruz (QA Analyst)",  action:"Override score",          target:"VOICE-2026-04-29-04821", before:"64",                        after:"58 — \"AI missed missing disclosure\"", ip:"203.177.4.18" },
    { ts:"2026-04-29 14:30:44", actorType:"AI",    actor:"Sentiment Analysis Agent",      action:"Flagged interaction",     target:"CHAT-2026-04-29-08713",  before:"—",                         after:"reason: 4 frustration signals",    ip:"—" },
    { ts:"2026-04-29 14:32:18", actorType:"AI",    actor:"Content Quality Checker",       action:"Disabled AI response",    target:"CHAT-2026-04-29-08713",  before:"draft sent",                after:"blocked — informal tone",          ip:"—" },
    { ts:"2026-04-29 14:35:02", actorType:"Human", actor:"Joshua Reyes (Supervisor)",     action:"Intervene in conversation",target:"VOICE-2026-04-29-04821",before:"agent only",                after:"supervisor joined",                ip:"203.177.4.42" },
    { ts:"2026-04-29 14:40:11", actorType:"AI",    actor:"Random Message Selector",       action:"Generated sample",        target:"sample-20260429-09",     before:"—",                         after:"162 interactions",                 ip:"—" },
    { ts:"2026-04-29 14:42:55", actorType:"AI",    actor:"Operator Rating Agent",         action:"Updated weekly scorecard",target:"agent: Mark Villanueva", before:"avg 78.8",                  after:"avg 72.0",                         ip:"—" },
    { ts:"2026-04-29 14:48:09", actorType:"Human", actor:"Patricia Lim (QA Analyst)",     action:"Validated AI score",      target:"CHAT-2026-04-29-08719",  before:"71 (proposed)",             after:"71 (validated)",                   ip:"203.177.4.61" },
    { ts:"2026-04-29 14:51:33", actorType:"AI",    actor:"Interaction Logging Agent",     action:"Audit packet sealed",     target:"daily-audit-20260429",   before:"—",                         after:"1,128 events",                     ip:"—" },
    { ts:"2026-04-29 14:55:12", actorType:"Human", actor:"Joshua Reyes (Supervisor)",     action:"Acknowledged alert",      target:"alert al4",              before:"open",                      after:"acknowledged",                     ip:"203.177.4.42" },
    { ts:"2026-04-29 15:02:08", actorType:"AI",    actor:"Employee Performance Agent",    action:"Generated coaching plan", target:"agent: Mark Villanueva", before:"—",                         after:"3 recommendations",                ip:"—" },
    { ts:"2026-04-29 15:06:41", actorType:"Human", actor:"Camille Tan (QA Analyst)",      action:"Override score",          target:"EMAIL-2026-04-29-13207", before:"82",                        after:"86 — \"AI was too strict\"",       ip:"203.177.4.51" },
    { ts:"2026-04-29 15:11:04", actorType:"AI",    actor:"AI Message Rating Agent",       action:"Auto-disabled response",  target:"CHAT-2026-04-29-08725",  before:"draft pending",             after:"blocked — confidence 31%",         ip:"—" },
    { ts:"2026-04-29 15:14:50", actorType:"AI",    actor:"HITL Control Agent",            action:"Flagged interaction",     target:"VOICE-2026-04-29-04830", before:"—",                         after:"reason: escalation keyword",       ip:"—" },
    { ts:"2026-04-29 15:21:33", actorType:"Human", actor:"Andrea Castillo (Supervisor)",  action:"Reassigned interaction",  target:"CHAT-2026-04-29-08719",  before:"queue: general",            after:"queue: senior-review",             ip:"203.177.4.74" },
    { ts:"2026-04-29 15:25:00", actorType:"AI",    actor:"Sentiment Analysis Agent",      action:"Trend warning",           target:"team: Voice Team B",     before:"−4% sentiment",             after:"−18% sentiment (NCR)",             ip:"—" },
    { ts:"2026-04-29 15:32:18", actorType:"Human", actor:"Maria Dela Cruz (QA Analyst)",  action:"Override score",          target:"VOICE-2026-04-29-04602", before:"68",                        after:"62 — \"AI missed context\"",      ip:"203.177.4.18" },
    { ts:"2026-04-29 15:40:11", actorType:"AI",    actor:"Content Quality Checker",       action:"Flagged interaction",     target:"EMAIL-2026-04-29-13201", before:"—",                         after:"reason: SOP deviation",            ip:"—" },
    { ts:"2026-04-29 15:48:55", actorType:"Human", actor:"Joshua Reyes (Supervisor)",     action:"Closed alert",            target:"alert al5",              before:"acknowledged",              after:"resolved",                         ip:"203.177.4.42" },
    { ts:"2026-04-29 15:54:09", actorType:"AI",    actor:"Operator Rating Agent",         action:"Generated weekly cutoff", target:"team: Voice Team A",     before:"—",                         after:"7 agents, avg 91.4",               ip:"—" },
    { ts:"2026-04-29 16:02:08", actorType:"Human", actor:"Patricia Lim (QA Analyst)",     action:"Validated AI score",      target:"CHAT-2026-04-29-08732",  before:"94 (proposed)",             after:"94 (validated)",                   ip:"203.177.4.61" },
    { ts:"2026-04-29 16:06:41", actorType:"Human", actor:"Camille Tan (QA Analyst)",      action:"Escalated to manager",    target:"VOICE-2026-04-29-04821", before:"queue: hitl",               after:"queue: manager-review",            ip:"203.177.4.51" },
    { ts:"2026-04-29 16:11:04", actorType:"AI",    actor:"Interaction Logging Agent",     action:"Daily summary sent",      target:"email-20260429-am",      before:"—",                         after:"12 recipients",                    ip:"—" },
    { ts:"2026-04-29 16:14:50", actorType:"AI",    actor:"HITL Control Agent",            action:"Flagged interaction",     target:"CHAT-2026-04-29-08725",  before:"—",                         after:"reason: low confidence",           ip:"—" },
    { ts:"2026-04-29 16:21:33", actorType:"Human", actor:"Andrea Castillo (Supervisor)",  action:"Updated alert rule",      target:"rule ar2",               before:"throttle 1/h",              after:"throttle 2/h",                     ip:"203.177.4.74" },
    { ts:"2026-04-29 16:25:00", actorType:"AI",    actor:"Random Message Selector",       action:"Auto-sample reminder",    target:"queue: weekly-audit",    before:"—",                         after:"sample due in 24h",                ip:"—" },
    { ts:"2026-04-29 16:32:18", actorType:"Human", actor:"Joshua Reyes (Supervisor)",     action:"Override score",          target:"VOICE-2026-04-29-04830", before:"66",                        after:"61 — \"Edge case\"",              ip:"203.177.4.42" },
    { ts:"2026-04-29 16:40:11", actorType:"AI",    actor:"Employee Performance Agent",    action:"Recommended coaching",    target:"agent: Angela Bautista", before:"—",                         after:"2 recommendations",                ip:"—" },
    { ts:"2026-04-29 16:48:55", actorType:"Human", actor:"Maria Dela Cruz (QA Analyst)",  action:"Validated AI score",      target:"VOICE-2026-04-29-04835", before:"92 (proposed)",             after:"92 (validated)",                   ip:"203.177.4.18" },
    { ts:"2026-04-29 16:54:09", actorType:"AI",    actor:"Sentiment Analysis Agent",      action:"Flagged interaction",     target:"VOICE-2026-04-29-04830", before:"—",                         after:"reason: negative sentiment",       ip:"—" },
    { ts:"2026-04-29 17:02:08", actorType:"Human", actor:"Camille Tan (QA Analyst)",      action:"Edited rubric weight",    target:"rubric: Compliance",     before:"weight 18%",                after:"weight 20%",                       ip:"203.177.4.51" },
  ];
  return seed;
})();

const TEAM_MEMBERS = [
  { name:"Maria Dela Cruz",    email:"maria.d@acme.bpo",     role:"QA Analyst", team:"Voice Team A", status:"Active" },
  { name:"Patricia Lim",       email:"patricia.l@acme.bpo",  role:"QA Analyst", team:"Chat Team B",  status:"Active" },
  { name:"Camille Tan",        email:"camille.t@acme.bpo",   role:"QA Analyst", team:"Email Team",   status:"Active" },
  { name:"Joshua Reyes",       email:"joshua.r@acme.bpo",    role:"Supervisor", team:"Voice Team A", status:"Active" },
  { name:"Andrea Castillo",    email:"andrea.c@acme.bpo",    role:"Supervisor", team:"Chat Team A",  status:"Active" },
  { name:"Daniel Soriano",     email:"daniel.s@acme.bpo",    role:"Supervisor", team:"Voice Team B", status:"Active" },
  { name:"Trisha Aquino",      email:"trisha.a@acme.bpo",    role:"Manager",    team:"CX Ops",       status:"Active" },
  { name:"Owen Sandoval",      email:"owen.s@acme.bpo",      role:"Admin",      team:"Platform",     status:"Active" },
];

// Activity feed (Screen 5)
const AGENT_ACTIVITY = [
  { date:"Apr 29", text:"Compliance flag — refund disclosure missed (VOICE-…04821)" },
  { date:"Apr 27", text:"Coaching session completed with supervisor Joshua Reyes" },
  { date:"Apr 22", text:"AI-recommended coaching plan generated" },
  { date:"Apr 18", text:"New SOP rollout — refund script v2.1 deployed" },
  { date:"Apr 12", text:"QA score crossed 80 threshold (briefly)" },
  { date:"Apr 04", text:"Supervisor adjusted weekly target to 85" },
];

// 14-day chart for sparkline of detail flags etc — already in KPI_HERO

// ===== AI RESPONSE GATING =====
// Pre-send evaluation: AI drafts (or agent-assisted drafts) are scored by CQC
// before they go out. Blocked drafts wait for supervisor decision.

const GATING_STATS = {
  totalToday:    333,
  autoApproved:  287,
  blocked:        23,  // critical violation — blocked outright
  pendingReview:  14,  // waiting on supervisor (the rows below)
  overridden:      9,  // supervisor force-sent despite a hold
  passRate:     91.5,  // %
};

const GATING_DRAFTS = [
  {
    id: "DRAFT-2026-04-29-90211",
    channel: "Chat",
    agent: "Angela Bautista",
    customer: "Michael Tan",
    held: "12s ago",
    heldAt: Date.now() - 12000,
    slaSeconds: 60,           // total SLA window
    slaRemaining: 48,         // ticks down
    origin: "AI-assisted",    // "AI-drafted" (fully AI) | "AI-assisted" (agent used suggestion) | "Human-typed"
    fallback: "block",        // block | send-suggested | send-original
    draft: "lol that's just how it is, sorry 🤷",
    severity: "Critical",
    confidence: 31,
    flaggedBy: "Content Quality Checker",
    reasons: ["Informal tone", "Emoji on regulated query", "Empathy missing"],
    suggestion: "I'm really sorry for the inconvenience. Let me check the policy and find the best option for you — one moment.",
    // Full conversation context for the Agent Composer (Tier 1) view
    conversation: [
      { from:"customer", at:"14:18", text:"Hi, I haven't received my package and it's been 5 days. Tracking still says 'in transit'." },
      { from:"agent",    at:"14:19", text:"Hi Michael, sorry to hear that. Let me check your order — can you share the order number?" },
      { from:"customer", at:"14:20", text:"#AC-44821. I've already messaged twice last week with no reply." },
      { from:"agent",    at:"14:22", text:"I see it in our system. NCR sorting facility delays. Let me look at your options." },
      { from:"customer", at:"14:23", text:"This is the third time. I want a refund or I'm leaving a review." },
    ],
  },
  {
    id: "DRAFT-2026-04-29-90213",
    channel: "Email",
    agent: "Sofia Mendoza",
    customer: "Carla Mendoza",
    held: "38s ago",
    heldAt: Date.now() - 38000,
    slaSeconds: 120,
    slaRemaining: 82,
    origin: "AI-drafted",
    fallback: "block",
    draft: "Per policy section 4.2, we are unable to refund.",
    severity: "Critical",
    confidence: 44,
    flaggedBy: "Content Quality Checker",
    reasons: ["Required disclosure missing (refund timeline)", "Tone softener missing"],
    suggestion: "I understand this is frustrating. While our refund policy under section 4.2 applies here, please note your full options are: A) reship within 3 business days, B) credit to your account. The refund timeline if approved is 5–7 business days.",
  },
  {
    id: "DRAFT-2026-04-29-90218",
    channel: "Chat",
    agent: "Mark Villanueva",
    customer: "Anna Reyes",
    held: "1m ago",
    heldAt: Date.now() - 60000,
    slaSeconds: 120,
    slaRemaining: 60,
    origin: "AI-assisted",
    fallback: "block",
    draft: "I'll process the shipping fee refund right now ma'am.",
    severity: "High",
    confidence: 47,
    flaggedBy: "Content Quality Checker",
    reasons: ["Required refund disclosure not provided before processing"],
    suggestion: "Before I process the shipping fee refund, please note: refunds reflect in 5–7 business days, and processing this confirms acceptance of our policy. Would you like me to proceed?",
  },
  {
    id: "DRAFT-2026-04-29-90222",
    channel: "Chat",
    agent: "Crystal Domingo",
    customer: "Anonymous",
    held: "2m ago",
    heldAt: Date.now() - 120000,
    slaSeconds: 60,
    slaRemaining: 18,
    origin: "AI-drafted",
    fallback: "send-suggested",
    draft: "Got it, please give me a sec to check.",
    severity: "Medium",
    confidence: 58,
    flaggedBy: "AI Message Rating",
    reasons: ["Confidence below 65% cutoff", "Could not verify policy alignment"],
    suggestion: "Thanks for that — give me a moment to verify in our system. I'll be right back with you.",
  },
];

// Per-severity fallback action when SLA breaches — configurable in QA Framework
const FALLBACK_DEFAULTS = {
  Critical: "block",            // never auto-send if critical
  High:     "block",            // block by default; can be relaxed
  Medium:   "send-suggested",   // send the AI's rewrite
  Low:      "send-suggested",   // send the AI's rewrite
};

const GATING_RECENT = [
  { ts:"14:42:08", action:"auto-approved", agent:"Maria Dela Cruz",   draft:"Glad I could help — confirmation is on its way.",          conf:94 },
  { ts:"14:41:55", action:"auto-approved", agent:"Joshua Reyes",      draft:"All set, your refund will reflect in 5–7 business days.",  conf:91 },
  { ts:"14:41:33", action:"sent-after-override", agent:"Kevin Estrada", draft:"Sir, we cannot do anything about that policy.",           conf:52, by:"Joshua Reyes" },
  { ts:"14:40:12", action:"blocked",       agent:"Angela Bautista",   draft:"that's not really our problem tbh",                        conf:24 },
  { ts:"14:39:48", action:"auto-approved", agent:"Camille Tan",       draft:"Thanks for clarifying — let me confirm those details.",    conf:88 },
  { ts:"14:38:21", action:"blocked",       agent:"Enrique Yap",       draft:"Just check our website lol",                                conf:18 },
  { ts:"14:37:09", action:"auto-approved", agent:"Daniel Soriano",    draft:"Per our policy section 4.2, here are your options...",     conf:90 },
  { ts:"14:36:44", action:"sent-after-override", agent:"Crystal Domingo", draft:"I'm not sure, let me escalate to my supervisor.",       conf:61, by:"Andrea Castillo" },
];

// ===== AI–HUMAN AGREEMENT TREND (30 days) =====
// Shows the model getting calibrated to QA team standards: agreement % climbs,
// override rate falls. Confidence gap (AI confidence − actual QA score
// distance) narrows — the AI is becoming better at knowing when it's right.
const AGREEMENT_TREND = (() => {
  const arr = [];
  for (let i = 0; i < 30; i++) {
    const t = i / 29;
    // Agreement climbs from ~78% to ~89%, with a dip in the middle (rubric change).
    let agree = 78 + (89 - 78) * t + Math.sin(i / 3) * 1.2;
    if (i === 14) agree -= 3.5;                 // rubric update
    let override = 100 - agree - (4 + Math.cos(i / 4) * 1.5); // validated bucket
    let validated = 100 - agree - override;
    // confidence gap (AI confidence vs final score, lower = better) narrows
    const gap = 14 - 9 * t + Math.cos(i / 3) * 0.8;
    arr.push({
      day: `Apr ${i + 1}`,
      agreement: +agree.toFixed(1),
      override:  +override.toFixed(1),
      validated: +validated.toFixed(1),
      confidenceGap: +gap.toFixed(1),
    });
  }
  return arr;
})();

// Heatmap data — 24 hours × flag intensity (0-10)
const HEATMAP_24H = Array.from({ length: 24 }, (_, h) => {
  const base = h >= 8 && h <= 20 ? 6 : 2;
  const peak = h === 11 || h === 14 || h === 17 ? 4 : 0;
  return { hour: h, value: Math.max(0, Math.min(10, base + peak + (Math.sin(h / 3) * 1.5))) };
});

// ===== KNOWLEDGE BASE — SOPs, policies, scripts =====
// PRD §5.2.C requires a documented SOP library; the QA Framework's reference
// examples are tiny snippets, but the AI needs a real source of truth.
const KB_DOCUMENTS = [
  {
    id: "doc-001",
    title: "Refund Handling — Standard Procedure",
    category: "Compliance",
    version: "v2.1",
    lastUpdated: "Apr 18, 2026",
    owner: "Trisha Aquino",
    status: "Active",
    pages: 12,
    mappedTo: ["Compliance", "SOP Adherence", "Resolution Effectiveness"],
    summary: "Mandatory disclosures, processing timeline, eligibility rules, and escalation paths for refund requests across all channels.",
    references: 142,  // # of times AI agents referenced this in last 30d
    changelog: [
      { v:"v2.1", date:"Apr 18, 2026", by:"Trisha Aquino", note:"Updated refund timeline to 5–7 business days (was 7–10)." },
      { v:"v2.0", date:"Mar 15, 2026", by:"Joshua Reyes",  note:"Added shipping-fee refund flow + policy section 4.2." },
      { v:"v1.4", date:"Feb 02, 2026", by:"Trisha Aquino", note:"Compliance disclosure script revised per legal review." },
    ],
  },
  {
    id: "doc-002",
    title: "Customer Greeting & Identity Verification",
    category: "Compliance",
    version: "v1.3",
    lastUpdated: "Mar 12, 2026",
    owner: "Maria Dela Cruz",
    status: "Active",
    pages: 4,
    mappedTo: ["Communication / Tone", "Compliance"],
    summary: "Required opening script, identity verification questions (3-of-5 rule), and data-handling consent.",
    references: 287,
    changelog: [
      { v:"v1.3", date:"Mar 12, 2026", by:"Maria Dela Cruz", note:"Added Filipino-language greeting variants." },
      { v:"v1.2", date:"Jan 28, 2026", by:"Joshua Reyes",    note:"Identity verification: 3-of-5 questions required (was 2-of-5)." },
    ],
  },
  {
    id: "doc-003",
    title: "Escalation Routing Matrix",
    category: "Process",
    version: "v3.0",
    lastUpdated: "Apr 22, 2026",
    owner: "Joshua Reyes",
    status: "Active",
    pages: 8,
    mappedTo: ["SOP Adherence", "Resolution Effectiveness"],
    summary: "Decision tree for routing escalations: Tier 1 → Senior agent → Supervisor → Manager. Includes VIP override.",
    references: 89,
    changelog: [
      { v:"v3.0", date:"Apr 22, 2026", by:"Joshua Reyes",   note:"Added VIP fast-track for accounts over ₱500K AOV." },
      { v:"v2.5", date:"Feb 10, 2026", by:"Andrea Castillo", note:"New supervisor pool for Voice Team B." },
    ],
  },
  {
    id: "doc-004",
    title: "Tone & Communication Guidelines",
    category: "Quality",
    version: "v1.8",
    lastUpdated: "Apr 05, 2026",
    owner: "Patricia Lim",
    status: "Active",
    pages: 6,
    mappedTo: ["Communication / Tone", "Customer Experience"],
    summary: "Empathy markers, prohibited phrases, emoji policy by channel, and tone calibration for frustrated customers.",
    references: 412,
    changelog: [
      { v:"v1.8", date:"Apr 05, 2026", by:"Patricia Lim", note:"Emoji policy: forbidden in regulated queries (refund, compliance, complaints)." },
    ],
  },
  {
    id: "doc-005",
    title: "Shipping Delay & Tracking Inquiries",
    category: "Process",
    version: "v1.1",
    lastUpdated: "Apr 28, 2026",
    owner: "Camille Tan",
    status: "Active",
    pages: 9,
    mappedTo: ["SOP Adherence", "Resolution Effectiveness", "Customer Experience"],
    summary: "Lookup procedure, communication templates, and resolution options for late delivery scenarios.",
    references: 156,
    changelog: [
      { v:"v1.1", date:"Apr 28, 2026", by:"Camille Tan", note:"Added NCR sorting facility delay disclosure (current outage)." },
    ],
  },
  {
    id: "doc-006",
    title: "Compliance — Regulated Language",
    category: "Compliance",
    version: "v1.2",
    lastUpdated: "Mar 30, 2026",
    owner: "Trisha Aquino",
    status: "Active",
    pages: 15,
    mappedTo: ["Compliance"],
    summary: "Phrases the agent must use (or must NOT use) in financial, medical, and account-data contexts. Auto-blocking rules.",
    references: 234,
    changelog: [
      { v:"v1.2", date:"Mar 30, 2026", by:"Trisha Aquino", note:"Added BSP (Bangko Sentral) language requirements for fintech accounts." },
    ],
  },
  {
    id: "doc-007",
    title: "Closing Protocol & CSAT Survey",
    category: "Process",
    version: "v1.0",
    lastUpdated: "Feb 14, 2026",
    owner: "Maria Dela Cruz",
    status: "Active",
    pages: 3,
    mappedTo: ["Customer Experience", "Resolution Effectiveness"],
    summary: "End-of-interaction wrap-up, verification of resolution, and CSAT trigger conditions.",
    references: 178,
    changelog: [
      { v:"v1.0", date:"Feb 14, 2026", by:"Maria Dela Cruz", note:"Initial publication." },
    ],
  },
  {
    id: "doc-008",
    title: "AI-Assisted Reply Guidelines (Beta)",
    category: "Quality",
    version: "v0.4 (Draft)",
    lastUpdated: "Apr 26, 2026",
    owner: "Patricia Lim",
    status: "Draft",
    pages: 5,
    mappedTo: ["Communication / Tone", "SOP Adherence"],
    summary: "When and how to use AI suggestions in the composer. Override conventions, audit expectations.",
    references: 23,
    changelog: [
      { v:"v0.4", date:"Apr 26, 2026", by:"Patricia Lim", note:"Added Tier-2 escalation guidance after agent override." },
    ],
  },
];

const KB_CATEGORIES = [
  { key:"all",        label:"All documents", count:8 },
  { key:"Compliance", label:"Compliance",    count:3 },
  { key:"Process",    label:"Process & SOP", count:3 },
  { key:"Quality",    label:"Quality",       count:2 },
];

const KB_RECENT_USAGE = [
  { ts:"14:42:08", doc:"Refund Handling — Standard Procedure",     agent:"Content Quality Checker",       interaction:"VOICE-2026-04-29-04821" },
  { ts:"14:40:12", doc:"Compliance — Regulated Language",          agent:"Content Quality Checker",       interaction:"EMAIL-2026-04-29-13201" },
  { ts:"14:38:21", doc:"Tone & Communication Guidelines",          agent:"Content Quality Checker",       interaction:"CHAT-2026-04-29-08713"  },
  { ts:"14:35:00", doc:"Shipping Delay & Tracking Inquiries",      agent:"Content Quality Checker",       interaction:"VOICE-2026-04-29-04830" },
  { ts:"14:32:18", doc:"Customer Greeting & Identity Verification",agent:"AI Message Rating",             interaction:"CHAT-2026-04-29-08725"  },
];

// ===== COACHING SESSIONS — for Mark Villanueva =====
// Closes PRD §6 Use Case 3 loop: track that coaching happened + measure impact.
const COACHING_SESSIONS = [
  {
    id:"coach-005", date:"Apr 22, 2026", time:"3:00 PM",
    supervisor:"Joshua Reyes", agent:"Mark Villanueva",
    topic:"Compliance — Refund disclosure script",
    status:"Completed", duration:"35m",
    fromPlan:"AI-recommended plan · Apr 18",
    qaBefore:72.0, qaAfter:78.4,        // delta = +6.4
    target:"+6 QA pts in 14 days",
    notes:"Walked through Module 4.2 script. Mark could recite it by end. Concerns: confidence in live calls.",
    nextStep:"Pair-call with Maria on Apr 24",
  },
  {
    id:"coach-004", date:"Apr 24, 2026", time:"10:00 AM",
    supervisor:"Joshua Reyes", agent:"Mark Villanueva",
    topic:"Pair-call with Maria Dela Cruz (Voice Team A)",
    status:"Completed", duration:"5 calls observed",
    fromPlan:"AI-recommended plan · Apr 18",
    qaBefore:78.4, qaAfter:80.1,
    target:"Observe + execute disclosure on 5 live calls",
    notes:"Maria modeled 2 calls. Mark led 3 with supervision. All 3 included full disclosure.",
    nextStep:"Solo monitoring for 1 week",
  },
  {
    id:"coach-003", date:"May 06, 2026", time:"2:00 PM",
    supervisor:"Joshua Reyes", agent:"Mark Villanueva",
    topic:"Weekly check-in #2",
    status:"Scheduled",
    fromPlan:"AI-recommended plan · Apr 18",
    target:"Confirm compliance score > 85",
    notes:"",
    nextStep:"",
  },
  {
    id:"coach-002", date:"Mar 28, 2026", time:"4:00 PM",
    supervisor:"Andrea Castillo", agent:"Mark Villanueva",
    topic:"Tone — Empathy in escalations",
    status:"Completed", duration:"25m",
    fromPlan:"Manual",
    qaBefore:75.1, qaAfter:73.8,   // negative delta — coaching didn't stick
    target:"+3 QA pts in 14 days",
    notes:"Reviewed 3 calls with escalation language. Slight regression observed in week 2.",
    nextStep:"Refresher recommended",
  },
];

const COACHING_IMPACT = {
  totalSessions: 4,
  completed: 3,
  scheduled: 1,
  noShow: 0,
  avgDelta: +3.5,  // avg QA pt gain across completed sessions with measurable impact
  successRate: 67, // % of plans that moved agent ≥ target
};

// ===== CSAT VS AI QA SCORE =====
// PRD §6 Use Case 3 mentions performance data; tying QA scores to customer
// outcomes is the trust-builder for the whole system.
const CSAT_DAILY = (() => {
  const arr = [];
  for (let i = 0; i < 60; i++) {
    // CSAT loosely tracks AI score with noise + a small persistent gap
    const ai = 87 + Math.sin(i / 5) * 2 + (i > 40 ? 0.6 : 0);
    const csat = 4.1 + Math.sin(i / 4.5) * 0.18 + (i > 40 ? 0.04 : 0);
    arr.push({ day: i + 1, ai: +ai.toFixed(1), csat: +csat.toFixed(2) });
  }
  return arr;
})();

// Scatter plot: each agent's avg AI score vs avg CSAT
const CSAT_AGENT_SCATTER = [
  { agent:"Maria Dela Cruz", ai:96, csat:4.7, interactions:148, zone:"agree-high" },
  { agent:"Joshua Reyes",    ai:94, csat:4.6, interactions:132, zone:"agree-high" },
  { agent:"Camille Tan",     ai:93, csat:4.5, interactions:115, zone:"agree-high" },
  { agent:"Daniel Soriano",  ai:92, csat:4.3, interactions:140, zone:"agree-high" },
  { agent:"Patricia Lim",    ai:91, csat:4.4, interactions:108, zone:"agree-high" },
  { agent:"Trisha Aquino",   ai:90, csat:4.2, interactions:120, zone:"agree-high" },
  { agent:"Andrea Castillo", ai:90, csat:3.6, interactions:122, zone:"ai-overrated" },  // AI generous
  { agent:"Hannah Cruz",     ai:89, csat:4.3, interactions:101, zone:"agree-high" },
  { agent:"Luis Mercado",    ai:88, csat:4.1, interactions:118, zone:"agree-mid" },
  { agent:"Gabriel Lim",     ai:88, csat:3.4, interactions:107, zone:"ai-overrated" },
  { agent:"Therese Bautista",ai:87, csat:4.4, interactions:97,  zone:"ai-underrated" }, // AI strict
  { agent:"Faye Pascual",    ai:86, csat:4.0, interactions:111, zone:"agree-mid" },
  { agent:"Kenneth Ong",     ai:86, csat:3.5, interactions:104, zone:"ai-overrated" },
  { agent:"Rico Salazar",    ai:85, csat:4.2, interactions:130, zone:"ai-underrated" },
  { agent:"Jonathan Park",   ai:84, csat:3.7, interactions:113, zone:"agree-mid" },
  { agent:"Owen Sandoval",   ai:83, csat:3.4, interactions:100, zone:"agree-mid" },
  { agent:"Reggie Co",       ai:79, csat:3.2, interactions:99,  zone:"agree-low" },
  { agent:"Sofia Mendoza",   ai:79, csat:3.6, interactions:88,  zone:"ai-underrated" },
  { agent:"Enrique Yap",     ai:78, csat:2.9, interactions:102, zone:"agree-low" },
  { agent:"Crystal Domingo", ai:77, csat:3.1, interactions:90,  zone:"agree-low" },
  { agent:"Angela Bautista", ai:75, csat:2.6, interactions:96,  zone:"agree-low" },
  { agent:"Kevin Estrada",   ai:74, csat:2.4, interactions:81,  zone:"agree-low" },
  { agent:"Mark Villanueva", ai:72, csat:2.3, interactions:121, zone:"agree-low" },
];

const CSAT_SUMMARY = {
  correlation: 0.82,        // Pearson r between AI score and CSAT
  aiAvg: 86.4,
  csatAvg: 3.8,
  csatScale: 5,
  trustBand: 6,            // pts of expected variance
  outliers: { aiOverrated: 3, aiUnderrated: 2 },
  trend: "+0.04 CSAT pts per week",
};

// ===== DAY-OF-WEEK × HOUR HEATMAP for Trends =====
// Drives staffing decisions. 7 rows (Sun..Sat) × 24 columns.
const DOW_HEATMAP = (() => {
  const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  const out = [];
  days.forEach((d, di) => {
    const row = [];
    for (let h = 0; h < 24; h++) {
      let v;
      const isWeekend = di === 0 || di === 6;
      const isBusiness = h >= 8 && h <= 20;
      if (isWeekend) v = isBusiness ? 2 + Math.random() * 2 : 0.5 + Math.random();
      else {
        // Weekdays: peak Mon-Tue 9-11AM, lunch dip, second peak 2-5PM, Friday evening spike
        if (h < 7)               v = 0.5 + Math.random() * 0.5;
        else if (h >= 7 && h < 9) v = 2 + Math.random() * 2;
        else if (h >= 9 && h < 12) v = 6 + (di <= 2 ? 2 : 0) + Math.random() * 1.5;
        else if (h === 12)        v = 4 + Math.random();
        else if (h >= 13 && h < 17) v = 7 + Math.random() * 1.5;
        else if (h >= 17 && h < 19) v = 5 + (di === 5 ? 3 : 0) + Math.random();
        else if (h >= 19 && h < 22) v = 3 + Math.random();
        else                       v = 1 + Math.random();
      }
      row.push(Math.min(10, +v.toFixed(1)));
    }
    out.push({ day: d, hours: row });
  });
  return out;
})();

// ===== ANOMALY ANNOTATIONS for Trends channel chart =====
// Auto-detected events overlaid on the line chart with hover narrative.
const TREND_ANOMALIES = [
  { day: 18, channel:"Voice", value:81.0, severity:"drop",     title:"Voice scores fell 4.2 pts",  desc:"NCR delivery delays — sustained for 3 days. Recovered after script v2.1 update on Apr 23." },
  { day: 45, channel:"Chat",  value:91.5, severity:"recovery", title:"Chat scores recovered",       desc:"Avg climbed to 90+ after Tuesday's coaching cycle on tone consistency." },
  { day: 62, channel:"Email", value:91.2, severity:"high",     title:"Email scores hit 90-day high", desc:"Stratified-by-agent sampling caught and corrected a recurring SOP gap." },
];
// Content for the "?" panel on each screen. New users open this to understand
// purpose / who uses it / common actions / jargon. Keep concise.
const SCREEN_HELP = {
  overview: {
    title: "QA Overview",
    purpose: "Daily team-health snapshot. Managers open this first to see how the team performed today vs. recent baselines and what changed.",
    who: "Manager — typically the first screen of the morning. Supervisors also reference it during shift handoffs.",
    actions: [
      "Pick a date range (Today / 7d / 30d / Custom) and watch all metrics scale",
      "Open an agent scorecard by clicking their name in Top Performers or Needs Attention",
      "Read the auto-detected insights in 'What changed today'",
      "Drill into the Reports archive for the email summary",
    ],
    terms: [
      { term: "QA coverage", def: "% of customer interactions that were evaluated by AI. Target is 100% (vs. 1–5% with manual sampling)." },
      { term: "Flag rate", def: "Share of interactions flagged for any quality, compliance, sentiment, or confidence risk." },
      { term: "HITL", def: "Human-in-the-Loop. When the AI's confidence is low or the stakes are high, the system escalates an interaction to a person for review." },
      { term: "AI agents", def: "The 8 services that power evaluation — Content Quality Checker, Sentiment Analysis, AI Message Rating, Random Message Selector, Employee Performance, Operator Rating, HITL Control, Interaction Logging." },
    ],
    related: ["Trends & Analytics", "Reports", "Live Monitoring"],
  },
  live: {
    title: "Live Monitoring",
    purpose: "Watch ongoing customer interactions in real-time. Intervene before a bad call gets worse.",
    who: "Supervisor — kept open on a second monitor during peak hours. Floor leads dip into it from their main view.",
    actions: [
      "Scan the live stream for red borders (Critical risk) and pulsing dots",
      "Open the Active Alerts panel to triage the supervisor queue",
      "Click 'Intervene' to join a live call as supervisor (agent gets notified)",
      "Acknowledge alerts to clear them from your queue without intervening",
    ],
    terms: [
      { term: "Intervene", def: "Supervisor joins a live interaction. The agent is notified the supervisor is now on the call/chat. Logged in the audit trail." },
      { term: "Acknowledge", def: "Mark an alert as seen without taking action. The alert dims but stays in the log." },
      { term: "Sentiment trajectory", def: "10 colored bars showing how customer sentiment shifted across the conversation — green = positive, amber = neutral, red = negative." },
      { term: "Flag intensity heatmap", def: "Hour-by-hour density of flags across the last 24h. Darker = more flags in that hour." },
    ],
    related: ["Review Queue", "AI Response Gating"],
  },
  queue: {
    title: "Review Queue (HITL)",
    purpose: "Where AI escalates interactions that need human judgment. Analysts validate or override AI scores here.",
    who: "QA Analyst — this is their home screen. Most of their day is spent here clearing the queue.",
    actions: [
      "Filter by trigger reason (Compliance, Sentiment, Low confidence, SOP, VIP, Data quality, Workflow failure)",
      "Click any row to open the Interaction Drawer with transcript + AI flags",
      "Agree with AI (validate) or Override the score with feedback",
      "Bulk-validate or reassign by selecting checkboxes",
    ],
    terms: [
      { term: "Trigger reason", def: "Why the AI sent this to HITL — e.g. a compliance violation, frustrated sentiment cluster, or low scoring confidence." },
      { term: "AI confidence", def: "How sure the AI is of its own score. Anything under the cutoff (default 65%) is routed to HITL." },
      { term: "Override", def: "QA analyst sets a different score than the AI proposed. The reason + feedback trains the model." },
      { term: "Validate", def: "QA analyst confirms the AI's score is correct. Also feeds back into model accuracy." },
      { term: "Data quality / Workflow failure", def: "AI couldn't reliably score (partial transcript, low-confidence STT, eval timeout). Score column shows '—'." },
    ],
    related: ["Trends & Analytics — AI–Human agreement"],
  },
  gating: {
    title: "AI Response Gating",
    purpose: "Pre-send evaluation. CQC scores AI-drafted (or AI-assisted) responses before they reach the customer. Supervisor decides on holds.",
    who: "Supervisor — handles escalations the agent didn't self-resolve. Default tab shows the queue.",
    actions: [
      "Decide on held drafts: send AI rewrite, block & ask agent to revise, or send original as override",
      "Watch SLA timers — drafts auto-block when the timer hits zero",
      "Preview the 'Agent view' tab to see what your team sees in their helpdesk",
      "Configure autonomy rules in QA Framework → AI autonomy",
    ],
    terms: [
      { term: "CQC", def: "Content Quality Checker — the AI agent that scores draft quality, tone, SOP adherence, and compliance before send." },
      { term: "Autonomy tier", def: "Tier 1 = AI auto-sends, Tier 2 = supervisor reviews (this screen), Tier 3 = always escalate (compliance, locked)." },
      { term: "Origin", def: "AI-drafted = fully AI-written reply. AI-assisted = agent typed using AI suggestion. Human-typed messages are not pre-evaluated." },
      { term: "SLA fallback", def: "What happens if the SLA timer expires without a decision: block (safe default), send-suggested, or send-original." },
      { term: "Override", def: "Supervisor force-sends the original draft despite the hold. Logged in audit." },
    ],
    related: ["QA Framework — AI autonomy"],
  },
  agents: {
    title: "Agents",
    purpose: "Roster of all human operators with their QA performance. Sortable and filterable.",
    who: "Manager + Supervisor — used to spot trends across the team, find coaching candidates, and reference during 1:1s.",
    actions: [
      "Filter by team, channel, or score range",
      "Sort by any column header",
      "Click an agent to open their scorecard with 30-day trend and coaching plan",
    ],
    terms: [
      { term: "Operator", def: "PRD term for a human BPO agent handling chats / voice calls / emails. They're the people being evaluated by the AI." },
      { term: "Δ 7d", def: "Change in QA score over the last 7 days. Green = improving, red = declining." },
      { term: "Channel mix", def: "Breakdown of how this operator's interaction volume splits across Chat / Voice / Email." },
    ],
    related: ["Trends & Analytics"],
  },
  scorecard: {
    title: "Agent Scorecard",
    purpose: "Deep-dive into a single operator's QA performance — 30-day trend, recurring issues, low-score samples, and the AI's recommended coaching plan.",
    who: "Supervisor — reviews this before a 1:1 or coaching session. Manager — uses it for performance reviews.",
    actions: [
      "Read the 30-day score trend with event annotations (SOP rollout, coaching session)",
      "Identify recurring issues to focus coaching on",
      "Click a low-score sample to open the interaction in context",
      "Export the AI-recommended coaching plan as PDF",
    ],
    terms: [
      { term: "Threshold (80)", def: "Score below 80 = below team standard. Triggers a recommended coaching plan." },
      { term: "Coaching plan", def: "AI-generated recommendations (refresher, pairing with top performer, weekly check-ins) with estimated impact." },
    ],
    related: ["Agents list", "Reports"],
  },
  trends: {
    title: "Trends & Analytics",
    purpose: "Long-horizon view of how QA scores, flag rates, and AI–Human agreement evolve over time.",
    who: "Manager — reviews weekly. Used in QBRs and to justify product / coaching investments.",
    actions: [
      "Compare QA scores across channels over 90 days",
      "See which flag categories are growing (Compliance / Sentiment / Confidence / SOP)",
      "Track sentiment distribution shifts",
      "Validate that the AI is improving via the AI–Human agreement chart",
    ],
    terms: [
      { term: "AI–Human agreement %", def: "Share of AI scores that QA accepted without overriding. Higher = AI is calibrated to QA standards." },
      { term: "Confidence gap", def: "Average gap between AI's confidence and the actual final score. Lower = AI is better at knowing when it's right." },
      { term: "Calibration", def: "How well the AI's confidence matches reality. The chart shows the model getting better-calibrated over time." },
    ],
    related: ["Overview", "Reports"],
  },
  reports: {
    title: "Reports Archive",
    purpose: "Library of daily and weekly QA emails sent automatically to managers. Resend or download any past report.",
    who: "Manager / Supervisor — references after the fact, e.g. 'send me last Tuesday's report'.",
    actions: [
      "Browse archived reports in the left list",
      "Read the email preview in full (renders identical to what recipients received)",
      "Resend to additional recipients",
      "Download as PDF for offline review",
    ],
    terms: [
      { term: "Daily QA summary", def: "Auto-sent every morning at 7 AM PHT. Covers yesterday's evaluations, top issues, agent highlights, and trends." },
      { term: "Weekly cutoff", def: "Sent every Monday. Aggregates the prior week — performance summaries, week-over-week deltas, recurring issues." },
    ],
    related: ["Alerts & Notifications"],
  },
  sampling: {
    title: "QA Sampling",
    purpose: "Configure the Random Message Selector — the AI agent that pulls unbiased samples for QA audits.",
    who: "QA Analyst — picks strategy and cadence. Manager — approves coverage rules.",
    actions: [
      "Pick a sampling strategy (pure random, stratified by channel/agent/risk)",
      "Set sample size as % of daily volume",
      "Configure coverage rules (e.g. min per agent, include all VIP)",
      "Generate samples on-demand or set automatic cadence",
    ],
    terms: [
      { term: "Stratified sampling", def: "Ensures proportional or equal representation across groups (channels, agents, risk levels) — not pure random." },
      { term: "Coverage rule", def: "Floors that override the random pick — e.g. always sample 3 per agent or include all VIP interactions." },
    ],
    related: ["Review Queue"],
  },
  knowledge: {
    title: "Intelligence Center",
    purpose: "Central hub for everything the QA system knows, how it scores, which AI agents are active, and the rules it operates under. Config changes propagate within 60 seconds.",
    who: "QA Lead — owns the rubric. Manager — reviews policy updates. Admin — manages access.",
    actions: [
      "Browse documents by category",
      "Open any document to read the full text + version history",
      "Update a doc — the AI re-scores recent interactions against the new version",
      "See which AI agents referenced each doc (last 30d) and how often",
    ],
    terms: [
      { term: "SOP", def: "Standard Operating Procedure — the documented process an agent should follow for a given scenario (refund, escalation, identity verification, etc.)." },
      { term: "Mapped to", def: "Which scorecard categories a document feeds into. A refund SOP maps to Compliance and SOP Adherence." },
      { term: "References", def: "How many times an AI agent looked up this doc in the last 30 days. High count = critical doc." },
      { term: "Changelog", def: "Version history for the doc. Edits are audit-logged; the AI re-evaluates recent interactions against the new version." },
    ],
    related: ["QA Framework", "Audit Log"],
  },
  framework: {
    title: "QA Framework",
    purpose: "Defines how the AI scores interactions. Edit category weights, thresholds, autonomy levels, and SLA fallback rules.",
    who: "Manager + QA lead — typically set once per account during onboarding, then revisited quarterly.",
    actions: [
      "Drag the QA Posture slider to set everything at once",
      "Apply an industry preset (BPO / Finance / Healthcare / E-commerce / SaaS)",
      "Fine-tune individual category weights, thresholds, autonomy toggles",
      "Add reference examples (good vs. poor) to train the AI",
    ],
    terms: [
      { term: "Posture", def: "A single dial that sets weights, thresholds, and autonomy together. Conservative=more HITL, Aggressive=more AI autonomy." },
      { term: "Drift", def: "When you hand-tune a category after applying a posture, that's drift. Shown in amber. Reapply the posture to reset." },
      { term: "Autonomy", def: "Per-category permission for the AI to auto-send rewrites without human review. Compliance is always off (regulatory)." },
      { term: "Severity floor / Confidence floor", def: "Two gates the AI must clear to auto-resolve: issue severity must be ≤ floor AND model confidence must be ≥ floor." },
      { term: "SLA fallback", def: "What happens when a hold's SLA expires unattended: block (default for Critical/High), send-suggested (Medium/Low), or send-original." },
    ],
    related: ["AI Response Gating"],
  },
  audit: {
    title: "Audit Log",
    purpose: "Immutable record of every evaluation, override, and alert. Required for compliance and regulatory reviews.",
    who: "Manager / Compliance lead — references during audits. QA Analyst — investigates past overrides.",
    actions: [
      "Filter by actor type (AI / Human) and action",
      "Search by actor, action, or target ID",
      "Read 'before → after' deltas on every override",
      "Export as CSV for external compliance review",
    ],
    terms: [
      { term: "Immutable", def: "Audit rows cannot be edited or deleted by any user. Required for regulatory compliance." },
      { term: "AI actor", def: "An action taken by one of the 8 AI agents (CQC, Sentiment, Logging, etc.) — shown with a violet bot pill." },
      { term: "Human actor", def: "An action taken by a person (analyst, supervisor, manager) — shown with a sky-blue person pill plus their IP." },
    ],
    related: ["AI Response Gating", "Review Queue"],
  },
  integrations: {
    title: "Integrations",
    purpose: "Connect QA Monitor to your CRM, telephony, chat, and messaging stack so it can ingest interactions and deliver alerts.",
    who: "Admin — set up during onboarding. Manager — occasionally manages credentials.",
    actions: [
      "Configure each connector (API key, region, sync mode)",
      "Test connection before saving",
      "Monitor sync history for failures",
    ],
    terms: [
      { term: "Primary integration", def: "The CRM that owns interaction data. Zoho CRM is the recommended default (per PRD §9.1)." },
      { term: "Sync mode", def: "Webhook (real-time, recommended), Polling (periodic), or Streaming (event-driven)." },
    ],
    related: [],
  },
  alerts: {
    title: "Alerts & Notifications",
    purpose: "Define what triggers a Slack or email alert. Configure recipients, throttling, and conditions.",
    who: "Manager — sets up team alert rules. Admin — manages workspace-level routing.",
    actions: [
      "Pick a trigger event (compliance flag, sentiment cluster, daily summary, weekly cutoff)",
      "Choose channels (Slack / Email / Webhook / SMS) and recipients",
      "Set throttle to prevent alert fatigue",
      "Send a test alert before saving",
    ],
    terms: [
      { term: "Throttle", def: "Caps how many alerts of a given type can fire per agent per time window. Prevents alert fatigue." },
      { term: "Cadence", def: "How often a digest alert fires (e.g. daily 7AM PHT, weekly Monday 8AM PHT)." },
    ],
    related: ["Reports"],
  },
  team: {
    title: "Team & Permissions",
    purpose: "Invite team members and set their role (QA Analyst / Supervisor / Manager / Admin).",
    who: "Admin — owns this screen. Manager — invites new members on their team.",
    actions: [
      "Invite a member by email",
      "Edit a member's role or team assignment",
      "Review permission scope per role",
    ],
    terms: [
      { term: "Role", def: "Determines what a user can see and do. QA Analyst (validate scores), Supervisor (live monitoring, intervene), Manager (configure), Admin (everything)." },
    ],
    related: ["Audit Log"],
  },
};

const QA_IC_MODULES = [
  { id:'agents',       icon:'bot',      title:'AI Agents',              sub:'8 agents running the evaluation pipeline',       stat:'3,247 evals today · all healthy', tone:'violet' },
  { id:'models',       icon:'sparkle',  title:'Evaluation Models',      sub:'LLMs powering interaction scoring',              stat:'GPT-4o primary · 0.4% fallback',  tone:'amber'  },
  { id:'rubric',       icon:'scale',    title:'QA Rubric & Scoring',    sub:'Weights, thresholds, posture',                   stat:'Balanced · 5 categories',         tone:'blue'   },
  { id:'knowledge',    icon:'reports',  title:'Knowledge Base',         sub:'SOPs and policies AI evaluates against',         stat:'8 docs · 412 refs today',         tone:'green'  },
  { id:'integrations', icon:'plug',     title:'Integrations',           sub:'CRM, telephony, chat, email connectors',        stat:'5 connected · 1 needs attention', tone:'teal'   },
  { id:'alerts',       icon:'bell',     title:'Alert Rules',            sub:'Slack and email notification triggers',          stat:'4 rules · 3 triggered today',     tone:'pink'   },
  { id:'sampling',     icon:'shuffle',  title:'QA Sampling',            sub:'Random Message Selector config',                stat:'8% daily · stratified by channel',tone:'sky'    },
  { id:'compliance',   icon:'shield',   title:'Compliance',             sub:'Regulatory frameworks and data governance',     stat:'PH DPA · GDPR · 0 violations',    tone:'rose'   },
];

// expose globally
Object.assign(window, {
  TODAY_LABEL, WORKSPACES, KPI_HERO, HIGH_RISK_DONUT, CHANNEL_BREAKDOWN, TOP_ISSUES,
  TOP_PERFORMERS, NEEDS_ATTENTION, ALL_AGENTS,
  LIVE_CONVOS, ACTIVE_ALERTS,
  TRIGGER_REASONS, QUEUE_ROWS,
  DETAIL_VOICE,
  AGENT_TREND, AGENT_RECURRING, AGENT_LOWSCORE_SAMPLES, AGENT_ACTIVITY,
  TRENDS_BY_CHANNEL, FLAGS_STACKED, SENTIMENT_STACKED,
  REPORTS_LIST, SAMPLES_HISTORY, ALERT_RULES, INTEGRATIONS, AUDIT_ROWS, TEAM_MEMBERS,
  HEATMAP_24H,
  GATING_STATS, GATING_DRAFTS, GATING_RECENT, AGREEMENT_TREND, FALLBACK_DEFAULTS,
  SCREEN_HELP,
  KB_DOCUMENTS, KB_CATEGORIES, KB_RECENT_USAGE,
  QA_IC_MODULES,
  COACHING_SESSIONS, COACHING_IMPACT,
  CSAT_DAILY, CSAT_AGENT_SCATTER, CSAT_SUMMARY,
  DOW_HEATMAP, TREND_ANOMALIES,
});
