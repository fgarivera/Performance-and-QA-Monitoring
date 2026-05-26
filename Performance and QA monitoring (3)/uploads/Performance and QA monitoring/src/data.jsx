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
  { key:"all",        label:"All",                color:"slate",   count:47 },
  { key:"compliance", label:"Compliance",         color:"rose",    count:12 },
  { key:"sentiment",  label:"Negative sentiment", color:"orange",  count:18 },
  { key:"confidence", label:"Low confidence",     color:"violet",  count:9  },
  { key:"sop",        label:"SOP deviation",      color:"amber",   count:5  },
  { key:"vip",        label:"VIP / escalation",   color:"sky",     count:3  },
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
  { name:"Zoho CRM",         status:"Connected",     primary:true,  category:"CRM"      },
  { name:"Slack",            status:"Connected",     primary:false, category:"Messaging"},
  { name:"Twilio (Voice)",   status:"Connected",     primary:false, category:"Telephony"},
  { name:"Zendesk",          status:"Not connected", primary:false, category:"CRM"      },
  { name:"Salesforce",       status:"Not connected", primary:false, category:"CRM"      },
  { name:"Freshdesk",        status:"Error",         primary:false, category:"CRM"      },
  { name:"Microsoft Teams",  status:"Not connected", primary:false, category:"Messaging"},
  { name:"Genesys",          status:"Not connected", primary:false, category:"Telephony"},
  { name:"Intercom",         status:"Not connected", primary:false, category:"Chat"     },
  { name:"Front",            status:"Not connected", primary:false, category:"Email"    },
  { name:"Email (IMAP)",     status:"Connected",     primary:false, category:"Email"    },
  { name:"Webhook (custom)", status:"Connected",     primary:false, category:"Custom"   },
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

// Heatmap data — 24 hours × flag intensity (0-10)
const HEATMAP_24H = Array.from({ length: 24 }, (_, h) => {
  const base = h >= 8 && h <= 20 ? 6 : 2;
  const peak = h === 11 || h === 14 || h === 17 ? 4 : 0;
  return { hour: h, value: Math.max(0, Math.min(10, base + peak + (Math.sin(h / 3) * 1.5))) };
});

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
});
