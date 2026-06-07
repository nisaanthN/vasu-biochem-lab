import type { ProgressState } from "@/types/progress";

export function migrateProgress(state: unknown, fromVersion: number): ProgressState {
  // Migration scaffolding — future schema bumps land here.
  // For v1 we simply return a clean default-merged state.
  void fromVersion;
  return state as ProgressState;
}
