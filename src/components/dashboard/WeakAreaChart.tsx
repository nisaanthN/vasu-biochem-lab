"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import { useProgressStore } from "@/stores/progressStore";
import { useHydrated } from "@/hooks/useHydratedStore";
import { unitAccuracyBreakdown } from "@/lib/adaptive/weakAreas";

export function WeakAreaChart() {
  const hydrated = useHydrated();
  const tagStats = useProgressStore((s) => s.tagStats);
  const breakdown = unitAccuracyBreakdown(tagStats).map((u) => ({
    unit: u.unitId.replace("unit-", "U"),
    accuracy: u.accuracy === null ? 0 : Math.round(u.accuracy * 100),
    attempts: u.attempts,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Accuracy by unit</CardTitle>
        <CardDescription>
          {hydrated && breakdown.every((b) => b.attempts === 0)
            ? "Take a quiz to populate this chart."
            : "Your weakest unit is recommended next."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-48 w-full">
          <ResponsiveContainer>
            <BarChart data={breakdown}>
              <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="2 4" />
              <XAxis dataKey="unit" fontSize={11} />
              <YAxis domain={[0, 100]} fontSize={11} />
              <Tooltip
                formatter={(v, _name, _entry) => {
                  void _name; void _entry;
                  return [`${typeof v === "number" ? v : Number(v)}%`, "accuracy"];
                }}
              />
              <Bar dataKey="accuracy" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
