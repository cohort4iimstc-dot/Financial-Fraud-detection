import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";

const STEPS = [
  "Loading transaction record",
  "Extracting PCA feature vectors",
  "Normalising amount & time fields",
  "Running random forest model",
  "Calculating fraud probability",
  "Generating verdict",
];

const STEP_MS  = 280;
const REVEAL   = STEPS.length * STEP_MS + 500;

const fraudC = { bg:"#FCEBEB", border:"#F09595", text:"#A32D2D", fill:"#E24B4A" };
const legitC = { bg:"#EAF3DE", border:"#C0DD97", text:"#3B6D11", fill:"#639922" };

// ─── circle radar ─────────────────────────────────────────────────────────────
function RadarScanner({ done, isFraud }) {
  const accent = done ? (isFraud ? "#E24B4A" : "#639922") : "#378ADD";
  return (
    <div style={{ position:"relative", width:120, height:120, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
      {/* outer dashed ring */}
      <div style={{
        position:"absolute", width:120, height:120, borderRadius:"50%",
        border:"1.5px dashed var(--color-border-secondary)",
        animation:"spin1 4s linear infinite",
      }} />
      {/* mid ring — accent colour on two sides */}
      <div style={{
        position:"absolute", width:84, height:84, borderRadius:"50%",
        border:"1.5px solid var(--color-border-secondary)",
        borderTopColor: accent, borderRightColor: accent,
        animation:"spin2 2.8s linear infinite",
        transition:"border-color 0.6s",
      }} />
      {/* inner ring */}
      <div style={{
        position:"absolute", width:52, height:52, borderRadius:"50%",
        border:"1.5px solid var(--color-border-tertiary)",
        borderBottomColor: accent,
        animation:"spin3 1.8s linear infinite",
        transition:"border-color 0.6s",
      }} />
      {/* ripple rings */}
      <div style={{ position:"absolute", width:26, height:26, borderRadius:"50%", border:`1.5px solid ${accent}`, animation:"rippleOut 2s ease-out infinite", opacity:0.5, transition:"border-color 0.6s" }} />
      <div style={{ position:"absolute", width:26, height:26, borderRadius:"50%", border:`1.5px solid ${accent}`, animation:"rippleOut 2s ease-out 0.7s infinite", opacity:0.5, transition:"border-color 0.6s" }} />
      {/* core */}
      <div style={{
        width:26, height:26, borderRadius:"50%", zIndex:2,
        background:"var(--color-background-secondary)",
        border:"1.5px solid var(--color-border-secondary)",
        display:"flex", alignItems:"center", justifyContent:"center",
        animation: done ? "none" : "pulseCore 1.6s ease-in-out infinite",
      }}>
        <div style={{ width:8, height:8, borderRadius:"50%", background:accent, transition:"background 0.6s" }} />
      </div>
    </div>
  );
}

// ─── step row ─────────────────────────────────────────────────────────────────
function StepRow({ label, state }) {
  const dotBorderColor = state==="done" ? "#639922" : state==="active" ? "#378ADD" : "#ccc";
  const dotBg          = state==="done" ? "#EAF3DE" : state==="active" ? "#E6F1FB" : "transparent";
  return (
    <div style={{
      display:"flex", alignItems:"center", gap:9, fontSize:13,
      color: state==="pending" ? "var(--color-text-tertiary)" : "var(--color-text-primary)",
      opacity: state==="pending" ? 0.38 : 1,
      transition:"opacity 0.3s, color 0.3s",
    }}>
      <div style={{
        width:7, height:7, borderRadius:"50%", flexShrink:0,
        border:`1.5px solid ${dotBorderColor}`,
        background: dotBg,
        transition:"background 0.3s, border-color 0.3s",
        animation: state==="active" ? "blinkDot 1s infinite" : "none",
      }} />
      <span>{label}</span>
    </div>
  );
}

// ─── info cell ────────────────────────────────────────────────────────────────
function InfoCell({ label, value, sub, valueColor }) {
  return (
    <div style={{ padding:"14px 18px", background:"var(--color-background-primary)" }}>
      <div style={{ fontSize:11, color:"var(--color-text-tertiary)", fontFamily:"var(--font-mono)", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:5 }}>{label}</div>
      <div style={{ fontSize:15, fontWeight:500, color: valueColor || "var(--color-text-primary)" }}>{value}</div>
      {sub && <div style={{ fontSize:11, color:"var(--color-text-secondary)", fontFamily:"var(--font-mono)", marginTop:2 }}>{sub}</div>}
    </div>
  );
}

// ─── feature cell ─────────────────────────────────────────────────────────────
function FeatCell({ name, value }) {
  const display = (value !== undefined && value !== null) ? Number(value).toFixed(4) : "—";
  return (
    <div style={{ background:"var(--color-background-secondary)", borderRadius:"var(--border-radius-md)", padding:"8px 10px" }}>
      <div style={{ fontSize:10, fontFamily:"var(--font-mono)", color:"var(--color-text-tertiary)", textTransform:"uppercase" }}>{name}</div>
      <div style={{ fontSize:12, fontFamily:"var(--font-mono)", color:"var(--color-text-secondary)", marginTop:2, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{display}</div>
    </div>
  );
}

// ─── prob bar ─────────────────────────────────────────────────────────────────
function ProbBar({ pct, fill }) {
  const [width, setWidth] = useState(0);
  useEffect(() => { const t = setTimeout(() => setWidth(pct), 400); return () => clearTimeout(t); }, [pct]);
  return (
    <div style={{ height:6, background:"var(--color-background-secondary)", borderRadius:999, overflow:"hidden", border:"0.5px solid var(--color-border-tertiary)" }}>
      <div style={{ height:"100%", borderRadius:999, background:fill, width:`${width}%`, transition:"width 1.2s cubic-bezier(0.4,0,0.2,1)" }} />
    </div>
  );
}

// ─── main ─────────────────────────────────────────────────────────────────────
export default function InvestigatePage() {
  const { id }    = useParams();
  const navigate  = useNavigate();

  const [data,       setData]       = useState(null);
  const [stepStates, setStepStates] = useState(STEPS.map(() => "pending"));
  const [revealed,   setRevealed]   = useState(false);

  // fetch
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`http://localhost:8000/transaction/${id}`);
        if (!res.ok) throw new Error();
        setData(await res.json());
      } catch {
        // mock — remove once backend /transaction/:id is live
        setData({
          transaction_id: id || 284719,
          amount: 12849.0,
          created_at: new Date().toISOString(),
          predicted_class: 1,
          fraud_probability: 0.874,
          model_name: "random_forest",
          actual_class: 1,
          split_set: "test",
          v1:-1.3598, v2:0.0854, v3:1.9073, v4:0.2326,
          v5:-0.6795, v6:-0.3282, v7:-0.7336, v8:0.0899,
        });
      }
    }
    load();
  }, [id]);

  // scanning steps
  useEffect(() => {
    const timers = STEPS.map((_, i) =>
      setTimeout(() => {
        setStepStates(prev => prev.map((s, j) =>
          j < i ? "done" : j === i ? "active" : s
        ));
      }, i * STEP_MS + 200)
    );
    const revealTimer = setTimeout(() => {
      setStepStates(STEPS.map(() => "done"));
      setRevealed(true);
    }, REVEAL);
    return () => { timers.forEach(clearTimeout); clearTimeout(revealTimer); };
  }, []);

  const isFraud  = data?.predicted_class === 1;
  const vc       = isFraud ? fraudC : legitC;
  const dateObj  = new Date(data?.created_at || Date.now());
  const dateStr  = dateObj.toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" });
  const timeStr  = dateObj.toLocaleTimeString("en-IN");
  const txnLabel = `TXN-${String(data?.transaction_id || 0).padStart(6, "0")}`;
  const prob     = ((data?.fraud_probability || 0) * 100).toFixed(1);
  const amount   = new Intl.NumberFormat("en-IN", { style:"currency", currency:"INR" }).format(data?.amount || 0);

  return (
    <>
      <style>{`
        @keyframes spin1     { to { transform: rotate(360deg); } }
        @keyframes spin2     { to { transform: rotate(-360deg); } }
        @keyframes spin3     { to { transform: rotate(360deg); } }
        @keyframes pulseCore { 0%,100%{transform:scale(1)} 50%{transform:scale(1.14)} }
        @keyframes rippleOut { 0%{transform:scale(1);opacity:0.5} 100%{transform:scale(2.4);opacity:0} }
        @keyframes blinkDot  { 0%,100%{opacity:1} 50%{opacity:0.15} }
        @keyframes fadeUp    { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        .fu  { animation: fadeUp 0.5s ease forwards; }
        .fu2 { animation: fadeUp 0.5s 0.15s ease forwards; opacity:0; }
        .fu3 { animation: fadeUp 0.5s 0.3s ease forwards; opacity:0; }
      `}</style>

      <div style={{ background:"var(--color-background-primary)", minHeight:"100vh", fontFamily:"var(--font-sans)", color:"var(--color-text-primary)", paddingBottom:36 }}>

        {/* topbar */}
        <div style={{ display:"flex", alignItems:"center", gap:10, padding:"14px 24px", borderBottom:"0.5px solid var(--color-border-tertiary)" }}>
          <button onClick={() => navigate(-1)} style={{ fontSize:13, color:"var(--color-text-secondary)", cursor:"pointer", padding:"4px 10px", borderRadius:"var(--border-radius-md)", border:"0.5px solid var(--color-border-secondary)", background:"transparent", fontFamily:"var(--font-mono)" }}>
            ← Back
          </button>
          <span style={{ fontSize:13, color:"var(--color-text-tertiary)", fontFamily:"var(--font-mono)" }}>Investigation /</span>
          <span style={{ fontSize:13, color:"var(--color-text-info)", fontFamily:"var(--font-mono)" }}>{txnLabel}</span>
        </div>

        {/* scan zone */}
        <div style={{ margin:"24px 24px 0", border:"0.5px solid var(--color-border-tertiary)", borderRadius:"var(--border-radius-lg)", overflow:"hidden" }}>
          <div style={{ padding:"14px 18px", borderBottom:"0.5px solid var(--color-border-tertiary)", background:"var(--color-background-secondary)", display:"flex", alignItems:"center", gap:10 }}>
            {revealed ? (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="5.5" stroke="#639922" strokeWidth="1.2"/>
                <path d="M3.5 7L6 9.5L10.5 4.5" stroke="#639922" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ animation:"spin1 1.2s linear infinite" }}>
                <circle cx="7" cy="7" r="5.5" stroke="var(--color-border-secondary)" strokeWidth="1.2"/>
                <path d="M7 1.5A5.5 5.5 0 0112.5 7" stroke="#378ADD" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
            )}
            <span style={{ fontSize:13, fontWeight:500 }}>{revealed ? "Scan complete" : "Scanning transaction…"}</span>
            <span style={{ marginLeft:"auto", fontSize:12, color:"var(--color-text-secondary)", fontFamily:"var(--font-mono)" }}>
              {revealed ? "Verdict ready" : "Analysing 28 features"}
            </span>
          </div>

          <div style={{ padding:"24px 18px 20px", display:"flex", alignItems:"center", gap:28 }}>
            <RadarScanner done={revealed} isFraud={isFraud} />
            <div style={{ display:"flex", flexDirection:"column", gap:9, flex:1 }}>
              {STEPS.map((s, i) => <StepRow key={i} label={s} state={stepStates[i]} />)}
            </div>
          </div>
        </div>

        {/* verdict */}
        {revealed && (
          <div className="fu" style={{ margin:"14px 24px 0", border:`0.5px solid ${vc.border}`, borderRadius:"var(--border-radius-lg)", overflow:"hidden" }}>
            <div style={{ display:"flex", alignItems:"center", gap:14, padding:"20px", background:vc.bg }}>
              <div style={{ position:"relative", width:52, height:52, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <div style={{ position:"absolute", inset:0, borderRadius:"50%", border:`1.5px solid ${vc.fill}`, animation:"rippleOut 2s ease-out infinite", opacity:0.5 }} />
                <div style={{ position:"absolute", inset:0, borderRadius:"50%", border:`1.5px solid ${vc.fill}`, animation:"rippleOut 2s ease-out 0.8s infinite", opacity:0.5 }} />
                <div style={{ width:40, height:40, borderRadius:"50%", background:vc.fill, display:"flex", alignItems:"center", justifyContent:"center", position:"relative", zIndex:1 }}>
                  {isFraud
                    ? <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5 5L15 15M15 5L5 15" stroke="white" strokeWidth="2.2" strokeLinecap="round"/></svg>
                    : <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 10L8.5 14.5L16 6" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  }
                </div>
              </div>
              <div>
                <div style={{ fontSize:18, fontWeight:500, color:vc.text }}>{isFraud ? "Fraudulent transaction" : "Legitimate transaction"}</div>
                <div style={{ fontSize:12, color:"var(--color-text-secondary)", fontFamily:"var(--font-mono)", marginTop:3 }}>
                  {txnLabel} · {data?.model_name} · {new Date().toLocaleTimeString("en-IN")}
                </div>
              </div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:1, background:"var(--color-border-tertiary)", borderTop:"0.5px solid var(--color-border-tertiary)" }}>
              <InfoCell label="Amount"       value={amount}    sub="INR · Credit card" />
              <InfoCell label="Date & time"  value={dateStr}   sub={timeStr} />
              <InfoCell label="Location"     value="Bengaluru" sub="Karnataka, IN · 12.97°N 77.59°E" />
              <InfoCell label="Actual class" value={isFraud ? "Fraud (1)" : "Legit (0)"} sub={`split: ${data?.split_set}`} valueColor={vc.text} />
            </div>
          </div>
        )}

        {/* probability */}
        {revealed && (
          <div className="fu2" style={{ margin:"14px 24px 0", border:"0.5px solid var(--color-border-tertiary)", borderRadius:"var(--border-radius-lg)", padding:"16px 18px" }}>
            <div style={{ fontSize:11, color:"var(--color-text-tertiary)", fontFamily:"var(--font-mono)", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:12 }}>
              Fraud probability
            </div>
            <div style={{ display:"flex", alignItems:"baseline", gap:8, marginBottom:10 }}>
              <span style={{ fontSize:26, fontWeight:500, fontFamily:"var(--font-mono)", color:vc.text }}>{prob}%</span>
              <span style={{ fontSize:12, color:"var(--color-text-secondary)" }}>confidence score</span>
            </div>
            <ProbBar pct={parseFloat(prob)} fill={vc.fill} />
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, fontFamily:"var(--font-mono)", color:"var(--color-text-tertiary)", marginTop:6 }}>
              <span>0 — safe</span><span>threshold 50%</span><span>100 — certain fraud</span>
            </div>
          </div>
        )}

        {/* features */}
        {revealed && (
          <div className="fu3" style={{ margin:"14px 24px 0", border:"0.5px solid var(--color-border-tertiary)", borderRadius:"var(--border-radius-lg)", padding:"16px 18px" }}>
            <div style={{ fontSize:11, color:"var(--color-text-tertiary)", fontFamily:"var(--font-mono)", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:12 }}>
              PCA feature sample (V1 – V8)
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,minmax(0,1fr))", gap:8 }}>
              {Array.from({ length:8 }, (_, i) => `v${i+1}`).map(k => (
                <FeatCell key={k} name={k.toUpperCase()} value={data?.[k]} />
              ))}
            </div>
          </div>
        )}

      </div>
    </>
  );
}
