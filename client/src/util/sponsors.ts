export interface Sponsor {
  _id?: string;
  name: string;
  description: string;
  category: "cbd" | "newmarket" | "other";
}

// The CMS image tag used by ImageBlock for a given sponsor.
export function sponsorPageKey(name: string): string {
  return "sponsor-" + name.toLowerCase().replace(/\s+/g, "-");
}

export function dedupeSponsorsByName(sponsors: Sponsor[]): Sponsor[] {
  return sponsors.filter(
    (s, index, self) => index === self.findIndex((t) => t.name === s.name)
  );
}

// Fisher-Yates shuffle, then take the first `count` sponsors.
export function pickRandomSponsors(
  sponsors: Sponsor[],
  count: number
): Sponsor[] {
  const pool = dedupeSponsorsByName(sponsors);

  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  return pool.slice(0, count);
}
