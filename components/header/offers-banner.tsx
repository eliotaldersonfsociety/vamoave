import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function OffersBanner() {
  return (
    <Link href="/offers" className="block w-full bg-[#d1d5db] text-{#282c31} py-2 hover:bg-[#9ca3af] transition-colors">
      <div className="container mx-auto flex items-center justify-center">
        <span className="font-medium">Mira las últimas ofertas</span>
        <ArrowRight className="h-4 w-4 ml-2" />
      </div>
    </Link>
  )
}

