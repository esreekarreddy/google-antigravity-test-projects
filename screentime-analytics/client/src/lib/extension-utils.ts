export function getTodayKey() {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

export function getDomainFromUrl(url: string) {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace('www.', '');
  } catch (e) {
    return 'unknown';
  }
}
