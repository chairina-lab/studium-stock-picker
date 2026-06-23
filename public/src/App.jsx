import { useState, useRef, useEffect } from "react";

// ── DATA FUNDAMENTAL IDX (estimasi 2024-2025) ─────────────────────────────────
const STOCKS = [
  { code:"BBCA", name:"Bank Central Asia Tbk",          sector:"Keuangan",        price:9200,  change:0.5,   roe:24.1, per:23.8, pbv:5.2,  revenue_growth:12.3, profit_growth:14.6 },
  { code:"BBRI", name:"Bank Rakyat Indonesia Tbk",      sector:"Keuangan",        price:4120,  change:-0.7,  roe:18.9, per:10.2, pbv:2.1,  revenue_growth:10.8, profit_growth:11.2 },
  { code:"BMRI", name:"Bank Mandiri Tbk",               sector:"Keuangan",        price:6350,  change:0.8,   roe:19.4, per:11.5, pbv:2.3,  revenue_growth:14.1, profit_growth:18.7 },
  { code:"TLKM", name:"Telkom Indonesia Tbk",           sector:"Telekomunikasi",  price:2820,  change:-1.2,  roe:16.2, per:15.1, pbv:2.8,  revenue_growth:5.4,  profit_growth:4.9  },
  { code:"ASII", name:"Astra International Tbk",        sector:"Otomotif",        price:5050,  change:1.4,   roe:14.8, per:13.2, pbv:1.8,  revenue_growth:9.6,  profit_growth:11.3 },
  { code:"UNVR", name:"Unilever Indonesia Tbk",         sector:"Konsumer",        price:2100,  change:-0.9,  roe:72.4, per:22.1, pbv:20.1, revenue_growth:-3.2, profit_growth:-5.1 },
  { code:"ICBP", name:"Indofood CBP Tbk",               sector:"Konsumer",        price:10800, change:0.3,   roe:18.3, per:15.4, pbv:3.1,  revenue_growth:8.2,  profit_growth:12.4 },
  { code:"KLBF", name:"Kalbe Farma Tbk",                sector:"Kesehatan",       price:1545,  change:0.6,   roe:17.9, per:18.2, pbv:3.4,  revenue_growth:7.8,  profit_growth:9.3  },
  { code:"GOTO", name:"GoTo Gojek Tokopedia Tbk",       sector:"Teknologi",       price:68,    change:2.9,   roe:-4.2, per:null, pbv:0.8,  revenue_growth:28.4, profit_growth:-8.2 },
  { code:"ADRO", name:"Adaro Energy Indonesia Tbk",     sector:"Energi",          price:2580,  change:1.1,   roe:21.3, per:7.4,  pbv:1.6,  revenue_growth:-6.8, profit_growth:-9.4 },
  { code:"PGAS", name:"Perusahaan Gas Negara Tbk",      sector:"Energi",          price:1455,  change:0.2,   roe:13.6, per:9.8,  pbv:1.4,  revenue_growth:4.2,  profit_growth:6.7  },
  { code:"INDF", name:"Indofood Sukses Makmur Tbk",     sector:"Konsumer",        price:6875,  change:-0.4,  roe:12.4, per:8.9,  pbv:1.1,  revenue_growth:7.1,  profit_growth:10.8 },
  { code:"ANTM", name:"Aneka Tambang Tbk",              sector:"Tambang",         price:1465,  change:1.8,   roe:8.4,  per:14.3, pbv:1.2,  revenue_growth:3.1,  profit_growth:2.8  },
  { code:"PTBA", name:"Bukit Asam Tbk",                 sector:"Tambang",         price:2890,  change:0.7,   roe:24.8, per:7.1,  pbv:1.8,  revenue_growth:-8.2, profit_growth:-11.4},
  { code:"EXCL",  name:"XL Axiata Tbk",                 sector:"Telekomunikasi",  price:2250,  change:-0.6,  roe:6.8,  per:28.4, pbv:1.9,  revenue_growth:6.3,  profit_growth:3.2  },
  { code:"SIDO", name:"Industri Jamu Sido Muncul Tbk",  sector:"Kesehatan",       price:745,   change:0.4,   roe:22.6, per:16.8, pbv:3.9,  revenue_growth:8.9,  profit_growth:12.1 },
  { code:"MAPI", name:"Mitra Adiperkasa Tbk",           sector:"Konsumer",        price:1570,  change:1.3,   roe:16.4, per:14.7, pbv:2.4,  revenue_growth:11.2, profit_growth:15.8 },
  { code:"ACES", name:"Ace Hardware Indonesia Tbk",     sector:"Konsumer",        price:820,   change:0.9,   roe:15.8, per:20.1, pbv:3.2,  revenue_growth:9.4,  profit_growth:10.6 },
  { code:"SMGR", name:"Semen Indonesia Tbk",            sector:"Industri",        price:4120,  change:-1.4,  roe:5.2,  per:22.6, pbv:1.2,  revenue_growth:3.8,  profit_growth:-4.3 },
  { code:"CPIN", name:"Charoen Pokphand Indonesia Tbk", sector:"Konsumer",        price:4980,  change:0.6,   roe:12.9, per:17.3, pbv:2.3,  revenue_growth:6.7,  profit_growth:8.4  },
];

