/* global window, React */
// ===== QA Monitor Assistant Chat =====
// Floating chat panel — adapted from telemarketing assistant-chat.jsx
// Proxy handles Anthropic auth; no API key in this file.

const SYSTEM_PROMPT = `You are QA Monitor Assistant, the in-product AI help for PopAI's AI Performance & QA Monitoring System — a BPO platform that automatically evaluates 100% of customer interactions. Be concise, friendly, and concrete. Structure metric answers as short bullet points with a single-sentence takeaway. For how-to questions, give 2 to 4 numbered steps. Keep all responses under 150 words. Never claim to access live data; phrase suggestions as 'based on current config…' or 'typically in setups like this…'.`;

const SUGGESTIONS = [
  { emoji: '📊', label: "Why is the flag rate elevated today?" },
  { emoji: '🔍', label: "How do I override an AI score?" },
  { emoji: '🎯', label: "What does the posture slider control?" },
  { emoji: '🚨', label: "What needs my attention right now?" },
];

const { useState, useEffect, useRef } = React;

const AssistantChat = () => {
  const [open, setOpen]       = useState(false);
  const [msgs, setMsgs]       = useState([]);
  const [input, setInput]     = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef             = useRef(null);

  useEffect(() => {
    if (bottomRef.current) bottomRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [msgs, open]);

  const send = async (text) => {
    const userText = (text || input).trim();
    if (!userText || loading) return;
    setInput('');
    const next = [...msgs, { role: 'user', content: userText }];
    setMsgs(next);
    setLoading(true);
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01',
          'x-api-key': window.ANTHROPIC_API_KEY || '',
        },
        body: JSON.stringify({
          model: 'claude-3-5-haiku-20241022',
          max_tokens: 512,
          system: SYSTEM_PROMPT,
          messages: next.map(m => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      const reply = data?.content?.[0]?.text || 'Sorry, I could not get a response.';
      setMsgs(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch {
      setMsgs(prev => [...prev, { role: 'assistant', content: 'Connection error — please try again.' }]);
    }
    setLoading(false);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  return (
    <>
      {/* FAB */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{ background: 'var(--accent)' }}
        className="asst-fab fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center z-[70] transition-transform hover:scale-105 active:scale-95"
        aria-label="Open QA Assistant"
      >
        {open
          ? <window.I.x className="w-6 h-6 text-white"/>
          : <window.I.bot className="w-6 h-6 text-white"/>
        }
        {!open && msgs.length === 0 && (
          <span className="asst-fab-dot absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full border-2 border-white" style={{ background: 'var(--accent)' }}/>
        )}
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-24 right-6 w-[360px] max-h-[560px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col z-[70] overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 border-b border-slate-100 flex items-start gap-3" style={{ background: 'var(--accent-tint)' }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'var(--accent)' }}>
              <window.I.bot className="w-4 h-4 text-white"/>
            </div>
            <div className="min-w-0">
              <div className="text-[13px] font-semibold text-slate-900">QA Monitor Assistant</div>
              <div className="text-[11px] text-slate-500 leading-snug">Ask me about scores, agents, rubric config, or how to use QA Monitor</div>
            </div>
            <button onClick={() => setOpen(false)} className="ml-auto flex-shrink-0 text-slate-400 hover:text-slate-600 mt-0.5">
              <window.I.x className="w-4 h-4"/>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto scroll-thin px-4 py-3 space-y-3 min-h-0">
            {msgs.length === 0 && (
              <div className="space-y-2 pt-1">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-3">Suggested questions</div>
                {SUGGESTIONS.map(s => (
                  <button key={s.label}
                          onClick={() => send(s.label)}
                          className="w-full text-left px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-[var(--accent-tint)] hover:border-[var(--accent-border)] text-[12px] text-slate-700 transition flex items-center gap-2">
                    <span>{s.emoji}</span>{s.label}
                  </button>
                ))}
              </div>
            )}
            {msgs.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-3 py-2 rounded-xl text-[12px] leading-relaxed whitespace-pre-wrap ${
                  m.role === 'user'
                    ? 'text-white rounded-br-sm'
                    : 'bg-slate-100 text-slate-800 rounded-bl-sm'
                }`}
                  style={m.role === 'user' ? { background: 'var(--accent)' } : {}}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-slate-100 rounded-xl rounded-bl-sm px-3 py-2 flex items-center gap-1.5">
                  {[0,1,2].map(i => (
                    <span key={i} className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }}/>
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef}/>
          </div>

          {/* Input */}
          <div className="px-3 py-3 border-t border-slate-100 flex items-end gap-2">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask anything about QA Monitor…"
              rows={1}
              className="flex-1 resize-none text-[12px] border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[var(--accent)] leading-relaxed max-h-28 overflow-y-auto scroll-thin"
            />
            <button
              onClick={() => send()}
              disabled={!input.trim() || loading}
              style={{ background: 'var(--accent)' }}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white disabled:opacity-40 flex-shrink-0 transition hover:opacity-90">
              <window.I.send className="w-3.5 h-3.5"/>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

window.AssistantChat = AssistantChat;
