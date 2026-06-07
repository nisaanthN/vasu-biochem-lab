"use client";

import { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExperimentShell } from "./ExperimentShell";

type Mode = "none" | "competitive" | "non-competitive" | "uncompetitive";

const VMAX = 100;
const KM = 5;
const S_MAX = 40;

interface Apparent {
  km: number;
  vmax: number;
  alpha: number;
  description: string;
}

function apparent(mode: Mode, I: number, Ki: number): Apparent {
  const alpha = 1 + I / Ki;
  switch (mode) {
    case "competitive":
      return { km: KM * alpha, vmax: VMAX, alpha, description: "Same Vmax, larger apparent Km." };
    case "non-competitive":
      return { km: KM, vmax: VMAX / alpha, alpha, description: "Same Km, smaller Vmax." };
    case "uncompetitive":
      return { km: KM / alpha, vmax: VMAX / alpha, alpha, description: "Both Km and Vmax decrease by the same factor." };
    case "none":
    default:
      return { km: KM, vmax: VMAX, alpha: 1, description: "Baseline (no inhibitor)." };
  }
}

function buildLB(km: number, vmax: number) {
  const out: { invS: number; invV: number }[] = [];
  for (let i = 1; i <= 80; i++) {
    const s = (i / 80) * S_MAX;
    const v = (vmax * s) / (km + s);
    out.push({ invS: 1 / s, invV: 1 / v });
  }
  return out;
}

export function EnzymeInhibitionSim() {
  const [mode, setMode] = useState<Mode>("competitive");
  const [I, setI] = useState(5);
  const [Ki, setKi] = useState(2.5);

  const baseline = useMemo(() => buildLB(KM, VMAX), []);
  const app = useMemo(() => apparent(mode, I, Ki), [mode, I, Ki]);
  const inhibited = useMemo(() => buildLB(app.km, app.vmax), [app]);

  const merged = baseline.map((b, i) => ({
    invS: b.invS,
    baseline: b.invV,
    inhibited: inhibited[i]?.invV,
  }));

  return (
    <ExperimentShell
      slug="enzyme-inhibition"
      title="Enzyme inhibition explorer"
      objective="Toggle inhibition mode and adjust [I] and Ki — see how Km and Vmax shift on the Lineweaver–Burk plot."
      unitTitle="Enzymes"
      unitId="unit-3"
      estimatedMinutes={10}
      xp={50}
      observations={
        <ul>
          <li>
            Mode: <strong className="capitalize">{mode}</strong>. {app.description}
          </li>
          <li>
            Baseline: Km = <strong>{KM} mM</strong>, Vmax = <strong>{VMAX} µmol/min</strong>.
          </li>
          <li>
            Apparent: Km = <strong>{app.km.toFixed(2)} mM</strong>, Vmax = <strong>{app.vmax.toFixed(1)} µmol/min</strong> (alpha = {app.alpha.toFixed(2)}).
          </li>
          <li>
            <strong>Diagnostic:</strong> {mode === "competitive" && "Lines intersect on the y-axis (Vmax unchanged)."}{" "}
            {mode === "non-competitive" && "Lines intersect on the x-axis (Km unchanged)."}{" "}
            {mode === "uncompetitive" && "Lines are parallel — same slope, different intercepts."}{" "}
            {mode === "none" && "No inhibitor: lines overlap."}
          </li>
        </ul>
      }
    >
      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <label className="mb-2 block text-[15px] font-medium">Inhibition mode</label>
              <Select value={mode} onValueChange={(v) => setMode(v as Mode)}>
                <SelectTrigger className="h-11 text-[15px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None (baseline only)</SelectItem>
                  <SelectItem value="competitive">Competitive</SelectItem>
                  <SelectItem value="non-competitive">Non-competitive</SelectItem>
                  <SelectItem value="uncompetitive">Uncompetitive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <div className="mb-2 flex justify-between text-[15px] font-medium">
                <span>[I] (mM)</span>
                <span className="font-mono text-primary">{I.toFixed(1)}</span>
              </div>
              <Slider value={[I]} onValueChange={(v) => setI(v[0])} min={0} max={20} step={0.5} disabled={mode === "none"} />
            </div>
            <div>
              <div className="mb-2 flex justify-between text-[15px] font-medium">
                <span>Ki (mM)</span>
                <span className="font-mono text-primary">{Ki.toFixed(2)}</span>
              </div>
              <Slider value={[Ki]} onValueChange={(v) => setKi(v[0])} min={0.5} max={10} step={0.1} disabled={mode === "none"} />
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              <strong className="text-foreground">Ki</strong> is the inhibitor&apos;s dissociation constant — lower Ki means tighter binding. The plot recalculates apparent Km and Vmax from the mode and the [I]/Ki ratio.
            </p>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Lineweaver–Burk overlay</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-96 w-full">
              <ResponsiveContainer>
                <LineChart data={merged} margin={{ top: 16, right: 16, left: 8, bottom: 28 }}>
                  <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 5" />
                  <XAxis
                    dataKey="invS"
                    type="number"
                    domain={[-0.5, 2.5]}
                    label={{ value: "1 / [S]", position: "insideBottom", offset: -16, fontSize: 13, fill: "var(--color-muted-foreground)" }}
                    tickFormatter={(v) => v.toFixed(2)}
                    tick={{ fontSize: 13, fill: "var(--color-muted-foreground)" }}
                  />
                  <YAxis
                    type="number"
                    domain={[0, "auto"]}
                    label={{ value: "1 / v", angle: -90, position: "insideLeft", offset: 6, fontSize: 13, fill: "var(--color-muted-foreground)" }}
                    tick={{ fontSize: 13, fill: "var(--color-muted-foreground)" }}
                  />
                  <Tooltip
                    formatter={(v) => (typeof v === "number" ? v.toFixed(3) : String(v))}
                    contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 13 }}
                  />
                  <Legend wrapperStyle={{ fontSize: 14, paddingTop: 6 }} iconType="line" />
                  <Line type="monotone" dataKey="baseline" stroke="var(--color-muted-foreground)" name="No inhibitor" strokeWidth={2.5} dot={false} />
                  <Line type="monotone" dataKey="inhibited" stroke="var(--color-chart-1)" name={`+ ${mode}`} strokeWidth={3.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </ExperimentShell>
  );
}
