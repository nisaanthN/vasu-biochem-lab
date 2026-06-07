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
    <div className="container mx-auto max-w-5xl px-4 py-10 sm:py-12">
      <div className="mb-10">
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">Virtual laboratory</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight leading-tight sm:text-5xl">Five experiments to internalise</h1>
        <p className="mt-3 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Each experiment is a focused, sliders-and-charts simulation of a single concept from the BP203T syllabus. Completing one earns +50 XP and counts toward the Master Experimenter badge.
        </p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        {EXPERIMENTS.map((e) => {
          const unit = getUnit(e.unitId);
          return (
            <Card key={e.slug} className="group border-2 transition hover:border-primary/40 hover:shadow-md">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary">
                    <Beaker className="h-6 w-6" />
                  </div>
                  <Badge variant="secondary" className="rounded-md uppercase tracking-wider">
                    {e.unitId.replace("-", " ")}
                  </Badge>
                </div>
                <CardTitle className="mt-4 text-xl leading-snug">{e.title}</CardTitle>
                <CardDescription className="text-[15px] leading-relaxed">{e.objective}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-4 w-4" /> {e.estimatedMinutes} min
                  </span>
                  <span>{unit?.title}</span>
                </div>
                <Link
                  href={`/experiments/${e.slug}`}
                  className="mt-4 inline-flex items-center gap-1.5 text-base font-medium text-primary hover:underline"
                >
                  Open experiment <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
