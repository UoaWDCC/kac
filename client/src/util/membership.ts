/**
 * Mirrors `getMembershipYear` in server/src/util/date.ts — December counts
 * towards the following year, so someone joining in December gets next year's
 * membership rather than one that expires in weeks.
 *
 * Display only. The server is the source of truth for whether a membership is
 * current; this just labels the UI.
 */
export const getMembershipYear = (): number => {
  const now = new Date();
  return now.getMonth() === 11 ? now.getFullYear() + 1 : now.getFullYear();
};
