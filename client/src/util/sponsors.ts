export interface Sponsor {
  name: string;
  deal: string;
  address: string;
  category: "cbd" | "newmarket" | "other";
  code?: string;
}

// The CMS image tag used by ImageBlock for a given sponsor.
export function sponsorPageKey(name: string): string {
  return "sponsor-" + name.toLowerCase().replace(/\s+/g, "-");
}

// Trim the suburb off the address, since it is already implied by the section.
export function formatSponsorLocation(sponsor: Sponsor): string {
  switch (sponsor.category) {
    case "cbd":
      return sponsor.address
        .replace(/, Auckland CBD$/i, "")
        .replace(/, Auckland City$/i, "");
    case "newmarket":
      return sponsor.address.replace(/, Newmarket$/i, "");
    default:
      return sponsor.address;
  }
}

export function formatSponsorDeal(sponsor: Sponsor): string {
  return sponsor.deal + (sponsor.code ? ` (Code: ${sponsor.code})` : "");
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
