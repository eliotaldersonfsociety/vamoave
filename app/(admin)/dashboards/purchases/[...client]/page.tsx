import { getAllPurchases } from "@/app/helpers/getAllPurchases";
import PurchasesClientPage from "./PurchasesClientPage";

export default async function PurchasesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const pageNumber = Number(page) || 1;

  const data = await getAllPurchases({ page: pageNumber });

  return <PurchasesClientPage initialPurchases={data} />;
}