const SECTORS = ["Semua Sektor","Keuangan","Telekomunikasi","Otomotif","Konsumer","Kesehatan","Energi","Tambang","Teknologi","Industri"];

// ── SCORING ───────────────────────────────────────────────────────────────────
function calcScore(s) {
  let score = 50;
  const roe = s.roe ?? 0;
  const per = s.per ?? 99;
  const pbv = s.pbv ?? 10;
  const rg  = s.revenue_growth ?? 0;
  const pg  = s.profit_growth  ?? 0;
  if (roe > 20) score += 18; else if (roe > 15) score += 12; else if (roe > 8) score += 6; else if (roe < 0) score -= 15;
  if (per > 0 && per < 12) score += 14; else if (per > 0 && per < 20) score += 8; else if (per > 0 && per < 30) score += 2; else if (per > 35 || per < 0) score -= 10;
  if (pbv < 1.5) score += 10; else if (pbv < 3) score += 6; else if (pbv < 5) score += 2; else if (pbv > 8) score -= 8;
  if (rg > 20) score += 10; else if (rg > 10) score += 6; else if (rg < 0) score -= 8;
  if (pg > 20) score += 10; else if (pg > 10) score += 6; else if (pg < 0) score -= 10;
  return Math.min(100, Math.max(8, Math.round(score)));
}

function getTag(score) {
  if (score >= 82) return "Top Pick";
  if (score >= 70) return "Growth";
  if (score >= 58) return "Stabil";
  if (score >= 44) return "Pantau";
  return "Perhatian";
}

const TAG_C = {
  "Top Pick":  { bg:"#f97316", text:"#000" },
  "Growth":    { bg:"#16a34a", text:"#fff" },
  "Stabil":    { bg:"#2563eb", text:"#fff" },
  "Pantau":    { bg:"#7c3aed", text:"#fff" },
  "Perhatian": { bg:"#dc2626", text:"#fff" },
};

// ── UI ATOMS ──────────────────────────────────────────────────────────────────
function ScoreRing({ score }) {
  const color = score >= 75 ? "#f97316" : score >= 55 ? "#facc15" : "#6b7280";
  const r = 22, circ = 2 * Math.PI * r, dash = (score / 100) * circ;
  return (
    <div style={{ position:"relative", width:56, height:56, flexShrink:0 }}>
      <svg width="56" height="56" style={{ transform:"rotate(-90deg)" }}>
        <circle cx="28" cy="28" r={r} fill="none" stroke="#1f2937" strokeWidth="4"/>
        <circle cx="28" cy="28" r={r} fill="none" stroke={color} strokeWidth="4"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          style={{ transition:"stroke-dasharray 0.5s ease" }}/>
      </svg>
      <span style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", fontSize:13, fontWeight:700, color }}>{score}</span>
    </div>
  );
}

function TagBadge({ tag }) {
  const c = TAG_C[tag] || { bg:"#374151", text:"#fff" };
  return <span style={{ background:c.bg, color:c.text, fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:99, textTransform:"uppercase", letterSpacing:0.5 }}>{tag}</span>;
}

