"use client"

/* =========== Design Detail Page - Inquiry Based =========== */

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { dresses } from "@/lib/data/shop"
import { collections } from "@/lib/data/collections"
import { formatRupees } from "@/lib/money"

type Dress = (typeof dresses)[number]

export default function DressDetailClient({ dress }: { dress: Dress }) {
  const router = useRouter()

  // Start with coverImage from items
  const [activeImage, setActiveImage] = useState(dress.coverImage)
  const [showSizeGuide, setShowSizeGuide] = useState(false)

  // Check if dress belongs to kidswear or menswear collection
  const isKidswear = collections.some(
    collection => collection.category === 'kidswear' && collection.dresses.includes(dress.slug)
  )
  const isMenswear = collections.some(
    collection => collection.category === 'menswear' && collection.dresses.includes(dress.slug)
  )

  const handleBackToPortfolio = () => {
    router.push("/shop")
  }

  const handleInquire = () => {
    // Redirect to contact page with pre-filled info
    router.push(`/contact?design=${dress.slug}`)
  }

  return (
    <section className="pt-24 sm:pt-32 pb-16 sm:pb-28 bg-stone-50">
      <div className="container-max">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 lg:gap-24 items-start">
          {/* ================= IMAGE COLUMN ================= */}
          <div className="flex flex-col items-center w-full">
            {/* Main Image with Premium Frame - Responsive */}
            <div className="relative inline-block w-full max-w-md">
              {/* Premium Frame */}
              <div className="relative p-3 sm:p-4 bg-gradient-to-br from-stone-100 via-white to-stone-100 rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl">
                {/* Decorative corner accents */}
                <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 w-6 h-6 sm:w-8 sm:h-8 border-t-2 border-l-2 border-fashion-gold rounded-tl-xl sm:rounded-tl-2xl"></div>
                <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-6 h-6 sm:w-8 sm:h-8 border-t-2 border-r-2 border-fashion-gold rounded-tr-xl sm:rounded-tr-2xl"></div>
                <div className="absolute bottom-1.5 left-1.5 sm:bottom-2 sm:left-2 w-6 h-6 sm:w-8 sm:h-8 border-b-2 border-l-2 border-fashion-gold rounded-bl-xl sm:rounded-bl-2xl"></div>
                <div className="absolute bottom-1.5 right-1.5 sm:bottom-2 sm:right-2 w-6 h-6 sm:w-8 sm:h-8 border-b-2 border-r-2 border-fashion-gold rounded-br-xl sm:rounded-br-2xl"></div>
                
                {/* Inner frame */}
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

            {/* Thumbnail Gallery - Compact for all screens */}
            {dress.thumbnails.length > 1 && (
              <div className="mt-6 sm:mt-8 w-full max-w-md px-2">
                {/* Gallery Label */}
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
                        onClick={() =>
                          setActiveImage(correspondingItem || dress.coverImage)
                        }
                        aria-pressed={isActive}
                        className={`
                          relative flex-shrink-0 w-12 sm:w-14 md:w-16 aspect-[3/4] rounded-md overflow-hidden
                          transition-all duration-300 ease-out
                          ${
                            isActive
                              ? "ring-2 ring-fashion-gold shadow-md scale-105 -translate-y-0.5"
                              : "ring-1 ring-stone-200 hover:ring-stone-300 hover:shadow-md hover:scale-105"
                          }
                        `}
                      >
                        {/* Active indicator overlay */}
                        {isActive && (
                          <div className="absolute inset-0 bg-gradient-to-t from-fashion-gold/30 to-transparent z-10 pointer-events-none"></div>
                        )}
                        
                        {/* Active checkmark */}
                        {isActive && (
                          <div className="absolute top-0.5 right-0.5 z-20 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-fashion-gold rounded-full flex items-center justify-center shadow-md">
                            <svg className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                        
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

          {/* ================= CONTENT COLUMN ================= */}
          <div className="w-full max-w-xl px-4 sm:px-0">
            
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-fashion-black mb-3">
              {dress.name}
            </h1>

     {/*    <p className="text-xl sm:text-2xl text-gray-700 mb-6 sm:mb-8">
              {formatRupees(dress.price)}
            </p>
     */}
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-8 sm:mb-12">
              {dress.description}
            </p>
    
            {/* Design Details with Available Sizes */}
            <div className="mb-6 sm:mb-8 p-5 sm:p-6 bg-white rounded-xl shadow-sm">
              <h3 className="font-serif text-base sm:text-lg font-bold text-fashion-black mb-3 sm:mb-4">
                Design Details
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="text-fashion-gold mr-2">•</span>
                  <span>
                    <strong>Available Sizes:</strong>{" "}
                    {isKidswear ? "1, 2, 3, 4, 5" : isMenswear ? "S, M, L, XL, XXL" : "S, M, L, XL"}
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-fashion-gold mr-2">•</span>
                  <span>Custom sizing available upon request</span>
                </li>
                <li className="flex items-start">
                  <span className="text-fashion-gold mr-2">•</span>
                  <span>Made-to-order with 4-6 week lead time</span>
                </li>
                <li className="flex items-start">
                  <span className="text-fashion-gold mr-2">•</span>
                  <span>Premium fabric and artisanal craftsmanship</span>
                </li>
                <li className="flex items-start">
                  <span className="text-fashion-gold mr-2">•</span>
                  <span>Sustainable and ethical production</span>
                </li>
              </ul>
            </div>

            {/* Size Guide */}
            <div className="mb-8 sm:mb-12 p-5 sm:p-6 bg-white rounded-xl shadow-sm border border-stone-200">
              <button
                onClick={() => setShowSizeGuide(!showSizeGuide)}
                className="w-full flex items-center justify-between text-left"
              >
                <h3 className="font-serif text-base sm:text-lg font-bold text-fashion-black">
                  Size Guide
                </h3>
                <svg
                  className={`w-5 h-5 text-fashion-gold transition-transform ${
                    showSizeGuide ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showSizeGuide && (
                <div className="mt-4 pt-4 border-t border-stone-200">
                  {isKidswear ? (
                    // Kidswear Size Guide
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-stone-200">
                            <th className="text-left py-2 font-semibold text-fashion-black">Size</th>
                            <th className="text-left py-2 font-semibold text-fashion-black">Age</th>
                            <th className="text-left py-2 font-semibold text-fashion-black">Height (in)</th>
                            <th className="text-left py-2 font-semibold text-fashion-black">Chest (in)</th>
                          </tr>
                        </thead>
                        <tbody className="text-gray-600">
                          <tr className="border-b border-stone-100">
                            <td className="py-2 font-medium">1</td>
                            <td className="py-2">2-3 years</td>
                            <td className="py-2">35-38</td>
                            <td className="py-2">20-21</td>
                          </tr>
                          <tr className="border-b border-stone-100">
                            <td className="py-2 font-medium">2</td>
                            <td className="py-2">4-5 years</td>
                            <td className="py-2">39-43</td>
                            <td className="py-2">22-23</td>
                          </tr>
                          <tr className="border-b border-stone-100">
                            <td className="py-2 font-medium">3</td>
                            <td className="py-2">6-7 years</td>
                            <td className="py-2">44-48</td>
                            <td className="py-2">24-25</td>
                          </tr>
                          <tr className="border-b border-stone-100">
                            <td className="py-2 font-medium">4</td>
                            <td className="py-2">8-9 years</td>
                            <td className="py-2">49-52</td>
                            <td className="py-2">26-27</td>
                          </tr>
                          <tr>
                            <td className="py-2 font-medium">5</td>
                            <td className="py-2">10-12 years</td>
                            <td className="py-2">53-58</td>
                            <td className="py-2">28-30</td>
                          </tr>
                        </tbody>
                      </table>
                      <p className="mt-4 text-xs text-gray-500 italic">
                        * Measurements are approximate and based on average child proportions. For best fit, please measure your child and contact us for guidance.
                      </p>
                    </div>
                  ) : isMenswear ? (
                    // Menswear Size Guide
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-stone-200">
                            <th className="text-left py-2 font-semibold text-fashion-black">Size</th>
                            <th className="text-left py-2 font-semibold text-fashion-black">Chest (in)</th>
                            <th className="text-left py-2 font-semibold text-fashion-black">Waist (in)</th>
                            <th className="text-left py-2 font-semibold text-fashion-black">Shoulder (in)</th>
                          </tr>
                        </thead>
                        <tbody className="text-gray-600">
                          <tr className="border-b border-stone-100">
                            <td className="py-2 font-medium">S</td>
                            <td className="py-2">36-38</td>
                            <td className="py-2">30-32</td>
                            <td className="py-2">17-17.5</td>
                          </tr>
                          <tr className="border-b border-stone-100">
                            <td className="py-2 font-medium">M</td>
                            <td className="py-2">38-40</td>
                            <td className="py-2">32-34</td>
                            <td className="py-2">17.5-18</td>
                          </tr>
                          <tr className="border-b border-stone-100">
                            <td className="py-2 font-medium">L</td>
                            <td className="py-2">40-42</td>
                            <td className="py-2">34-36</td>
                            <td className="py-2">18-18.5</td>
                          </tr>
                          <tr className="border-b border-stone-100">
                            <td className="py-2 font-medium">XL</td>
                            <td className="py-2">42-44</td>
                            <td className="py-2">36-38</td>
                            <td className="py-2">18.5-19</td>
                          </tr>
                          <tr>
                            <td className="py-2 font-medium">XXL</td>
                            <td className="py-2">44-46</td>
                            <td className="py-2">38-40</td>
                            <td className="py-2">19-19.5</td>
                          </tr>
                        </tbody>
                      </table>
                      <p className="mt-4 text-xs text-gray-500 italic">
                        * Measurements are approximate. For custom sizing and tailoring, please contact us with your specific measurements.
                      </p>
                    </div>
                  ) : (
                    // Women's/Adult Size Guide
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-stone-200">
                            <th className="text-left py-2 font-semibold text-fashion-black">Size</th>
                            <th className="text-left py-2 font-semibold text-fashion-black">Bust (in)</th>
                            <th className="text-left py-2 font-semibold text-fashion-black">Waist (in)</th>
                            <th className="text-left py-2 font-semibold text-fashion-black">Hip (in)</th>
                          </tr>
                        </thead>
                        <tbody className="text-gray-600">
                          <tr className="border-b border-stone-100">
                            <td className="py-2 font-medium">S</td>
                            <td className="py-2">32-34</td>
                            <td className="py-2">26-28</td>
                            <td className="py-2">34-36</td>
                          </tr>
                          <tr className="border-b border-stone-100">
                            <td className="py-2 font-medium">M</td>
                            <td className="py-2">34-36</td>
                            <td className="py-2">28-30</td>
                            <td className="py-2">36-38</td>
                          </tr>
                          <tr className="border-b border-stone-100">
                            <td className="py-2 font-medium">L</td>
                            <td className="py-2">36-38</td>
                            <td className="py-2">30-32</td>
                            <td className="py-2">38-40</td>
                          </tr>
                          <tr>
                            <td className="py-2 font-medium">XL</td>
                            <td className="py-2">38-40</td>
                            <td className="py-2">32-34</td>
                            <td className="py-2">40-42</td>
                          </tr>
                        </tbody>
                      </table>
                      <p className="mt-4 text-xs text-gray-500 italic">
                        * Measurements are approximate. For custom sizing, please contact us with your specific measurements.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* CTA row */}
            <div className="flex flex-col gap-6 mb-10">
              <button
                onClick={handleInquire}
                className="w-full px-10 py-4 rounded-full text-sm font-semibold border-2 border-fashion-gold bg-fashion-gold text-white hover:bg-transparent hover:text-fashion-gold transition-all duration-300 shadow-md hover:shadow-xl"
              >
                Request Information
              </button>

              {/* Back to Portfolio button */}
              <button
                onClick={handleBackToPortfolio}
                className="px-10 py-4 rounded-full text-sm font-medium border border-gray-300 text-gray-700 hover:border-fashion-gold hover:text-fashion-black transition"
              >
                ← Back to Portfolio
              </button>
            </div>

            {/* Info note */}
            <div className="text-xs text-gray-500 text-center">
              <p>Interested in this design? Contact us to discuss customization options, pricing, and availability.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}