"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ExperimentShell } from "./ExperimentShell";
import { transcribe, translate } from "@/lib/content/codonTable";
import { cn } from "@/lib/utils";

const DEFAULT_TEMPLATE = "TACGGTACAGTCATT";

export function TranscriptionSim() {
  const [template, setTemplate] = useState(DEFAULT_TEMPLATE);
  const [step, setStep] = useState(0);
  const cleaned = template.toUpperCase().replace(/[^ATGC]/g, "");
  const mrna = useMemo(() => transcribe(cleaned), [cleaned]);
  const peptide = useMemo(() => translate(mrna), [mrna]);
  const maxStep = peptide.length;

  const codonsShown = peptide.slice(0, step);
  const stopHit = codonsShown.some((c) => c.aa === "Stop");

  return (
    <ExperimentShell
      slug="dna-transcription"
      title="DNA transcription & translation animator"
      objective="Type a DNA template strand and step through transcription and translation."
      unitTitle="Nucleic Acids"
      unitId="unit-4"
      estimatedMinutes={10}
      xp={50}
      observations={
        <div className="space-y-2">
          <p>
            Template (3&apos;→5&apos;): <span className="font-mono">{cleaned || "—"}</span>
          </p>
          <p>
            mRNA (5&apos;→3&apos;): <span className="font-mono">{mrna || "—"}</span>
          </p>
          <p>
            Peptide so far:{" "}
            <span className="font-mono">
              {codonsShown.filter((c) => c.aa !== "Stop").map((c) => c.aa).join(" — ") || "—"}
            </span>
            {stopHit && <span className="ml-2 text-amber-600">(translation stopped)</span>}
          </p>
        </div>
      }
    >
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Template DNA</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">Type or paste a DNA template (A/T/G/C; 5-30 nt)</label>
              <Input
                value={template}
                onChange={(e) => { setTemplate(e.target.value.toUpperCase()); setStep(0); }}
                placeholder="TACGGTACAGTCATT"
                className="font-mono"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              The template is read 3&apos;→5&apos; by RNA polymerase. mRNA is synthesised 5&apos;→3&apos; with U replacing T. Each consecutive 3-nt block is one codon.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => setStep((s) => Math.max(0, s - 1))} variant="outline" size="sm" disabled={step === 0}>
                Previous
              </Button>
              <Button onClick={() => setStep((s) => Math.min(maxStep, s + 1))} size="sm" disabled={step === maxStep}>
                Next codon →
              </Button>
              <Button onClick={() => setStep(0)} size="sm" variant="ghost">
                Reset
              </Button>
            </div>
            <p className="text-xs">
              Step {step} of {maxStep}
            </p>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Tracks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <Track label="Template DNA (3&apos;→5&apos;)" letters={cleaned.split("")} highlightFrom={cleaned.length - step * 3} highlightCount={step > 0 ? 3 : 0} mono />
            <Track label="mRNA (5&apos;→3&apos;)" letters={mrna.split("")} highlightFrom={step * 3 - 3} highlightCount={step > 0 ? 3 : 0} mono color="primary" />
            <div>
              <p className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">Peptide chain</p>
              <div className="flex flex-wrap gap-1.5">
                {codonsShown.filter((c) => c.aa !== "Stop").map((c, i) => (
                  <span key={i} className="rounded-md border bg-card px-2 py-1 text-xs font-mono">
                    <span className="text-primary">{c.aa}</span>
                    <span className="ml-1 text-muted-foreground">({c.codon})</span>
                  </span>
                ))}
                {stopHit && (
                  <span className="rounded-md border border-amber-500/40 bg-amber-500/10 px-2 py-1 text-xs font-mono text-amber-700 dark:text-amber-300">
                    STOP
                  </span>
                )}
                {codonsShown.length === 0 && (
                  <span className="text-xs text-muted-foreground">No codons yet. Click &quot;Next codon&quot;.</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ExperimentShell>
  );
}

function Track({
  label,
  letters,
  highlightFrom,
  highlightCount,
  mono,
  color = "muted",
}: {
  label: string;
  letters: string[];
  highlightFrom: number;
  highlightCount: number;
  mono?: boolean;
  color?: "muted" | "primary";
}) {
  return (
    <div>
      <p className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <div className={cn("flex flex-wrap gap-0.5", mono && "font-mono")}>
        {letters.length === 0 && <span className="text-xs text-muted-foreground">—</span>}
        {letters.map((l, i) => {
          const highlighted = highlightCount > 0 && i >= highlightFrom && i < highlightFrom + highlightCount;
          return (
            <span
              key={i}
              className={cn(
                "grid h-7 w-7 place-items-center rounded text-xs",
                highlighted && color === "primary" && "bg-primary text-primary-foreground",
                highlighted && color === "muted" && "bg-amber-400/40 dark:bg-amber-400/30",
                !highlighted && "bg-muted/40 text-muted-foreground",
              )}
            >
              {l}
            </span>
          );
        })}
      </div>
    </div>
  );
}
