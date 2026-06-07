import Link from "next/link";
import { Beaker, ArrowRight, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EXPERIMENTS } from "@/lib/content/experiments";
import { getUnit } from "@/lib/content/syllabus";

export const metadata = {
  title: "Virtual experiments",
  description: "Five interactive biochemistry simulations covering enzymes, sugars, central dogma, and metabolism.",
};

export default function ExperimentsPage() {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">Virtual laboratory</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">Five experiments to internalise</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Each experiment is a focused, sliders-and-charts simulation of a single concept from the BP203T syllabus. Completing one earns +50 XP and counts toward the Master Experimenter badge.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {EXPERIMENTS.map((e) => {
          const unit = getUnit(e.unitId);
          return (
            <Card key={e.slug} className="transition hover:border-primary/40">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Beaker className="h-5 w-5" />
                  </div>
                  <Badge variant="secondary" className="rounded-md uppercase">
                    {e.unitId.replace("-", " ")}
                  </Badge>
                </div>
                <CardTitle className="mt-3 text-lg">{e.title}</CardTitle>
                <CardDescription>{e.objective}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {e.estimatedMinutes} min
                  </span>
                  <span>{unit?.title}</span>
                </div>
                <Link
                  href={`/experiments/${e.slug}`}
                  className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  Open experiment <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
