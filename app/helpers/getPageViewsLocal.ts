// app/helpers/getPageViewsLocal.ts
export function getPageViewsLocal(): number {
  const visitas = JSON.parse(localStorage.getItem("visitas") || "{}");
  return Object.values(visitas).reduce((acc: number, count: any) => acc + Number(count || 0), 0);
}
