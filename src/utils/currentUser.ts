export function getCurrentUserUuid() {
  const basicUserData = localStorage.getItem('basicUserData');

  if (basicUserData) {
    try {
      const parsed = JSON.parse(basicUserData) as { userId?: string | number; uuid?: string | number };
      if (parsed.uuid) return String(parsed.uuid);
      if (parsed.userId) return String(parsed.userId);
    } catch {
      // Ignore malformed cached profile data and fall back to remembered id.
    }
  }

  return String(localStorage.getItem('kBuddyId') || '');
}

export const getCurrentUserId = getCurrentUserUuid;
