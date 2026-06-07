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
  Legend,
} from "recharts";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExperimentShell } from "./ExperimentShell";

const STEPS = 60;
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
        <ul className="space-y-1">
          <li>
            At <strong>[S] = Km = {km.toFixed(1)} mM</strong>, the reaction rate is exactly half of Vmax = <strong>{halfVmax.toFixed(1)} µmol/min</strong>.
          </li>
          <li>
            Lineweaver–Burk y-intercept = 1/Vmax = <strong>{(1 / vmax).toFixed(4)}</strong>; x-intercept = −1/Km = <strong>{(-1 / km).toFixed(3)}</strong>.
          </li>
          <li>
            Doubling [S] from Km gives a new v of{" "}
            <strong>{((vmax * (2 * km)) / (km + 2 * km)).toFixed(1)}</strong>{" "}
            (about {(((vmax * 2) / 3) / vmax * 100).toFixed(0)}% of Vmax — note the diminishing returns).
          </li>
        </ul>
      }
    >
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="mb-1 flex justify-between text-sm">
                <span>Vmax (µmol/min)</span>
                <span className="font-mono">{vmax.toFixed(0)}</span>
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
              <div className="mb-1 flex justify-between text-sm">
                <span>Km (mM)</span>
                <span className="font-mono">{km.toFixed(1)}</span>
              </div>
              <Slider
                value={[km]}
                onValueChange={(v) => setKm(v[0])}
                min={0.5}
                max={30}
                step={0.1}
              />
            </div>
            <div className="rounded-md bg-muted/50 p-3 text-xs leading-relaxed text-muted-foreground">
              <p>
                <strong className="text-foreground">Tip:</strong> Watch the left plot — at [S] = Km the curve reaches Vmax/2. Then look at the right plot: the line crosses the y-axis at 1/Vmax and the x-axis at −1/Km. Slide Vmax — only y-intercept moves. Slide Km — only x-intercept moves.
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-sm">v vs [S]</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer>
                <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 16 }}>
                  <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="2 4" />
                  <XAxis
                    dataKey="s"
                    type="number"
                    domain={[0, S_MAX]}
                    label={{ value: "[S] (mM)", position: "insideBottom", offset: -10, fontSize: 11 }}
                    tickFormatter={(v) => v.toFixed(0)}
                    fontSize={11}
                  />
                  <YAxis
                    type="number"
                    label={{ value: "v (µmol/min)", angle: -90, position: "insideLeft", offset: 12, fontSize: 11 }}
                    fontSize={11}
                  />
                  <Tooltip
                    formatter={(value) => (typeof value === "number" ? value.toFixed(2) : String(value))}
                    labelFormatter={(label) => `[S] = ${Number(label).toFixed(1)}`}
                  />
                  <ReferenceLine y={vmax} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" label={{ value: "Vmax", position: "right", fontSize: 10 }} />
                  <ReferenceLine x={km} stroke="hsl(var(--primary))" strokeDasharray="3 3" label={{ value: "Km", position: "top", fontSize: 10 }} />
                  <Line dataKey="v" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-sm">Lineweaver–Burk: 1/v vs 1/[S]</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer>
                <LineChart data={data.filter((d) => d.invV !== undefined)} margin={{ top: 5, right: 10, left: 0, bottom: 16 }}>
                  <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="2 4" />
                  <XAxis
                    dataKey="invS"
                    type="number"
                    domain={[-0.5, 2]}
                    label={{ value: "1 / [S]", position: "insideBottom", offset: -10, fontSize: 11 }}
                    tickFormatter={(v) => v.toFixed(2)}
                    fontSize={11}
                  />
                  <YAxis
                    type="number"
                    domain={[0, "auto"]}
                    label={{ value: "1 / v", angle: -90, position: "insideLeft", offset: 12, fontSize: 11 }}
                    fontSize={11}
                  />
                  <Tooltip
                    formatter={(value) => (typeof value === "number" ? value.toFixed(3) : String(value))}
                    labelFormatter={(label) => `1/[S] = ${Number(label).toFixed(2)}`}
                  />
                  <ReferenceLine y={1 / vmax} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" label={{ value: "1/Vmax", position: "right", fontSize: 10 }} />
                  <ReferenceLine x={-1 / km} stroke="hsl(var(--primary))" strokeDasharray="3 3" label={{ value: "-1/Km", position: "top", fontSize: 10 }} />
                  <Line dataKey="invV" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </ExperimentShell>
  );
}
