import type { GlossaryEntry } from '@/data/course/types';

export interface GlossaryMatch {
  term: string;
  definition: string;
  relatedTerms?: string[];
  start: number;
  end: number;
}

export class GlossaryMatcher {
  private entries: GlossaryEntry[];
  private lookupMap: Map<string, GlossaryEntry>;
  private sectionEntries: Map<number, GlossaryEntry[]>;
  private fullRegex: RegExp | null;
  private sectionRegex: Map<number, RegExp>;

  constructor(entries: GlossaryEntry[]) {
    this.entries = entries;
    this.lookupMap = new Map();
    this.sectionEntries = new Map();
    this.sectionRegex = new Map();

    for (const entry of entries) {
      this.lookupMap.set(entry.term.toLowerCase(), entry);

      const list = this.sectionEntries.get(entry.sectionIndex);
      if (list) {
        list.push(entry);
      } else {
        this.sectionEntries.set(entry.sectionIndex, [entry]);
      }
    }

    // Pre-compile regexes at construction time
    this.fullRegex = this.buildRegex(entries.map(e => e.term));
    for (const [idx, sectionEntries] of this.sectionEntries) {
      const regex = this.buildRegex(sectionEntries.map(e => e.term));
      if (regex) this.sectionRegex.set(idx, regex);
    }
  }

  private buildRegex(terms: string[]): RegExp | null {
    if (terms.length === 0) return null;

    const sorted = [...terms].sort((a, b) => b.length - a.length);
    const escaped = sorted.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const pattern = `\\b(${escaped.join('|')})\\b`;
    return new RegExp(pattern, 'gi');
  }

  findTerms(text: string, sectionIndex?: number): GlossaryMatch[] {
    const regex = sectionIndex !== undefined
      ? this.sectionRegex.get(sectionIndex)
      : this.fullRegex;

    if (!regex) return [];

    // Reset lastIndex since regex has 'g' flag and may be reused
    regex.lastIndex = 0;

    const matches: GlossaryMatch[] = [];
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
      const entry = this.lookupMap.get(match[1].toLowerCase());
      if (entry) {
        matches.push({
          term: entry.term,
          definition: entry.definition,
          relatedTerms: entry.relatedTerms,
          start: match.index,
          end: match.index + match[0].length,
        });
      }
    }

    return matches.sort((a, b) => a.start - b.start);
  }

  lookupTerm(term: string): GlossaryEntry | undefined {
    return this.lookupMap.get(term.toLowerCase());
  }
}
