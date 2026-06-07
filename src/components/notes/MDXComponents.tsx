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
    info: "border-blue-500/40 bg-blue-50 dark:bg-blue-950/30 text-blue-950 dark:text-blue-100",
    success: "border-emerald-500/40 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-950 dark:text-emerald-100",
    warning: "border-amber-500/40 bg-amber-50 dark:bg-amber-950/30 text-amber-950 dark:text-amber-100",
    danger: "border-rose-500/40 bg-rose-50 dark:bg-rose-950/30 text-rose-950 dark:text-rose-100",
  }[variant];
  const iconColor = {
    info: "text-blue-600 dark:text-blue-400",
    success: "text-emerald-600 dark:text-emerald-400",
    warning: "text-amber-600 dark:text-amber-400",
    danger: "text-rose-600 dark:text-rose-400",
  }[variant];
  const Icon =
    variant === "warning" ? AlertTriangle : variant === "danger" ? AlertTriangle : variant === "success" ? CheckCircle2 : Info;
  return (
    <div className={`my-6 rounded-xl border-l-4 p-5 ${styles}`}>
      <div className="flex items-start gap-3">
        <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${iconColor}`} />
        <div className="min-w-0 flex-1">
          {title && <p className="mb-1.5 text-base font-bold">{title}</p>}
          <div className="text-[15px] leading-relaxed [&_p]:m-0 [&_p+p]:mt-3 [&_strong]:font-semibold">{children}</div>
        </div>
      </div>
    </div>
  );
}

export function KeyPoint({ children }: { children: ReactNode }) {
  return (
    <div className="my-6 flex items-start gap-3 rounded-xl border-2 border-primary/30 bg-primary/5 p-5">
      <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
      <div className="text-[15px] leading-relaxed [&_strong]:font-semibold">{children}</div>
    </div>
  );
}

export function Mnemonic({ phrase, children }: { phrase: string; children: ReactNode }) {
  return (
    <div className="my-6 overflow-hidden rounded-xl border-2 bg-card">
      <div className="bg-muted/50 px-5 py-2.5">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <Brain className="h-3.5 w-3.5" /> Mnemonic
        </div>
      </div>
      <div className="px-5 py-4">
        <p className="text-lg font-semibold leading-snug">{phrase}</p>
        <div className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{children}</div>
      </div>
    </div>
  );
}

export function ReactionScheme({ children }: { children: ReactNode }) {
  return (
    <pre className="my-5 overflow-x-auto rounded-lg border bg-muted/30 p-4 font-mono text-sm leading-relaxed">
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
    <h1 className="mb-5 mt-10 text-4xl font-bold tracking-tight leading-tight" {...p} />
  ),
  h2: (p: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="mb-4 mt-10 text-3xl font-semibold tracking-tight leading-tight" {...p} />
  ),
  h3: (p: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="mb-3 mt-8 text-2xl font-semibold leading-snug" {...p} />
  ),
  h4: (p: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4 className="mb-2 mt-6 text-xl font-semibold leading-snug" {...p} />
  ),
  p: (p: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="mb-5 text-[17px] leading-[1.75] text-foreground/90" {...p} />
  ),
  ul: (p: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="mb-5 ml-7 list-disc space-y-2 text-[17px] text-foreground/90 marker:text-muted-foreground" {...p} />
  ),
  ol: (p: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="mb-5 ml-7 list-decimal space-y-2 text-[17px] text-foreground/90 marker:text-muted-foreground" {...p} />
  ),
  li: (p: React.HTMLAttributes<HTMLLIElement>) => <li className="leading-[1.7]" {...p} />,
  strong: (p: React.HTMLAttributes<HTMLElement>) => <strong className="font-semibold text-foreground" {...p} />,
  em: (p: React.HTMLAttributes<HTMLElement>) => <em className="italic" {...p} />,
  blockquote: (p: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote className="my-5 border-l-4 border-primary/40 bg-muted/30 px-5 py-3 text-[17px] italic leading-relaxed text-muted-foreground" {...p} />
  ),
  code: (p: React.HTMLAttributes<HTMLElement>) => (
    <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.92em] font-medium text-foreground" {...p} />
  ),
  pre: (p: React.HTMLAttributes<HTMLPreElement>) => (
    <pre className="my-5 overflow-x-auto rounded-lg border bg-muted/30 p-4 font-mono text-sm leading-relaxed" {...p} />
  ),
  hr: () => <hr className="my-8 border-border" />,
  table: (p: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="my-5 overflow-x-auto rounded-lg border">
      <table className="w-full border-collapse text-[15px]" {...p} />
    </div>
  ),
  thead: (p: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <thead className="bg-muted/50" {...p} />
  ),
  th: (p: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th className="border-b px-4 py-3 text-left font-semibold" {...p} />
  ),
  td: (p: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td className="border-b border-border/60 px-4 py-3 align-top leading-relaxed" {...p} />
  ),
  tr: (p: React.HTMLAttributes<HTMLTableRowElement>) => (
    <tr className="last:[&>td]:border-b-0" {...p} />
  ),
  a: (p: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a className="font-medium text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary" {...p} />
  ),
};
