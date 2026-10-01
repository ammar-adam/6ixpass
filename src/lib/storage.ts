// localStorage can throw (private mode, blocked storage). Never let it break the page.
export function getItem(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function setItem(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* ignore */
  }
}

export const JOINED_KEY = "t6p_joined";
export const SNOOZE_KEY = "t6p_popup_snooze_until";
export const OPEN_WAITLIST_EVENT = "t6p:open-waitlist";
export const JOINED_EVENT = "t6p:joined";
