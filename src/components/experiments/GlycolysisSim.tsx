"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExperimentShell } from "./ExperimentShell";
import { cn } from "@/lib/utils";
import { Zap, ZapOff, Flag } from "lucide-react";

interface Step {
  n: number;
  enzyme: string;
  reaction: string;
  type: "investment" | "split" | "payoff";
  irreversible?: boolean;
  atpChange: number;
  nadhChange: number;
  notes: string;
}

const STEPS: Step[] = [
  { n: 1, enzyme: "Hexokinase / Glucokinase", reaction: "Glucose → Glucose-6-phosphate", type: "investment", irreversible: true, atpChange: -1, nadhChange: 0, notes: "Uses 1 ATP. Hexokinase (low Km, ubiquitous) vs Glucokinase (high Km, liver/β-cells)." },
  { n: 2, enzyme: "Phosphohexose isomerase", reaction: "G6P ⇌ F6P", type: "investment", atpChange: 0, nadhChange: 0, notes: "Aldose → ketose isomerisation. Freely reversible." },
  { n: 3, enzyme: "Phosphofructokinase-1 (PFK-1)", reaction: "F6P → Fructose-1,6-bisphosphate", type: "investment", irreversible: true, atpChange: -1, nadhChange: 0, notes: "RATE-LIMITING. Uses 1 ATP. Activated by AMP, F2,6BP; inhibited by ATP, citrate." },
  { n: 4, enzyme: "Aldolase", reaction: "F1,6BP → DHAP + G3P", type: "split", atpChange: 0, nadhChange: 0, notes: "Cleaves the 6C sugar into two 3C trioses." },
  { n: 5, enzyme: "Triose-phosphate isomerase", reaction: "DHAP ⇌ G3P", type: "split", atpChange: 0, nadhChange: 0, notes: "Interconverts the two trioses. From here, the pathway runs in duplicate." },
  { n: 6, enzyme: "G3P dehydrogenase (GAPDH)", reaction: "G3P → 1,3-BPG", type: "payoff", atpChange: 0, nadhChange: 1, notes: "Produces NADH (×2 per glucose). Inhibited by iodoacetate." },
  { n: 7, enzyme: "Phosphoglycerate kinase", reaction: "1,3-BPG → 3-PG", type: "payoff", atpChange: 1, nadhChange: 0, notes: "Substrate-level phosphorylation (×2 per glucose). Arsenate uncouples here." },
  { n: 8, enzyme: "Phosphoglycerate mutase", reaction: "3-PG ⇌ 2-PG", type: "payoff", atpChange: 0, nadhChange: 0, notes: "Phosphate moves from C3 to C2." },
  { n: 9, enzyme: "Enolase", reaction: "2-PG → PEP + H₂O", type: "payoff", atpChange: 0, nadhChange: 0, notes: "Dehydration creates a high-energy enol phosphate. Inhibited by fluoride." },
  { n: 10, enzyme: "Pyruvate kinase", reaction: "PEP → Pyruvate", type: "payoff", irreversible: true, atpChange: 1, nadhChange: 0, notes: "Final SLP. Allosterically activated by F1,6BP." },
];

export function GlycolysisSim() {
  const [step, setStep] = useState(0);
  const reached = STEPS.slice(0, step);
  const current = step > 0 ? STEPS[step - 1] : null;

  // Per glucose: steps 1-3 happen once; steps 6-10 happen twice (once per triose).
  let atp = 0;
  let nadh = 0;
  for (const s of reached) {
    const factor = s.n >= 6 && step >= 5 ? 2 : 1;
    atp += s.atpChange * factor;
    nadh += s.nadhChange * factor;
  }

  return (
    <ExperimentShell
      slug="glycolysis-walkthrough"
      title="Glycolysis walkthrough"
      objective="Step through the 10 enzymes of glycolysis with a live ATP / NADH ledger."
      unitTitle="Metabolism"
      unitId="unit-5"
      estimatedMinutes={12}
      xp={50}
      observations={
        <div className="space-y-1">
          <p>
            After step {step} of 10: net ATP = <strong className={atp >= 0 ? "text-emerald-600" : "text-rose-600"}>{atp >= 0 ? "+" : ""}{atp}</strong>, NADH = <strong>{nadh}</strong>.
          </p>
          <p>
            By the end of glycolysis: <strong>+2 ATP net, +2 NADH</strong>, and 2 pyruvate per glucose. The first 5 steps cost 2 ATP; the last 5 (each running twice for the two trioses) generate 4 ATP and 2 NADH.
          </p>
        </div>
      }
    >
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <CardTitle className="text-base">Step {step} of 10</CardTitle>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
                Previous
              </Button>
              <Button size="sm" onClick={() => setStep((s) => Math.min(10, s + 1))} disabled={step === 10}>
                Next step →
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setStep(0)}>
                Reset
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {current ? (
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="rounded-md">{current.type}</Badge>
                  {current.irreversible && <Badge className="rounded-md">Irreversible</Badge>}
                  <Badge variant="outline" className="rounded-md">Step {current.n}</Badge>
                </div>
                <h3 className="text-lg font-semibold">{current.enzyme}</h3>
                <p className="font-mono text-sm">{current.reaction}</p>
                <p className="text-sm text-muted-foreground">{current.notes}</p>
                <div className="flex flex-wrap gap-3 pt-2 text-sm">
                  <span className="inline-flex items-center gap-1">
                    {current.atpChange < 0 ? <ZapOff className="h-4 w-4 text-rose-500" /> : current.atpChange > 0 ? <Zap className="h-4 w-4 text-emerald-500" /> : <Flag className="h-4 w-4 text-muted-foreground" />}
                    ATP {current.atpChange === 0 ? "0" : (current.atpChange > 0 ? "+" : "") + current.atpChange}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    NADH {current.nadhChange > 0 ? `+${current.nadhChange}` : current.nadhChange}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Click <strong>Next step</strong> to begin glycolysis from glucose.</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Ledger</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <Row label="Net ATP" value={atp} positive={atp >= 0} />
            <Row label="Total NADH" value={nadh} positive={nadh >= 0} />
            <Row label="Step" value={step} positive />
            <div className="mt-4 space-y-1 border-t pt-3">
              {STEPS.map((s, i) => (
                <div key={s.n} className={cn("flex items-center gap-2 rounded px-2 py-1 text-xs", i < step ? "bg-primary/10 text-foreground" : "text-muted-foreground")}>
                  <span className="w-5 text-right font-mono">{s.n}.</span>
                  <span className="flex-1 truncate">{s.enzyme}</span>
                  {s.irreversible && <Badge variant="outline" className="text-[10px]">IRR</Badge>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </ExperimentShell>
  );
}

function Row({ label, value, positive }: { label: string; value: number; positive: boolean }) {
  return (
    <div className="flex items-center justify-between border-b pb-1.5">
      <span className="text-muted-foreground">{label}</span>
      <span className={cn("font-mono font-semibold", positive ? "text-foreground" : "text-rose-600")}>
        {value > 0 ? "+" : ""}{value}
      </span>
    </div>
  );
}
