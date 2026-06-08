"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Play, Pause, RotateCcw, ChevronRight, Beaker } from "lucide-react";
import { ExperimentShell } from "./ExperimentShell";
import { cn } from "@/lib/utils";

type Step =
  | "weigh"
  | "transfer"
  | "dissolve"
  | "indicator"
  | "fill-burette"
  | "initial-reading"
  | "titrate"
  | "final-reading"
  | "calculate"
  | "done";

const PROCEDURE: { id: Step; label: string; tip: string }[] = [
  { id: "weigh", label: "Weigh Na₂CO₃", tip: "Take ~0.15 g of anhydrous Na₂CO₃ on the analytical balance." },
  { id: "transfer", label: "Transfer to flask", tip: "Carefully transfer the weighed Na₂CO₃ into the conical flask." },
  { id: "dissolve", label: "Dissolve in water", tip: "Add ~25 mL of distilled water and swirl until fully dissolved." },
  { id: "indicator", label: "Add methyl orange", tip: "Add 2–3 drops of methyl orange. The solution turns yellow (basic)." },
  { id: "fill-burette", label: "Fill burette with HCl", tip: "Fill the burette to the 0.00 mL mark with the HCl solution." },
  { id: "initial-reading", label: "Record initial reading", tip: "Note the initial burette reading at the bottom of the meniscus." },
  { id: "titrate", label: "Perform titration", tip: "Open the stopcock. Add HCl with swirling until the colour just changes to permanent pink/orange." },
  { id: "final-reading", label: "Record final reading", tip: "At the endpoint, close the stopcock and note the final reading." },
  { id: "calculate", label: "Calculate molarity", tip: "Use the formula M = (mass / 106) × 2 ÷ (volume/1000) to find [HCl]." },
];

const NA2CO3_MOLAR_MASS = 106;
const TRUE_HCl_MOLARITY = 0.1;
const BURETTE_CAPACITY = 50;

function randomMass() {
  // Between 0.1300 and 0.1700 g — clinically realistic for the experiment
  return Math.round((0.13 + Math.random() * 0.04) * 10000) / 10000;
}

