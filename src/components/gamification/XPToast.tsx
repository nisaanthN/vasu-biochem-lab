"use client";

import { toast } from "sonner";

export function showXPToast(amount: number, label: string) {
  if (amount <= 0) return;
  toast(`+${amount} XP`, { description: label, duration: 2000 });
}