// ── STOCK CARD ────────────────────────────────────────────────────────────────
function StockCard({ stock, onSelect, isSelected }) {
  const score = calcScore(stock);
  const tag   = getTag(score);
  const fmtPct = v => v != null ? `${v > 0 ? "+" : ""}${v.toFixed(1)}%` : "N/A";
  const fmtX   = v => v != null ? `${v.toFixed(1)}x` : "N/A";

  return (
    <div onClick={() => onSelect(stock)} style={{
      background: isSelected ? "#1c1917" : "#111827",
      border: `1.5px solid ${isSelected ? "#f97316" : "#1f2937"}`,
      borderRadius:12, padding:16, cursor:"pointer",
      transition:"all 0.2s",
      boxShadow: isSelected ? "0 0 0 2px #f9731640" : "none",
    }}>
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
        <ScoreRing score={score}/>
        <div style={{ flex:1 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3 }}>
            <span style={{ fontWeight:800, fontSize:16, color:"#f97316", letterSpacing:1 }}>{stock.code}</span>
            <TagBadge tag={tag}/>
          </div>
          <div style={{ fontSize:11, color:"#6b7280", marginBottom:3 }}>{stock.name}</div>
          <div style={{ fontSize:10, color:"#374151", background:"#1f2937", display:"inline-block", padding:"1px 7px", borderRadius:4 }}>{stock.sector}</div>
        </div>
        <div style={{ textAlign:"right" }}>
          <div style={{ fontWeight:800, fontSize:16, color:"#e5e7eb" }}>Rp {stock.price.toLocaleString("id-ID")}</div>
          <div style={{ fontSize:12, fontWeight:600, color: stock.change >= 0 ? "#4ade80" : "#f87171" }}>
            {stock.change >= 0 ? "▲" : "▼"} {Math.abs(stock.change).toFixed(2)}%
          </div>
        </div>
      </div>
      <div style={{ display:"flex", gap:8 }}>
        {[
          { label:"ROE",          value:`${stock.roe.toFixed(1)}%`,  good: stock.roe > 15 },
          { label:"PER",          value: fmtX(stock.per),            good: stock.per != null && stock.per > 0 && stock.per < 20 },
          { label:"Profit Growth",value: fmtPct(stock.profit_growth),good: stock.profit_growth > 10 },
        ].map(m => (
          <div key={m.label} style={{ flex:1, background:"#1f2937", borderRadius:8, padding:"8px 10px" }}>
            <div style={{ fontSize:10, color:"#6b7280", marginBottom:2 }}>{m.label}</div>
            <div style={{ fontWeight:700, color: m.value==="N/A" ? "#4b5563" : m.good ? "#4ade80" : "#facc15", fontSize:13 }}>{m.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── DETAIL + AI ───────────────────────────────────────────────────────────────
function DetailPanel({ stock, onClose, watchlist, toggleWatch }) {
  const [chat,    setChat]    = useState([]);
  const [input,   setInput]   = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);
  const score  = calcScore(stock);
  const tag    = getTag(score);
  const inWatch = watchlist.includes(stock.code);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior:"smooth" }); }, [chat, loading]);

  const systemCtx = `Kamu adalah AI Analyst saham IDX di aplikasi Studium Stock Picker.
Data saham ${stock.code} — ${stock.name} (${stock.sector}):
• Harga         : Rp ${stock.price.toLocaleString("id-ID")} (${stock.change >= 0 ? "+" : ""}${stock.change.toFixed(2)}% hari ini)
• ROE           : ${stock.roe.toFixed(1)}%
• PER           : ${stock.per != null ? stock.per.toFixed(1)+"x" : "N/A (kemungkinan merugi)"}
• PBV           : ${stock.pbv.toFixed(1)}x
• Revenue Growth: ${stock.revenue_growth.toFixed(1)}%
• Profit Growth : ${stock.profit_growth.toFixed(1)}%
• Skor Growth   : ${score}/100 (${tag})
Jawab singkat, bahasa Indonesia, ramah, mudah dipahami pemula. Jangan rekomendasikan beli/jual secara eksplisit.`;

  async function send() {
    if (!input.trim() || loading) return;
    const userText = input.trim();
    setInput("");
    const newChat = [...chat, { role:"user", content:userText }];
    setChat(newChat);
    setLoading(true);
    try {
      const messages = [
        { role:"user",      content: systemCtx },
        { role:"assistant", content:`Halo! Saya AI Analyst untuk saham ${stock.code}. Silakan tanya apa saja.` },
        ...newChat,
      ];
      const res  = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ model:"claude-sonnet-4-6", max_tokens:1000, messages }),
      });
      const data  = await res.json();
      const reply = data.content?.map(b => b.text || "").join("") || "Maaf, tidak bisa menjawab saat ini.";
      setChat([...newChat, { role:"assistant", content:reply }]);
    } catch {
      setChat([...newChat, { role:"assistant", content:"Koneksi AI bermasalah. Coba lagi ya." }]);
    }
    setLoading(false);
  }

  return (
    <div style={{ position:"fixed", right:0, top:0, height:"100vh", width:340, background:"#0f172a", borderLeft:"1.5px solid #1f2937", overflowY:"auto", zIndex:100, padding:20, boxShadow:"-8px 0 32px #00000080", display:"flex", flexDirection:"column" }}>
      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
        <div>
          <div style={{ fontWeight:800, fontSize:22, color:"#f97316" }}>{stock.code}</div>
          <div style={{ fontSize:11, color:"#6b7280" }}>{stock.name}</div>
        </div>
        <button onClick={onClose} style={{ background:"#1f2937", border:"none", color:"#9ca3af", borderRadius:8, padding:"6px 12px", cursor:"pointer", fontSize:18 }}>✕</button>
      </div>

      {/* Harga */}
      <div style={{ background:"#1f2937", borderRadius:10, padding:"10px 14px", marginBottom:12, display:"flex", justifyContent:"space-between" }}>
        <div>
          <div style={{ fontSize:10, color:"#6b7280" }}>Harga Saham</div>
          <div style={{ fontWeight:800, fontSize:20, color:"#e5e7eb" }}>Rp {stock.price.toLocaleString("id-ID")}</div>
        </div>
        <div style={{ textAlign:"right" }}>
          <div style={{ fontSize:10, color:"#6b7280" }}>Perubahan</div>
          <div style={{ fontWeight:700, color: stock.change >= 0 ? "#4ade80" : "#f87171" }}>
            {stock.change >= 0 ? "▲" : "▼"} {Math.abs(stock.change).toFixed(2)}%
          </div>
        </div>
      </div>

      {/* Skor */}
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:14 }}>
        <ScoreRing score={score}/>
        <div style={{ fontSize:12, color:"#9ca3af", lineHeight:1.6, flex:1 }}>
          {score >= 75 ? "Fundamental growth cukup kuat. Layak dicermati lebih dalam."
          : score >= 55 ? "Fundamental cukup baik. Pantau perkembangannya."
          : "Ada indikator yang perlu diperhatikan sebelum masuk."}
        </div>
      </div>

      {/* Metrik */}
      <div style={{ marginBottom:14 }}>
        <div style={{ fontSize:11, color:"#6b7280", fontWeight:600, marginBottom:8, textTransform:"uppercase", letterSpacing:1 }}>Fundamental</div>
        {[
          { label:"ROE",            value:`${stock.roe.toFixed(1)}%`,                                  good: stock.roe > 15,                              info:"Efisiensi laba dari modal. Idealnya >15%." },
          { label:"PER",            value: stock.per != null ? `${stock.per.toFixed(1)}x` : "N/A",    good: stock.per != null && stock.per > 0 && stock.per < 20, info:"Valuasi vs laba. Idealnya <20x." },
          { label:"PBV",            value:`${stock.pbv.toFixed(1)}x`,                                  good: stock.pbv < 3,                               info:"Harga vs nilai buku. Idealnya <3x." },
          { label:"Revenue Growth", value:`${stock.revenue_growth > 0 ? "+" : ""}${stock.revenue_growth.toFixed(1)}%`, good: stock.revenue_growth > 10,  info:"Pertumbuhan pendapatan. Idealnya >10%." },
          { label:"Profit Growth",  value:`${stock.profit_growth  > 0 ? "+" : ""}${stock.profit_growth.toFixed(1)}%`,  good: stock.profit_growth  > 10,  info:"Pertumbuhan laba. Idealnya >10%." },
        ].map(m => (
          <div key={m.label} style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", padding:"6px 0", borderBottom:"1px solid #1f2937" }}>
            <div>
              <div style={{ color:"#9ca3af", fontSize:12 }}>{m.label}</div>
              <div style={{ color:"#374151", fontSize:10 }}>{m.info}</div>
            </div>
            <span style={{ fontWeight:700, fontSize:13, color: m.value==="N/A" ? "#4b5563" : m.good ? "#4ade80" : "#facc15", marginTop:2 }}>{m.value}</span>
          </div>
        ))}
      </div>

      {/* Watchlist button */}
      <button onClick={() => toggleWatch(stock.code)} style={{
        width:"100%", background: inWatch ? "#1f2937" : "#f97316",
        color: inWatch ? "#f97316" : "#000", fontWeight:800,
        border: inWatch ? "1.5px solid #f97316" : "none",
        borderRadius:10, padding:"10px", fontSize:13, cursor:"pointer", marginBottom:14,
      }}>
        {inWatch ? "✓ Ada di Watchlist" : "+ Tambah ke Watchlist"}
      </button>

      {/* AI Chat */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", background:"#111827", borderRadius:12, padding:14, minHeight:200 }}>
        <div style={{ fontSize:12, fontWeight:700, color:"#f97316", marginBottom:10 }}>🤖 Tanya AI Analyst</div>
        {chat.length === 0 && (
          <div style={{ fontSize:11, color:"#4b5563", marginBottom:10, lineHeight:1.8 }}>
            Contoh pertanyaan:<br/>
            • "Apakah saham ini murah?"<br/>
            • "Apa risiko investasi di sini?"<br/>
            • "Jelaskan ROE saham ini"
          </div>
        )}
        <div style={{ flex:1, overflowY:"auto", display:"flex", flexDirection:"column", gap:8, marginBottom:10, maxHeight:220 }}>
          {chat.map((m, i) => (
            <div key={i} style={{
              alignSelf: m.role === "user" ? "flex-end" : "flex-start",
              background: m.role === "user" ? "#f97316" : "#1f2937",
              color: m.role === "user" ? "#000" : "#e5e7eb",
              borderRadius:10, padding:"8px 12px", fontSize:12, maxWidth:"92%", lineHeight:1.6,
            }}>{m.content}</div>
          ))}
          {loading && <div style={{ alignSelf:"flex-start", background:"#1f2937", color:"#6b7280", borderRadius:10, padding:"8px 12px", fontSize:12 }}>Sedang menganalisis...</div>}
          <div ref={endRef}/>
        </div>
        <div style={{ display:"flex", gap:6 }}>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()}
            placeholder="Tanya tentang saham ini..."
            style={{ flex:1, background:"#1f2937", border:"1px solid #374151", borderRadius:8, padding:"8px 10px", color:"#e5e7eb", fontSize:12, outline:"none" }}/>
          <button onClick={send} disabled={loading || !input.trim()} style={{
            background: input.trim() ? "#f97316" : "#1f2937",
            color: input.trim() ? "#000" : "#6b7280",
            border:"none", borderRadius:8, padding:"8px 12px", cursor:"pointer", fontWeight:700, fontSize:14,
          }}>→</button>
        </div>
      </div>
    </div>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const [sector,   setSector]   = useState("Semua Sektor");
  const [sortBy,   setSortBy]   = useState("score");
  const [search,   setSearch]   = useState("");
  const [selected, setSelected] = useState(null);
  const [watchlist,setWatchlist]= useState([]);
  const [tab,      setTab]      = useState("screener");

  const toggleWatch = code => setWatchlist(prev => prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]);

  const scored = STOCKS.map(s => ({ ...s, score: calcScore(s) }));

  const filtered = scored
    .filter(s => sector === "Semua Sektor" || s.sector === sector)
    .filter(s => s.code.includes(search.toUpperCase()) || s.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "score")  return b.score  - a.score;
      if (sortBy === "roe")    return b.roe     - a.roe;
      if (sortBy === "per")    return (a.per ?? 999) - (b.per ?? 999);
      if (sortBy === "growth") return b.profit_growth - a.profit_growth;
      return 0;
    });

  const watched = scored.filter(s => watchlist.includes(s.code));
  const topPick = scored.reduce((a, b) => a.score > b.score ? a : b, scored[0]);

  return (
    <div style={{ minHeight:"100vh", background:"#030712", fontFamily:"'Inter','Segoe UI',sans-serif", color:"#e5e7eb" }}>

      {/* Header */}
      <div style={{ background:"#0f172a", borderBottom:"1px solid #1f2937", padding:"0 24px" }}>
        <div style={{ maxWidth:900, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between", height:56 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:32, height:32, background:"linear-gradient(135deg,#f97316,#ea580c)", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, fontSize:16, color:"#000" }}>S</div>
            <div>
              <div style={{ fontWeight:800, fontSize:15, color:"#f97316", letterSpacing:0.5 }}>STUDIUM</div>
              <div style={{ fontSize:9, color:"#6b7280", letterSpacing:2, marginTop:-2 }}>STOCK PICKER</div>
            </div>
          </div>
          <nav style={{ display:"flex", gap:4 }}>
            {["screener","watchlist","belajar"].map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                background: tab === t ? "#f97316" : "transparent",
                color: tab === t ? "#000" : "#6b7280",
                border:"none", borderRadius:8, padding:"6px 14px",
                fontWeight:700, fontSize:12, cursor:"pointer",
              }}>
                {t === "screener" ? "📊 Screener" : t === "watchlist" ? `⭐ Watchlist${watchlist.length ? ` (${watchlist.length})` : ""}` : "📚 Belajar"}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div style={{ maxWidth:900, margin:"0 auto", padding:"20px 24px" }}>

        {/* SCREENER */}
        {tab === "screener" && (
          <>
            {/* Stats */}
            <div style={{ display:"flex", gap:12, marginBottom:20 }}>
              {[
                { label:"Total Emiten",    value: STOCKS.length,        icon:"🏢" },
                { label:"Top Pick Hari Ini",value: topPick?.code || "-", icon:"🏆" },
                { label:"Di Watchlist",    value: watchlist.length,      icon:"⭐" },
              ].map(s => (
                <div key={s.label} style={{ flex:1, background:"#111827", border:"1px solid #1f2937", borderRadius:10, padding:"12px 16px" }}>
                  <div style={{ fontSize:10, color:"#6b7280", marginBottom:4 }}>{s.icon} {s.label}</div>
                  <div style={{ fontWeight:800, fontSize:22, color:"#f97316" }}>{s.value}</div>
                </div>
              ))}
            </div>

            {/* Filter */}
            <div style={{ display:"flex", gap:10, marginBottom:16, flexWrap:"wrap" }}>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Cari kode / nama emiten..."
                style={{ flex:1, minWidth:160, background:"#111827", border:"1px solid #1f2937", borderRadius:8, padding:"8px 12px", color:"#e5e7eb", fontSize:13, outline:"none" }}/>
              <select value={sector} onChange={e => setSector(e.target.value)}
                style={{ background:"#111827", border:"1px solid #1f2937", borderRadius:8, padding:"8px 12px", color:"#e5e7eb", fontSize:13, cursor:"pointer" }}>
                {SECTORS.map(s => <option key={s}>{s}</option>)}
              </select>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                style={{ background:"#111827", border:"1px solid #1f2937", borderRadius:8, padding:"8px 12px", color:"#e5e7eb", fontSize:13, cursor:"pointer" }}>
                <option value="score">Skor Tertinggi</option>
                <option value="roe">ROE Tertinggi</option>
                <option value="per">PER Terendah</option>
                <option value="growth">Profit Growth Tertinggi</option>
              </select>
            </div>

            {/* List */}
            <div style={{ display:"flex", flexDirection:"column", gap:12, paddingRight: selected ? 360 : 0, transition:"padding 0.3s" }}>
              {filtered.map(s => (
                <StockCard key={s.code} stock={s}
                  onSelect={s => setSelected(prev => prev?.code === s.code ? null : s)}
                  isSelected={selected?.code === s.code}/>
              ))}
              {filtered.length === 0 && (
                <div style={{ textAlign:"center", color:"#6b7280", padding:48, fontSize:14 }}>Tidak ada emiten yang sesuai filter.</div>
              )}
            </div>
          </>
        )}

        {/* WATCHLIST */}
        {tab === "watchlist" && (
          watched.length === 0
          ? <div style={{ textAlign:"center", color:"#6b7280", padding:80 }}>
              <div style={{ fontSize:48, marginBottom:16 }}>⭐</div>
              <div style={{ fontWeight:700, fontSize:18, color:"#e5e7eb", marginBottom:8 }}>Watchlist Kosong</div>
              <div style={{ fontSize:14 }}>Buka Screener → klik saham → klik "+ Tambah ke Watchlist"</div>
            </div>
          : <div style={{ display:"flex", flexDirection:"column", gap:12, paddingRight: selected ? 360 : 0 }}>
              {watched.map(s => (
                <StockCard key={s.code} stock={s}
                  onSelect={s => setSelected(prev => prev?.code === s.code ? null : s)}
                  isSelected={selected?.code === s.code}/>
              ))}
            </div>
        )}

        {/* BELAJAR */}
        {tab === "belajar" && (
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            <div style={{ fontWeight:700, fontSize:16, color:"#f97316", marginBottom:4 }}>📚 Panduan Saham Growth untuk Pemula</div>
            {[
              { term:"Saham Growth itu apa?",     def:"Saham perusahaan yang laba dan pendapatannya tumbuh lebih cepat dari rata-rata. Cocok investasi jangka panjang 3–10 tahun." },
              { term:"ROE (Return on Equity)",    def:"Seberapa efisien perusahaan menghasilkan laba dari modal sendiri. Di atas 15% bagus, di atas 20% sangat bagus." },
              { term:"PER (Price to Earnings)",   def:"Harga saham dibagi laba per lembar. Makin kecil makin 'murah'. Di bawah 20x umumnya wajar. Jika N/A berarti perusahaan sedang merugi." },
              { term:"PBV (Price to Book Value)", def:"Harga saham dibagi nilai buku aset. Di bawah 1x sangat murah, 1–3x wajar, di atas 5x artinya pasar sangat optimis." },
              { term:"Revenue & Profit Growth",   def:"Pertumbuhan pendapatan dan laba tahunan. Untuk saham growth idealnya keduanya di atas 10%. Profit growth lebih penting dari revenue growth." },
              { term:"Skor Growth Studium",       def:"Nilai 0–100 dari kombinasi semua indikator. ≥82: Top Pick 🔥 | 70–81: Growth ✅ | 58–69: Stabil 🔵 | 44–57: Pantau 🟣 | <44: Perhatian 🔴" },
              { term:"Tips: Gunakan AI Analyst",  def:"Klik saham mana saja → panel detail muncul → tanya AI Analyst dalam Bahasa Indonesia. Cocok untuk pemula yang ingin memahami data lebih dalam." },
              { term:"Disclaimer penting",        def:"Data di Studium adalah estimasi untuk edukasi. Selalu verifikasi di sumber resmi (IDX, Stockbit) sebelum membuat keputusan investasi." },
            ].map(item => (
              <div key={item.term} style={{ background:"#111827", border:"1px solid #1f2937", borderRadius:10, padding:"14px 16px" }}>
                <div style={{ fontWeight:700, color:"#f97316", fontSize:14, marginBottom:4 }}>{item.term}</div>
                <div style={{ fontSize:13, color:"#9ca3af", lineHeight:1.7 }}>{item.def}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selected && (
        <DetailPanel
          stock={scored.find(s => s.code === selected.code) || selected}
          onClose={() => setSelected(null)}
          watchlist={watchlist}
          toggleWatch={toggleWatch}
        />
      )}
    </div>
  );
}
