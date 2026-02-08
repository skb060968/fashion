import { notFound } from "next/navigation"
import DressDetailClient from "./DressDetailClient"
import { dresses } from "@/lib/data/shop"

export default async function DressDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  // ✅ unwrap the Promise
  const { slug } = await params

  const dress = dresses.find((d) => d.slug === slug)

  if (!dress) {
    return notFound()
  }

  return <DressDetailClient dress={dress} />
}