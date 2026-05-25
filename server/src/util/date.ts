// December payments are counted to the next year since nothing happens in December.
export const getMembershipYear = (): number => {
  const now = new Date();
  const month = now.getMonth(); // 0-indexed, 11 = December
  const year = now.getFullYear();
  return month === 11 ? year + 1 : year;
};
