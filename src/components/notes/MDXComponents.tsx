import { Info, Lightbulb, Brain, AlertTriangle, CheckCircle2 } from "lucide-react";
import type { ReactNode } from "react";

export function Callout({
  children,
  variant = "info",
  title,
}: {
  children: ReactNode;
  variant?: "info" | "success" | "warning" | "danger";
  title?: string;
}) {
  const styles = {
    info: "border-blue-500/30 bg-blue-500/5 text-blue-950 dark:text-blue-100",
    success: "border-emerald-500/30 bg-emerald-500/5 text-emerald-950 dark:text-emerald-100",
    warning: "border-amber-500/30 bg-amber-500/5 text-amber-950 dark:text-amber-100",
    danger: "border-rose-500/30 bg-rose-500/5 text-rose-950 dark:text-rose-100",
  }[variant];
  const Icon =
    variant === "warning" ? AlertTriangle : variant === "danger" ? AlertTriangle : variant === "success" ? CheckCircle2 : Info;
  return (
    <div className={`my-4 rounded-lg border-l-4 p-4 ${styles}`}>
      <div className="flex items-start gap-2">
        <Icon className="mt-0.5 h-4 w-4 shrink-0" />
        <div>
          {title && <p className="mb-1 font-semibold">{title}</p>}
          <div className="text-sm [&_p]:m-0 [&_p+p]:mt-2">{children}</div>
        </div>
      </div>
    </div>
  );
}

export function KeyPoint({ children }: { children: ReactNode }) {
  return (
    <div className="my-4 flex items-start gap-3 rounded-lg border border-primary/30 bg-primary/5 p-4">
      <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
      <div className="text-sm">{children}</div>
    </div>
  );
}

export function Mnemonic({ phrase, children }: { phrase: string; children: ReactNode }) {
  return (
    <div className="my-4 rounded-lg border bg-card p-4">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
        <Brain className="h-3.5 w-3.5" /> Mnemonic
      </div>
      <p className="mt-1 text-base font-semibold">{phrase}</p>
      <div className="mt-2 text-sm text-muted-foreground">{children}</div>
    </div>
  );
}

export function ReactionScheme({ children }: { children: ReactNode }) {
  return (
    <pre className="my-4 overflow-x-auto rounded-md border bg-card p-4 font-mono text-sm leading-relaxed">
      {children}
    </pre>
  );
}

export function Term({ name, children }: { name: string; children?: ReactNode }) {
  return (
    <span
      className="cursor-help border-b border-dotted border-muted-foreground/60 underline-offset-2"
      title={typeof children === "string" ? children : name}
    >
      {name}
    </span>
  );
}

export const mdxComponents = {
  Callout,
  KeyPoint,
  Mnemonic,
  ReactionScheme,
  Term,
  h1: (p: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className="mb-4 mt-8 text-3xl font-bold tracking-tight" {...p} />
  ),
  h2: (p: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="mb-3 mt-8 text-2xl font-semibold tracking-tight" {...p} />
  ),
  h3: (p: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="mb-2 mt-6 text-xl font-semibold" {...p} />
  ),
  h4: (p: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4 className="mb-2 mt-5 text-lg font-semibold" {...p} />
  ),
  p: (p: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="mb-4 leading-7 text-foreground/90" {...p} />
  ),
  ul: (p: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="mb-4 ml-6 list-disc space-y-1.5 text-foreground/90" {...p} />
  ),
  ol: (p: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="mb-4 ml-6 list-decimal space-y-1.5 text-foreground/90" {...p} />
  ),
  li: (p: React.HTMLAttributes<HTMLLIElement>) => <li className="leading-7" {...p} />,
  strong: (p: React.HTMLAttributes<HTMLElement>) => <strong className="font-semibold" {...p} />,
  em: (p: React.HTMLAttributes<HTMLElement>) => <em className="italic" {...p} />,
  blockquote: (p: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote className="my-4 border-l-2 border-muted pl-4 italic text-muted-foreground" {...p} />
  ),
  code: (p: React.HTMLAttributes<HTMLElement>) => (
    <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.9em]" {...p} />
  ),
  pre: (p: React.HTMLAttributes<HTMLPreElement>) => (
    <pre className="my-4 overflow-x-auto rounded-md bg-card p-4 font-mono text-sm" {...p} />
  ),
  hr: () => <hr className="my-6 border-border" />,
  table: (p: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="my-4 overflow-x-auto">
      <table className="w-full border-collapse text-sm" {...p} />
    </div>
  ),
  th: (p: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th className="border border-border bg-muted/50 px-3 py-2 text-left font-semibold" {...p} />
  ),
  td: (p: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td className="border border-border px-3 py-2 align-top" {...p} />
  ),
};
