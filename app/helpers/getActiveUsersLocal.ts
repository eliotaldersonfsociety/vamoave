// app/helpers/getActiveUsersLocal.ts
export function getActiveUsersLocal(timeoutMs = 35000): number {
  const raw = localStorage.getItem("active-users");
  if (!raw) return 0;

  try {
    const activeUsers = JSON.parse(raw);
    const now = Date.now();

    const validUsers = Object.values(activeUsers).filter((u: any) => now - u.timestamp < timeoutMs);
    return validUsers.length;
  } catch {
    return 0;
  }
}
