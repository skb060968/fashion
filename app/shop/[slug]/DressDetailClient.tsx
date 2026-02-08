"use client"

/* =========== Design Detail Page - Inquiry + Direct Buy =========== */

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { dresses } from "@/lib/data/shop"
import { formatRupees } from "@/lib/money"
import { useCart } from "@/context/CartContext"

type Dress = (typeof dresses)[number]

export default function DressDetailClient({ dress }: { dress: Dress }) {
  const router = useRouter()
  const { addToCart } = useCart()

  const [activeImage, setActiveImage] = useState(dress.coverImage)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)

  const handleBackToPortfolio = () => {
    router.push("/shop")
  }

  const handleInquire = () => {
    router.push(`/contact?design=${dress.slug}`)
  }

  const handleGetThisDress = () => {
    if (!selectedSize) return
    addToCart({
      slug: dress.slug,
      name: dress.name,
      price: dress.price,
      coverThumbnail: dress.coverThumbnail,
      size: selectedSize,
      quantity,
    })
    router.push("/cart")
  }

  return (
    <section className="pt-24 sm:pt-32 pb-16 sm:pb-28 bg-stone-50">
      <div className="container-max">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 lg:gap-24 items-start">
          {/* IMAGE COLUMN */}
          <div className="flex flex-col items-center w-full">
            <div className="relative inline-block w-full max-w-md">
              <div className="relative p-3 sm:p-4 bg-gradient-to-br from-stone-100 via-white to-stone-100 rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl">
                <div className="relative overflow-hidden rounded-xl sm:rounded-2xl shadow-lg ring-1 ring-stone-200">
                  <div className="w-full aspect-[3/4] bg-stone-100 relative">
                    <Image
                      src={activeImage}
                      alt={dress.name}
                      fill
                      className="object-cover"
                      priority
                      sizes="(max-width: 768px) 90vw, 500px"
                    />
                  </div>
                </div>
              </div>
            </div>

            {dress.thumbnails.length > 1 && (
              <div className="mt-6 sm:mt-8 w-full max-w-md px-2">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3 text-center">
                  View Gallery
                </p>
                <div className="flex gap-1.5 sm:gap-2 justify-center overflow-x-auto pb-2">
                  {[...dress.thumbnails].reverse().map((thumb, index) => {
                    const filename = thumb.split("/").pop()
                    const correspondingItem = dress.images.find(img =>
                      img.endsWith(filename || "")
                    )
                    const isActive = correspondingItem === activeImage

                    return (
                      <button
                        key={thumb}
                        type="button"
                        onClick={() =>
                          setActiveImage(correspondingItem || dress.coverImage)
                        }
                        aria-pressed={isActive}
                        className={`relative flex-shrink-0 w-12 sm:w-14 md:w-16 aspect-[3/4] rounded-md overflow-hidden transition-all duration-300 ease-out
                          ${
                            isActive
                              ? "ring-2 ring-fashion-gold shadow-md scale-105 -translate-y-0.5"
                              : "ring-1 ring-stone-200 hover:ring-stone-300 hover:shadow-md hover:scale-105"
                          }`}
                      >
                        <Image
                          src={thumb}
                          alt={`${dress.name} view ${index + 1}`}
                          width={150}
                          height={200}
                          className="object-cover w-full h-full"
                        />
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* CONTENT COLUMN */}
          <div className="w-full max-w-xl px-4 sm:px-0">
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-fashion-black mb-3">
              {dress.name}
            </h1>

            <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-8 sm:mb-12">
              {dress.description}
            </p>
                        {/* Design Details */}
            <div className="mb-6 sm:mb-8 p-5 sm:p-6 bg-white rounded-xl shadow-sm">
              <h3 className="font-serif text-base sm:text-lg font-bold text-fashion-black mb-3 sm:mb-4">
                Design Details
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="text-fashion-gold mr-2">•</span>
                  <span><strong>Available Sizes:</strong> S, M, L, XL</span>
                </li>
                <li className="flex items-start"><span className="text-fashion-gold mr-2">•</span>Custom sizing available upon request</li>
                <li className="flex items-start"><span className="text-fashion-gold mr-2">•</span>Made-to-order with 4-6 week lead time</li>
                <li className="flex items-start"><span className="text-fashion-gold mr-2">•</span>Premium fabric and artisanal craftsmanship</li>
                <li className="flex items-start"><span className="text-fashion-gold mr-2">•</span>Sustainable and ethical production</li>
              </ul>
            </div>

            {/* Size & Quantity selectors */}
            <div className="mb-6 sm:mb-8 p-5 sm:p-6 bg-white rounded-xl shadow-sm border border-stone-200">
              <h3 className="font-serif text-base sm:text-lg font-bold text-fashion-black mb-3 sm:mb-4">
                Select Options
              </h3>
              <div className="mb-4">
                <p className="text-sm font-medium mb-2">Size</p>
                <div className="flex gap-3">
                  {["S","M","L","XL"].map(size => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      aria-pressed={selectedSize === size}
                      className={`px-5 py-2.5 rounded-full text-sm transition
                        ${selectedSize === size
                          ? "border border-fashion-gold bg-fashion-gold/50 text-fashion-black"
                          : "bg-white border border-gray-300 text-gray-700 hover:border-gray-500"}
                      `}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Quantity</p>
                <select
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  className="border rounded px-4 py-2"
                  aria-label="Quantity"
                >
                  {[...Array(10)].map((_, i) => (
                    <option key={i+1} value={i+1}>{i+1}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* CTA row */}
            <div className="flex flex-col gap-6 mb-10">
              <button
                onClick={handleInquire}
                className="w-full px-10 py-4 rounded-full text-sm font-semibold border-2 border-fashion-gold bg-fashion-gold text-white hover:bg-transparent hover:text-fashion-gold transition-all duration-300 shadow-md hover:shadow-xl"
              >
                Request Information
              </button>

              <button
                type="button"
                onClick={handleGetThisDress}
                disabled={!selectedSize}
                aria-disabled={!selectedSize}
                className="w-full px-10 py-4 rounded-full text-sm font-semibold border-2 border-fashion-gold bg-fashion-gold text-white hover:bg-transparent hover:text-fashion-gold transition-all duration-300 shadow-md hover:shadow-xl"
              >
                Get This Dress
              </button>

              <button
                onClick={handleBackToPortfolio}
                className="px-10 py-4 rounded-full text-sm font-medium border border-gray-300 text-gray-700 hover:border-fashion-gold hover:text-fashion-black transition"
              >
                ← Back to Portfolio
              </button>
            </div>

                     {/* Info note */}
            <div className="text-xs text-gray-500 text-center">
              <p>
                Interested in this design? You can request customization details
                or buy directly using the options above.
              </p>
            </div>
          </div> {/* end CONTENT COLUMN */}
        </div>   {/* end grid */}
      </div>     {/* end container-max */}
    </section>
  )
}