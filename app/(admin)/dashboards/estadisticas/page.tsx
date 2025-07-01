import { getVisitasStats } from "@/app/helpers/getVisitasStats";
import WebAnalyticsClient from "@/components/web-analytics";
import { DashboardLayouts } from "@/components/dashboard-layouts";

export default async function AnalyticsPage() {
  const stats = await getVisitasStats();

  return (
    <>
      <div className="w-full bg-gray-100 min-h-screen">
      <div className="w-full max-w-[1200px] mx-auto flex flex-col gap-4 p-4 md:p-8">
      <main className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Panel de Análisis Web</h1>
        <WebAnalyticsClient stats={stats} />
      </main>
    <DashboardLayouts>
      <></>
    </DashboardLayouts>
        </div>
        </div>
    </>
  );
}
