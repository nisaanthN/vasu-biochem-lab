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
  ReferenceLine,
} from "recharts";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExperimentShell } from "./ExperimentShell";

const STEPS = 80;
const S_MAX = 50;

interface DataPoint {
  s: number;
  v: number;
  invS?: number;
  invV?: number;
}

function buildCurve(vmax: number, km: number): DataPoint[] {
  const out: DataPoint[] = [];
  for (let i = 1; i <= STEPS; i++) {
    const s = (i / STEPS) * S_MAX;
    const v = (vmax * s) / (km + s);
    out.push({ s, v, invS: 1 / s, invV: v > 0.0001 ? 1 / v : undefined });
  }
  return out;
}

export function MichaelisMentenSim() {
  const [vmax, setVmax] = useState(100);
  const [km, setKm] = useState(5);
  const data = useMemo(() => buildCurve(vmax, km), [vmax, km]);
  const halfVmax = vmax / 2;

  return (
    <ExperimentShell
      slug="michaelis-menten"
      title="Michaelis–Menten kinetics simulator"
      objective="Slide Vmax and Km to see how the v vs [S] hyperbola and the Lineweaver–Burk plot change."
      unitTitle="Enzymes"
      unitId="unit-3"
      estimatedMinutes={8}
      xp={50}
      observations={
        <ul>
          <li>
            At <strong>[S] = Km = {km.toFixed(1)} mM</strong>, the reaction rate is exactly half of Vmax = <strong>{halfVmax.toFixed(1)} µmol/min</strong>.
          </li>
          <li>
            Lineweaver–Burk y-intercept = 1/Vmax = <strong>{(1 / vmax).toFixed(4)}</strong>; x-intercept = −1/Km = <strong>{(-1 / km).toFixed(3)}</strong>.
          </li>
          <li>
            Doubling [S] from Km gives a new v of{" "}
            <strong>{((vmax * (2 * km)) / (km + 2 * km)).toFixed(1)} µmol/min</strong>{" "}
            (about {Math.round((2 / 3) * 100)}% of Vmax — note the diminishing returns).
          </li>
        </ul>
      }
    >
      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="mb-2 flex justify-between text-[15px] font-medium">
                <span>Vmax (µmol/min)</span>
                <span className="font-mono text-primary">{vmax.toFixed(0)}</span>
              </div>
              <Slider
                value={[vmax]}
                onValueChange={(v) => setVmax(v[0])}
                min={20}
                max={200}
                step={1}
              />
            </div>
            <div>
              <div className="mb-2 flex justify-between text-[15px] font-medium">
                <span>Km (mM)</span>
                <span className="font-mono text-primary">{km.toFixed(1)}</span>
              </div>
              <Slider
                value={[km]}
                onValueChange={(v) => setKm(v[0])}
                min={0.5}
                max={30}
                step={0.1}
              />
            </div>
            <div className="rounded-lg border bg-muted/40 p-4 text-sm leading-relaxed text-muted-foreground">
              <p>
                <strong className="text-foreground">Tip:</strong> Watch the left plot — at [S] = Km the curve reaches Vmax/2. Then look at the right plot: the line crosses the y-axis at 1/Vmax and the x-axis at −1/Km. Slide Vmax — only y-intercept moves. Slide Km — only x-intercept moves.
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">v vs [S] — Michaelis–Menten hyperbola</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full">
              <ResponsiveContainer>
                <LineChart data={data} margin={{ top: 16, right: 16, left: 8, bottom: 28 }}>
                  <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 5" />
                  <XAxis
                    dataKey="s"
                    type="number"
                    domain={[0, S_MAX]}
                    label={{ value: "[S] (mM)", position: "insideBottom", offset: -16, fontSize: 13, fill: "var(--color-muted-foreground)" }}
                    tickFormatter={(v) => v.toFixed(0)}
                    tick={{ fontSize: 13, fill: "var(--color-muted-foreground)" }}
                  />
                  <YAxis
                    type="number"
                    label={{ value: "v (µmol/min)", angle: -90, position: "insideLeft", offset: 6, fontSize: 13, fill: "var(--color-muted-foreground)" }}
                    tick={{ fontSize: 13, fill: "var(--color-muted-foreground)" }}
                  />
                  <Tooltip
                    formatter={(value) => (typeof value === "number" ? value.toFixed(2) : String(value))}
                    labelFormatter={(label) => `[S] = ${Number(label).toFixed(1)} mM`}
                    contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 13 }}
                  />
                  <ReferenceLine y={vmax} stroke="var(--color-muted-foreground)" strokeDasharray="4 4" label={{ value: "Vmax", position: "right", fontSize: 12, fill: "var(--color-muted-foreground)" }} />
                  <ReferenceLine x={km} stroke="var(--color-chart-1)" strokeDasharray="4 4" strokeWidth={1.5} label={{ value: "Km", position: "top", fontSize: 12, fill: "var(--color-chart-1)", fontWeight: "bold" }} />
                  <Line dataKey="v" stroke="var(--color-chart-1)" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Lineweaver–Burk: 1/v vs 1/[S]</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full">
              <ResponsiveContainer>
                <LineChart data={data.filter((d) => d.invV !== undefined)} margin={{ top: 16, right: 16, left: 8, bottom: 28 }}>
                  <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 5" />
                  <XAxis
                    dataKey="invS"
                    type="number"
                    domain={[-0.5, 2]}
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
                    formatter={(value) => (typeof value === "number" ? value.toFixed(3) : String(value))}
                    labelFormatter={(label) => `1/[S] = ${Number(label).toFixed(2)}`}
                    contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 13 }}
                  />
                  <ReferenceLine y={1 / vmax} stroke="var(--color-muted-foreground)" strokeDasharray="4 4" label={{ value: "1/Vmax", position: "right", fontSize: 12, fill: "var(--color-muted-foreground)" }} />
                  <ReferenceLine x={-1 / km} stroke="var(--color-chart-1)" strokeDasharray="4 4" strokeWidth={1.5} label={{ value: "-1/Km", position: "top", fontSize: 12, fill: "var(--color-chart-1)", fontWeight: "bold" }} />
                  <Line dataKey="invV" stroke="var(--color-chart-1)" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </ExperimentShell>
  );
}
