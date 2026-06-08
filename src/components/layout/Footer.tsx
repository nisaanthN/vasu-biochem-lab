import Link from "next/link";
import { Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-auto border-t bg-card/50">
      <div className="container mx-auto max-w-6xl px-4 py-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-md bg-primary text-primary-foreground">
                <Sparkles className="h-3.5 w-3.5" />
              </span>
              <p className="text-sm font-semibold">BioPharm Lab</p>
            </div>
            <p className="mt-1.5 text-xs text-muted-foreground">
              Aligned with the PCI B.Pharm BP203T Biochemistry syllabus. Offline-first; all data stays on your device.
            </p>
          </div>
          <div className="text-sm sm:text-right">
            <p className="font-semibold">
              Developed by <span className="text-primary">Durga Bhavani</span>
            </p>
            <p className="text-xs text-muted-foreground">
              B.Pharm Student · Shri Vishnu College of Pharmacy (Autonomous)
            </p>
            <p className="text-xs text-muted-foreground">
              Bhimavaram, Andhra Pradesh · Approved by PCI, AICTE, NAAC
            </p>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t pt-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <Link className="hover:text-foreground" href="/about">
              About
            </Link>
            <span aria-hidden>·</span>
            <Link className="hover:text-foreground" href="/notes">
              Notes
            </Link>
            <span aria-hidden>·</span>
            <Link className="hover:text-foreground" href="/experiments">
              Lab
            </Link>
            <span aria-hidden>·</span>
            <a
              className="hover:text-foreground"
              href="https://www.pci.nic.in"
              target="_blank"
              rel="noopener noreferrer"
            >
              PCI India
            </a>
          </div>
          <p>© {new Date().getFullYear()} — Educational student project, all rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