export function TitrationSim() {
  const [step, setStep] = useState<Step>("weigh");
  const [mass, setMass] = useState<number>(() => randomMass());
  const [hasWater, setHasWater] = useState(false);
  const [hasIndicator, setHasIndicator] = useState(false);
  const [hasNa2CO3, setHasNa2CO3] = useState(false);
  const [buretteVolume, setBuretteVolume] = useState(0); // mL of HCl currently in burette
  const [hclAdded, setHclAdded] = useState(0); // mL added from burette
  const [initialReading, setInitialReading] = useState<number | null>(null);
  const [finalReading, setFinalReading] = useState<number | null>(null);
  const [stopcockOpen, setStopcockOpen] = useState(false);
  const [flowRate, setFlowRate] = useState<"normal" | "drop">("normal");
  const tickRef = useRef<number | null>(null);

  const endpointVolume = useMemo(() => {
    return (mass / NA2CO3_MOLAR_MASS) * 2 / TRUE_HCl_MOLARITY * 1000;
  }, [mass]);

  // Auto-flow when stopcock open during titration
  useEffect(() => {
    if (step !== "titrate" || !stopcockOpen) return;
    const interval = window.setInterval(() => {
      setHclAdded((prev) => {
        const increment = flowRate === "normal" ? 0.4 : 0.04;
        const next = prev + increment;
        return Math.min(next, BURETTE_CAPACITY);
      });
    }, 100);
    tickRef.current = interval;
    return () => window.clearInterval(interval);
  }, [step, stopcockOpen, flowRate]);

  const completedSteps = useMemo(() => {
    const order = PROCEDURE.map((p) => p.id);
    const idx = order.indexOf(step);
    return new Set(order.slice(0, idx));
  }, [step]);

  // Solution color logic
  const ratio = endpointVolume > 0 ? hclAdded / endpointVolume : 0;
  const solutionColor = useMemo(() => {
    if (!hasWater) return "transparent";
    if (!hasIndicator && !hasNa2CO3) return "rgba(180, 200, 230, 0.4)"; // water alone
    if (!hasIndicator) return "rgba(180, 200, 230, 0.5)"; // dissolved Na2CO3 — still clear
    // After indicator added
    if (hclAdded === 0) return "#facc15"; // yellow (basic / start of titration)
    if (ratio < 0.92) return "#facc15"; // yellow
    if (ratio < 0.99) return "#fb923c"; // orange (approaching endpoint)
    if (ratio < 1.04) return "#ef4444"; // red (endpoint)
    return "#991b1b"; // deep red (over-titrated)
  }, [hasWater, hasIndicator, hasNa2CO3, hclAdded, ratio]);

  const solutionLabel = useMemo(() => {
    if (!hasWater && !hasNa2CO3) return "Empty Flask";
    if (!hasWater && hasNa2CO3) return "Na₂CO₃ (solid)";
    if (!hasIndicator) return "Na₂CO₃ Solution";
    if (hclAdded === 0) return "Yellow Solution";
    if (ratio < 0.92) return "Yellow Solution";
    if (ratio < 0.99) return "Orange (near endpoint)";
    if (ratio < 1.04) return "Red — Endpoint!";
    return "Over-titrated";
  }, [hasWater, hasNa2CO3, hasIndicator, hclAdded, ratio]);

  const handleAction = () => {
    switch (step) {
      case "weigh":
        setStep("transfer");
        break;
      case "transfer":
        setHasNa2CO3(true);
        setStep("dissolve");
        break;
      case "dissolve":
        setHasWater(true);
        setStep("indicator");
        break;
      case "indicator":
        setHasIndicator(true);
        setStep("fill-burette");
        break;
      case "fill-burette":
        setBuretteVolume(BURETTE_CAPACITY);
        setStep("initial-reading");
        break;
      case "initial-reading":
        setInitialReading(0);
        setStep("titrate");
        break;
      case "titrate":
        // user controls; flow until endpoint
        if (ratio >= 0.99 && ratio <= 1.04) {
          setStopcockOpen(false);
          setStep("final-reading");
        }
        break;
      case "final-reading":
        setFinalReading(hclAdded);
        setStep("calculate");
        break;
      case "calculate":
        setStep("done");
        break;
      case "done":
        break;
    }
  };

  const reset = () => {
    setStep("weigh");
    setMass(randomMass());
    setHasWater(false);
    setHasIndicator(false);
    setHasNa2CO3(false);
    setBuretteVolume(0);
    setHclAdded(0);
    setInitialReading(null);
    setFinalReading(null);
    setStopcockOpen(false);
    setFlowRate("normal");
  };

  // Calculation
  const calculatedMolarity = useMemo(() => {
    if (finalReading === null || initialReading === null) return null;
    const vol = (finalReading - initialReading) / 1000; // L
    if (vol <= 0) return null;
    const molesNa2CO3 = mass / NA2CO3_MOLAR_MASS;
    const molesHCl = 2 * molesNa2CO3;
    return molesHCl / vol;
  }, [mass, initialReading, finalReading]);

  const currentMeta = PROCEDURE.find((p) => p.id === step);

  return (
    <ExperimentShell
      slug="volumetric-titration"
      title="Volumetric titration — standardization of HCl"
      objective="A full guided wet-lab simulation. Weigh, prepare, fill, titrate, and calculate — the standardization workflow used as the foundation of quantitative biochem assays."
      unitTitle="Foundational quantitative analysis"
      unitId="unit-3"
      estimatedMinutes={15}
      xp={80}
      observations={
        step === "done" || calculatedMolarity !== null ? (
          <div className="space-y-2">
            <p>
              <strong>Mass of Na₂CO₃ taken:</strong> {mass.toFixed(4)} g
            </p>
            <p>
              <strong>Volume of HCl used:</strong> {finalReading !== null && initialReading !== null ? (finalReading - initialReading).toFixed(2) : "—"} mL
            </p>
            <p>
              <strong>Molarity of HCl:</strong>{" "}
              {calculatedMolarity !== null ? (
                <span className="font-mono text-base text-foreground">
                  {calculatedMolarity.toFixed(4)} M
                </span>
              ) : "—"}
            </p>
            <p className="text-xs text-muted-foreground">
              Formula: M(HCl) = (mass / molar mass of Na₂CO₃) × 2 × 1000 / volume of HCl in mL ={" "}
              <span className="font-mono">({mass.toFixed(4)} / 106) × 2 × 1000 / {finalReading !== null && initialReading !== null ? (finalReading - initialReading).toFixed(2) : "?"}</span>.
              The factor of 2 comes from the stoichiometry: <span className="font-mono">Na₂CO₃ + 2 HCl → 2 NaCl + H₂O + CO₂</span>.
            </p>
          </div>
        ) : (
          <p>Work through each step on the right-hand panel. The flask&apos;s colour will change as you approach the endpoint — stop when it turns persistent pink/red.</p>
        )
      }
    >
      <div className="grid gap-5 lg:grid-cols-5">
        {/* Lab bench */}
        <Card className="lg:col-span-3 overflow-hidden">
          <CardHeader className="border-b bg-muted/30 py-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Beaker className="h-4 w-4 text-primary" /> Laboratory Bench
            </CardTitle>
          </CardHeader>
          <CardContent className="bg-gradient-to-b from-slate-900 to-slate-950 py-10 text-white">
            <div className="flex items-end justify-center gap-8 sm:gap-12">
              <BalanceSVG mass={mass} weighed={completedSteps.has("weigh") || step !== "weigh"} />
              <BuretteSVG
                volumeInBurette={buretteVolume}
                hclAdded={hclAdded}
                stopcockOpen={stopcockOpen}
                capacity={BURETTE_CAPACITY}
              />
              <FlaskSVG color={solutionColor} label={solutionLabel} hasIndicator={hasIndicator} />
            </div>
            {/* Reagents shelf */}
            <div className="mt-8 border-t border-white/10 pt-5">
              <p className="mb-3 text-center text-xs uppercase tracking-wider text-white/60">Reagents</p>
              <div className="flex flex-wrap justify-center gap-3">
                <Reagent label="Na₂CO₃" used={hasNa2CO3} />
                <Reagent label="H₂O" used={hasWater} />
                <Reagent label="MeOr" used={hasIndicator} />
                <Reagent label="HCl" used={buretteVolume > 0} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lab notebook */}
        <Card className="lg:col-span-2 overflow-hidden">
          <CardHeader className="border-b bg-gradient-to-r from-primary/10 to-card py-3">
            <CardTitle className="text-base">Lab Notebook</CardTitle>
            <p className="text-xs text-muted-foreground">
              Na₂CO₃ + 2 HCl → 2 NaCl + CO₂ + H₂O
            </p>
          </CardHeader>
          <CardContent className="space-y-5 py-5">
            {/* Procedure list */}
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Procedure</p>
              <ul className="space-y-1.5">
                {PROCEDURE.map((p) => {
                  const isDone = completedSteps.has(p.id);
                  const isCurrent = step === p.id;
                  return (
                    <li
                      key={p.id}
                      className={cn(
                        "flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm transition",
                        isCurrent && "bg-primary/10 font-semibold text-foreground",
                        isDone && "text-muted-foreground",
                      )}
                    >
                      {isDone ? (
                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                      ) : isCurrent ? (
                        <ChevronRight className="h-3.5 w-3.5 text-primary" />
                      ) : (
                        <span className="h-3.5 w-3.5 rounded-full border border-muted-foreground/30" />
                      )}
                      <span className={cn(isDone && "line-through")}>{p.label}</span>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Current step panel */}
            <div className="rounded-lg border-2 border-primary/30 bg-primary/5 p-4">
              <p className="text-xs uppercase tracking-wider text-primary font-semibold">Current step</p>
              <p className="mt-1 font-semibold">{currentMeta?.label ?? "Done"}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{currentMeta?.tip ?? "All steps complete — see your calculated molarity in the observations panel."}</p>

              {/* Step-specific live data */}
              {step === "weigh" && (
                <div className="mt-3 rounded-md border bg-card p-3 font-mono text-sm">
                  Balance reading: <span className="text-primary">{mass.toFixed(4)} g</span>
                </div>
              )}
              {step === "initial-reading" && (
                <div className="mt-3 rounded-md border bg-card p-3 font-mono text-sm">
                  Burette reads: <span className="text-primary">0.00 mL</span>
                </div>
              )}
              {(step === "titrate" || step === "final-reading") && (
                <div className="mt-3 space-y-2 rounded-md border bg-card p-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Stopcock</span>
                    <Badge className={cn("rounded-md", stopcockOpen ? "bg-emerald-500" : "bg-rose-500")}>
                      <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-white" />
                      {stopcockOpen ? "OPEN" : "CLOSED"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Flow rate</span>
                    <span className="font-mono font-semibold capitalize">{flowRate === "drop" ? "Drop-wise" : "Normal"}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">HCl added</span>
                    <span className="font-mono font-bold text-primary">{hclAdded.toFixed(2)} mL</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Hint: target endpoint is somewhere between <span className="font-mono">{(endpointVolume * 0.85).toFixed(1)}</span> and <span className="font-mono">{(endpointVolume * 1.15).toFixed(1)}</span> mL. Switch to drop-wise as you get close.
                  </div>
                </div>
              )}
              {step === "calculate" && finalReading !== null && initialReading !== null && (
                <div className="mt-3 rounded-md border bg-card p-3 text-sm">
                  <p className="font-mono">M(HCl) = ({mass.toFixed(4)} / 106) × 2 × 1000 / {(finalReading - initialReading).toFixed(2)}</p>
                  <p className="mt-1 font-mono">= <span className="text-primary font-bold">{calculatedMolarity?.toFixed(4)} M</span></p>
                </div>
              )}
            </div>

            {/* Step actions */}
            <div className="space-y-2">
              {step === "titrate" ? (
                <>
                  <Button
                    onClick={() => setStopcockOpen((v) => !v)}
                    className={cn("w-full", stopcockOpen ? "bg-rose-600 hover:bg-rose-700" : "bg-emerald-600 hover:bg-emerald-700")}
                    size="lg"
                  >
                    {stopcockOpen ? (<><Pause className="mr-1.5 h-4 w-4" /> Close stopcock</>) : (<><Play className="mr-1.5 h-4 w-4" /> Open stopcock</>)}
                  </Button>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={flowRate === "normal" ? "default" : "outline"}
                      onClick={() => setFlowRate("normal")}
                      size="sm"
                    >
                      Normal flow
                    </Button>
                    <Button
                      variant={flowRate === "drop" ? "default" : "outline"}
                      onClick={() => setFlowRate("drop")}
                      size="sm"
                    >
                      Drop-wise
                    </Button>
                  </div>
                  <Button
                    onClick={handleAction}
                    variant="outline"
                    className="w-full"
                    disabled={ratio < 0.99 || ratio > 1.04}
                  >
                    {ratio < 0.99 ? `Keep going (${(ratio * 100).toFixed(0)}% of endpoint)` :
                     ratio > 1.04 ? "Over-titrated — reset to try again" :
                     "Endpoint reached → next"}
                  </Button>
                </>
              ) : step === "done" ? (
                <Button onClick={reset} variant="outline" className="w-full" size="lg">
                  <RotateCcw className="mr-1.5 h-4 w-4" /> Run again with a new sample
                </Button>
              ) : (
                <Button onClick={handleAction} className="w-full" size="lg">
                  Continue → {PROCEDURE[Math.min(PROCEDURE.findIndex(p => p.id === step) + 1, PROCEDURE.length - 1)]?.label ?? "Done"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </ExperimentShell>
  );
}

/* ============ SVG Glassware ============ */

function BalanceSVG({ mass, weighed }: { mass: number; weighed: boolean }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <span className="text-xs uppercase tracking-wider text-white/70">Analytical Balance</span>
      <svg width="120" height="100" viewBox="0 0 120 100">
        <rect x="10" y="40" width="100" height="50" rx="6" fill="#e2e8f0" stroke="#475569" strokeWidth="1.5" />
        <rect x="20" y="50" width="80" height="20" rx="3" fill="#0f172a" />
        <text x="60" y="65" textAnchor="middle" fontFamily="monospace" fontSize="11" fill="#22d3ee" fontWeight="bold">
          {mass.toFixed(4)} g
        </text>
        <rect x="35" y="20" width="50" height="22" rx="3" fill="#cbd5e1" stroke="#475569" strokeWidth="1" />
        <rect x="40" y="32" width="40" height="3" fill="#94a3b8" />
      </svg>
      {weighed && (
        <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
          Weighed: {mass.toFixed(4)} g
        </span>
      )}
    </div>
  );
}

function BuretteSVG({
  volumeInBurette,
  hclAdded,
  stopcockOpen,
  capacity,
}: {
  volumeInBurette: number;
  hclAdded: number;
  stopcockOpen: boolean;
  capacity: number;
}) {
  const remaining = volumeInBurette > 0 ? Math.max(0, volumeInBurette - hclAdded) : 0;
  const fillFraction = remaining / capacity;
  const tubeHeight = 280;
  const fillHeight = tubeHeight * fillFraction;
  const meniscusY = 30 + (tubeHeight - fillHeight);

  return (
    <div className="flex flex-col items-center gap-1.5">
      <span className="text-xs uppercase tracking-wider text-white/70">HCl</span>
      <svg width="90" height="360" viewBox="0 0 90 360">
        {/* Stand */}
        <rect x="0" y="340" width="90" height="6" rx="2" fill="#475569" />
        <rect x="40" y="20" width="2" height="320" fill="#64748b" />
        {/* Burette tube */}
        <rect x="32" y="20" width="26" height="300" rx="4" fill="rgba(255,255,255,0.08)" stroke="#94a3b8" strokeWidth="1.5" />
        {/* Liquid */}
        {remaining > 0 && (
          <rect
            x="34"
            y={meniscusY}
            width="22"
            height={fillHeight}
            fill="#3b82f6"
            opacity="0.7"
            style={{ transition: "height 0.15s linear, y 0.15s linear" }}
          />
        )}
        {/* Graduation marks */}
        {Array.from({ length: 11 }).map((_, i) => {
          const y = 30 + i * (tubeHeight / 10);
          return (
            <g key={i}>
              <line x1="58" y1={y} x2="64" y2={y} stroke="#cbd5e1" strokeWidth="1" />
              <text x="66" y={y + 3} fontFamily="monospace" fontSize="8" fill="#cbd5e1">
                {i * 5}
              </text>
            </g>
          );
        })}
        {/* Stopcock */}
        <circle cx="45" cy="328" r="9" fill={stopcockOpen ? "#22c55e" : "#ef4444"} stroke="#1e293b" strokeWidth="1.5" />
        {stopcockOpen && (
          <rect x="42" y="320" width="6" height="16" fill="#1e293b" />
        )}
        {/* Outflow */}
        {stopcockOpen && remaining > 0 && (
          <>
            <rect x="44" y="338" width="2" height="14" fill="#3b82f6" opacity="0.85" />
          </>
        )}
      </svg>
      <span className="font-mono text-xs text-white">{hclAdded.toFixed(2)} mL added</span>
    </div>
  );
}

function FlaskSVG({ color, label, hasIndicator }: { color: string; label: string; hasIndicator: boolean }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <span className="text-xs uppercase tracking-wider text-white/70">Conical Flask</span>
      <svg width="120" height="160" viewBox="0 0 120 160">
        {/* Neck */}
        <rect x="50" y="10" width="20" height="35" fill="rgba(255,255,255,0.08)" stroke="#94a3b8" strokeWidth="1.5" />
        {/* Flask body */}
        <path
          d="M 50 45 L 50 60 L 20 140 Q 20 150 30 150 L 90 150 Q 100 150 100 140 L 70 60 L 70 45 Z"
          fill="rgba(255,255,255,0.08)"
          stroke="#94a3b8"
          strokeWidth="1.5"
        />
        {/* Solution */}
        <path
          d="M 28 95 L 22 138 Q 22 148 30 148 L 90 148 Q 98 148 98 138 L 92 95 Z"
          fill={color}
          opacity={color === "transparent" ? 0 : 0.85}
          style={{ transition: "fill 0.6s ease, opacity 0.4s ease" }}
        />
        {/* Highlight */}
        <path
          d="M 50 45 L 50 60 L 20 140 Q 20 150 30 150 L 35 150 L 30 95 L 53 60 L 53 45 Z"
          fill="rgba(255,255,255,0.1)"
          pointerEvents="none"
        />
      </svg>
      <span className="max-w-[14ch] text-center text-xs font-medium text-white">{label}</span>
      {hasIndicator && (
        <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-semibold text-amber-300">
          Indicator added
        </span>
      )}
    </div>
  );
}

function Reagent({ label, used }: { label: string; used: boolean }) {
  return (
    <div className={cn(
      "flex flex-col items-center gap-1 rounded-lg border px-3 py-2 text-xs transition",
      used ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300" : "border-white/15 bg-white/5 text-white/60",
    )}>
      <div className="grid h-9 w-9 place-items-center rounded-md bg-white/10 text-[10px] font-bold">
        {label}
      </div>
      <span className="text-[10px] font-medium uppercase tracking-wider">{used ? "Used" : "Available"}</span>
    </div>
  );
}
