// Standard genetic code — mRNA codon → 3-letter amino acid (or "Stop")
export const CODON_TABLE: Record<string, { aa: string; full: string }> = {
  UUU: { aa: "Phe", full: "Phenylalanine" }, UUC: { aa: "Phe", full: "Phenylalanine" },
  UUA: { aa: "Leu", full: "Leucine" }, UUG: { aa: "Leu", full: "Leucine" },
  UCU: { aa: "Ser", full: "Serine" }, UCC: { aa: "Ser", full: "Serine" },
  UCA: { aa: "Ser", full: "Serine" }, UCG: { aa: "Ser", full: "Serine" },
  UAU: { aa: "Tyr", full: "Tyrosine" }, UAC: { aa: "Tyr", full: "Tyrosine" },
  UAA: { aa: "Stop", full: "Stop (ochre)" }, UAG: { aa: "Stop", full: "Stop (amber)" },
  UGU: { aa: "Cys", full: "Cysteine" }, UGC: { aa: "Cys", full: "Cysteine" },
  UGA: { aa: "Stop", full: "Stop (opal)" },
  UGG: { aa: "Trp", full: "Tryptophan" },
  CUU: { aa: "Leu", full: "Leucine" }, CUC: { aa: "Leu", full: "Leucine" },
  CUA: { aa: "Leu", full: "Leucine" }, CUG: { aa: "Leu", full: "Leucine" },
  CCU: { aa: "Pro", full: "Proline" }, CCC: { aa: "Pro", full: "Proline" },
  CCA: { aa: "Pro", full: "Proline" }, CCG: { aa: "Pro", full: "Proline" },
  CAU: { aa: "His", full: "Histidine" }, CAC: { aa: "His", full: "Histidine" },
  CAA: { aa: "Gln", full: "Glutamine" }, CAG: { aa: "Gln", full: "Glutamine" },
  CGU: { aa: "Arg", full: "Arginine" }, CGC: { aa: "Arg", full: "Arginine" },
  CGA: { aa: "Arg", full: "Arginine" }, CGG: { aa: "Arg", full: "Arginine" },
  AUU: { aa: "Ile", full: "Isoleucine" }, AUC: { aa: "Ile", full: "Isoleucine" },
  AUA: { aa: "Ile", full: "Isoleucine" },
  AUG: { aa: "Met", full: "Methionine (Start)" },
  ACU: { aa: "Thr", full: "Threonine" }, ACC: { aa: "Thr", full: "Threonine" },
  ACA: { aa: "Thr", full: "Threonine" }, ACG: { aa: "Thr", full: "Threonine" },
  AAU: { aa: "Asn", full: "Asparagine" }, AAC: { aa: "Asn", full: "Asparagine" },
  AAA: { aa: "Lys", full: "Lysine" }, AAG: { aa: "Lys", full: "Lysine" },
  AGU: { aa: "Ser", full: "Serine" }, AGC: { aa: "Ser", full: "Serine" },
  AGA: { aa: "Arg", full: "Arginine" }, AGG: { aa: "Arg", full: "Arginine" },
  GUU: { aa: "Val", full: "Valine" }, GUC: { aa: "Val", full: "Valine" },
  GUA: { aa: "Val", full: "Valine" }, GUG: { aa: "Val", full: "Valine" },
  GCU: { aa: "Ala", full: "Alanine" }, GCC: { aa: "Ala", full: "Alanine" },
  GCA: { aa: "Ala", full: "Alanine" }, GCG: { aa: "Ala", full: "Alanine" },
  GAU: { aa: "Asp", full: "Aspartate" }, GAC: { aa: "Asp", full: "Aspartate" },
  GAA: { aa: "Glu", full: "Glutamate" }, GAG: { aa: "Glu", full: "Glutamate" },
  GGU: { aa: "Gly", full: "Glycine" }, GGC: { aa: "Gly", full: "Glycine" },
  GGA: { aa: "Gly", full: "Glycine" }, GGG: { aa: "Gly", full: "Glycine" },
};

export const DNA_COMPLEMENT: Record<string, string> = { A: "T", T: "A", G: "C", C: "G" };
export const DNA_TO_RNA: Record<string, string> = { A: "U", T: "A", G: "C", C: "G" };

export function transcribe(templateDna: string): string {
  return templateDna.toUpperCase().split("").map((b) => DNA_TO_RNA[b] ?? "?").reverse().join("");
}

export function translate(mrna: string): { codon: string; aa: string; full: string }[] {
  const out: { codon: string; aa: string; full: string }[] = [];
  for (let i = 0; i + 3 <= mrna.length; i += 3) {
    const codon = mrna.slice(i, i + 3);
    const entry = CODON_TABLE[codon];
    if (!entry) {
      out.push({ codon, aa: "?", full: "Unknown" });
      continue;
    }
    out.push({ codon, aa: entry.aa, full: entry.full });
    if (entry.aa === "Stop") break;
  }
  return out;
}
