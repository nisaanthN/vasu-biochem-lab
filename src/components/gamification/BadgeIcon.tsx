"use client";

import {
  Sparkles,
  BookOpen,
  Library,
  ClipboardList,
  Target,
  Flame,
  Gem,
  Beaker,
  FlaskConical,
  Atom,
  GitBranch,
  MessageCircleQuestion,
  TrendingUp,
  Languages,
  Shield,
  Trophy,
  Award,
  type LucideIcon,
} from "lucide-react";

const MAP: Record<string, LucideIcon> = {
  sparkles: Sparkles,
  "book-open": BookOpen,
  library: Library,
  "clipboard-list": ClipboardList,
  target: Target,
  flame: Flame,
  gem: Gem,
  beaker: Beaker,
  "flask-conical": FlaskConical,
  atom: Atom,
  "git-branch": GitBranch,
  "message-circle-question": MessageCircleQuestion,
  "trending-up": TrendingUp,
  languages: Languages,
  shield: Shield,
  trophy: Trophy,
  award: Award,
};

export function BadgeIcon({ name, className }: { name: string; className?: string }) {
  const Comp = MAP[name] ?? Sparkles;
  return <Comp className={className} />;
}
