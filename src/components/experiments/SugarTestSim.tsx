"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExperimentShell } from "./ExperimentShell";

type Sugar = "glucose" | "fructose" | "sucrose" | "lactose" | "starch";
type Reagent = "molisch" | "fehling" | "benedict" | "barfoed" | "seliwanoff" | "iodine";

interface Outcome {
  color: string;
  result: string;
  explanation: string;
}

const RESULTS: Record<Reagent, Record<Sugar, Outcome>> = {
  molisch: {
    glucose: { color: "#7c3aed", result: "Violet ring at interface", explanation: "Molisch is a general test — any carbohydrate gives a purple ring. Glucose dehydrates to furfural which condenses with α-naphthol." },
    fructose: { color: "#7c3aed", result: "Violet ring at interface", explanation: "Same mechanism — fructose dehydrates to hydroxymethylfurfural." },
    sucrose: { color: "#7c3aed", result: "Violet ring at interface", explanation: "Sucrose is hydrolysed in situ by the H2SO4, then gives a positive Molisch." },
    lactose: { color: "#7c3aed", result: "Violet ring at interface", explanation: "Lactose is a carbohydrate — positive Molisch." },
    starch: { color: "#7c3aed", result: "Violet ring at interface", explanation: "Starch hydrolyses under acid conditions to give a positive Molisch." },
  },
  fehling: {
    glucose: { color: "#b91c1c", result: "Brick-red precipitate", explanation: "Glucose is a reducing aldose. Reduces Cu²⁺ → Cu₂O (brick-red ppt)." },
    fructose: { color: "#b91c1c", result: "Brick-red precipitate", explanation: "Fructose is a reducing ketose (isomerises to glucose in alkali — Lobry de Bruyn reaction)." },
    sucrose: { color: "#1d4ed8", result: "No change (clear blue)", explanation: "Sucrose has no free anomeric carbon — non-reducing. Fehling stays blue." },
    lactose: { color: "#b91c1c", result: "Brick-red precipitate", explanation: "Lactose has a free anomeric C on the glucose unit — reducing." },
    starch: { color: "#1d4ed8", result: "No change (clear blue)", explanation: "Polysaccharide — anomeric Cs are tied up in glycosidic bonds. Non-reducing." },
  },
  benedict: {
    glucose: { color: "#b91c1c", result: "Brick-red precipitate", explanation: "Same redox chemistry as Fehling but more sensitive (works on dilute urine). Positive for any reducing sugar." },
    fructose: { color: "#b91c1c", result: "Brick-red precipitate", explanation: "Reducing — positive." },
    sucrose: { color: "#1d4ed8", result: "No change (clear blue)", explanation: "Non-reducing — negative Benedict." },
    lactose: { color: "#b91c1c", result: "Brick-red precipitate", explanation: "Reducing — positive." },
    starch: { color: "#1d4ed8", result: "No change (clear blue)", explanation: "Non-reducing — negative Benedict." },
  },
  barfoed: {
    glucose: { color: "#dc2626", result: "Red precipitate within 1-2 min", explanation: "Barfoed (Cu acetate in mild acid) distinguishes monosaccharides (fast positive) from disaccharides (slow). Glucose is a monosaccharide — fast positive." },
    fructose: { color: "#dc2626", result: "Red precipitate within 1-2 min", explanation: "Monosaccharide — fast positive." },
    sucrose: { color: "#1d4ed8", result: "No change (clear blue)", explanation: "Non-reducing — negative." },
    lactose: { color: "#9a3412", result: "Slow red ppt (after 10+ min)", explanation: "Reducing disaccharide — gives a positive but only after prolonged heating, distinguishing it from a monosaccharide." },
    starch: { color: "#1d4ed8", result: "No change (clear blue)", explanation: "Non-reducing polysaccharide — negative." },
  },
  seliwanoff: {
    glucose: { color: "#facc15", result: "Slow faint pink (within 5 min, weak)", explanation: "Seliwanoff (resorcinol in HCl) distinguishes ketoses (fast deep red) from aldoses (slow faint). Glucose is an aldose — slow, weak." },
    fructose: { color: "#e11d48", result: "Cherry-red within 30 seconds", explanation: "Fructose is a ketose — rapid dehydration to HMF gives a fast deep red. The diagnostic test for ketoses." },
    sucrose: { color: "#e11d48", result: "Cherry-red", explanation: "Sucrose contains a fructose unit. Acid hydrolyses sucrose, releasing fructose which gives a positive test." },
    lactose: { color: "#facc15", result: "Slow faint pink", explanation: "Aldose disaccharide — slow weak positive." },
    starch: { color: "#facc15", result: "Slow faint pink", explanation: "Aldose-derived polysaccharide — slow weak." },
  },
  iodine: {
    glucose: { color: "#a16207", result: "No color change (light brown of iodine)", explanation: "Iodine forms coloured complexes only with polysaccharide helices. Monosaccharides are too short to coil." },
    fructose: { color: "#a16207", result: "No color change", explanation: "Same — monosaccharide, no coil." },
    sucrose: { color: "#a16207", result: "No color change", explanation: "Disaccharide — too short." },
    lactose: { color: "#a16207", result: "No color change", explanation: "Disaccharide — too short." },
    starch: { color: "#1e3a8a", result: "Deep blue-black", explanation: "Amylose forms a helical complex with I₃⁻ — the classic blue-black starch test." },
  },
};

