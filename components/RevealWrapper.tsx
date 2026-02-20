"use client"

import { useEffect, useRef, ReactNode } from "react"

interface RevealWrapperProps {
  children: ReactNode
  className?: string
  index?: number
}

export default function RevealWrapper({
  children,
  className = "",
  index = 0,
}: RevealWrapperProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("scroll-elevated")
        } else {
          el.classList.remove("scroll-elevated")
        }
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -10% 0px",
      }
    )

    observer.observe(el)
    return () => observer.unobserve(el)
  }, [])

  return (
    <div
      ref={ref}
      className={`scroll-wrapper ${className}`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      {children}
    </div>
  )
}