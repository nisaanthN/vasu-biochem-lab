import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t bg-card/50">
      <div className="container mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <div>
          BioPharm Lab — open-syllabus learning aligned with PCI BP203T Biochemistry. Offline-first; your data stays on your device.
        </div>
        <div className="flex items-center gap-3">
          <Link className="hover:text-foreground" href="/about">
            About
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
      </div>
    </footer>
  );
}