const SUGAR_LABELS: Record<Sugar, string> = {
  glucose: "Glucose (aldohexose)",
  fructose: "Fructose (ketohexose)",
  sucrose: "Sucrose (disaccharide)",
  lactose: "Lactose (disaccharide)",
  starch: "Starch (polysaccharide)",
};

const REAGENT_LABELS: Record<Reagent, string> = {
  molisch: "Molisch (general carbohydrate)",
  fehling: "Fehling's (reducing sugars)",
  benedict: "Benedict's (reducing sugars)",
  barfoed: "Barfoed's (monosaccharides)",
  seliwanoff: "Seliwanoff's (ketoses)",
  iodine: "Iodine (polysaccharides)",
};

export function SugarTestSim() {
  const [sugar, setSugar] = useState<Sugar>("glucose");
  const [reagent, setReagent] = useState<Reagent>("fehling");
  const [revealed, setRevealed] = useState(false);
  const outcome = RESULTS[reagent][sugar];

  const runTest = () => setRevealed(true);
  const reset = () => setRevealed(false);

  return (
    <ExperimentShell
      slug="qualitative-sugar-tests"
      title="Qualitative carbohydrate tests"
      objective="Pick a sugar, pick a reagent, and observe the colour change that diagnoses its class."
      unitTitle="Biomolecules — Carbohydrates"
      unitId="unit-1"
      estimatedMinutes={7}
      xp={50}
      observations={
        revealed ? (
          <div>
            <p className="font-medium text-foreground">{REAGENT_LABELS[reagent]} + {SUGAR_LABELS[sugar]}</p>
            <p className="mt-1">{outcome.result}</p>
            <p className="mt-2 text-xs">{outcome.explanation}</p>
          </div>
        ) : (
          <p>Pick a sugar and reagent, then click <strong>Run test</strong> to see the result.</p>
        )
      }
    >
      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Setup</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <label className="mb-2 block text-[15px] font-medium">Sugar in test tube</label>
              <Select value={sugar} onValueChange={(v) => { setSugar(v as Sugar); setRevealed(false); }}>
                <SelectTrigger className="h-11 text-[15px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(SUGAR_LABELS) as Sugar[]).map((s) => (
                    <SelectItem key={s} value={s}>{SUGAR_LABELS[s]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="mb-2 block text-[15px] font-medium">Reagent</label>
              <Select value={reagent} onValueChange={(v) => { setReagent(v as Reagent); setRevealed(false); }}>
                <SelectTrigger className="h-11 text-[15px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(REAGENT_LABELS) as Reagent[]).map((r) => (
                    <SelectItem key={r} value={r}>{REAGENT_LABELS[r]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 pt-2">
              <Button onClick={runTest} disabled={revealed} size="lg">Run test</Button>
              <Button onClick={reset} variant="ghost" disabled={!revealed} size="lg">Reset</Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Result</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid place-items-center py-8">
              <TestTube color={revealed ? outcome.color : "var(--color-muted-foreground)"} label={revealed ? outcome.result : "Awaiting reagent..."} />
            </div>
          </CardContent>
        </Card>
      </div>
    </ExperimentShell>
  );
}

function TestTube({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-4">
      <svg width="120" height="320" viewBox="0 0 80 220" className="drop-shadow-md">
        <defs>
          <linearGradient id="tubeGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,0.55)" />
            <stop offset="80%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
        </defs>
        <path
          d="M 25 10 L 25 180 Q 25 210 40 210 Q 55 210 55 180 L 55 10 Z"
          fill="var(--color-card)"
          stroke="var(--color-border)"
          strokeWidth="2"
        />
        <path
          d="M 28 100 L 28 180 Q 28 207 40 207 Q 52 207 52 180 L 52 100 Z"
          fill={color}
          opacity="0.88"
          style={{ transition: "fill 0.6s ease, opacity 0.4s ease" }}
        />
        <path
          d="M 25 10 L 25 180 Q 25 210 40 210 Q 55 210 55 180 L 55 10 Z"
          fill="url(#tubeGrad)"
          pointerEvents="none"
        />
      </svg>
      <p className="max-w-[28ch] text-center text-base font-medium text-foreground">{label}</p>
    </div>
  );
}
