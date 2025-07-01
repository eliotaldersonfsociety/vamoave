let sessions: Record<string, number> = {};
let pageViews: Record<string, number> = {};
let countryViews: Record<string, number> = {};

export function addSession(sessionId: string, pathname: string, country = 'Desconocido') {
  sessions[sessionId] = Date.now();
  pageViews[pathname] = (pageViews[pathname] || 0) + 1;
  countryViews[country] = (countryViews[country] || 0) + 1;
}

export function removeSession(sessionId: string) {
  delete sessions[sessionId];
}

export function getActiveUserCount(timeout = 30000) {
  const now = Date.now();
  return Object.values(sessions).filter(ts => now - ts < timeout).length;
}

export function getActivePages() {
  return pageViews;
}

export function getVisitStats() {
  const total = Object.values(pageViews).reduce((acc, val) => acc + val, 0);
  return {
    total,
    rutasCount: { ...pageViews },
    countryCount: { ...countryViews },
  };
}
