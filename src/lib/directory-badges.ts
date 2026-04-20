import type { DirectoryBadgeStatus } from "@/types/database";

/**
 * Directory badge workflow values (see StoryPay migration 031). Only
 * `'approved'` renders on the public site. Anything else — pending reviews,
 * drafts, rejections — stays hidden so couples never see half-baked state.
 */
export function isPublicVerifiedStatus(
  status: DirectoryBadgeStatus | string | null | undefined
): boolean {
  return status === "approved";
}

export function isPublicSponsoredStatus(
  status: DirectoryBadgeStatus | string | null | undefined
): boolean {
  return status === "approved";
}

/**
 * Compact boolean view of a venue's public badges. Handy for feeding into
 * DirectoryListingBadges / sort comparators without repeating the `===`.
 */
export function resolveBadges(v: {
  directory_verified_status?: DirectoryBadgeStatus | string | null;
  directory_sponsored_status?: DirectoryBadgeStatus | string | null;
}): { verified: boolean; sponsored: boolean } {
  return {
    verified: isPublicVerifiedStatus(v.directory_verified_status ?? null),
    sponsored: isPublicSponsoredStatus(v.directory_sponsored_status ?? null),
  };
}
